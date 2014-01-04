console.log('class/Game.js loaded...');

define( [ 'jquery', 'class/Canvas', 'class/Map', 'class/Player', 'class/Door' ], function( $, Canvas, Map, Player, Door ){
	
	function Game () {
		
		// the target Frames Per Second / ( also the max )
		this.fps = 60;
		
		/*
		 * FPS Calculation
		 */
		this.now = null;
		this.lastUpdate = new Date;
		this.calcFPS = 0;
		this.FrameFPS = null;
		this.fpsFilter = 50;
		
		this.drawLoop = null;
		this.updateLoop = null;
		this.running = false;

		// canvas 
		this.canvas = new Canvas(1216, 768);
		
		// array of active game maps
		this.mapList = [];
		
		// array of active game doors
		this.doorList = [];
		
		// the map
		this.map = new Map(76, 48, "the Polluted Mire 1", this);
		this.map.init({
			mapName: "the Polluted Mire 1",
			tileSet: [
				{ name: "Sludge", id: 1, gfx: "#7d41a2", passable: true },
				{ name: "Swamp Water", id: 2, gfx: "#97b888", passable: false },
				{ name: "Stone", id: 3, gfx: "#769c9c", passable: false },
				{ name: "Sludge Dark", id: 4, gfx: "#6d4192", passable: true }
			],
			tileMap: [
				[4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,2,2,2,3,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3],
				[4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,3,2,2,2,3,3,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3],
				[4,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,3,3,2,2,2,2,3,3,1,1,1,4,4,4,1,1,1,3,3,3,3,3],
				[4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1,1,2,2,3,2,2,2,3,1,1,1,4,4,4,1,1,1,1,1,1,3,3],
				[4,4,4,1,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,3,3,3,2,2,1,1,1,4,4,4,4,4,4,1,1,3,3,3],
				[1,4,4,1,1,1,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,1,1,3,3,3],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,4,4,4,4,4,4,4,1,1,3,3,3],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,1,1,4,4,4,1,4,4,4,4,4,4,4,1,1,1,3,3],
				[1,1,1,1,2,2,3,2,3,3,3,1,2,4,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1],
				[1,2,3,3,2,2,2,2,2,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1],
				[1,3,2,2,2,2,2,2,3,1,1,2,2,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,1],
				[1,3,2,2,2,2,2,3,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,1,3],
				[1,3,2,2,2,2,2,2,1,1,1,2,2,1,1,1,1,1,4,4,4,4,1,4,4,4,4,4,1,1,4,4,4,4,4,1,1,3],
				[3,2,2,2,2,3,2,3,1,1,1,2,2,1,1,1,1,1,4,4,4,4,4,1,1,4,4,4,1,1,4,4,4,4,4,1,3,3],
				[3,2,2,3,3,1,1,1,1,1,1,2,2,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,4,4,4,1,3,3],
				[2,2,2,2,1,1,1,1,1,2,2,2,2,1,1,1,1,4,4,4,4,4,4,1,1,1,3,1,1,1,1,1,4,4,4,1,3,3],
				[2,2,3,2,1,1,1,1,2,2,2,2,2,1,1,1,1,4,4,4,4,4,4,4,1,1,3,2,3,1,1,1,1,1,1,1,3,3],
				[2,2,2,2,1,1,1,1,3,1,2,2,2,1,1,1,4,4,4,4,4,4,4,4,1,1,2,2,2,2,3,1,1,1,1,1,3,3],
				[2,2,2,2,2,3,3,3,2,1,2,2,1,1,1,1,4,4,4,4,4,4,4,4,1,1,2,2,2,2,3,1,1,1,1,1,3,3],
				[2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,4,4,4,4,4,4,4,4,1,1,3,3,3,2,2,1,1,1,1,1,3,3],
				[2,2,1,3,2,2,2,2,2,2,2,2,1,1,1,4,4,4,4,4,4,4,4,4,1,1,1,1,1,1,3,1,1,1,1,1,3,3],
				[2,2,3,2,2,2,2,2,2,3,3,2,3,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3],
				[2,3,2,3,2,3,2,2,3,3,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3],
				[3,3,3,3,2,2,2,3,3,1,1,1,1,1,4,4,4,4,4,4,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
			]
		});
		
		this.mapList.push(this.map);
		
		var thePollutedMire2 = new Map( 38, 24, "the Polluted Mire 2", this );

			thePollutedMire2.init({
				mapName: "the Polluted Mire 2",
				tileSet: [
					{ name: "Sludge", id: 1, gfx: "#7d41a2", passable: true },
					{ name: "Swamp Water", id: 2, gfx: "#97b888", passable: false },
					{ name: "Stone", id: 3, gfx: "#769c9c", passable: false },
					{ name: "Sludge Dark", id: 4, gfx: "#6d4192", passable: true },
					{ name: "Gemstone", id: 5, gfx: "#e7ba2a", passable: false }
				],
				tileMap: [
					[3,3,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3],
					[3,3,2,3,2,2,2,2,2,3,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3],
					[3,3,2,2,2,3,3,2,2,2,2,3,2,2,1,4,1,2,2,2,1,1,1,1,2,2,2,2,2,2,3,2,3,3,3,3,3,3],
					[3,2,1,2,2,2,2,2,3,2,4,1,1,4,1,1,1,1,1,1,1,1,4,1,1,1,2,2,2,2,3,2,2,3,3,3,3,3],
					[3,2,3,1,1,1,4,1,1,1,1,1,1,1,4,1,1,1,4,1,1,1,1,1,1,1,1,2,3,2,2,2,2,3,2,2,3,3],
					[3,2,1,4,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,4,1,2,2,2,2,2,3,2,2,2,3,3],
					[3,2,2,1,1,4,1,1,1,1,1,1,1,1,1,1,4,1,1,2,1,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2],
					[3,1,1,1,1,1,1,4,1,1,1,4,1,1,1,1,1,1,3,3,2,1,1,1,1,1,1,1,1,3,3,2,2,3,2,2,2,2],
					[1,1,1,1,4,1,1,1,4,1,1,1,1,4,1,1,3,3,3,3,3,1,4,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2],
					[1,1,1,1,1,4,1,1,1,1,1,1,1,2,3,3,3,2,3,3,2,1,1,1,1,4,1,1,1,4,1,1,1,1,1,2,2,2],
					[1,1,4,1,1,1,1,1,3,3,3,2,1,2,3,3,3,3,3,4,1,1,1,4,4,1,1,1,1,1,1,1,1,1,1,1,2,2],
					[2,1,1,1,1,1,1,1,3,2,3,3,3,3,3,3,3,2,2,1,1,1,1,1,1,1,4,1,1,1,1,1,1,4,1,3,2,2],
					[2,2,1,1,1,1,1,1,2,3,3,3,3,2,3,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2],
					[2,2,1,1,1,3,3,3,3,3,3,3,2,3,2,1,4,1,1,1,1,1,1,1,4,1,1,1,1,4,1,1,1,1,1,1,2,2],
					[2,3,4,1,1,2,2,3,3,2,2,2,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,2,2],
					[2,2,1,1,1,2,3,3,2,1,1,1,1,1,4,1,1,1,4,1,1,1,4,1,1,4,3,5,4,1,1,4,1,4,1,1,2,2],
					[2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,5,3,4,4,1,1,3,1,1,1,3,2,2],
					[2,2,1,1,1,1,1,4,1,1,4,1,1,1,1,1,1,1,1,4,1,1,4,1,4,4,3,3,5,1,1,1,3,3,1,1,2,2],
					[2,2,1,4,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,4,1,3,5,5,1,3,1,3,1,3,3,3,3],
					[2,2,2,1,1,4,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,4,1,5,3,1,3,1,1,1,3,3,3,3],
					[2,2,3,2,2,2,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,4,3,3,3,3,3],
					[3,2,3,2,2,2,1,1,1,1,1,1,1,2,2,2,4,4,1,1,1,1,1,2,2,2,3,2,3,1,3,3,1,1,1,3,3,3],
					[2,3,2,3,2,2,2,3,2,2,2,2,2,2,3,2,2,2,2,3,2,2,2,2,2,2,2,3,2,2,2,2,2,3,3,3,3,3],
					[2,3,3,2,2,2,3,2,2,2,3,2,3,2,3,2,2,3,2,2,2,3,2,2,2,2,3,2,2,2,3,2,3,3,3,3,3,3]
				]
			});
		
		this.mapList.push( thePollutedMire2 );
		
		this.doorList.push( new Door(
								// A
								{
									map: this.mapList[0],
									index: 0,
									name: this.mapList[0].name,
									entry: [
										{x:37,y:8},
										{x:37,y:9},
										{x:37,y:10},
									],
									exit: {x:36, y:9}
								},
								// B
								{
									map: this.mapList[1],
									index: 1,
									name: this.mapList[1].name,
									entry: [
										{x:0,y:8},
										{x:0,y:9},
										{x:0,y:10},
									],
									exit: {x:1, y:9}
								}
							));
		
		
		console.log(this.doorList);
		
		//this.loadMap(1);
		
		// the user controlled player character
		this.player = new Player(this.map.width/2, this.map.height/2);
		this.player.init(this);


		
	};

	Game.prototype.draw = function( context ){
		
		// clear the canvas each draw?
		this.map.draw(context);

		this.player.draw(context);

		//this.map.camera.draw(context);

        this.drawFPS(context);

	};

	Game.prototype.update = function( game ){
		
		this.map.update( game );

			// debugger
			var pc = this.map.getTileCoordinates( this.map.getTileAtPixels(this.player.oX, this.player.oY) );
			
			$('#debugga .stuff').html('');
			$('#debugga .stuff').append($('<p>Player Coords:('+pc['x']+', '+pc['y']+')</p>'));
			$('#debugga .stuff').append($('<p>Player Orig:('+this.player.oX+', '+this.player.oY+')</p>'));
			$('#debugga .stuff').append($('<p>Player Screen:('+this.player.x+', '+this.player.y+')</p>'));
			$('#debugga .stuff').append($('<p>Camera:('+this.map.camera.offsetX+', '+this.map.camera.offsetY+')</p>'));
		
			
		this.player.update( game );

		this.calculateFPS();
		
	};
	
	Game.prototype.init = function(){
		
		// used to avoid scope confusion of setInterval
		var _super = this;
		
		this.canvas.init();
		
		this.drawLoop = setInterval(function(){
			_super.draw( _super.canvas.ctx );
		}, 1000/this.fps );
		
		this.updateLoop = setInterval(function(){
			_super.update(_super);
		}, 1000/this.fps );
		
		console.log("game init-ed");
		this.running = true;
		
	};

	Game.prototype.calculateFPS = function( ){
		this.FrameFPS = 1000 / ((this.now=new Date) - this.lastUpdate);
        this.calcFPS += (this.FrameFPS - this.calcFPS) / this.fpsFilter;
        this.lastUpdate = this.now;		
	};
	
	Game.prototype.drawFPS = function(context){
		// Draw the Frame Rate
		context.font = "10pt Open Sans";
		context.fillStyle = "rgb(266,266,255)";
		context.textAlign="end"; 
		context.fillText( "FPS " + Math.floor(this.calcFPS), this.canvas.width - 20 , this.canvas.height - 20);
	};
	
	Game.prototype.loadMap = function( newMapIndex ){
		
		if ( newMapIndex < this.mapList.length && newMapIndex >=0 ) {
			// swap the active map
			this.map = this.mapList[newMapIndex];
			
			//console.log(this.map.tileSet);
			
			// set the active tileset
			this.map.tileSet = this.mapList[newMapIndex]['tileSet'];
			
		} else {
			console.error('this map does not exist');
		}
		 
	};

	return Game;
	
});
