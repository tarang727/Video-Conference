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

// where to find the video in the filesystem that will be stored in the DB
var videoPath = path.join(__dirname, '../readFrom/catvideo.mp4');

// connect GridFS and Mongo
Grid.mongo = mongoose.mongo;

conn.once('open', function () {
	console.log('- Connection open - ');
	var gfs = Grid(conn.db);

	// when connection is open, create write stream with
	// the name to store file as 'video1.mp4' in the DB 
	var writestream = gfs.createWriteStream({
		//will be stored in Mongo as 'video1.mp4'
		filename: 'video1.mp4'
	});
	// create a read-stream from where the video currently is (videoPath)
	// and pipe it into the database (through writestream)
	fs.createReadStream(videoPath).pipe(writestream);

	writestream.on('close', function(file){
		// do something with 'file'
		// console logging that it was written successfuly
		console.log(file.filename + ' written to DB');

		db.disconnect();
	});
});