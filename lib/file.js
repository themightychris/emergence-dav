var util = require('util')
    ,jsDAV_File = require("jsDAV/lib/DAV/file")
    ,jsDAV_exceptions = require("jsDAV/lib/shared/exceptions")
    ,jsDAV_Exception_FileNotFound = jsDAV_exceptions.jsDAV_Exception_FileNotFound;

var eDAV_File = module.exports = jsDAV_File.extend({
	initialize: function(tree, record, nodePath) {
		this.tree = tree;
		this.record = record;
		this.path = nodePath;
	
		console.log('instantiating file', this.path);
	}

	,getName: function() {
		console.log('file.getName'.green, util.inspect(arguments));
	
		return this.record.handle;
	}
	
	,setName: function(name, callback) {
		console.log('file.setName'.red, util.inspect(arguments));
	}
	
	,exists: function(callback) {
		console.log('file.exists'.yellow, util.inspect(arguments));
		callback(null, true); //TODO: implement?
	}
	
	,put: function(data, type, callback) {
		console.log('file.put'.red, util.inspect(arguments));
	}
	
	,putStream: function(handler, type, callback) {
		console.log('file.putStream'.red, util.inspect(arguments));
	}

	,get: function(callback) {
		console.log('file.get'.red, util.inspect(arguments));
	}
	
	,getStream: function(start, end, callback) {
		console.log('file.getStream'.red, util.inspect(arguments));
	}
	
	,delete: function(callback) {
		console.log('file.delete'.red, util.inspect(arguments));
	}
	
	,getSize: function(callback) {
		console.log('file.getSize'.yellow, util.inspect(this.record.size));
		
		callback(null, this.record.size);
	}
	
	,getETag: function(callback) {
		console.log('file.getETag'.yellow, util.inspect(this.record.sha1));
		
		callback(null, this.record.sha1);
	}
	
	,getContentType: function(callback) {
		console.log('file.getContentType'.yellow, util.inspect(this.record.mimeType));
		
		callback(null, this.record.mimeType);
	}
	
	,getLastModified: function(callback) {
		console.log('file.getLastModified'.yellow, util.inspect(this.record.created));
		
		callback(null, this.record.created);
	}
});