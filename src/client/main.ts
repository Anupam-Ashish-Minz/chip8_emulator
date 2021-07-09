import Display from './display';
import Keyboard from './keyboard';
import Cpu from './cpu';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const display: Display = new Display({scale: 10, canvas: canvas, ctx: ctx});
const keyboard = new Keyboard();

const cpu = new Cpu({
    display: display,
    keyboard: keyboard,
});


const start = (rom: Uint8Array) => {
    cpu.loadRom(rom);
    cpu.cycle();
}

const test1 = () => {
    const testRom = Uint8Array.from([
        0xA0, 0x00,
        0xD0, 0x05,
    ]);
    start(testRom);
}

//const loadExternalRom = () => {
//    fetch("http://localhost:4000/api/rom")
//        .then(data => data.json())
//        .then(rom => {
//            start(Uint8Array.from(rom));
//        })
//        .catch((e) => console.log("faild to fetch", `error: ${e}`));
//}

const main = () => {
    test1();
}

main();
