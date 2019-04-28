class Level {
    constructor(game) {
        this.game = game;
        this.map;
        this.backgroundLayer;
        this.blockedLayer;
        this.moveableLayers = {};
        this.filterLayers = Array();
        this.currentPlayer;
        this.exit;
        this.levers = Array();
        this.cursors;
        this.jumpButton;
        this.players;
        this.enemies;
        this.hazards;
        this.buttons;
        this.originalSize;
        this.lockedLeft;
        this.lockedRight;
        this.secretBuffer;
        this.rainbowFlag;
        this.colors;
        this.i;
        this.walkThroughWalls;
        this.noGravity;
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
        this.game.load.spritesheet('button', 'assets/button.png', 32, 16,2);
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
        this.map.setCollisionBetween(1, 5000, true, 'blockedLayer');
        this.map.layers.forEach((layer) => {
            if(layer.properties[1] && layer.properties[1].value === 'moveableLayer') {
                var l = this.map.createLayer(layer.name);
                this.moveableLayers[layer.properties[0].value] = l;
                l.kill();
                this.map.setCollisionBetween(1, 5000, true, layer.name);
            } else if(layer.properties[1] && layer.properties[1].value === 'filterLayer') {
                var l = this.map.createLayer(layer.name);
                l.filterColor = parseInt(layer.properties[0].value, 16);
                l.alpha = 0.5;
                this.filterLayers.push(l);
                this.map.setCollisionBetween(1, 5000, true, layer.name);
            }
        });
        this.colors = Phaser.Color.HSVColorWheel();
        this.i = 0;
        this.walkThroughWalls = 0;
        this.map.setCollisionBetween(1, 5000, true, 'blockedLayer');
        this.secretBuffer = 0;
        var exitObj = this.findObjectsByType('exit', 'objectsLayer');
        this.exit = this.game.add.sprite(exitObj[0].x, exitObj[0].y, 'door');
        this.exit.enableBody = true;

        this.game.physics.arcade.gravity.y = 1000;

        this.players = this.game.add.group();
        this.enemies = this.game.add.group();
        this.hazards = this.game.add.group();
        this.enemies = this.game.add.group();
        this.buttons = this.game.add.group();
    
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
        var buttons = this.findObjectsByType('button', 'objectsLayer');
        buttons.forEach((element) => {
            var newbutton = this.game.add.sprite(element.x, element.y + 16, 'button');
            newbutton.animations.add('off', [0]);
            newbutton.animations.add('on', [1]);
            newbutton.animations.play('off');
            this.buttons.add(newbutton);
        });
        var leverObjs = this.findObjectsByType('lever', 'objectsLayer')
        leverObjs.forEach((leverObj) => {
            var lever = this.game.add.sprite(leverObj.x + this.map.tileWidth / 2, leverObj.y + this.map.tileWidth / 2, 'lever');
            this.levers.push(lever);
            lever.moveableLayer = this.moveableLayers[leverObj.properties[0].value];
            lever.anchor.setTo(0.5, 0.5);
            lever.bringToTop();
        });

        var enemyObjs = this.findObjectsByType('enemy', 'objectsLayer');
        enemyObjs.forEach((enemyObj) => {
            var enemy = this.game.add.sprite(enemyObj.x, enemyObj.y, 'player');
            this.game.physics.arcade.enable(enemy);
            enemy.tint = 0x440000;
            enemy.animations.add('current', [0, 1, 2, 1], 8);
            enemy.animations.play('current', 8, true);
            enemy.body.collideWorldBounds = true;
            enemy.body.gravity.y = 1000;
            enemy.direction = Math.random() > 0.5 ? -1 : 1;
            this.enemies.add(enemy);
        });

    
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
        var upkey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var downkey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        var leftkey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        var rightkey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var bkey =this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        var akey =this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        upkey.onDown.add(() => {
            this.secretBuffer *= 10;
            this.secretBuffer += 1;
            this.secretBuffer %= 10000000000;
            console.log(this.secretBuffer);
            });
        downkey.onDown.add(() => {
            this.secretBuffer *= 10;
            this.secretBuffer += 2;
            this.secretBuffer %= 10000000000;
            console.log(this.secretBuffer);
            });
        leftkey.onDown.add(() => {
            this.secretBuffer *= 10;
            this.secretBuffer += 3;
            this.secretBuffer %= 10000000000;
            console.log(this.secretBuffer);
            });
        rightkey.onDown.add(() => {
            this.secretBuffer *= 10;
            this.secretBuffer += 4;
            this.secretBuffer %= 10000000000;
            console.log(this.secretBuffer);
            });
        bkey.onDown.add(() => {
            this.secretBuffer *= 10;
            this.secretBuffer += 5;
            this.secretBuffer %= 10000000000;
            if(this.secretBuffer == 5555555555)
                this.game.physics.arcade.gravity.y = 1000;
            console.log(this.secretBuffer);
            });
        akey.onDown.add(() => {
            this.secretBuffer *= 10;
            this.secretBuffer += 6;
            this.secretBuffer %= 10000000000;
            if(this.secretBuffer == 1122343456)
                this.rainbowFlag = 1;
            else if(this.secretBuffer % 10000 == 6556)
                this.walkThroughWalls = this.walkThroughWalls ^ 1;
            else if(this.secretBuffer == 6666666666)
                this.game.physics.arcade.gravity.y = 0;
            console.log(this.secretBuffer);
            });
    }

    update() {
        if(Math.floor(this.currentPlayer.body.width) === this.originalSize) {
            this.checkLevelComplete();
        }
        if (this.rainbowFlag == 1)
            this.cycleRainbow();
        this.updateCollisions();
        this.checkLocks();
    
        this.players.forEach((p) => p.body.velocity.x = 0);
        this.enemies.forEach((enemy) => {
            var x = enemy.direction > 0 ?
                    enemy.right + this.map.tileWidth * 0.1 :
                    enemy.x - this.map.tileWidth * 0.1;
            var y = enemy.bottom + this.map.tileHeight * 0.5;
            if(!this.map.getTileWorldXY(x, y, 32, 32, this.blockedLayer)) {
                enemy.direction *= -1;
            } 
            enemy.body.velocity.x = 200 * enemy.direction; 
        });

        if (this.cursors.left.isDown && !this.lockedLeft) {
            this.currentPlayer.body.velocity.x = -500;
            this.lockedRight = null;
        } else if (this.cursors.right.isDown && !this.lockedRight) {
            this.currentPlayer.body.velocity.x = 500;
            this.lockedLeft = null;
        }
        if(this.currentPlayer.body.onFloor()) {
            var tint = this.getTileColorUnderneath(this.currentPlayer.x + (this.currentPlayer.width / 2), this.currentPlayer.bottom);
            if (tint != 0) {
                this.currentPlayer.tint = tint;
            }
        }
        // if(this.game.input.activePointer.isDown) {
        //     console.log(this.map.getTileWorldXY(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 32, 32));
        // }
        
        if(this.jumpButton.isDown && (this.currentPlayer.body.onFloor() ||
           this.currentPlayer.body.touching.down)){
            this.currentPlayer.body.velocity.y = -700;
        }
    }

    cycleRainbow() {
        console.log("Working");
        var tint;
        if (this.currentPlayer.tint == 0xFF0000)
            tint = 0xFF9900;
        else if (this.currentPlayer.tint == 0xFF9900)
            tint = 0xFFFF00;
        else if (this.currentPlayer.tint == 0xFFFF00)
            tint = 0x99FF00;
        else if (this.currentPlayer.tint == 0x99FF00)
            tint = 0x00FF00;
        else if (this.currentPlayer.tint == 0x00FF00)
            tint = 0x00FF99;
        else if (this.currentPlayer.tint == 0x00FF99)
            tint = 0x00FFFF;
        else if (this.currentPlayer.tint == 0x00FFFF)
            tint = 0x0099FF;
        else if (this.currentPlayer.tint == 0x0099FF)
            tint = 0x0000FF;
        else if (this.currentPlayer.tint == 0x0000FF)
            tint = 0x9900FF;
        else if (this.currentPlayer.tint == 0x9900FF)
            tint = 0xFF00FF;
        else if (this.currentPlayer.tint == 0xFF00FF)
            tint = 0xFF0099;
        else if (this.currentPlayer.tint == 0xFF0099)
            tint = 0xFF0000;
        else
            tint = 0xFF0000;

        this.players.forEach((p) => {
            p.tint = tint;
        });
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
        p.tint = 0xA4DB77;
        this.players.add(p);
    }
    
    getTileColorUnderneath (x, y) {
        var tile;
        if((tile = this.map.getTileWorldXY(x, y + 16, 32, 32, this.blockedLayer)) != null) {
            if(tile.index == 1)
                return 0xA4DB77;
            if(tile.index == 4)
                return 0xD15555;
            if(tile.index == 5)
                return 0x467AD6;
            if(tile.index == 8)
                return 0xED8A47;
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
            newPlayer.tint = this.currentPlayer.tint;
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
        if (this.walkThroughWalls == 0)
            this.game.physics.arcade.collide(this.players, this.blockedLayer);
        this.game.physics.arcade.collide(this.enemies, this.blockedLayer, (enemy, _) => {
            if(enemy.body.blocked.right) {
                enemy.direction = -1;
            } else if(enemy.body.blocked.left) {
                enemy.direction = 1;
            }
        });
        this.game.physics.arcade.collide(this.players, this.enemies, () => this.game.state.restart());
        Object.keys(this.moveableLayers).forEach((key) => {
            var layer = this.moveableLayers[key]
            this.game.physics.arcade.collide(this.players, layer);
        })
        this.filterLayers.forEach((layer) => {
            if(this.currentPlayer.tint != layer.filterColor) {
                this.game.physics.arcade.collide(this.players, layer);
            }
        })
        this.game.physics.arcade.collide(this.players, this.players, (p1, p2) => {
            if(p1 === p2) {
                return;
            }
            if(Math.abs(p1.width - p2.width) < 1 && Math.abs(p1.y - p2.y) < 1 &&
               p1.tint == p2.tint) {
                this.merge(p1, p2);
            } else if(this.currentPlayer === p1 || this.currentPlayer === p2) {
                this.setLocks(p1, p2);
            }
        });
        if (this.walkThroughWalls == 0)
        {
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
        }
        this.players.forEach((p) => {
            this.buttons.forEach((b) => {
                if (p.overlap(b))
                {
                    if (p.right > b.left)
                    {
                        if(p.bottom  > b.top)
                        {
                            b.animations.play('on');
                            console.log("HI");
                        }
                    }
                }
                else
                {
                    b.animations.play('off');
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