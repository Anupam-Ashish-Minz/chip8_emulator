import { start } from './main';

const main = () => {
    const rom = Uint8Array.from("asoetnuh");
    start(Uint8Array.from(rom));
}

test('first test', ()=>{
    main();
    expect(1).toBe(1);
});
