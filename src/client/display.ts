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
    setSprite(x: number, y: number, n: number, spriteData: Uint8Array): number {
        const width = 8;
        const height = n;
        const createBitArray = (num: number,b=32) => [...Array(b)].map((_,i)=>(num>>i)&1).reverse();

        const bitStreamSpriteData = Array.from(spriteData).map((x: any) => createBitArray(x, width)).flat();

        for (let i=0; i<height; i++) {
            for (let j=0; j<width; j++) {
                if (bitStreamSpriteData[j + i * width] === 1) {
                    this.setPixel(x + j, y + i);
                }
            }
        }
        return 0;
    }
    setPixel (x: number, y: number): number {
        if (x > this.cols) {
            x -= this.cols;
        } else if (x < 0) {
            x += this.cols;
        }
        
        if (y > this.rows) {
            y -= this.rows;
        } else if (y < 0) {
            y += this.rows;
        }

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
        this.setSprite(0, 0, 5, sprite0);

        const sprite2 = Uint8Array.from([ 0xF0, 0x10, 0xF0, 0x80, 0xF0 ]);
        this.setSprite(5, 0, 5, sprite2);
    }
    drawBoard() {
      const bw = this.canvas.width;
      const bh = this.canvas.height;
      const p = 0;
      for (var x = 0; x <= bw; x += this.scale) {
          this.ctx.moveTo(0.5 + x + p, p);
          this.ctx.lineTo(0.5 + x + p, bh + p);
      }

      for (var x = 0; x <= bh; x += this.scale) {
          this.ctx.moveTo(p, 0.5 + x + p);
          this.ctx.lineTo(bw + p, 0.5 + x + p);
      }
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();
    }
}
