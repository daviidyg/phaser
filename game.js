/*
 * Gothicvania Cemetery Demo Code
 * by Ansimuz
 * Get more free assets and code like these at: www.pixelgameart.org
 * Visit my store for premium content at https://ansimuz.itch.io/
 * */

var game;
var player;
var eboss;
var folkIndex = 0;
var gameWidth = 384;
var gameHeight = 224;
var bg_moon;
var bg_mountains;
var bg_graveyard;
var globalMap;
var jumpingFlag;
var attackingflag;
var enemies_group;
var hitBox;
var hurtFlag;
var audioHurt;
var music;
var vidas = 3;
var muerte = false;
var highscore=0;
var minicio;
var mfinal;
var livescounter;
var livesicon;
var livescrop;
var vidas1;
var vidas2;
var contador = 0;
var pegado=false;
var invent=false;
var hapasao=false;
var mboss;
var finalboss;
var finalbattle;
var encolision=false;
var vidasboss=0;
var intervaloboss;
window.onload = function () {
    game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "");
    game.state.add('Boot', boot);
    game.state.add('Preload', preload);
    game.state.add('TitleScreen', titleScreen);
    game.state.add('PlayGame', playGame);
	game.state.add('GameOver', gameOver);
    //
    game.state.start('Boot');
}

var boot = function (game) {

}
boot.prototype = {
    preload: function () {
        this.game.load.image('loading', 'assets/sprites/loading.png');
    },
    create: function () {
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.renderer.renderSession.roundPixels = true;
        this.game.state.start('Preload');
    }
}
var preload = function (game) {
};

preload.prototype = {
    preload: function () {
        var loadingBar = this.add.sprite(game.width / 2, game.height / 2, 'loading');
        loadingBar.anchor.setTo(0.5);
        game.load.setPreloadSprite(loadingBar);
        // load title screen
        game.load.image('title', 'assets/sprites/title-screen.png');
		game.load.image('game-over', 'assets/sprites/game-over.png');
        game.load.image('enter', 'assets/sprites/press-enter-text.png');
        game.load.image('credits', 'assets/sprites/credits-txt.png');
        game.load.image('instructions', 'assets/sprites/instructions.png');
        // environment
        game.load.image('bg-moon', 'assets/environment/bg-moon.png');
        game.load.image("bg-mountains", 'assets/environment/bg-mountains.png');
        game.load.image("bg-graveyard", 'assets/environment/bg-graveyard.png');
        game.load.image('vidas','assets/heart.png');
        game.load.text('highscore');
        // tileset
        game.load.image('tileset', 'assets/environment/tileset.png');
        game.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('objects', 'assets/environment/objects.png');
        // atlas sprite
        game.load.atlasJSONArray('atlas', 'assets/atlas/atlas.png', 'assets/atlas/atlas.json');
        game.load.atlasJSONArray('atlas-props', 'assets/atlas/atlas-props.png', 'assets/atlas/atlas-props.json');
        game.load.spritesheet('boss','assets/boss/idle.png',160,144,6)
        game.load.spritesheet('bossattack','assets/boss/attack.png',240,192,11)
        game.load.atlasJSONArray('idle','assets/boss/idle.png','assets/boss/idle.json')
        game.load.image('bossidle0','assets/boss/boss0.png')
        game.load.image('bossidle1','assets/boss/boss1.png')
        game.load.image('bossidle2','assets/boss/boss2.png')
        game.load.image('bossidle3','assets/boss/boss3.png')
        game.load.image('bossidle4','assets/boss/boss4.png')
        game.load.image('bossidle5','assets/boss/boss5.png')
        // audio
        game.load.audio('music', ['assets/sounds/Never-Surrender_loop.ogg']);
       	game.load.audio('attack', ['assets/sounds/attack.ogg']);
	    game.load.audio('kill', ['assets/sounds/kill.ogg']);
		game.load.audio('rise', ['assets/sounds/rise.ogg']);
		game.load.audio('hurt', ['assets/sounds/hurt.ogg']);
        game.load.audio('jump', ['assets/sounds/jump.ogg']);
        game.load.audio('minicio',['assets/sounds/Ruined_loop.ogg']);
        game.load.audio('mfinal',['assets/sounds/Horror-MusicBox_loop.ogg']);
        game.load.audio('mboss',['assets/sounds/Battle-Furious-SYNTH_loop.ogg']);
        game.sound.volume = 0.3
    },
    create: function () {
        //this.game.state.start('PlayGame');
        this.game.state.start('TitleScreen');
        /* this.anims.create({
            key:'bossidle',
            frames: [
                {key:'boss0'},
                {key:'boss1'},
                {key:'boss2'},
                {key:'boss3'},
                {key:'boss4'},
                {key:'boss5'},
            ],
            frameRate:10,
            repeat: 1
        }); */
    }
}

var titleScreen = function (game) {

};

titleScreen.prototype = {
    create: function () {
        bg_moon = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-moon');
		bg_mountains = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-mountains');
	 

        this.title = game.add.image(gameWidth / 2, 100 , 'title');
        this.title.anchor.setTo(0.5);
        var credits = game.add.image(gameWidth / 2, game.height - 12, 'credits');
        credits.anchor.setTo(0.5);
        this.pressEnter = game.add.image(game.width / 2, game.height - 60, 'enter');
        this.pressEnter.anchor.setTo(0.5);

        game.time.events.loop(700, this.blinkText, this);

        var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.startGame, this);
        minicio = game.add.audio('minicio');
        minicio.volume = 0.3;
        minicio.loop = true;
        minicio.play()
        this.state = 1;
    },

    blinkText: function () {
        if (this.pressEnter.alpha) {
            this.pressEnter.alpha = 0;
        } else {
            this.pressEnter.alpha = 1;
        }
    },
    update: function () {
        bg_mountains.tilePosition.x -= 0.2;
    },
    startGame: function () {
        if (this.state == 1) {
            this.state = 2;
            this.title2 = game.add.image(game.width / 2, 40, 'instructions');
            this.title2.anchor.setTo(0.5, 0);
            this.title.destroy();
        } else {
            this.game.state.start('PlayGame');
        }
    }
}

var gameOver = function (game) {
};
gameOver.prototype = {
    create: function () {
        music.stop();
        if(hapasao && !finalboss){
            mboss.stop();
            finalbattle=false;
        }
        bg_moon = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-moon');
        bg_mountains = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-mountains');
        
        this.title = game.add.image(gameWidth / 2, 100 , 'game-over');
        this.title.anchor.setTo(0.5);
        var credits = game.add.image(gameWidth / 2, game.height - 12, 'credits');
        credits.anchor.setTo(0.5);
        this.pressEnter = game.add.image(game.width / 2, game.height - 40, 'enter');
        this.pressEnter.anchor.setTo(0.5);
        clearInterval(intervaloboss)
        game.time.events.loop(700, this.blinkText, this);

        var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.startGame, this);

        this.state = 2;
        mfinal = game.add.audio('mfinal');
        mfinal.volume = 0.7;
        mfinal.loop = true;
        mfinal.play()
        hapasao=false;
    },

    blinkText: function () {
        if (this.pressEnter.alpha) {
            this.pressEnter.alpha = 0;
        } else {
            this.pressEnter.alpha = 1;
        }
    },
    update: function () {
        bg_mountains.tilePosition.x -= 0.2;
    },
    startGame: function () {
        if (this.state == 1) {
            this.state = 2;
            this.title2 = game.add.image(game.width / 2, 40, 'instructions');
            this.title2.anchor.setTo(0.5, 0);
            this.title.destroy();
            
           
            
        } else {
            this.game.state.start('PlayGame');
            mfinal.stop()
            vidas=3;
            contador=0;

        }
    }
}
function inven(){
    var pegado=false;
    hurtFlag=false;
    
    
}
var playGame = function (game) {
};
playGame.prototype = {

    create: function () {
        minicio.stop();
		this.createBackgrounds();
		this.createTileMap();
        this.populate();
		this.bindKeys();
		this.createPlayer(6, 9);
		this.createHitbox();
		  
        // camera follow
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
		
		this.startAudios();

    },
	startAudios: function(){
        // audios
         this.audioKill = game.add.audio("kill");
		 this.audioAttack = game.add.audio("attack");
		 this.audioRise = game.add.audio("rise");
		 audioHurt = game.add.audio("hurt");
		 this.audioJump = game.add.audio("jump");
        // music
        music = game.add.audio('music');
        music.loop = true;
        music.volume =0.2;
        music.play()
	},
	
    createHitbox: function () {
        // create hitbox to detect attacks
        hitbox = game.add.sprite(0, 16, null);
        hitbox.anchor.setTo(0.5);
        game.physics.arcade.enable(hitbox);
        hitbox.body.setSize(30, 16, 0, 0);
        player.addChild(hitbox);
		hitbox.x = 39;
    },
	populate: function(){
        
        //enemies group
        enemies_group = game.add.group();
        enemies_group.enableBody = true;
		/* setTimeout(() => {
            this.addBoss(378, 2)
            console.log("boss")
            game.debug.body(this)
        }, 20000); */
		// skeletons
		this.addSkeletonSpawner(17,12, true);
        this.addSkeletonSpawner(10,12, false);
		this.addSkeletonSpawner(80,12, false);
		this.addSkeletonSpawner(147,12, false);
		this.addSkeletonSpawner(162,12, true);
		//
		this.addSkeletonSpawner(200,12, false);
		this.addSkeletonSpawner(210,12, true);
		//
		this.addSkeletonSpawner(244,12, false);
		this.addSkeletonSpawner(254,12, true);
        this.addSkeletonSpawner(270,12, false);
        this.addSkeletonSpawner(279,10, true);
        this.addSkeletonSpawner(295,10, true);
        this.addSkeletonSpawner(287,10, true);
		
		// gatos
		this.addHellGato(53,11);
		this.addHellGato(86,11);
		this.addHellGato(147,11);
        this.addHellGato(201,11);
        this.addBoss(378, 2)

        // ghosts
        this.addHellGhost(56,1);
		this.addHellGhost(111,7);
		this.addHellGhost(173,6);
		this.addHellGhost(220,5);
        this.addHellGhost(263,7);
        this.addHellGhost(274,7.5);
        this.addHellGhost(279,8);
        this.addHellGhost(284,10);
        this.addHellGhost(295,8);


	},
	addBoss: function(x,y){
        var temp = new Boss(game,x, y);
        game.add.existing(temp);
        enemies_group.add(temp);
    },
    addHellGato: function(x,y){
        var temp = new HellGato(game, x, y);
        game.add.existing(temp);
        enemies_group.add(temp);
    },
	
    addHellGhost: function(x,y){
        var temp = new Ghost(game, x, y);
        game.add.existing(temp);
        enemies_group.add(temp);
    },
	
    addSkeletonSpawner: function(x,y, spawnInFront){
        var temp = new SkeletonSpawner(game, x, y, spawnInFront);
        game.add.existing(temp);
        enemies_group.add(temp);
    },
	
    addSkeleton: function(x,y, spawnInFront){
        var temp = new Skeleton(game, x, y, spawnInFront);
        game.add.existing(temp);
        enemies_group.add(temp);
    },
	
    bindKeys: function () {
        this.wasd = {
            jump: game.input.keyboard.addKey(Phaser.Keyboard.UP),
            jump2: game.input.keyboard.addKey(Phaser.Keyboard.K),
			attack: game.input.keyboard.addKey(Phaser.Keyboard.X),
            left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            crouch: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            
        }
        game.input.keyboard.addKeyCapture(
            [Phaser.Keyboard.C,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.X]
        );
    },
	
    createPlayer: function (x, y) {
        highscore = 0;
        var temp = new Player(game, x, y);
        Highscorecounter = game.add.text(300,10,highscore);
        Highscorecounter.addColor('#ffff00',0);
        Highscorecounter.fixedToCamera = true;
        livescounter = game.add.image(20, 10, 'vidas');
        vidas1 = game.add.image(40, 10, 'vidas');
        vidas2 = game.add.image(60, 10, 'vidas');
        livescounter.fixedToCamera = true;
        vidas1.fixedToCamera = true;
        attackingflag=false
        
        vidas2.fixedToCamera = true;
        game.add.existing(temp);
    },

    decorWorld: function () {
        this.addProp(4 * 16, 7 * 16 , 'candle');
       
    },

    addProp: function (x, y, item) {
        game.add.image(x, y, 'atlas-props', item);
    },

    

    createBackgrounds: function () {
        bg_moon = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-moon');
		bg_mountains = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-mountains');
		bg_graveyard = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-graveyard');
		//
		 bg_moon.fixedToCamera = true;
		 bg_mountains.fixedToCamera = true;
		 bg_graveyard.fixedToCamera = true;
    },

    

    createTileMap: function () {
        // tiles
        globalMap = game.add.tilemap('map');
        globalMap.addTilesetImage('tileset');
          globalMap.addTilesetImage('objects');
        //
        this.layer_back = globalMap.createLayer('Back Layer');

        this.layer_back.resizeWorld();
        //
        this.layer = globalMap.createLayer('Main Layer');
		//
        
        //
        this.layer_collisions = globalMap.createLayer("Collisions Layer");


        // collisions
        globalMap.setCollision([1]);
        this.layer_collisions.visible = false;
        this.layer_collisions.debug = false;
		// one way collisions
		 this.setTopCollisionTiles(2);
    },

    
    setTopCollisionTiles: function (tileIndex) {
        var x, y, tile;
        for (x = 0; x < globalMap.width; x++) {
            for (y = 1; y < globalMap.height; y++) {
                tile = globalMap.getTile(x, y);
                if (tile !== null) {
                    if (tile.index == tileIndex) {
                        tile.setCollision(false, false, true, false);
                    }

                }
            }
        }
    },
   

    update: function () {
        

       
        this.parallaxBackground();
		 game.physics.arcade.collide(enemies_group, this.layer_collisions);

        if (player.alive) {
            //physics
            game.physics.arcade.collide(player, this.layer_collisions);
            //overlaps
            game.physics.arcade.overlap(hitbox, enemies_group, this.triggerAttack, null, this);
			game.physics.arcade.overlap(player, enemies_group, this.hurtPlayer, null, this);
        }
        else{
            console.log(player.health)
            this.game.state.start('GameOver');
        }
		
		this.movePlayer();		
		// if end is reached display game over screen
		if(player.position.x > 307 * 16  && !hapasao){
           console.log()
           hapasao=true;
           finalboss=true;
            music.stop()
        } 
        if(player.position.x > 352 * 16 && finalboss){
            mboss = game.add.audio('mboss');
            mboss.volume = 0.3;
            mboss.loop = true;
            mboss.play()
            finalboss=false;
            finalbattle=true
                }
        if(player.position.x<353 * 16 && finalbattle){
            player.position.x = 353 * 16;
        }
		
		

       //this.debugGame();

    },
	
    
	
    hurtPlayer: function () {
        if (hurtFlag) {
            return;
        }
        if(!pegado){
            console.log("antes "+attackingflag)
        pegado=true;
        attackingflag=false
        console.log("despues "+attackingflag)
        hurtFlag = true;
        player.animations.play('hurt');
        player.body.velocity.y = -150;
        contador++;
        vidas--;
        highscore = highscore - 500;
        Highscorecounter.setText(highscore);
        console.log(contador)
        player.damage(1);
        player.body.velocity.x = (player.scale.x == 1) ? -100 : 100;
        audioHurt.play();
        console.log(vidas)
        setTimeout(this.hurtFlagManager,1000)
    }
        if(vidas==2){
            vidas2.destroy();
        }
        else if(vidas==1){
            vidas1.destroy();
        }
        else{
            livescounter.destroy()
        }
    },
    
    hurtFlagManager: function () {
        // reset hurt when touching ground
            hurtFlag = false;
            pegado = false
                    
    },
	
	
   
    triggerAttack: function (player, enemy) {
        if (this.wasd.attack.isDown && !encolision) {
            console.log(vidasboss)
            console.log("antes "+enemy.health)
            enemy.damage(1);
            console.log("despues "+enemy.health)
            encolision=true;
            if(enemy.health==0){
                if(vidasboss==4){
                    setTimeout(() => {
                        this.game.state.start('GameOver');
                        vidasboss=0;
                    }, 3000);
                }
                highscore = highscore + 100;
            Highscorecounter.setText(highscore);
            console.log(highscore)
                var death = new EnemyDeath(game, enemy.x, enemy.y - 16);
                game.add.existing(death);
                this.audioKill.play();
            }
            else{
                vidasboss++;
                this.audioKill.play();
               
            }
            setTimeout(dano,1000);
            
        }

    },
	
	
    debugGame: function () {
       // game.debug.body(enemies_group);
        game.debug.body(player);
		game.debug.body(hitbox);
		enemies_group.forEachAlive(this.renderGroup, this);    

    },

    parallaxBackground: function () {
        //foreground.tilePosition.x = this.layer.x * -1.2;
		bg_mountains.tilePosition.x = this.layer.x * -.07;
		bg_graveyard.tilePosition.x = this.layer.x * -.25;
    },

    

	movePlayer: function(){
		
        if (hurtFlag) {
            return;
        }
		
        var vel = 150;
		
        if (attackingflag) {
            return;
        }
		
        // reset jumpingflag
        if (player.body.onFloor()) {
            jumpingFlag = false;
        }
		
		
		if(jumpingFlag){
			if(player.body.velocity.y > 10){
             player.animations.play('fall');
             if (this.wasd.left.isDown) {
	            player.body.velocity.x = -vel;
	            player.animations.play('run');
	            player.scale.x = -1;
	        } else if (this.wasd.right.isDown) {
	            player.body.velocity.x = vel;
	            player.animations.play('run');
	            player.scale.x = 1;
	        }	
			}
		}else{
	        if (this.wasd.left.isDown) {
	            player.body.velocity.x = -vel;
	            player.animations.play('run');
	            player.scale.x = -1;
	        } else if (this.wasd.right.isDown) {
	            player.body.velocity.x = vel;
	            player.animations.play('run');
	            player.scale.x = 1;
	        } else {
	            
				player.body.velocity.x = 0;
	            if (this.wasd.crouch.isDown) {	                
	                    player.animations.play('crouch');
	                }else{
	                 	player.animations.play('idle');	
	                }
	        }	
		}
        
		
		// jump
        if ( ( this.wasd.jump.isDown || this.wasd.jump2.isDown ) && player.body.onFloor()) {
            player.body.velocity.y = -170;
            player.animations.play('jump');
			this.audioJump.play();
            jumpingFlag = true;
        }
		
		
        // attack
        if (this.wasd.attack.isDown) {
            player.body.velocity.x = 0;
            player.animations.play('attack');
            attackingflag = true;
			this.audioAttack.play();
        }
	},

    

    renderGroup: function (member) {
        game.debug.body(member);

    }

}

// player entity

Player = function(game, x, y){
	x *= 16; //720 final del juego, 950 zona boss
	y *= 16;
	this.initX = x;
	this.initY = y;
    Phaser.Sprite.call(this, game, x, y, "atlas", "hero-idle-1");
    this.health = vidas;
	this.anchor.setTo(0.5);	
	game.physics.arcade.enable(this);
	this.body.setSize(22, 39, 41, 19);
	this.body.gravity.y = 300;
	this.kind = "player";
	player = this;
    //add animations
    var animVel = 12;
    this.animations.add('idle', Phaser.Animation.generateFrameNames('hero-idle-', 1, 4, '', 0), animVel - 4, true);
	this.animations.add('run', Phaser.Animation.generateFrameNames('hero-run-', 1, 6, '', 0), animVel - 4, true);
	this.animations.add('jump', Phaser.Animation.generateFrameNames('hero-jump-', 1, 2, '', 0), animVel - 8  , false);
	this.animations.add('fall', Phaser.Animation.generateFrameNames('hero-jump-', 3, 4, '', 0), animVel  , true);
	var attackAnim = this.animations.add('attack', Phaser.Animation.generateFrameNames('hero-attack-', 1, 5, '', 0), animVel + 0  , false);
    attackAnim.onComplete.add(function () {
        attackingflag  = false;
    });
	this.animations.add('crouch', ['hero-crouch'], animVel - 8  , false);
	this.animations.add('hurt', ['hero-hurt'], animVel - 8  , false);
	this.animations.play('idle');
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function () {
	// kill player if is at spikes level
	if(this.position.y > 172){
		audioHurt.play();
		this.game.state.start('GameOver');
	}
	//console.log(this.position.y);
	
	
}

// enemies
Boss = function(game, x, y){
    game.debug.body('boss');
    this.health = 5;
    x *= 16;
    y *= 16;
    this.xDir= -1;
    this.speed = 90;
    this.turnTimerTrigger =200;
    this.turnTimer = this.turnTimerTrigger;
    //var bsprite = game.add.sprite(x,y,'boss');
    Phaser.Sprite.call(this, game, x, y,'boss');
    this.animations.add('idle',[0,1,2,3,4,5],10,true);
    this.animations.play('idle')
    intervaloboss=setInterval(() => {
        this.loadTexture('bossattack')
        this.animations.add('attack',[0,1,2,3,4,5,6,7,8,9,10],10,false);
        this.animations.play('attack')
        setTimeout(() => {
            this.loadTexture('boss')
        this.animations.add('idle',[0,1,2,3,4,5],10,true);
        this.animations.play('idle')
        }, 1000);
    }, 5000);
    /* setInterval(() => {
        this.loadTexture('bossattack')
        this.animations.add('attack',[0,1,2,3,4,5,6,7,8,9,10],10,false);
        this.animations.play('attack')
        setInterval(() => {
        this.loadTexture('boss')
        this.animations.play('idle')
        }, 1000);

    }, 5000); */
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5);
    this.body.setSize(80, 100, 23, 28);//23, 28;
    //this.animations.add('idle',Phaser.Animation.generateFrameNames('demon-idle-',0 ,5),6, true);
    //this.animations.play('idle');
};
Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;
Boss.prototype.update = function () {
	
	this.body.velocity.x = this.speed * this.xDir;
	
    if (this.body.velocity.x < 0) {
        this.scale.x = 1;
    } else {
        this.scale.x = -1;
    }
	
	// turn around
	if(this.turnTimer <= 0){
		this.turnTimer = this.turnTimerTrigger ;
		this.xDir *= -1;
	}else{
		this.turnTimer -= 1;
	}

    
};
HellGato = function (game, x, y) {
    this.health = 1;
    x *= 16;
    y *= 16;
	this.xDir = -1;
	this.speed = 90;
	this.turnTimerTrigger = 200;
	this.turnTimer = this.turnTimerTrigger ;
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'hell-gato-1');
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5);
    this.body.setSize(45, 25, 23, 28);
    this.body.gravity.y = 500;
    this.animations.add('run', Phaser.Animation.generateFrameNames('hell-gato-', 1, 4, '', 0), 9, true);
    this.animations.play('run');
};

HellGato.prototype = Object.create(Phaser.Sprite.prototype);
HellGato.prototype.constructor = HellGato;

HellGato.prototype.update = function () {
	
	this.body.velocity.x = this.speed * this.xDir;
	
    if (this.body.velocity.x < 0) {
        this.scale.x = 1;
    } else {
        this.scale.x = -1;
    }
	
	// turn around
	if(this.turnTimer <= 0){
		this.turnTimer = this.turnTimerTrigger ;
		this.xDir *= -1;
	}else{
		this.turnTimer -= 1;
	}

    
};


Ghost = function (game, x, y) {
    this.health = 1;
    x *= 16;
    y *= 16;
	this.xDir = -1;
	this.speed = 90;
	this.turnTimerTrigger = 200;
	this.turnTimer = this.turnTimerTrigger ;
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'ghost-halo-1');
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5);
    this.body.setSize(14, 33, 10, 14);
    this.animations.add('float', Phaser.Animation.generateFrameNames('ghost-halo-', 1, 4, '', 0), 9, true);
    this.animations.play('float');
    var VTween = game.add.tween(this).to({
        y: y + 50
    }, 1000, Phaser.Easing.Linear.None, true, 0, -1);
    VTween.yoyo(true);
};

Ghost.prototype = Object.create(Phaser.Sprite.prototype);
Ghost.prototype.constructor = Ghost;

Ghost.prototype.update = function () {
	
	// turn to player
	if(this.x > player.x){
		this.scale.x = -1;
	}else{
		this.scale.x = 1;	
	}

    
};


SkeletonSpawner = function (game, x, y, spawnInFront) {
    x *= 16;
    y *= 16;
	 Phaser.Sprite.call(this, game, x, y, null);
	 this.spawnInfront = spawnInFront;
	
};

SkeletonSpawner.prototype = Object.create(Phaser.Sprite.prototype);
SkeletonSpawner.prototype.constructor = SkeletonSpawner;

SkeletonSpawner.prototype.update = function () {

	
	if(this.spawnInfront){
		// spawn in front
		if( player.x  > this.x - 9* 16 ){

	        var temp = new Skeleton(game, this.x / 16, ( this.y / 16) - 34/ 16 );
	        game.add.existing(temp);
	        enemies_group.add(temp);	
		
			this.destroy();
		
		}	
	}else{
		// spawn in back
		if( player.x  > this.x + 6 * 16 ){
		
	        var temp = new Skeleton(game, this.x / 16, ( this.y / 16) - 34/ 16 );
	        game.add.existing(temp);
	        enemies_group.add(temp);	
		
			this.destroy();
			
			
		}
	}
	
	
   
};


Skeleton = function (game, x, y) {
    this.health = 1;
    x *= 16;
    y *= 16;
	this.state = 0;
	this.xDir = -1;
	this.speed = 0;
	this.turnTimerTrigger = 200;
	this.turnTimer = this.turnTimerTrigger ;
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'skeleton-clothed-1');
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5);
    this.body.setSize(18, 34, 15, 18);
    this.body.gravity.y = 500;
    var riseAnim = this.animations.add('rise', Phaser.Animation.generateFrameNames('skeleton-rise-clothed-', 1, 6, '', 0), 7, false);
    riseAnim.onComplete.add(function () {
        this.state = 0;
		this.animations.play('walk');
		this.speed = 20;
    }, this);
	 this.animations.add('walk', Phaser.Animation.generateFrameNames('skeleton-clothed-', 1, 8, '', 0), 7, true);
    this.animations.play('rise');
	this.audioRise = game.add.audio("rise");
	this.audioRise.play();
};

Skeleton.prototype = Object.create(Phaser.Sprite.prototype);
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.update = function () {
	
	this.body.velocity.x = this.speed * this.xDir;
	
  
	
	// follow player
	if(this.x > player.x ){
		this.xDir = -1;	
		this.scale.x = 1;
	}else{
		this.xDir = 1;	
		this.scale.x = -1;
	}


    
};


// Misc
function dano(){
    encolision=false;
}
EnemyDeath = function (game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'atlas', 'enemy-death-1');
    this.anchor.setTo(0.5);
    var anim = this.animations.add('death', Phaser.Animation.generateFrameNames('enemy-death-', 1, 5, '', 0), 16, false);
    this.animations.play('death');
    anim.onComplete.add(function () {
        this.kill();
    }, this);
};

EnemyDeath.prototype = Object.create(Phaser.Sprite.prototype);
EnemyDeath.prototype.constructor = EnemyDeath;




