'use strict';

class Select {

    preload(game) {

        game.stage.backgroundColor = '#D8D8D8';
        var btn1Image = this.game.cache.getImage('btn1');
        var btn1 = this.game.add.sprite(this.game.world.centerX-50-btn1Image.width, this.game.world.centerY-250, 'btn1', 0);
        var btn2 = this.game.add.sprite(this.game.world.centerX+50, this.game.world.centerY-250, 'btn2', 0);
        btn1.inputEnabled = true;
        btn2.inputEnabled = true;

        var text = game.add.text(game.world.centerX, game.world.centerY-300, "Select Your Character!", {
            font: "40px Arial",
            fill: "#424242",
            align: "center"
        });
        text.anchor.setTo(0.5, 0.5);

        var state1 = game.add.text(game.world.centerX-btn1Image.width-30, game.world.centerY+120, "Max speed  : 350 \nAcceleration : 10", {
            font: "28px Arial",
            fill: "#424242",
            align: "front"
        });
        text.anchor.setTo(0.5, 0.5);

        var state2 = game.add.text(game.world.centerX+70, game.world.centerY+120, "Max speed : 300 \nAcceleration : 15", {
            font: "28px Arial",
            fill: "#424242",
            align: "front"
        });
        text.anchor.setTo(0.5, 0.5);

        btn1.events.onInputDown.add(listener1, this);
        btn2.events.onInputDown.add(listener2, this);

        function listener1(sprite, pointer) {
            game.char = 1
            this.game.state.start('game');
        }

        function listener2(sprite, pointer) {
            game.char = 2
            this.game.state.start('game');
        }


    }
}

export default Select;
