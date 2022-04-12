const express = require('express')
const app = express()
require('./middlewares/dbconnection')
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res)=>{
    console.log('GET / request');
    res.status(200).json({success: true, message: 'Welcome to the backend.'})
})

app.use('/api/upload', require('./routes/uploadRoutes'))
app.use('/api/view', require('./routes/metadataRoutes'))

app.listen(process.env.PORT, ()=>{
    console.log(`App listening at port ${process.env.PORT}`)
})