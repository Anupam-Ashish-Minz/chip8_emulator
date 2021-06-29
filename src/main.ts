import Renderer from './renderer';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const renderer = canvas && ctx && 
    new Renderer({scale: 10, canvas: canvas, ctx: ctx});

renderer?.testRender();
