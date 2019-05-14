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
        GeometrySplit.levelNum = 1;
        GeometrySplit.game.state.start('Game');
      }, this);

      buttonStart2 = GeometrySplit.game.add.text(30, 300+50, 'Stage 2', {});
      buttonStart2.inputEnabled = true;
      //buttonStart2.addColor('#d3d3d3', 0);
      buttonStart2.events.onInputDown.add((e) => {
        GeometrySplit.levelNum = 2;
        GeometrySplit.game.state.start('Game');
      }, this);

      buttonStart3 = GeometrySplit.game.add.text(30, 300+100, 'Stage 3', {});
      buttonStart3.inputEnabled = true;
      //buttonStart3.addColor('#d3d3d3', 0);
      buttonStart3.events.onInputDown.add((e) => {
        GeometrySplit.levelNum = 3;
        GeometrySplit.game.state.start('Game');
      }, this);

      buttonStart4 = GeometrySplit.game.add.text(30, 300+150, 'Stage 4', {});
      buttonStart4.inputEnabled = true;
      //buttonStart4.addColor('#d3d3d3', 0);
      buttonStart4.events.onInputDown.add((e) => {
        GeometrySplit.levelNum = 4;
        GeometrySplit.game.state.start('Game');
      }, this);
      buttonStart5 = GeometrySplit.game.add.text(150, 300, 'Stage 5', {});
      buttonStart5.inputEnabled = true;
      //buttonStart5.addColor('#d3d3d3', 0);
      buttonStart5.events.onInputDown.add((e) => {
        GeometrySplit.levelNum = 5;
        GeometrySplit.game.state.start('Game');
      }, this);
      buttonStart6 = GeometrySplit.game.add.text(150, 300+50, 'Stage 6', {});
      buttonStart6.inputEnabled = true;
      //buttonStart5.addColor('#d3d3d3', 0);
      buttonStart6.events.onInputDown.add((e) => {
        GeometrySplit.levelNum = 6;
        GeometrySplit.game.state.start('Game');
      }, this);
      buttonStart7 = GeometrySplit.game.add.text(150, 300+100, 'Stage 7', {});
      buttonStart7.inputEnabled = true;
      //buttonStart5.addColor('#d3d3d3', 0);
      buttonStart7.events.onInputDown.add((e) => {
        GeometrySplit.levelNum = 7;
        GeometrySplit.game.state.start('Game');
      }, this);
      buttonStart8 = GeometrySplit.game.add.text(150, 300+150, 'BONUS STAGE', {});
      buttonStart8.inputEnabled = true;
      //buttonStart5.addColor('#d3d3d3', 0);
      buttonStart8.events.onInputDown.add((e) => {
        GeometrySplit.levelNum = 8;
        GeometrySplit.game.state.start('Game');
      }, this);

  },
};