///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {
        constructor() {
        }

        //this is where I take the input and overwrite the initialized array of 00's for memory
        public createArr(memSegment, opInput) {

            for(let i =memSegment; i < opInput.length; i++) {
                _Memory.memoryArray[i] = opInput[i];
                //console.log(_Memory.memoryArray[i] + " next ");
            }
            //console.log("COMPLETE");
            //console.log(_Memory.memoryArray[1] + " next ");
            
        }
    }
}