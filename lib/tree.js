"use strict";

var util = require('util')
    ,efs = require('emergence-fs')
    ,eDAV_Collection = require('./collection')
    ,eDAV_File = require('./file')
    ,jsDAV = require('jsDAV')
    ,jsDAV_exceptions = require("jsDAV/lib/shared/exceptions")
    ,jsDAV_Exception_FileNotFound = jsDAV_exceptions.jsDAV_Exception_FileNotFound;

var eDAV_Tree = module.exports = function(diskPath, dbName) {
	var me = this;

	efs.openFs(diskPath, dbName, function(fsError, fs) {
		if(fsError) {
			throw 'failed to open fs: '+fsError.message;
		}

		console.log('got fs'.green);
		me.fs = fs;
	});
};

util.inherits(eDAV_Tree, jsDAV.jsDAV_Base);


eDAV_Tree.prototype.REGBASE = jsDAV.__TREE__;

eDAV_Tree.prototype.getNodeForPath = function(path, callback) {
	var me = this;
	
	console.log('getNodeForPath'.yellow, util.inspect(path));

	path = efs.parsePath(path);

	if(path.length == 0) {
		// root collection
		return callback(null, new eDAV_Collection(this));
	}
	
	me.fs.getNodeByPath(path, function(error, node) {
		console.log('got node for path', path, node ? node.path : null);
		if(!node) {
			return callback(new jsDAV_Exception_FileNotFound('No node found at path'));
		}
		
		if(node.type == 'collection') {
			return callback(null, new eDAV_Collection(me, node, path.join('/')))
		}
	});
	
	//return callback(new jsDAV_Exception_FileNotFound('File at "'+path+'" not found'));
};


/* not standard? */
eDAV_Tree.prototype.getRealPath = function(path) {
	console.log('tree.getRealPath'.red, util.inspect(arguments));
};

eDAV_Tree.prototype.copy = function(source, destination, callback) {
	console.log('tree.copy'.red, util.inspect(arguments));
};

eDAV_Tree.prototype.realCopy = function(source, destination, callback) {
	console.log('tree.realCopy'.red, util.inspect(arguments));
};

eDAV_Tree.prototype.move = function(source, destination, callback) {
	console.log('tree.move'.red, util.inspect(arguments));

	this.fs.movePath(source, destination, callback);
};
