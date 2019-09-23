///<reference path="../globals.ts" />
//Creating this file to create an array for memory
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        //memoryArray: any;
        function Memory(memoryArray) {
            if (memoryArray === void 0) { memoryArray = []; }
            this.memoryArray = memoryArray;
        }
        Memory.prototype.init = function () {
            //set up array
            for (var i = 0; i < 512; i++) {
                this.memoryArray[i] = "00";
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
