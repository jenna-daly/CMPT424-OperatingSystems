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
            }
    


        }
    }