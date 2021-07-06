export interface RendererParams {
    scale: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
}

export default class Display {
    cols: number;
    rows: number;
    scale: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    displayBuffer: Uint8Array

    constructor ({ scale, canvas, ctx }: RendererParams) {
        this.cols = 64;
        this.rows = 32;
        this.scale = scale;
        this.canvas = canvas;
        this.canvas.width = this.cols * this.scale;
        this.canvas.height = this.rows * this.scale;
        this.displayBuffer = new Uint8Array(this.cols * this.rows).fill(0);
        this.ctx = ctx;
    }
    setPixel (x: number, y: number) {
        x = (this.cols + x) % this.cols;
        y = (this.rows + y) % this.rows;
        const pixelLocation = x + (y * this.cols);
        this.displayBuffer[pixelLocation] ^= 1;
    }
    clear () {
        this.displayBuffer = this.displayBuffer.fill(0);
        this.draw();
    }
    draw () {
        this.ctx.clearRect(0, 0, this.cols, this.rows);
        this.ctx.fillStyle = "#aaa";
        for (let i = 0; i < this.cols * this.rows; i++) {
            if (this.displayBuffer[i] === 1) {
                const x = i % this.cols;
                const y = Math.floor(i / this.cols);
                //console.log(x, y);
                this.ctx.fillRect(x*this.scale, y*this.scale, this.scale, this.scale);
            }
        }
    }
    testRender () {
        this.setPixel(0, 0);
        this.setPixel(5, 2);
        this.draw();
    }
}

