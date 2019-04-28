var GeometrySplit = GeometrySplit || {};

GeometrySplit.game = new Phaser.Game(800, 600, Phaser.CANVAS, '');

GeometrySplit.game.state.add('Load', GeometrySplit.Load);
GeometrySplit.game.state.add('MainMenu', GeometrySplit.MainMenu);
GeometrySplit.game.state.add('LevelSelect', GeometrySplit.LevelSelect);
GeometrySplit.game.state.add('Game', GeometrySplit.Game);
GeometrySplit.game.state.add('Controls', GeometrySplit.Controls);
GeometrySplit.game.state.add('Help', GeometrySplit.Help);

GeometrySplit.game.state.start('Load');