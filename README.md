# Restaurant API

AWS CDK based REST API for managing restaurants with AWS Lambda, API Gateway, and DynamoDB.

## API Documentation

The complete OpenAPI specification is available in [openai.yml](openai.yml). The filename is kept as `openai.yml` in this project; its content follows the OpenAPI 3.0.3 standard.

You can import `openai.yml` into Postman or open it in Swagger Editor to view and test the endpoints.

## Requirements

- Node.js 24 or later
- npm
- AWS CLI configured with an account that can use CDK
- AWS CDK CLI through `npx`

Install dependencies:

```bash
npm install
```

Verify AWS credentials:

```bash
aws sts get-caller-identity
```

## Deploy

From the project root, bootstrap the AWS environment once per account and region:

```bash
npx cdk bootstrap
```

Synthesize the CloudFormation templates:

```bash
npx cdk synth
```

Deploy the default `dev` stage:

```bash
npx cdk deploy
```

Use a different stage:

```bash
npx cdk deploy --context stageName=prod
```

After deployment, copy the API Gateway URL from the CDK output. It normally has this shape:

```text
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}
```

Replace the `servers[0].url` variables in `openai.yml`, or set the base URL in Postman, before sending requests.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/` | Create a restaurant |
| GET | `/` | List restaurants |
| GET | `/{restaurantId}` | Get one restaurant |
| PUT | `/{restaurantId}` | Update a restaurant |
| DELETE | `/{restaurantId}` | Delete a restaurant |

## Request Body

`POST` and `PUT` require JSON with these fields:

```json
{
	"entityType": "restaurant",
	"name": "The Spice Garden",
	"address": "12 Main Street",
	"city": "Lahore",
	"phone": "+92-300-1234567",
	"email": "contact@spicegarden.example",
	"cuisineType": "Pakistani",
	"openingHours": "10:00 AM - 11:00 PM",
	"rating": 4.5,
	"totalReviews": 120,
	"isActive": true
}
```

Validation rules include `entityType: restaurant`, a valid email, `rating` from 0 to 5, and a non-negative `totalReviews`.

## Example Requests

The recommended workflow is to import [openai.yml](openai.yml) into Postman and set the deployed API Gateway URL as the server URL.

For command-line testing, replace `BASE_URL` and `RESTAURANT_ID` in these generic curl examples.

Create:

```bash
curl -X POST "BASE_URL/" \
	-H "Content-Type: application/json" \
	-d '{
		"entityType": "restaurant",
		"name": "The Spice Garden",
		"address": "12 Main Street",
		"city": "Lahore",
		"phone": "+92-300-1234567",
		"email": "contact@spicegarden.example",
		"cuisineType": "Pakistani",
		"openingHours": "10:00 AM - 11:00 PM",
		"rating": 4.5,
		"totalReviews": 120,
		"isActive": true
	}'
```

List:

```bash
curl "BASE_URL/"
```

Get one:

```bash
curl "BASE_URL/RESTAURANT_ID"
```

Update:

```bash
curl -X PUT "BASE_URL/RESTAURANT_ID" \
	-H "Content-Type: application/json" \
	-d '{
		"entityType": "restaurant",
		"name": "The Spice Garden Updated",
		"address": "14 Main Street",
		"city": "Lahore",
		"phone": "+92-300-1234567",
		"email": "contact@spicegarden.example",
		"cuisineType": "Pakistani",
		"openingHours": "10:00 AM - 11:30 PM",
		"rating": 4.7,
		"totalReviews": 135,
		"isActive": true
	}'
```

Delete:

```bash
curl -X DELETE "BASE_URL/RESTAURANT_ID"
```

## Responses

Successful create, get, and update requests return a restaurant object. A successful list request returns an array. Delete returns:

```json
{
	"message": "Restaurant deleted successfully"
}
```

Validation failures return HTTP `400`, missing records return HTTP `404`, and unexpected failures return HTTP `500`.

## Destroy

To remove the CDK stacks from the configured AWS environment:

```bash
npx cdk destroy
```

Run one CDK command at a time. If CDK reports that another process is synthesizing to `cdk.out`, close the other CDK terminal and retry after that process finishes.
