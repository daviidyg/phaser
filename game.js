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
/* Codi base - En aquesta part del codi crea una pantalla de carrega.*/
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
    /* Codi base - En aquesta part carreguem tots els assets que farem servir en el joc. Hem afegit nous cartells per l'inici del joc, els controls, la pantalla de game over
    , credits i les instruccions. Hem modificat el tilemap gracies al programa tiled, hem afegit un nou enemic amb dues animacions  i un conjunt de musica royalty free.*/
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
        this.game.state.start('TitleScreen');
    }
}

var titleScreen = function (game) {

};

titleScreen.prototype = {
    create: function () {
        /* En aquesta funcio crearem la pantalla d'inici on carregara els assets necesaris. Una vegada apretin qualsevol tecla començara el joc. */
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
        /* Codi base - Permet que el text de press enter sigui intermitent. */
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
            /* Codi base -  carrega els assets per mostrar els controls i si fan clic a enter començara el joc.*/
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
        /* En aquesta funció es reniciaran la majoria de variables que fem servir en el joc com variables booleanes, highscore o vides. A més també es parara música depenent on
        esta el jugador en aquell moment. Si encara no arribat al boss la variable music parara, si está en el boss mboss ho fara. Un altre cosa que es reniciara sera el interval
        que fem servir per les animacions del boss. */
        music.stop();
        if(hapasao && !finalboss){
            mboss.stop();
            finalbattle=false;
        }
        bg_moon = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-moon');
        bg_mountains = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-mountains');
        vidasboss=0;
        this.title = game.add.image(gameWidth / 2, 100 , 'game-over');
        this.title.anchor.setTo(0.5);
        var credits = game.add.image(gameWidth / 2, game.height - 12, 'credits');
        credits.anchor.setTo(0.5);
        this.pressEnter = game.add.image(game.width / 2, game.height - 40, 'enter');
        this.pressEnter.anchor.setTo(0.5);
        clearInterval(intervaloboss);
        game.time.events.loop(700, this.blinkText, this);
        var startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        startKey.onDown.add(this.startGame, this);
        this.state = 2;
        mfinal = game.add.audio('mfinal');
        mfinal.volume = 0.7;
        mfinal.loop = true;
        mfinal.play();
        hapasao=false;
        Highscorecounter = game.add.text(140,160,'Puntuación: '+highscore);
        Highscorecounter.addColor('#ffff00',0);
        Highscorecounter.fixedToCamera = true;
        Highscorecounter.fontSize = 10;
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
    /* En aquesta funció fem que el jugador tingui invencibilitat durant un segon després de rebre un atac, per tal de que no desconti més d'una vida. */
    var pegado=false;
    hurtFlag=false;
    
    
}
var playGame = function (game) {
};
playGame.prototype = {
    /* codi base - En aquesta part del codi estara la majoria del joc. */
    create: function () {
        minicio.stop();
		this.createBackgrounds();
		this.createTileMap();
        this.populate();
		this.bindKeys();
		this.createPlayer(6, 9);
		this.createHitbox();
		  
        // codi base - La camara seguira al jugador
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
        // codi base - en aquesta funció crea els hitbox i les colisions.
        hitbox = game.add.sprite(0, 16, null);
        hitbox.anchor.setTo(0.5);
        game.physics.arcade.enable(hitbox);
        hitbox.body.setSize(30, 16, 0, 0);
        player.addChild(hitbox);
		hitbox.x = 39;
    },
	populate: function(){
        /* En aquesta funció crearem els enemics que sortiran en el mapa i els afegirem en un variable que sera un grup. */
        //enemies group
        enemies_group = game.add.group();
        enemies_group.enableBody = true;
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
        /* codi base - En aquesta part del codi asignem els controls */
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
        /* Aqui crearem al jugador, el highscore, les sevas vidas i les imatges de aquestes. */
        highscore = 0;
        var temp = new Player(game, x, y);
        Highscorecounter = game.add.text(300,10,highscore);
        Highscorecounter.addColor('#ffff00',0);
        Highscorecounter.fixedToCamera = true;
        Highscorecounter.fontSize = 15;
        livescounter = game.add.image(20, 10, 'vidas');
        vidas1 = game.add.image(40, 10, 'vidas');
        vidas2 = game.add.image(60, 10, 'vidas');
        livescounter.fixedToCamera = true;
        vidas1.fixedToCamera = true;
        attackingflag=false
        
        vidas2.fixedToCamera = true;
        game.add.existing(temp);
    },
    /* Codi base - A continuació creara el mapa amb les dades del tilemap que ha creat i nosaltres em modificat amb tiled. */
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
        /* Codi base - En aquesta part afegira valors que s'aniran actualitzan a mesura que el joc avança. */
       
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
		// Si el jugador ha arribat al final del stage parara la musica del stage i asignara true un valor que utilizarem mes andavant.
		if(player.position.x > 307 * 16  && !hapasao){
           console.log()
           hapasao=true;
           finalboss=true;
            music.stop()
        } 
        // una vegada el jugador arriba a l'area del boss sonara la seva musica i asignarem true a la variable de finalbattle que utilitzarem en el seguent if.
        if(player.position.x > 352 * 16 && finalboss){
            mboss = game.add.audio('mboss');
            mboss.volume = 0.3;
            mboss.loop = true;
            mboss.play()
            finalboss=false;
            finalbattle=true
                }
                //Finalment farem que el jugador no pugi tornar enrerre. fins i tot podríem esborrar en la funció de GameOver que es posi en false finalbattle per tal de fer un checkpoint.
                //Hem decidit no fer-ho per tal de aumentar la rejugabilitat.
        if(player.position.x<353 * 16 && finalbattle){
            player.position.x = 353 * 16;
        }
		
    },
	
    
	
    hurtPlayer: function () {
        /* En aquesta funció descontarem vidas al jugador si ha sigut atacat i l'afegirem un segon de invencibilitat. A més descontarem 500 de la puntació per cada vida perduda.  */
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
    /* Aqui esborrarem les imatges que simbolitzen les vidas. */
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
        /* En aquesta funció farem que el jugador ataqui i mati enemics. A més com no sabem quin tipus de enemic és eliminarem vida al enemic i si arriba a 0 moriria.
        El boss te 5 vidas i per cada vida perduda es sumara un contador, si el contador arriba a 4 el joc acabara en 3 segons.  */
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
            /* Els enemics també tenen invencibilitat per evitar matar al boss en un cop. */
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
		/* Codi base - En aquesta funció es creara tot el moviment del jugador. */
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
            /* Em modificat el codi per que pugi atacara al saltar i es pugi moure al saltar */
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

// Aqui crarem la entitat del jugador.

Player = function(game, x, y){
    /*  Codi base*/
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
    //animacions jugador
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
	// Codi base - matara el jugador si esta al nivell dels pinxos.
	if(this.position.y > 172){
		audioHurt.play();
		this.game.state.start('GameOver');
	}
	
	
}

// Enemics
Boss = function(game, x, y){
    /*  Aquest es el boss i aqui es crea els sprites i les animacions. Tot aixó ho hem creat nosaltes, menys el art que es del mateix artista.*/
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
    /* En aquest interval el boss anira alterant de sprite i animació. En la animació d'attack la seva hitbox desapareixera i no se li pot fer dany. */
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
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5);
    this.body.setSize(80, 100, 23, 28);//23, 28;
};
Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.constructor = Boss;
Boss.prototype.update = function () {
	/* Aixó fara que el boss es vagi movent horitzontalment. */
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
        /* codi base */

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
	
	// es donara la volta
	if(this.turnTimer <= 0){
		this.turnTimer = this.turnTimerTrigger ;
		this.xDir *= -1;
	}else{
		this.turnTimer -= 1;
	}

    
};


Ghost = function (game, x, y) {
        /* codi base */

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
	
	// mirara al jugador
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

	    /* codi base */

	if(this.spawnInfront){
		// apareixera devant
		if( player.x  > this.x - 9* 16 ){

	        var temp = new Skeleton(game, this.x / 16, ( this.y / 16) - 34/ 16 );
	        game.add.existing(temp);
	        enemies_group.add(temp);	
		
			this.destroy();
		
		}	
	}else{
		// apareixera derrere
		if( player.x  > this.x + 6 * 16 ){
		
	        var temp = new Skeleton(game, this.x / 16, ( this.y / 16) - 34/ 16 );
	        game.add.existing(temp);
	        enemies_group.add(temp);	
		
			this.destroy();
			
			
		}
	}
	
	
   
};


Skeleton = function (game, x, y) {
    /* codi base */
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
	
  
	
	// seguira al jugador 
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
     /* Codi base - Aqui matara al enemic. */
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




