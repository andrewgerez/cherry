app.get('/api/links', async () => {
  const result = await sql/*sql */`
    SELECT *
    FROM cherry_links
    ORDER BY created_at DESC
  `

  return result
})