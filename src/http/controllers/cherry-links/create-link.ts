import { FastifyReply, FastifyRequest } from 'fastify'
import postgres from 'postgres'
import z from 'zod'
import { sql } from '../../../lib/postgres'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const createLinkBodySchema = z.object({
    code: z.string().min(3),
    url: z.string().url(),
  })

  try {
    const { code, url } = createLinkBodySchema.parse(req.body)

    const result = await sql/*sql */`
      INSERT INTO cherry_links (code, original_url)
      VALUES (${code}, ${url})
      RETURNING id
    `
  
    const link = result[0]
  
    return reply.status(201).send({ cherryLinkId: link.id })
  } catch (err) {
    if (err instanceof postgres.PostgresError) {
      if (err.code === '23505') {
        return reply
          .status(400)
          .send({ message: 'Code already in use.' })
      }
    }

    console.error(err)

    return reply.status(500).send({ message: 'Internal server error.' })
  }
}
