import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/hello", () => "Hello World")
  .get('/product/:id', ({params: {id}})=> `Product ${id}`)
  .get('/user/*', () => 'User is here')
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
