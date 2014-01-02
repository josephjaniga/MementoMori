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

		// the original coordinate position
		this.oX = 0;
		this.oY = 0;
		
		
	};
	
	Camera.prototype.update = function( target ){
		
		// set the camera to the position of the target
		this.oX = target.x;
		this.oY = target.y;
		
			if ( this.oX <= this.game.canvas.width/2 ) {
				 // if the x offset is less than one half screen
				this.offsetX = 0;
			} else if ( this.oX >= this.game.map.width - this.game.canvas.width/2 ){ 
				// if the offset is greater than one half screen from end of map
				this.offsetX = this.game.map.width - this.game.canvas.width;
			} else {
				// otherwise calculate it
				this.offsetX = this.oX - this.game.canvas.width/2; 
			} 
			
			if ( this.oY <= this.game.canvas.height/2 ){
				this.offsetY = 0;
			} else if ( this.oY >= this.game.map.height - this.game.canvas.height/2 ) {
				this.offsetY = this.game.map.height - this.game.canvas.height;
				this.oY = this.game.map.height - this.game.canvas.height/2;
			} else {	
				this.offsetY = this.oY - this.game.canvas.height/2;
			}
			
		// clamp camera to the bounds of the map
		this.ClampToMap( this.game );
	};
	
	Camera.prototype.draw = function( context ){
		
		// the camera offset point
		context.fillStyle = 'rgb(255,0,0)';
		context.beginPath();
		context.arc( this.oX, this.oY, 4, 0, Math.PI*2, true); 
		context.closePath();
		context.fill();
				
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
		
		// if tiles x is greater than or equal to camera center minus half canvas width
		if ( element.x >= this.offsetX - ( this.game.canvas.width/2 ) && element.x <= this.game.map.width - ( this.game.canvas.width/2 ) ) {
		//if ( element.x + element.width > this.offsetX - (this.game.canvas.width/2) && element.x - element.width < this.offsetX + (this.game.canvas.width) ){
			if ( element.y > this.offsetY - (this.game.canvas.height/2) && element.y < this.offsetY + (this.game.canvas.height) ){
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
			maxX		= game.map.width - (screenWidth),
			maxY		= game.map.height - (screenHeight);
		
			// debugger
			$('#debugga .clamp').html('');
			$('#debugga .clamp').append($('<p>Clamp screenWidth: '+screenWidth+'</p>'));
			$('#debugga .clamp').append($('<p>Clamp screenHeight: '+screenHeight+'</p>'));
			$('#debugga .clamp').append($('<p>Clamp x min/max: '+minX+' / ' + maxX+' </p>'));
			$('#debugga .clamp').append($('<p>Clamp y min/max: '+minY+' / ' + maxY+' </p>'));
			
		this.oX = Math.max(minX, Math.min(this.offsetX, maxX));
		this.oY = Math.max(minY, Math.min(this.offsetY, maxY));
		
	};
	
	return Camera;
	
});
