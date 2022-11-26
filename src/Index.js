import http from './App.js';


http.listen( process.env.APP_PORT, () => console.log('Server on port ' + process.env.APP_PORT)); 