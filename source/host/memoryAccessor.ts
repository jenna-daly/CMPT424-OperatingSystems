///<reference path="../globals.ts" />

//Creating this file to create an array for memory

module TSOS {

    export class MemoryAccessor {

        constructor() {

        }  

    //get memory at position loc
    public getMemory(loc){ 
        //console.log(_Memory.memoryArray[1] + "loc");     
        return _Memory.memoryArray[loc];
        
    }

    public memoryBoundaries(counter) {
        console.log("counter " + counter);
        if((counter + runningProcess.base) > runningProcess.limit){
            return false;
        }   
        else if((counter + runningProcess.base) < runningProcess.base) {
            return false;
        }      
        else {
            return true;
        }
    }

    //making a function to write memory
    /*public setMemory(loc, posNow){
        _Memory.memoryArray[loc] = _Memory.memoryArray[posNow]; 

    }*/

    }
}