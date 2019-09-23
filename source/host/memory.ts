///<reference path="../globals.ts" />

//Creating this file to create an array for memory

module TSOS {

    export class Memory {
        //memoryArray: any;
        constructor(public memoryArray = []
            ) {

        }

    public init(): void {
        //set up array
        for(let i=0; i < 512; i++) {
            this.memoryArray[i]= "00";
        }
      }  

    }
}