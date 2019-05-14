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

      let buttons = [
        { label: 'Stage 1',     x: 30,    y: 300, },
        { label: 'Stage 2',     x: 30,    y: 300+50, },
        { label: 'Stage 3',     x: 30,    y: 300+100, },
        { label: 'Stage 4',     x: 30,    y: 300+150, },
        { label: 'Stage 5',     x: 150,   y: 300, },
        { label: 'Stage 6',     x: 150,   y: 300+50, },
        { label: 'Stage 7',     x: 150,   y: 300+100, },
        { label: 'Bonus Stage', x: 150,   y: 300+150, },
      ];
      button_objects = {};

      for(var i = 0; i < buttons.length; i++) {
        button_objects[i] = GeometrySplit.game.add.text(buttons[i].x, buttons[i].y, buttons[i].label, {});
        button_objects[i].inputEnabled = true;
        button_objects[i].addColor('#d3d3d3', 0);
        button_objects[i].buttonNum = i+1;
        if(this.game.levelCount >= i+1) {
          button_objects[i].addColor('#000000', 0);
          button_objects[i].events.onInputDown.add((e) => {
            GeometrySplit.levelNum = e.events.parent.buttonNum;
            GeometrySplit.game.state.start('Game');
          }, this);
        }
      }
  },
};