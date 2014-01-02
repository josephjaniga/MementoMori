console.log('class/Map.js loaded...');

define( ['jquery', 'class/Tile', 'class/TileSet',  'class/Camera'], function( $, Tile, TileSet, Camera ){
	
	function Map ( tilesWide, tilesTall, name, game ) {
		
		this.name = name || "a Default Map";
		
		this.game = game;
		
		// the number of tilesTall and tilesWide of tiles on this map
		this.tilesWide = tilesWide || 4;
		this.tilesTall = tilesTall || 3;
		
		this.tileMap = [];
		
		var t = new Tile(),
			z = 1;
		
		// the size of the map in pixels 
		this.height = this.tilesTall * t.height;
		this.width = this.tilesWide * t.width;

		// the camera
		this.camera = new Camera( function(){}, this.game.canvas.width, this.game.canvas.height, this.game );

		
		// the tileMap init
		for ( x = 0; x < this.tilesWide; x++ ){
			
			// make a Row array of tiles
			var tileRow = [];
			
			for ( y = 0; y < this.tilesTall; y++ ){
				var tempTile = new Tile( (x * t.width), (y * t.height), z );
				
				tempTile.init(this.game);
				
				if ( (Math.floor(Math.random() * 4) + 1) === 1 ) {
					//tempTile.tileType("Default Water");
				}
					
				// push tile into row
				tileRow.push( tempTile );
				
				z++;
			
				// push the row when done
				if ( y === this.tilesTall - 1 ){
					this.tileMap.push( tileRow );
				}
			}
		}
		
	};

	Map.prototype.update = function( game ){
		
		if ( !this.camera.fixed ){
			
			this.camera.update( game.player );
			
			var camRef = this.camera;
	
			this.tileMap.forEach( function( tileRow ){
				tileRow.forEach( function( tile ){
					tile.tileType('Default Grass');
					tile.update();
				});
			});
			
		} 
		
		this.getTileAtPixels(game.player.x, game.player.y).tileType('On Camera');
		
	};

	Map.prototype.draw = function( context ) {

		if ( !this.camera.fixed ){
			
			var camRef = this.camera;
	
			this.tileMap.forEach( function( tileRow ){
				tileRow.forEach( function( tile ){
					//camRef.apply(tile).draw(context);
					tile.draw(context);
				});
			});
			
		} else {
				
			this.tileMap.forEach( function( tileRow ){
				tileRow.forEach( function( tile ){
					tile.draw(context);
				});
			});
		
		}		
		
		/*
		 * the map name
		 */
		
		// Draw the Map Name
		// context.font = "10pt Arial";
		// context.fillStyle = "rgb(255,255,255)";
		// context.fillText(this.name, 10, 20);
		
	};
	
	
	/*
	 * input:  	a Pixel Coordinate Location 	(X, Y)
	 * output: 	the Tile object at that Location
	 */
	Map.prototype.getTileAtPixels = function ( x, y ){
		 var 	remainder = x % this.tileMap[0][0].width,
		 		tileX = ( x - remainder ) / this.tileMap[0][0].width,
		 		remainder = y % this.tileMap[0][0].height,
		 		tileY = ( y - remainder ) / this.tileMap[0][0].height;
		
		return this.tileMap[tileX][tileY];
	};


	/*
	 * input: 	Row / Column X & Y coords
	 * output: 	Tile at that position
	 */
	Map.prototype.getTileAtRowColumn = function ( x, y ){
		return this.tileMap[x][y];
	};

	
	/*
	 * input:  	a Pixel Coordinate Location 	(X, Y)
	 * output: 	an object with the tile containing that coordinates
	 * 			Row Column Tile Position 		{ 'x': X, 'y': Y } 
	 */
	Map.prototype.getTileRowColumn = function ( x, y ){
		 var 	remainder = x % this.tileMap[0][0].width,
		 		tileX = ( x - remainder ) / this.tileMap[0][0].width,
		 		remainder = y % this.tileMap[0][0].height,
		 		tileY = ( y - remainder ) / this.tileMap[0][0].height;
		 
		 return { 'x': tileX, 'y': tileY };
	};
	
	return Map;
	
});
