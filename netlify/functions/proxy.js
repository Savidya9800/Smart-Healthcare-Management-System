// netlify/functions/proxy.js
// Proxy requests to your backend API (optional, for local dev or serverless functions)

const { createProxyMiddleware } = require('http-proxy-middleware');

exports.handler = async function(event, context) {
  // Example: Proxy /api/* to your backend
  // You can customize the target URL as needed
  return createProxyMiddleware('/api', {
    target: 'http://localhost:5000', // Change to your backend URL
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
  })(event, context);
};
