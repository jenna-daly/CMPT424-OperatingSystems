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
            sessionStorage.clear();
            for (var i = 0; i < this.disk.tracks; i++) {
                for (var j = 0; j < this.disk.sectors; j++) {
                    for (var k = 0; k < this.disk.blocks; k++) {
                        var dataArr = new Array();
                        for (var l = 0; l < this.disk.blocksize; l++) {
                            dataArr.push("00");
                        }
                        var block = {
                            inUse: "0",
                            next: "0:0:0",
                            data: dataArr
                        };
                        sessionStorage.setItem(i + ":" + j + ":" + k, JSON.stringify(block));
                    }
                }
            }
            console.log("reached");
            _formattedDisk = true;
            console.log(_formattedDisk);
        };
        DeviceDriverDisk.prototype.createFile = function (name) {
            for (var j = 0; j < this.disk.sectors; j++) {
                for (var k = 0; k < this.disk.blocks; k++) {
                    //skip over mbr when checking for free blocks
                    if (j == 0 && k == 0) {
                        continue;
                    }
                    var tsb = "0" + ":" + j + ":" + k;
                    var test = JSON.parse(sessionStorage.getItem(tsb));
                    console.log(test);
                    //this finds a not in use area to then point to our data block, which we need to locate in the if
                    if (test.inUse == "0") {
                        console.log(tsb);
                        var findBlockTSB = this.findFreeBlock();
                        var freeBlock = JSON.parse(sessionStorage.getItem(findBlockTSB));
                        test.inUse = "1";
                        freeBlock.inUse = "1";
                        freeBlock.next = findBlockTSB;
                        //freeBlock = this.clearData(freeBlock);
                        var newHex = this.convertToAscii(name);
                        //test = this.clearData(test);
                        for (var k_1 = 0; k_1 < newHex.length; k_1++) {
                            test.data[k_1] = newHex[k_1];
                        }
                        sessionStorage.setItem(tsb, JSON.stringify(test));
                        sessionStorage.setItem(findBlockTSB, JSON.stringify(freeBlock));
                        TSOS.Control.updateDisk();
                        return -1;
                    }
                }
            }
        };
        DeviceDriverDisk.prototype.convertToAscii = function (string) {
            var newStr = "";
            for (var i = 0; i < string.length; i++) {
                newStr += string.charCodeAt(i);
            }
            return newStr;
        };
        DeviceDriverDisk.prototype.findFreeBlock = function () {
            return "1:0:0";
        };
        DeviceDriverDisk.prototype.readFile = function (name) {
        };
        DeviceDriverDisk.prototype.writeFile = function (data, name) {
        };
        DeviceDriverDisk.prototype.ls = function () {
        };
        return DeviceDriverDisk;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
