var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers");
var fs = require('fs');
// require more modules/folders here!

archive.readListOfUrls();

var serveFile = function(req, res, path) {
  fs.readFile(path, function(err, data){
    if (err) {console.log("Error in serveFile")}
    res.writeHead(200, helpers.headers);
    res.end(data);
  });
}

var actions = {

  'GET': function(req, res){
    if (req.url === '/index.html' || req.url === '/') {
      var path = archive.paths.siteAssets+'/index.html'
      serveFile(req, res, path);
    } else { //If req.url isn't index
      site = req.url.slice(1)
      if (archive.isUrlInList(site)) { //If the site is already archived
        var path = archive.paths.archivedSites+req.url;
        serveFile(req, res, path);
      }
    }
  },

  'POST': function(req, res){
    var body = '';

    req.on('data', function(data){
      body += data;
    });

    req.on('end', function(){
      console.log(body.slice(4));
    });

    statusCode = 201;
    res.writeHead(statusCode, headers);
    res.end();
  },

  'OPTIONS': function(req, res){
    
  }
};

exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  var action = actions[req.method];
  action(req, res);

};
