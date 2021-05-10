const express = require('express');
const app = express();
const http = require('http');
const helmet = require('helmet');
const routes = require("./routes/router")
module.exports =  class Application {
    constructor(){
        this.startServer();
        this.setConfigs();
        this.setRoutes()
    }
    startServer(){
        const port = process.env.PORT || 3000;
        const server = http.createServer(app);
        server.listen(process.env.PORT || 3000 ,function () {
            console.log(`server is Running n port ${port}`)
        });
    }
    setConfigs(){
        //security config
        app.use(helmet())
        //body parser
        app.use(express.json());
        app.use(express.urlencoded({
          extended: false
        }));
    }
    setRoutes(){
        app.get('/',(req,res)=>res.json({message : "Hos Galdeniz"}));
        app.use('/api',routes);
    }
}