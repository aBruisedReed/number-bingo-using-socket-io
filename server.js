var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// view engine set 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => { // 루트를 main.pug로 라우팅 
  res.render('main', { title: 'Online Number Bingon', username: req.query.username });
});

var users = {}; 
var userCount = 0;
var turnCount = 0;

io.on('connection', function(socket) {
  console.log('user connected : ', socket.id);

  socket.on('join', function(data) {
    var username = data.username;
    socket.username = username;

    users[userCount] = {};
    users[userCount].id = socket.id;
    users[userCount].name = name;
    users[userCount].turn = false;
    userCount++;

    io.emit('update users', users, userCount);
  });

  socket.on('game start', function (data) {
    // broadcast.emit => 자신을 제외한 전체
    socket.broadcast.emit('game started', data); 
    users[turnCount].turn = true;

    io.emit('update users', users);
  });

  socket.on('select', function(data) {
    socket.broadcast.emit('check number', data);

    users[turn_count].turn = false;
    turnCount++;

    if(turnCount >= userCount) {
      turnCount = 0;
    }
    users[turnCount].turn = true;
  
    io.emit('update users', users);
  });

  socket.on('disconnect', function() {
    console.log('users disconnected :', socket.id, socket.username);
    for(var i=0; i<userCount; i++) {
      if(users[i].id == socket.id) {
        // delete > 배열의 요소나 객체의 속성 삭제
        delete users[i]; 
      }
    }

    userCount--;
    io.emit('update_users', users, userCount);
  });
});

http.listen(3000, function() {
  console.log('server on...');
});
