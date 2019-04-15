var GeometrySplit = GeometrySplit || {};

//loading the game assets
GeometrySplit.Load = function(){};

GeometrySplit.Load.prototype = {
    preload: function () {
        this.game.stage.backgroundColor = '#fff';
        GeometrySplit.game.add.text(30, 300-50, 'Geometry', { 'fontSize': '7.5em' });
        GeometrySplit.game.add.text(380, 300-50, 'Split', { 'fontSize': '7.5em', fill: '#94d46c' });
        GeometrySplit.game.add.text(30, 350, 'Hong Jie Cen, Kristian Charbonneau, Henry Long', { 'fontSize': '2em' });
        /*this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);*/
    },
    create: function () {
        this.game.time.events.add(Phaser.Timer.SECOND * 2, ()=>{this.state.start('MainMenu');}, this);
    }
};