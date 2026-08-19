const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const TableName = process.env.RESTAURANTS_TABLE;

const deleteRestaurant = async (restaurantId) => {
    const params = new DeleteCommand({
        TableName: TableName,
        Key: {
            restaurantId: restaurantId,
        },
    });

    await dynamoDB.send(params);
}

module.exports = { deleteRestaurant };