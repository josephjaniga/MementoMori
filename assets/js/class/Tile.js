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

		var theGuy = 0
		
		for ( var x = 0; x < this.game.map.tileSet.length; x++ ){
			console.log( this.game.map.tileSet[x]['id'] + ', ' + type );
			if ( this.game.map.tileSet[x]['id'] === type ){
				theGuy = x;
			}
		}
		
		this.type = this.game.map.tileSet[theGuy]['name'];
		this.color = this.game.map.tileSet[theGuy]['gfx'];
		this.passable = this.game.map.tileSet[theGuy]['passable'];
		
	};
	

	return Tile;
	
});
