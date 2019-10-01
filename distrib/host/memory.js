///<reference path="../globals.ts" />
//Creating this file to create an array for memory
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        //memoryArray: any;
        function Memory(memoryArray) {
            if (memoryArray === void 0) { memoryArray = new Array(); }
            this.memoryArray = memoryArray;
        }
        Memory.prototype.init = function () {
            //set up array
            for (var i = 0; i < _MemorySize; i++) {
                this.memoryArray[i] = "00";
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//remove spaces
//after validating
//for loop/for each char in string if current char is space ignore else add to new str, next all hex no spaces, 2 at a time 0 and 1
//and add to element of memeory
//load, shell validates, loadmem in kernel!!, memory accessor in hw
//>256 failed to load 
//parseInt knows how to, to go b/w base 10 and hex is base 16 FF--255, 11--16
//PCB class in os directory, PCB.ts, base reg is 0 for ip2
