const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');

const multiparty = require('multiparty') //externally added – for parsing data from the html form
const shortId = require('shortid') //external - for generating random names for files

const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = (req, res) => {
    req.pathname = req.pathname || url
        .parse(req.url)
        .pathname

    if (req.pathname === '/product/add' && req.method === "GET") {
        let filePath = path.normalize(path.join(__dirname, '../views/products/add.html'))

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err)
                return;
            }

            Category
                .find()
                .then((categories) => {
                    let replacment = `<select class="input-field" name="category">`
                    for (let category of categories) {
                        replacment += `$<option value="${category._id}">${category.name}</option>`
                    }
                    replacment += '</select>'

                    let html = data
                        .toString()
                        .replace('{categories}', replacment);
                    res.writeHead(200, {'content-type': 'text/html'})

                    res.write(html)
                    res.end();
                })
        })
    } else if (req.pathname === '/product/add' && req.method === "POST") {

        let form = new multiparty.Form();
        let product = {};

        form.on('part', (part) => {
            if (part.filename) {
                let dataString = ''

                part.setEncoding('binary');
                part.on('data', (data) => {
                    dataString += data;
                })

                part.on('end', () => {
                    let fileName = shortId.generate();
                    let filePath = `/content/images/${fileName}.png`;

                    product.image = filePath;
                    fs.writeFile(`.${filePath}`, dataString, {
                        encoding: 'ascii'
                    }, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    })
                })
            } else {
                part.setEncoding('utf-8')
                let field = '';
                part.on('data', (data) => {
                    field += data;
                })

                part.on('end', () => {
                    product[part.name] = field;
                })
            }
        })

        form.on('close', () => {
            //Form Validation
            let validAddForm = true;
            for (let prop in product) {
                if (product[prop] === "" && prop !== 'id') {
                    validAddForm = false;
                }
            }

            if (validAddForm) {
                Product
                    .create(product)
                    .then((insertedProduct) => {
                        Category
                            .findById(product.category)
                            .then(category => {
                                category
                                    .products
                                    .push(insertedProduct._id)
                                category.save();

                                res.writeHead(302, {Location: '/'})
                                res.end();
                            })
                    })
            }
        })

        form.parse(req);
    } else {
        return true;
    }
}