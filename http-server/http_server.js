var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "./";

var mimeTypes ={
	"js":"text/javascript",
	"json":"text/data",
	"html":"text/html",
	"png":"image/png",
	"jpg":"image/jpg",
	"jpeg":"image/jpeg"
}
http.createServer( function( req, res ) {
	
	var urlObj = url.parse( req.url, true, false );
	var tmp  = urlObj.pathname.lastIndexOf(".");
	var extension  = urlObj.pathname.substring((tmp + 1));

	let filePath = urlObj.pathname;

	if (filePath == undefined || filePath == '' || filePath == '/') {
		filePath = 'index.html';
	}
	
	fs.readFile( ROOT_DIR + filePath, function( err, data ){
		if( err ){
			res.writeHead(404);
			res.end(JSON.stringify( err ) );
			return;
		}
		if( mimeTypes[ extension ] ){
			res.writeHead(200, {'Content-Type': mimeTypes[extension]});
		}
		else {
			res.writeHead(200);
		}
		res.end(data);
	} )
}).listen( 8080, '0.0.0.0' );
console.log( "listening on port 0.0.0.0:8080" );