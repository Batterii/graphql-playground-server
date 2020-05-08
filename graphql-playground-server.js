#! /usr/bin/env node
const Koa = require('koa');
const { default: playground } = require('graphql-playground-middleware-koa');

const port = process.env.GRAPHQL_PLAYGROUND_PORT || 3001
const endpoint = process.env.GRAPHQL_PLAYGROUND_ENDPOINT ||
	'https://localhost:3000/graphql';

const app = new Koa();
app.use(playground({ endpoint }));
app.listen(port);
