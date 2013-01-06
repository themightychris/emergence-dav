"use strict";

var util = require('util')
    ,efs = require('emergence-fs')
    ,eDAV_Collection = require('./collection')
    ,eDAV_File = require('./file')
    ,jsDAV_Tree = require("jsDAV/lib/DAV/tree")
    ,jsDAV_exceptions = require("jsDAV/lib/shared/exceptions")
    ,jsDAV_Exception_FileNotFound = jsDAV_exceptions.jsDAV_Exception_FileNotFound;

var eDAV_Tree = module.exports = jsDAV_Tree.extend({
    initialize: function(diskPath, dbName) {
		var me = this;
	
		efs.openFs(diskPath, dbName, function(fsError, fs) {
			if(fsError) {
				throw 'failed to open fs: '+fsError.message;
			}
	
			console.log('got fs'.green);
			me.fs = fs;
		});
	}
	
	,getNodeForPath: function(path, callback) {
		var me = this;
		
		console.log('getNodeForPath'.yellow, path);
	
		path = efs.parsePath(path);
	
		if(path.length == 0) {
			// root collection
			return callback(null, eDAV_Collection.new(this));
		}
		
		me.fs.getNodeByPath(path, function(error, node) {
			console.log('got node for path', path, node);
			if(!node) {
				return callback(new jsDAV_Exception_FileNotFound('No node found at path'));
			}
			
			if(node.type == 'collection') {
				return callback(null, eDAV_Collection.new(me, node, path.join('/')))
			}
			
			// TODO: implement file response
		});
		
		//return callback(new jsDAV_Exception_FileNotFound('File at "'+path+'" not found'));
	}
	
	
	/* not standard? */
	,getRealPath: function(path) {
		console.log('tree.getRealPath'.red, util.inspect(arguments));
	}
	
	,copy: function(source, destination, callback) {
		console.log('tree.copy'.red, util.inspect(arguments));
	}
	
	,realCopy: function(source, destination, callback) {
		console.log('tree.realCopy'.red, util.inspect(arguments));
	}
	
	,move: function(source, destination, callback) {
		console.log('tree.move'.red, util.inspect(arguments));
	
		this.fs.movePath(source, destination, callback);
	}
});