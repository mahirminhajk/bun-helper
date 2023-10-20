# Bun

## Development
To start the development server run:
```bash
bun run dev
```

## Quick Start
```javascript
import {Elysia} from 'elysia';

const app = new Elysia().listen(3000);

console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
```

## Routing
```javascript
const app = new Elysia()
  .get("/", () => "Hello Elysia") 
  .post("/hello", () => "Hello World")
  .get('/product/:id', ({params: {id}})=> `Product ${id}`)
  .get('/user/*', () => 'User is here')
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
  })
```



