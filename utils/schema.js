const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    enum productStatus {
        ACTIVE
        INACTIVE
    }
    enum orderStatus {
        CREATED
        IN_PROGRESS
        DELIVERED
    }
    type Product {
        id : ID,
        name: String!,
        description: String!,
        price: Float!,
        status: productStatus,
        createdAt: String,
        updatedAt: String
    }
    type Order {
        id : ID,
        totalCost: Float!,
        deliveryDate: String,
        status: orderStatus!,
        createdAt: String,
        updatedAt: String
    }
    type LineItems {
        id : ID,
        productId: ID,
        orderId: ID,
        name: String,
        price: Float,
        productStatus: productStatus,
        description: String, 
        totalCost: Float,
        deliveryDate: String,
        status: orderStatus,
        orderCreated: String
        orderUpdated: String
    }
    type Query {
        listProducts(orderBy: String, sort: String, filter: String): [Product]
        readProductInfo(id: ID): Product
        listOrders(orderBy: String, sort: String): [Order]
        readOrderInfo(id: ID): Order
        listOrderItems(id: ID, orderBy: String, sort: String, filter: String): [LineItems]
    } 
    type Mutation {
        createProduct(name: String, description: String, price: Float): Boolean
        updateProduct(id: ID, name: String, description: String, price: Float, status: productStatus ): Boolean
        deleteProduct(id: ID): Boolean
        
        createOrder(totalCost: Float, deliveryDate: String): Boolean
        updateOrder(id: ID, totalCost: Float, deliveryDate: String, status: orderStatus ): Boolean
        deleteOrder(id: ID): Boolean
    }
`);


