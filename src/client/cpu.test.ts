import Cpu from './cpu';
import Keyboard from './keyboard';
import Display from './display';
//import { createCanvas } from 'canvas';

let cpu: Cpu;

beforeEach(()=>{
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    cpu = new Cpu({
        display: new Display({scale: 10, canvas: canvas, ctx: ctx}),
        keyboard: new Keyboard(),
    });
});

it("1nnn", () => {
    const opcode = 0x1512;
    cpu.exec(opcode);
    expect(cpu.PC).toBe(0x512);
});

it("2nnn", () => {
    const opcode = 0x2512;
    const prevSp = cpu.SP;
    const prevPc = cpu.PC;
    cpu.exec(opcode);
    expect(prevPc).toBe(cpu.stack[cpu.SP]);
    expect(prevSp+1).toBe(cpu.SP);
    expect(cpu.PC).toBe(0x512);
});

it("3xkk", () => {
    const opcode = 0x3512;
    let prevPc = cpu.PC;
    cpu.V[5] = 0x12;
    cpu.exec(opcode);
    expect(prevPc + 2).toBe(cpu.PC);
    cpu.V[5] = 0x15;
    prevPc = cpu.PC;
    cpu.exec(opcode);
    expect(prevPc).toBe(cpu.PC);
});

it("4xkk", () => {
    const opcode = 0x4512;
    let prevPc = cpu.PC;
    cpu.V[5] = 0x12;
    cpu.exec(opcode);
    expect(prevPc).toBe(cpu.PC);
    cpu.V[5] = 0x15;
    prevPc = cpu.PC;
    cpu.exec(opcode);
    expect(prevPc + 2).toBe(cpu.PC);
});

it("5xy0", () => {
    let opcode = 0x5510;
    cpu.V[5] = 0x16;
    cpu.V[1] = 0x16;
    let prevPc = cpu.PC;
    cpu.exec(opcode);
    expect(prevPc + 2).toBe(cpu.PC);
    cpu.V[5] = 0x36;
    cpu.V[1] = 0x16;
    prevPc = cpu.PC;
    cpu.exec(opcode);
    expect(prevPc).toBe(cpu.PC);
});

it("6xkk", () => {
    let opcode = 0x6055;
    cpu.exec(opcode);
    expect(cpu.V[0]).toBe(0x55);
});

it("7xkk", () => {
    let opcode = 0x7055;
    cpu.V[0] = 0x33;
    cpu.exec(opcode);
    expect(cpu.V[0]).toBe(0x33 + 0x55);
});

it("8xy0", () => {
    let opcode = 0x8360;
    cpu.V[3] = 0x33;
    cpu.V[6] = 0x55;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe(0x55);
});

it("8xy1", () => {
    let opcode = 0x8361;
    cpu.V[3] = 0x33;
    cpu.V[6] = 0x55;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe(0x33 | 0x55);
});

it("8xy2", () => {
    let opcode = 0x8362;
    cpu.V[3] = 0x33;
    cpu.V[6] = 0x55;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe(0x33 & 0x55);
});

it("8xy3", () => {
    let opcode = 0x8363;
    cpu.V[3] = 0x33;
    cpu.V[6] = 0x55;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe(0x33 ^ 0x55);
});

it("8xy4", () => {
    let opcode = 0x8364;
    cpu.V[3] = 0x33;
    cpu.V[6] = 0x55;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe(0x33 + 0x55);
    expect(cpu.VF).toBe(0);
    cpu.V[3] = 0x88;
    cpu.V[6] = 0xA9;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe((0x88 + 0xA9) % 0x100);
    expect(cpu.VF).toBe(1);
});

it("8xy5", () => {
    let opcode = 0x8365;
    cpu.V[3] = 0x33;
    cpu.V[6] = 0x55;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe(0x100 - (0x55 - 0x33));
    expect(cpu.VF).toBe(0);
    opcode = 0x8635;
    cpu.V[3] = 0x33;
    cpu.V[6] = 0x55;
    cpu.exec(opcode);
    expect(cpu.V[6]).toBe(0x55 - 0x33);
    expect(cpu.VF).toBe(1);
});

it("8xy6", () => {
    let opcode = 0x8366;
    cpu.V[3] = 0x55;
    let lsb = 1; // 0x55 & 0x1
    cpu.exec(opcode);
    expect(cpu.VF).toBe(lsb);
    expect(cpu.V[3]).toBe(Math.floor(0x55 / 2));
    lsb = 0; // 0x55 & 0x1
    cpu.V[3] = 0x56;
    cpu.exec(opcode);
    expect(cpu.VF).toBe(lsb);
    expect(cpu.V[3]).toBe(Math.floor(0x56 / 2));
});

it("8xy7", () => {
    let opcode = 0x8367;
    cpu.V[3] = 0x33; // x
    cpu.V[6] = 0x55; // y
    cpu.exec(opcode);
    expect(cpu.V[3]).toBe(0x55 - 0x33); // y - x when y > x
    expect(cpu.VF).toBe(1); 
    opcode = 0x8637;
    cpu.V[3] = 0x33; // y
    cpu.V[6] = 0x55; // x
    cpu.exec(opcode);
    expect(cpu.V[6]).toBe(0x100 - (0x55 - 0x33)); // y - x when y < x
    expect(cpu.VF).toBe(0);
});

it("8xyE", () => {
    let opcode = 0x836E;
    cpu.V[3] = 0x55;
    let lsb = 1; // 0x55 & 0x1
    cpu.exec(opcode);
    expect(cpu.VF).toBe(lsb);
    expect(cpu.V[3]).toBe(0x55 * 2);
    cpu.V[3] = 0xA6;
    lsb = 0; // 0x56 & 0x1
    cpu.exec(opcode);
    expect(cpu.VF).toBe(lsb);
    expect(cpu.V[3]).toBe((0xA6 * 2) % 0x100);
});

it("9xy0", () => {
    let opcode = 0x9560;
    cpu.V[5] = 0x85;
    cpu.V[6] = 0x85;
    let prevPc = cpu.PC;
    cpu.exec(opcode);
    expect(cpu.PC).toBe(prevPc);
    cpu.V[5] = 0x85;
    cpu.V[6] = 0xAA;
    prevPc = cpu.PC;
    cpu.exec(opcode);
    expect(cpu.PC).toBe(prevPc + 2);
});

it("Annn", () => {
    let opcode = 0xA562;
    cpu.exec(opcode);
    expect(cpu.I).toBe(0x562);
});

it("Bnnn", () => {
    let opcode = 0xB522;
    cpu.V[0] = 0x12;
    cpu.exec(opcode);
    expect(cpu.PC).toBe(0x522 + 0x12);
});

it("Cxkk", () => {
    let opcode = 0xC30F;
    cpu.exec(opcode);
    expect(cpu.V[3]).toBeGreaterThanOrEqual(0x0);
    expect(cpu.V[3]).toBeLessThanOrEqual(0xF);
    opcode = 0xC3F0;
    cpu.exec(opcode);
    expect(cpu.V[3] >> 4).toBeGreaterThanOrEqual(0x00);
    expect(cpu.V[3] >> 4).toBeLessThanOrEqual(0xF);
    expect(cpu.V[3] & 0xF).toBe(0);
});

//it("Dxyn", () => {
//    // can't test draw calls
//});

//it("Ex9E", () => {
//    // can't test something to do with the keyboard
//});

//it("ExA1", () => {
//    // keboard
//});

it("Fx07", () => {
    let opcode = 0xF507;
    cpu.delayTimer = 0xE9;
    cpu.exec(opcode);
    expect(cpu.V[5]).toBe(0xE9);
});

//it("0xFA", () => {
//    // keboard
//});

it("Fx15", () => {
    let opcode = 0xF315;
    cpu.V[3] = 0x17;
    cpu.exec(opcode);
    expect(cpu.delayTimer).toBe(0x17);
});

it("Fx18", () => {
    let opcode = 0xFA18;
    cpu.V[0xA] = 0xAA;
    cpu.exec(opcode);
    expect(cpu.soundTimer).toBe(0xAA);
});

it("Fx1E", () => {
    let opcode = 0xF21E;
    cpu.I = 0x5;
    cpu.V[2] = 0xA5;
    cpu.exec(opcode);
    expect(cpu.I).toBe(0x5 + 0xA5);
});

it("Fx29", () => {
    let opcode = 0xF229;
    cpu.V[2] = 0x0;
    cpu.exec(opcode);
    expect(cpu.I).toBe(0x200);
});

it("Fx33", () => {
    let opcode = 0xF133;
    cpu.V[1] = 0xFF;
    cpu.exec(opcode);
    let bcd1 = Math.floor((0xFF % 1000) / 100);
    let bcd2 = Math.floor((0xFF % 100) / 10);
    let bcd3 = 0xFF % 10;
    expect(cpu.memory[cpu.I]).toBe(bcd1);
    expect(cpu.memory[cpu.I+1]).toBe(bcd2);
    expect(cpu.memory[cpu.I+2]).toBe(bcd3);
});

it("Fx55", () => {
    let opcode = 0xF355;
    cpu.V[0] = 0x11;
    cpu.V[1] = 0x12;
    cpu.V[2] = 0x13;
    cpu.V[3] = 0x14;
    cpu.I = 0x5AB;
    cpu.exec(opcode);
    expect(cpu.memory[0x5AB]).toBe(0x11);
    expect(cpu.memory[0x5AC]).toBe(0x12);
    expect(cpu.memory[0x5AD]).toBe(0x13);
    expect(cpu.memory[0x5AE]).toBe(0x14);
});

it("Fx65", () => {
    let opcode = 0xF365;
    cpu.I = 0x5AB;
    cpu.memory[0x5AB] = 0x11;
    cpu.memory[0x5AC] = 0x12;
    cpu.memory[0x5AD] = 0x13;
    cpu.memory[0x5AE] = 0x14;
    cpu.exec(opcode);
    expect(cpu.V[0]).toBe(0x11);
    expect(cpu.V[1]).toBe(0x12);
    expect(cpu.V[2]).toBe(0x13);
    expect(cpu.V[3]).toBe(0x14);
});
