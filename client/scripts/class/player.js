/**
 * Created by viller_m on 19/05/15.
 */
class Player {
    constructor(game, socket, groupColision) {

        this.game = game;
        this.socket = socket;
        this.groupColision = groupColision;

        this.id = socket.io.engine.id;
        this.color = this.generateColor();
        this.num = Util.randomInt(1, 50)
        this.num_mult = 0.3;
        this.mass = 20;
        this.speed_max = 400;
        this.speedX = 0;
        this.speedY = 0;
        this.acc = 5;
        this.speed = 0;
        this.x = this.game.world.randomX;
        this.y = this.game.world.randomY;
        this.char = game.char

        //this.game.char = game.char

        this.generateSprite();
    }

    generateSprite(){
        if(this.char == 1) var bmd = this.generateCircle(this.color);
        else if(this.char == 2) var bmd = this.generateSquare(this.color);

        this.sprite = this.game.add.sprite(this.x, this.y, bmd);
        this.game.physics.p2.enable(this.sprite, Phaser.Physics.ARCADE);

        // if(this.char == 1) this.setColision();
        // else if(this.char == 2) this.setSquareColision();
        this.setColision();

        this.sprite.id = this.id;
        this.sprite.color = this.color;
        this.sprite.num = this.num;
        this.sprite.num_mult = this.num_mult;
        this.sprite.mass = this.mass;
        this.sprite.speed_max = this.speed_max;
        this.sprite.speedX = this.speedX;
        this.sprite.speedY = this.speedY;
        this.sprite.acc = this.acc;
        this.sprite.speed = this.speed;
        
        this.sprite.char = this.char    //

        this.game.camera.follow(this.sprite);
    }

    generateColor(){
        var color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];
        return color[this.game.rnd.integerInRange(0, 5)];
    }

    generateCircle(){
        var bitmapSize = this.mass * 2
        var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
        bmd.ctx.fillStyle = this.color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(this.mass, this.mass, this.mass, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }

    generateSquare(){
        var bitmapSize = this.mass * 2
        var bmd = this.game.add.bitmapData(bitmapSize*1.77, bitmapSize*1.77);
        bmd.ctx.fillStyle = this.color;
        bmd.ctx.beginPath();
        bmd.ctx.rect(this.mass* 1.77 / 2, this.mass* 1.77 / 2, this.mass * 1.77, this.mass * 1.77);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }


    setColision(){
        if(this.char == 1){ 
            this.sprite.body.setCircle(this.sprite.width / 2); 
            this.sprite.body.fixedRotation = false;
        }
        else{
            this.sprite.body.setRectangle(this.sprite.width / 2, this.sprite.height / 2);
            this.sprite.body.fixedRotation = false;
        }
        this.sprite.body.setCollisionGroup(this.groupColision[0]);
        this.sprite.body.collides(this.groupColision[1], this.enemyCallback, this);
        this.sprite.body.collides(this.groupColision[2], this.itemsCallback, this);
    }

    enemyCallback(body1, body2){
        if(body2.sprite.alive && ((body2.sprite.num < this.sprite.num && this.sprite.num < body2.sprite.num*100) || (this.sprite.num *1000 < body2.sprite.num))){
            this.num = this.num + Math.floor(body2.sprite.num * body2.sprite.num_mult);
            this.speed = this.sprite.speed;
            this.speedX = this.sprite.speedX;
            this.speedY = this.sprite.speedY;
            this.x = this.sprite.x;
            this.y = this.sprite.y;

            this.sprite.kill();
            this.generateSprite();

            var enemy = {
                id: body2.sprite.id,
                username: body2.sprite.username,
                speed: body2.sprite.speed,
                speed_max: body2.sprite.speed_max,
                speedX: body2.sprite.speedX,
                speedY: body2.sprite.speedY,
                acc: body2.sprite.acc,
                num: body2.sprite.num,
                num_mult: body2.sprite.num_mult,
                color: body2.sprite.color,
                mass: body2.sprite.mass,
                x: body2.sprite.x,
                y: body2.sprite.y,
                height: body2.sprite.height,
                width: body2.sprite.width,
                killed: body2.sprite.killed,
                char : body2.sprite.char    //
            };

            body2.sprite.kill();
            this.socket.emit('kill_player', enemy);
        }
        else if(this.sprite.alive && ((this.sprite.num < body2.sprite.num && body2.sprite.num < this.sprite.num*100)||(body2.sprite.num * 1000 < this.sprite.num))){
            this.sprite.kill();
            this.socket.emit('kill_player', this.toJson());
        }
    }

    itemsCallback(body1, body2){
        if(body2.sprite.alive){
            this.num = this.sprite.num;
            this.speed = this.sprite.speed;
            this.speedX = this.sprite.speedX;
            this.speedY = this.sprite.speedY;
            this.x = this.sprite.x;
            this.y = this.sprite.y;

            if(body2.sprite.effect == "inc_num"){
                this.num = this.num + body2.sprite.inc_num
            }

            this.sprite.kill();
            this.generateSprite();

            body2.sprite.kill();
            this.socket.emit('update_items', body2.sprite.id);
        }
    }

    toJson () {
        return {
            id: this.sprite.id,
            username: this.sprite.username,
            speed: this.sprite.speed,
            speed_max: this.sprite.speed_max,
            speedX: this.sprite.speedX,
            speedY: this.sprite.speedY,
            acc: this.sprite.acc,
            num: this.sprite.num,
            num_mult: this.sprite.num_mult,
            mass: this.sprite.mass,
            color: this.sprite.color,
            x: this.sprite.x,
            y: this.sprite.y,
            height: this.sprite.height,
            width: this.sprite.width,
            killed: this.sprite.killed,
            char: this.sprite.char      //
        };
    }
    
    update(game){
        var cursors = game.input.keyboard.createCursorKeys();
        var EKey = game.input.keyboard.addKey(Phaser.Keyboard.E);

        if(cursors.left.isDown && cursors.up.isDown){
            this.sprite.speedX = this.sprite.speedX - this.sprite.acc / Math.pow(2, 0.5);
            this.sprite.speedY = this.sprite.speedY - this.sprite.acc / Math.pow(2, 0.5);
        } else if(cursors.left.isDown && cursors.down.isDown){
            this.sprite.speedX = this.sprite.speedX - this.sprite.acc / Math.pow(2, 0.5);
            this.sprite.speedY = this.sprite.speedY + this.sprite.acc / Math.pow(2, 0.5);
        } else if(cursors.right.isDown && cursors.down.isDown){
            this.sprite.speedX = this.sprite.speedX + this.sprite.acc / Math.pow(2, 0.5);
            this.sprite.speedY = this.sprite.speedY + this.sprite.acc / Math.pow(2, 0.5);
        } else if(cursors.right.isDown && cursors.up.isDown){
            this.sprite.speedX = this.sprite.speedX + this.sprite.acc / Math.pow(2, 0.5);
            this.sprite.speedY = this.sprite.speedY - this.sprite.acc / Math.pow(2, 0.5);
        } else if(cursors.left.isDown){
            this.sprite.speedX = this.sprite.speedX - this.sprite.acc;
        } else if(cursors.right.isDown){
            this.sprite.speedX = this.sprite.speedX + this.sprite.acc;
        } else if(cursors.up.isDown){
            this.sprite.speedY = this.sprite.speedY - this.sprite.acc;
        } else if(cursors.down.isDown){
            this.sprite.speedY = this.sprite.speedY + this.sprite.acc;
        } else{
            var mousePosX = this.game.input.activePointer.worldX;
            var mousePosY = this.game.input.activePointer.worldY;
            var _X = this.sprite.x;
            var _Y = this.sprite.y;
            var angle = Math.atan2(mousePosY - _Y, mousePosX - _X);
            game.debug.text("angle " + angle, 32, 320);
            game.debug.text("5 * " +Math.cos(angle) + " = " + this.sprite.acc * Math.cos(angle), 32, 340);
            game.debug.text("5 * " + Math.sin(angle) + " = " + this.sprite.acc * Math.sin(angle), 32, 360);
            this.sprite.speedX = this.sprite.speedX + this.sprite.acc * Math.cos(angle);
            this.sprite.speedY = this.sprite.speedY + this.sprite.acc * Math.sin(angle);
        }

        var speed_square = Math.pow(this.sprite.speedX, 2) + Math.pow(this.sprite.speedY, 2);
        var new_speed = Math.pow(speed_square, 0.5);

        if(Number(this.sprite.speed_max) < new_speed){
            game.debug.text("cut " + this.sprite.speed + " / " + new_speed, 32, 300);
            this.sprite.speedX = Number(this.sprite.speedX) * Number(this.sprite.speed_max) / new_speed;
            this.sprite.speedY = Number(this.sprite.speedY) * Number(this.sprite.speed_max) / new_speed;
            this.sprite.speed = this.sprite.speed_max;
        } else{
            game.debug.text("no cut", 32, 300);
            this.sprite.speed = new_speed;
        }
        game.physics.arcade.moveToXY(this.sprite, this.sprite.x+this.sprite.speedX, this.sprite.y+this.sprite.speedY, this.sprite.speed);
        
        this.sprite.num = this.sprite.num * 0.9999;

        if(EKey.isDown){
            this.sprite.num = this.sprite.num * 0.995
         }

        game.debug.text('new_speed: ' + new_speed, 32, 200);
        game.debug.text('new_speed_max: ' + this.sprite.speed_max, 32, 220);
        game.debug.text('speed_dif: ' + String(new_speed - Number(this.sprite.speed_max)), 32, 240);
        game.debug.text('speedX: ' + this.sprite.speedX, 32, 120);
        game.debug.text('speedY: ' + this.sprite.speedY, 32, 160);
        game.debug.text('speed: ' + this.sprite.speed, 32, 180);
        game.debug.text(this.sprite.num, this.sprite.x - game.camera.x - 10, this.sprite.y - game.camera.y+ 5);
        this.socket.emit('move_player', this.toJson());
    }
}

export default Player;