// This file is required for Netlify Functions (if you want to use serverless functions)
// Example function (hello.js):
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Netlify Functions!" })
  };
};
