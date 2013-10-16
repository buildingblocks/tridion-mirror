xcopy $(ProjectDir)CodeMirrorExtension.config C:\Extensions\CodeMirrorExtension\ /y
xcopy $(ProjectDir)Scripts\*.js C:\Extensions\CodeMirrorExtension\Scripts\ /ys
xcopy $(ProjectDir)CSS\*.css C:\Extensions\CodeMirrorExtension\CSS\ /ys
xcopy $(ProjectDir)CSS\icon\*.png C:\Extensions\CodeMirrorExtension\CSS\icon\ /ys