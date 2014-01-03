"use strict";

console.log('loader.js loaded...');

requirejs.config({
	baseUrl: 'assets/js',
	paths:{
		jquery: 'lib/jquery-1.10.2.min',	
	},
	urlArgs: "bust=" + (new Date()).getTime()
});


require( [ 'jquery', 'class/Game' ], function( $, Game ){
	
	// the launcher!
	var game = new Game();
	game.init();
	
});