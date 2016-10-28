Cache, Proxies, Queues
=========================


### A simple web server

Use [express](http://expressjs.com/) to install a simple web server.

Express uses the concept of routes to use pattern matching against requests and sending them to specific functions.  You can simply write back a response body.

	app.get('/', function(req, res) {
	  res.send('hello world')
	})

### Redis

[redis](http://redis.io/) is the dabase used in this repo to build some simple infrastructure components, using the [node-redis client](https://github.com/mranney/node_redis).


### Building Infrastructure

In our [redis workshop](https://github.com/CSC-DevOps/Queues), we worked with server-side web technologies combined with redis to demonstrate concepts related to caches and queues.

Your assignment is to complete the workshop assignment with the following additional considerations:

#### `/get` and `/set`.

When `/set` is visited, set a new key, with the value:
> "this message will self-destruct in 10 seconds".

Use the expire command to make sure this key will expire in 10 seconds.

When `/get` is visited, fetch that key, and send value back to the client: `res.send(value)` 

####Recent visited sites: `/recent`, which will display the most recently visited sites.

#### Cat picture uploads: queue

Implement two routes, `/upload`, and `/meow`.
 
A stub for upload and meow has already been provided.

Use curl to help you upload easily.

	curl -F "image=@./img/morning.jpg" localhost:3000/upload

Have `upload` store the images in a queue.  Have `meow` display the most recent image to the client and *remove* the image from the queue. 

#### Implement a new command `spawn`, which will create a new app server running on another port. Correspondingly, implement a new command `destroy`, which will destroy a random server. Available servers should be stored in redis, which can be seen by `listservers` command. Destroying all servers is undefined behavior.

#### Create a proxy that will uniformly deliver requests to available servers. E.g., if a visit happens to `/` then toggle between `localhost:3000`, `localhost:3001`, etc.  Use redis to look up which server to resolve to.
