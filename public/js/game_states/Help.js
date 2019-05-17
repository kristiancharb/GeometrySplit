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

        let lorem = 'You can split yourself into two pieces and switch control between these pieces. ' + 
        'When you\'re ready to put your pieces back together just collide together from the side and your pieces will merge. ' + 
        'Use your splitting ability to an advantage!'
        let backstory = 'You are Test Subject 117, the first successful experiment by Incorporated Inc. to inject consciousness into a geometric host. You realize the experiments lead to some nasty side-effects, such as giving you the ability to split up your body. Use this ability to escape this terrifying geometric world!'

        let move = GeometrySplit.game.add.text(30, 125, backstory, {fontSize: '2em', wordWrap: true, wordWrapWidth: 700 });
        let jump = GeometrySplit.game.add.text(30, 300, lorem, { fontSize: '2em', wordWrap: true, wordWrapWidth: 700 });
        let split = GeometrySplit.game.add.text(30, 500, 'Created By:', {});
        let swap = GeometrySplit.game.add.text(30, 550, 'Hong Jie Cen, Kristian Charbonneau, Henry Long', { fontSize: '2em' });
    },
};