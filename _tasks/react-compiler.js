require("babel-register")({presets: ["es2015", "react"]});

const
    Buffer = require('buffer').Buffer,
    through = require('through2'),
    React = require('react'),
    ReactDOM = require('react-dom/server'),
    jsdom = require('jsdom'),
    asyncReplace = require('async-replace');


function CompilePlugin(file, encoding, done) {
    // Pass file through if:
    // - file has no contents
    // - file is a directory
    if (file.isNull() || file.isDirectory()) {
        this.push(file);
        return callback();
    }

    var regex = /<body[^>]*>([\n\r\s\S]*)<\/body>/igm;

    asyncReplace(file.contents.toString("utf8"), regex, (match,p1,offset,string,replaced) => {
        jsdom.env(p1,[],(err, window) => {
            [].slice.call(window.document.querySelectorAll('[data-compileReact]')).forEach((element) => {
                const
                    ComponentFile = element.getAttribute('data-compileReact'),
                    Component = require('../src/js/Components/'+ComponentFile);

                element.innerHTML = ReactDOM.renderToString(React.createElement(Component));
                element.removeAttribute('data-compileReact');

                delete require.cache[require.resolve('../src/js/Components/'+ComponentFile)];
            });

            replaced(null, window.document.body.innerHTML);
        });
    }, (err, result) => {
        file.contents = new Buffer(result, "utf8");
        done(null, file);
    });
}

function gulpPlugin(){
    return through.obj(CompilePlugin);
}

module.exports = gulpPlugin;
