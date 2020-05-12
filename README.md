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

### As a Local Service
Ideally you want to install as a service, so that the server is always running
when your machine is on.

#### MacOS (with Homebrew)
```sh
brew tap batterii/graphql-playground-server

brew install graphql-playground-server

brew services start graphql-playground-server
```

#### Linux
TODO


### NPM Global Install
If for whatever reason you can't or would rather not install as a service, you
can install globally with npm:

```sh
npm i -g graphql-playground-server
```

Once installed you can run the server in a console like so:

```
graphql-playground-server
```

## Using the Playground
By default, you can access the playground while it is running at
[http://localhost:3001](http://localhost:3001). It will send its GraphQL
requests to `https://localhost:3000/graphql`, though you can change this address
using the address bar in the playground itself.

The server's port number and default GraphQL endpoint can be configured as
described below.

## Configuration

### Config Files
Configuration files for this server are simple yaml and only support two
properties: `port` and `endpoint`.

**graphql-playground-server.conf.yaml**
```yaml
port: 3002 # Changes the server's port number.
endpoint: https://your.host/graphql # Changes the url for graphql requests.
```

You can reference a config file when running the server like so:

```sh
graphql-playground-server --config  graphql-playground-server.conf.yaml
```

### MacOS Service
The service installed by the Homebrew formula looks for a configuration file at
`HOMEBREW_PREFIX/etc/graphql-playground-server.conf.yaml`. `HOMEBREW_PREFIX` is
typically `/usr/local`, but this may vary if you installed Homebrew differently
than usual.

To configure the service, simply create this file and populate it with your yaml
configuration as above. Once your configuration is in place, you just need to
restart the service to use it:

```
brew services restart graphql-playground-server
```

#### Linux Service
TODO

### Other Configuration Methods
In addition to using a config file, you can provide command-line arguments:

```sh
graphql-playground-server --port 3002 --endpoint https://your.host/graphql
```

You can also provide environment variables:

```sh
GRAPHQL_PLAYGROUND_PORT=3002 GRAPHQL_PLAYGROUND_ENDPOINT=https://your.host/graphql graphql-playground-server
```

If you provide the same configuration option in multiple ways, they will be
prioritized like so:

1. CLI args
2. config file values
3. environment variables


[1]: https://github.com/prisma-labs/graphql-playground
