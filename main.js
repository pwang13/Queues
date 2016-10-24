var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);


	next(); // Passing the request to the next handler in the stack.
});


// app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
//    console.log(req.body) // form fields
//    console.log(req.files) // form files

//    if( req.files.image )
//    {
// 	   fs.readFile( req.files.image.path, function (err, data) {
// 	  		if (err) throw err;
// 	  		var img = new Buffer(data).toString('base64');
// 	  		console.log(img);
// 		});
// 	}

//    res.status(204).end()
// }]);

var sendResponse = function(res, msg) {

}

app.get('/set', function(req, res) {
	{
		var key = "testKey";
		var msg = "this message will self-destruct in 10 seconds.";
		client.set(key, msg);
		client.expire(key, 10);
		res.send('ok');
		client.lpush("mylist", "/set");
	}
});

app.get('/get', function(req, res) {
	{
		var key = "testKey";
		client.get(key, function(err, value){
			res.send(value);
		});
		client.lpush("mylist", "/get");
	}
});


app.get("/recent", function(req, res) {
	var key = "mylist";
	client.lrange(key, 0, 9, function(err, value) {
		var resStr = "";
		for (var v in value) {
			resStr += value[v] + "<br/>";
		}
			res.send(resStr);
	});
});

// HTTP SERVER

var appPort = 4000;
var server = app.listen(appPort, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});

