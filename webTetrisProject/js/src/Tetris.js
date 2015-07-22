

//Tetris logic
define(["src/Numfont", "src/Tetromino", "src/StatManager", "src/Block", "src/Randomizer"], 
    function(Numfont, Tetromino, StatManager, Block, Randomizer) {
   
    var Tetris = Class.extend({
       
        init: function(cols, rows, size) {
            
            //Size of the block side in px (16 x 16)
            this.size = size;
            this.cols = cols;
            this.rows = rows;
           
            //Background
            this.back = content.get("back");
            
            //Blocks
            this.blocks = content.get("spritesheet");
            
            //Numbers
            var num = content.get("numbers");
            
            this.font = {
                gray:   new Numfont(num, 0, 9),
                cyan:   new Numfont(num, 9, 9),
                red:    new Numfont(num, 18, 9),
                blue:   new Numfont(num, 27, 9),
                orange: new Numfont(num, 36, 9),
                green:  new Numfont(num, 45, 9),
                yellow: new Numfont(num, 54, 9),
                purple: new Numfont(num, 63, 9),
            }
            
            //Pictures to draw the next coming piece
            this.I = content.get("I_1-3");
            this.J = content.get("J_1");
            this.L = content.get("L_1");
            this.O = content.get("O_1-2-3-4");
            this.S = content.get("S_1-3");
            this.T = content.get("T_1");
            this.Z =  content.get("Z_1-3");
            
            //Level-up and scoring object
            this.stat = new StatManager();
            
            //Randomize the tetrominoes
            this.random = new Randomizer();
            
            //Grid to store the blocks
            this.blockControl = [];
                
            this.reset();
        },
        
        //Clear the controlBlock grid
        reset: function() {
            
            this.frames = 1;
            
            //Populate the blockControl grid with "empty" blocks
            this.blockControl = [];
            for (var i = 0; i < this.cols; i++) {
                this.blockControl[i] = [];
                for (var j = 0; j < this.rows; j++) {
                    this.blockControl[i][j] = new Block(Block.NONE);
                }
            }
            
            this.random.initialize();
            this.setNextTetromino();
        },
        
        //Input handling and action-response method       
        update: function(inpt) {
            
            //Clear the previous position of current piece
            this.currentTetromino.setTo(this.blockControl, Block.NONE);
            
            //Bind the control keys to responsible action methods
            if (inpt.pressed("up")) {
                this.moveRotate();
            }
            if (inpt.pressed("down")) {
                this.moveDown();
            }
            if (inpt.pressed("left")) {
                this.moveLeft();
            }
            if (inpt.pressed("right")) {
                this.moveRight();
            }
            if (inpt.pressed("space")) {
                this.hardDrop();
            }            
            //Set the update rate for calling the move method for particular piece
            if (this.frames++ % 20 === 0) {
                this.moveDown();
            }
            //Set the piece to the grid again
            this.currentTetromino.setTo(this.blockControl);
        },
        
        //Drawing method
        draw: function(ctx) {
           
            //Draw a gameboard
            this.drawBoard(ctx, this.stat, this.random.comingTet());
            
            //Next tetromino
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.rows; j++) {
                    var b = this.blockControl[i][j];

                    if (b.solid) {
                        this.drawBlock(ctx, this.blocks, b, i, j);
                    }
                }
            }
            
            //Draw a tetris grid with shapes on it
            for (var i = 0; i < this.cols; i++) {
                for (var j = 0; j < this.rows; j++) {
                    var b = this.blockControl[i][j];

                    if (b.solid) {
                        this.drawBlock(ctx, this.blocks, b, i, j);
                    }
                }
            }
        },
        
        setNextTetromino: function() {
            //this.drawBlock (ctx, this.blocks, ct, x, y);
            this.currentTetromino = new Tetromino(this.random.nextID());
            this.currentTetromino.x = 8;
            this.currentTetromino.y = 0;              
          
            //Count up the new tetromino
            this.stat.incTetromino(this.currentTetromino.ID);
        
            console.log(this.currentTetromino+"");
        },
        
        //Moving piece down if that's possible
        moveDown: function() {
            var bc = this.blockControl,
                ct = this.currentTetromino;
            
            if (ct.check(bc, 0, 1)) {
                ct.y += 1;
            } else {
                
                //When it hits the bottom - assign piece to its final position on the grid and create the new one
                ct.setTo(bc);
                
                //Check the rows in case they are full
                this.checkRows();
                this.setNextTetromino();
            }
        },
        
        moveLeft: function() {
            var bc = this.blockControl,
                ct = this.currentTetromino;
            
            if (ct.check(bc, -1, 0)) {
                ct.x -= 1;
            }
        },
        
        moveRight: function() {
            var bc = this.blockControl,
                ct = this.currentTetromino;
            
            if (ct.check(bc, 1, 0)) {
                ct.x += 1;
            }
        },
        
        moveRotate: function(dr) {
            dr = dr || 1;
            var bc = this.blockControl,
                ct = this.currentTetromino;
            
            if (ct.check(bc, 0, 0, dr)) {
                ct.rotation = ct.getRotation();
            }
        },   
     
        //Instant drop of the piece - bonus score
        hardDrop: function() {
            var bc = this.blockControl,
                ct = this.currentTetromino,
                move = true;
                
            while(move){        
                if (ct.check(bc, 0, 1)) {
                    ct.y += 1;
                    this.stat.score += 2;
                    
                } else {
                    move = false;
                    
                    //When it hits the bottom - assign piece to its final position on the grid and create the new one
                    ct.setTo(bc);
                    
                    //Check the rows in case they are full
                    this.checkRows();
                    this.setNextTetromino();
                }
            }
        },
        
        //Check if the row is full
        checkRows: function() {
            
            //Boolean-flag of the row state, count of cleared lines
            var full, removed = 0;
            
            for (var i = this.rows - 1; i >= 0; i--) {
                full = true;
                for (var j = 0; j < this.cols; j++) {
                    if (!this.blockControl[j][i].solid) {
                        full = false;
                        break;
                    }
                }
                
                if (full) {
                    this.removeRow(i);
                    removed++;
                    
                    //Increase count of cleared lines
                    this.stat.lines++;
                    i++;
                }
            }
            
            if (removed > 0) {
                this.stat.addScore(removed);
                this.stat.checkLvlUp();
            }
        },
        
        //Drag down all the rows above to replace the "complete" row
        removeRow: function(row) {
            var bc = this.blockControl;
            for (var i = row; i > 0; i--) {
                for (var j = 0; j < this.cols; j++) {
                    bc[j][i].setType(bc[j][i - 1].ID);
                }
            }
        },
        
        //Draw scores and background
        drawBoard: function(ctx, stat, nextID) {
            
            //One background "square" - 16 x 16
            //Create a pattern with background image, and set it to "repeat"
            var ptrn = ctx.createPattern(this.back, 'repeat'); 
            ctx.fillStyle = ptrn;
            ctx.fillRect(0, 0, this.cols*this.size, this.rows*this.size); 
            
            //Fill the informational part of the board
            ctx.fillStyle = "white";
            //400 - the current width of canvas, main.js 
            ctx.fillRect(this.cols*this.size, 0, 400 - this.cols*this.size, this.rows*this.size);
            
            //Drawing the next coming piece
            switch (nextID) {
                case "I": ctx.drawImage(this.I, this.cols*this.size + 20, 60); break;
                case "J": ctx.drawImage(this.J, this.cols*this.size + 20, 60); break;
                case "L": ctx.drawImage(this.L, this.cols*this.size + 20, 60); break;
                case "O": ctx.drawImage(this.O, this.cols*this.size + 20, 60); break;
                case "S": ctx.drawImage(this.S, this.cols*this.size + 20, 60); break;
                case "T": ctx.drawImage(this.T, this.cols*this.size + 20, 60); break;
                case "Z": ctx.drawImage(this.Z, this.cols*this.size + 20, 60); break;
            }
            
            //Drawing the statistic and score
            var height = 150;
            ctx.font = "18px Trebuchet MS, Helvetica, sans-serif";
            ctx.fillStyle = "#B86E00";
            ctx.fillText("Next: ", this.cols*this.size + 20, 30);
            ctx.fillText("Level: ", this.cols*this.size + 20, 20 + height);
            ctx.fillText("Lines: ", this.cols*this.size + 20, 70 + height);
            ctx.fillText("Score: ", this.cols*this.size + 20, 120 + height);
            
            this.font.gray.draw(ctx, stat.lvl, this.cols*this.size + 45, 30 + height, 3);            
            this.font.gray.draw(ctx, stat.lines, this.cols*this.size + 32, 80 + height, 5);            
            this.font.gray.draw(ctx, stat.score, this.cols*this.size + 20, 130 + height, 7);

            ctx.font = "12px Trebuchet MS, Helvetica, sans-serif";
            ctx.fillText("Press F5 for", this.cols*this.size + 12, 250 + height);
            ctx.fillText("a New Game.", this.cols*this.size + 12, 270 + height);
            
            ctx.font = "11px Trebuchet MS, Helvetica, sans-serif";
            ctx.fillText("Press SPACE", this.cols*this.size + 12, 350 + height);
            ctx.fillText("for a Hard Drop.", this.cols*this.size + 12, 370 + height);
        },
        
        drawBlock: function(ctx, source, block, x, y) {
        
            //Size of the block side in px (16 x 16)
            var size = this.size;
            
            //Coordinates of the blocks region on the source picture
            var sx = 40, 
                sy = 30;
            
            //The blocks are taken from the spritesheet.png picture 
            //and have a manually measured coordinates for each one
            switch (block.ID) {
               
                //I
                case 1: ctx.drawImage(source, sx+size+1, sy+2*size+2, size, size, x*size, y*size, size, size); break;
                
                //Z
                case 2: ctx.drawImage(source, sx, sy, size, size, x*size, y*size, size, size); break;
               
                //J
                case 3: ctx.drawImage(source, sx+size+1, sy+size+1, size, size, x*size, y*size, size, size); break;
                
                //L
                case 4: ctx.drawImage(source, sx+2*size+2, sy, size, size, x*size, y*size, size, size); break;
                
                //S
                case 5: ctx.drawImage(source, sx, sy+size+1, size, size, x*size, y*size, size, size); break;
                
                //O
                case 6: ctx.drawImage(source, sx+size+1, sy, size, size, x*size, y*size, size, size); break;
                
                //T
                case 7: ctx.drawImage(source, sx+2*size+2, sy+size+1, size, size, x*size, y*size, size, size); break;
            }            
        }
    });
    
    return Tetris;
   
});

