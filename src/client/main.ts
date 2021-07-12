import Display from './display';
import Keyboard from './keyboard';
import Cpu from './cpu';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const display: Display = new Display({scale: 10, canvas: canvas, ctx: ctx});
const keyboard = new Keyboard();
//const fps = 60;

const cpu = new Cpu({
    display: display,
    keyboard: keyboard,
});

const loadExternalRom = async () => {
    return fetch("http://localhost:4000/api/rom")
        .then(data => data.json())
        .catch((e) => console.log("faild to fetch", `error: ${e}`));
}

const main = async () => {
    const rom = await loadExternalRom();
    cpu.loadRom(rom);
    display.testSprite();
    async function frame () {
        await cpu.cycle();
        display.draw();
        requestAnimationFrame(frame);
    }
    await frame();
}

main();
