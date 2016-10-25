var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var recentKey = "recent Key";
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	client.lpush(recentKey, req.url, function(err, res) {
		console.log("response: " + res);
	});
	client.ltrim(recentKey, 0, 4);
	next(); // Passing the request to the next handler in the stack.
});


//picture
var picKey = "picKey";

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
   console.log(req.body) // form fields
   console.log(req.files) // form files

   if( req.files.image )
   {
   	fs.readFile( req.files.image.path, function (err, data) {
   		if (err) throw err;
   		var img = new Buffer(data).toString('base64');
   		client.lpush([picKey, img], function(err, msg) {
   			if (err) throw err;
   			console.log("pushed image!\n");
   		});
	  		// console.log(img);
	  	});
   }

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {
	{
		// if (err) throw err
		res.writeHead(200, {'content-type':'text/html'});
		var items = client.lpop(picKey, function(err, value) {
			if (err) throw err;
			if (value == undefined) {
				res.write("<h1>No image to display</h1>");
			} else {
				res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+value+"'/>");
			}
			res.end();
		});
	}
})


//"/" "/get" "/set" "/recent"
app.get('/', function(req, res) {
	res.send("Home page at port " + appPort);
});

app.get('/set', function(req, res) {
	{
		var key = "testKey";
		var msg = "this message will self-destruct in 10 seconds.";
		client.set(key, msg);
		client.expire(key, 10);
		res.send('ok');
	}
});

app.get('/get', function(req, res) {
	{
		var key = "testKey";
		client.get(key, function(err, value){
			res.send(value);
		});
	}
});


app.get("/recent", function(req, res) {
	var key = recentKey;
	client.lrange(key, 0, 4, function(err, value) {
		var resStr = "";
		for (var v in value) {
			resStr += value[v] + "<br/>";
		}
		res.send(resStr);
	});
});

// HTTP SERVER

var appPort = 4000;
var server = app.listen(appPort, "127.0.0.1", function () {

	var host = server.address().address;
	var port = server.address().port;
	console.log(host);

	console.log('Example app listening at http://%s:%s', host, port);
});

