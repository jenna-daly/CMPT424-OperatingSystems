///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

//Creating this file to: develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum	
//(or default = 6)

module TSOS {
    //construct global instance of class
        export class DeviceDriverDisk  extends TSOS.DeviceDriver{
            disk: any;
            constructor(disk) {
                super();
                this.disk = disk;
                this.driverEntry = this.krnKbdDriverEntry;
    
            }
        
            public init(): void {
        
            } 


            public krnKbdDriverEntry() {
                // Initialization routine for this, the kernel-mode Keyboard Device Driver.
                this.status = "loaded";
                // More?
            }

            public format(){
                sessionStorage.clear();
                for (let i = 0; i < this.disk.tracks; i++) {
                    for (let j = 0; j < this.disk.sectors; j++) {
                        for (let k = 0; k < this.disk.blocks; k++) {
                            var dataArr = new Array();
                            for(let l = 0; l < this.disk.blocksize; l++) {
                                dataArr.push("00");
                            }
                            var block = {
                                inUse: "0",
                                next: "0:0:0",
                                data: dataArr
                            }
                            sessionStorage.setItem(i + ":" + j + ":" + k, JSON.stringify(block));
                        }
                    }
                }
                console.log("reached");
                _formattedDisk = true;
                console.log(_formattedDisk);
            }
    
            public createFile(name) {
                for (let j = 0; j < this.disk.sectors; j++) {
                    for (let k = 0; k < this.disk.blocks; k++) {
                        //skip over mbr when checking for free blocks
                        if(j == 0 && k == 0) {
                            continue;
                        }
                        
                        var tsb = "0" + ":" + j + ":" + k;
                        var test = JSON.parse(sessionStorage.getItem(tsb));
                        console.log(test);
                        //this finds a not in use area to then point to our data block, which we need to locate in the if
                        if(test.inUse == "0") {
                            console.log(tsb);
                            var findBlockTSB = this.findFreeBlock();
                            var freeBlock = JSON.parse(sessionStorage.getItem(findBlockTSB));
                            test.inUse = "1"
                            freeBlock.inUse = "1";
                            freeBlock.next = findBlockTSB;
                            //freeBlock = this.clearData(freeBlock);
                            var newHex = this.convertToAscii(name);
                            //test = this.clearData(test);

                            for(let k=0; k< newHex.length; k++){
                                test.data[k] = newHex[k]
                            }

                            sessionStorage.setItem(tsb, JSON.stringify(test));
                            sessionStorage.setItem(findBlockTSB, JSON.stringify(freeBlock));
                            TSOS.Control.updateDisk();
                            return -1;
                        }
                
                    }
                }
            }

            public convertToAscii(string){
                var newStr = ""
                for(let i=0; i < string.length; i++){
                    newStr += string.charCodeAt(i);
                }
                return newStr;
            }

            public findFreeBlock(){
                return "1:0:0";
            }

            public readFile(name) {

            }

            public writeFile(data, name) {

            }

            public ls() {

            }

        }
    }