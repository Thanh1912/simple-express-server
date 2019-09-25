var express = require('express');
var fs = require('fs');
var compress = require('compression');
var bodyParser = require('body-parser');

var app = express();
app.set('port', 9999);
app.use(bodyParser.json({ limit: '1mb' }));
app.use(compress());

app.use(function (req, res, next) {
    req.setTimeout(3600000)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,' + Object.keys(req.headers).join());

    if (req.method === 'OPTIONS') {
        res.write(':)');
        res.end();
    } else next();
});
var filePath = './files/';

function readFile(req, res) {
    var file = req.params.file;

    fs.readdir(filePath, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });

        fs.exists(filePath, function (exists) {
            if (exists) {
                res.writeHead(200, {
                    "Content-Type": "application/octet-stream",
                    "Content-Disposition": "attachment; filename=" + file
                });
                fs.createReadStream(filePath + file).pipe(res);
            } else {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("ERROR File does NOT Exists.ipa");
            }
        });

    });


}

app.get('/downloadfile/:file', function (req, res) {
    readFile(req, res)
});


app.get('/getall', function (req, res) {
    fs.readdir(filePath, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
        res.json({files: files });
    });
});



var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});