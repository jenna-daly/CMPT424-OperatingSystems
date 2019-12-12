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

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public PID = 0;

        constructor() {

        }

        public init() {
            var sc;
            var status;
            var statusOne;

            TSOS.Control.updateMemory();
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            //date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time");
            this.commandList[this.commandList.length] = sc;

            //whereami
            sc = new ShellCommand(this.shellWhereami,
                                  "whereami",
                                  "- Displays your current location");
            this.commandList[this.commandList.length] = sc;

            //moviequote
            sc = new ShellCommand(this.shellMoviequote,
                                  "moviequote",
                                  "- Displays a quote I (the OS) like!");
            this.commandList[this.commandList.length] = sc;

            //status
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "<string> - Status followed by a string prints the string in the taskbar.");
            this.commandList[this.commandList.length] = sc;

            //BSOD
            sc = new ShellCommand(this.shellPark,
                                  "park",
                                  "- Type at your own risk.");
            this.commandList[this.commandList.length] = sc;

            //load command
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "<priority> - Validates input- only hex digits and spaces allowed. Priority is an optional paramter.");
            this.commandList[this.commandList.length] = sc;

            //load command
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<pid> - runs program as specified by pid.");
            this.commandList[this.commandList.length] = sc;

            //clearmem command
            sc = new ShellCommand(this.shellClearmem,
                                  "clearmem",
                                  "- Clears all memory partitions");
            this.commandList[this.commandList.length] = sc;

            //runall command
            sc = new ShellCommand(this.shellRunall,
                                  "runall",
                                  "- Runs all programs at once");
            this.commandList[this.commandList.length] = sc;

            //ps command
            sc = new ShellCommand(this.shellPS,
                                  "ps",
                                  "- Display the PID and state of all processes");
            this.commandList[this.commandList.length] = sc;

            //kill <pid> command
            sc = new ShellCommand(this.shellKill,
                                  "kill",
                                  "<pid> - Kills specified process");
            this.commandList[this.commandList.length] = sc;

            //killall command
            sc = new ShellCommand(this.shellKillall,
                                  "killall",
                                  "- Kills all processes");
            this.commandList[this.commandList.length] = sc;

            //quantum <int> command
            sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  "<int> - Sets the round robin quantum");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellCreate,
                                  "create",
                                  "<filename> - Creates a file with given name");
                                  this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRead,
                                  "read",
                                  "<filename> - Displays contents of specified file if valid");
                                  this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWrite,
                                  "write",
                                  "<filename> data - Writes data provided in quotes to specified file");
                                  this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDelete,
                                  "delete",
                                  "<filename> - Removes file from storage");
                                  this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellFormat,
                                  "format",
                                  "Initializes all blocks in all sectors in all tracks");
                                  this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLs,
                                  "ls",
                                  "Lists current files stored on the disk");
                                  this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellSetschedule,
                                  "setschedule",
                                  "[rr, fcfs, priority] - Sets the scheduling algorithm");
                                  this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellGetschedule,
                                  "getschedule",
                                  "Returns the name of the current scheduling algorithm");
                                  this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();

        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
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
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
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
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            //_StdOut.putText(APP_NAME + " version " + APP_VERSION);
            _StdOut.putText("You are using the latest and greatest version of Jurassic OS!")
        }


        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellDate(args) {
            _StdOut.putText("Current date: " + new Date());
        }

        public shellWhereami(args) {
            _StdOut.putText("On Earth staring at a computer");
        }

        //prints out a movie quoute as a feature
        public shellMoviequote(args) {
            _StdOut.putText("Ah Ah Ah, You didn't say the magic word- Computer in Jurassic Park");
        }

        //when park is typed, show image as BSOD simulation
        public shellPark(args) {
            var BSOD = <HTMLCanvasElement>  document.getElementById("BSOD");
            var c = <HTMLCanvasElement> document.getElementById("display");
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(BSOD, 10, 0);
            _Kernel.krnShutdown();           
        }

        //validates user input
        public shellLoad(args) {
            var validateText = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
            var allowedChars = [' ', 'a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            //note: tried to use regex var allowedChars = /[a-fA-F0-9]/; however could not figure out //what to use instead of indexOf, so I am leaving the manual array.. will look into it to
            //clear up the code
            let isValid: boolean = false;
            for(let i=0; i< validateText.length; i++) {
                if(allowedChars.indexOf(validateText[i]) > -1) {
                    isValid = true;
                }
                else {
                    isValid = false;
                    break;
                }
            }
            
            if(isValid == true) {
                if(args.length > 0 && args[0] > 0) {
                    _StdOut.putText("Priority set to " + parseInt(args[0]));
                    var inputPriority = parseInt(args[0]);
                    _StdOut.advanceLine();
                }
                else if(args.length > 0){
                    _StdOut.putText("Please enter a valid priority as an integer");
                    return -1;
                }
                //memory is full if we have the 3 segments filled
                //originally I was reassigning PID 0, I changed the if so I can keep incrementing up
                if(_PCBStored.length > 2){
                    _StdOut.putText("Memory is full. Clear partitions to load a new program.");
                    return -1;
                }
                _StdOut.putText("Program loaded successfuly with PID " + _PID);

                var validInput = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
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
            else{
                _StdOut.putText("Input is not valid. Use only hex digits and spaces.");
            }
        }

        public shellRun(args) {
            //checks that arg given exists
            var valid = false;
            if(args.length > 0) {
                for(let i =0; i < _PCBStored.length; i++) {
                    if(_PCBStored[i].Pid == args && _PCBStored[i].State == "Resident") {
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
                    else{
                        valid = false;
                    }
                }
            }

            if(valid == false){
                _StdOut.putText("Usage: run <PID> Please supply a PID.");
            }
            if(valid ==true) {
                //maybe don't need
                //_CPU.PC = _PCBStored[runningPID].base;
                console.log(_CPU.PC + " STARTING PC");
                
                //_CPU.PC = _PCBStored[args].base;
                _CPU.isExecuting = true;
                TSOS.Control.accessCPU();
                TSOS.Control.accessPCB(); 
            }

        }

        //iP3 commands, functionality to be added
        public shellClearmem(args) {
            if(_CPU.isExecuting == true) {
                _StdOut.putText("Cannot clear memory while a program is running.");
            }
            else{
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
        }

        public shellRunall(args) {
            for(let i=0; i < _PCBStored.length; i++) {
                _Scheduler.setReadyQueue(_PCBStored[i]);
            }
            _CPU.isExecuting = true;
            runningProcess = _Scheduler.readyQueue.dequeue();
            runningProcess.State = "Running";
        }

        //list running or resident processes
        public shellPS(args) {
          var containsProcesses = "";
          if(_Scheduler.readyQueue.isEmpty()) {
            for(let i =0; i < _PCBStored.length; i++) {
                if(_PCBStored[i].State == "Resident" || _PCBStored[i].State == "Running") {
                    containsProcesses += " PID " + _PCBStored[i].Pid.toString() + " " + _PCBStored[i].State + " ";
                }     
            }
            _StdOut.putText(containsProcesses);
          }
          else {
            containsProcesses += " PID " + runningProcess.Pid.toString() + " " + runningProcess.State;
            for(let i=0; i < _Scheduler.readyQueue.getSize(); i++) {
                var changeState = _Scheduler.readyQueue.dequeue();
                containsProcesses += " PID " + changeState.Pid.toString() + " " + changeState.State;
                _Scheduler.readyQueue.enqueue(changeState);
            }
            _StdOut.putText(containsProcesses);
          }   
        }

        //kill specified process
        public shellKill(args) {
          if(args.length > 0) {
            for(let i =0; i < _PCBStored.length; i++) {
                if(_PCBStored[i].Pid == args) {
                    if(_PCBStored[i].State == "Completed" || _PCBStored[i].State == "Terminated"){
                    _StdOut.putText("ERROR Process is already completed or terminated");
                    _StdOut.advanceLine();
                    }
                    else if(_PCBStored[i].State == "Resident") {
                        _PCBStored[i].State = "Terminated";
                        TSOS.Control.accessPCB(); 
                    }
                    else if(_PCBStored[i].State == "Running") {
                        _PCBStored[i].State = "Terminated";
                        TSOS.Control.accessPCB(); 
                        _CPU.isExecuting = false;
                    }
                    else{
                        _StdOut.putText("Usage: kill <PID> Please supply a valid PID.");
                    }
                }
            }
        }
                else{
                    _StdOut.putText("Usage: kill <PID> Please supply a PID.");
                }
            
        }

        //kill all processes
        public shellKillall(args) {
            _StdOut.putText("Coming soon");
            runningProcess.State = "Terminated";
            for(let i =0; i < _Scheduler.readyQueue.getSize(); i++) {
                var changeState = _Scheduler.readyQueue.dequeue();
                changeState.State = "Terminated";
                _Scheduler.readyQueue.enqueue(changeState);
            }
            _CPU.isExecuting = false;
            _StdOut.advanceLine();
            TSOS.Control.accessPCB(); 

        }

        //set rr quantum
        public shellQuantum(args) {
            if(args.length > 0) {
                var newQuant = _Scheduler.setQuantum(parseInt(args));
                console.log(_Scheduler.quantum + " quantum val");
                _StdOut.putText("New quantum set to: " + newQuant);
            }
            else {
                _StdOut.putText("Quantum not valid. Please enter an int.");
            }
        }

        public shellCreate(args) {
            if(!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
            }
            else if(args.length > 0){
                _DiskDrive.createFile(args[0]);
                _StdOut.putText("File created named: " + args[0]) 
            }
            else{
                _StdOut.putText("<Usage>: Please supply a file name");
            }
        }

        public shellRead(args) {
            if(!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
            }    
            else if(args.length > 0) {
                var filename = args[0];
                _DiskDrive.readFile(filename);
            }   
            else {
                console.log(args.length);
                _StdOut.putText("<Usage>: Please supply a file name");
            } 
        }

        public shellWrite(args) {
            if(!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
            } 
            else if (args.length >= 2) {
                var fileName = args[0];
                args.splice(0,1);
                //replaces , with a space when saving user input
                var fileInfo = args.join(' ');
                // console.log(fileInfo + " file info");
                // console.log(fileName + "name of file");
                _StdOut.putText("Writing to file ..");
                _StdOut.advanceLine();
                _DiskDrive.writeFile(fileName, fileInfo);
            }   
            else {
                _StdOut.putText("<Usage>: Please supply a file name and data in quotes");
 
            }    
        }

        public shellDelete(args) {
            if(!_formattedDisk) {
                _StdOut.putText("Must format disk before performing this operation");
            }   
            else if(args.length > 0) {
                var filename = args[0];
                _DiskDrive.deleteFile(filename);
            }   
            else {
                console.log(args.length);
                _StdOut.putText("<Usage>: Please supply a file name");
            }     
        }

        public shellFormat(args) {
            if(_CPU.isExecuting == true) {
                _StdOut.putText("Cannot format disk during execution");
            }
            else {
                _DiskDrive.format();
                TSOS.Control.updateDisk();
                _StdOut.putText("Disk formatted");
            }
        }

        public shellLs(args) {
            _StdOut.putText("Coming soon");
        }

        public shellSetschedule(args) {
            if(args.length > 0){
                if(args[0].toLowerCase() == 'rr') {
                    _Scheduler.setAlg('rr');
                    _StdOut.putText("Setting schedule to RR");
                }
                else if(args[0].toLowerCase() == 'priority') {
                    _Scheduler.setAlg('priority');
                    _StdOut.putText("Setting schedule to priority");
                }
                else if(args[0].toLowerCase() == 'fcfs') {
                    _Scheduler.setAlg('fcfs');
                    _StdOut.putText("Setting schedule to FCFS");
                }
                else{
                    _StdOut.putText("Please enter a valid schedule: [RR, Priority, FCFS].");
                }
            }
            else{
                _StdOut.putText("Please enter a valid schedule: [RR, Priority, FCFS].");
            }
        }

        public shellGetschedule(args) {
            _StdOut.putText("Scheduling algorithm is set to: " + _Scheduler.algorithm);
        }

        public shellMan(args) {
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

                    case"shutdown":
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
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
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
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        //my function to save the status and then print it
        public shellStatus(args) {
            if(args.length > 0) { 
                status = " ";
                var x = document.getElementById("divStatus");
                for(let i =0; i < args.length; i++) {
                    status += args[i] + " ";
                }
                x.innerHTML = "| Status " + status;

            }
            else {
                _StdOut.putText("Usage: status <string> Please supply a string.");
           }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
       }
        
    }
}
