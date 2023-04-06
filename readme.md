## ECDSA Node

This is my updated version of the "ECDSA Node" project that includes:
* Using Ethereum style wallet addresses
* Signing a send transaction and verifying the signature on the server


### Private Keys and Wallet Addresses for Testing
private key 98c9cc2d81a4efe65d0bc6e1c32529da9f640405d8eef46c30fb501c45cc925c  
wallet addr d4977ab47942b129ce01a9d759fe0dba74aec24d  
  
private key 28466e5578ce702e3f40b9d286035486ec8e633742466bc3812097b4b401a949  
wallet addr b033ee21dc616aeadf6c21f66552c273f02e3637  
  
private key 2fb0789489809439a93d6d8baaa92c44ce846efcc8b8b691f02d7b72560702a7  
wallet addr 4822b0370aa8f211e7558b9a881f9b19a8cff8ed  
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
