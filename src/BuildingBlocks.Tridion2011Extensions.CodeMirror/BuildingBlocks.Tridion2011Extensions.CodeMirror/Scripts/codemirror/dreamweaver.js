(function () {
    function keywords(str) {
        var obj = {}, words = str.split(" ");
        for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
        return obj;
    }
    function heredoc(delim) {
        return function (stream, state) {
            if (stream.match(delim)) state.tokenize = null;
            else stream.skipToEnd();
            return "string";
        }
    }
    var dreamweaverConfig = {
        name: "dreamweaver",
        keywords: keywords("RenderComponentPresentation TemplateBeginIf TemplateEndIf TemplateBeginRepeat TemplateEndRepeat cond name"),
        blockKeywords: keywords("TemplateBeginIf TemplateEndIf TemplateBeginRepeat TemplateEndRepeat"),
        atoms: keywords(""),
        multiLineStrings: true,
        hooks: {

        }
    };

    CodeMirror.defineMode("dreamweaver", function (config, parserConfig) {
        var htmlMode = CodeMirror.getMode(config, { name: "xml", htmlMode: true });
        var jsMode = CodeMirror.getMode(config, "javascript");
        var cssMode = CodeMirror.getMode(config, "css");
        var dreamweaverMode = CodeMirror.getMode(config, dreamweaverConfig);

        function dispatch(stream, state) { // TODO open PHP inside text/css
            var isDreamweaver = state.mode == "dreamweaver";
            if (stream.sol() && state.pending != '"') state.pending = null;
            if (state.curMode == htmlMode) {
                if (stream.match(/^<\!--\s{0,1}\w*/)) {
                    state.curMode = dreamweaverMode;
                    state.curState = state.php;
                    state.curClose = "-->";
                    state.mode = "dreamweaver";
                    return "meta";
                }
                if (state.pending == '"') {
                    while (!stream.eol() && stream.next() != '"') { }
                    var style = "string";
                } else if (state.pending && stream.pos < state.pending.end) {
                    stream.pos = state.pending.end;
                    var style = state.pending.style;
                } else {
                    var style = htmlMode.token(stream, state.curState);
                }
                state.pending = null;
                var cur = stream.current();
                var openDreamweaver = cur.search(/<\!--/);
                if (openDreamweaver != -1) {
                    if (style == "string" && /\"$/.test(cur) && !/-->/.test(cur)) state.pending = '"';
                    else state.pending = { end: stream.pos, style: style };
                    stream.backUp(cur.length - openDreamweaver);
                } else if (style == "tag" && stream.current() == ">" && state.curState.context) {
                    if (/^script$/i.test(state.curState.context.tagName)) {
                        state.curMode = jsMode;
                        state.curState = jsMode.startState(htmlMode.indent(state.curState, ""));
                        state.curClose = /^<\/\s*script\s*>/i;
                        state.mode = "javascript";
                    }
                    else if (/^style$/i.test(state.curState.context.tagName)) {
                        state.curMode = cssMode;
                        state.curState = cssMode.startState(htmlMode.indent(state.curState, ""));
                        state.curClose = /^<\/\s*style\s*>/i;
                        state.mode = "css";
                    }
                }
                return style;
            } else if ((!isDreamweaver || state.php.tokenize == null) &&
                 stream.match(state.curClose, isDreamweaver)) {
                state.curMode = htmlMode;
                state.curState = state.html;
                state.curClose = null;
                state.mode = "html";
                if (isDreamweaver) return "meta";
                else return dispatch(stream, state);
            } else {
                return state.curMode.token(stream, state.curState);
            }
        }

        return {
            startState: function () {
                var html = htmlMode.startState();
                return { html: html,
                    dreamweaver: dreamweaverMode.startState(),
                    curMode: parserConfig.startOpen ? dreamweaverMode : htmlMode,
                    curState: parserConfig.startOpen ? dreamweaverMode.startState() : html,
                    curClose: parserConfig.startOpen ? /^\-->/ : null,
                    mode: parserConfig.startOpen ? "dreamweaver" : "html",
                    pending: null
                }
            },

            copyState: function (state) {
                var html = state.html;
                var htmlNew = CodeMirror.copyState(htmlMode, html);
                var dreamweaver = state.dreamweaver;
                var dreamweaverNew = CodeMirror.copyState(dreamweaverMode, dreamweaver);
                var cur;
                if (state.curState == html) cur = htmlNew;
                else if (state.curState == dreamweaver) cur = dreamweaverNew;
                else cur = CodeMirror.copyState(state.curMode, state.curState);
                return { html: htmlNew, dreamweaver: dreamweaverNew, curMode: state.curMode, curState: cur,
                    curClose: state.curClose, mode: state.mode,
                    pending: state.pending
                };
            },

            token: dispatch,

            indent: function (state, textAfter) {
                if ((state.curMode != dreamweaverMode && /^\s*<\//.test(textAfter)) ||
            (state.curMode == dreamweaverMode && /^\?>/.test(textAfter)))
                    return htmlMode.indent(state.html, textAfter);
                return state.curMode.indent(state.curState, textAfter);
            },

            electricChars: "/{}:"
        }
    }, "xml", "javascript", "css");
    CodeMirror.defineMIME("application/x-httpd-dreamweaver", "dreamweaver");
    CodeMirror.defineMIME("application/x-httpd-dreamweaver-open", { name: "dreamweaver", startOpen: true });
    CodeMirror.defineMIME("text/x-dreamweaver", dreamweaverConfig);
})();
