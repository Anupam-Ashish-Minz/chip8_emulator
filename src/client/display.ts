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
        const width = 8;
        const height = spriteData.length;

        // 0x80 = 10000000
        // take right most bit of the rows and shift all bits left 
        // set pixel if bit is 1
        for (let i=0; i<height; i++) {
            let spriteRow = spriteData[i];
            for (let j=0; j<width; j++) {
                if ((spriteRow & 0x80) > 0) {
                    this.setPixel(x + j, y + i);
                }
                spriteRow = spriteRow << 1;
            }
        }
        return 0;
    }

    setPixel (x: number, y: number): number {
        // rollover 
        x = Math.abs(x) % this.cols;
        y = Math.abs(y) % this.rows;

        let pixelLoc = x + (y * this.cols);

        this.displayBuffer[pixelLoc] ^= 1;

        return this.displayBuffer[pixelLoc] === 0 ? 1 : 0;
    }

    clearBuffer () {
        this.displayBuffer = this.displayBuffer.fill(0);
    }

    clearScreen () {
        this.ctx.clearRect(0, 0, this.cols * this.scale, this.rows * this.scale);
    }

    draw () {
        this.clearScreen();
        this.drawBoard();
        for (let i = 0; i < this.cols * this.rows; i++) {
            if (this.displayBuffer[i] === 1) {
                const x = (i % this.cols) * this.scale;
                const y = (Math.floor(i / this.cols)) * this.scale;
                this.ctx.fillRect(x, y, this.scale, this.scale);
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

        const sprite2 = Uint8Array.from([ 0xF0, 0x10, 0xF0, 0x80, 0xF0 ]);
        this.setSprite(70, 0, sprite2);
    }

    drawBoard() {
        // I don't know what 0.5 is doing here
        const bw = this.canvas.width;
        const bh = this.canvas.height;
        const p = 0;
        for (let x = 0; x <= bw; x += this.scale) {
            this.ctx.moveTo(0.5 + x + p, p);
            this.ctx.lineTo(0.5 + x + p, bh + p);
        }

        for (let x = 0; x <= bh; x += this.scale) {
            this.ctx.moveTo(p, 0.5 + x + p);
            this.ctx.lineTo(bw + p, 0.5 + x + p);
        }
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }
}
