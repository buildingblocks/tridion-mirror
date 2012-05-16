/*!
    Tridion Code Mirror Extension

    Copyright (C) 2012 Robert Stevenson-Leggett

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Version: 0.1
    Author: Robert Stevenson-Leggett
*/

Type.registerNamespace("Rob.Prototype.CodemirrorExtensions");

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror = function Rob$Prototype$CodemirrorExtensions$EnableCodemirror() {
    console.log('ctor');
    Type.enableInterface(this, "Rob.Prototype.CodemirrorExtensions.EnableCodeMirror");
    this.addInterface("Tridion.Cme.Command", ["EnableCodeMirror"]);
    this.HasExecuted = false;
    this.CodeArea = null;
};

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror.prototype.isAvailable = function EnableCodeMirror$isAvailable(selection) {
    console.log('is available');
    return true;
};

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror.prototype.isEnabled = function EnableCodeMirror$isEnabled(selection) {
    console.log('is enabled');
    return true;
};

Rob.Prototype.CodemirrorExtensions.EnableCodeMirror.prototype._execute = function EnableCodeMirror$_execute(selection) {

    if (this.HasExecuted) {
        this.CodeArea.toTextArea();
        this.HasExecuted = false;
        this.CodeArea = null;
        $('.EnableCodeMirror .text').textContent = 'Enable Code Mirror';
        return;
    }

    var codeArea = document.getElementById("SourceArea");

    this.CodeArea = CodeMirror.fromTextArea(codeArea, {
        lineNumbers: true,
        matchBrackets: true,
        mode: { name: "xml", htmlMode: true },
        indentUnit: 4,
        indentWithTabs: true,
        enterMode: "keep",
        tabMode: "shift",
        onChange: function (editor) {
            editor.save();
        }
    });

    $('.EnableCodeMirror .text').textContent  = 'Disable Code Mirror';
    this.HasExecuted = true;
};

