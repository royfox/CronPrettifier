#!/bin/bash
CONTENT=`crontab -l`
node app.js -c "$CONTENT" $@
