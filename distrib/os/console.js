///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, 
        //creating an empty array to save all commands in for command history
        //and a var to hold the index
        recallHistory, arrow) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (recallHistory === void 0) { recallHistory = []; }
            if (arrow === void 0) { arrow = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.recallHistory = recallHistory;
            this.arrow = arrow;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.recallHistory.push(this.buffer);
                    this.arrow = this.recallHistory.length;
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                //handle backspace by saving input-1 to buffer when backspace event occurs
                //then we need to print the new string, but first we need to hide or clear the previously
                //entered text, so I clearRect from x = 0, y = the y position and the margin minus //additional font info, then width of x pos, and height of the font size and margin
                else if (chr === String.fromCharCode(8)) {
                    var newStr;
                    var oldStr = this.buffer;
                    newStr = oldStr.substring(0, oldStr.length - 1);
                    this.buffer = newStr;
                    _DrawingContext.clearRect(0, this.currentYPosition + _FontHeightMargin - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin), this.currentXPosition, this.currentFontSize + _FontHeightMargin);
                    //the final step is to put back the cursor where we left off and reprint the string
                    this.currentXPosition = 0;
                    this.putText(">" + newStr);
                }
                //autocomplete: I compare the letters typed by the user to the commands and on a new
                //line, output commands that start w the entry. I compare using substring and then save //all commands in a string to then print and reset the buffer.
                else if (chr === String.fromCharCode(9)) {
                    var possibleCommands = "";
                    for (var i = 0; i < _OsShell.commandList.length; i++) {
                        if (_OsShell.commandList[i].command.substring(0, this.buffer.length) === this.buffer.substring(0, this.buffer.length)) {
                            possibleCommands += " " + _OsShell.commandList[i].command;
                        }
                    }
                    this.advanceLine();
                    this.putText(possibleCommands);
                    this.advanceLine();
                    this.putText(">");
                    possibleCommands = "";
                    this.buffer = "";
                }
                //the next two else ifs deal with the up and down arrow to get our history
                //the buffers are not collectively saved, so I made an array to save them when
                //the user presses enter and then I reference them from the top and decrement
                //for up arrow, and add when the down arrow is triggered
                else if (chr === String.fromCharCode(38)) {
                    if (this.arrow > 0) {
                        _DrawingContext.clearRect(0, this.currentYPosition + _FontHeightMargin - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin), this.currentXPosition, this.currentFontSize + _FontHeightMargin);
                        this.arrow = this.arrow - 1;
                        this.buffer = this.recallHistory[this.arrow];
                        this.currentXPosition = 0;
                        this.putText(">" + this.buffer);
                    }
                }
                //down arrow for command history
                else if (chr === String.fromCharCode(40)) {
                    if ((this.recallHistory.length - 1) > this.arrow) {
                        _DrawingContext.clearRect(0, this.currentYPosition + _FontHeightMargin - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin), this.currentXPosition, this.currentFontSize + _FontHeightMargin);
                        this.arrow = this.arrow + 1;
                        this.buffer = this.recallHistory[this.arrow];
                        this.currentXPosition = 0;
                        this.putText(">" + this.buffer);
                    }
                    //else leave an empty input
                    else {
                        _DrawingContext.clearRect(0, this.currentYPosition + _FontHeightMargin - (_DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin), this.currentXPosition, this.currentFontSize + _FontHeightMargin);
                        this.currentXPosition = 0;
                        this.buffer = "";
                        this.putText(">");
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                var oneLine = "";
                var testWidth = 0;
                var i = 0;
                //if text is too long, execute these staements
                if (this.currentXPosition + offset > 490) {
                    //text.length != null, text != "" did not work.. some reason text.length>1 did
                    if (text.length > 1) {
                        while (testWidth < 480) {
                            oneLine = text.substring(0, i);
                            testWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, oneLine);
                            console.log("TEST WIDTH: " + testWidth);
                            if (testWidth + this.currentXPosition > 480) {
                                //this.advanceLine();
                                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, oneLine);
                                console.log("substring 1: " + oneLine);
                                this.advanceLine();
                                this.putText(text.substring(i));
                                console.log("substring 2: " + text.substring(i));
                                break;
                            }
                            else {
                                i = i + 1;
                            }
                        }
                    }
                    else {
                        this.advanceLine();
                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                        this.currentXPosition = this.currentXPosition + offset;
                    }
                }
                //if the text is not too long, print it
                else {
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            if (this.currentYPosition > 500) {
                var c = document.getElementById("display");
                var ctx = c.getContext("2d");
                //var imgData = ctx.getImageData(0, this.currentFontSize, 530, 530);
                //this.clearScreen();
                //ctx.putImageData(imgData, 0, 0);
                //to get scroll working, instead of capturing what the canvas doesn't display, I capture
                //all of the canvas, then clear the screen and move the data up and subtract out where //the current y is so that it can fit and the original data does not show, then move //back the current y to the bottom
                var imgData = ctx.getImageData(0, 0, c.width, c.height);
                this.clearScreen();
                ctx.putImageData(imgData, 0, -(_DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin));
                this.currentYPosition -= (_DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin);
            }
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
