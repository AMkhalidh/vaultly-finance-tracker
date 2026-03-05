const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'https://vaultly-finance-tracker-production.up.railway.app',
    changeOrigin: true,
  }));
};
