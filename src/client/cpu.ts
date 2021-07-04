import Display from './display';
import Keyboard from './keyboard';

interface cpuInterface {
    display: Display,
    keyboard: Keyboard,
}

export default class CPU {
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
    display: Display
    keyboard: Keyboard

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
    cycle () {
        for (let i = 0; i <= 0xFFF; i++) {
            if (i >= 0x200 && i <= 0xFFF) {
                // opcode is 2bytes in length
                const opcode = this.memory[i] << 8 | this.memory[i+1];
                i += 1;
                this.exec(opcode);
            }
        };
    }
    async exec (opcode: any) {
        const firstNibble = opcode & 0xF000; // don't perform bitshift on this one - see switch cases for clarification
        const nnn = opcode & 0x0FFF; // last tree nibble
        const kk = opcode & 0x00FF; // last two nibbles
        const x = opcode & 0x0F00 >> 8; // third last nibble
        const y = opcode & 0x00F0 >> 4; // second last nibble
        const n = opcode & 0x000F; // last nibble

        switch(firstNibble) {
            case 0x0000:
                if (opcode === 0x00E0) {
                    this.display.clear;
                } else if (opcode === 0x00EE) {
                    let stackValue = this.stack.pop();
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
        if (n === 1) {
            this.V[x] = this.V[y];
        } else if (n === 0x2) {
            this.V[x] = this.V[x] & this.V[y];
        } else if (n === 0x3) {
            this.V[x] = this.V[x] ^ this.V[y];
        } else if (n === 0x4) {
            const res = this.V[x] + this.V[y];
            this.VF = 0;
            if (res > 255) {
                this.VF = 1;
            }
            this.V[x] = res;
        } else if (n === 0x5) {
            if (this.V[x] > this.V[y]) {
                this.VF = 1; 
            } else {
                this.VF = 0;
            }
            this.V[x] -= this.V[y];
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
            this.V[x] = Math.floor(Math.random() * 1000) % 255 & kk;
        break;
        case 0xD000:
            // TODO display
        break;
        case 0xE000:
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
                this.V[x] = await this.keyboard.getKeyPress();
            } else if (kk === 0x15) {
                this.delayTimer = this.V[x];
            } else if (kk === 0x18) {
                this.soundTimer = this.V[x];
            } else if (kk === 0x29) {
                this.I += this.V[x];
            } else if (kk === 0x33) {
                // TODO Store BCD representation of Vx in memory locations I, I+1, and I+2.
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
