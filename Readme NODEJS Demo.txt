This demo shows how a persistent client works from a Node.js script.
This demo was tested in Linux and Windows Node.js v.10.13.0

You can find all files needed to run the demo inside the "NODEJS" folder .
- LinkarClientJS.js
- linkarClib.js
- package.json

Demo uses "LinkarClientJS.js" in order to connect with the appropiate library: "LinkarClientC.dll" or "libLinkarClientC.so" according to the operating system.
You can find the "LinkarClientJS.js" original file inside "Clients\NODEJS" folder.
There is a copy of "LinkarClientJS.js" ready for working with the libraries inside "Clients" folder.
You must verify that the paths to the C libraries are correct:
class LinkarClient {
   constructor() {
	   // Here you must put corrects path names to the Linkar C library
       var library = (process.platform === 'linux'?'../../Clients/Clib/x64/libLinkarClientC':'../../Clients/Clib/x64/LinkarClientC');


You also have to edit "linkarClib.js" file and adjust the parameters in order to login to Linkar:
////////////////
// LkLogin
////////////////
logger.info("LkLogin")
logger.info("--------")
var crdOpt = linkar_client.LkCreateCredentialOptions(
		"linkarserver",		// Linkar Server IP or Hostname
		"EP_NAME",			// EntryPoint Name
		11300,				// Linkar Server EntryPoint port
		"admin",			// Linkar Server Username
		"admin",			// Linkar Server Username Password
		"",					// Language
		"Test Node.js")		// Free text

"LkLogger.js" is used to print the result in console.
The "package.json" file containts the dependencies of the project.
For the "ffi" module" you mus install "git"

From Node.js console, resolve the dependencies with the command:
npm install

And run the demo from Node.js console with next command:
node linkarClib.js

Latest updates and Source code on https://github.com/kosday/Linkar-v2-with-node.JS