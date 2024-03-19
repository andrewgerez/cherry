import { sql } from "../../../lib/postgres"

export async function getLinks() {
  const result = await sql/*sql */`
  SELECT *
  FROM cherry_links
  ORDER BY created_at DESC
`

return result
}
