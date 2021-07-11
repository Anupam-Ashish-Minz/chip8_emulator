import Display from './display';
import Cpu from './cpu';

let canvas: HTMLCanvasElement; 
let ctx: CanvasRenderingContext2D; 
let display: Display; 
let cpu: Cpu; 

beforeEach(()=>{
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    display = new Display({
        canvas: canvas,
        scale: 10,
        ctx: ctx,
    });
    cpu = new Cpu({
        display: display,
    });
});

it("test test pixels", () => {
    display.testRender();
    let mockBuffer = new Uint8Array(2048).fill(0);
    mockBuffer[0] = 1;
    mockBuffer[133] = 1;
    expect(display.displayBuffer).toEqual(mockBuffer);
});

it("draw sprite 0", () => {
    const drawSpriteZeroTest = () => {
        // draw sprite 0 instuctions -
        // put sprites in memory 
        // set I reg to memory address of sprite 0 (start address)
        // read the memory from the start loacation till n
        // draw the sprite in the screen
        const testRom = [
            0xA000,
            0xD005,
        ];
        for (let opcode of testRom) {
            //console.log(opcode);
            cpu.exec(opcode);
        }
        //cpu.cycle();
    }
    drawSpriteZeroTest();

    expect(display.displayBuffer[0]).toBe(1);
    expect(display.displayBuffer[1]).toBe(1);
    expect(display.displayBuffer[2]).toBe(1);
    expect(display.displayBuffer[3]).toBe(1);

    expect(display.displayBuffer[0 + 64]).toBe(1);
    expect(display.displayBuffer[3 + 64]).toBe(1);

    expect(display.displayBuffer[0 + 128]).toBe(1);
    expect(display.displayBuffer[3 + 128]).toBe(1);

    expect(display.displayBuffer[0 + 192]).toBe(1);
    expect(display.displayBuffer[3 + 192]).toBe(1);

    expect(display.displayBuffer[0 + 256]).toBe(1);
    expect(display.displayBuffer[1 + 256]).toBe(1);
    expect(display.displayBuffer[2 + 256]).toBe(1);
    expect(display.displayBuffer[3 + 256]).toBe(1);
});

