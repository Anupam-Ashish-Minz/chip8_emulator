export default class Keyboard {
    keymap: {[key: string]: number}
    downkey: number

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
        this.downkey = -1;
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            this.downkey = this.keymap[event.key];
            console.log(this.downkey);
        });
    }
}

