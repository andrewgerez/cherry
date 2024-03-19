import { FastifyInstance } from 'fastify'
import { create } from 'node:domain'
import { getLinks } from './get-links'
import { redirect } from './redirect'

export async function cherryLinksRoutes(app: FastifyInstance) {
  app.post('/api/links', create)
  app.get('/api/links', getLinks)
  app.get('/:code', redirect)
}
