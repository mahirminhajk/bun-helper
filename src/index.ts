import { Elysia, t } from "elysia";
import { configPlugin, plugin } from "./plugin";

interface Body {
  name: string;
  age: number;
  file: File;
  files: File[];
}

interface Params {
  id: number;
}

//! called method chaining
const app = new Elysia()
  .state("version", 1)
  .decorate("getDate", () => new Date().toLocaleDateString())
  .get(
    "/",
    (context) => {
      return `${context.store.version} - ${context.getDate()}`;
    },
    {
      beforeHandle: () => console.log("before handle"),
      afterHandle: () => console.log("after handle"),
    }
  )
  .post("/create", ({ body }: { body: Body }) => body, {
    body: t.Object({
      name: t.String(),
      age: t.Number(),
      file: t.File({
        maxSize: 1024 * 1024 * 10,
        minSize: 0,
        types: ["image/png", "image/jpeg", "image/gif"],
      }),
      files: t.Files({
        maxSize: 1024 * 1024 * 10,
        types: ["image/png", "image/jpeg", "image/gif", "video/mp4"],
        maxItems: 10,
        minItems: 1,
      }),
    }),
  })
  .get("/id/:id", ({ params: { id } }: { params: Params }) => id, {
    params: t.Object({
      id: t.Number(),
    }),
    transform({ params }) {
      const id = +params.id;

      if (!Number.isNaN(id)) params.id = id;
    },
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
  .on("request", () => console.log("we got a request"))
  .listen(5000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
