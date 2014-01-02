console.log('class/Game.js loaded...');

define( [ 'jquery', 'class/Canvas', 'class/Map', 'class/Player' ], function( $, Canvas, Map, Player ){
	
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
		
		// the map
		this.map = new Map(76, 48, "The Grassy Knoll", this);
	
		
		// the user controlled player character
		this.player = new Player(this.canvas.width/2, this.canvas.height/2);
		this.player.init(this);
		
	};

	Game.prototype.draw = function( context ){
		
		// clear the canvas each draw?
		
		this.map.draw(context);
		this.player.draw(context);

		this.map.camera.draw(context);

        this.drawFPS(context);

	};

	Game.prototype.update = function( game ){
		
		this.map.update( game );

		// debugger
			$('#debugga .stuff').html('');
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
		context.font = "10pt Arial";
		context.fillStyle = "rgb(255,255,255)";
		context.textAlign="end"; 
		context.fillText( "FPS: " + Math.floor(this.calcFPS), this.canvas.width - 20 , this.canvas.height - 20);
	};

	return Game;
	
});
