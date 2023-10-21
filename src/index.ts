import { Elysia } from "elysia";
import { configPlugin, plugin } from "./plugin";

const app = new Elysia()
  .state("version", 1)
  .decorate("getDate", () => new Date().toLocaleDateString())
  .get("/", (context) => {
    return `${context.store.version} - ${context.getDate()}`;
  }, {
    beforeHandle:() => console.log('before handle'),
    afterHandle:() => console.log('after handle'),
  })
  .use(plugin)
  .use(configPlugin({ prefix: "/v2" }))
  .group("/api", (app) =>
    app
      .get("/", () => "Hello")
      .post("/sign-in", () => "sing-in")
      .post("/sign-up", () => "Sign-up")
      .post("/profile", () => "Profile")
  )
  .on('request', () => console.log('we got a request'))
  .listen(5000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
