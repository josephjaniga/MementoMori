console.log('class/Player.js loaded...');

define( ['jquery', 'class/Character', 'class/InputController'], function( $, Character, InputController ){
	
	function Player ( x, y ) {
		
		// call the character constructor & pass parameters
		// 		* thus inheriting properties
		Character.call(this, x, y);
		
		// input controller
		this.iC = new InputController(); 
		this.iC.init();
		
		this.color = "rgb(255,255,255)";
		
	}

	// assign the Created Character.prototype to Player.prototype
	// 		* thus inheriting the methods
	Player.prototype = Object.create(Character.prototype);

	/*
	// override the Character.update method
	Player.prototype.update = function( Game ){
		
		if ( this.iC.sDown ) { // down check
			this.oY += this.movementSpeed;
		}
		if ( this.iC.aDown ) { // left check
			this.oX -= this.movementSpeed;
		}
		if ( this.iC.dDown ) { // right check
			this.oX += this.movementSpeed;
		}
		if ( this.iC.wDown ) { // up check
			this.oY -= this.movementSpeed;
		}
		
	}
	*/




	return Player;
	
});
