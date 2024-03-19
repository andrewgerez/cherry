app.get('/api/analytics', async () => {
  const result = await redis.zRangeByScoreWithScores('analytics', 0, 50)

  const analytics = result
    .sort((a, b) => b.score - a.score)
    .map(item => ({
      cherryLinkId: Number(item.value),
      clicks: item.score,
    }))

  return analytics
})
