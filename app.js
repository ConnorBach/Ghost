var http = require('http')

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(8000);

console.log("Server running on port 8000.\n")

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter a word to lookup: ', (answer) => {
    console.log(`${answer}`);
    rl.close();
});
