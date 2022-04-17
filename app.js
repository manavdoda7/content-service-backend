const express = require('express')
const app = express()
require('./middlewares/dbconnection')
require('dotenv').config()
app.use(express.json());


const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.urlencoded({ extended: true }));


const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Content Service Backend APIs",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
            {
                url: "https://content-service-backend.herokuapp.com/",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"],
};
const swaggerSpecs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.get('/', (req, res)=>{
    console.log('GET / request');
    res.status(200).json({success: true, message: 'Welcome to the backend.'})
})

app.use('/api/upload', require('./routes/uploadRoutes'))
app.use('/api/view', require('./routes/metadataRoutes'))
app.use('/api/user', require('./routes/userRoutes'))

app.listen(process.env.PORT||5000, ()=>{
    console.log(`App listening at port ${process.env.PORT||5000}`)
})