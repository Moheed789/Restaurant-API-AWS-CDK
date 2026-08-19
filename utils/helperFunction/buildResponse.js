const buildResponse = (statusCode, body, headers = {}) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allows access from any origin
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE', // Allowed HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token', // Allowed headers
        ...headers, // Spread operator to add/override headers
    },
    body: JSON.stringify(body),
});

module.exports = { buildResponse };