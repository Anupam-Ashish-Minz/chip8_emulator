import Display from './display';
import Keyboard from './keyboard';

interface cpuInterface {
    display: Display,
    keyboard: Keyboard,
}

export default class CPU {
    memory: Uint8Array 
    Vx: Uint8Array
    I: number
    VF: number
    delayTimer: number
    soundTimer: number
    PC: number
    SP: number
    stack: Uint16Array
    rom: Set<string>
    display: Display
    keyboard: Keyboard

    constructor ({display, keyboard}: cpuInterface) {
        this.memory = new Uint8Array(4096);
        this.Vx = new Uint8Array(16);
        this.I = 0;
        this.VF = 0;
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.VF = 0;
        this.PC = 0x200;
        this.stack = new Uint16Array(16).fill(0);
        this.SP = 0;
        this.rom = new Set();
        this.display = display;
        this.keyboard = keyboard
    }
    readRom (rom: string) {
    }
}
