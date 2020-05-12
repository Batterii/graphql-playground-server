#! /usr/bin/env node
const Koa = require('koa');
const { parse: parseYaml } = require('yaml');
const pkg = require('./package.json');
const { default: playground } = require('graphql-playground-middleware-koa');
const { program } = require('commander');
const { readFileSync } = require('fs');
const { resolve: resolvePath } = require('path');

program
	.option('-p, --port <number>', 'port number')
	.option('-e, --endpoint <url>', 'graphql endpoint url')
	.option('-c, --config <path>', 'configuration file path')

program.version(pkg.version);
program.parse(process.argv);

let config;
if (program.config) {
	const configPath = resolvePath(process.cwd(), program.config);
	config = parseYaml(readFileSync(configPath, 'utf8'));
} else {
	config = {};
}

const port =
	program.port ||
	config.port ||
	process.env.GRAPHQL_PLAYGROUND_PORT ||
	3001;

const endpoint =
	program.endpoint ||
	config.endpoint ||
	process.env.GRAPHQL_PLAYGROUND_ENDPOINT ||
	'https://localhost:3000/graphql';

const app = new Koa();
app.use(playground({ endpoint }));
app.listen(port, () => {
	console.log(`Serving playground at http://localhost:${port}`);
});
