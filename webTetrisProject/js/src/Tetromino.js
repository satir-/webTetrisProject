

//Tetris pieces and their rotational forms
define(function() {
    
    //Schematic definition of the pieces (tetraminoes)
    var ShapeDef = {
        L: "001"+
           "111"+
           "000",
           
        I: "0000"+
           "1111"+
           "0000"+
           "0000",
           
        T: "010"+
           "111"+
           "000",
           
        S: "011"+
           "110"+
           "000",
           
        Z: "110"+
           "011"+
           "000",
           
        O: "011"+
           "011"+
           "000",
           
        J: "100"+
           "111"+
           "000"
    };
    
    //Replace/remove all white spaces 
    /*
    for (var sd in ShapeDef) {
        ShapeDef[sd] = ShapeDef[sd].replace(/\s+/g, ""); 
    }
    */
    
    var Tetramino = Class.extend({
        
        init: function(id, x, y) {
            this._shapes = [];
            this.rotation = 0;
            
            //Support of the lower case input
            this.ID = id.toUpperCase();
            
            //Set to 0 by default
            this.x = x || 0;
            this.y = y || 0;
            
            var shape = ShapeDef[this.ID];
            
            //To store a current shape
            var s = [],
            
            //To get a length on the piece
                n = Math.sqrt(shape.length);
            
             
            //Retrieve current shape and transform it to int
            for (var i = 0; i < n; i++) {
                s[i] = [];
                for (var j = 0; j < n; j++) {
                    s[i][j] = parseInt(shape.charAt(i*n + j));
                   
                }
            }
 
            //Push current (int-converted) piece to the shapes nested array
            this._shapes.push(s);
            
            //Rotation count and temporary array
            var r = 3, t;
            //Rotation
            while (this.ID !== "O" && r-- !== 0) {
                t = [];
                for (var i = 0; i < n; i++) {
                    t[i] = [];
                    for (var j = 0; j < n; j++) {
                        t[i][j] = s[n - j - 1][i];
                    }
                }
                
                //Save the current rotation of the piece (slice() returns new Array)
                s = t.slice(0);
                this._shapes.push(s);
            }
        },
        
        //Assign blocks to their internal representation
        setTo: function(control, id) {
            
            //If no id parameter provided - use id of current object
            id = id != null ? id : this.ID;

            //Take a piece with the specified rotation
            var shape = this._shapes[this.rotation];
            
            //Fill the tetris grid with the current shape according the provided (x,y) coordinates
            for (var i = 0; i < shape.length; i++) {
                for (var j = 0; j < shape.length; j++) {
                    
                    //The coordinates are reversed, because of a different tetris-piece representation.
                    //"i" in the nested array ("shape") is y-axis coordinate and 
                    //"j" - is x-axis on the on a "controlBlock" grid
                    if (shape[j][i]) {
                        control[this.x+i][this.y+j].setType(id);    
                    }
                }
            }
        },
        
        //Check, if it's possible to change the piece establishment and rotation to the specified one
        check: function(control, dx, dy, dr) {
            dx = dx || 0;
            dy = dy || 0;
            dr = dr ? this.getRotation(dr) : this.rotation;
            
            var x = this.x + dx,
                y = this.y + dy,
                w = control.length,
                h = control[0].length,
                shape = this._shapes[dr];
                
            for (var i = 0; i < shape.length; i++) {
                for (var j = 0; j < shape.length; j++) {
                    
                    //The coordinates are reversed, see above   
                    if (shape[j][i]) {
                        //If the new position of the piece is out of the border 
                        //or "cover" the existed one
                        if(!(0 <= x+i && x+i < w && 0 <= y+j && y+j < h) || control[x+i][y+j].solid) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        
        //Return new rotation of the current piece
        getRotation: function(dr) {
            //Current rotation
            var r = this.rotation,
            //Number of possible rotations of the current piece
                l = this._shapes.length;
            if (dr > 0) {
                return (r + 1) % l;
            } else {
                return r - 1 >= 0 ? r - 1 : l - 1;
            }
        },
        
        //Overriding default toString() method for better output representation
        toString: function() {
            var str = "";
            
            for (var i = 0; i < this._shapes.length; i++) {
                str += "\n";
                var s = this._shapes[i];
                for (var j = 0; j < s.length; j++) {
                    for (var k = 0; k < s[j].length; k++) {
                        str += s[j][k] ? "#" : ".";
                    }
                    str += "\n";
                }
            }
            return str;
        }
    });
    
    //Create attributes with the name of each piece in the Tetramino class
    for (var sd in ShapeDef) {
        Tetramino[sd] = sd;
    }

    return Tetramino;
});

