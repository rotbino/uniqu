const express = require('express')
    , router = express.Router();
const sql = require("mssql");

const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const setSqlPublicParam =require("../utils/utility");


//______________________Rent Insert,Rmove,Update_____________________//
router.post('/defineRent/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: rent/cud %j', {body: req.body, token_userId: req.userId});

    //connect to your database
    //sp
    const shema = "rent";
    const sp = "DefinRent_InsertOrUpdate";


    // create Request object
    const request = new sql.Request(pool);


    //fields
    const id = req.body.ID;
    if (id) {
        //edit stage
        request.input('ID', sql.BigInt, id);
        const isDisabled = req.body.IsDisabled;
        const isDeleted = req.body.IsDeleted;
        const Activate = req.body.Activate;
        if (isDisabled) {
            logger.info('API: rent/Disabeled %j', {id: id, isDisabled: isDisabled});
            //delete stage
            request.input('IsDisabled', sql.Bit, isDisabled);
        }
        else if (Activate) {
            logger.info('API: rent/Activate %j', {id: id, Activate: Activate});
            //delete stage
            request.input('Activate', sql.Bit, Activate);
        }
        else if (isDeleted) {
            logger.info('API: rent/Delete %j', {id: id, IsDeleted: isDeleted});
            //delete stage
            request.input('isDeleted', sql.Bit, isDeleted);
        }
        else {
            logger.info('API: rent/Update %j', {id: id});
            request.input('Number', sql.BigInt, req.body.Number);
            request.input('DefaultPrice', sql.BigInt, req.body.DefaultPrice);
            request.input('OwnerUserID', sql.BigInt, req.body.OwnerUserID);
            request.input('OwnerUnitID',  sql.BigInt, req.body.OwnerUnitID);
            request.input('Area', sql.BigInt, req.body.Area);

        }
    } else {
        logger.info('*** API: rent/Insert');
        request.input('Number', sql.BigInt, req.body.Number);
        request.input('DefaultPrice', sql.BigInt, req.body.DefaultPrice);
        request.input('OwnerUserID', sql.BigInt, req.body.OwnerUserID);
        request.input('OwnerUnitID',  sql.BigInt, req.body.OwnerUnitID);
        request.input('Area', sql.BigInt, req.body.Area);
    }
    request.input('CostTypeID', sql.BigInt, req.body.CostTypeID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: rent Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset
        }

        logger.info('API: rent/cud Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});
router.post('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: rent/cud %j', {body: req.body, token_userId: req.userId});

    //connect to your database
    //sp
    const shema = "rent";
    const sp = "Rent_InsertOrUpdate";

    // create Request object
    const request = new sql.Request(pool);
    //fields
    const id = req.body.ID;
    if (id) {
        //edit stage
        request.input('ID', sql.BigInt, id);
        const isDeleted = req.body.IsDeleted;
        if (isDeleted) {
            logger.info('API: rent/Delete %j', {id: id, IsDeleted: isDeleted});
            request.input('isDeleted', sql.Bit, isDeleted);
        }
        else {
            logger.info('API: rent/Update %j', {id: id});

        }
    }

    request.input('DefineRentID', sql.BigInt, req.body.DefineRentID);
    request.input('RentByUserID', sql.BigInt, req.body.RentByUserID);
    request.input('RentByUnitID', sql.BigInt, req.body.RentByUnitID);
    request.input('Price', sql.BigInt, req.body.Price);
    request.input('FromDate',  sql.Date, req.body.FromDate);
    if(req.params.ApplyToCostTypeID && req.params.ApplyToCostTypeID !== "null")
        request.input('ApplyToCostTypeID', sql.BigInt, req.body.ApplyToCostTypeID);
    request.input('PaymentMethodID', sql.BigInt, req.body.PaymentMethodID);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: rent Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset
        }

        logger.info('API: rent/cud Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});


//______________________Rent Select_____________________//
router.get('/:CostTypeID.:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: rent/Select %j', {body: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "rent";
    const sp = "DefineRent_Select";
    // create Request object
    const request = new sql.Request(pool);
    request.input('CostTypeID', sql.BigInt, req.params.CostTypeID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);

    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: rent/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: rent/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

router.post('/setEmpty/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: rent/setEmpty %j', {body: req.body, token_userId: req.userId});

    //connect to your database
    //sp
    const shema = "rent";
    const sp = "Rent_SetEmpty";

    // create Request object
    const request = new sql.Request(pool);
    request.input('ID', sql.BigInt, req.body.ID);
    request.input('EmptyDate', sql.DATE, req.body.EmptyDate);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: rent Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset
        }

        logger.info('API: rent/cud Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________PaymentMethod Select_____________________//

router.get('/paymentMethodList', function (req, res) {

    logger.info('API: paymentMethodList/Select %j', {userId: req.userId});

    //connect to your database
    //sp
    const shema = "rent";
    const sp = "PaymentMethod_Select";

    // create Request object
    const request = new sql.Request(pool);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: paymentMethodList/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: paymentMethodList/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});







module.exports = router;
