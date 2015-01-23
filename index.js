/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Robert Krüger
*/
var path = require("path");
var fs = require("fs");
module.exports = function (indexContent) {
    this.cacheable && this.cacheable();

    var baseDirectory = path.dirname(this.resource);
    var subdirs = fs.readdirSync(baseDirectory).filter(function (file) {
        return fs.statSync(path.join(baseDirectory, file)).isDirectory();
    });

    //alls sub directories match to languages
    var resBundle = {},
        dirname, files;
    for (var i = 0, len = subdirs.length; i < len; i++) {
        //all files within the sub directory map to namespaces
        dirname = subdirs[i];
        resBundle[dirname] = {};
        //get sub files
        files = fs.readdirSync(path.join(baseDirectory, dirname)).filter(function (file) {
            return fs.statSync(path.join(baseDirectory, dirname, file)).isFile();
        });
        var filename, extname, basename, content;
        for (var j = 0, len2 = files.length; j < len2; j++) {
            filename = files[j];
            extname = path.extname(path.join(baseDirectory, dirname, filename));
            basename = path.basename(path.join(baseDirectory, dirname, filename), extname);
            content = fs.readFileSync(path.join(baseDirectory, dirname, filename));
            resBundle[dirname][basename] = JSON.parse(content);
        }
    }
    return "module.exports = " + JSON.stringify(resBundle);
}