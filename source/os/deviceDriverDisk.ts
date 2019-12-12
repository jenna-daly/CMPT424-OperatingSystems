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
                        var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                        console.log(itemAtTSB);
                        //this finds a not in use area to then point to our data block, which we need to locate in the if
                        if(itemAtTSB.inUse == "0") {
                            console.log(tsb);
                            var findBlockTSB = this.findFreeBlock();
                            var freeBlock = JSON.parse(sessionStorage.getItem(findBlockTSB));
                            //both now in use, free block to hold data and itemAtTSB to hold name and update next
                            itemAtTSB.inUse = "1"
                            freeBlock.inUse = "1";
                            itemAtTSB.next = findBlockTSB;
                            //freeBlock = this.clearData(freeBlock);
                            var newHex = this.convertToAscii(name);
                            //test = this.clearData(test);

                            for(let k=0; k< newHex.length; k++){
                                itemAtTSB.data[k] = newHex[k]
                            }

                            sessionStorage.setItem(tsb, JSON.stringify(itemAtTSB));
                            sessionStorage.setItem(findBlockTSB, JSON.stringify(freeBlock));
                            TSOS.Control.updateDisk();
                            return -1;
                        }
                
                    }
                }
            }
            //gets name of file in ascii
            public convertToAscii(string){
                var newStr = ""
                for(let i=0; i < string.length; i++){
                    newStr += string.charCodeAt(i);
                }
                return newStr;
            }

            public findFreeBlock(){
                //start looking at track 1
                for (let i = 1; i < this.disk.tracks; i++) {
                    for (let j = 0; j < this.disk.sectors; j++) {
                        for (let k = 0; k < this.disk.blocks; k++) {
                            var tsb = i + ":" + j + ":" + k;
                            var tsbInfo = JSON.parse(sessionStorage.getItem(tsb));
                            if(tsbInfo.inUse == "0") {
                                return tsb;
                            }
                        }
                    }
                }

            }

            public readFile(name) {

            }

            public writeFile(data, name) {

            }

            public ls() {

            }

        }
    }