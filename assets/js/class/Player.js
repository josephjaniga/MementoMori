console.log('class/Player.js loaded...');

define( ['jquery', 'class/Character', 'class/InputController', 'class/Stat'], function( $, Character, InputController, Stat ){
	
	function Player ( x, y ) {
		
		// call the character constructor & pass parameters
		// 		* thus inheriting properties
		Character.call(this, x, y);
		
		// input controller
		this.iC = new InputController(); 
		this.iC.init();
		
		this.color = "rgb(255,255,255)";

		// player scrolling combat text numbers
		this.sct = [];

		// player statistics
		this.statList = [];		

		this.statList.push( new Stat("hp", 100, 45, "Hit Points") );
		this.statList.push( new Stat("hpTick", 2, 0, "HP Regeneration Per Tick") );
		this.statList.push( new Stat("mp", 100, 30, "Mana Points") );
		this.statList.push( new Stat("mpTick", 3, 0, "Mana Regeneration Per Tick") ); 
		
		// calculated stats
		this.name = "Charlie";
		this.movementSpeed = 3;
		this.level = 1;
		this.experience = 0;

		
	}

	// assign the Created Character.prototype to Player.prototype
	// 		* thus inheriting the methods
	Player.prototype = Object.create(Character.prototype);



	Player.prototype.drawPlayer = function( context ){
		
		this.draw(context);
		this.drawUI(context);
		
	};


	Player.prototype.drawUI = function( context ){

		/*
		 * HP Globe
		 */
		
		var percentage = this.statList[this.getStatIDByName('hp')]['display']/this.statList[this.getStatIDByName('hp')]['base']; // no specific length
		var degrees = percentage * 360.0;
		var radians = degrees * ( Math.PI / 180 ) + 1.5 * Math.PI;
		
		var missingPercentage = 1 - percentage,
			missingDegrees = missingPercentage * 360.0,
			missingRadians = missingDegrees * (Math.PI / 180);
		
		var r = 50,
			x = 10 + r,
			y = this.game.canvas.height - r - 10,
			s = 1.5 * Math.PI; //1.5 * Math.PI
			
		// the actual health liquid
		context.beginPath();
		var gradient = context.createRadialGradient(x+15,y-10,15,x,y,55);
			gradient.addColorStop(0,"rgb(255,0,0)");
			gradient.addColorStop(1,"rgb(88,0,0)");
			
		context.strokeStyle = "rgb(55,55,155)";
		//context.fillStyle = gradient;
		context.fillStyle = "rgb(195,0,0)";
		context.arc(x, y, r, s+missingRadians/2, radians+missingRadians/2, false);
		//context.closePath();
		context.fill();
		context.stroke();
		
		// the glass orb
		context.beginPath();
		var glassGradient = context.createRadialGradient(x+35,y-35,5,x,y,85);
			glassGradient.addColorStop(0,"rgba(255,255,255,0.6)");
			glassGradient.addColorStop(1,"rgba(0,0,0,0.1)");
			
		context.strokeStyle = "rgb(225,235,255)";
		//context.fillStyle = glassGradient;
		context.fillStyle = "rgba(255,255,255,0.2)";
		context.arc(x, y, r+5, 0, 360*(Math.PI/180), false);
		context.closePath();
		context.fill();
		context.stroke();

		/*
		 * MP Globe
		 */

		var percentage = this.statList[this.getStatIDByName('mp')]['display']/this.statList[this.getStatIDByName('mp')]['base']; // no specific length
		var degrees = percentage * 360.0;
		var radians = degrees * ( Math.PI / 180 ) + 1.5 * Math.PI;
		
		var missingPercentage = 1 - percentage,
			missingDegrees = missingPercentage * 360.0,
			missingRadians = missingDegrees * (Math.PI / 180);
		
		var r = 50,
			x = this.game.canvas.width - r - 10,
			y = this.game.canvas.height - r - 10,
			s = 1.5 * Math.PI; //1.5 * Math.PI
			
		// the actual health liquid
		context.beginPath();
		var gradient = context.createRadialGradient(x+15,y-10,15,x,y,55);
			gradient.addColorStop(0,"rgb(0,0,255)");
			gradient.addColorStop(1,"rgb(0,0,88)");
			
		context.strokeStyle = "rgb(55,55,155)";
		//context.fillStyle = gradient;
		context.fillStyle = ( "rgb(0,0,255)" );
		context.arc(x, y, r, s+missingRadians/2, radians+missingRadians/2, false);
		//context.closePath();
		context.fill();
		context.stroke();
		
		// the glass orb
		context.beginPath();
		var glassGradient = context.createRadialGradient(x+35,y-35,5,x,y,85);
			glassGradient.addColorStop(0,"rgba(255,255,255,0.6)");
			glassGradient.addColorStop(1,"rgba(0,0,0,0.1)");
			
		context.strokeStyle = "rgb(225,235,255)";
		//context.fillStyle = glassGradient;
		context.fillStyle = "rgba(255,255,255,0.2)";
		context.arc(x, y, r+5, 0, 360*(Math.PI/180), false);
		context.closePath();
		context.fill();
		context.stroke();
		
	};

	
	Player.prototype.getStatIDByName = function( name ){
		var i = 0;
		for ( var i = 0; i < this.statList.length; i++){
			if ( this.statList[i]['name'] == name ){
				return i;
			}
		}
		if ( i === this.statList.length - 1 ){
			return -1;	
		}
	};
	
	Player.prototype.updateStatDisplay = function(){
		
		var speed = 0.1;
		
		for ( var i = 0; i < this.statList.length; i++ ){
			if ( this.statList[i]['display'] < this.statList[i]['effective'] )
				this.statList[i]['display'] += speed;
			if ( this.statList[i]['display'] > this.statList[i]['effective'] )
				this.statList[i]['display'] -= speed;
		}
		
	};
	
	
	Player.prototype.tick = function(){
		
		/*
		 * Regen Mana
		 */
		var mp = this.getStatIDByName("mp"),
			mpTick = this.getStatIDByName("mpTick");
			
		if ( mp !== -1 && mpTick !== -1 ){
			
			if ( this.statList[mp]['effective'] + this.statList[mpTick]['base'] <= this.statList[mp]['base'] ){
				this.statList[mp]['effective'] += this.statList[mpTick]['base'];
			} else {
				this.statList[mp]['effective'] = this.statList[mp]['base'];
			}
			
		}

		/*
		 * Regen Mana
		 */
		var hp = this.getStatIDByName("hp"),
			hpTick = this.getStatIDByName("hpTick");
			
		if ( hp !== -1 && hpTick !== -1 ){
			
			if ( this.statList[hp]['effective'] + this.statList[hpTick]['base'] <= this.statList[hp]['base'] ){
				this.statList[hp]['effective'] += this.statList[hpTick]['base'];
			} else {
				this.statList[hp]['effective'] = this.statList[hp]['base'];
			}
			
		}
		
	};

	return Player;
	
});
