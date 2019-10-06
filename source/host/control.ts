///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
///<reference path="../os/PCB.ts" />


/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
            _Memory = new Memory();
            _Memory.init();
            this.memoryLog();
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }

        //seems like writing to the html elements happens here. I created an array initialized to 0's, now I want to print it
        //using this function
        public static memoryLog() {
            var accessMemory = document.getElementById("taMemory");
            var containMem = "";
            var maxRowCount = 8; //8 memory spaces across
            var memoryLocation = 0; //increment memory index w this var

            for(let i=0; i < (_MemorySize/8); i++) {
                containMem += "<tr>";
                for(let j=0; j< maxRowCount; j++) {
                    containMem += "<td>" + _Memory.memoryArray[memoryLocation] + "</td>"; 
                    memoryLocation = memoryLocation + 1;
                }
                containMem += "</tr>";
            }
            accessMemory.innerHTML = containMem;
        }

        public static updateMemory() {
            //I was using this to go through the input, but now that Memory Manager works to save the array, should not be needed..
            //keeping commented until I am sure there are no bugs
            //var validate = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
            //code to put into memory the user entered op codes
            /*var space = " ";
            var newString = "";
            for(let i =0; i< validate.length; i++) {
                if(space.indexOf(validate[i]) < 0) {
                    newString += validate[i]; 
                }
            }*/
        
            //this loop breaks my code.. so I need to figure out how to store the newString in an array or else I can use substring
            /*for(let i=0; i< _MemorySize; i+2) {
                _Memory.memoryArray[i] = newString.substring(i, i+2);
            }*/
    
            var accessMemory = document.getElementById("taMemory");
          
            var containMem = "";
            var maxRowCount = 8; //8 memory spaces across
            var memoryLocation = 0; //increment memory index w this var
            var s = 0; //substring indexing
            var memoryHex = 0;
                                    
            for(let i=0; i < (_MemorySize/8); i++) {
            //loading the labels for each memory row
                if(memoryHex == 0) {
                    containMem += "<tr><td> 0x00" + (memoryHex).toString(16).toUpperCase() + "</td>";
                    memoryHex += 8;
                }
                else{
                    containMem += "<tr><td> 0x0" + (memoryHex).toString(16).toUpperCase() + "</td>";
                    memoryHex += 8; 
                }
                for(let j=0; j< maxRowCount; j++) {
                    if(s < _Memory.memoryArray.length) {
                        containMem += "<td>" + _Memory.memoryArray[s] + "</td>"; 
                        memoryLocation = memoryLocation + 1;
                        s = s + 1;
                    }
                    else{
                        containMem += "<td>" + "00" + "</td>"; 

                    }
                }
                containMem += "</tr>";
                }
                accessMemory.innerHTML = containMem;
      
            }
    

        //PCB
        public static accessPCB() {
            var accessBlock = document.getElementById("taPCB");
            var containPCB = "<th>PID</th><th>State</th><th>PC</th><th>IR</th><th>Acc</th><th>X Reg</th><th>Y Reg</th><th>Z Flag</th></tr><tr>";
            //for iProject2 there is only one loaded process, so I am just making a loop once, for the next project I will need the loop to go furthur
            /*for(let i=0; i<1; i++) {
                containPCB += "<tr><td>" + pidNum + "</td><td>" + "Resident" +  "</td></tr>" ;
            }
            accessBlock.innerHTML = containPCB;*/
            for(let i=0; i< _PCBStored.length; i++) {
                containPCB += "<td>" + _PCBStored[i] + "</td>" ;
            }
            accessBlock.innerHTML = "</tr>" + containPCB;
        }


        //CPU
        public static accessCPU() {
            var accessCPU = document.getElementById("taCPU");
            var containCPU = "<th>PC</th><th>IR</th><th>Acc</th><th>X Reg</th><th>Y Reg</th><th>Z Flag</th></tr>"
            for(let i = 0; i < 1; i++){
                containCPU += "<tr><td>" + _CPU.PC + "</td><td>" + _CPU.IR + "</td><td>" + _CPU.Acc + "</td><td>" + _CPU.Xreg + "</td><td>" + _CPU.Yreg + "</td><td>" + _CPU.Zflag + "</td></tr>";
            }
            accessCPU.innerHTML = containCPU;
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            
            //per iProject 2 instructions, create and initialize memory, create memory accessor
            _Memory	= new Memory();	
            _Memory.init();	
            _MemoryAccessor	= new MemoryAccessor();	    

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
    }
}
