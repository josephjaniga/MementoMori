console.log('class/Camera.js loaded...');

define( [ 'jquery' ], function( $ ){
	
	function Camera ( cam_func, width, height, game) {
		
		this.game = game,
		
		this.cam_func = cam_func,
		
		this.width = width || 1216,
		this.height = height || 768,
		
		this.fixed = false,
		
		this.offsetX = 0,
		this.offsetY = 0;
		
	};
	
	Camera.prototype.update = function(target){
		this.offsetX = target.oX;
		this.offsetY = target.oY;
	};
	



	/*
	 * 
	 * NOT WORKING
	 */
	
	Camera.prototype.apply = function( element ){
		element.oX -= this.offsetX;
		element.oY -= this.offsetY;
		return element;
	};
	
	
	
	/*
	 * 
	 * NOT WORKING
	 */
	
	Camera.prototype.onCamera = function( element ){
		
		if ( element.oX >= this.offsetX && element.oX <= this.offsetX + this.width ){
			if ( element.oY >= this.offsetY && element.oY <= this.offsetY + this.height ){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
		
	};
	
	return Camera;
	
});
