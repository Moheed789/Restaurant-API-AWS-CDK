const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { generateUpdateQuery } = require("../generateUpdateQuery.js");

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const TableName = process.env.RESTAURANTS_TABLE;

const updateRestaurant = async (restaurantId, updateFields) => {
    const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = generateUpdateQuery(updateFields);

    const params = new UpdateCommand({
        TableName: TableName,
        Key: {
            restaurantId: restaurantId,
        },
        UpdateExpression: UpdateExpression,
        ExpressionAttributeNames: ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDB.send(params);

    return result.Attributes;
}

module.exports = { updateRestaurant }