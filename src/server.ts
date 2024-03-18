import fastify from 'fastify'
import { z } from 'zod'
import { sql } from './lib/postgres'
import postgres from 'postgres'

const app = fastify()

app.get('/:code', async (req, reply) => {
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

  if (!result.length) {
    return reply
      .status(400)
      .send({ message: 'Link not found.' })
  }

  return reply
    .redirect(301, link.original_url)
})

app.get('/api/links', async () => {
  const result = await sql/*sql */`
    SELECT *
    FROM cherry_links
    ORDER BY created_at DESC
  `

  return result
})

app.post('/api/links', async (req, reply) => {
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
})

app.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP server running :D')
})
