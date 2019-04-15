var GeometrySplit = GeometrySplit || {};

var buttonStart, buttonLevelSelect, buttonSettings;

//title screen
GeometrySplit.MainMenu = function () { };

GeometrySplit.MainMenu.prototype = {
    preload: function () {

      

    },
    create: function () {

      this.game.stage.backgroundColor = '#fff';

      buttonStart = GeometrySplit.game.add.text(30, 300, 'Start Game', {});
      buttonStart.inputEnabled = true;
      buttonStart.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Game');
      }, this);

      buttonLevelSelect = GeometrySplit.game.add.text(30, 300+50, 'Level Select', {});
      buttonLevelSelect.inputEnabled = true;
      buttonLevelSelect.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('LevelSelect');
      }, this);

      buttonSettings = GeometrySplit.game.add.text(30, 300+100, 'Controls', {});
      buttonSettings.inputEnabled = true;
      buttonSettings.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Controls');
      }, this);

      buttonSettings = GeometrySplit.game.add.text(30, 300+150, 'Help', {});
      buttonSettings.inputEnabled = true;
      buttonSettings.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Help');
      }, this);

  },
  shutdown: function() {
    this.game.world.removeAll();
  }
};