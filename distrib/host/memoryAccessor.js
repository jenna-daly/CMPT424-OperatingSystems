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
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
