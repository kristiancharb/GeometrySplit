class Level {
    constructor(game) {
        this.game = game;
        this.map;
        this.backgroundLayer;
        this.blockedLayer;
        this.moveableLayers = {};
        this.currentPlayer;
        this.exit;
        this.levers = Array();
        this.cursors;
        this.jumpButton;
        this.players;
        this.hazards;
        this.originalSize;
        this.lockedLeft;
        this.lockedRight;
    }

    preload(levelPath) {
        console.log('LEVEL PATH')
        console.log(levelPath)
        this.game.stage.backgroundColor = '#fff';
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.load.tilemap('map', levelPath, null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('player', 'assets/square-sprite.png', 64, 64, 3);
        this.game.load.spritesheet('door', 'assets/door-sprite.png', 32, 64, 1);
        this.game.load.spritesheet('lever', 'assets/lever-sprite.png', 32, 32);
        this.game.load.spritesheet('spike', 'assets/spike.png',32,32,1);
        this.game.load.image('tiles', 'assets/tileset.png');

        let menuKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        menuKey.onDown.add(() => {
            this.game.paused = false;
            this.game.state.start('MainMenu');
        });

        let pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        pauseKey.onDown.add(() => {
            this.game.paused = !this.game.paused;
        });
    }

    create() {
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tileset', 'tiles');
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        this.backgroundlayer.resizeWorld();
        this.blockedLayer = this.map.createLayer('blockedLayer');
        this.map.layers.forEach((layer) => {
            if(layer.properties[1] && layer.properties[1].value === 'moveableLayer') {
                var l = this.map.createLayer(layer.name);
                this.moveableLayers[layer.properties[0].value] = l;
                l.kill();
                this.map.setCollisionBetween(1, 5000, true, layer.name);
            }
        })
        this.map.setCollisionBetween(1, 5000, true, 'blockedLayer');
    
        var exitObj = this.findObjectsByType('exit', 'objectsLayer');
        this.exit = this.game.add.sprite(exitObj[0].x, exitObj[0].y, 'door');
        this.exit.enableBody = true;

        this.game.physics.arcade.gravity.y = 1000;
        //console.log(lever);
        //console.log("SKIP");
        this.players = this.game.add.group();
        this.hazards = this.game.add.group();
    
    
        // In the objects layer, the tilemap has a tile with the property playerStart
        // denoting the spawn location
        var player = this.findObjectsByType('playerStart', 'objectsLayer');
        this.currentPlayer = this.game.add.sprite(player[0].x, player[0].y, 'player');
        this.originalSize = this.currentPlayer.width;
        this.playerSetUp(this.currentPlayer);
        this.currentPlayer.animations.play('current', 8, true);
        this.game.camera.follow(this.currentPlayer);
        var spikes = this.findObjectsByType('spike', 'objectsLayer');
        spikes.forEach((element) => {
            var newSpike = this.game.add.sprite(element.x, element.y, 'spike');
            //console.log(newSpike);
            this.hazards.add(newSpike);
        });
        var leverObjs = this.findObjectsByType('lever', 'objectsLayer')
        leverObjs.forEach((leverObj) => {
            var lever = this.game.add.sprite(leverObj.x + this.map.tileWidth / 2, leverObj.y + this.map.tileWidth / 2, 'lever');
            this.levers.push(lever)
            lever.moveableLayer = this.moveableLayers[leverObj.properties[0].value]
            lever.anchor.setTo(0.5, 0.5)
            lever.bringToTop()
        })
    
        //set up controls
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var splitButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        splitButton.onDown.add(() => this.split());
        var cycleLeftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        cycleLeftButton.onDown.add(() => this.cyclePlayer(true))
        var cycleRightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        cycleRightButton.onDown.add(() => this.cyclePlayer(false));
        var interactButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
        interactButton.onDown.add(() => {
            this.levers.forEach((lever) => {
                if(this.currentPlayer.overlap(lever)) {
                    lever.scale.x *= -1;
                    if(lever.moveableLayer.alive) {
                        lever.moveableLayer.kill();
                    } else {
                        lever.moveableLayer.revive();
                    }
                }
            })
        });
    }

    update() {
        if(Math.floor(this.currentPlayer.body.width) === this.originalSize) {
            this.checkLevelComplete();
        }
    
        this.updateCollisions();
        this.checkLocks();
    
        this.players.forEach((p) => p.body.velocity.x = 0);
        if (this.cursors.left.isDown && !this.lockedLeft) {
            this.currentPlayer.body.velocity.x = -500;
            this.lockedRight = null;
        } else if (this.cursors.right.isDown && !this.lockedRight) {
            this.currentPlayer.body.velocity.x = 500;
            this.lockedLeft = null;
        }
        if(this.currentPlayer.body.onFloor())
        {
            var tint = this.getTileColorUnderneath(this.currentPlayer.x + (this.currentPlayer.width / 2), this.currentPlayer.bottom);
            if (tint != 0)
            {
                this.currentPlayer.tint = tint;
            }
        }
        if(this.game.input.activePointer.isDown) {
            //(isXYCoordClear(this.input.activePointer.worldX, this.input.activePointer.worldY, currentPlayer.body.width))
        }
        
        if(this.jumpButton.isDown && (this.currentPlayer.body.onFloor() ||
           this.currentPlayer.body.touching.down)){
            this.currentPlayer.body.velocity.y = -700;
        }
    }

    checkLevelComplete() {
        if(this.currentPlayer.overlap(this.exit) && (this.currentPlayer.body.right - this.exit.x) > (this.exit.width / 2)) {
            console.log('LEVEL COMPLETE');
            //TEMP (go to next level)
            this.currentPlayer.kill();
            this.game.state.start('LevelSelect');
        }
    }
    
    // get an object with a particular property from layer 
    findObjectsByType(type, layer) {
        var result = new Array();
        this.map.objects[layer].forEach((element) => {
            if (element.properties[0].value === type || (element.properties[1] && element.properties[1].value === type)) {
                element.y -= this.map.tileHeight;
                result.push(element);
            }
        });
        return result;
    }
    
    // Set up animations, physics, and group for a new player
    playerSetUp(p) {
        this.game.physics.arcade.enable(p);
        p.animations.add('current', [0, 1, 2, 1], 8);
        p.body.collideWorldBounds = true;
        p.body.gravity.y = 1000;
        p.body.maxVelocity.y = 850;
        p.body.bounce = {x: 0, y: 0};
        p.tint = 0x98FB98;
        this.players.add(p);
    }
    
    getTileColorUnderneath (x, y)
    {
        var tile;
        if((tile = this.map.getTileWorldXY(x, y + 16, 32, 32, this.blockedLayer)) != null)
        {
            if(tile.index == 258)
                return 0xFF0000;
            if(tile.index == 259)
                return 0x00FF00;
            if(tile.index == 451)
                return 0xFFFFFF;
            return 0;
        }
        return 0;
    }
    // Add new player half the size of current player, 
    // resize current player, and set the current player
    // to be new player
    split() {
        var newWidth = Math.sqrt(2) * this.currentPlayer.width / 2;
        var scale = newWidth / this.originalSize;
        var newX = this.getNewPlayerXCoord(this.currentPlayer.body.bottom - newWidth, newWidth);
        if(newX && scale >= 0.5) {
            var newPlayer = this.game.add.sprite(newX, this.currentPlayer.y, 'player');
            this.playerSetUp(newPlayer);
            newPlayer.scale.setTo(scale, scale);
            this.currentPlayer.scale.setTo(scale, scale);
        } else {
            console.log('SPLIT FAILED')
        }
    }
    
    // Remove player 2 and resize player 1 to be twice
    // previous size
    merge(p1, p2) {
        var newWidth = 2 * Math.sqrt(Math.pow(this.currentPlayer.width, 2) / 2)
        if(this.isXYCoordClear(p1.x, p1.body.bottom - newWidth, newWidth)) {
            var scale = newWidth / this.originalSize;
            p1.scale.setTo(scale, scale);
            p1.body.y -= newWidth / 2
            this.players.remove(p2);
            if(this.currentPlayer === p1 || this.currentPlayer === p2) {
                this.currentPlayer = p1;
                this.game.camera.follow(p1);
                this.currentPlayer.animations.play('current', 8, true);
            }
        } else if(this.currentPlayer === p1 || this.currentPlayer === p2) {
            this.setLocks(p1, p2);
        }
    }
    
    // Make current player the next/prev player in group
    cyclePlayer(cycleForward) {
        var player;
        this.currentPlayer.animations.stop(null, true)
        if(cycleForward){
            player = this.players.next();
            if(player == this.currentPlayer)
                this.currentPlayer = this.players.next();
            else
                this.currentPlayer = player;
        } else {
            player = this.players.previous()
            if(player == this.currentPlayer) this.currentPlayer = this.players.previous();
            else this.currentPlayer = player;
        }
        this.game.camera.follow(this.currentPlayer);
        this.currentPlayer.animations.play('current', 8, true);
        this.lockedLeft = null;
        this.lockedRight = null;
    }
    
    // update collisions between every player and the blocked (platforms)
    // layer and between every player and other player (merge if same size)
    updateCollisions() {
        this.game.physics.arcade.collide(this.players, this.blockedLayer);
        Object.keys(this.moveableLayers).forEach((key) => {
            var layer = this.moveableLayers[key]
            this.game.physics.arcade.collide(this.players, layer);
        })
        this.game.physics.arcade.collide(this.players, this.players, (p1, p2) => {
            if(p1 === p2) {
                return;
            }
            if(Math.abs(p1.width - p2.width) < 1 && Math.abs(p1.y - p2.y) < 1){
                this.merge(p1, p2);
            } else if(this.currentPlayer === p1 || this.currentPlayer === p2) {
                this.setLocks(p1, p2);
            }
        });
        this.players.forEach((p) => {
            this.hazards.forEach((h) => {
                if (p.overlap(h))
                {
                    if (p.right > h.left)
                    {
                        if(p.bottom  > h.top)
                        {
                            this.game.state.restart();
                        }
                    }
                }
            });
        });
        // maybe remove this part once spawning is improved?
        this.game.physics.arcade.overlap(this.players, this.players, (p1, p2) => {
            if(p1 === p2 || !(p1.body.touching.right || p1.body.touching.left)) {
                return;
            }
            if(p1.body.x < p2.body.x) {
                p2.body.x = p1.body.x + p1.width + 1;
            } else {
                p1.body.x = p2.body.x + p2.width + 1;
            }
        });
    }
    
    setLocks(p1, p2) {
        this.currentPlayer.body.velocity.x = 0;
        if(this.currentPlayer.body.touching.right){
            this.lockedRight = this.currentPlayer !== p1 ? p1 : p2
        } else if(this.currentPlayer.body.touching.left){
            this.lockedLeft = this.currentPlayer !== p1 ? p1 : p2
        }
    }
    
    checkLocks() {
        if(this.lockedLeft && (this.currentPlayer.body.bottom < this.lockedLeft.body.y ||
                                this.currentPlayer.body.y > this.lockedLeft.body.bottom)) {
            this.lockedLeft = null;
        }
        if(this.lockedRight && (this.currentPlayer.body.bottom < this.lockedRight.body.y ||
                                this.currentPlayer.body.y > this.lockedRight.body.bottom)) {
            this.lockedRight = null;
        }
    }
    
    // check if there's enough room for a sprite with specified width at x, y
    isXYCoordClear(x, y, width) {
        if(x < 0) {
            return false;
        }
        for(var i = 0; i <= width; i+=1) {
            if(this.map.getTileWorldXY(x + i, y, 32, 32, this.blockedLayer)) {
                return false;
            }
            var hit = false;
            this.players.forEach((p) => {
                if(p.body.hitTest(x + i, y)) {
                    hit = true;
                    return;
                }
            })
            if(hit) {
                return false;
            }
        }
        return true;
    }
    
    //TO DO: check if coordinate is clear before returning the new spawnpoint
    getNewPlayerXCoord(newY, width) {
        var newX;
        if(this.currentPlayer.body.velocity.x == 0) {
            var flipFlop = -1
            var increment = 10
            while(increment < 100) {
                newX = this.currentPlayer.body.x + flipFlop * (width + increment)
                if(this.isXYCoordClear(newX, newY, width)) {
                    return newX
                }
                flipFlop *= -1
                increment += 10
            }
        } else if(this.currentPlayer.body.velocity.x > 0) {
            var increment = 10
            while(increment < 100) {
                newX = this.currentPlayer.body.x - width - increment
                if(this.isXYCoordClear(newX, newY, width)) {
                    return newX
                }
                increment += 10
            }
        } else {
            var increment = 10
            while(increment < 100) {
                newX = this.currentPlayer.body.x + width + increment
                if(this.isXYCoordClear(newX, newY, width)) {
                    return newX
                }
                increment += 10
            }
        }
    }


}