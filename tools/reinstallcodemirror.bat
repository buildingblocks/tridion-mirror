@echo off
xcopy \\tsclient\C\Projects\tridion-mirror\src\BuildingBlocks.Tridion2009Extensions.CodeMirror\*.* C:\CodeMirrorTemp\ /ysi
call "c:\Program Files\7-Zip\7z" a -r codemirror.zip C:\CodeMirrorTemp\*.*
call "C:\Program Files\Tridion\bin\TCMExtensionInstaller" -remove CodeMirror
call "C:\Program Files\Tridion\bin\TCMExtensionInstaller" -add C:\codemirror.zip
del codemirror.zip