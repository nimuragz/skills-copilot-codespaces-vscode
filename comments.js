// Create web server
// The server will listen on port 3000
// The server will respond to requests for the comments page
// The server will respond to requests with the comments data
// The server will respond to requests with comments in JSON format
// The server will respond to requests with comments in XML format

// Load modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Load comments
var comments = require('./comments.json');

// Create server
http.createServer(function(req, res) {
	
	// Set content type
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	
	// Check for request method
	if (req.method === 'GET') {
		// Check for request URL
		if (req.url === '/') {
			// Read file
			fs.createReadStream('./comments.html').pipe(res);
		} else if (req.url === '/comments') {
			// Write comments
			res.write(JSON.stringify(comments));
			res.end();
		} else if (req.url === '/comments.json') {
			// Write comments
			res.write(JSON.stringify(comments));
			res.end();
		} else if (req.url === '/comments.xml') {
			// Write comments
			res.write('<comments>');
			comments.forEach(function(comment) {
				res.write('<comment>');
				res.write('<name>' + comment.name + '</name>');
				res.write('<comment>' + comment.comment + '</comment>');
				res.write('</comment>');
			});
			res.write('</comments>');
			res.end();
		} else {
			// Write 404
			res.writeHead(404);
			res.write('404 Not Found');
			res.end();
		}
	} else if (req.method === 'POST') {
		// Create body
		var body = '';
		req.on('data', function(chunk) {
			body += chunk;
		});
		req.on('end', function() {
			// Parse body
			var data = qs.parse(body);
			// Add comment
			comments.push(data);
			// Write comments
			res.write(JSON.stringify(comments));
			res.end();
		});
	} else {
		// Write 405
		res.writeHead(405);
		res.write('405 Method Not Allowed');
		res.end();
	}
	
}).listen