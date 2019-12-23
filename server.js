const express = require('express');
// const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const controllers = require('./utils/controllers');
const  mysql = require('mysql2');
const env = require('dotenv');
env.config();
const schema = require('./utils/schema');

let root = {
    listProducts: (args, req) => controllers.queryDb(req, "SELECT * FROM products ", args).then(data => data),
    createProduct: (args, req) => controllers.queryDb(req, 'INSERT INTO products SET ? ', args).then(data => data),
    readProductInfo: (args, req) => controllers.queryDb(req, 'SELECT * FROM products WHERE id = ? ', [args.id]).then(data => data[0]),
    updateProduct: (args, req) => controllers.queryDb(req, 'UPDATE products SET ? WHERE id = ? ', [args, args.id]).then(data => data),
    deleteProduct: (args, req) => controllers.queryDb(req, 'DELETE FROM products WHERE id = ? ', [args.id]).then(data => data),

    listOrders: (args, req) => controllers.queryDb(req, 'SELECT * FROM orders ', args).then(data => data),
    createOrder: (args, req) => controllers.queryDb(req, 'INSERT INTO orders SET ? ', args).then(data => data),
    readOrderInfo: (args, req) => controllers.queryDb(req, 'SELECT * FROM orders WHERE id = ? ', [args.id]).then(data => data[0]),
    updateOrder: (args, req) => controllers.queryDb(req, 'UPDATE orders SET ? WHERE id = ? ', [args, args.id]).then(data => data),
    deleteOrder: (args, req) => controllers.queryDb(req, 'DELETE FROM orders WHERE id = ? ', [args.id]).then(data => data),

    listOrderItems: (args, req) => controllers.queryDb(req,
        'SELECT l.id, l.productId, l.orderId, ' +
        'p.name, p.price, p.status as productStatus, p.description, ' +
        'o.totalCost, o.deliveryDate, o.status, o.createdAt as orderCreated, o.updatedAt as orderUpdated ' +
        'FROM lineItems AS l ' +
        'LEFT JOIN products AS p ' +
        'ON l.productId = p.id ' +
        'LEFT JOIN orders AS o ' +
        'ON o.id = l.orderId ' +
        'WHERE l.orderId = ? ', [args.id]).then(data => data)
};

// Initialize the app
const app = express();

// DB Middleware
app.use((req, res, next) => {
    req.db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });
    req.db.connect();
    next();
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));


// Start the server
app.listen(process.env.PORT, () => {
    console.log('Go to http://localhost:3000/graphql to run queries!');
});