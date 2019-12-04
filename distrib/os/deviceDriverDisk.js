///<reference path="../globals.ts" />
//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)
var TSOS;
(function (TSOS) {
    //construct global instance of class
    var DeviceDriverDisk = /** @class */ (function () {
        function DeviceDriverDisk() {
        }
        DeviceDriverDisk.prototype.init = function () {
        };
        DeviceDriverDisk.prototype.format = function () {
            console.log("reached");
        };
        return DeviceDriverDisk;
    }());
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
