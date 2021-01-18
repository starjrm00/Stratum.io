'use strict';

import Enemy from 'scripts/class/enemy';
import Player from 'scripts/class/player';
import Particles from 'scripts/class/particles';

class Game {
    create(game) {

        this.socket = io.connect(window.location.host);
        this.players = [];
        this.particles = [];

        this.color = ['#999999', '#CCCCCC', '#00FF00', '#0000FF', '#FF0000', '#FFFF00'];

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        game.stage.backgroundColor = '#000';
        game.world.setBounds(0, 0, 5000, 5000);
        game.add.tileSprite(0, 0, game.world.width, game.world.height, 'grid');

        game.camera.bounds.setTo(-game.width/2, -game.height/2, game.world.width + game.width, game.world.height + game.height);

        var groupPlayer = game.physics.p2.createCollisionGroup();
        var groupPlayers = game.physics.p2.createCollisionGroup();
        var groupParticle = game.physics.p2.createCollisionGroup();
        this.groupColision = [groupPlayer, groupPlayers, groupParticle];
        game.physics.p2.updateBoundsCollisionGroup();

        this.groupParticles = game.add.group();
        this.groupParticles.enableBody = true;
        this.groupParticles.physicsBodyType = Phaser.Physics.P2JS;

        this.groupEnemy = game.add.group();
        this.groupEnemy.enableBody = true;
        this.groupEnemy.physicsBodyType = Phaser.Physics.P2JS;

        this.setEventHandlers(game);

        this.timer = this.game.time.create(false);
        this.timer.loop(2500, this.giveNum, this);
        this.timer.start();

    }

    giveNum(){
        this.game.debug.text("GIVENUM", 800, 800);
    }

    setEventHandlers(game){
        this.socket.on('connect', () => {
            this.player = new Player(game, this.socket, this.groupColision);
            this.socket.emit('new_player', this.player.toJson());

            // particles
            this.socket.on('getParticles', (particles) => {
                for (var particle of particles) {
                    this.particles[particle.id] = new Particles(game, particle, this.groupColision);
                }
            });

            this.socket.on('update_particles', (particle) => {
                this.particles[particle.id].move(particle);
            });

            // new player
            this.socket.on('new_player', (enemy) => {
                this.players[enemy.id] = new Enemy(game, enemy, this.groupColision);
            });

            // Player
            this.socket.on('move_player', (enemy) => {
                if(this.players[enemy.id]){
                    this.players[enemy.id].move(enemy);
                }
            });

            this.socket.on('kill_player', (user) => {
                if(this.player.id == user.id) {
                    this.player.sprite.kill();
                    this.player.x = game.world.randomX;
                    this.player.y = game.world.randomY;
                    this.player.mass = 20;
                    this.player.generateSprite();
                }
            });

            this.socket.on('logout', (id) => {
                this.players[id].sprite.kill();
                delete this.players[id];
            });
        });
    }

    update(game) {
        if (this.player) {
            this.player.update(game);
        }

        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.text('fps: '+ game.time.fps || '--', 32, 140);

        //game.world.scale.set(1);
    }
}

export default Game;
