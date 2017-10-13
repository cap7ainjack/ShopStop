const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const Product = require('../models/Product');

module.exports.index = (req, res) => {

    //search input
    let queryData = req.query //qs.parse(url.parse(req.url).query)

    //add all products to home page
    Product
        .find()
        .then((products) => {
            //search input
            if (queryData.query) {
                products = products.filter(p => p.name.toLowerCase().includes(queryData.query.toLowerCase()));
            }

            res.render('home/index', {products: products})
        })
}