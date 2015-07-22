;

var canvas, content, input;

(function() {
    
    //Canvas object (drawing)
    canvas = (function() {
        var c = {},
        
            //Get main draw context
            frame = document.getElementsByTagName("canvas")[0],
            _ftxc = frame.getContext("2d"),
            
            //Additional (buffer) context
            //The width attribute defaults to 300, and the height attribute defaults to 150.
            view = document.createElement("canvas"),
            ctx = view.getContext("2d"),
            
            _fw, _fh, _vw, _vh, _scale = 1;
            
        c.frame = frame;
        c.view = view;
        c.ctx = ctx;
        
        //Clear context and draw new image
        c.flip = function (){
            _ftxc.clearRect(0, 0, _fw, _fh);
            _ftxc.drawImage(this.view, 0, 0, _fw, _fh);
            
            this.ctx.clearRect(0, 0, _vw, _vh); 
        }
        
        //Object properties (change to literals?)
        Object.defineProperty(c, "width", {
            set: function(w){
                this.view.width = w;
                this.scale = _scale;
            },
            get: function(){
                return _vw;
            }
        });
        
        Object.defineProperty(c, "height", {
            set: function(h){
                this.view.height = h;
                this.scale = _scale;
            },
            get: function(){
                return _vh;
            }
        });
        
        //Change canvas and image measurements according to scale value 
        Object.defineProperty(c, "scale", {
            set: function(s){
                _scale = s;
                _vw = this.view.width;
                _vh = this.view.height;
                _fw = this.frame.width = _vw * s;
                _fh = this.frame.height = _vh * s;
                
                //Disable browser smoothing, enable 'pixeling' 
                _ftxc["imageSmoothingEnabled"] = false;
                ["o", "ms", "moz", "webkit"].forEach(function(v){
                    _ftxc[v + "imageSmoothingEnabled"] = false;
                })
            },
            get: function(){
                return _scale;
            }
        });
        
        c.scale = _scale;
        
        return c;
    })();
    
    
    //Content object (upload/download files)
    content = (function() {
        
        var c = {},
            
            _files = {},
            _filecount = 0,
            _loadcount = 0;
        
        c.get = function(name) {
            return _files[name]
        }
        
        c.progress = function() {
            return (_loadcount/_filecount) * 100;
        }
        
        c.load = function(name, src) {
            
            //In case of lacking one argument
            src = src || name;
            //Total file count
            _filecount++;
            
            switch(src.split(".").pop()) {
                //Upload images
                case "png":
                case "gif":
                case "jpg":
                    var img = new Image();
                    img.onload = function() {
                        _loadcount++;
                    }
                    
                    img.src = src;
                    _files[name] = img;
                    break;
                
                case "mp3":
                case "ogg":
                case "wav":
                    break;
                
                case "json":
                case "tmx":
                    break;

            }
        }   
        
        return c;
    })();
    
    input = (function() {
        
        var i = {},
            //[Key] = Action
            _bindings = {},
            _pressed = {},
            _down = {},
            _released = [],

            mouse = { x: 0,  y: 0 };

        //Mouse buttons    
        var Buttons = {
            LEFT: -1,
            MIDDLE: -2,
            RIGHT: -3
        }
        
        //Keyboard keys
        var Keys = {
            SPACE: 32,
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40
        }
        //Unicode Latin upper-case characters 
        for (var ch = 65; ch <= 90; ch++) {
            Keys[String.fromCharCode(ch)] = ch;
        }
        
        i.mouse = mouse;
        i.Buttons = Buttons;
        i.Keys = Keys;
        
        //Bind one or several keys
        i.bindKey = function(action, keys) {
            if (typeof keys === "number") {
                _bindings[keys] = action;
                return;
            }
            for (var i = 0; i < keys.length; i++) {
                _bindings[keys[i]] = action;
            }
        }
        
        function _getCode(e) {
            var t = e.type;
            if (t === "keydown" || t === "keyup") {
                return e.keyCode;
            } else if (t === "mousedown" || t === "mouseup") {
                switch (e.button) {
                    case 0:
                        return Buttons.LEFT;
                    case 1:
                        return Buttons.MIDDLE;
                    case 2:
                        return Buttons.RIGHT;
                }
            }
        }
        
        function ondown(e) {
            var action = _bindings[_getCode(e)];
            //If no action was bidden for the key
            if (!action) return;
            //To prevent updating of the same action more then once
            _pressed[action] = !_down[action];
            _down[action] = true;
            //Cancel default event behaviour, without stopping further propagation of the event
            e.preventDefault();
        }
        
        function onup(e) {
            var action = _bindings[_getCode(e)];
            if (!action) return;
            _released.push(action);
            e.preventDefault();
        }
        
        //Prevent appearance of the dialogue menu from right mouse button click  
        function oncontext(e) {
            if (_bindings[Buttons.RIGHT]) {
                e.preventDefault();
            }
        }
        
        //Capture mouse movement
        function onmove(e) {
            //Get the element that triggered a specific event
            var el = e.target,
                ox = 0,
                oy = 0;
                
            do {
                ox += el.offsetLeft;
                oy += el.offsetTop;
            } while (el = el.parentOffset);
            
            mouse.x = e.clientX - ox;
            mouse.y = e.clientY - oy;
            
            e.preventDefault();
        }
        
        //Clear variables with captured keys and buttons (for each frame)
        i.clearPressed = function() {
            for (var i = 0; i < _released.length; i++) {
                _down[_released[i]] = false;
            }
            _pressed = {};
            _released = [];
        }
        
        i.pressed = function(action) {
            return _pressed[action];
        }
        
        i.down = function(action) {
            return _down[action];
        }
        
        i.released = function(action) {
            //Return the index of action, if it exists in the array
            return _released.indexOf(action) >= 0;
        }
        
        //Bind the event handlers
        canvas.frame.onmousedown = ondown;
        canvas.frame.onmouseup = onup;
        canvas.frame.onmousemove = onmove;
        canvas.frame.oncontextmenu = oncontext;
        
        document.onkeydown = ondown;
        document.onkeyup = onup;
        document.onmouseup = onup;
        
        
        return i;
    })();
    
})();


