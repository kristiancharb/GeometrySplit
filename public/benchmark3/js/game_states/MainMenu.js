var GeometrySplit = GeometrySplit || {};

var buttonStart, buttonLevelSelect, buttonSettings;

//title screen
GeometrySplit.MainMenu = function () { };

GeometrySplit.MainMenu.prototype = {
    preload: function () {

      this.game.load.audio('loop', 'assets/audio/Retro Beat.ogg');
      this.game.add.audio('loop');

    },
    create: function () {
      this.game.sound.stopAll();
      this.game.sound.play('loop', 0.75, true);
      this.game.stage.backgroundColor = '#fff';

      GeometrySplit.game.add.text(30, 300-50, 'Geometry', { 'fontSize': '7.5em' });
      GeometrySplit.game.add.text(380, 300-50, 'Split', { 'fontSize': '7.5em', fill: '#94d46c' });

      buttonStart = GeometrySplit.game.add.text(30, 350, 'Start Game', { fill: '#94d46c' });
      buttonStart.inputEnabled = true;
      buttonStart.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Game');
      }, this);

      buttonLevelSelect = GeometrySplit.game.add.text(30, 350+50, 'Level Select', {});
      buttonLevelSelect.inputEnabled = true;
      buttonLevelSelect.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('LevelSelect');
      }, this);

      buttonSettings = GeometrySplit.game.add.text(30, 350+100, 'Controls', {});
      buttonSettings.inputEnabled = true;
      buttonSettings.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Controls');
      }, this);

      buttonSettings = GeometrySplit.game.add.text(30, 350+150, 'Help', {});
      buttonSettings.inputEnabled = true;
      buttonSettings.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Help');
      }, this);

  },
  shutdown: function() {
    this.game.world.removeAll();
  }
};