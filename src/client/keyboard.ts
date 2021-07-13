export default class Keyboard {
    keymap: {[key: string]: number}
    isKeyDown: {[key: number]: boolean}

    constructor () {
        this.keymap = {
            '0': 0x0, // 0
            '1': 0x1, // 1
            '2': 0x2, // 2
            '3': 0x3, // 3
            '4': 0x4, // 4
            '5': 0x5, // 5
            '6': 0x6, // 6
            '7': 0x7, // 7
            '8': 0x8, // 8
            '9': 0x9, // 9
            'a': 0xA, // A
            'b': 0xB, // B
            'c': 0xC, // C
            'd': 0xD, // D
            'e': 0xE, // E
            'f': 0xF, // F
        };
        this.isKeyDown = {
            0x0: false, 
            0x1: false, 
            0x2: false, 
            0x3: false, 
            0x4: false, 
            0x5: false, 
            0x6: false, 
            0x7: false, 
            0x8: false, 
            0x9: false, 
            0xA: false, 
            0xB: false, 
            0xC: false, 
            0xD: false, 
            0xE: false, 
            0xF: false, 
        };
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            this.isKeyDown[this.keymap[event.key]] = true;
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            this.isKeyDown[this.keymap[event.key]] = false;
        });
        const buttonKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];
        for (let buttonKey of buttonKeys) {
            const element = document.getElementById(`button${buttonKey}`);
            element?.addEventListener('click', () => {
                this.isKeyDown[this.keymap[buttonKey]] = !this.isKeyDown[this.keymap[buttonKey]];
            });
        }
    }
    getKeyPress (): Promise<number> {
        return new Promise((resolve) => {
            window.onkeydown = (event: KeyboardEvent) => {
                resolve(this.keymap[event.key]);
            }
        });
    }
}
