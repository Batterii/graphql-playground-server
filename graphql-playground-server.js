#! /usr/bin/env node
const Koa = require('koa');
const { default: playground } = require('graphql-playground-middleware-koa');
const pkg = require('./package.json');

const arg = process.argv[2];
if (arg === '--version' || arg === '-v') {
	console.log(pkg.version);
	process.exit(0);
}

const port = process.env.GRAPHQL_PLAYGROUND_PORT || 3001
const endpoint = process.env.GRAPHQL_PLAYGROUND_ENDPOINT ||
	'https://localhost:3000/graphql';

const app = new Koa();
app.use(playground({ endpoint }));
app.listen(port, () => {
	console.log(`Serving playground at http://localhost:${port}`);
});
