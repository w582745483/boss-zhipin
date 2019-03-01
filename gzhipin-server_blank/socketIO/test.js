
// module.exports = function (server) {
//     //得到IO对象
//     const io = require('socket.io')(server)
//     //监视连接（当有一个客户端连接上时回调）
//     io.on('connection', function (socket) {
//         console.log('socketio connected')
//         //绑定sendMsg监听，接受客户端发送的消息
//         socket.on('sendMsg', function (data) {
//             console.log('服务器接受到浏览器的消息', data)
//             //向客户端发送消息
//             io.emit('receiveMsg', data.name + '_' + data.date)
//             console.log('服务器向浏览器发送消息', data)
//         })
//     })
    
// }

var http = require('http');
var url=require('url');
http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var content = '';
    var opt = {
         host:'news.163.com',
         port:'80',
         method:'GET',
         path:pathname
    };
    var req = http.request(opt, function(res) {
        res.on('data',function(body){
            console.log('return');
            content+=body;
        }).on("end", function () {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    req.end();
}).listen(80);//监听端口80,将80端口的请求转发到news.163.com




