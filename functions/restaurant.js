const { randomUUID } = require("crypto");
const { createRestaurant } = require("../utils/dbOperations/create.js");
const { updateRestaurant } = require("../utils/dbOperations/update.js");
const { getRestaurant } = require("../utils/dbOperations/get.js");
const { deleteRestaurant } = require("../utils/dbOperations/delete.js");
const { listRestaurants } = require("../utils/dbOperations/list.js");
const { restaurantBodyValidate } = require("../utils/bodyValidator/restaurant.js");
const { buildResponse } = require("../utils/helperFunction/buildResponse.js");

const handler = async (event) => {
    console.log("Event: ", event);

    const { httpMethod } = event;

    if (httpMethod === "POST") {
        try {
            const restaurantId = randomUUID();
            const requestBody = JSON.parse(event.body);
            const { error } = restaurantBodyValidate(requestBody);

            if (error) {
                return buildResponse(400, { message: error.details[0].message });
            }

            const newRestaurant = await createRestaurant({ restaurantId, ...requestBody });
            return buildResponse(201, newRestaurant);
        } catch (error) {
            console.error("Error creating restaurant: ", error);
            return buildResponse(500, { message: "Internal Server Error" });
        }
    } else if (httpMethod === "GET") {
        try {
            const restaurantId = event.pathParameters?.restaurantId;

            if (restaurantId) {
                const restaurant = await getRestaurant(restaurantId);

                if (!restaurant) {
                    return buildResponse(404, { message: "Restaurant not found" });
                }

                return buildResponse(200, restaurant);
            } else {
                const restaurants = await listRestaurants();

                if (!restaurants || restaurants.length === 0) {
                    return buildResponse(404, { message: "No restaurants found" });
                }

                return buildResponse(200, restaurants);
            }

        } catch (error) {
            console.error("Error fetching restaurants: ", error);
            return buildResponse(500, { message: "Internal Server Error" });
        }
    } else if (httpMethod === "PUT") {
        try {
            const restaurantId = event.pathParameters?.restaurantId;

            if (!restaurantId) {
                return buildResponse(400, { message: "Restaurant ID is required" });
            }

            const requestBody = JSON.parse(event.body);
            const { error } = restaurantBodyValidate(requestBody);

            if (error) {
                return buildResponse(400, { message: error.details[0].message });
            }

            const updatedRestaurant = await updateRestaurant(restaurantId, requestBody);
            return buildResponse(200, updatedRestaurant);
        } catch (error) {
            console.error("Error updating restaurant: ", error);
            return buildResponse(500, { message: "Internal Server Error" });
        }
    } else if (httpMethod === "DELETE") {
        try {
            const restaurantId = event.pathParameters?.restaurantId;

            if (!restaurantId) {
                return buildResponse(400, { message: "Restaurant ID is required" });
            }

            await deleteRestaurant(restaurantId);
            return buildResponse(200, { message: "Restaurant deleted successfully" });
        } catch (error) {
            console.error("Error deleting restaurant: ", error);
            return buildResponse(500, { message: "Internal Server Error" });
        }
    } else {
        return buildResponse(405, { message: "Method Not Allowed" });
    }
};

module.exports = { handler };