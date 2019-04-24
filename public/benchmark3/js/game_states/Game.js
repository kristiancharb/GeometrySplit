var GeometrySplit = GeometrySplit || {};

var map;
var backgroundLayer;
var blockedLayer;
var moveableLayer1;
var moveableLayer2;
var currentPlayer;
var exit;
var lever;
var cursors;
var jumpButton;
var players;
var hazards;
var originalSize;
var lockedLeft;
var lockedRight;

//loading the game assets
GeometrySplit.Game = function(){};

GeometrySplit.Game.prototype = {
    preload: function() {
        this.stage.backgroundColor = '#fff';
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.load.tilemap('map', 'assets/test.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.spritesheet('player', 'assets/square-sprite.png', 64, 64, 3);
        this.load.spritesheet('door', 'assets/door-sprite.png', 32, 64, 1);
        this.load.spritesheet('lever', 'assets/lever-sprite.png', 32, 32);
        this.load.spritesheet('spike', 'assets/spike.png',32,32,1);
        this.load.image('tiles', 'assets/tileset.png');

        let menuKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
        menuKey.onDown.add(() => {
            this.game.paused = false;
            this.state.start('LevelSelect');
        });

        let pauseKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
        pauseKey.onDown.add(() => {
            this.game.paused = !this.game.paused;
        });
    },
    create: function() {
        map = this.add.tilemap('map');
        map.addTilesetImage('tileset', 'tiles');
        backgroundlayer = map.createLayer('backgroundLayer');
        backgroundlayer.resizeWorld();
        blockedLayer = map.createLayer('blockedLayer');
        moveableLayer1 = map.createLayer('moveableLayer1');
        moveableLayer1.kill();
        moveableLayer2 = map.createLayer('moveableLayer2');
        moveableLayer2.kill();
        
        map.setCollisionBetween(1, 5000, true, 'blockedLayer');
        map.setCollisionBetween(1, 5000, true, 'moveableLayer1');
        map.setCollisionBetween(1, 5000, true, 'moveableLayer2');
    
        var exitObj = findObjectsByType('exit', 'objectsLayer');
        exit = this.add.sprite(exitObj[0].x, exitObj[0].y, 'door');
        exit.enableBody = true;
        var leverObj1 = findObjectsByType('lever1', 'objectsLayer')
        lever1 = this.add.sprite(leverObj1[0].x + map.tileWidth / 2, leverObj1[0].y + map.tileWidth / 2, 'lever');
        lever1.anchor.setTo(0.5, 0.5)
        var leverObj2 = findObjectsByType('lever2', 'objectsLayer')
        lever2 = this.add.sprite(leverObj2[0].x + map.tileWidth / 2, leverObj2[0].y + map.tileWidth / 2, 'lever');
        lever2.anchor.setTo(0.5, 0.5)
    
    
        this.physics.arcade.gravity.y = 1000;
        //console.log(lever);
        //console.log("SKIP");
        players = this.add.group();
        hazards = this.add.group();
    
    
        // In the objects layer, the tilemap has a tile with the property playerStart
        // denoting the spawn location
        var player = findObjectsByType('playerStart', 'objectsLayer');
        currentPlayer = this.add.sprite(player[0].x, player[0].y, 'player');
        originalSize = currentPlayer.width;
        playerSetUp(currentPlayer);
        currentPlayer.animations.play('current', 8, true);
        this.camera.follow(currentPlayer);
        var spikes = findObjectsByType('spike', 'objectsLayer');
        spikes.forEach(function(element){
            var newSpike = GeometrySplit.game.add.sprite(element.x, element.y, 'spike');
            //console.log(newSpike);
            hazards.add(newSpike);
        });
    
        lever1.bringToTop();
        lever2.bringToTop();
    
        //set up controls
        cursors = this.input.keyboard.createCursorKeys();
        jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var splitButton = this.input.keyboard.addKey(Phaser.Keyboard.R);
        splitButton.onDown.add(split);
        var cycleLeftButton = this.input.keyboard.addKey(Phaser.Keyboard.Q);
        cycleLeftButton.onDown.add(() => cyclePlayer(true))
        var cycleRightButton = this.input.keyboard.addKey(Phaser.Keyboard.E);
        cycleRightButton.onDown.add(() => cyclePlayer(false));
        var interactButton = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT)
        interactButton.onDown.add(() => {
            //console.log('Shift')
            if(currentPlayer.overlap(lever1)) {
                lever1.scale.x *= -1;
                if(moveableLayer1.alive) {
                    moveableLayer1.kill();
                } else {
                    moveableLayer1.revive();
                }
            }
            if(currentPlayer.overlap(lever2)) {
                lever2.scale.x *= -1;
                if(moveableLayer2.alive) {
                    moveableLayer2.kill();
                } else {
                    moveableLayer2.revive();
                }
            }
        });
    },
    update: function() {

        if(Math.floor(currentPlayer.body.width) === originalSize) {
            checkLevelComplete();
        }
    
        updateCollisions();
        checkLocks();
    
        players.forEach((p) => p.body.velocity.x = 0);
        if (cursors.left.isDown && !lockedLeft) {
            currentPlayer.body.velocity.x = -500;
            lockedRight = null;
        } else if (cursors.right.isDown && !lockedRight) {
            currentPlayer.body.velocity.x = 500;
            lockedLeft = null;
        }
        if(currentPlayer.body.onFloor())
        {
            var tint = getTileColorUnderneath(currentPlayer.x + (currentPlayer.width / 2), currentPlayer.bottom);
            if (tint != 0)
            {
                currentPlayer.tint = tint;
            }
        }
        if(this.input.activePointer.isDown) {
            //(isXYCoordClear(this.input.activePointer.worldX, this.input.activePointer.worldY, currentPlayer.body.width))
        }
        
        if(jumpButton.isDown && (currentPlayer.body.onFloor() ||
           currentPlayer.body.touching.down)){
            currentPlayer.body.velocity.y = -700;
        }
    }
};

function checkLevelComplete() {
    if(currentPlayer.overlap(exit) && (currentPlayer.body.right - exit.x) > (exit.width / 2)) {
        console.log('LEVEL COMPLETE');
        //TEMP (go to next level)
        currentPlayer.kill();
        GeometrySplit.game.state.start('LevelSelect');
    }
}

// get an object with a particular property from layer 
// (a bit overkill since it's just used for playerStart 
// but i copied it from a tutorial I was following)
function findObjectsByType(type, layer) {
    var result = new Array();
    map.objects[layer].forEach(function (element) {
        if (element.properties[0].value === type) {
            element.y -= map.tileHeight;
            result.push(element);
        }
    });
    return result;
}

// Set up animations, physics, and group for a new player
function playerSetUp(p) {
    GeometrySplit.game.physics.arcade.enable(p);
    p.animations.add('current', [0, 1, 2, 1], 8);
    p.body.collideWorldBounds = true;
    p.body.gravity.y = 1000;
    p.body.maxVelocity.y = 850;
    p.body.bounce = {x: 0, y: 0};
    p.tint = 0x98FB98;
    players.add(p);
}

function getTileColorUnderneath (x, y)
{
    var tile;
    if((tile = map.getTileWorldXY(x, y + 16, 32, 32, blockedLayer)) != null)
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
function split() {
    var newWidth = Math.sqrt(2) * currentPlayer.width / 2;
    var scale = newWidth / originalSize;
    var newX = getNewPlayerXCoord(currentPlayer.body.bottom - newWidth, newWidth);
    if(newX && scale >= 0.5) {
        var newPlayer = GeometrySplit.game.add.sprite(newX, currentPlayer.y, 'player');
        playerSetUp(newPlayer);
        newPlayer.scale.setTo(scale, scale);
        currentPlayer.scale.setTo(scale, scale);
    } else {
        //console.log('SPLIT FAILED')
    }
}

// Remove player 2 and resize player 1 to be twice
// previous size
function merge(p1, p2) {
    var newWidth = 2 * Math.sqrt(Math.pow(currentPlayer.width, 2) / 2)
    if(isXYCoordClear(p1.x, p1.body.bottom - newWidth, newWidth)) {
        var scale = newWidth / originalSize;
        p1.scale.setTo(scale, scale);
        p1.body.y -= newWidth / 2
        players.remove(p2);
        if(currentPlayer === p1 || currentPlayer === p2) {
            currentPlayer = p1;
            GeometrySplit.game.camera.follow(p1);
            currentPlayer.animations.play('current', 8, true);
        }
    } else if(currentPlayer === p1 || currentPlayer === p2) {
        setLocks(p1, p2);
    }
}

// Make current player the next/prev player in group
function cyclePlayer(cycleForward) {
    var player;
    currentPlayer.animations.stop(null, true)
    if(cycleForward){
        player = players.next();
        if(player == currentPlayer) currentPlayer = players.next();
        else currentPlayer = player;
    } else {
        player = players.previous()
        if(player == currentPlayer) currentPlayer = players.previous();
        else currentPlayer = player;
    }
    GeometrySplit.game.camera.follow(currentPlayer);
    currentPlayer.animations.play('current', 8, true);
    lockedLeft = null;
    lockedRight = null;
}

// update collisions between every player and the blocked (platforms)
// layer and between every player and other player (merge if same size)
function updateCollisions() {
    GeometrySplit.game.physics.arcade.collide(players, blockedLayer);
    GeometrySplit.game.physics.arcade.collide(players, moveableLayer1);
    GeometrySplit.game.physics.arcade.collide(players, moveableLayer2);
    GeometrySplit.game.physics.arcade.collide(players, players, (p1, p2) => {
        if(p1 === p2) {
            return;
        }
        if(Math.abs(p1.width - p2.width) < 1 && Math.abs(p1.y - p2.y) < 1){
            merge(p1, p2);
        } else if(currentPlayer === p1 || currentPlayer === p2) {
            setLocks(p1, p2);
        }
    });
    players.forEach(function (p){
    	hazards.forEach(function (h){
    		if (p.overlap(h))
    		{
    			if (p.right > h.left)
    			{
    				if(p.bottom  > h.top)
    				{
    					GeometrySplit.game.state.restart();
    				}
    			}
    		}
    	});
    });
    // maybe remove this part once spawning is improved?
    GeometrySplit.game.physics.arcade.overlap(players, players, (p1, p2) => {
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

function setLocks(p1, p2) {
    currentPlayer.body.velocity.x = 0;
    if(currentPlayer.body.touching.right){
        lockedRight = currentPlayer !== p1 ? p1 : p2
    } else if(currentPlayer.body.touching.left){
        lockedLeft = currentPlayer !== p1 ? p1 : p2
    }
}

function checkLocks() {
    if(lockedLeft && (currentPlayer.body.bottom < lockedLeft.body.y ||
                      currentPlayer.body.y > lockedLeft.body.bottom)) {
        lockedLeft = null;
    }
    if(lockedRight && (currentPlayer.body.bottom < lockedRight.body.y ||
                       currentPlayer.body.y > lockedRight.body.bottom)) {
        lockedRight = null;
    }
}

// check if there's enough room for a sprite with specified width at x, y
function isXYCoordClear(x, y, width) {
    if(x < 0) {
        return false;
    }
    for(var i = 0; i <= width; i+=1) {
        if(map.getTileWorldXY(x + i, y, 32, 32, blockedLayer)) {
            return false;
        }
        var hit = false;
        players.forEach((p) => {
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
function getNewPlayerXCoord(newY, width) {
    var newX;
    if(currentPlayer.body.velocity.x == 0) {
        var flipFlop = -1
        var increment = 10
        while(increment < 100) {
            newX = currentPlayer.body.x + flipFlop * (width + increment)
            if(isXYCoordClear(newX, newY, width)) {
                return newX
            }
            flipFlop *= -1
            increment += 10
        }
    } else if(currentPlayer.body.velocity.x > 0) {
        var increment = 10
        while(increment < 100) {
            newX = currentPlayer.body.x - width - increment
            if(isXYCoordClear(newX, newY, width)) {
                return newX
            }
            increment += 10
        }
    } else {
        var increment = 10
        while(increment < 100) {
            newX = currentPlayer.body.x + width + increment
            if(isXYCoordClear(newX, newY, width)) {
                return newX
            }
            increment += 10
        }
    }
}

