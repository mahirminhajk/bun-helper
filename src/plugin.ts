import {Elysia} from 'elysia'

const plugin = new Elysia()
    .state("plugin-version", 1)
    .get('/plugin', (context) => {
        return `Plugin version: ${context.store['plugin-version']}`
    });

export default plugin;