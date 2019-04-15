var GeometrySplit = GeometrySplit || {};

GeometrySplit.LevelSelect = function () { };

GeometrySplit.LevelSelect.prototype = {
    preload: function () {

    },
    create: function () {

      this.game.stage.backgroundColor = '#e8e8e8';

      buttonStart = GeometrySplit.game.add.text(30, 600-50, 'Back', {});
      buttonStart.inputEnabled = true;
      buttonStart.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('MainMenu');
      }, this);

      buttonStart = GeometrySplit.game.add.text(30, 300, 'Stage 1', {});
      buttonStart.inputEnabled = true;
      buttonStart.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Game');
      }, this);

      buttonStart = GeometrySplit.game.add.text(30, 300+50, 'Stage 2', {});
      buttonStart.inputEnabled = true;
      buttonStart.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Game');
      }, this);

  },
};