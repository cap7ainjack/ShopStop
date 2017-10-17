const port = 2323;
const config = require('./config/config');
const database = require('./config/database.config')

const express = require('express');

let app = express();
let environment = process.env.NODE_ENV || 'development'

//db adding`
database(config[environment])

require('./config/express')(app, config[environment])
require('./config/routes')(app)

require('./config/routes')(app);
require('./config/passport')();

app.listen(port)

/*
http.createServer((req, res) => {
    for (let handler of handlers) {
        if (!handler(req, res)) {
            break
        }
    }
}).listen(port) */