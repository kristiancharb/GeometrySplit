var GeometrySplit = GeometrySplit || {};

//loading the game assets
GeometrySplit.Load = function(){};

GeometrySplit.Load.prototype = {
    preload: function () {
        /*this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);*/
    },
    create: function () {
        console.log('state: load');
        this.state.start('MainMenu');
    }
};