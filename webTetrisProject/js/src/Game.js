
//Game work-flow
define(function() {
    
    //Polyfill for Backwards Compatibility
    var _vendors = ["o", "ms", "moz", "webkit"];
    for (var i = _vendors.length; i-- && !window.requestAnimationFrame;) {
        var v = _vendors[i];
        
        window.requestAnimationFrame = window[v + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[v + "CancelAnimationFrame"] ||
                                      window[v + "CancelRequestAnimationFrame"];
    }
    
    var Game = Class.extend({
        
        tick: function() {
            console.warn("Should be overridden by child-class!");
        },
        
        run: function() {
            if(this._running) return;
            this._running = true;
            // console.log("Running...");
            var self = this;
            
            //Callback function for image animation
            function loop() {
                self._reqframe = window.requestAnimationFrame(loop);
                
                self.tick();
                
                input.clearPressed();
                canvas.flip();
            }
            
            this._reqframe = window.requestAnimationFrame(loop);
        },
        
        stop: function() {
            if(this._reqframe){
                //Send the _reqframe id to cancel animation 
                window.cancelAnimationFrame(this._reqframe);
            }
            this._running = false;
            this._reqframe = null;
            
        }
    });
    
    return Game;
});