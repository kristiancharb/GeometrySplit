var GeometrySplit = GeometrySplit || {};

GeometrySplit.LevelSelect = function () { };

GeometrySplit.LevelSelect.prototype = {
    preload: function () {

    },
    create: function () {

      this.game.stage.backgroundColor = '#fff';

      let menuKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
      menuKey.onDown.add(() => {
        this.state.start('MainMenu')
      });

      buttonBack = GeometrySplit.game.add.text(30, 50, '← Back', {});
      buttonBack.inputEnabled = true;
      buttonBack.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('MainMenu');
      }, this);

      buttonStart = GeometrySplit.game.add.text(30, 300, 'Stage 1', {});
      buttonStart.inputEnabled = true;
      buttonStart.events.onInputDown.add((e) => {
        GeometrySplit.game.state.start('Game');
      }, this);

      buttonStart2 = GeometrySplit.game.add.text(30, 300+50, 'Stage 2', { 'color': '#d3d3d3' });
      buttonStart2.inputEnabled = true;
      buttonStart2.addColor('#d3d3d3', 0);
      buttonStart2.events.onInputDown.add((e) => {
        //GeometrySplit.game.state.start('Game');
      }, this);

      buttonStart3 = GeometrySplit.game.add.text(30, 300+100, 'Stage 3', { 'color': '#d3d3d3' });
      buttonStart3.inputEnabled = true;
      buttonStart3.addColor('#d3d3d3', 0);
      buttonStart3.events.onInputDown.add((e) => {
        //GeometrySplit.game.state.start('Game');
      }, this);

      buttonStart4 = GeometrySplit.game.add.text(30, 300+150, 'Stage 4', { 'color': '#d3d3d3' });
      buttonStart4.inputEnabled = true;
      buttonStart4.addColor('#d3d3d3', 0);
      buttonStart4.events.onInputDown.add((e) => {
        //GeometrySplit.game.state.start('Game');
      }, this);

  },
};