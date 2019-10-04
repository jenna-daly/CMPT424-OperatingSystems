///<reference path="../globals.ts" />
//Creating this file to create an array for memory
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.getMemory = function (loc) {
            return _Memory.memoryArray[loc];
        };
        MemoryAccessor.prototype.setMemory = function () {
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
