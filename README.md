A node script that takes crontab data and turns it into a more readable format, with upcoming tasks sorted by time.
By default it will display all tasks in the next 24 hours, so long as they appear less than 10 times. 

Dependencies:

- [https://github.com/harrisiirak/node-cron-parser](https://github.com/harrisiirak/node-cron-parser)
- [https://github.com/substack/node-optimist](https://github.com/substack/node-optimist)
- [https://github.com/felixge/node-dateformat](https://github.com/felixge/node-dateformat)

Setup:

	npm install optimist
	npm install cron-parser

Example usage:

	node app.js -f cronfile 
