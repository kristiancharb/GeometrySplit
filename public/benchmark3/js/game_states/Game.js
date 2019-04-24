var GeometrySplit = GeometrySplit || {};

GeometrySplit.Game = function(){};

GeometrySplit.Game.prototype = {
    preload: function() {
        GeometrySplit.levelNum = GeometrySplit.levelNum || 1;
        this.level = new Level(GeometrySplit.game);
        if(this.levelNum > 2) {
            this.state.start('MainMenu')
        }
        this.level.preload('assets/Level' + GeometrySplit.levelNum + '.json');
    },
    create: function() {
        this.level.create();
    },
    update: function() {
        this.level.update();
     }
}
