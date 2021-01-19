'use strict';

class Preload {
    preload(game) {
        // Add preload sprite
        var tmpPreload = this.game.cache.getImage('preloader');
        this.loadingSprite = this.add.sprite(
            (game.width - tmpPreload.width) / 2,
            (game.height - tmpPreload.height) / 2,
            'preloader'
        );

        // run preload sprite
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.loadingSprite);

        // Load game assets here
        this.load.image('logo', 'assets/logo.png');
        this.load.image('grid', 'assets/grid.jpeg');

        this.load.image('char1', 'assets/character_1.png');
        this.load.image('char2', 'assets/character_2.png');
        this.load.image('char3', 'assets/character_3.png');
        this.load.image('bgSelect', 'assets/select.png');

        this.game.load.spritesheet('btn1', 'assets/circle.png', 1000, 1000)
        this.game.load.spritesheet('btn2', 'assets/square.png', 1000, 1000)
        this.game.load.spritesheet('start1', 'assets/particle1.png', 1000, 1000)



        game.time.advancedTiming = true;
    }

    onLoadComplete() {
        this.game.state.start('menu', true, false);
    }
}

export default Preload;
