///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="memoryManager.ts" />
///<reference path="scheduler.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.PID = 0;
        }
        Shell.prototype.init = function () {
            var sc;
            var status;
            var statusOne;
            TSOS.Control.updateMemory();
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time");
            this.commandList[this.commandList.length] = sc;
            //whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Displays your current location");
            this.commandList[this.commandList.length] = sc;
            //moviequote
            sc = new TSOS.ShellCommand(this.shellMoviequote, "moviequote", "- Displays a quote I (the OS) like!");
            this.commandList[this.commandList.length] = sc;
            //status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Status followed by a string prints the string in the taskbar.");
            this.commandList[this.commandList.length] = sc;
            //BSOD
            sc = new TSOS.ShellCommand(this.shellPark, "park", "- Type at your own risk.");
            this.commandList[this.commandList.length] = sc;
            //load command
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<priority> - Validates input- only hex digits and spaces allowed. Priority is an optional paramter.");
            this.commandList[this.commandList.length] = sc;
            //load command
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - runs program as specified by pid.");
            this.commandList[this.commandList.length] = sc;
            //clearmem command
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;
            //runall command
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- Runs all programs at once");
            this.commandList[this.commandList.length] = sc;
            //ps command
            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- Display the PID and state of all processes");
            this.commandList[this.commandList.length] = sc;
            //kill <pid> command
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Kills specified process");
            this.commandList[this.commandList.length] = sc;
            //killall command
            sc = new TSOS.ShellCommand(this.shellKillall, "killall", "- Kills all processes");
            this.commandList[this.commandList.length] = sc;
            //quantum <int> command
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Sets the round robin quantum");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Creates a file with given name");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Displays contents of specified file if valid");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> data - Writes data provided in quotes to specified file");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<filename> - Removes file from storage");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "Initializes all blocks in all sectors in all tracks");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellLs, "ls", "Lists current files stored on the disk");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellSetschedule, "setschedule", "[rr, fcfs, priority] - Sets the scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellGetschedule, "getschedule", "Returns the name of the current scheduling algorithm");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            //_StdOut.putText(APP_NAME + " version " + APP_VERSION);
            _StdOut.putText("You are using the latest and greatest version of Jurassic OS!");
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellDate = function (args) {
            _StdOut.putText("Current date: " + new Date());
        };
        Shell.prototype.shellWhereami = function (args) {
            _StdOut.putText("On Earth staring at a computer");
        };
        //prints out a movie quoute as a feature
        Shell.prototype.shellMoviequote = function (args) {
            _StdOut.putText("Ah Ah Ah, You didn't say the magic word- Computer in Jurassic Park");
        };
        //when park is typed, show image as BSOD simulation
        Shell.prototype.shellPark = function (args) {
            var BSOD = document.getElementById("BSOD");
            var c = document.getElementById("display");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(BSOD, 10, 0);
            _Kernel.krnShutdown();
        };
        //validates user input
        Shell.prototype.shellLoad = function (args) {
            var validateText = document.getElementById("taProgramInput").value;
            var allowedChars = [' ', 'a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            //note: tried to use regex var allowedChars = /[a-fA-F0-9]/; however could not figure out //what to use instead of indexOf, so I am leaving the manual array.. will look into it to
            //clear up the code
            var isValid = false;
            for (var i = 0; i < validateText.length; i++) {
                if (allowedChars.indexOf(validateText[i]) > -1) {
                    isValid = true;
                }
                else {
                    isValid = false;
                    break;
                }
            }
            if (isValid == true) {
                if (args.length > 0 && args[0] > 0) {
                    _StdOut.putText("Priority set to " + parseInt(args[0]));
                    var inputPriority = parseInt(args[0]);
                    _StdOut.advanceLine();
                }
                else if (args.length > 0) {
                    _StdOut.putText("Please enter a valid priority as an integer");
                    return -1;
                }
                //memory is full if we have the 3 segments filled
                //originally I was reassigning PID 0, I changed the if so I can keep incrementing up
                if (_PCBStored.length > 2) {
                    // _StdOut.putText("Memory is full. Clear partitions to load a new program.");
                    // return -1;
                    if (!_formattedDisk) {
                        _StdOut.putText("Memory is full. Must format disk to load additional data.");
                        return;
                    }
                    else if (_DiskDrive.findFreeBlock() == null) {
                        _StdOut.putText("Disk is full. Free up memory or disk space to load new data");
                    }
                    else {
                        _StdOut.putText("Attempting to load to disk");
                        _StdOut.advanceLine();
                        _DiskDrive.createFile("file");
                        _DiskDrive.writeFile("file", validateText);
                        _StdOut.putText("Program loaded successfuly with PID " + _PID);
                        _currentPID = _PID;
                        var newPCB = new TSOS.Pcb(_currentPID);
                        console.log("NEW PCB " + JSON.stringify(newPCB));
                        //resident list
                        _PCBStored.push(newPCB);
                        _PCBStored[_currentPID].location = "Disk";
                        TSOS.Control.accessPCB();
                        return;
                    }
                }
                _StdOut.putText("Program loaded successfuly with PID " + _PID);
                var validInput = document.getElementById("taProgramInput").value;
                var newInput = validInput.split(" ");
                //have to reset 
                _CPU.init();
                _currentPID = _PID;
                var newPCB = new TSOS.Pcb(_currentPID);
                console.log("NEW PCB " + JSON.stringify(newPCB));
                //resident list
                _PCBStored.push(newPCB);
                var segment = _MemoryManager.allocateMemory();
                _PCBStored[segment].base = _MemoryManager.getBase(segment);
                _PCBStored[segment].limit = _MemoryManager.getLimit(segment);
                if (inputPriority != null) {
                    _PCBStored[segment].priority = inputPriority;
                }
                else {
                    _PCBStored[segment].priority;
                }
                console.log("PRIORITY SET TO " + _PCBStored[segment].priority);
                console.log("update PCB " + JSON.stringify(_PCBStored));
                //save to memory
                _MemoryManager.createArr(segment, newInput);
                //_currentPID = _PID;
                //update our counters / displays
                TSOS.Control.updateMemory();
                TSOS.Control.accessCPU();
                _PID += 1;
                TSOS.Control.accessPCB();
            }
            else {
                _StdOut.putText("Input is not valid. Use only hex digits and spaces.");
            }
        };
        Shell.prototype.shellRun = function (args) {
            //checks that arg given exists
            var valid = false;
            if (args.length > 0) {
                for (var i = 0; i < _PCBStored.length; i++) {
                    if (_PCBStored[i].Pid == args && _PCBStored[i].State == "Resident") {
                        //add in if status = ready do this, otherwise do not
                        _StdOut.putText("Valid PID. Running.");
                        _StdOut.advanceLine();
                        valid = true;
                        _PCBStored[i].State = "Running";
                        runningPID = i;
                        console.log("RUNNING " + runningPID);
                        //set running process
                        runningProcess = _PCBStored[runningPID];
                        break;
                    }
                    else {
                        valid = false;
                    }
                }
            }
            if (valid == false) {
                _StdOut.putText("Usage: run <PID> Please supply a PID.");
            }
            if (valid == true) {
                //maybe don't need
                //_CPU.PC = _PCBStored[runningPID].base;
                console.log(_CPU.PC + " STARTING PC");
                //_CPU.PC = _PCBStored[args].base;
                _CPU.isExecuting = true;
                TSOS.Control.accessCPU();
                TSOS.Control.accessPCB();
            }
        };
        //iP3 commands, functionality to be added
        Shell.prototype.shellClearmem = function (args) {
            if (_CPU.isExecuting == true) {
                _StdOut.putText("Cannot clear memory while a program is running.");
            }
            else {
                _MemoryManager.clearMemory();
                _StdOut.putText("Success! Memory is now empty.");
                //clear PCB list
                segmentZeroFree = true;
                segmentOneFree = true;
                segmentTwoFree = true;
                //redisplay PCB and CPU
                _PCBStored = [];
                TSOS.Control.accessPCB();
                _CPU.init();
                TSOS.Control.accessCPU();
            }
        };
        Shell.prototype.shellRunall = function (args) {
            for (var i = 0; i < _PCBStored.length; i++) {
                //couldn't figure out swap in and out so I am adding this if so the program at least runs the first 3 for ip4
                if (_PCBStored[i].location != 'Disk') {
                    _Scheduler.setReadyQueue(_PCBStored[i]);
                }
            }
            if (_Scheduler.algorithm == 'priority') {
                _CPU.isExecuting = true;
                _Scheduler.scheduleProcesses(_Scheduler.readyQueue);
            }
            else {
                _CPU.isExecuting = true;
                runningProcess = _Scheduler.readyQueue.dequeue();
                runningProcess.State = "Running";
            }
        };
        //list running or resident processes
        Shell.prototype.shellPS = function (args) {
            var containsProcesses = "";
            if (_Scheduler.readyQueue.isEmpty()) {
                for (var i = 0; i < _PCBStored.length; i++) {
                    if (_PCBStored[i].State == "Resident" || _PCBStored[i].State == "Running") {
                        containsProcesses += " PID " + _PCBStored[i].Pid.toString() + " " + _PCBStored[i].State + " ";
                    }
                }
                _StdOut.putText(containsProcesses);
            }
            else {
                containsProcesses += " PID " + runningProcess.Pid.toString() + " " + runningProcess.State;
                for (var i = 0; i < _Scheduler.readyQueue.getSize(); i++) {
                    var changeState = _Scheduler.readyQueue.dequeue();
                    containsProcesses += " PID " + changeState.Pid.toString() + " " + changeState.State;
                    _Scheduler.readyQueue.enqueue(changeState);
                }
                _StdOut.putText(containsProcesses);
            }
        };
        //kill specified process
        Shell.prototype.shellKill = function (args) {
            if (args.length > 0) {
                for (var i = 0; i < _PCBStored.length; i++) {
                    if (_PCBStored[i].Pid == args) {
                        if (_PCBStored[i].State == "Completed" || _PCBStored[i].State == "Terminated") {
                            _StdOut.putText("ERROR Process is already completed or terminated");
                            _StdOut.advanceLine();
                        }
                        else if (_PCBStored[i].State == "Resident") {
                            _PCBStored[i].State = "Terminated";
                            TSOS.Control.accessPCB();
                        }
                        else if (_PCBStored[i].State == "Running") {
                            _PCBStored[i].State = "Terminated";
                            TSOS.Control.accessPCB();
                            _CPU.isExecuting = false;
                        }
                        else {
                            _StdOut.putText("Usage: kill <PID> Please supply a valid PID.");
                        }
                    }
                }
            }
            else {
                _StdOut.putText("Usage: kill <PID> Please supply a PID.");
            }
        };
        //kill all processes
        Shell.prototype.shellKillall = function (args) {
            _StdOut.putText("Coming soon");
            runningProcess.State = "Terminated";
            for (var i = 0; i < _Scheduler.readyQueue.getSize(); i++) {
                var changeState = _Scheduler.readyQueue.dequeue();
                changeState.State = "Terminated";
                _Scheduler.readyQueue.enqueue(changeState);
            }
            _CPU.isExecuting = false;
            _StdOut.advanceLine();
            TSOS.Control.accessPCB();
        };
        //set rr quantum
        Shell.prototype.shellQuantum = function (args) {
            if (args.length > 0) {
                var newQuant = _Scheduler.setQuantum(parseInt(args));
                console.log(_Scheduler.quantum + " quantum val");
                _StdOut.putText("New quantum set to: " + newQuant);
            }
            else {
                _StdOut.putText("Quantum not valid. Please enter an int.");
            }
        };
        Shell.prototype.shellCreate = function (args) {
            if (!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
                return;
                ;
            }
            else if (args.length > 0) {
                _DiskDrive.createFile(args[0]);
                _StdOut.putText("File created named: " + args[0]);
            }
            else {
                _StdOut.putText("<Usage>: Please supply a file name");
            }
        };
        Shell.prototype.shellRead = function (args) {
            if (!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
                return;
            }
            else if (args.length > 0) {
                var filename = args[0];
                var x = _DiskDrive.readFile(filename);
                x;
            }
            else {
                console.log(args.length);
                _StdOut.putText("<Usage>: Please supply a file name");
            }
            if (x != -1) {
                _StdOut.putText("[ERROR] file not found");
            }
        };
        Shell.prototype.shellWrite = function (args) {
            if (!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
                return;
            }
            else if (args.length >= 2) {
                var fileName = args[0];
                args.splice(0, 1);
                //replaces , with a space when saving user input
                var fileInfo = args.join(' ');
                // console.log(fileInfo + " file info");
                // console.log(fileName + "name of file");
                _StdOut.putText("Writing to file ..");
                _StdOut.advanceLine();
                var x = _DiskDrive.writeFile(fileName, fileInfo);
                x;
            }
            else {
                _StdOut.putText("<Usage>: Please supply a file name and data in quotes");
            }
            if (x != -1) {
                _StdOut.putText("[ERROR] file not found");
            }
            else {
                _StdOut.putText("Success");
            }
        };
        Shell.prototype.shellDelete = function (args) {
            if (!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
                return;
            }
            else if (args.length > 0) {
                var filename = args[0];
                var x = _DiskDrive.deleteFile(filename);
                x;
            }
            else {
                _StdOut.putText("<Usage>: Please supply a file name");
            }
            if (x != -1) {
                _StdOut.putText("[ERROR] file not found");
            }
            else {
                _StdOut.putText("File with name " + filename + " is deleted");
            }
        };
        Shell.prototype.shellFormat = function (args) {
            if (_CPU.isExecuting == true) {
                _StdOut.putText("Cannot format disk during execution");
            }
            else {
                _DiskDrive.format();
                TSOS.Control.updateDisk();
                _StdOut.putText("Disk formatted");
            }
        };
        Shell.prototype.shellLs = function (args) {
            _DiskDrive.ls();
        };
        Shell.prototype.shellSetschedule = function (args) {
            if (args.length > 0) {
                if (args[0].toLowerCase() == 'rr') {
                    _Scheduler.setAlg('rr');
                    _StdOut.putText("Setting schedule to RR");
                }
                else if (args[0].toLowerCase() == 'priority') {
                    _Scheduler.setAlg('priority');
                    _StdOut.putText("Setting schedule to priority");
                }
                else if (args[0].toLowerCase() == 'fcfs') {
                    _Scheduler.setAlg('fcfs');
                    _StdOut.putText("Setting schedule to FCFS");
                }
                else {
                    _StdOut.putText("Please enter a valid schedule: [RR, Priority, FCFS].");
                }
            }
            else {
                _StdOut.putText("Please enter a valid schedule: [RR, Priority, FCFS].");
            }
        };
        Shell.prototype.shellGetschedule = function (args) {
            _StdOut.putText("Scheduling algorithm is set to: " + _Scheduler.algorithm);
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("Ver displays the current version being used.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown will shutdown the OS but not the hardware simulation.");
                        break;
                    case "cls":
                        _StdOut.putText("Cls clears screen.");
                        break;
                    case "man":
                        _StdOut.putText("Man followed by a topic displays a list of helpful information for the topic specified.");
                        break;
                    case "trace":
                        _StdOut.putText("Trace will turn the OS trace on or off as specified.");
                        break;
                    case "rot13":
                        _StdOut.putText("Rot13 will rotate the given string by 13 places.");
                        break;
                    case "prompt":
                        _StdOut.putText("Prompt followed by a string will set the prompt.");
                        break;
                    case "date":
                        _StdOut.putText("Displays the date and time.");
                        break;
                    case "whereami":
                        _StdOut.putText("OS will return your location following this command.");
                        break;
                    case "moviequote":
                        _StdOut.putText("OS will supply a fun movie quote.");
                        break;
                    case "status":
                        _StdOut.putText("Type status followed by any sentence you want to have it show up in the taskbar.");
                        break;
                    case "park":
                        _StdOut.putText("Once more.. type for your own peril.");
                        break;
                    case "load":
                        _StdOut.putText("OS will validate input. Allows hex digits and spaces only. Can give a priority to be used with the priority scheduling algorithm.");
                        break;
                    case "run":
                        _StdOut.putText("Program will run as specified by pid.");
                        break;
                    case "clearmem":
                        _StdOut.putText("All memory partitions are cleared.");
                        break;
                    case "runall":
                        _StdOut.putText("All programs in memory will be executed.");
                        break;
                    case "ps":
                        _StdOut.putText("The PID and state of all processes is displayed.");
                        break;
                    case "kill":
                        _StdOut.putText("Kills process as specified by PID.");
                        break;
                    case "killall":
                        _StdOut.putText("Kills all processes.");
                        break;
                    case "quantum":
                        _StdOut.putText("Quantum of round robin is set as specified by int.");
                        break;
                    case "create":
                        _StdOut.putText("Creates a new file.");
                        break;
                    case "read":
                        _StdOut.putText("Reads the contents of a file.");
                        break;
                    case "write":
                        _StdOut.putText("Writes specified data to file.");
                        break;
                    case "delete":
                        _StdOut.putText("Deletes file from disk.");
                        break;
                    case "format":
                        _StdOut.putText("Initializes disk for use.");
                        break;
                    case "ls":
                        _StdOut.putText("Lists files on the disk.");
                        break;
                    case "setschedule":
                        _StdOut.putText("Sets new scheduling algorithm.");
                        break;
                    case "getschedule":
                        _StdOut.putText("Returns current scheduling algorithm.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        //my function to save the status and then print it
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                status = " ";
                var x = document.getElementById("divStatus");
                for (var i = 0; i < args.length; i++) {
                    status += args[i] + " ";
                }
                x.innerHTML = "| Status " + status;
            }
            else {
                _StdOut.putText("Usage: status <string> Please supply a string.");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
