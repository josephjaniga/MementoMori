console.log('class/InputController.js loaded...');

define( ['jquery'], function( $ ){

	var keyCodes = {
			'w' : 87,
			'a' : 65,
			's' : 83,
			'd' : 68,
			'1' : 49,
			'2' : 50,
			'3' : 51,
			'4' : 52,
			'5' : 53,
			'left shift' : 16,
			'space' : 0
		};
	
	function InputController () {
			
		this.wDown = false;
		this.sDown = false;
		this.aDown = false;
		this.dDown = false;

	}

	InputController.prototype.init = function(  ){

		var _super = this;

		// keydown handler	
		$('html, body').keydown(function(e){
			
			// WASD keys for movement
			if ( e.which == keyCodes['w'] ) {
				_super.wDown = true;
			}
			if ( e.which == keyCodes['s'] ) {
				_super.sDown = true;
			}
			if ( e.which == keyCodes['a'] ) {
				_super.aDown = true;
			}
			if ( e.which == keyCodes['d'] ) {
				_super.dDown = true;
			}
			
		});


		// keyup handler	
		$('html, body').keyup(function(e){
				
			// WASD keys for movement
			if ( e.which == keyCodes['w'] ) {
				_super.wDown = false;
			}
			if ( e.which == keyCodes['s'] ) {
				_super.sDown = false;
			}
			if ( e.which == keyCodes['a'] ) {
				_super.aDown = false;
			}
			if ( e.which == keyCodes['d'] ) {
				_super.dDown = false;
			}
			
		});	
				
	};
	
	return InputController;



	
});


