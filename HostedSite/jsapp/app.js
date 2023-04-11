#!/usr/bin/env node

const http = require("http");
const crypto = require("crypto");

const locallydb = require('locallydb');
const db = new locallydb('./mydb');
const collection = db.collection('commentData');
let listOfUsers = [];



const parseData = (str, type) => {
  if(type === "application/x-www-form-urlencoded") {
    return Object.fromEntries(str.split("&").map((q) => q.split("=")))
  } else {
    return JSON.parse(str)
  }
}


const getBody = (req) => new Promise((resolve, reject) => {
  let body = ""
  // accumulate body
  req.on("data", (data) => {
    body += data
  })
  // body complete, try to parse
  req.on("end", () => {
    try {
      const parsed = parseData(body, req.headers["content-type"])
      resolve(parsed)
    } catch (e) {
      reject(parsed)
    }
  })
})

const parseBasic = (req) => {
  if(req.headers.authorization) {
    // split the value of the header "Basic lwjkjvljk"
    const [ _, value ] = req.headers.authorization.split(" ")
    // decode base64 string into binary values in a buffer
    const buff = Buffer.from(value, 'base64')
    // convert the buffer into string and split user:pass
    return buff.toString().split(":")
  }
  return []
}

const promptForAuth = (res) => {
  res.writeHead(401, {
    "WWW-Authenticate": "Basic"
  })
  res.end()
}

const sha256 = (content) => crypto.createHash("sha256")
   .update(content).digest("hex");

const authenticate = (req, res) => {
  const [user, pass] = parseBasic(req)
  if(user === "ducky" && sha256(pass) === "73a56f8746a365821cb299f9b39afc404f7b5170158feb43f57b21f50b974234") {
    return user
  }
  promptForAuth(res)
  return false
}
const requestHandler = (req, res) => {
  if(req.method === "POST") {
    const user = authenticate(req, res)
	if(user){
	getBody(req).then(body => {
     // body.id = lastId++;
      //listOfThings.push(body);
	collection.insert(body);
      	collection.save()
	res.writeHead(201)
    })
    .catch(() => res.writeHead(400))
    .finally(() => res.end())
	}
  } else if(req.method === "PUT") {
    const user = authenticate(req, res)
	if(user){
	getBody(req).then(body => {
	let index = body.cid * 1;
	collection.replace(index, body)
      	collection.save()
	res.writeHead(200)
    })
    .catch(() => res.writeHead(400))
    .finally(() => res.end())
	}
  } else if(req.method === "DELETE") {
    const user = authenticate(req, res)
	if(user){
	getBody(req).then(body => {
	let index = body.cid * 1
	collection.remove(index);
	collection.save()
	res.writeHead(200)
	})
	.catch(() => res.writeHead(400)).finally(() => res.end())
	}
  } else {
    // default assumes GET
    res.writeHead(200, {
      "Content-Type": "application/json",
    })
    res.write(JSON.stringify(collection.items))
    res.end()
  }
}

// create the server and provide it the handler
const server = http.createServer(requestHandler);
// instruct it to listen on TCP port 3000
server.listen(3000);


