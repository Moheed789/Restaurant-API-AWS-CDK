const Joi = require("@hapi/joi");

const restaurantSchema = Joi.object({
    entityType: Joi.string().valid("restaurant").required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    cuisineType: Joi.string().required(),
    openingHours: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    totalReviews: Joi.number().min(0).required(),
    isActive: Joi.boolean().required(),
});

module.exports = {
  restaurantBodyValidate: (inputData) => {
    return restaurantSchema.validate(inputData);
  }
};