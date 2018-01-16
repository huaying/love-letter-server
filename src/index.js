import express from 'express';
import morgan from 'morgan';
import SocketIO from 'socket.io';

const app = express();

// logger
app.use(morgan('dev'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Started on port ${server.address().port}`);
});

const io = SocketIO(server);

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
