const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const TableName = process.env.RESTAURANTS_TABLE;

const createRestaurant = async (restaurantData) => {
    const currentTime = Math.floor(Date.now() / 1000);

    const Item = {
        restaurantId: restaurantData.id,
        ...restaurantData,
        createdAt: currentTime,
        updatedAt: currentTime,
    };

    const params = new PutCommand({
        TableName: TableName,
        Item,
    });

    await dynamoDB.send(params);

    return Item;
};

module.exports = { createRestaurant };