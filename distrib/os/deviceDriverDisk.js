///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)
var TSOS;
(function (TSOS) {
    //construct global instance of class
    var DeviceDriverDisk = /** @class */ (function (_super) {
        __extends(DeviceDriverDisk, _super);
        function DeviceDriverDisk(disk) {
            var _this = _super.call(this) || this;
            _this.disk = disk;
            _this.driverEntry = _this.krnKbdDriverEntry;
            return _this;
        }
        DeviceDriverDisk.prototype.init = function () {
        };
        DeviceDriverDisk.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverDisk.prototype.format = function () {
            // for (let i = 0; i < this.disk.tracks; i++) {
            //     for (let j = 0; j < this.disk.sectors; j++) {
            //         for (let k = 0; k < this.disk.blocks; k++) {
            //             sessionStorage.setItem(deviceDriverDisk.buildLoc(i, j, k), this.emptyBlock());
            //         }
            //     }
            // }
            console.log("reached");
        };
        return DeviceDriverDisk;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
