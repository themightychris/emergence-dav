var util = require('util')
    ,jsDAV = require('jsDAV')
    ,jsDAV_exceptions = require("jsDAV/lib/shared/exceptions")
    ,jsDAV_Exception_FileNotFound = jsDAV_exceptions.jsDAV_Exception_FileNotFound;

var eDAV_File = module.exports = function(tree, record, nodePath) {
	var me = this;
	
	me.tree = tree;
	me.record = record;
	me.path = nodePath;

	console.log('new file', me.path);
};

util.inherits(eDAV_File, jsDAV.jsDAV_Base);


eDAV_File.prototype.REGBASE = jsDAV.__INODE__ | jsDAV.__IFILE__	;

eDAV_File.prototype.getName = function() {
	console.log('file.getName'.green, util.inspect(arguments));

	return this.record.handle;
};

eDAV_File.prototype.setName = function(name, callback) {
	console.log('file.setName'.red, util.inspect(arguments));
};

eDAV_File.prototype.exists = function(callback) {
	console.log('file.exists'.yellow, util.inspect(arguments));
	callback(null, true); //TODO: implement?
};

eDAV_File.prototype.put = function(data, type, callback) {
	console.log('file.put'.red, util.inspect(arguments));
};

eDAV_File.prototype.get = function(callback) {
	console.log('file.get'.red, util.inspect(arguments));
};

eDAV_File.prototype.delete = function(callback) {
	console.log('file.delete'.red, util.inspect(arguments));
};

eDAV_File.prototype.getSize = function(callback) {
	console.log('file.getSize'.yellow, util.inspect(arguments));
	
	callback(null, this.record.size);
};

eDAV_File.prototype.getETag = function(callback) {
	console.log('file.getETag'.yellow, util.inspect(arguments));
	
	callback(null, this.record.sha1);
};

eDAV_File.prototype.getContentType = function(callback) {
	console.log('file.getContentType'.yellow, util.inspect(arguments));
	
	callback(null, this.record.mimeType);
};

eDAV_File.prototype.getLastModified = function(callback) {
	console.log('file.getLastModified'.yellow, util.inspect(arguments));
	
	callback(null, this.record.created);
};