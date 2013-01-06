var jsDAV = require('jsDAV')
    ,path = require('path')
    ,jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs")
    ,eDAV_Tree = require('../tree');

module.exports = function(done) {
	var app = this;
	
	
	require('emergence-kernel')(function(kernel) {
		jsDAV.debugMode = true
		jsDAV.createServer({
			tree: eDAV_Tree.new(kernel.config.get('directories:#COREFS'), 'emergence')
		}, 8000);
	});
	
	done();
};