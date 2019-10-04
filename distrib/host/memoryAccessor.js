///<reference path="../globals.ts" />
//Creating this file to create an array for memory
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        //get memory at position loc
        MemoryAccessor.prototype.getMemory = function (loc) {
            //console.log(_Memory.memoryArray[1] + "loc");     
            return _Memory.memoryArray[loc];
        };
        //making a function to write memory
        MemoryAccessor.prototype.setMemory = function (loc, posNow) {
            _Memory.memoryArray[loc] = _Memory.memoryArray[posNow];
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
