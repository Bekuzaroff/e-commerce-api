const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');

const app = require('./app');
const Product = require('./models/product');

dotenv.config({path: './main.env'});

mongoose.connect(process.env.DB_URL).then(value => {
    console.log('db is connected');
}).catch((reason) => console.log(reason));


const PORT = 3000
app.listen(PORT, '127.0.0.1', () => {
    console.log('start server')
});

//adding into db basic set of products
if(process.env.NODE_ENV === 'production'){
    Product.insertMany(JSON.parse(fs.readFileSync('./dev_data/products.json', 'utf-8')))
        .then((value) => console.log('products added successfully'))
        .catch((e) => console.log(e.message));
}