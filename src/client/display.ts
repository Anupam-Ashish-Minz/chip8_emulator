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
        this.ctx.clearRect(0, 0, this.cols, this.rows);
        this.ctx.fillStyle = "#aaa";
    }
    setSprite(x: number, y: number, spriteData: Uint8Array): number {
        let i = 0;
        let j = 0;
        let vf = 0;
        for (const byteRow of spriteData) {
            const getNbitArray = (n: number,b=32) => [...Array(b)].map((_,i)=>(n>>i)&1).reverse();
            const bitsArray = getNbitArray((byteRow >> 4), 4);
            for (const bit of bitsArray) {
                const pixel = bit;
                const pixelLoc = ((x + i) % this.cols) + (((y + j) % this.rows) * this.cols);
                if (i === 3) {
                    i = 0;
                    j += 1;
                } else {
                    i += 1;
                }
                if (this.displayBuffer[pixelLoc] === 1 && pixel === 1) {
                    vf = 1;
                }
                this.displayBuffer[pixelLoc] ^= pixel;
            }
        }
        return vf;
    }
    setPixel (x: number, y: number): number {
        x = (this.cols + x) % this.cols; // rounding, out of bounds
        y = (this.rows + y) % this.rows; // rounding 
        const pixelLocation = x + (y * this.cols);
        this.displayBuffer[pixelLocation] ^= 1;
        return this.displayBuffer[pixelLocation] ^ 1
    }
    clearBuffer () {
        this.displayBuffer = this.displayBuffer.fill(0);
    }
    clearScreen () {
        this.ctx.clearRect(0, 0, this.cols * this.scale, this.rows * this.scale);
    }
    draw () {
        this.clearScreen();
        for (let i = 0; i < this.cols * this.rows; i++) {
            if (this.displayBuffer[i] === 1) {
                const x = i % this.cols;
                const y = Math.floor(i / this.cols);
                this.ctx.fillRect(x*this.scale, y*this.scale, this.scale, this.scale);
            }
        }
    }
    testRender () {
        this.setPixel(0, 0);
        this.setPixel(5, 2);
        this.draw();
    }
    testSprite () {
        const sprite0 = Uint8Array.from([ 0xF0, 0x90, 0x90, 0x90, 0xF0 ]);
        this.setSprite(0, 0, sprite0);
        this.draw();

        const sprite2 = Uint8Array.from([ 0xF0, 0x10, 0xF0, 0x80, 0xF0 ]);
        this.setSprite(0, 0, sprite2);
        this.draw();
    }
}
