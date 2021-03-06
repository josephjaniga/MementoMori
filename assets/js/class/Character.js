console.log('class/Character.js loaded...');

define( ['jquery'], function( $ ){
	
	function Character ( x, y ) {
		
		// reference
		this.game = null;
		
		// the original coords
		this.oX = x || 0;
		this.oY = y || 0;

		// the onscreen coords
		this.x = x || 0;
		this.y = y || 0;
		
		this.width = 16;
		this.height = 16;
		this.color = "rgb(0,220,255)";
		
		// movement
		this.movementSpeed = 6;
		this.direction = 0; // up down left right
		
		// collision
		this.collisionEnabled = true;
		
			// COLLISION INDICATORS
			this.collisionDown = false;
			this.collisionLeft = false;
			this.collisionRight = false;
			this.collisionUp = false;
		
	}

	Character.prototype.update = function( game ){
	
		this.collisionCheck( game );	
	
		if ( this.collisionEnabled ){
			if ( this.iC.sDown ) { // down check
				this.direction = 1;
				if ( !this.collisionDown )
					this.oY += this.movementSpeed;
			}
			if ( this.iC.aDown ) { // left check
				this.direction = 2;
				if ( !this.collisionLeft )
					this.oX -= this.movementSpeed;
			}
			if ( this.iC.dDown ) { // right check
				this.direction = 3;
				if ( !this.collisionRight )
					this.oX += this.movementSpeed;
			}
			if ( this.iC.wDown ) { // up check
				this.direction = 0;
				if ( !this.collisionUp )
					this.oY -= this.movementSpeed;
			}
		}
		
		this.x = this.oX;
		this.y = this.oY;
		
		this.isInDoor( game );
		
	};

	Character.prototype.init = function ( game ){
		this.game = game;
	};

	Character.prototype.draw = function( context ){
		
		context.beginPath();
		context.arc( this.coordToScreen()['x'], this.coordToScreen()['y'], this.width/2, 0, Math.PI*2, true ); 
		context.fillStyle = this.color;
		context.closePath();
		context.fill();
		context.lineWidth = 1;
      	context.strokeStyle = '#000000';
      	context.stroke();		
		
	};

	Character.prototype.collisionCheck = function ( game ){
		
		if ( this.collisionEnabled ) {
				
			this.collisionDown = false,
			this.collisionLeft = false,
			this.collisionRight = false,
			this.collisionUp = false;
			
			
			// BORDER COLLISION CHECK - for each direction
			if ( this.iC.wDown ) { // up check
				if ( this.oY - this.height/2 - this.movementSpeed < 0 )
					this.collisionUp = true;
			}
			if ( this.iC.sDown ) { // down check
				if ( this.oY + this.movementSpeed > game.map.height - this.height/2 )
					this.collisionDown = true;
			}
			if ( this.iC.aDown ) { // left check
				if ( this.oX - this.width/2 - this.movementSpeed < 0 )
					this.collisionLeft = true;
			}
			if ( this.iC.dDown ) { // right check
				if ( this.oX + this.movementSpeed > game.map.width - this.width/2 )
					this.collisionRight = true;
			}

			
			// CELL COLLISION CHECKS
			
			// get the characters tile position
			var CharacterTile = game.map.getTileRowColumn(this.oX, this.oY),
				pX = CharacterTile['x'],
				pY = CharacterTile['y'],
				cellUp = null,
				cellRight = null,
				cellLeft = null,
				cellDown = null,
				testUp = true,
				testRight = true,
				testLeft = true,
				testDown = true;
				
				if ( pY - 1 >= 0 ) { // get the tile above the character
					tileUp = game.map.getTileAtRowColumn(pX, pY-1);
				} else { testUp = false; }
					
				if ( pX + 1 < game.map.tilesWide ) { // get the tile right of the character
					tileRight = game.map.getTileAtRowColumn(pX+1, pY);
				} else { testRight = false; }
					
				if ( pX - 1 >= 0 ) { // get the tile left of the character
					tileLeft = game.map.getTileAtRowColumn(pX-1, pY);
				} else { testLeft = false; }
					
				if ( pY + 1 < game.map.tilesTall ){ // get the tile below the character
					tileDown = game.map.getTileAtRowColumn(pX, pY+1);
				} else { testDown = false; }
					 
			
			// Tile Collision Check
			if ( this.iC.wDown && testUp ) { // up check
				if ( !tileUp.passable && ( this.oY - this.movementSpeed - this.height/2 ) <= tileUp.oY + tileUp.height )
					this.collisionUp = true;
			}

			if ( this.iC.sDown && testDown ) { // DOWN check - against tiles top face
				if ( !tileDown.passable && ( this.oY + this.movementSpeed + this.height/2 ) >= tileDown.oY )
					this.collisionDown = true;
			}
		
			if ( this.iC.aDown && testLeft ) { // left check - against cells right face
				if ( !tileLeft.passable && ( this.oX - this.movementSpeed - this.width/2 ) <= tileLeft.oX + tileLeft.width )
					this.collisionLeft = true;
			}

			if ( this.iC.dDown && testRight ) { // right check - against cells left face
				if ( !tileRight.passable && (this.oX + this.movementSpeed + this.width/2) >= tileRight.oX  )
					this.collisionRight = true;
			}


			
		}
	};



	Character.prototype.coordToScreen = function( game ){
			
		var x, y;
			
		// x 
		if ( this.oX <= this.game.canvas.width/2 ) {
			// draw player in the 'left gutter'
			x = this.oX;
		} else if ( this.oX >= this.game.map.width - this.game.canvas.width/2 ){ 
			//draw player in the right gutter
			x = this.oX - ( this.game.map.width - this.game.canvas.width );
		} else {
			// center player in screen
			x = this.game.canvas.width/2;
		} 
		
		//y
		if ( this.oY <= this.game.canvas.height/2 ) {
			// draw player in the 'top gutter'
			y = this.oY;
		} else if ( this.oY >= this.game.map.height - this.game.canvas.height/2 ){ 
			//draw player in the bottom gutter
			y = this.oY - ( this.game.map.height - this.game.canvas.height );
		} else {
			// center player in screen
			y = this.game.canvas.height/2;
		} 
		
		return {
			'x': x,
			'y': y
		};
		
	};


	Character.prototype.moveTo = function (x, y){
		this.oX = x;
		this.oY = y;
	};


	Character.prototype.isInDoor = function( game ){
		var characterPosition = this.getTileCoordinates(),
			gameRef = game,
			charRef = this;
			
		// for each door
		game.doorList.forEach(function(door){
			
			// check each entry A for player collision
			for ( var x = 0; x < door['entryA'].length; x++ ){
				// if character is on same map
				if ( gameRef.map === door.mapA ){
					// if character is in entry
					if ( characterPosition['x'] == door['entryA'][x]['x'] ){
						if ( characterPosition['y'] == door['entryA'][x]['y']){
							//load the new map
							gameRef.loadMap( door['indexB'] );
							// move player to exit position on new map
							charRef.moveTo( door['exitB']['x']*gameRef.map.t.width+gameRef.map.t.width/2, door['exitB']['y']*gameRef.map.t.height+gameRef.map.t.height/2 );
						}
					}
				}	
			}
			
			// check each entry for player collision
			for ( var x = 0; x < door['entryB'].length; x++ ){
				// if character is on same map
				if ( gameRef.map === door.mapB ){
					// if character is in entry
					if ( characterPosition['x'] == door['entryB'][x]['x'] ){
						if ( characterPosition['y'] == door['entryB'][x]['y']){
							//load the new map
							gameRef.loadMap( door['indexA'] );
							// move player to exit position on new map
							charRef.moveTo( door['exitA']['x']*gameRef.map.t.width+gameRef.map.t.width/2, door['exitA']['y']*gameRef.map.t.height+gameRef.map.t.height/2 );
						}
					}
				}
			}
			
		});
		
	};

	Character.prototype.getTileCoordinates = function( ){
		 var 	remainder = this.oX % this.game.map.t.width,
		 		tileX = ( this.oX - remainder ) / this.game.map.t.width,
		 		remainder = this.oY % this.game.map.t.height,
		 		tileY = ( this.oY - remainder ) / this.game.map.t.height;
		 
		 return { x: tileX, y: tileY };		
	};
	
	

	

	return Character;
	
});
