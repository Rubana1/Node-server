const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to serve files
function serveFile(filePath, contentType, response) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve 404 page
                fs.readFile(path.join(__dirname, '404.html'), (err, page404) => {
                    if (err) {
                        response.writeHead(500);
                        response.end('Error loading 404 page');
                    } else {
                        response.writeHead(404, { 'Content-Type': 'text/html' });
                        response.end(page404, 'utf-8');
                    }
                });
            } else {
                // Other server error
                response.writeHead(500);
                response.end(`Server Error: ${err.code}`);
            }
        } else {
            // Serve the file if no errors
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

// Create the HTTP server
http.createServer((req, res) => {
    // Get the requested URL path
    let urlPath = req.url === '/' ? '/index.html' : req.url;
    // Get the file extension
    let extname = path.extname(urlPath);

    // Default content type is HTML
    let contentType = 'text/html';

    // Set the content type based on the file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    // Construct the full file path
    const filePath = path.join(__dirname, urlPath);

    // Serve the file
    serveFile(filePath, contentType, res);
}).listen(3000, () => {
    console.log('Server running on port 3000');
});
