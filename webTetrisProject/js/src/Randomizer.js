

define(function() {
    
    var Randomizer = Class.extend({
        init: function() {
            this._IDs = "LITSZOJ".split("");
            
            this._S_ID = this._IDs.indexOf("S");
            this._Z_ID = this._IDs.indexOf("Z");
            
            this.size = this._IDs.length;
            this.initialize();
        },
        
        initialize: function() {
            this.idx = 0;
            this.bag = new Array(this.size);
            
            for (var i = 0; i < this.size; i++) {
                this.bag[i] = i;
            }
            
            //To prevent a randomizer start the game with Z or S pieces 
            //Shuffle until S or Z will be not a first element
            do {
                this.shuffle();
            } while (this.bag[0] === this._Z_ID || this.bag[0] === this._S_ID)
        },
        
        //Shuffle the "bag" with tetrominoes IDs
        shuffle: function(array) {
            var array = array || this.bag,
                counter = array.lenght,
                temp,
                index;
                
            while (counter > 0) {
                //Get the random index of tetromino
                index = Math.round(Math.random() * --counter); 
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
                
            }
            
            return array;
        },
        
        //Get the next index
        nextInt: function() {
            var i = this.bag[this.idx];
            this.idx++;
            
            if (this.idx >= this.size) {
                this.idx = 0;
                this.shuffle();
            }
            
            return i;
        },
        
        //Get the next tetromino ID
        nextID: function() {
            return this._IDs[this.nextInt()];
        },
        
        //Get the upcoming ID
        //Ugly hack - it's known, that nextInt() was invoked before this function, 
        //so idx is already pointing to the upcoming element
        comingTet: function() {
            return this._IDs[this.idx];
        }
    });
    
    return Randomizer;
});

