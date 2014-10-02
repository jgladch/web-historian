var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers");
var fs = require('fs');
// require more modules/folders here!

archive.readListOfUrls();

var serveFile = function(req, res, path, status) {
  var status = status || 200;
  fs.readFile(path, function(err, data){
    if (err) {console.log(data); console.log("Error in serveFile")}
    res.writeHead(status, helpers.headers);
    res.end(data);
  });
};

var redirect = function(req, res, path) {
  headers = helpers.headers;
  // headers['Location'] = path;
  res.writeHead(302, headers);
  console.log("Path in redirect: "+path);
  res.end(path);
};

var actions = {

  'GET': function(req, res){
    if (req.url === '/index.html' || req.url === '/') {
      var path = archive.paths.siteAssets+'/index.html'
      serveFile(req, res, path);
    } else { //If req.url isn't index
      site = req.url.slice(1)
      if (archive.isUrlInList(site)) { //If the site is already archived
        var path = archive.paths.archivedSites+req.url;
        console.log(path);
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
      //Parse the POST request for just the website name
      url = body.slice(4);
      path = archive.paths.archivedSites+'/'+url;
      if (archive.isUrlInList(url)) {
        serveFile(req, res, path);
      } else {
        archive.addUrlToList(url);
        path = archive.paths.siteAssets+'/loading.html';
        console.log("path in POST parser: "+path);
        //This part isn't working now
        serveFile(req, res, path, 302);
      }
    });

    // statusCode = 201;
    // res.writeHead(statusCode, headers);
    // res.end();
  },

  'OPTIONS': function(req, res){
    
  }
};

exports.handleRequest = function (req, res) {
  console.log("Serving request type " + req.method + " for url " + req.url);

  var action = actions[req.method];
  action(req, res);

};
