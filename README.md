# graphql-playground-server
A simple HTTP server that serves a web-based [GraphQL Playground][1].

## Rationale
GraphQL Playground is nice, but it would be even nicer if you could easily host
it in a stanadlone web server. This would keep it completely separate from your
API processes and repositories, simplifying your dependency trees and just
generally making more sense than embedding it inside your apps with middleware
which you turn off in production.

There does not seem to be a package on npm for doing this yet, however, even
though it would be dead simple to make. So, we're making it here. :)

## Installation
The plan is to make a Homebrew formula and .deb package available for this
module that will install it as a local service, that way developers can have it
always available at some port number on `localhost` url.

For now, though, the easiest way to use it is to install it globally with npm:

```sh
npm i -g graphql-playground-server
```

Then run it in your console from anywhere on your system like so:

```sh
graphql-playground-server
```

## Using the Playground
By default, you can access the playground while it is running at
[http://localhost:3001](http://localhost:3001). It will send its GraphQL
requests to `https://localhost:3000/graphql`, though you can change this address
using the address bar in the playground itself if you'd like (see below).

## Configuration
If you'd like to to change the port number of the playground server, or its
default GraphQL endpoint url, you have a few ways of doing so.

You can provide them as command-line arguments:

```sh
graphql-playground-server --port 3002 --endpoint https://your.host/graphql
```


Create a yaml config file provide a path to it as a command line argument:

**graphql-playground-server.conf.yaml**
```yaml
port: 3002
endpoint: https://your.host/graphql
```

```sh
graphql-playground-server --config  graphql-playground-server.conf.yaml
```


Provide environment variables:

```sh
GRAPHQL_PLAYGROUND_PORT=3002 GRAPHQL_PLAYGROUND_ENDPOINT=https://your.host/graphql graphql-playground-server
```

Or any combination of the above. If you provide the same configuration option
in multiple ways, they will be prioritized like so: CLI args, config file
values, environment variables.


[1]: https://github.com/prisma-labs/graphql-playground
