const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();
const path = require('path');

var cors = require('cors');

const logger = require('./utils/winstonLogger');

const verifyToken = require('./utils/VerifyToken');
const CheckException = require('./utils/CheckException');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./openapi.json');



var admin = require("firebase-admin");




/* // credential from localPath or os export*/
var serviceAccount = require("./monta-apartment-firebase-adminsdk-6i5ty-816677f553.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://monta-apartment.firebaseio.com"
});

logger.info('*** Monta server Start ***');
logger.info(`*** FireBase Admin app.name: ${admin.app().name} ***`);



app.use(helmet());



//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const sql = require('mssql');
// dbConfig for your database

const config = require('config');
//const dbConfig = process.env.NODE_ENV === 'production' ? config.get('APAMAN.dbConfig') : config.get('APAMAN.dbConfigTest');
const dbConfig =  config.get('APAMAN.dbConfig') ;
pool = new sql.ConnectionPool(dbConfig);
sqlConnect();

function sqlConnect() {
    pool.connect()
        .then(poolResult => {
            logger.info('*** Sql Server Connection Success ***');
            CheckException.getException();
        })
        .catch(err => {
            logger.error("!!! Sql Server Connection Failed !!! %j", err);
            setTimeout(sqlConnect, 3000);
        });
}


app.use(express.static(__dirname + '/views/pages'));
const corsOptions = {
    origin: '*',
}

app.use(cors(corsOptions));

/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get('/nasim', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/pages/nasimIndex.html");
});
// Handle root get
app.get('/', function (req, res) {
    logger.info('*** Apaman call Main page ***');
    res.sendFile(__dirname + "/views/pages/index.html");
});
app.get('/test', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/pages/testIndex.html");
});
*/

app.get('/', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/apaman/index.html");
});



app.get('/test', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/test/index.html");
});
app.get('/nasim', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/nasim/index.html");
});
app.get('/nasimAsayesh', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/nasim/index.html");
});
app.get('/armani', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/armani/index.html");
});
app.get('/tazh', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/tazh/index.html");
});


app.get('/temp', function (req, res) {
    // save html files in the `views` folder...
    res.sendFile(__dirname + "/views/pages/temp.html");
});

app.set('view engine', 'ejs');

app.post('/', function (req, res) {
    console.log(req.body);
    res.sendFile(__dirname + "/views/pages/index.html");
});


const serverConfig = config.get('APAMAN.serverConfig');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/api/v1', router);

//user router
app.use(`${serverConfig.SN}/user`, verifyToken, require('./controllers/user'));

//apartment router
app.use(`${serverConfig.SN}/apartment`, verifyToken, require('./controllers/apartment'));

//unit router
app.use(`${serverConfig.SN}/unit`, verifyToken, require('./controllers/unit'));

//unit router
app.use(`${serverConfig.SN}/requests`, require('./controllers/request'));

//contactUs router
app.use(`${serverConfig.SN}/contactUs`, verifyToken, require('./controllers/contactUs'));

//cost router
app.use(`${serverConfig.SN}/cost`, verifyToken, require('./controllers/cost'));

//Payment router
app.use(`${serverConfig.SN}/pay`, verifyToken, require('./controllers/payment'));

//announcement router
app.use(`${serverConfig.SN}/announce`, verifyToken, require('./controllers/announce'));

//setting router
app.use(`${serverConfig.SN}/setting`, verifyToken, require('./controllers/setting'));

//PhoneBook router
app.use(`${serverConfig.SN}/phoneBook`, require('./controllers/phoneBook'));

//rule router
app.use(`${serverConfig.SN}/rule`, verifyToken, require('./controllers/rule'));

//suggestion router
app.use(`${serverConfig.SN}/suggestion`, verifyToken, require('./controllers/suggestion'));

//survey router
app.use(`${serverConfig.SN}/survey`, verifyToken, require('./controllers/survey'));

//notification router
app.use(`${serverConfig.SN}/notification`, verifyToken, require('./controllers/notification'));

//noticeBoard router
app.use(`${serverConfig.SN}/noticeBoard`, verifyToken, require('./controllers/noticeBoard'));

//noticeBoard router
app.use(`${serverConfig.SN}/facility`, verifyToken, require('./controllers/facility'));

//noticeBoard router
app.use(`${serverConfig.SN}/upload`, verifyToken, require('./utils/uploadUtils'));

//invoice router
app.use(`${serverConfig.SN}/invoice`, require('./controllers/invoice'));

//account router
app.use(`${serverConfig.SN}/acc`, verifyToken, require('./controllers/account'));

//Car router
app.use(`${serverConfig.SN}/car`, verifyToken, require('./controllers/car'));

//Car router
app.use(`${serverConfig.SN}/rent`, verifyToken, require('./controllers/rent'));

//Car router
app.use(`${serverConfig.SN}/building`, verifyToken, require('./controllers/building'));

//Application Check Version
app.use(`${serverConfig.SN}/version`, require('./controllers/version'));

//Application Test
app.use(`${serverConfig.SN}/test`, verifyToken, require('./controllers/test'));



/*const fileConfig = config.get('APAMAN.fileConfig');
const downloadPath = process.env.PWD + fileConfig.downloadAppPath;
app.get('/download/:fileName', function (req, res) {
    logger.info('API: DownloadFile/Application %j', {params: req.params});
    const file = req.params.fileName;
    const fileLocation = path.join(downloadPath, file);
    logger.info('API: DownloadFile/Application fileLocation %s', fileLocation);
    res.download(fileLocation, file);
});
const downloadTestPath = process.env.PWD + fileConfig.downloadTestAppPath;
app.get('/download/test/:fileName', function (req, res) {
    logger.info('API: DownloadTestFile/Application %j', {params: req.params});
    const file = req.params.fileName;
    const fileLocation = path.join(downloadTestPath, file);
    logger.info('API: DownloadTestFile/Application fileLocation %s', fileLocation);
    res.download(fileLocation, file);
});*/
app.get('/download/apaman/:fileName', function (req, res) {
    const file = req.params.fileName;
    const downloadPath = process.env.PWD + "/views/apaman";
    const fileLocation = path.join(downloadPath, file);
    res.download(fileLocation, file);
});
app.get('/download/test/:fileName', function (req, res) {
    const file = req.params.fileName;
    const downloadPath = process.env.PWD + "/views/test";
    const fileLocation = path.join(downloadPath, file);
    res.download(fileLocation, file);
});

app.get('/download/nasim/:fileName', function (req, res) {
    console.log(2222222);
    const file = req.params.fileName;
    const downloadPath = process.env.PWD + "/views/nasim";
    const fileLocation = path.join(downloadPath, file);
    res.download(fileLocation, file);
});

app.get('/download/armani/:fileName', function (req, res) {
    const file = req.params.fileName;
    const downloadPath = process.env.PWD + "/views/armani";
    console.log(downloadPath);
    const fileLocation = path.join(downloadPath, file);
    console.log(fileLocation);
    res.download(fileLocation, file);
});

app.get('/download/tazh/:fileName', function (req, res) {
    const file = req.params.fileName;
    const downloadPath = process.env.PWD + "/views/tazh";
    console.log(downloadPath);
    const fileLocation = path.join(downloadPath, file);
    console.log(fileLocation);
    res.download(fileLocation, file);
});

/*app.use(function (err, req, res) {
    console.log(err.stack);
    res.status(500).send({"Error": "ERROR"});
});*/

// start server

//const port = process.env.NODE_ENV === 'production' ? serverConfig.productPort : serverConfig.testPort;
const port = serverConfig.productPort;
logger.info('APAMAN Path %s', process.env.PWD);
app.listen(3000, function () {
    logger.info('********* Server is running on Port: %s', port);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('!!!!! SERVER unhandledRejection at:' , reason.stack || reason);
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
});
process.on('uncaughtException', function (err) {
    logger.error('!!!!! SERVER uncaughtException err:', err);
});
