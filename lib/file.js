var util = require('util')
    ,crypto = require('crypto')
    ,jsDAV_Util = require("jsDAV/lib/shared/util")
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
		console.log('file.putStream'.yellow, this.path, type);
		
		if(handler.httpRequest.headers["x-file-size"]) {
			return callback(new Error('Cannot handle chunked uplead'));
		}
		
		// create a temporary file to recieve the stream until it is complete
		var me = this
		    ,req = handler.httpRequest
		    ,hasher = crypto.createHash('sha1')
		    ,contentLength = req.headers["content-length"]
		    ,lengthCount = 0
		    ,tmpPath = handler.server.tmpDir + "/" + jsDAV_Util.uuid()
		    ,writeStream = require('fs').createWriteStream(tmpPath, {
				encoding: type
			})
			,writeStreamError;
			
		writeStream.on('error', function(error) {
			writeStreamError = ex;
		});

		req.streambuffer.ondata(function(data) {
			lengthCount += data.length;
			writeStream.write(data);
			hasher.update(data);
		});
		
		req.streambuffer.onend(function() {
			if(writeStreamError) {
				return callback(writeStreamError);
			}
			
			if(lengthCount != contentLength) {
				writeStreamError = new Error('Content-Length header did not match received bytes');
				return _closeStream();
			}
			
			me.tree.fs.createFileFromTmp(
				{id: me.record.collectionId}
				,me.record.handle
				,tmpPath
				,hasher.digest('hex')
				,lengthCount
				,_closeStream
			);
			
			
			function _closeStream(error) {
				writeStream.on('close', function() {
					callback(writeStreamError || error);
				});
				
				writeStream.end();
			}
		});
	}

	,get: function(callback) {
		console.log('file.get'.red, util.inspect(arguments));
	}
	
	,getStream: function(start, end, callback) {
		console.log('file.getStream'.red, util.inspect(arguments));
		
		var stream = require('fs').createReadStream(
			this.tree.fs.getHashPath(this.record.sha1)
			,( typeof start == 'number' && typeof end == 'number' ) ? { start: start, end: end } : null
		);
		
		stream.on('data', function(data) {
			callback(null, data);
		});
		
		stream.on('error', function(error) {
			callback(error);
		});
		
		stream.on('end', function() {
			// Invoking the callback without error and data means that the callee
			// can continue handling the request.
			callback();
		});
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