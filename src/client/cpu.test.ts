import Cpu from './cpu';

let cpu: Cpu;

beforeEach(()=>{
    cpu = new Cpu({});
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
