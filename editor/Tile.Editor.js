var app = angular.module('TileEditor', []);

function TileEditorCtrl($scope){
	
	$scope.tileSet = [
		{ name: "Blank", id: '_', gfx:'rgb(133,133,133)', passable: true, pos: { x: 0, y: 0 }, hash: randomHash() },
		{ name: 'Default Grass', id: 0, gfx: 'rgb(0,150,0)', passable: true, pos: { x: 0, y: 0 }, hash: randomHash() },
		{ name: 'Default Water', id: 1, gfx: 'rgb(99,200,255)', passable: false, pos: { x: 0, y: 0 }, hash: randomHash() },
		{ name: 'On Camera', id: 2, gfx: 'rgb(200,150,0)' , passable: true, pos: { x: 0, y: 0 }, hash: randomHash() }
	];
	
	$scope.mapName = "Default Map Name"
	
	$scope.brushSize = 0;
	$scope.tileMap = [];
	$scope.mapWidth = 38;
	$scope.mapHeight = 24;
	
	for (var y = 0; y < $scope.mapHeight; y++ ){
		var mapRow = { row: [], hash: randomHash()  };
		for(var x = 0; x < $scope.mapWidth; x++ ){
			mapRow['row'].push( { name: "Blank", id: '_', gfx:'rgb(133,133,133)', passable: true, pos: { x: x, y: y }, hash: randomHash() } );
		}
		$scope.tileMap.push(mapRow);
	}
	
	$scope.selectedLeft = { name: "Blank", id: '_', gfx:'rgb(133,133,133)', passable: true, pos: { x: 0, y: 0 }, hash: randomHash() };
	$scope.selectedRight = { name: "Blank", id: '_', gfx:'rgb(133,133,133)', passable: true, pos: { x: 0, y: 0 }, hash: randomHash() };
	
	$scope.setBrushSize = function(input){
		$scope.brushSize = input;
	};

	$scope.addToTileSet = function() {
		
		var maxID = 0;
		
		$scope.tileSet.forEach(function(tile){
			if ( tile['id'] > maxID ){
				maxID = tile['id'];
			}
		});
		
		maxID++;
		
		$scope.tileSet.push(
			{ name: $scope.newTileName, id: maxID, gfx: $scope.newTileColor, passable: $scope.newTilePassable, pos: { x: 0, y: 0 }, hash: randomHash() }
		);
		
	};
	
	$scope.resizeMap = function() {
		$scope.mapWidth = $scope.resizeWidth;
		$scope.mapHeight = $scope.resizeHeight;
		
		$scope.tileMap = [];
		
		for (var y = 0; y < $scope.mapHeight; y++ ){
			var mapRow = { row: [], hash: randomHash()  };
			for(var x = 0; x < $scope.mapWidth; x++ ){
				mapRow['row'].push( { name: "Blank", id: '_', gfx:'rgb(133,133,133)', passable: true, pos: { x: x, y: y }, hash: randomHash() } );
			}
			$scope.tileMap.push(mapRow);
		}
		
	};


	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		//console.log('repeat-finished');
		
		// sort the tiles in the rows by x position
		$scope.tileMap.sort( function(a,b){ return a['row'][0]['pos']['y'] - b['row'][0]['pos']['y']; } );
		
		// sort the tiles in the rows by x position
		for (var y = 0; y < $scope.mapHeight; y++ ){
			$scope.tileMap[y]['row'].sort( function(a,b){ return a['pos']['x'] - b['pos']['x']; });
		}
		
		for (var y = 0; y < $scope.mapHeight; y++ ){
			for(var x = 0; x < $scope.mapWidth; x++ ){
				if ( $scope.tileMap[y]['row'][x] === null )
					$scope.tileMap[y]['row'][x] = { name: "Blank", id: '_', gfx:'rgb(133,133,133)', passable: true, pos: { x: x, y: y }, hash: randomHash() };
			}
		}
	});

	$scope.assignLeft = function(tile){
		$scope.selectedLeft = tile;
	};
		
	$scope.assignRight = function(tile){
		$scope.selectedRight = tile;
	};
	
	
	$scope.setLeft = function(tile){
		console.log(tile);

		if ( $scope.brushSize === "0" ) {
			
			//console.log("brush size 0");
			
			var tempTile = {name: $scope.selectedLeft['name'], id: $scope.selectedLeft['id'], gfx: $scope.selectedLeft['gfx'], passable: true, pos: {x: tile['pos']['x'], y: tile['pos']['y'] }, hash: randomHash() };
			$scope.tileMap[ tile['pos']['y'] ]['row'][ tile['pos']['x'] ] = tempTile;
			
		} else {
			
			//console.log('brush not 1');
			
			var minX = ( parseInt(tile['pos']['x']) - parseInt($scope.brushSize) >= 0 ) ? ( parseInt(tile['pos']['x']) - parseInt($scope.brushSize) ) : 0,
				minY = ( parseInt(tile['pos']['y']) - parseInt($scope.brushSize) >= 0 ) ? ( parseInt(tile['pos']['y']) - parseInt($scope.brushSize) ) : 0,
				maxX = ( parseInt(tile['pos']['x']) + parseInt($scope.brushSize) < $scope.mapWidth ) ? ( parseInt(tile['pos']['x']) + parseInt($scope.brushSize) ) : $scope.mapWidth -1 ,
				maxY = ( parseInt(tile['pos']['y']) + parseInt($scope.brushSize) < $scope.mapHeight ) ? ( parseInt(tile['pos']['y']) + parseInt($scope.brushSize) ) : $scope.mapHeight - 1;
			
			//console.log( 'x: ' + minX+'/'+maxX+ ', y: ' +minY+'/'+maxY  + ' brush:' + $scope.brushSize + ' mapWidth:' + $scope.mapWidth + ' mapHeight:' + $scope.mapHeight);
			
			for (var y = minY; y <= maxY; y++ ){
				for(var x = minX; x <= maxX; x++ ){
					console.log(x +', '+ y);
					var tempTile = {name: $scope.selectedLeft['name'], id: $scope.selectedLeft['id'], gfx: $scope.selectedLeft['gfx'], passable: true, pos: {x: x, y: y}, hash: randomHash() };
					$scope.tileMap[ y ]['row'][ x ] = tempTile;		
				}
			}				
			
		}
		
	
		
		
	};
		
	$scope.setRight = function(tile){
		//console.log(tile);
		var tempTile = {name: $scope.selectedRight['name'], id: $scope.selectedRight['id'], gfx: $scope.selectedRight['gfx'], passable: true, pos: tile['pos'], hash: randomHash() };
		$scope.tileMap[ tile['pos']['y'] ]['row'][ tile['pos']['x'] ] = tempTile;
	};
	
	$scope.removeTile = function(index){
		$scope.tileSet.splice(index, 1);
	};	
	
	$scope.updateName = function( newName ){
		$scope.mapName = newName;
	};
	
	
} /*---- end of TileEditorCtrl -----*/

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

app.filter('commaNotLast', function(){
	return	function(input){
				return input == 1 ? '' : ',';
			};
});

app.filter('timesTen', function(){
	return	function(input){
				return input * 10 + 10 +"px";
			};
});

function randomHash(){
	return Math.random().toString(36);
}

