const { Stack, StackProps } = require('aws-cdk-lib');
const { Construct } = require('constructs');
const { Runtime, Code, Function } = require('aws-cdk-lib/aws-lambda');
const { RestApi, LambdaIntegration } = require('aws-cdk-lib/aws-apigateway');
const { Table, AttributeType, BillingMode } = require('aws-cdk-lib/aws-dynamodb');


class ApiStack extends Stack {
    /**
     * @param {Construct} scope
     * @param {string} id
     * @param {StackProps} props
     */
    constructor(scope, id, props) {
        super(scope, id, props)

        const api = new RestApi(this, `${props.stageName}-Api`, {
            deployOptions: {
                stageName: props.stageName
            }
        })

        const restaurantsTable = new Table(this, 'RestaurantsTable', {
            partitionKey: {
                name: 'restaurantId',
                type: AttributeType.STRING,
            },
            billingMode: BillingMode.PAY_PER_REQUEST
        })

        const restaurantFunction = new Function(this, 'restaurantFunction', {
            runtime: Runtime.NODEJS_24_X,
            handler: 'functions/restaurant.handler',
            code: Code.fromAsset('.', {
                exclude: ['cdk.out', '*.log'],
            }),
            environment: {
                RESTAURANTS_TABLE: restaurantsTable.tableName,
            },
        })

        restaurantsTable.grantReadWriteData(restaurantFunction)

        const restaurantLambdaIntegration = new LambdaIntegration(restaurantFunction)

        api.root.addMethod('POST', restaurantLambdaIntegration)
        api.root.addMethod('GET', restaurantLambdaIntegration)

        const idResource = api.root.addResource('{restaurantId}')
        idResource.addMethod('PUT', restaurantLambdaIntegration)
        idResource.addMethod('DELETE', restaurantLambdaIntegration)
        idResource.addMethod('GET', restaurantLambdaIntegration)
    }
}

module.exports = { ApiStack }