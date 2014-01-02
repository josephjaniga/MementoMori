console.log('class/Tile.js loaded...');

define( ['jquery'], function( $ ){
	
	function Tile ( x, y, id, type, color, passable ) {
		
		this.game = null;
		
		// the original coords
		this.oX = x || 0;
		this.oY = y || 0;

		this.id = id || null;
		
		// the onscreen coords
		this.x = x || 0;
		this.y = y || 0;

		this.width = 32;
		this.height = 32;
		
		this.type = type || "Default Grass";
		this.color = "rgb(0,130,0)";
		
		this.passable = passable || true;
		
		this.stringy = "";
		
	}

	
	Tile.prototype.init = function ( game ){
		this.game = game;
	};
	
	
	Tile.prototype.update = function( ){

		this.game.map.camera.apply(this);
		
		var obj = this.game.map.getTileRowColumn(this.oX, this.oY);
		this.stringy = obj['x'] + "," + obj['y'];
		
	};

	Tile.prototype.draw = function( context ){
		
		// draw the tile
		context.fillStyle = this.color;
		context.strokeStyle = "rgb(50,50,50)";
		context.fillRect( this.x, this.y, this.width, this.height );
		context.strokeRect( this.x, this.y, this.width, this.height );
		
		// Draw the row, col
		// context.textAlign="center";
		// context.font = "8pt Arial";
		// context.fillStyle = "rgb(255,255,255)";
		// context.fillText(this.stringy, this.x+16, this.y+16);
	};
	
	Tile.prototype.tileType = function( type ){
		
		/*
		 * Re-Address this
		 */
		
		if ( type === "Default Water" ) {
			this.type = type;
			this.color = "rgb(99, 200, 255)";
			this.passable = false;
		} else if ( type === "Default Grass") {
			this.type = "Default Grass";
			this.color = "rgb(0,130,0)";
			this.passable = true;
		} else if ( type === "On Camera") {
			this.type = "Default Grass";
			this.color = "rgb(200,150,0)";
			this.passable = true;
		}
	};
	

	return Tile;
	
});
