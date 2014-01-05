console.log('class/Map.js loaded...');

define( ['jquery', 'class/Tile', 'class/TileSet',  'class/Camera', 'class/Door'], function( $, Tile, TileSet, Camera, Door ){
	
	function Map ( tilesWide, tilesTall, name, game ) {
		
		this.name = name || "a Default Map";
		
		this.mapNameOpacity = 1;
		
		this.game = game;
		
		// the number of tilesTall and tilesWide of tiles on this map
		this.tilesWide = tilesWide || 4;
		this.tilesTall = tilesTall || 3;
		
		this.tileMap = [];
		
		this.tileSet = [
			{ name: "Default Grass", id: 0, gfx: "rgb(0,150,0)", passable: true },
			{ name: "Default Water", id: 1, gfx: "rgb(99,200,255)", passable: false },
			{ name: "On Camera", id: 2, gfx: "rgb(200,150,0)", passable: true }
		];
		
		this.t = new Tile();
		this.t.init(this.game, this);
		
		// the size of the map in pixels 
		this.height = this.tilesTall * this.t.height;
		this.width = this.tilesWide * this.t.width;

		// the camera
		this.camera = new Camera( function(){}, this.game.canvas.width, this.game.canvas.height, this.game );

	};
	
	Map.prototype.init = function ( mapObj ){
		
		var z = 1;
		
		if ( mapObj ){
			
			// assign the object to the map
			this.tileSet = mapObj['tileSet'];
			
			// get the map size
			this.tilesWide = mapObj['tileMap'][0].length,
			this.tilesTall = mapObj['tileMap'].length;
			
			this.height = this.tilesTall * this.t.height;
			this.width = this.tilesWide * this.t.width;
			
			this.name = mapObj['mapName'];
			
			this.t = new Tile();
			this.t.init(this.game, this);
			
			for ( x = 0; x < this.tilesWide; x++ ){
				
				// make a Row array of tiles
				var tileRow = [];
				
				for ( y = 0; y < this.tilesTall; y++ ){
					
					var tempTile = new Tile( (x * this.t.width), (y * this.t.height), z );
					tempTile.init(this.game, this);
					
					tempTile.tileType( mapObj['tileMap'][y][x] );
					
					// push tile into row
					tileRow.push( tempTile );
					
					z++;
				
					// push the row when done
					if ( y === this.tilesTall - 1 ){
						this.tileMap.push( tileRow );
					}
				}
			}				
			
		} else {
			
			// randomly generate some crap
			for ( x = 0; x < this.tilesWide; x++ ){
				
				// make a Row array of tiles
				var tileRow = [];
				
				for ( y = 0; y < this.tilesTall; y++ ){
					
					var tempTile = new Tile( (x * t.width), (y * t.height), z );
					
					tempTile.init(this.game, this);
					
					if ( (Math.floor(Math.random() * 4) + 1) === 1 ) {
						tempTile.tileType("Default Water");
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
		}
		
	};

	Map.prototype.update = function( game ){
		
		if ( !this.camera.fixed ){
			
			//console.log(this.name);
			
			this.camera.update( game.player );
			
			var camRef = this.camera;
	
			this.tileMap.forEach( function( tileRow ){
				tileRow.forEach( function( tile ){
					tile.update();
				});
			});
			
		} 
		
		if ( this.mapNameOpacity > 0.0 ){
			var seconds = 3,
				oneStep = 1.0/(seconds * this.game.fps);

			if ( this.mapNameOpacity - oneStep < 0.0 )
				this.mapNameOpacity = 0.0;
			else
				this.mapNameOpacity = this.mapNameOpacity - oneStep;
		}
		
	};

	Map.prototype.draw = function( context ) {

		if ( !this.camera.fixed ){
			
			var camRef = this.camera;
	
			this.tileMap.forEach( function( tileRow ){
				tileRow.forEach( function( tile ){
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
		
		if ( this.mapNameOpacity >= 0 ){
			
			var op = "0.0";
			
			if (this.mapNameOpacity !== 0){
				op = Math.round(this.mapNameOpacity*100)/100;
			}
			
			// Draw the Map Name
			context.textAlign="center"; 
			context.font = "14pt 'Press Start 2P'";
			context.lineWidth = 8;
			context.strokeStyle = "rgba(0,0,0,"+op+")";
			context.fillStyle = "rgba(255,255,255,"+op+")";
			context.strokeText( ""+this.name+"", this.game.canvas.width/2, this.game.canvas.height/8.5 );
			context.fillText( ""+this.name+"", this.game.canvas.width/2, this.game.canvas.height/8.5 );			
		}   

		
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
	 */
	Map.prototype.getTileCoordinates = function( tile ){
		 var 	remainder = tile.x % tile.width,
		 		tileX = ( tile.x - remainder ) / tile.width,
		 		remainder = tile.y % tile.height,
		 		tileY = ( tile.y - remainder ) / tile.height;
		 
		 return { 'x': tileX, 'y': tileY };		
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
