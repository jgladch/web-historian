var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers");
var fs = require('fs');
// require more modules/folders here!

archive.readListOfUrls();

exports.handleRequest = function (req, res) {

  console.log("Serving request type " + req.method + " for url " + req.url);

  var statusCode = 404;

  if (req.method === 'GET') {
    //If request is coming for index
    if (req.url === '/index.html' || req.url === '/') {
      //Serve and send index
      fs.readFile(archive.paths.siteAssets+'/index.html', function(err, file){
        if (err) {
          console.log("ERROR! File is: "+file);
        }
        console.log(req.url);
        statusCode = 200;
        res.writeHead(statusCode, helpers.headers);
        res.end(file);
      });
    } else { //If req url isn't index

      urlName = req.url.slice(1)

      if (archive.isUrlInList(urlName)) {
        console.log("archived is true");
        fs.readFile(archive.paths.archivedSites+req.url, function(err, file){
          if (err) {
            console.log("ERROR! File is: "+file);
          }
          console.log("Trying to grab the archived file!");
          console.log(file);
          statusCode = 200;
          res.writeHead(statusCode, helpers.headers);
          res.end(file);
        });
      }
    }
    
  } else { //If req method isn't GET

  }

};
