

//Scoring
//http://tetris.wikia.com/wiki/Scoring
define(function() {

	var StatManager = Class.extend({

		init: function() {
			this.reset(0);
		},
        
        //Reset the statistic
		reset: function(startlvl) {

			this.tetrominos = {
				L: 0,
				I: 0,
				T: 0,
				S: 0,
				Z: 0,
				O: 0,
				J: 0,

				tot: 0
			}
            
            //Whether it is a first level up
			this._firstlvl = false;

			this.startlvl = startlvl || 0;
			this.lvl = this.startlvl;

			this.score = 0;
			this.lines = 0;
		},
        
        //Increase total and current tetromino count
		incTetromino: function(id) {
			this.tetrominos[id] += 1;
			this.tetrominos.tot += 1;
		},
        
        addScore: function(cleared) {
            
            //1 cleared row - 40, 2 at once - 100, 3 - 300, 4 - 1200
            //Initialize and get p[cleared] element
            var p = [0, 40, 100, 300, 1200][cleared];
            this.score += (this.lvl + 1) * p;
        },
        
        checkLvlUp: function() {
            if (this._firstlvl) {
                
                //Level up
                if (this.lines >= (this.lvl + 1) * 10) {
                    this.lvl++;
                }    
            } else {
                
                //The first level up, 100 - the max possible starting level
                if (this.lines >= (this.startlvl + 1) * 10 || 100) {
                    this._firstlvl = true;
                    this.lvl++;
                }
            }
        }
    });
    
    return StatManager;
});

