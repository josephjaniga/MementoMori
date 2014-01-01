console.log('class/TileSet.js loaded...');

define( ['jquery', 'class/Tile'], function( $, Tile ){
	
	function TileSet ( map ) {
		
		// contain & define the different "types" of tiles used in the map
		this.map = map || null;
		this.name = "Default TileSet";
		
		this.tiles = [];
		
		// populate default TileSet
		
		this.addTile( new Tile( /* Default Grass Tile */ ) );
		this.addTile( new Tile( null, null, null, "Default Water", "rgb(99, 200, 255)", false )  );
		
	}

	TileSet.prototype.init = function( map ){
		
	}
	
	TileSet.prototype.addTile = function( aTile ){
		this.tiles.push(aTile);
	}

	return TileSet;
	
});
