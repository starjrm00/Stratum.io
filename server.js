var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/client'));
app.get('/', function(req, res){
    res.sendfile(__dirname + '/client/index.html');
});

var color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00', '#E6E6E6'];      //마지막 색은 장애물 색
var users = [];
var nbItem = 80;
var items = [];
var nbParticle = 10;
var particles = [];

for (var i = 0; i < nbItem; i++)
{
    if(i*4 < nbItem){
        items[i] = {
            x: randomIntInc(0, 3000),
            y: randomIntInc(0, 3000),
            color: color[randomIntInc(0, 5)],
            id: i,
            effect: "inc_num",
            inc_num: 30
        };
    }else if(i*4 < nbItem*2){
        items[i] = {
            x: randomIntInc(0, 3000),
            y: randomIntInc(0, 3000),
            color: color[randomIntInc(0, 5)],
            id: i,
            effect: "inc_sp_m",
            inc_sp_m: 3
        };
    }else if(i*4 < nbItem*3){
        items[i] = {
            x: randomIntInc(0, 3000),
            y: randomIntInc(0, 3000),
            color: color[randomIntInc(0, 5)],
            id: i,
            effect: "inc_acc_m",
            inc_acc_m: 3
        };
    }else{
        items[i] = {
            x: randomIntInc(0, 3000),
            y: randomIntInc(0, 3000),
            color: color[randomIntInc(0, 5)],
            id: i,
            effect: "dec_mass",
            dec_mass: 0.9
        };
    }
}

for (var i = 0; i < nbParticle; i++)
{
    particles[i] = {
        x: randomIntInc(0, 3000),
        y: randomIntInc(0, 3000),
        color: color[6],
        id: i,
        mass: 1
    };
}


io.on('connection', function(socket){
    var me = false;
    /*
    setInterval(giveNum, 5000);

    function giveNum(){
        var empty = true
        var mini = 0;
        var id;
        console.log("giveNum");
        for(var k in users){
            empty = false;
            if(mini < users[k].num){
                mini = users[k].num;
            }
        }
        if(empty == false){
            console.log("users are not empty")
            for(var k in users){
                if(mini >= users[k].num){
                    mini = users[k].num;
                    id = k;
                    console.log("id is "+id);
                }
            }
            item = {
                id: 'inc_num',
                inc_num: 30
            }
            console.log(users[id]+" + ", item);
            socket.emit('use_item', users[id], item);
        }
    }
*/
    socket.on('new_player', function(user){
        me = user;
        socket.emit('getItems', items);
        socket.emit('getParticles', particles)

        for (var k in users){
            socket.emit('new_player', users[k]);
        }

        users[me.id] = me;
        socket.broadcast.emit('new_player', user);
    });

    socket.on('update_items', function(id){
        items[id] = {
            x: randomIntInc(0, 3000),
            y: randomIntInc(0, 3000),
            color: color[randomIntInc(0, 5)],
            id: id,
            effect: "inc_num",
            inc_num: 30
        };
        io.emit('update_items', items[id]);
    });

    socket.on('update_particles', function(id){
        particles[id] = {
            x: randomIntInc(0, 3000),
            y: randomIntInc(0, 3000),
            color: color[6],
            id: id,
            mass: 1
        };
        io.emit('update_particles', particles[id]);
    });

    socket.on('move_player', function(user){
        users[me.id] = user;
        socket.broadcast.emit('move_player', user);
    });

    socket.on('kill_player', function(enemy){
        delete users[enemy.id];
        io.emit('kill_player', enemy);
    });

    socket.on('disconnect', function(){
        if(!me){
            return false;
        }
        delete users[me.id];
        socket.broadcast.emit('logout', me.id);
    });

});

server.listen(3000, function(){
    console.log('listening on *:3000');
});

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
