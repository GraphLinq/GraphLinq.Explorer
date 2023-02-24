var fs = require('fs');
var http = require('http');
var url = require('url');
const { db } = require('./api/db');
var ROOT_DIR = "./dist/";
var mimeTypes ={
	"js":"text/javascript",
	"json":"text/data",
	"html":"text/html",
	"png":"image/png",
	"jpg":"image/jpg",
	"jpeg":"image/jpeg"
};
let app = { };
db(app);

let routes = [... fs.readdirSync('./api/routes')]
    .filter(x => !['example.js'].includes(x)  && x.endsWith('.js'))
    .map(x => [x, require(`./api/routes/${x}`)])
    .map(x => ({ name: x[0].replace('.js', ''), use: Object.values(x[1])[0], type: 'normal' }));

[... routes].forEach(routeUseFunction => {
	routeUseFunction.use(app);

	let method = routeUseFunction.name.split('-', 1)[0];
	let path = routeUseFunction.name.replace(`${method}-`, '');
	console.log(`[Explorer - API] - ${method} - ${path}`);
});

const headers = {
	'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
	'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
	'Access-Control-Max-Age': 2592000, // 30 days
	/** add other headers as per requirement */
};

http.createServer( function( req, res ) {
	
	if (req.method === 'OPTIONS') {
		res.writeHead(204, headers);
		res.end();
		return;
	}
	
	var urlObj = url.parse( req.url, true, false );
	var tmp  = urlObj.pathname.lastIndexOf(".");
	var extension  = urlObj.pathname.substring((tmp + 1));

	let filePath = urlObj.pathname.replace('..', '');

	if (app[filePath.replace(/^\//, '')] != undefined) {
		app[filePath.replace(/^\//, '')](req, res, headers);
		return ;
	}

	if (filePath == undefined || filePath == '' || filePath == '/') {
		filePath = 'index.html';
	}
	if (!fs.existsSync(ROOT_DIR + filePath)) {
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