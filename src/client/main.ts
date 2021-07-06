import Display from './display';
import Keyboard from './keyboard';
import CPU from './cpu';

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const display: Display = new Display({scale: 10, canvas: canvas, ctx: ctx});
const keyboard = new Keyboard();

const cpu = new CPU({
    display: display,
    keyboard: keyboard,
});


export const start = (rom: Uint8Array) => {
    cpu.loadRom(rom);
    cpu.cycle();
}

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
    //cpu.loadRom(testRom);
    for (let opcode of testRom) {
        //console.log(opcode);
        cpu.exec(opcode);
    }
    //cpu.cycle();
}

const main = () => {
    //fetch("http://localhost:4000/api/rom")
    //    .then(data => data.json())
    //    .then(rom => {
    //        start(Uint8Array.from(rom));
    //    })
    //    .catch((e) => console.log("faild to fetch", `error: ${e}`));
    drawSpriteZeroTest();
}

main();
