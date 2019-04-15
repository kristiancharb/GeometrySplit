var GeometrySplit = GeometrySplit || {};

//title screen
GeometrySplit.Controls = function () { };

GeometrySplit.Controls.prototype = {
    create: function () {

        this.game.stage.backgroundColor = '#fff';

        buttonSettings = GeometrySplit.game.add.text(30, 600-50, 'Back', {});
        buttonSettings.inputEnabled = true;
        buttonSettings.events.onInputDown.add((e) => {
            GeometrySplit.game.state.start('MainMenu');
        }, this);

        let move = GeometrySplit.game.add.text(30, 300, 'Move: A & D', {});
        let jump = GeometrySplit.game.add.text(30, 300+50, 'Jump: Space', {});
        let split = GeometrySplit.game.add.text(30, 300+100, 'Split: R', {});
        let swap = GeometrySplit.game.add.text(30, 300+150, 'Swap: Q & E', {});
    },
};