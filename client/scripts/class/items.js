class Items {
    constructor(game, item, groupColision, groupItems) {
        this.game = game;
        this.item = item;
        this.groupColision = groupColision;
        this.groupItems = groupItems;
        this.generateSprite();
    }

    generateSprite(){
        var bmd = this.generateCircle(this.item.color);

        this.sprite = this.game.add.sprite(this.item.x, this.item.y, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setColision();

        this.sprite.id = this.item.id;
        this.sprite.effect = this.item.effect;
        if(this.sprite.effect == "inc_num"){
            this.sprite.inc_num = this.item.inc_num;
        }
        if(this.sprite.effect == "inc_sp_m"){
            this.sprite.inc_sp_m = this.item.inc_sp_m;
        }
        if(this.sprite.effect == "inc_acc_m"){
            this.sprite.inc_acc_m = this.item.inc_acc_m;
        }
        if(this.sprite.effect == "dec_mass"){
            this.sprite.dec_mass = this.item.dec_mass;
        }
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
        this.sprite.body.collides([this.groupColision[0], this.groupColision[1], this.groupColision[3]]);
    }

    move(item){
        if(this.sprite.alive){
            this.sprite.kill();
        }
        this.item = item;
        this.generateSprite();
    }
}

export default Items;