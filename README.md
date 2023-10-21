# Bun

## Development

To start the development server run:

```bash
bun run dev
```

## Quick Start

```javascript
import { Elysia } from "elysia";

const app = new Elysia().listen(3000);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
```

## Routing

```javascript
const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/hello", () => "Hello World")
  .get("/product/:id", ({ params: { id } }) => `Product ${id}`)
  .get("/user/*", () => "User is here")
  .listen(5000);
```

## Handler

### Context

```javascript
app.post("/id/:id", (context) => {
  const body = context.body;
  const id = context.params.id;
  const query = context.query;
  const store = context.store;

  context.set.status = 201;
  return { id, body, query, store };
});
```

### Response

```javascript
return new Response(JSON.stringify({ body, id, query, store }), {
  headers: { "Content-Type": "application/json" },
});
```

## State and Decorate

```javascript
const app = new Elysia()
  .state("version", 1)
  .decorate("getDate", () => new Date().toLocaleDateString())
  .get("/", (context) => {
    return `${context.store.version} - ${context.getDate()}`;
  });
```

## Plugin

plugin.ts

```javascript
import { Elysia } from "elysia";

const plugin = new Elysia()
  .state("plugin-version", 1)
  .get("/plugin", (context) => {
    return `Plugin version: ${context.store["plugin-version"]}`;
  });

export default plugin;
```

index.ts

```javascript
import { Elysia } from "elysia";
import plugin from "./plugin";

const app = new Elysia().use(plugin).listen(5000);
```

### Plugin with a prefix

plugin.ts

````javascript
```javascript
export const configPlugin = <Prefix extends string | undefined>({ prefix = "/v1" }: { prefix: Prefix }) =>
  new Elysia({ prefix }).get(`/hi`, () => "Hi");
````

index.ts

```javascript
.use(configPlugin({ prefix: "/v2" }))
```

### Official Plugins(middleware)

https://elysiajs.com/plugins/overview.html

## Group

```javascript
.group("/api", (app) =>
  app
    .get("/", () => "Hello")
    .post("/sign-in", () => "sing-in")
    .post("/sign-up", () => "Sign-up")
    .post("/profile", () => "Profile")
)
```

### nested group

```javascript
app.group("/v1", (app) =>
  app
    .get("/", () => "Using v1")
    .group("/user", (app) =>
      app
        .post("/sign-in", signIn)
        .post("/sign-up", signUp)
        .post("/profile", getProfile)
    )
);
```

## Hook

### Global Hook

> we can access the context in the hook

````javascript
```javascript
.onRequest(()=>console.log("we got a request"))
````

or

```javascript
.on('request', () => console.log('we got a request'))
```

### Route Hook(Local Hook)

```javascript
.get("/", (context) => {
    return `${context.store.version} - ${context.getDate()}`;
  }, {
    beforeHandle:() => console.log('before handle'),
    afterHandle:() => console.log('after handle'),
  }
)
```

output

```bash
before handle
after handle
```

### Local Schema Hook

```javascript
import { Elysia, t } from "elysia";

interface Body {
  name: string;
  age: number;
}

app.post("/create", ({ body }: { body: Body }) => body, {
  body: t.Object({
    name: t.String(),
    age: t.Number(),
  }),
});
```

### Multiple Status Response

> if the status is 200, the response will be the body which have username and password, or if the status is 400, the response will be a string(error message)

```javascript
new Elysia().post("/", ({ body }) => doSomething(), {
  response: {
    200: t.Object({
      username: t.String(),
      password: t.String(),
    }),
    400: t.String(),
  },
});
```

### Reference Model

> sometimes we need to reuse some schema, we can use reference model

```javascript
const app = new Elysia()
  .model({
    sign: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  })
  .post("/sign-in", ({ body }) => body, {
    // with auto-completion for existing model name
    body: "sign",
    response: "sign",
  });
```

### transform

> by default, the params, query, body will be string, we can transform them to other type
> in this example, we transform the id to number

```javascript
import { Elysia, t } from 'elysia'

interface Params{
  id: number;
}

.get("/id/:id", ({params:{id}}: {params: Params}) => id, {
    params: t.Object({
      id: t.Number(),
    }),
    transform({params}){
      const id = +params.id;

      if(!Number.isNaN(id)) params.id = id;
    }
  })
```

> it's a little bit redundant and requires boilerplate, so Elysia provides a helper function to do this

```javascript
app.get("/id/:id", ({ params: { id } }) => id, {
  params: t.Object({
    id: t.Numeric(),
  }),
});
```

## Guard

> we can use guard to check the request body, params, query, etc.
> in this example, we check the body of sign-in and sign-up

```javascript
app.guard(
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  },
  (app) =>
    app
      .post("/sign-up", ({ body }) => signUp(body))
      .post("/sign-in", ({ body }) => signIn(body), {
        beforeHandle: isUserExists,
      })
);
```

### Group Guard

```javascript
app.group(
  "/v1",
  {
    body: t.Literal("Rikuhachima Aru"),
  },
  (app) => app.get("/student", () => "Rikuhachima Aru")
);
```

# type of body

```javascript
app.post("/", ({ body }) => body, {
  // Short form of application/json
  type: "json",
});
```

> different type of body

- // Shorthand for 'text/plain' = 'text'
- // Shorthand for 'application/json' = 'json'
- // Shorthand for 'multipart/form-data' = 'formdata'
- // Shorthand for 'application/x-www-form-urlencoded' = 'urlencoded'

# After Handle

```javascript
import { Elysia } from "elysia";

new Elysia()
  .onAfterHandle((context) => {
    if (typeof context.response === "number") context.response += 1;
  })
  .get("/", () => 1, {
    afterHandle(context) {
      if (typeof context.response === "number") context.response += 1;
    },
  })
  .listen(3000);
```

output

```bash
3
```

## Early Return

```javascript
import { Elysia } from "elysia";

new Elysia()
  .onAfterHandle(({ response }) => {
    if (typeof response === "number") return response + 1;
  })
  .get("/", () => 1, {
    afterHandle(context) {
      if (typeof context.response === "number") context.response += 1;
    },
  })
  .listen(3000);
```

output

```bash
2
```

> output 2 instead of 3, because the **onAfterHandle** will return 2, so the **afterHandle** will not be executed

# File Upload

```javascript
import { Elysia, t } from "elysia";

const app = new Elysia()
  .post("/single", ({ body: { file } }) => file, {
    body: t.Object({
      file: t.File(),
    }),
  })
  .listen(8080);
```

> we can use **t.File** and **t.Files**

```javascript
import { Elysia, t } from "elysia";

const app = new Elysia().post("/multiple", ({ body: { files } }) => files[0], {
  body: t.Object({
    files: t.Files({
      type: ["image", "video"],
    }),
  }),
});
```

> minSize, maxSize, type, minItems and maxItems

```javascrip
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
```
