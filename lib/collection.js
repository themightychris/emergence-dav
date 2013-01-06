var util = require('util')
    ,path = require('path')
    ,flatiron = require('flatiron')
    ,eDAV_File = require('./file')
    ,jsDAV_Directory = require("jsDAV/lib/DAV/directory")
    ,jsDAV_exceptions = require("jsDAV/lib/shared/exceptions")
    ,jsDAV_Exception_FileNotFound = jsDAV_exceptions.jsDAV_Exception_FileNotFound;

var eDAV_Collection = module.exports = jsDAV_Directory.extend({
	initialize: function(tree, record, nodePath) {
		this.tree = tree;
		this.record = record;
		this.path = nodePath;
	
		console.log('instantiating collection', this.path);
	}

	,getName: function() {
		console.log('collection.getName'.green, util.inspect(arguments));
		
		return this.record ? this.record.handle : '_root';
	}
	
	,setName: function(name, callback) {
		console.log('collection.setName'.red, util.inspect(arguments));
	}
	
	,exists: function(callback) {
		console.log('collection.exists'.yellow, util.inspect(arguments));
		callback(null, true); //TODO: implement?
	}
	
	,createFile: function(name, data, enc, callback) {
		console.log('collection.createFile'.yellow, this.record, name, data.length);
		
		this.tree.fs.createFileFromData(this.record, name, data, callback);
	}
	
	,createDirectory: function(name, callback) {
		console.log('collection.createDirectory'.green, name, this.record);
		
		var me = this;
		
		me.tree.fs.createCollection(me.record, name, function(error, collection) {
			console.log('createCollection.callback'.green, error, collection);
			
			if(error) {
				return callback(error);
			}
			
			callback(null, [eDAV_Collection.new(me.tree, collection, path.join(me.path, collection.handle))]);
		});
	}
	
	,getChild: function(name, callback) {
		console.log('collection.getChild'.yellow, util.inspect(arguments));
		
		var me = this;
		
		me.tree.fs.getCollection(me.record, name, function(error, collection) {
			if(error) {
				return callback(error);
			}
			
			if(collection && collection.status != "normal") {
				return callback(null, eDAV_Collection.new(me.tree, collection, path.join(me.path, collection.handle)));
			}
			
			callback(); //TODO: check files
		});
	}
	
	,getChildren: function(callback) {
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
					return eDAV_Collection.new(tree, collection, path.join(me.path, collection.handle));
				}).concat(
					result.files.map(function(file) {
						return eDAV_File.new(tree, file, path.join(me.path, file.handle));
					})
				)
			);
		});
	}
	
	,delete: function(callback) {
		console.log('collection.delete'.green, util.inspect(arguments));
		
		this.tree.fs.deleteCollection(this.record, callback);
	}
	
	,getQuotaInfo: function(callback) {
		console.log('collection.getQuotaInfo'.red, util.inspect(arguments));
	}
	
	,getLastModified: function(callback) {
		console.log('collection.getLastModified'.yellow, util.inspect(arguments));
		
		callback(null, this.record ? this.record.created : new Date());
	}
});