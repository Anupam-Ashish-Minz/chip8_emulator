import { Application } from "https://deno.land/x/abc@v1.3.3/mod.ts";
import { abcCors} from "https://deno.land/x/cors/mod.ts";

const app = new Application();
const port = 4000;

console.log(`http://localhost:${port}/`);

app.get("/api/rom", (req) => {
  const rom = Deno.readFileSync("src/server/rom/BLITZ");
  return Array.from(rom);
});

app
  .get("/", (c) => {
    return "hello from the server";
  })

app
  .use(abcCors())
  .start({ port: 4000 });
