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
var TSOS;
(function (TSOS) {
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
            _Memory = new TSOS.Memory();
            _Memory.init();
            this.memoryLog();
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        //seems like writing to the html elements happens here. I created an array initialized to 0's, now I want to print it
        //using this function
        Control.memoryLog = function () {
            var accessMemory = document.getElementById("taMemory");
            var containMem = "";
            var maxRowCount = 8; //8 memory spaces across
            var memoryLocation = 0; //increment memory index w this var
            for (var i = 0; i < (_MemorySize / 8); i++) {
                containMem += "<tr>";
                for (var j = 0; j < maxRowCount; j++) {
                    containMem += "<td>" + _Memory.memoryArray[memoryLocation] + "</td>";
                    memoryLocation = memoryLocation + 1;
                }
                containMem += "</tr>";
            }
            accessMemory.innerHTML = containMem;
        };
        //updates the memory display
        Control.updateMemory = function () {
            var accessMemory = document.getElementById("taMemory");
            var containMem = "";
            var maxRowCount = 8; //8 memory spaces across
            var memoryLocation = 0; //increment memory index w this var
            var s = 0; //substring indexing
            var memoryHex = 0;
            for (var i = 0; i < (_MemorySize / 8); i++) {
                //loading the labels for each memory row
                if (memoryHex == 0 || memoryHex == 8) {
                    containMem += "<tr><td> 0x00" + (memoryHex).toString(16).toUpperCase() + "</td>";
                    memoryHex += 8;
                }
                else if (memoryHex > 248) {
                    containMem += "<tr><td> 0x" + (memoryHex).toString(16).toUpperCase() + "</td>";
                    memoryHex += 8;
                }
                else {
                    containMem += "<tr><td> 0x0" + (memoryHex).toString(16).toUpperCase() + "</td>";
                    memoryHex += 8;
                }
                for (var j = 0; j < maxRowCount; j++) {
                    if (s < _Memory.memoryArray.length) {
                        containMem += "<td>" + _Memory.memoryArray[s] + "</td>";
                        memoryLocation = memoryLocation + 1;
                        s = s + 1;
                    }
                    else {
                        containMem += "<td>" + "00" + "</td>";
                    }
                }
                containMem += "</tr>";
            }
            accessMemory.innerHTML = containMem;
        };
        //update disk display
        Control.updateDisk = function () {
            var accessDisk = document.getElementById("taDisk");
            var rowNum = 0;
            var containDisk = "<th>T:S:B</th><th>In Use</th><th>Next</th><th>Data</th></tr>";
            for (var i = 0; i < _Disk.tracks; i++) {
                for (var j = 0; j < _Disk.sectors; j++) {
                    for (var k = 0; k < _Disk.blocks; k++) {
                        // var tsb = i + ":" + j + ":" + k;
                        // var row = accessDisk.insertRow(rowNum);
                        // rowNum++;
                        // row.insertCell(0);
                        containDisk += "<tr><td>" + (i + ":" + j + ":" + k) + "</td><td>" + JSON.parse(sessionStorage.getItem(i + ":" + j + ":" + k)).inUse + "</td><td>" + JSON.parse(sessionStorage.getItem(i + ":" + j + ":" + k)).next + "</td><td>" + JSON.parse(sessionStorage.getItem(i + ":" + j + ":" + k)).data.join("").toString() + "</td</tr>";
                        //containDisk += "<tr><td>" + (i + ":" + j + ":" + k) + "</td></tr>";
                    }
                }
            }
            accessDisk.innerHTML = containDisk;
        };
        //PCB
        Control.accessPCB = function () {
            var accessBlock = document.getElementById("taPCB");
            var containPCB = "<th>PID</th><th>State</th><th>PC</th><th>IR</th><th>Acc</th><th>X Reg</th><th>Y Reg</th><th>Z Flag</th></tr><tr>";
            //for iProject2 there is only one loaded process, so I am just making a loop once, for the next project I will need the loop to go furthur
            /*for(let i=0; i<1; i++) {
                containPCB += "<tr><td>" + pidNum + "</td><td>" + "Resident" +  "</td></tr>" ;
            }
            accessBlock.innerHTML = containPCB;*/
            for (var i = 0; i < _PCBStored.length; i++) {
                //containPCB += "<td>" + _PCBStored[i] + "</td>" +
                containPCB += "<td>" + _PCBStored[i].Pid + "</td><td>" + _PCBStored[i].State + "</td><td>" + _PCBStored[i].PC + "</td><td>" + _PCBStored[i].IR + "</td><td>" + _PCBStored[i].Acc + "</td><td>" + _PCBStored[i].Xreg + "</td><td>" + _PCBStored[i].Yreg + "</td><td>" + _PCBStored[i].Zflag + "</td><td>" + _PCBStored[i].location + "</td></tr>";
                //containPCB += "<td>" + runningProcess.Pid + "</td><td>" + runningProcess.State + "</td><td>" + runningProcess.PC + "</td><td>" + runningProcess.IR + "</td><td>" + runningProcess.Acc + "</td><td>" + runningProcess.Xreg + "</td><td>" + runningProcess.Yreg + "</td><td>" + runningProcess.Zflag + "</td></tr>";
            }
            accessBlock.innerHTML = containPCB;
            //"</tr>" + containPCB;
        };
        //CPU
        Control.accessCPU = function () {
            var accessCPU = document.getElementById("taCPU");
            var containCPU = "<th>PC</th><th>IR</th><th>Acc</th><th>X Reg</th><th>Y Reg</th><th>Z Flag</th></tr>";
            for (var i = 0; i < 1; i++) {
                containCPU += "<tr><td>" + _CPU.PC.toString(16).toUpperCase() + "</td><td>" + _CPU.IR + "</td><td>" + _CPU.Acc.toString(16).toUpperCase() + "</td><td>" + _CPU.Xreg.toString(16).toUpperCase() + "</td><td>" + _CPU.Yreg.toString(16).toUpperCase() + "</td><td>" + _CPU.Zflag.toString(16).toUpperCase() + "</td></tr>";
            }
            accessCPU.innerHTML = containCPU;
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            document.getElementById("btnSingleStep").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            //per iProject 2 instructions, create and initialize memory, create memory accessor
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            _Scheduler = new TSOS.Scheduler();
            //connecting var _DiskDrive to the device driver disk file which takes in a disk with the parameters
            //contained in the disk.js file
            _Disk = new TSOS.Disk();
            _DiskDrive = new TSOS.DeviceDriverDisk(_Disk);
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        Control.hostBtnSingleStep_click = function (btn) {
            _SingleStepRunning = !_SingleStepRunning;
            if (_SingleStepRunning == true) {
                document.getElementById("btnNextStep").disabled = false;
            }
            else {
                document.getElementById("btnNextStep").disabled = true;
            }
            _CPU.isExecuting = false;
        };
        Control.hostBtnNextStep_click = function (btn) {
            if (_SingleStepRunning == true) {
                _CPU.isExecuting = true;
            }
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
