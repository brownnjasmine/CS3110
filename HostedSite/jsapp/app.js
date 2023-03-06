#!/usr/bin/env node

const http = require("http");
const persist = [];
const parseData = (query) => Object.fromEntries(query.split("&").map(
	(q) => q.split("=")))

const requestHandler = (req, res) => {

	console.log(Object.keys(req))
	console.log(req.method)
	console.log(req.url)

	res.writeHead(200, {
		"Content-Type": "application/json",
	})

	if(req.method === "POST") {
		let body = ""
		req.on("data", (data) => {
		body += data
		})
		req.on("end", () => {
		persist.push(parseData(body))
		res.write(JSON.stringify(parseData(body)))
		res.end()
		})
	} else {
		const [ path, query ] = req.url.split('?')
		const params = query && parseData(query)
		res.write(JSON.stringify(persist, params))
		res.end()
	}
}
const server = http.createServer(requestHandler);
server.listen(3000);
