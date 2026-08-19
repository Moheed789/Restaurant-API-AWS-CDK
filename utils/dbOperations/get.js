const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const TableName = process.env.RESTAURANTS_TABLE;

const getRestaurant = async (restaurantId) => {
    const params = new GetCommand({
        TableName: TableName,
        Key: {
            restaurantId: restaurantId,
        },
    });

    const result = await dynamoDB.send(params);

    if (!result.Item) {
        throw new Error(`Restaurant with restaurantId: ${restaurantId} not found.`);
    }

    return result.Item;
};

module.exports = { getRestaurant };