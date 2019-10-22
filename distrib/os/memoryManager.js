///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        //this is where I take the input and overwrite the initialized array of 00's for memory
        //for ip3, I need to look at base/limit.. I take in memSegment, so instead of taking in other things I will make functions
        MemoryManager.prototype.createArr = function (memSegment, opInput) {
            var segmentBase = this.getBase(memSegment);
            //console.log(segmentBase + " base");
            var segmentLimit = this.getLimit(memSegment);
            //console.log(segmentLimit + " limit");
            var index = 0;
            //for(let i = memSegment; i < _MemorySize; i++) {
            for (var i = segmentBase; i < segmentLimit; i++) {
                if (opInput[index] != null) {
                    _Memory.memoryArray[i] = opInput[index];
                    index++;
                }
                else {
                    _Memory.memoryArray[i] = "00";
                }
                //console.log(_Memory.memoryArray[i] + " next ");
            }
            //console.log("COMPLETE");
            //console.log(_Memory.memoryArray[1] + " next ");
        };
        MemoryManager.prototype.getBase = function (memSegment) {
            var base = -1;
            if (memSegment == 0) {
                base = 0;
            }
            else if (memSegment == 1) {
                base = 256;
            }
            else if (memSegment == 2) {
                base = 512;
            }
            return base;
        };
        MemoryManager.prototype.getLimit = function (memSegment) {
            var limit = -1;
            if (memSegment == 0) {
                limit = 255;
            }
            else if (memSegment == 1) {
                limit = 511;
            }
            else if (memSegment == 2) {
                limit = 767;
            }
            return limit;
        };
        //clearmem shell command
        MemoryManager.prototype.clearMemory = function () {
            for (var i = 0; i < _MemorySize; i++) {
                _Memory.memoryArray[i] = "00";
            }
            TSOS.Control.updateMemory();
        };
        MemoryManager.prototype.allocateMemory = function () {
            var segment;
            if (segmentZeroFree == true) {
                segment = 0;
                segmentZeroFree = false;
            }
            else if (segmentOneFree == true) {
                segment = 1;
                segmentOneFree = false;
            }
            else if (segmentTwoFree == true) {
                segment = 2;
                segmentTwoFree = false;
            }
            return segment;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
