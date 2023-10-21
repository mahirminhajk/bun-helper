import {Elysia} from 'elysia'

export const plugin = new Elysia()
    .state("plugin-version", 1)
    .get('/plugin', (context) => {
        return `Plugin version: ${context.store['plugin-version']}`
    });

export const configPlugin = <Prefix extends string | undefined>({ prefix = "/v1" }: { prefix: Prefix }) =>
  new Elysia({ prefix }).get(`/hi`, () => "Hi");