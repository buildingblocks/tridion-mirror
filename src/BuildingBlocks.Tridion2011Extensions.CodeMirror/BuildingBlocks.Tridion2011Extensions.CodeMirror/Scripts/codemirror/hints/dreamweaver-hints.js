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

    function deramweaverHint(editor, keywords, getToken) {
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

    CodeMirror.dreamweaverHint = function (editor) {
        return deramweaverHint(editor, dreamweaverKeywords, function (e, cur) {
            return e.getTokenAt(cur);
        });
    }


    var dreamweaverKeywords = [];

    //@@ Expressions
    dreamweaverKeywords.push('@@');
    dreamweaverKeywords.push('@@Component.Description@@');
    dreamweaverKeywords.push('@@Component.ID@@');
    dreamweaverKeywords.push('@@Component.Schema.ID@@');
    dreamweaverKeywords.push('@@Component.Schema.Title@@');
    dreamweaverKeywords.push('@@Component.Title@@');
    dreamweaverKeywords.push('@@EXPRESSION@@');
    dreamweaverKeywords.push('@@Field@@');
    dreamweaverKeywords.push('@@Field.Name@@');
    dreamweaverKeywords.push('@@Field.Value@@');
    dreamweaverKeywords.push('@@GetBinaryInfo()@@');
    dreamweaverKeywords.push('@@GetFieldMetadata(FIELD_NAME, true|false)@@');
    dreamweaverKeywords.push('@@RenderComponentField(FIELD_PATH, POSITION)@@');
    dreamweaverKeywords.push('@@RenderComponentPresentation()@@');

    //${} Expressions
    dreamweaverKeywords.push('${');
    dreamweaverKeywords.push('${Component.Description}');
    dreamweaverKeywords.push('${Component.ID}');
    dreamweaverKeywords.push('${Component.Schema.ID}');
    dreamweaverKeywords.push('${Component.Schema.Title}');
    dreamweaverKeywords.push('${Component.Title}');
    dreamweaverKeywords.push('${EXPRESSION}');
    dreamweaverKeywords.push('${Field}');
    dreamweaverKeywords.push('${Field.Name}');
    dreamweaverKeywords.push('${Field.Value}');
    dreamweaverKeywords.push('${GetBinaryInfo()}');
    dreamweaverKeywords.push('${GetFieldMetadata(FIELD_NAME, true|false)}');
    dreamweaverKeywords.push('${RenderComponentField(FIELD_PATH, POSITION)}');
    dreamweaverKeywords.push('${RenderComponentPresentation()}');

    //Image Expressions
    dreamweaverKeywords.push('Bitmap image');
    dreamweaverKeywords.push('Gif image');
    dreamweaverKeywords.push('Jpeg image');

    dreamweaverKeywords.push('Component');
    dreamweaverKeywords.push('Component.Fields');
    dreamweaverKeywords.push('Component.Metadata');
    dreamweaverKeywords.push('Component.Metadata.Fields');
    dreamweaverKeywords.push('ComponentType');


    //Component Template Expressions
    dreamweaverKeywords.push('ComponentTemplate');

    //Field Expressions
    dreamweaverKeywords.push('Field.ContentType');
    dreamweaverKeywords.push('Field.Fields');
    dreamweaverKeywords.push('Field.Name');
    dreamweaverKeywords.push('FieldPath');
    dreamweaverKeywords.push('Field.Values');

    //Multimedia Expressions
    dreamweaverKeywords.push('Multimedia');
    dreamweaverKeywords.push('MultimediaTitle');

    //Page Expressions
    dreamweaverKeywords.push('Page');
    dreamweaverKeywords.push('Page.ID');
    dreamweaverKeywords.push('Page.Metadata');
    dreamweaverKeywords.push('Page.Metadata.Fields');
    dreamweaverKeywords.push('Page.Title');

    //Dreamweaver Expressions
    dreamweaverKeywords.push('<!-- TemplateBeginIf cond="BOOLEAN CONDITION" -->');
    dreamweaverKeywords.push('<!-- TemplateEndIf -->');
    dreamweaverKeywords.push('<!-- TemplateBeginIf cond="BOOLEAN CONDITION" -->CODE<!-- TemplateEndIf -->');
    dreamweaverKeywords.push('<!-- TemplateBeginRepeat name="ARRAY_NAME" -->');
    dreamweaverKeywords.push('<!-- TemplateBeginRepeat name="ARRAY_NAME" --><!-- TemplateEndRepeat -->');
    dreamweaverKeywords.push('<!-- TemplateEndRepeat -->');
    dreamweaverKeywords.push('<!-- TemplateParam name="Page" type="boolean" value="true" -->');
    dreamweaverKeywords.push('TemplateRepeatIndex');

    //Mime types
    dreamweaverKeywords.push('tridion/externallink');
    dreamweaverKeywords.push('tridion/field');
    dreamweaverKeywords.push('text/html');
    dreamweaverKeywords.push('tridion/itemlink');


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