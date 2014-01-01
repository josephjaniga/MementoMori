console.log('class/Camera.js loaded...');

define( [ 'jquery' ], function( $ ){
	
	function Camera ( cam_func, width, height, game ) {
		
		this.game = game,
		
		this.cam_func = cam_func,
		
		this.width = width || 1216,
		this.height = height || 768,
		
		this.fixed = false,
		
		this.offsetX = 0,
		this.offsetY = 0;
		
	};
	
	Camera.prototype.update = function( target ){
		
		// set the camera to the position of the target
		this.offsetX = target.x;
		this.offsetY = target.y;
		
		// clamp camera to the bounds of the map
		//this.ClampToMap( this.game );`
	};
	

	Camera.prototype.apply = function( element ){
		element.x = element.oX - this.offsetX;
		element.y = element.oY - this.offsetY;
		return element;
	};
	
	
	/*
	 * 
	 * NOT WORKING
	 */
	
	Camera.prototype.onCamera = function( element ){
		
		if ( element.x >= this.offsetX - (this.game.canvas.width/2) && element.x <= this.offsetX + (this.game.canvas.width/2) ){
			if ( element.y >= this.offsetY - (this.game.canvas.height/2) && element.y <= this.offsetY + (this.game.canvas.height/2) ){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
		
	};
	
	Camera.prototype.ClampToMap = function( game ){
		
		var screenWidth = game.canvas.width,
			screenHeight= game.canvas.height,
			minX		= (screenWidth / 2),
			minY		= (screenHeight / 2),
			maxX		= game.canvas.width - (screenWidth/2),
			maxY		= game.canvas.height - (screenHeight/2);
			
		this.offsetX = Math.max(minX, Math.min(this.offsetX, maxX));
		this.offsetY = Math.max(minY, Math.min(this.offsetY, maxY));
		
	};
	
	return Camera;
	
});
