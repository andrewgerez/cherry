import fastify from 'fastify'
import { cherryLinksRoutes } from './http/controllers/cherry-links/routes'

export const app = fastify()

app.register(cherryLinksRoutes)
