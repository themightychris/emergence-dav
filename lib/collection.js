var util = require('util')
    ,path = require('path')
    ,flatiron = require('flatiron')
    ,eDAV_File = require('./file')
    ,jsDAV = require('jsDAV')
    ,jsDAV_exceptions = require("jsDAV/lib/shared/exceptions")
    ,jsDAV_Exception_FileNotFound = jsDAV_exceptions.jsDAV_Exception_FileNotFound;

var eDAV_Collection = module.exports = function(tree, record, nodePath) {
	var me = this;
	
	me.tree = tree;
	me.record = record;
	me.path = nodePath;

	console.log('instantiating collection', me.path);
};

util.inherits(eDAV_Collection, jsDAV.jsDAV_Base);


eDAV_Collection.prototype.REGBASE = jsDAV.__INODE__ | jsDAV.__ICOLLECTION__;

eDAV_Collection.prototype.getName = function() {
	console.log('collection.getName'.green, util.inspect(arguments));
	
	return this.record ? this.record.handle : '_root';
};

eDAV_Collection.prototype.setName = function(name, callback) {
	console.log('collection.setName'.red, util.inspect(arguments));
};

eDAV_Collection.prototype.exists = function(callback) {
	console.log('collection.exists'.yellow, util.inspect(arguments));
	callback(null, true); //TODO: implement?
};

eDAV_Collection.prototype.createFile = function(name, data, enc, callback) {
	console.log('collection.createFile'.yellow, this.record, name, data.length);
	
	this.tree.fs.createFile(this.record, name, data, callback);
};

eDAV_Collection.prototype.createDirectory = function(name, callback) {
	console.log('collection.createDirectory'.green, name, this.record);
	
	this.tree.fs.createCollection(this.record, name, callback);
};

eDAV_Collection.prototype.getChild = function(name, callback) {
	console.log('collection.getChild'.yellow, util.inspect(arguments));
	
	var me = this;
	
	me.tree.fs.getCollection(me.record, name, function(error, collection) {
		if(collection) {
			return callback(null, new eDAV_Collection(me.tree, collection, path.join(me.path, collection.handle)));
		}
		
		callback(); //TODO: check files
	});
};

eDAV_Collection.prototype.getChildren = function(callback) {
	console.log('collection.getChildren'.yellow, util.inspect(arguments));
	var children = []
		,me = this
		,tree = me.tree;


	flatiron.common.async.parallel({
		collections: function(next) {
			tree.fs.getCollectionsByParent(me.record, next);
		}
		,files: function(next) {
			tree.fs.getFilesByParent(me.record, next);
		}
	}, function(error, result) {
		if(error) {
			return callback(error);
		}
		
		callback(null,
			result.collections.map(function(collection) {
				return new eDAV_Collection(tree, collection, path.join(me.path, collection.handle));
			}).concat(
				result.files.map(function(file) {
					return new eDAV_File(tree, file, path.join(me.path, file.handle));
				})
			)
		);
	});
};

eDAV_Collection.prototype.delete = function(callback) {
	console.log('collection.delete'.green, util.inspect(arguments));
	
	this.tree.fs.deleteCollection(this.record, callback);
};

eDAV_Collection.prototype.getQuotaInfo = function(callback) {
	console.log('collection.getQuotaInfo'.red, util.inspect(arguments));
};

eDAV_Collection.prototype.getLastModified = function(callback) {
	console.log('collection.getLastModified'.yellow, util.inspect(arguments));
	
	callback(null, this.record ? this.record.created : new Date());
};