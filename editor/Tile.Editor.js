var app = angular.module('TileEditor', []);

function TileEditorCtrl($scope){
	
	$scope.tileSet = [
		{ name: "Blank", id: '_', gfx:'rgb(133, 133, 133)', passable: null, pos: { x: 0, y: 0 }, hash: randomHash() },
		{ name: 'Default Grass', id: 0, gfx: 'rgb(0,150,0)', passable: true, pos: { x: 0, y: 0 }, hash: randomHash() },
		{ name: 'Default Water', id: 1, gfx: 'rgb(99, 200, 255)', passable: false, pos: { x: 0, y: 0 }, hash: randomHash() },
		{ name: 'On Camera', id: 2, gfx: 'rgb(200,150,0)' , passable: true, pos: { x: 0, y: 0 }, hash: randomHash() }
	];
	
	$scope.tileMap = [];
	
	$scope.mapWidth = 22;
	$scope.mapHeight = 12;
	
	for (var y = 0; y < $scope.mapHeight; y++ ){
		var mapRow = { row: [], hash: randomHash()  };
		for(var x = 0; x < $scope.mapWidth; x++ ){
			mapRow['row'].push( { name: "Blank", id: '_', gfx:'rgb(133, 133, 133)', passable: null, pos: { x: x, y: y }, hash: randomHash() } );
		}
		$scope.tileMap.push(mapRow);
	}
	
	$scope.selectedLeft = { name: "Blank", id: '_', gfx:'rgb(133, 133, 133)', passable: null, pos: { x: 0, y: 0 }, hash: randomHash() };
	$scope.selectedRight = { name: "Blank", id: '_', gfx:'rgb(133, 133, 133)', passable: null, pos: { x: 0, y: 0 }, hash: randomHash() };
	

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
				mapRow['row'].push( { name: "Blank", id: '_', gfx:'rgb(133, 133, 133)', passable: null, pos: { x: x, y: y }, hash: randomHash() } );
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
					$scope.tileMap[y]['row'][x] = { name: "Blank", id: '_', gfx:'rgb(133, 133, 133)', passable: null, pos: { x: x, y: y }, hash: randomHash() };
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
		//console.log(tile);
		var tempTile = {name: $scope.selectedLeft['name'], id: $scope.selectedLeft['id'], gfx: $scope.selectedLeft['gfx'], passable: true, pos: tile['pos'], hash: randomHash() };
		$scope.tileMap[ tile['pos']['y'] ]['row'][ tile['pos']['x'] ] = tempTile;
	};
		
	$scope.setRight = function(tile){
		//console.log(tile);
		var tempTile = {name: $scope.selectedRight['name'], id: $scope.selectedRight['id'], gfx: $scope.selectedRight['gfx'], passable: true, pos: tile['pos'], hash: randomHash() };
		$scope.tileMap[ tile['pos']['y'] ]['row'][ tile['pos']['x'] ] = tempTile;
	};
	
}

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

function randomHash(){
	return Math.random().toString(36);
}

