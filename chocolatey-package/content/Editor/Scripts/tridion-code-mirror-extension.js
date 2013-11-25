/*!
    Tridion Code Mirror Extension

    Copyright (C) 2013 Robert Stevenson-Leggett

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Version: 0.3
    Author: Robert Stevenson-Leggett
*/
"use strict";

Type.registerNamespace("BuildingBlocks.CodemirrorExtension");

BuildingBlocks.CodemirrorExtension.EnableCodeMirror = function BuildingBlocks$CodemirrorExtension$EnableCodemirror() {
    Type.enableInterface(this, "Rob.Prototype.CodemirrorExtensions.EnableCodeMirror");
    this.addInterface("Tridion.Cme.Command", ["EnableCodeMirror"]);

    this.HasExecuted = false;
    this.CodeArea = null;

    CodeMirror.defineMode("dreamweaver", function (config, parserConfig) {
        var dreamweaverOverlay = {
            token: function (stream, state) {
                var ch;
                if (stream.match("@@")) {
                    while ((ch = stream.next()) != null)
                        if (ch == "@" && stream.next() == "@") break;
                    return "dreamweaver";
                }
                if (stream.match("${")) {
                    while ((ch = stream.next()) != null)
                        if (ch == "}") break;
                    return "dreamweaver";
                }
                while (stream.next() != null && !stream.match("@@", false)) { }
                return null;
            }
        };
        return CodeMirror.overlayParser(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), dreamweaverOverlay);
    });

    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.simpleHint(cm, CodeMirror.dreamweaverHint);
    };

    this.TypeMap = {
        "RazorTemplate": "razor",
        "CSharpTemplate": "text/x-csharp",
        "DreamweaverTemplate": "dreamweaver",
        "JScript": "javascript",
		// This is the standard XSLT mediator
        "XSLT": "xml",
        "CompoundTemplate": "xml",
        "VBScript": "vbscript",
        "AssemblyTemplate": "",
		// This is the built in Xslt Mediator
		"XsltTemplate": "xml" 
    };
};

BuildingBlocks.CodemirrorExtension.EnableCodeMirror.prototype._isAvailable = function EnableCodeMirror$_isAvailable(selection) {
    // If you've got access to the item, you probably want this
    return $('#MasterTabControl .selected').id === 'SourceTab_switch';
};

BuildingBlocks.CodemirrorExtension.EnableCodeMirror.prototype._isEnabled = function EnableCodeMirror$_isEnabled(selection, undefined) {

    if (this.CodeArea) {
        var sourceTab = new Tridion.Cme.SourceTab($('#SourceTab'));
        var currentType = sourceTab.properties.controls.TemplateTypes.properties.selectedValue;
        var mode = this.TypeMap[currentType];
        if (mode === undefined) {
            alert("Mode not recognised by CodeMirror - defaulting to XML");
            mode = "xml";
        }
        this.CodeArea.setOption("mode", mode);
        console.log("changed mode to " + mode);
    }
    return true;
};

BuildingBlocks.CodemirrorExtension.EnableCodeMirror.prototype._execute = function EnableCodeMirror$_execute(selection) {
    if ($('#MasterTabControl .selected').id !== 'SourceTab_switch') {
        //TODO: How to make this work with the above methods..
        alert('Please switch to the Source tab to use Code Mirror features!');
        return;
    }

    if (this.HasExecuted) {
        this.CodeArea.toTextArea();
        this.HasExecuted = false;
        this.CodeArea = null;
        $('.EnableCodeMirror .text').textContent = 'Enable Code Mirror';
        $('#Wordwrap').disabled = false;
        return;
    }

    var sourceTab = new Tridion.Cme.SourceTab($('#SourceTab'));
    var currentType = sourceTab.properties.controls.TemplateTypes.properties.selectedValue;

    var mode = this.TypeMap[currentType];
    var codeArea = document.getElementById("SourceArea");

    this.CodeArea = CodeMirror.fromTextArea(codeArea, {
        lineNumbers: true,
        smartIndent: true,
        onChange: function (editor) {
            editor.save();
        },
        extraKeys: { "Ctrl-Space": "autocomplete" }
    });
    this.CodeArea.setOption("mode", mode);
    $('.EnableCodeMirror .text').textContent = 'Disable Code Mirror';
    $('#Wordwrap').disabled = true;
    this.HasExecuted = true;
};