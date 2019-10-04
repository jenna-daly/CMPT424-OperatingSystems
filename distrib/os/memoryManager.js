///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        //this is where I take the input and overwrite the initialized array of 00's for memory
        MemoryManager.prototype.createArr = function (memSegment, opInput) {
            for (var i = memSegment; i < opInput.length; i++) {
                _Memory.memoryArray[i] = opInput[i];
                //console.log(_Memory.memoryArray[i] + " next ");
            }
            //console.log("COMPLETE");
            //console.log(_Memory.memoryArray[1] + " next ");
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
