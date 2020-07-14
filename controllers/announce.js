
const express = require('express')
    , router = express.Router();
const sql = require("mssql");

const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const PushNotification = require('../utils/PushNotification');
const setSqlPublicParam =require("../utils/utility");
//______________________ Select Announcement ________________//
router.get('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Announcement/SelectAnnouncement  %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const schema = "Accounting";
    const sp = "Announce_Select";


    // create Request object
    const request = new sql.Request(pool);

    request.input('UserID', sql.BigInt, req.userId);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${schema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Announcement/SelectAnnouncement Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Announcement/SelectAnnouncement Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});

//______________________ Select Announcement ________________//
router.get('/select/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Announcement/SelectAnnouncement %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const schema = "Accounting";
    const sp = "Announce_Select";


    // create Request object
    const request = new sql.Request(pool);


    //fields

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${schema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Announcement/SelectAnnouncement Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Announcement/SelectAnnouncement Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});



//______________________ Select Announcement With Id ________________//
router.get('/:ID/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Announcement/SelectAnnouncementWithId %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "Announce_SelectWithID";


    // create Request object
    const request = new sql.Request(pool);

    request.input('ID', sql.BigInt, req.params.ID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Announcement/SelectAnnouncementWithId Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Announcement/SelectAnnouncementWithId Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});

router.get('/select/:ID/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Announcement/SelectAnnouncementWithId %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "Announce_SelectWithID";

    const request = new sql.Request(pool);
    request.input('ID', sql.BigInt, req.params.ID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Announcement/SelectAnnouncementWithId Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Announcement/SelectAnnouncementWithId Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});

//______________________ Select For Announcement - Default Charge ________________//
router.get('/forAnnouncement/defaultCharge/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID.:PeriodDetailID', function (req, res) {

    logger.info('API: Announcement/SelectForAnnouncement_DefaultCharge %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Setting";
    const sp = "DefaultCharge_SelectForAnnounce";


    // create Request object
    const request = new sql.Request(pool);


    //fields
    request.input('PeriodDetailID', sql.BigInt, req.params.PeriodDetailID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt)
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Announcement/SelectForAnnouncement_DefaultCharge Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Announcement/SelectForAnnouncement_DefaultCharge Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});

//______________________ Select For Announcement - Calculation Header  ________________//
router.get('/forAnnouncement/calculationHeader/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID.:CostClassID.:PeriodDetailID.:CalculationHeaderIDs', function (req, res) {

    logger.info('API: Announcement/SelectForAnnouncement_CalculationHeader %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "CalculationHeader_SelectForAnnounce";


    // create Request object
    const request = new sql.Request(pool);


    //fields

    request.input('CostClassID', sql.BigInt, req.params.CostClassID);
    const PeriodDetailID = req.params.PeriodDetailID;
    if (PeriodDetailID != null && PeriodDetailID !== "null") {
        request.input('PeriodDetailID', sql.BigInt, PeriodDetailID);
    }
    console.log(req.params.CalculationHeaderIDs);
    const CalculationHeaderIDs = req.params.CalculationHeaderIDs;
    if (CalculationHeaderIDs != null && CalculationHeaderIDs !== "null") {
        request.input('CalculationHeaderIDs', sql.VarChar(500), CalculationHeaderIDs);
    }
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Announcement/SelectForAnnouncement_CalculationHeader Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Announcement/SelectForAnnouncement_CalculationHeader Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});



//______________________ Add Announcement ________________//
router.post('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Announcement/AddAnnouncement %j', {params: req.params, body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const schema = "Accounting";
    const sp = "Announce";


    // create Request object
    const request = new sql.Request(pool);


    //fields

    request.input('CostClassID', sql.BigInt, req.body.CostClassID);


    request.input('Title', sql.NVARCHAR(100), req.body.Title);
    request.input('LastPayDate', sql.DATE, req.body.LastPayDate);

    const PeriodDetailID = req.body.PeriodDetailID;
    if (PeriodDetailID != null && PeriodDetailID !== "null") {
        request.input('PeriodDetailID', sql.BigInt, PeriodDetailID);
    }

    const IsDefault = req.body.IsDefault;
    if (IsDefault != null && IsDefault !== "null") {
        request.input('IsDefault', sql.Bit, IsDefault);
    }

    const CalculationHeaderIDs = req.body.CalculationHeaderIDs;
    if (CalculationHeaderIDs != null && CalculationHeaderIDs !== "null") {
        request.input('CalculationHeaderIDs', sql.VARCHAR(500), CalculationHeaderIDs);
    }

    const RecordNumber = req.body.RecordNumber;
    if (RecordNumber != null && RecordNumber !== "null") {
        request.input('RecordNumber', sql.VARCHAR(50), RecordNumber);
    }

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);


    // query to the database and get the data
    request.execute(`${schema}.${sp}`, function (err, recordset) {
        if (err){
            logger.error("API: Announcement/AddAnnouncement Error: %s", err);
        } else{
            let result = null;
            if (recordset) {
                result = recordset.recordset;
            }
            logger.info('API: Announcement/AddAnnouncement Result: %j', {code: 200, Response: result});
            // send data as a response
            CheckException.handler(res, result);
            PushNotification.getSend();
        }
    });
});

//______________________ Add Announcement ________________//
router.post('/delete/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Announcement/DeleteAnnouncement %j', {params: req.params, body: req.body, userId: req.userId});

    const schema = "Accounting";
    const sp = "Announce_Delete";
    const request = new sql.Request(pool);

    request.input('ID', sql.BigInt, req.body.ID);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);

    request.execute(`${schema}.${sp}`, function (err, recordset) {
        if (err){
            logger.error("API: Announcement/DeleteAnnouncement Error: %s", err);
        } else{
            let result = null;
            if (recordset) {
                result = recordset.recordset;
            }
            logger.info('API: Announcement/DeleteAnnouncement Result: %j', {code: 200, Response: result});
            // send data as a response
            CheckException.handler(res, result);
        }
    });
});



module.exports = router;
