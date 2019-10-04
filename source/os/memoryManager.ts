///<reference path="../globals.ts" />

module TSOS {
    export class MemoryManager {
        constructor() {
        }

        public createArr(memSegment, opInput) {

            for(let i =memSegment; i < opInput.length; i++) {
                _Memory.memoryArray[i] = opInput[i];
                //console.log(_Memory.memoryArray[i] + " next ");
            }
            
        }
    }
}