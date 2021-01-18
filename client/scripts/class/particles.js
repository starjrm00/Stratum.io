/**
 * Created by viller_m on 19/05/15.
 */
class Particles {
    constructor(game, particle, groupColision, groupParticles) {
        this.game = game;
        this.particle = particle;
        this.groupColision = groupColision;
        this.groupParticles = groupParticles;
        this.generateSprite();
    }

    generateSprite(){
        var bmd = this.generateCircle(this.particle.color);

        this.sprite = this.game.add.sprite(this.particle.x, this.particle.y, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setColision();

        this.sprite.id = this.particle.id;
        this.sprite.mass = this.particle.mass;
    }

    generateCircle(color){
        var bmd = this.game.add.bitmapData(20,20);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }

    setColision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.setCollisionGroup(this.groupColision[2]);
        this.sprite.body.collides([this.groupColision[0], this.groupColision[1]]);
    }

    move(particle){
        if(this.sprite.alive){
            this.sprite.kill();
        }
        this.particle = particle;
        this.generateSprite();
    }
}

export default Particles;