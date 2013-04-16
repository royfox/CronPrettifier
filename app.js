var 
	parser = require('cron-parser'),
	fs  = require("fs"),   
	dateFormat = require('./dateformat') 
	argv = require('optimist')
        .demand('f')
        .alias('f', 'file')
		.describe('f', 'Load a file')
        .default('threshold', 10)
        .alias('t', 'threshold')
		.describe('threshold', 'Tasks that appear more often than the threshold will be excluded')
		.default('days', 1)
		.describe('days','Number of days to display')
        .argv;

var 
	keys = {},
	lastComment = null;
	endDate = new Date();

endDate.setDate(endDate.getDate() + argv.days) //endDate should now be argv.days ahead of the current date

var options = {
  currentDate: new Date(),
  endDate: endDate
};

/**
  * Run through each of the file, and if it looks like a CRON task, try and parse it
  * If it looks like a comment, save it and attach it to the next cron task
  * Ignore lines that are just whitespace
  */
fs.readFileSync(argv.file).toString().split('\n').forEach(function (line) { 
    if(line.indexOf("#") !== -1){
		//comment
    	lastComment = line.replace("#", "");
    } else if(line.replace(/^\s\s*/, '').replace(/\s\s*$/, '').length == 0){
    	//ignore whitespace lines
    } else {
    	//cron task
		var pieces = line.split(/\s+/g);
		var cronPieces = [];
		var expressionPieces = [];

		for(var i in pieces){
			if(i < 5){
				cronPieces.push(pieces[i]);
			} else {
				expressionPieces.push(pieces[i]);
			}
		}
		parse(cronPieces.join(" "), expressionPieces.join(" "), lastComment);
		lastComment = null;
    }
});


/**
 * @param string cronTime A cron string, of the form '* * * * *'
 * @param string cronTask The expression to be executed
 * @param string comment A comment about the task
 */
function parse(cronTime, cronTask, comment){
	parser.parseExpression(cronTime, options, function(err, interval) {
	  if (err) {
	    console.log('Error: ' + err.message);
	    return;
	  }
	  while (true) {
	    try {
			if(!keys[cronTask]){
				keys[cronTask] = [];
			}
			keys[cronTask].push({
				'time': interval.next(),
				'task': cronTask,
				'comment': comment
			});
	    } catch (e) {
	        break;
	    }
	  }
	});
}


//ignore events that occur more often than the threshold
//stick the rest in a single array
var events = [];
for(var index in keys){
	if(keys[index].length < argv.threshold){
		events = events.concat(keys[index]);
	}
}

//sort by time
events.sort(function(a, b){
	return a.time.getTime() - b.time.getTime();
});

for(var index in events){
	console.log(dateFormat(events[index].time, "ddd h:MM TT") + ': ' + events[index].comment + ' | (' + events[index].task + ')');
}
