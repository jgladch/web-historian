var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers");
var fs = require('fs');
// require more modules/folders here!


exports.handleRequest = function (req, res) {

  console.log("Serving request type " + req.method + " for url " + req.url);

  var statusCode = 404;

  if (req.method === 'GET') {
    fs.readFile(archive.paths.siteAssets+'/index.html', function(err, file){
      if (err) {
        console.log("ERROR! File is: "+file);
      }
      statusCode = 200;
      res.writeHead(statusCode, helpers.headers);
      res.write(file, 'utf8');
      res.end();
    });
  }
};
