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
		this.movementSpeed = 13;
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
	
		this.collisionCheck(game);	
	
		if ( this.collisionEnabled ){
			if ( this.iC.sDown ) { // down check
				this.direction = 1;
				if ( !this.collisionDown )
					this.y += this.movementSpeed;
			}
			if ( this.iC.aDown ) { // left check
				this.direction = 2;
				if ( !this.collisionLeft )
					this.x -= this.movementSpeed;
			}
			if ( this.iC.dDown ) { // right check
				this.direction = 3;
				if ( !this.collisionRight )
					this.x += this.movementSpeed;
			}
			if ( this.iC.wDown ) { // up check
				this.direction = 0;
				if ( !this.collisionUp )
					this.y -= this.movementSpeed;
			}
		}
	
	};

	Character.prototype.init = function ( game ){
		this.game = game;
	};

	Character.prototype.draw = function( context ){
		context.fillStyle = this.color;
		context.beginPath();
		context.arc( this.x, this.y, this.width/2, 0, Math.PI*2, true); 
		context.closePath();
		context.fill();
	};

	Character.prototype.collisionCheck = function ( game ){
		
		if ( this.collisionEnabled ) {
				
			this.collisionDown = false,
			this.collisionLeft = false,
			this.collisionRight = false,
			this.collisionUp = false;
			
			
			// BORDER COLLISION CHECK - for each direction
			if ( this.iC.wDown ) { // up check
				if ( this.y - this.height/2 - this.movementSpeed < 0 )
					this.collisionUp = true;
			}
			if ( this.iC.sDown ) { // down check
				if ( this.y + this.movementSpeed > game.map.height - this.height/2)
					this.collisionDown = true;
			}
			if ( this.iC.aDown ) { // left check
				if ( this.x - this.width/2 - this.movementSpeed < 0 )
					this.collisionLeft = true;
			}
			if ( this.iC.dDown ) { // right check
				if ( this.x + this.movementSpeed > game.map.width - this.width/2 )
					this.collisionRight = true;
			}

			
			// CELL COLLISION CHECKS
			
			// get the characters tile position
			var CharacterTile = game.map.getTileRowColumn(this.x, this.y),
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
					 
			
			// Cell Collision Checkd
			if ( this.iC.wDown && testUp ) { // up check
				if ( !tileUp.passable && ( this.y - this.movementSpeed - this.height/2 ) <= tileUp.y + tileUp.height )
					this.collisionUp = true;
			}

			if ( this.iC.sDown && testDown ) { // DOWN check - against tiles top face
				if ( !tileDown.passable && ( this.y + this.movementSpeed + this.height/2 ) >= tileDown.y )
					this.collisionDown = true;
			}
		
			if ( this.iC.aDown && testLeft ) { // left check - against cells right face
				if ( !tileLeft.passable && ( this.x - this.movementSpeed - this.width/2 ) <= tileLeft.x + tileLeft.width )
					this.collisionLeft = true;
			}

			if ( this.iC.dDown && testRight ) { // right check - against cells left face
				if ( !tileRight.passable && (this.x + this.movementSpeed + this.width/2) >= tileRight.x  )
					this.collisionRight = true;
			}


			
		}
	};




	return Character;
	
});
