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
                            var newHex = this.convertToAscii(name);

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
                console.log("new str " + newStr);
                return newStr;
            }
            //find free block to write data to
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
                var hexName = this.convertToAscii(name);
                for (let j = 0; j < this.disk.sectors; j++) {
                    for (let k = 0; k < this.disk.blocks; k++) {
                        //skip over mbr when checking for free blocks
                        if(j == 0 && k == 0) {
                            continue;
                        }
                        console.log("hex data " + hexName);
                        var tsb = "0" + ":" + j + ":" + k;
                        var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                        //we want to find an in use file and then check for a matching name
                        var found = true;
                        if(itemAtTSB.inUse == "1"){
                            for(let k=0; k< hexName.length; k++){
                                if(itemAtTSB.data[k] != hexName[k]) {
                                    found = false;
                                }
                            }
                            //i encountered a bug where I created a file called t and test and t was overwriting data saved to test
                            //i realized it is because my for loop goes to the length of the hex, so t of t does = t of test
                            //to fix it, check one more after the array ends and make sure the data is done
                            if (itemAtTSB.data[hexName.length + 1] != "00") {
                                found = false;
                            }
                            if(found == true) {
                                var newTSB = itemAtTSB.next;
                                console.log("reading " + JSON.parse(sessionStorage.getItem(newTSB)).data);
                                for(let i = 0; i < 60; i++) {
                                    if(itemAtTSB.data != "00") {

                                    }
                                }
                            }
                        }
                    }
                }
            }

            public writeFile(name, data) {
                var hexName = this.convertToAscii(name);
                for (let j = 0; j < this.disk.sectors; j++) {
                    for (let k = 0; k < this.disk.blocks; k++) {
                        //skip over mbr when checking for free blocks
                        if(j == 0 && k == 0) {
                            continue;
                        }
                        console.log("hex data " + hexName);
                        var tsb = "0" + ":" + j + ":" + k;
                        var itemAtTSB = JSON.parse(sessionStorage.getItem(tsb));
                        //we want to find an in use file and then check for a matching name
                        var found = true;
                        if(itemAtTSB.inUse == "1"){
                            for(let k=0; k< hexName.length; k++){
                                if(itemAtTSB.data[k] != hexName[k]) {
                                    found = false;
                                }
                            }
                            //i encountered a bug where I created a file called t and test and t was overwriting data saved to test
                            //i realized it is because my for loop goes to the length of the hex, so t of t does = t of test
                            //to fix it, check one more after the array ends and make sure the data is done
                            if (itemAtTSB.data[hexName.length + 1] != "00") {
                                found = false;
                            }
                            if(found == true) {
                                var newTSB = itemAtTSB.next;
                                var dataHex = this.convertToAscii(data);
                                var dataBlock = JSON.parse(sessionStorage.getItem(newTSB));
                                for(let i=0; i<dataHex.length; i++) {
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

            }

            public deleteFile(name){

            }

            public ls() {

            }

        }
    }