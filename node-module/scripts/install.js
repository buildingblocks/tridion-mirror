// Simple Install Script for the CodeMirrorTridion Node Module
// Basically just calls powershell
var spawn = require("child_process").spawn,child;
child = spawn("powershell.exe",[".\\lib\\install.ps1 -name CodeMirror"]);
child.stdout.on("data",function(data){
    console.log("" + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
    console.log("Powershell Script finished");
});
