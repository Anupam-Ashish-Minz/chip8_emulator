import Display from './display';
import CPU from './cpu';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const renderer = canvas && ctx && 
    new Display({scale: 10, canvas: canvas, ctx: ctx});

//renderer?.testRender();
