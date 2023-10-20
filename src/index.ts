import { Elysia } from "elysia";

const app = new Elysia().listen(5000);

app.post("/id/:id", (context) => {
  const body = context.body;
  const id = context.params.id;
  const query = context.query;
  const store = context.store;
    
  context.set.status = 201;
  
  return new Response(JSON.stringify({ body, id, query, store }), {
    headers: { "Content-Type": "application/json" },
  });

});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
