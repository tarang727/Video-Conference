var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// establish mongodb connection
var db = mongoose.connect('mongodb://127.0.0.1/gridFS');
var conn = mongoose.connection;
var path = require('path');
//require GridFS
var Grid = require('gridfs-stream');
// require filesystem module
var fs = require('fs');

// connect GridFS and Mongo
Grid.mongo = mongoose.mongo;

conn.once('open', function () {
	console.log('- Connection open - ');
	var gfs = Grid(conn.db);

	// write content from DB with
	// the given name 
	var fs_write_stream = fs.createWriteStream(path.join(__dirname, '../writeTo/video1back.mp4'));
	// create a read-stream from DB
	// finding the file using file name
	var readstream = gfs.createReadStream({
		filename: 'video1.mp4'
	});

	// pipe the read-stream in to the write stream
	readstream.pipe(fs_write_stream);

	fs_write_stream.on('close', function(){
		// display message if write successful
		console.log('file has been written to folder successfuly');

		db.disconnect();
	});
});