class Particles {
    constructor(game, particle, groupColision, groupParticles) {
        this.game = game;
        this.particle = particle;
        this.groupColision = groupColision;
        this.groupParticles = groupParticles;
        this.generateSprite();
    }

    generateSprite(){
        this.sprite = this.game.add.sprite(this.particle.x, this.particle.y, 'start1');
        this.sprite.anchor.setTo(0.5, 0.5)

        //var bmd = this.generateCircle(this.particle.color);
        //this.sprite = this.game.add.sprite(this.particle.x, this.particle.y, bmd);
        
        this.game.physics.p2.enable(this.sprite, false);

        this.setColision();

        this.sprite.id = this.particle.id;
        this.sprite.mass = this.particle.mass;
    }

    generateCircle(color){
        var bmd = this.game.add.bitmapData(200,200);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(100, 100, 100, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }

    setColision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.setCollisionGroup(this.groupColision[3]);
        this.sprite.body.collides([this.groupColision[0], this.groupColision[1], this.groupColision[2]]);
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