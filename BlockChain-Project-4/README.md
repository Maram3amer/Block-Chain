# Project #4. Build a Private Blockchain Notary Service

This is Project 4, In this project, I i have built a Star Registry Service that allows users to claim ownership of their favorite star in the night sky.


## Setup project for Review.

To setup the project for review do the following:
1. Download or Clone the project.
2. Run command __npm install --save__ to install dependency in the package.json.

## Testing the project

1. Run command __node app.js__ to run the server.

## There Are 5 REST API that allows users to interact with the application 

1. API allow users to submit a validation request. 

```bash
http://localhost:3000/requestValidation
```

2. API allow users to validate the request.

```bash
http://localhost:3000/message-signature/validate
```

3. API will create a new block with encode and decode the star data.

```bash
http://localhost:3000/block
```

4. API will allow lookup of Stars by hash, 

```bash
http://localhost:3000/stars/hash:[HASH]
```

5. API will allow lookup of Stars by wallet address, 

```bash
http://localhost:3000/stars/address:[ADDRESS]
```

6. API will allow lookup of Stars by height, 

```bash
http://localhost:3000/block/[HEIGHT]
```

