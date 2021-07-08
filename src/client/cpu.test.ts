import Cpu from './cpu';

let cpu: Cpu;

beforeEach(()=>{
    cpu = new Cpu({});
});

it("1nnn", () => {
    const inst = 0x1512;
    cpu.exec(inst);
    expect(cpu.PC).toBe(0x512);
});

it("2nnn", () => {
    const inst = 0x2512;
    const prevSp = cpu.SP;
    const prevPc = cpu.PC;

    cpu.exec(inst);

    expect(prevPc).toBe(cpu.stack[cpu.SP]);
    expect(prevSp+1).toBe(cpu.SP);
    expect(cpu.PC).toBe(0x512);
});
