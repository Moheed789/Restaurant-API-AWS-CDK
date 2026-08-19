const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const TableName = process.env.RESTAURANTS_TABLE;

const listRestaurants = async () => {
    const params = new ScanCommand({
        TableName: TableName,
    });

    const result = await dynamoDB.send(params);

    return result.Items || [];
}

module.exports = { listRestaurants }