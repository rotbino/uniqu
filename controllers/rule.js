const express = require('express')
    , router = express.Router();
const sql = require("mssql");


const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const setSqlPublicParam =require("../utils/utility");


//______________________Rule Insert,Rmove,Update_____________________//
router.post('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Rule/cud %j', {body: req.body, token_userId: req.userId});

    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "BuildingRule_InsertOrUpdate";


    // create Request object
    const request = new sql.Request(pool);


    //fields
    const id = req.body.id;
    if (id) {
        //edit stage
        request.input('ID', sql.BigInt, id);
        const isDisabled = req.body.isDisabled;
        if (isDisabled) {
            logger.info('API: Rule/Delete %j', {id: id, isDisabled: isDisabled});
            //delete stage
            request.input('IsDisabled', sql.Bit, isDisabled);
        } else {
            logger.info('API: Rule/Update %j', {id: id});

            request.input('Description', sql.NVarChar(1000), req.body.description);
        }
    } else {
        logger.info('*** API: Rule/Insert');

        request.input('Description', sql.NVarChar(1000), req.body.description);
    }

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Rule Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset
        }

        logger.info('API: Rule/cud Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});


//______________________Rule Select_____________________//
router.get('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Rule/Select %j', {body: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "BuildingRule_Select";


    // create Request object
    const request = new sql.Request(pool);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Rule/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Rule/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);

    });
});

module.exports = router;
