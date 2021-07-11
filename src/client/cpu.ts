import Display from './display';
import Keyboard from './keyboard';

interface cpuInterface {
    display?: Display,
    keyboard?: Keyboard,
}

export default class Cpu {
    memory: Uint8Array 
    V: Uint8Array
    I: number
    VF: number 
    delayTimer: number
    soundTimer: number
    PC: number
    SP: number
    stack: Array<number>
    rom: Set<string>
    display?: Display
    keyboard?: Keyboard

    constructor ({display, keyboard}: cpuInterface) {
        this.memory = new Uint8Array(4096);
        this.V = new Uint8Array(16);
        this.I = 0;
        this.VF = 0;
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.VF = 0;
        this.PC = 0x200;
        this.stack = new Array();
        this.SP = -1;
        this.rom = new Set();
        this.display = display;
        this.keyboard = keyboard

        this.loadSprites();
    }
    loadSprites () {
        const sprite = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0 
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80, // F
        ];
        // see specifications - memory start address is 0x200
        for (let i=0; i<0x200; i++) {
            this.memory[i] = sprite[i];
        }
    }
    loadRom (rom: Uint8Array) {
        try {
            rom.forEach((bit, i) => {
                this.memory[0x200 + i] = bit;
            });
            console.log("loading rom successful");
        } catch (e) {
            console.error("memory is full unable to load rom", e);
        }
    }
    async cycle () {
        // opcode is 2 bytes in length
        const opcode = (this.memory[this.PC] << 8) | this.memory[this.PC+1];
        this.PC += 2;
        await this.exec(opcode);
    }
    async exec (opcode: number) {
        const firstNibble = opcode & 0xF000; // don't perform bitshift on this one - see switch cases for clarification
        const nnn = opcode & 0x0FFF; // last tree nibble
        const kk = opcode & 0x00FF; // last two nibbles
        const x = (opcode & 0x0F00) >> 8; // third last nibble
        const y = (opcode & 0x00F0) >> 4; // second last nibble
        const n = opcode & 0x000F; // last nibble

        switch(firstNibble) {
            case 0x0000:
                if (opcode === 0x00E0) {
                    if (!this.display) {
                        throw "initilize the display";
                    } else {
                        this.display.clear;
                    }
                } else if (opcode === 0x00EE) {
                    let stackValue = this.stack.pop();
                    this.SP -= 1;
                    this.PC = stackValue ? stackValue : 0;
                }
                // SYS addr - only used by older chip8 computers so this can be safely ignored
            break;
            case 0x1000:
                this.PC = nnn;
            break;
            case 0x2000:
                this.SP += 1;
                this.stack[this.SP] = this.PC;
                this.PC = nnn;
            break;
            case 0x3000:
                if (this.V[x] === kk) {
                    this.PC += 2;
                }
            break;
            case 0x4000:
                if (this.V[x] != kk) {
                    this.PC += 2;
                }
            break;
            case 0x5000:
                if (this.V[x] === this.V[y]) {
                    this.PC += 2;
                }
            break;
            case 0x6000:
                this.V[x] = kk;
            break;
            case 0x7000:
                this.V[x] += kk;
            break;

        case 0x8000:
        if (n === 0x0) {
            this.V[x] = this.V[y];
        } else if (n === 0x1) {
            this.V[x] = this.V[x] | this.V[y];
        } else if (n === 0x2) {
            this.V[x] = this.V[x] & this.V[y];
        } else if (n === 0x3) {
            this.V[x] = this.V[x] ^ this.V[y];
        } else if (n === 0x4) {
            if ((this.V[x] + this.V[y]) > 255) {
                this.VF = 1;
            } else {
                this.VF = 0;
            }
            this.V[x] += this.V[y]; // overflow in handled by Uint8Array
        } else if (n === 0x5) {
            if (this.V[x] > this.V[y]) {
                this.VF = 1; 
            } else {
                this.VF = 0;
            }
            this.V[x] -= this.V[y]; // underflow is handled by Uint8Array
        } else if (n === 0x6) {
            this.VF = this.V[x] & 1; // least significant bit
            this.V[x] = this.V[x] >> 1; 
        } else if (n === 0x7) {
            if (this.V[y] > this.V[x]) {
                this.VF = 1;
            } else {
                this.VF = 0;
            }
            this.V[x] = this.V[y] - this.V[x];
        } else if (n === 0xE) {
            this.VF = this.V[x] & 1; // least significant bit
            this.V[x] = this.V[x] << 1;
        }
        break;
        case 0x9000:
        if (this.V[x] != this.V[y]) {
            this.PC += 2;
        }
        break;
        case 0xA000:
            this.I = nnn;
        break;
        case 0xB000:
            this.PC = nnn + this.V[0];
        break;
        case 0xC000:
            this.V[x] = (Math.floor(Math.random() * 1000) % 0x100) & kk;
        break;
        case 0xD000:
            const spriteData = this.memory.slice(this.I, this.I + n);
            let spriteRowIdx = 0;
            let spriteColumnIdx = 0;

            for (const spriteRow of spriteData) {
                const byteStr = ((spriteRow & 0xF0) >> 4).toString(2);
                for (const bitStr of byteStr) {
                    const bit = parseInt(bitStr);
                    if (bit === 1) {
                        if (!this.display) {
                            throw "initilize the display"
                        }
                        this.display.setPixel(this.V[x] + spriteColumnIdx, this.V[y] + spriteRowIdx);
                    }
                    spriteColumnIdx += 1;
                    if (spriteColumnIdx === 4) {
                        spriteRowIdx += 1;
                        spriteColumnIdx = 0;
                    }
                }
            }
        break;
        case 0xE000:
            if (!this.keyboard) {
                throw "initilize the keyboard first";
            }
            if (kk === 0x9E && this.keyboard.isKeyDown[this.V[x]]) {
                this.PC += 2;
            } else if (kk === 0xA1 && !this.keyboard.isKeyDown[this.V[x]]) {
                this.PC += 2;
            }
        break;
        case 0xF000:
            if (kk === 0x07) {
                this.V[x] = this.delayTimer;
            } else if (kk === 0x0A) {
                if (!this.keyboard) {
                    throw "initlize the keyboard first"
                }
                this.V[x] = await this.keyboard.getKeyPress();
            } else if (kk === 0x15) {
                this.delayTimer = this.V[x];
            } else if (kk === 0x18) {
                this.soundTimer = this.V[x];
            } else if (kk === 0x1E) {
                this.I += this.V[x]; // no overflow I in a 16-bit register
                if (this.I > 0xFFFF) {
                    throw "the I register is 16 bit and the value in it exceeds that";
                }
            } else if (kk === 0x29) {
                // 0x200 - start address, 5 - byte size of each sprite
                this.I = 0x200 + (5 * this.V[x]);
            } else if (kk === 0x33) {
                this.memory[this.I] = Math.floor((this.V[x] % 1000) / 100);
                this.memory[this.I+1] = Math.floor((this.V[x] % 100) / 10);
                this.memory[this.I+2] = this.V[x] % 10;
            } else if (kk === 0x55) {
                for (let i = 0; i < x+1; i++) {
                    this.memory[this.I+i] = this.V[i];
                }
            } else if(kk === 0x65) {
                for (let i = 0; i < x+1; i++) {
                    this.V[i] = this.memory[this.I+i]
                }
            }
        break;
        }
    }
}
