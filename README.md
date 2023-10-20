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