import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { sql } from '../../../lib/postgres'
import { redis } from '../../../lib/redis'

export async function redirect(req: FastifyRequest, reply: FastifyReply) {
  const createLinkParamsSchema = z.object({
    code: z.string().min(3),
  })

  const { code } = createLinkParamsSchema.parse(req.params)

  const result = await sql/*sql */`
    SELECT id, original_url
    FROM cherry_links
    WHERE cherry_links.code = ${code}
  `

  const link = result[0]

  await redis.zIncrBy('analytics', 1, String(link.id))

  if (!result.length) {
    return reply
      .status(400)
      .send({ message: 'Link not found.' })
  }

  return reply
    .redirect(301, link.original_url)
}
