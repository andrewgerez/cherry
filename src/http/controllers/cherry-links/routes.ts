import { FastifyInstance } from 'fastify'
import { create } from 'node:domain'

export async function cherryLinksRoutes(app: FastifyInstance) {
  app.post('/api/links', create)
}
