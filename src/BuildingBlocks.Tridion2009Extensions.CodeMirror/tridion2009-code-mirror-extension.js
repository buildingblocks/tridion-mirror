/*!
    Tridion 2009 Code Mirror Extension

    Copyright (C) 2012 Building Blocks

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	Dependencies: jQuery GUI Extension https://yoavniran.wordpress.com/2010/08/07/using-jquery-for-tridion-gui-extensions/
    Version: 0.1
    Author: Robert Stevenson-Leggett
*/

/* Add our stylesheet */ 
if(document.createStyleSheet) {
  document.createStyleSheet('/Extensions/CodeMirror/codemirror.css');
}
else {
  var styles = "@import url(' /Extensions/CodeMirror/codemirror.css ');";
  var newSS=document.createElement('link');
  newSS.rel='stylesheet';
  newSS.href='data:text/css,'+escape(styles);
  document.getElementsByTagName("head")[0].appendChild(newSS);
}

/* Add the dreamweaver mode */
CodeMirror.defineMode("dreamweaver", function (config, parserConfig) {
	var dreamweaverOverlay = {
		token: function (stream, state) {
			var ch;
			if (stream.match("@@")) {
				while ((ch = stream.next()) != null)
					if (ch == "@" && stream.next() == "@") break;
				return "dreamweaver";
			}
			while (stream.next() != null && !stream.match("@@", false)) { }
			return null;
		}
	};
	return CodeMirror.overlayParser(CodeMirror.getMode(config, parserConfig.backdrop || "text/html"), dreamweaverOverlay);
});

/* jQuery init */
$j(function() {
	/* Called on tab switch */
	var enableCodeMirror = function (undefined){
		if(CodeMirror._codeArea === undefined)
		{
			var sourceArea = $j('.SourceEditor');
			var codeArea = CodeMirror.fromTextArea(sourceArea.get(0), {
				lineNumbers: true,
				mode: { name: "dreamweaver", htmlMode: true },
				smartIndent: true,
				onChange: function (editor) {
					editor.save();
				}
			});
			CodeMirror._codeArea = codeArea;
		}
	};

	/* Fire when the Source tab is clicked */
	$j('nobr:contains(Source)').click(function() { 
		enableCodeMirror();
	});	
});


