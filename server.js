const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Set the default file path
    let filePath = path.join(__dirname, 'public', 'index.html');

    // Determine the file path based on the requested URL
    if (req.url === '/') {
        filePath = path.join(__dirname, 'public', 'index.html');
    } else if (req.url === '/about') {
        filePath = path.join(__dirname, 'public', 'about.html');
    } else if (req.url === '/contact') {
        filePath = path.join(__dirname, 'public', 'contact.html');
    } else if (req.url.match(/\.css$/)) {
        filePath = path.join(__dirname, 'Css', path.basename(req.url));
    } else {
        filePath = path.join(__dirname, 'pages', '404.html');
    }

    // Get the file extension
    const extname = path.extname(filePath);

    // Set initial content type
    let contentType = 'text/html';

    // Check the extension and set the content type
    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
    }

    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve a 404 page
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>Server Error: ${err.code}</h1>`);
            }
        } else {
            // Serve the requested file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
