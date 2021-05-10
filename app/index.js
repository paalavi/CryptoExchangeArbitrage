const express = require('express');
const app = express();
const  path = require('path');
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
        server.listen(port ,function () {
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
        //set view and static contents
        app.set('view engine', 'ejs');
        app.set('views', (path.resolve('resourses/views')));
        app.use(express.static(path.resolve('public')));
    }
    setRoutes(){
        app.get('/',(req,res)=>res.render('home/home'));
        app.use('/api',routes);
    }
}