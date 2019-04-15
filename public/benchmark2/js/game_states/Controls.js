var GeometrySplit = GeometrySplit || {};

//title screen
GeometrySplit.Controls = function () { };

GeometrySplit.Controls.prototype = {
    create: function () {

        this.game.stage.backgroundColor = '#fff';

        let menuKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
        menuKey.onDown.add(() => {
            this.state.start('MainMenu')
        });

        buttonSettings = GeometrySplit.game.add.text(30, 50, '← Back', {});
        buttonSettings.inputEnabled = true;
        buttonSettings.events.onInputDown.add((e) => {
            GeometrySplit.game.state.start('MainMenu');
        }, this);

        let move = GeometrySplit.game.add.text(30, 300-100, 'Move: A & D', {});
        let jump = GeometrySplit.game.add.text(30, 300-50, 'Jump: Space', {});
        let split = GeometrySplit.game.add.text(30, 300+0, 'Split: R', {});
        let swap = GeometrySplit.game.add.text(30, 300+50, 'Swap: Q & E', {});
    },
};