
//Numbers for drawing
define(function() {
    
    var Numfont = Class.extend({
        
        //Parameters: source image, vertical position on image, height of the symbol respectively
        init: function(img, y, h) {
            this.img = img;
            this.y = y;
            this.h = h;
            //Width of the symbol
            this.width = img.width / 10;
        },
        
        //num - the number to draw, padding - total amount of symbols to draw
        draw: function(ctx, num, x, y, padding) {
            
            num = ""+num;
            if (padding) {
                //Add zeros in the end (as join() separators) -> add actual numbers
                num = num.length >= padding ? num : new Array(padding - num.length + 1).join("0") + num; 
            }
            
            
            var n; 
            for (var i = 0, len = num.length; i < len; i++) {
                //to int
                n = parseInt(num[i]);
                //Draw the corresponding number from the source, using n as offset
                ctx.drawImage(this.img, this.width*n, this.y, this.width, this.h, 
                    x, y, this.width, this.h);
                //Increasing offset for a next number
                x += this.width;
               
            }
            
        }
    });
    
    return Numfont;
});

