///<reference path="../globals.ts" />
///<reference path ="../host/memory.ts"/>
///<reference path = "../host/memoryAccessor.ts"/>


     module TSOS {

        export class Disk {
    
            constructor(
                public tracks: number = 4,
                public sectors: number = 8,
                public blocks: number = 8) {
    
            }
    
            public init(): void {
                this.tracks = 4;
                this.sectors = 8;
                this.blocks = 8;
            }
        }
    }