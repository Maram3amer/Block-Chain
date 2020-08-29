# Project #3. Connect Private Blockchain to Front-End Client via APIs

This is Project 3, Connect Private Blockchain to Front-End Client via APIs, in this project I created RESTful API using a Hapi.js framework that will interface with the private blockchain 

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm init__ to generate package.json for you
3. Run command __npm install --save hapi__ to install the latest version of hapi as a dependency in your package.json.

## Testing the project

1. Run command __node app.js__ to run the server and that will create 10 blocks for testing purpose.
2. Open PostMan and put http://localhost:3000/block/0 in the URL and choose GET -> that will get the block with index 0 as JSON format.
3. To post a new block put in the URL http://localhost:3000/block and choose POST, type in the body {"body":"Testing block with test string data"} -> that will response the block object in JSON format.
