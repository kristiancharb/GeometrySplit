var GeometrySplit = GeometrySplit || {};

//title screen
GeometrySplit.Help = function () { };

GeometrySplit.Help.prototype = {
    create: function () {
        this.game.stage.backgroundColor = '#d3d3d3';

        buttonSettings = GeometrySplit.game.add.text(30, 600-50, 'Back', {});
        buttonSettings.inputEnabled = true;
        buttonSettings.events.onInputDown.add((e) => {
            GeometrySplit.game.state.start('MainMenu');
        }, this);

        let move = GeometrySplit.game.add.text(30, 300, 'Backstory:', {});
        let jump = GeometrySplit.game.add.text(30, 300+50, 'Lorem Ipsum', {});
        let split = GeometrySplit.game.add.text(30, 300+100, 'Created By:', {});
        let swap = GeometrySplit.game.add.text(30, 300+150, 'Lorem Ipsum', {});
    },
};