console.log('class/Door.js loaded...');

define( [ 'jquery', 'class/Door' ], function( $, Door ){
	
	function Door ( A, B ) {
		
		this.name =  ( A['name'] + ' - ' + B['name'] ) || 'Nowhere - Nowhere';
		
		this.color = '#0099cc';
		
		this.mapA = A['map'] || null;
		this.mapB = B['map'] || null;
		
		this.indexA = A['index'] || 0;
		this.indexB = B['index'] || 0;
		
		this.entryA = A['entry'] || [];
		this.exitA = A['exit'] || [];
		
		this.entryB = B['entry'] || [];
		this.exitB = B['exit'] || [];
	}
	
	Door.prototype.init = function(){
		
	};
	
	Door.prototype.draw = function( game ){
		
	};
	
	return Door;
	
});
