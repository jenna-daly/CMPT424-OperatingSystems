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
                    var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                    console.log(itemAtTSB);
                    //this finds a not in use area to then point to our data block, which we need to locate in the if
                    if (itemAtTSB.inUse == "0") {
                        console.log(tsb);
                        var findBlockTSB = this.findFreeBlock();
                        var freeBlock = JSON.parse(sessionStorage.getItem(findBlockTSB));
                        //both now in use, free block to hold data and itemAtTSB to hold name and update next
                        itemAtTSB.inUse = "1";
                        freeBlock.inUse = "1";
                        itemAtTSB.next = findBlockTSB;
                        var newHex = this.convertToAscii(name);
                        for (var k_1 = 0; k_1 < newHex.length; k_1++) {
                            itemAtTSB.data[k_1] = newHex[k_1];
                        }
                        sessionStorage.setItem(tsb, JSON.stringify(itemAtTSB));
                        sessionStorage.setItem(findBlockTSB, JSON.stringify(freeBlock));
                        TSOS.Control.updateDisk();
                        return -1;
                    }
                }
            }
        };
        //gets name of file in ascii
        DeviceDriverDisk.prototype.convertToAscii = function (string) {
            // var newStr = "";
            var newStr = [];
            for (var i = 0; i < string.length; i++) {
                //newStr += string.charCodeAt(i);
                newStr.push(string.charCodeAt(i));
            }
            console.log("new str " + newStr);
            return newStr;
        };
        //find free block to write data to
        DeviceDriverDisk.prototype.findFreeBlock = function () {
            //start looking at track 1
            for (var i = 1; i < this.disk.tracks; i++) {
                for (var j = 0; j < this.disk.sectors; j++) {
                    for (var k = 0; k < this.disk.blocks; k++) {
                        var tsb = i + ":" + j + ":" + k;
                        var tsbInfo = JSON.parse(sessionStorage.getItem(tsb));
                        if (tsbInfo.inUse == "0") {
                            return tsb;
                        }
                    }
                }
            }
        };
        DeviceDriverDisk.prototype.readFile = function (name) {
            var hexName = this.convertToAscii(name);
            for (var j = 0; j < this.disk.sectors; j++) {
                for (var k = 0; k < this.disk.blocks; k++) {
                    //skip over mbr when checking for free blocks
                    if (j == 0 && k == 0) {
                        continue;
                    }
                    console.log("hex data " + hexName);
                    var tsb = "0" + ":" + j + ":" + k;
                    var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                    //we want to find an in use file and then check for a matching name
                    var found = true;
                    if (itemAtTSB.inUse == "1") {
                        for (var k_2 = 0; k_2 < hexName.length; k_2++) {
                            if (itemAtTSB.data[k_2] != hexName[k_2]) {
                                found = false;
                            }
                        }
                        //i encountered a bug where I created a file called t and test and t was overwriting data saved to test
                        //i realized it is because my for loop goes to the length of the hex, so t of t does = t of test
                        //to fix it, check one more after the array ends and make sure the data is done
                        if (itemAtTSB.data[hexName.length + 1] != "00") {
                            found = false;
                        }
                        if (found == true) {
                            var newTSB = itemAtTSB.next;
                            var dataBlock = JSON.parse(sessionStorage.getItem(newTSB));
                            console.log("reading " + JSON.parse(sessionStorage.getItem(newTSB)).data);
                            var readStr = "";
                            for (var i = 0; i < 60; i++) {
                                if (dataBlock.data[i] != "00") {
                                    readStr += String.fromCharCode(dataBlock.data[i]);
                                }
                                else {
                                    _StdOut.putText(readStr);
                                    return -1;
                                }
                            }
                        }
                    }
                }
            }
        };
        DeviceDriverDisk.prototype.writeFile = function (name, data) {
            var hexName = this.convertToAscii(name);
            for (var j = 0; j < this.disk.sectors; j++) {
                for (var k = 0; k < this.disk.blocks; k++) {
                    //skip over mbr when checking for free blocks
                    if (j == 0 && k == 0) {
                        continue;
                    }
                    console.log("hex data " + hexName);
                    var tsb = "0" + ":" + j + ":" + k;
                    var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                    //we want to find an in use file and then check for a matching name
                    var found = true;
                    if (itemAtTSB.inUse == "1") {
                        for (var k_3 = 0; k_3 < hexName.length; k_3++) {
                            if (itemAtTSB.data[k_3] != hexName[k_3]) {
                                found = false;
                            }
                        }
                        //i encountered a bug where I created a file called t and test and t was overwriting data saved to test
                        //i realized it is because my for loop goes to the length of the hex, so t of t does = t of test
                        //to fix it, check one more after the array ends and make sure the data is done
                        if (itemAtTSB.data[hexName.length + 1] != "00") {
                            found = false;
                        }
                        if (found == true) {
                            var newTSB = itemAtTSB.next;
                            var dataHex = this.convertToAscii(data);
                            var dataBlock = JSON.parse(sessionStorage.getItem(newTSB));
                            for (var i = 0; i < dataHex.length; i++) {
                                dataBlock.data[i] = dataHex[i];
                            }
                            console.log("new tsb for data " + newTSB);
                            sessionStorage.setItem(newTSB, JSON.stringify(dataBlock));
                            TSOS.Control.updateDisk();
                            _StdOut.putText("Success");
                            return -1;
                        }
                        //future fix: add error file not found
                    }
                }
            }
        };
        DeviceDriverDisk.prototype.deleteFile = function (name) {
            var hexName = this.convertToAscii(name);
            for (var j = 0; j < this.disk.sectors; j++) {
                for (var k = 0; k < this.disk.blocks; k++) {
                    //skip over mbr when checking for free blocks
                    if (j == 0 && k == 0) {
                        continue;
                    }
                    console.log("hex data " + hexName);
                    var tsb = "0" + ":" + j + ":" + k;
                    var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                    //we want to find an in use file and then check for a matching name
                    var found = true;
                    if (itemAtTSB.inUse == "1") {
                        for (var k_4 = 0; k_4 < hexName.length; k_4++) {
                            if (itemAtTSB.data[k_4] != hexName[k_4]) {
                                found = false;
                            }
                        }
                        //i encountered a bug where I created a file called t and test and t was overwriting data saved to test
                        //i realized it is because my for loop goes to the length of the hex, so t of t does = t of test
                        //to fix it, check one more after the array ends and make sure the data is done
                        if (itemAtTSB.data[hexName.length + 1] != "00") {
                            found = false;
                        }
                        if (found == true) {
                            var newTSB = itemAtTSB.next;
                            var dataBlock = JSON.parse(sessionStorage.getItem(newTSB));
                            dataBlock.inUse = "0";
                            itemAtTSB.inUse = "0";
                            itemAtTSB.next = "0:0:0";
                            var dataToAdd = [];
                            for (var i = 0; i < _Disk.blocksize; i++) {
                                dataToAdd.push("00");
                            }
                            itemAtTSB.data = dataToAdd;
                            dataBlock.data = dataToAdd;
                            sessionStorage.setItem(tsb, JSON.stringify(itemAtTSB));
                            sessionStorage.setItem(newTSB, JSON.stringify(dataBlock));
                            TSOS.Control.updateDisk();
                        }
                    }
                }
            }
        };
        DeviceDriverDisk.prototype.ls = function () {
            for (var j = 0; j < this.disk.sectors; j++) {
                for (var k = 0; k < this.disk.blocks; k++) {
                    //skip over mbr when checking for free blocks
                    if (j == 0 && k == 0) {
                        continue;
                    }
                    var tsb = "0" + ":" + j + ":" + k;
                    var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                    //we want to find in use files and then read name in dir block, so we don't need to look at data block now
                    if (itemAtTSB.inUse == "1") {
                        var getName = "";
                        for (var i = 0; i < 60; i++) {
                            if (itemAtTSB.data[i] != "00") {
                                getName += String.fromCharCode(itemAtTSB.data[i]);
                            }
                            else {
                                _StdOut.putText(getName);
                                _StdOut.advanceLine();
                                break;
                            }
                        }
                    }
                }
            }
        };
        return DeviceDriverDisk;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverDisk = DeviceDriverDisk;
})(TSOS || (TSOS = {}));
