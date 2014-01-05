console.log('class/Canvas.js loaded...');

define( [ 'jquery', 'class/Camera' ], function( $, Camera ){
	
	function Canvas (height, width) {
		
		// properties
		this.width = height || 1024;
		this.height = width || 576;

		this.el = null;
		this.ctx = null;

	}
	
	Canvas.prototype.init = function(){
		this.el = $('<canvas/>', {id: 'canvas'});
		
		$(this.el).css('background', '#dddddd');
		$(this.el).css('display', 'block');
		$(this.el).css('marginLeft', 'auto');
		$(this.el).css('marginRight', 'auto');
		
		$(this.el).attr('width', this.width);
		$(this.el).attr('height', this.height);
		
		$('[mm]').eq(0).prepend(this.el);
		
		this.el = document.getElementById("canvas");
		this.ctx = this.el.getContext("2d");
		
		console.info("Canvas Initialized");
		
	};
	
	Canvas.prototype.draw = function(){

		
	};
	
	return Canvas;
	
});
