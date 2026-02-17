const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function setupProxy(app) {
  const apiPort = process.env.API_PORT || 8788
  if (`${process.env.PORT || ''}` === `${apiPort}`) {
    // Prevent proxy-to-self loops when frontend and API share a port.
    console.warn(`[proxy] PORT (${process.env.PORT}) matches API_PORT (${apiPort}); update API_PORT to a different port.`)
  }
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${apiPort}`,
      changeOrigin: true
    })
  )
}
