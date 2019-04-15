var GeometrySplit = GeometrySplit || {};

//title screen
GeometrySplit.Help = function () { };

GeometrySplit.Help.prototype = {
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

        let lorem = 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'

        let move = GeometrySplit.game.add.text(30, 150, 'Backstory:', {});
        let jump = GeometrySplit.game.add.text(30, 200, lorem, { fontSize: '2em', wordWrap: true, wordWrapWidth: 600 });
        let split = GeometrySplit.game.add.text(30, 500, 'Created By:', {});
        let swap = GeometrySplit.game.add.text(30, 550, 'Hong Jie Cen, Kristian Charbonneau, Henry Long', { fontSize: '2em' });
    },
};