# Linkar with node.JS

Esta demo muestra el funcionamiento de un cliente persistente desde un script Node.js
Esta demo ha sido probada en Linux y Windows Node.js v.10.13.0

Dentro de la carpeta "NODEJS" puede encontrar todos los ficheros necesarios para ejecutar la demo.
- LinkarClientJS.js
- linkarClib.js
- LkLogger.js
- package.json

Esta demo usa "LinkarClientJS.js" para conectarse con la librearía adecuada: "LinkarClientC.dll" o "libLinkarClientC.so", según el sistema operativo.
Puede encontrar el archivo original "LinkarClientJS.js" dentro de la carpeta "Clients\NODEJS"
Con esta demo, hay una copia de "LinkarClientJS.js", lista para trabajar con las librerías dentro de la carpeta "Clients"
Pero asegurese de que el "path" a las librerías C es correcto:
class LinkarClient {
   constructor() {
	   // Here you must put the corrects path names to the Linkar C library
       var library = (process.platform === 'linux'?'../../Clients/Clib/x64/libLinkarClientC':'../../Clients/Clib/x64/LinkarClientC');


También debe editar el archivo "linkarClib.js" y establecer los parámetros de conexión con Linkar:

////////////////
// LkLogin
////////////////

logger.info("LkLogin")
logger.info("--------")
var crdOpt = linkar_client.LkCreateCredentialOptions(
		"linkarserver",			// Linkar Server IP or Hostname
		"EP_NAME",			// EntryPoint Name
		11300,				// Linkar Server EntryPoint port
		"admin",			// Linkar Server Username
		"admin",			// Linkar Server Username Password
		"",				// Language
		"Test Node.js")		// Free text

"LkLogger.js" se usa para mostrar los resultados en la consola´.
Y el archivo "package.json" contiene las dependencias del proyecto demo.

Para ejecutar la demo, desde una consola Node.js:
npm install
node linkarClib.js
