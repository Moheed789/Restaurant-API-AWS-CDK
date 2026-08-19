const dayjs = require("dayjs");

const generateUpdateQuery = (data) => {
  const exp = {
    UpdateExpression: "set",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  Object.entries(data).forEach(([key, item]) => {
    exp.UpdateExpression += ` #${key} = :${key},`;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  });

  exp.UpdateExpression += " #updatedAt = :updatedAt,";
  exp.ExpressionAttributeNames["#updatedAt"] = "updatedAt";
  exp.ExpressionAttributeValues[":updatedAt"] = dayjs().unix();

  exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);

  return exp;
};

module.exports = { generateUpdateQuery }