const fs = require('fs');
const path = require('path');
const url = require('url');

function getContentType(url) {
    let contentTypes = {
        '.css': 'text/css',
        '.html': 'text/html',
        '.ico': 'image/x-icon',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'js': 'application/javascript'
    }
    let requestedContet = url.substr(url.indexOf('.'))

    if (contentTypes[requestedContet]) {
        //console.log(contentTypes[requestedContet].value)
        return contentTypes[requestedContet].value;
    }
}

module.exports = (req, res) => {
    req.pathname = req.pathname || url
        .parse(req.url)
        .pathname

    if (req.pathname.startsWith('/content/') && req.method === 'GET') {
        let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`))

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/plain'})

                res.write('Resource not found!')
                res.end()
                return
            }

            res.writeHead(200, {
                'Content-Type': getContentType(req.pathname)
            })

            res.write(data)
            res.end();
        })
    } else {

        fs.readFile('../Lab ShopStop/views/error.html', (err, data) => {
            if (err) {
                console.log(err.message)
                return
            }

            res.writeHead(404, {'content-type': 'text/html'})

            res.write(data)
            res.end();

        })
        return true;
    }
}