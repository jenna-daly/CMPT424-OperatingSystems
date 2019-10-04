///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.createArr = function (memSegment, opInput) {
            for (var i = memSegment; i < opInput.length; i++) {
                _Memory.memoryArray[i] = opInput[i];
                //console.log(_Memory.memoryArray[i] + " next ");
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
