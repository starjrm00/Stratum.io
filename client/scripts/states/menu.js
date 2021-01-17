'use strict';

class Menu {
    create() {
        var tmpLgo = this.game.cache.getImage('logo');  //logo
        var logo = this.add.sprite(
            (this.game.width - tmpLgo.width) / 2,
            (this.game.height - tmpLgo.height) / 2,
            'logo' //logo
        );
        this.game.input.onDown.add(this.startGame, this);
    }

    startGame() {
        this.game.state.start('select');  //game
    }
}

export default Menu;
