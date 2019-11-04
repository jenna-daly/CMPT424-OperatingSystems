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
        MemoryAccessor.prototype.memoryBoundaries = function (counter) {
            console.log("counter " + counter);
            if ((counter + runningProcess.base) > runningProcess.limit) {
                return false;
            }
            else if ((counter + runningProcess.base) < runningProcess.base) {
                return false;
            }
            else {
                return true;
            }
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
