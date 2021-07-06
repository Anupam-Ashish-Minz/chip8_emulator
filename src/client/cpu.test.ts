import CPU from './cpu';
import Display from './display';
import Keyboard from './keyboard';
import { canvas, ctx } from './main';

const display: Display = new Display({scale: 10, canvas: canvas, ctx: ctx});
const keyboard = new Keyboard();

const cpu = new CPU({
    display: display,
    keyboard: keyboard,
});


const drawSpriteZeroTest = () => {
    // draw sprite 0 instuctions -
    // put sprites in memory 
    // set I reg to memory address of sprite 0 (start address)
    // read the memory from the start loacation till n
    // draw the sprite in the screen
    const testRom = Uint8Array.from([
        0xA000,
        0xD005,
    ]);
    cpu.loadRom(testRom);
    //for (let opcode of testRom) {
    //    cpu.exec(opcode);
    //}
    cpu.cycle();
}

test('hello world test', () => {
    drawSpriteZeroTest();
    expect(1).toBe(1);
});
