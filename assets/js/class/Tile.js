console.log('class/Tile.js loaded...');

define( ['jquery'], function( $ ){
	
	function Tile ( x, y, id, type, color, passable ) {
		
		this.game = null;
		
		this.map = null;
		
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

	
	Tile.prototype.init = function ( game, map ){
		this.game = game;
		this.map = map;
	};
	
	
	Tile.prototype.update = function( ){

		this.game.map.camera.apply(this);
		
		var obj = this.game.map.getTileRowColumn(this.oX, this.oY);
		this.stringy = obj['x'] + "," + obj['y'];
		
	};

	Tile.prototype.draw = function( context ){
		
		// draw the tile
		context.fillStyle = this.color;
		context.lineWidth = 1;
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

		var theGuy = 0;
		
		for ( var x = 0; x <= this.map.tileSet.length-1; x++ ){
			if ( this.map.tileSet[x]['id'] === type ){
				//console.log( this.map.tileSet[x]['id'] + ', ' + type );
				theGuy = x;
			}
		}
		
		this.type = this.map.tileSet[theGuy]['name'];
		this.color = this.map.tileSet[theGuy]['gfx'];
		this.passable = this.map.tileSet[theGuy]['passable'];
		
	};
	

	return Tile;
	
});
