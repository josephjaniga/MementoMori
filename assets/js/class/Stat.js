console.log('class/Stat.js loaded...');

define( [ 'jquery' ], function( $ ){
	
	function Stat ( name, base, effective, description ) {
		
		// properties
		this.name = name || "Default Stat";
		this.base = base || 0;	// the total stat
		this.effective = effective || 0; // the current stat
		
		this.description = description || "A short description of the stat goes here";
	}
	
	Stat.prototype.init = function(){
		
	};
	
	Stat.prototype.calcEffective = function(){

		
	};
	
	return Stat;
	

});