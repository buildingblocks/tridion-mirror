(function () {
    function forEach(arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    }

    function arrayContains(arr, item) {
        if (!Array.prototype.indexOf) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        }
        return arr.indexOf(item) != -1;
    }

    function razorHint(editor, keywords, getToken) {
        // Find the token at the cursor
        var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;

        // If it's not a 'word-style' token, ignore the token.
        if (!/^[\w$_@\$\(\)\."]*$/.test(token.string)) {
            token = tprop = { start: cur.ch, end: cur.ch, string: "", state: token.state,
                className: token.string == "." ? "property" : null
            };
        }


        // If it is a property, find out what it is a property of.        
        while (tprop.className == "property") {
            tprop = getToken(editor, { line: cur.line, ch: tprop.start });
            //if (tprop.string != ".") return;
            tprop = getToken(editor, { line: cur.line, ch: tprop.start });
            if (tprop.string == ')') {
                var level = 1;
                do {
                    tprop = getToken(editor, { line: cur.line, ch: tprop.start });
                    switch (tprop.string) {
                        case ')': level++; break;
                        case '(': level--; break;
                        default: break;
                    }
                } while (level > 0)
                tprop = getToken(editor, { line: cur.line, ch: tprop.start });
                if (tprop.className == 'variable')
                    tprop.className = 'function';
                else return; // no clue
            }
            if (!context) var context = [];
            context.push(tprop);
        }
        return {
            list: getCompletions(token, context, keywords),
            from: {
                line: cur.line,
                ch: token.start
            },
            to: {
                line: cur.line,
                ch: token.end
            }
        };
    }

    CodeMirror.razorHint = function(editor) {
        return razorHint(editor, razorKeywords, function(e, cur) {
            return e.getTokenAt(cur);
        });
    };

    var razorKeywords = [];

    //@ Expressions
    razorKeywords.push('@Fields.');
	razorKeywords.push('@Metadata.');
	razorKeywords.push('@foreach (var cp in ComponentPresentations)');
	razorKeywords.push('@if (');
	razorKeywords.push('@(Fields.');
	razorKeywords.push('@(Metadata.');
    
    //Model variables
	razorKeywords.push('ComponentPresentations');
    
    function getCompletions(token, context, keywords) {
        var found = [], start = token.string;
        function maybeAdd(str) {
            if (str.indexOf(start) >= 0 && !arrayContains(found, str)) found.push(str);
        }

        if (!context) {
            for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
            //gatherCompletions(window);
            forEach(keywords, maybeAdd);
        }
        return found;
    }
})();