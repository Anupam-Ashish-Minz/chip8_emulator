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
    exec (opcode: any) {
        const firstNibble = opcode & 0xF000;
        const nnn = opcode & 0x0FFF;
        const kk = opcode & 0x00FF;
        const x = opcode & 0x0F00 >> 8;
        const y = opcode & 0x00F0 >> 4;
        const lastNibble  = opcode & 0x000F;

        switch(firstNibble) {
            case 0x0000:
                switch (opcode) {
                    case 0x00E0:
                        this.display.clear;
                    break;
                    case 0x00E0:
                        this.stack.pop();
                    break;
                    default:
                    // TODO SYS
                }
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
        if (lastNibble === 1) {
            this.V[x] = this.V[y];
        } else if (lastNibble === 0x2) {
            this.V[x] = this.V[x] & this.V[y];
        } else if (lastNibble === 0x3) {
            this.V[x] = this.V[x] ^ this.V[y];
        } else if (lastNibble === 0x4) {
            const res = this.V[x] + this.V[y];
            this.VF = 0;
            if (res > 255) {
                this.VF = 1;
            }
            this.V[x] = res;
        } else if (lastNibble === 0x5) {
            if (this.V[x] > this.V[y]) {
                this.VF = 1; 
            } else {
                this.VF = 0;
            }
            this.V[x] -= this.V[y];
        } else if (lastNibble === 0x6) {
            this.VF = this.V[x] & 1; // least significant bit
            this.V[x] = this.V[x] >> 1; 
        } else if (lastNibble === 0x7) {
            if (this.V[y] > this.V[x]) {
                this.VF = 1;
            } else {
                this.VF = 0;
            }
            this.V[x] = this.V[y] - this.V[x];
        } else if (lastNibble === 0xE) {
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
            if (kk === 0x9E) {
                if (this.V[x] === this.keyboard.downkey) {
                }
            }
        break;
        case 0xF000:
            // TODO keyboard
        break;
        }
    }
}
