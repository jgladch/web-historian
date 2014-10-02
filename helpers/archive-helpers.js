var fs = require('fs');
var path = require('path');
var request = require('request');
var http = require('http-request');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

var sitesInList = [];

var saveSiteList = function() {
  var stringified = JSON.stringify(sitesInList);
  fs.writeFile(exports.paths.list, stringified, function(err){
    if (err) {return;}
  });
};

exports.readListOfUrls = function(){
  fs.readFile(exports.paths.list, function(err, data) {
    if(err) {console.log("readListOfUrls is broken!! data: "+data)};
    sitesInList = JSON.parse(data.toString());
    console.log("current sites listed: ");
    console.log(sitesInList);
  });
};

exports.isUrlInList = function(site){
  var result = _.contains(sitesInList, site); 
  console.log("Is URL in list result: "+result);
  return result;
};

exports.addUrlToList = function(url){
  sitesInList.push(url);
  saveSiteList();
};

exports.isURLArchived = function(url){
  fs.open(exports.paths.archivedSites+'/'+url, function(err, fd){
    if (err) {
      return false;
    } else {
      return true;
    }
  });
};

exports.downloadUrl = function(url) {
  console.log("downloadurl: "+url);
  http.get(url, function (err, res) {
    if (!err) {
      console.log(res.buffer.toString());
      var html = res.buffer.toString();
      fs.writeFile(exports.paths.archivedSites+'/'+url, html, function(err){
        if (err) {console.log("Error writing archive file");}
      });
    } else {
      console.log("Error in htmlfetcher!");
      console.log(error);
    }
  });
};

exports.downloadUrls = function() {
  for (var i = 0; i < sitesInList.length; i++) {
    sitesInList[i] = url;
    console.log("downloadurl: "+url);
    http.get(url, function (err, res) {
      if (!err) {
        console.log(res.buffer.toString());
        var html = res.buffer.toString();
        fs.writeFile(exports.paths.archivedSites+'/'+url, html, function(err){
          if (err) {console.log("Error writing archive file");}
        });
      } else {
        console.log("Error in htmlfetcher!");
        console.log(error);
      }
    });
  }
};
