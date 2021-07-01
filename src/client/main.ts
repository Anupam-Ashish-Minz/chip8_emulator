import Display from './display';
import Keyboard from './keyboard';
import CPU from './cpu';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

fetch("http://localhost:4000/api/rom")
    .then(data => data.json())
    .then(data => {
        const rom = Uint8Array.from(data);
        main(rom);
    })
    .catch((e) => console.log("faild to fetch", `error: ${e}`));

function main (rom: Uint8Array) {
    if (canvas && ctx) {
        const display: Display = new Display({scale: 10, canvas: canvas, ctx: ctx});
        const keyboard = new Keyboard();

        const cpu = new CPU({
            display: display,
            keyboard: keyboard,
        });

        console.log(cpu);
        console.log(rom);
    }
}
