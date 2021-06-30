import Display from './display';
import Keyboard from './keyboard';

export default class CPU {
    memory: Uint8Array 
    Vx: Uint8Array
    I: number
    VF: number
    delayTime: number
    soundTime: number
    PC: number
    SP: number
    stack: Uint16Array

    constructor (display: Display, keyboard: Keyboard) {
        this.memory = new Uint8Array(4096);
        this.Vx     = new Uint8Array(16);
        this.I      = 0;
        this.PC     = 0x200;
        this.stack  = new Uint16Array(16).fill(0);
        this.SP     = 0;
    }
    readRom (rom: string) {

    }
}
