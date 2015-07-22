//console.log("Test");

requirejs.config({
   
    baseUrl: "js",
    
    paths:{
        src: "./src"
    }
});

//Making sure game file uploaded via Require.js
require(["src/Game", "src/Tetris"], function(Game, Tetris) {
    
    //Using Simple JavaScript Inheritance (SJI) solution
    var App = Game.extend({
        
        //Initiation of main parameters and resources (built-in constructor via SJI)
        init: function() {
            
            canvas.width = 400;
            canvas.height = 561;
            canvas.scale = 1;
            
            content.load("spritesheet", "res/spritesheet.png");
            content.load("back", "res/x1/background.png");
            content.load("I_1-3", "res/x1/I_1-3.png");
            content.load("I_2-4", "res/x1/I_2-4.png");
            content.load("J_1", "res/x1/J_1.png");
            content.load("J_2", "res/x1/J_2.png");
            content.load("J_3", "res/x1/J_3.png");
            content.load("J_4", "res/x1/J_4.png");
            content.load("L_1", "res/x1/L_1.png");
            content.load("L_2", "res/x1/L_2.png");
            content.load("L_3", "res/x1/L_3.png");
            content.load("L_4", "res/x1/L_4.png");
            content.load("O_1-2-3-4", "res/x1/O_1-2-3-4.png");
            content.load("S_1-3", "res/x1/S_1-3.png");
            content.load("S_2-4", "res/x1/S_2-4.png");
            content.load("T_1", "res/x1/T_1.png");
            content.load("T_2", "res/x1/T_2.png");
            content.load("T_3", "res/x1/T_3.png");
            content.load("T_4", "res/x1/T_4.png");
            content.load("Z_1-3", "res/x1/Z_1-3.png");
            content.load("Z_2-4", "res/x1/Z_2-4.png");
            content.load("numbers", "res/numbers.png");
            
            input.bindKey("space", input.Keys.SPACE);
            input.bindKey("left", [input.Keys.LEFT_ARROW, input.Keys.A]);
            input.bindKey("up", [input.Keys.UP_ARROW, input.Keys.W]);
            input.bindKey("right", [input.Keys.RIGHT_ARROW, input.Keys.D]);
            input.bindKey("down", [input.Keys.DOWN_ARROW, input.Keys.S]);
            
            this.hasLoad = false;
        },
        
        //Iteration method
        tick: function() {
            if(this.hasLoad) {
                
                this.tetris.update(input);
                this.tetris.draw(canvas.ctx);
                
            } else {
                //hasLoad is used to increase efficiency, without checking loading status
                //on each tick iteration
                this.hasLoad = (content.progress() === 100);
                
                if(this.hasLoad) {
                    //cols, rows: 19, 36
                    //size of one block- 16 x 16
                    this.tetris = new Tetris(19, 35, 16);
                }
            }

        }
    });
    
    (function() {
        
        var game = new App();
        game.run();
        //Whenever main browser window is not on focus - stop the game
        window.onblur = game.stop.bind(game);
        //..Continue
        window.onfocus = game.run.bind(game);
        
    })();
    
});


