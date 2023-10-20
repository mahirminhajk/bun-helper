import { Elysia } from "elysia";
import plugin from "./plugin";

const app = new Elysia()
  .state("version", 1)
  .decorate("getDate", () => new Date().toLocaleDateString())
  .get("/", (context) => {
    return `${context.store.version} - ${context.getDate()}`;
  })
  .use(plugin)
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
