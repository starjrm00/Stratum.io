/**
 * Created by viller_m on 19/05/15.
 */
class Enemy {
    constructor(game, enemy, groupColision) {
        this.game = game;
        this.enemy = enemy;
        this.groupColision = groupColision;
        this.generateSprite();
    }

    generateSprite(){
        if(this.enemy.char == 1) var bmd = this.generateCircle(this.enemy.color);
        else if(this.enemy.char == 2) var bmd = this.generateSquare(this.enemy.color);

        this.sprite = this.game.add.sprite(this.enemy.x, this.enemy.y, bmd);
        this.game.physics.p2.enable(this.sprite, Phaser.Physics.ARCADE);

        this.setColision();

        this.sprite.id = this.enemy.id;
        this.sprite.username = '';
        this.sprite.color = this.enemy.color;
        this.sprite.num = this.enemy.num;
        this.sprite.num_mult = this.enemy.num_mult;
        this.sprite.mass = this.enemy.mass;
        this.speed_max = this.enemy.speed_max;
        this.speed_X = this.enemy.speed_X;
        this.speed_Y = this.enemy.speed_Y;
        this.acc = this.enemy.acc;
        this.sprite.speed = this.enemy.speed;
        this.sprite.width = this.enemy.width;
        this.sprite.height = this.enemy.height;
    }

    generateCircle(color){
        var bitmapSize = this.enemy.mass * 2
        var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(this.enemy.mass, this.enemy.mass, this.enemy.mass, 0, Math.PI*2, true);
        bmd.ctx.fill();
        return bmd;
    }

    generateSquare(color){
        var bitmapSize = this.enemy.mass * 2
        var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.rect(this.enemy.mass* 1.77 / 2, this.enemy.mass* 1.77 / 2, this.enemy.mass * 1.77, this.enemy.mass * 1.77);
        bmd.ctx.fill();
        return bmd;
    }

    setColision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.setCollisionGroup(this.groupColision[1]);
        this.sprite.body.collides([this.groupColision[0], this.groupColision[2]]);
    }

    move(item){
        if(this.sprite.alive){
            this.sprite.kill();
        }
        this.enemy = item;
        this.generateSprite();
    }
}

export default Enemy;