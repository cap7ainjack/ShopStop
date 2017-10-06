let _fs = require('fs');
let _path = require('path')
const dbPath = _path.join(__dirname, '/database.json')

let products = [];

module.exports.products = {}

function getProducts(){
    if(!_fs.existsSync(dbPath)){
        _fs.writeFileSync(dbPath, '[]');
        return [];
    }
    
    let json = _fs.readFileSync(dbPath).toString() || '[]';
    let products = JSON.parse(json);
    
    return products;
}

function saveProducts(products){
    let json = JSON.stringify(products);
    _fs.writeFileSync(dbPath, json);
}

module.exports.products.getAll = getProducts

module.exports.products.add = (product) =>{
    let products = getProducts();
    product.id = products.length + 1
    products.push(product);
    
    saveProducts(products);
}

module.exports.products.findByName = (name) => {
    return getProducts().filter(p => p.name.toLowerCase().include(name))
}