

const express = require('express'), router = express.Router();
const sql = require("mssql");

const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const setSqlPublicParam =require("../utils/utility");



//______________________Payment Type Select_____________________//
router.get('/payType', function (req, res) {

    logger.info('API: Accounting/select PymentType %j', {params: req.params, userId: req.userId});
    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "PaymentType_Select";

    const request = new sql.Request(pool);


    // create Request object
    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Accounting/select PymentType Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Accounting/select PymentType Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});


//______________________Building Account Select_____________________//
router.get('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Accounting/Building Account %j', {params: req.params, userId: req.userId});
    //connect to your database
    //sp
    const shema = "Marketing";
    const sp = "BuildingAccount_Select";

    const request = new sql.Request(pool);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Accounting/Building Account Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Accounting/Building Account Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});

//______________________Building Account Insert,Remove,Update_____________________//
router.post('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Accounting/Building Account cud %j', {body: req.body, token_userId: req.userId});

    //connect to your database
    //sp
    const shema = "Marketing";
    const sp = "BuildingAccount_InsertOrUpdate";


    // create Request object
    const request = new sql.Request(pool);


    //fields
    const id = req.body.ID;
    if (id) {
        //edit stage
        request.input('ID', sql.BigInt, id);

        if  (req.body.hasOwnProperty('IsDisabled')) {
            logger.info('API: Accounting/Building Account Disabled %j', {id: id, isDisabled: req.body.IsDisabled});
            //disabled stage
            request.input('IsDisabled', sql.Bit, req.body.IsDisabled);
        }
        if (req.body.hasOwnProperty('Activate')) {
            logger.info('API: Accounting/Building Account Enabled %j', {id: id, Activate: req.body.Activate});
            //activate stage
            request.input('Activate', sql.Bit, req.body.Activate);
        }
        if (req.body.hasOwnProperty('IsDeleted')) {
            logger.info('API: Accounting/Building Account Delete %j', {id: id, IsDeleted: req.body.IsDeleted});
            //delete stage
            request.input('IsDeleted', sql.Bit, req.body.IsDeleted);
        }
        else {
            logger.info('API: Accounting/Building Account Update %j', {id: id});

            request.input('BankID', sql.BigInt, req.body.BankID ? req.body.BankID : null);
            request.input('Payer', sql.BigInt, req.body.Payer ? req.body.Payer : null);
            request.input('AccountName', sql.NVarChar(50), req.body.AccountName ? req.body.AccountName : null);
            // request.input('AccountNo', sql.VarChar(50), req.body.AccountNo ? req.body.AccountNo : null);
            request.input('CardNo', sql.NVarChar(50), req.body.CardNo ? req.body.CardNo : null);
            request.input('IsGateway', sql.Bit, req.body.IsGateway?true:false);
            request.input('ShebaNo', sql.NVarChar(50), req.body.ShebaNo ? req.body.ShebaNo : null);
            request.input('Description', sql.NVarChar(1000), req.body.Description ? req.body.Description : null);
            // request.input('Balance', sql.BigInt, req.body.Balance ? req.body.Balance : null);

        }
    } else {
        logger.info('*** API: Accounting/Building Account Insert');

        request.input('BankID', sql.BigInt, req.body.BankID ? req.body.BankID : null);
        request.input('Payer', sql.BigInt, req.body.Payer ? req.body.Payer : null);
        request.input('AccountName', sql.NVarChar(50), req.body.AccountName ? req.body.AccountName : null);
        // request.input('AccountNo', sql.VarChar(50), req.body.AccountNo ? req.body.AccountNo : null);
        request.input('CardNo', sql.NVarChar(50), req.body.CardNo ? req.body.CardNo : null);
        request.input('IsGateway', sql.Bit, req.body.IsGateway?req.body.IsGateway:false);
        request.input('ShebaNo', sql.NVarChar(50), req.body.ShebaNo ? req.body.ShebaNo : null);
        request.input('Description', sql.NVarChar(1000), req.body.Description ? req.body.Description : null);

        // request.input('Balance', sql.BigInt, req.body.Balance ? req.body.Balance : null);
    }

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Accounting/Building Account Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset
        }

        logger.info('API: Accounting/Building Account cud Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Bank list_____________________//
router.get('/bank', function (req, res) {

    logger.info('API: BankList/select %j', {userId: req.userId});
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumBank_Select";

    const request = new sql.Request(pool);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: BankList/select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: BankList/select Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});

//______________________Transaction User Select_____________________//
router.post('/transaction/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {
    logger.info('API: Transaction User %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const scheme = "Accounting";
    const sp = "Transaction_Select";
    // create Request object
    const request = new sql.Request(pool);
    //fields
    request.input('BuildingID', sql.BigInt, req.body.BuildingID);
    request.input('UnitID', sql.BigInt, req.body.UnitID);
    request.input('UserID', sql.BigInt, req.body.UserID);
    request.input('Offset', sql.BigInt, req.body.Offset);
    request.input('Lenght', sql.BigInt, req.body.Lenght);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${scheme}.${sp}`, function (err, recordset) {
        if (err) logger.error("API:  Transaction User Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Transaction User Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
        // res.status(200).send(result);
    });
});

//______________________Cost And Income_____________________//
router.post('/reportTransaction/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID',function (req,res) {
    logger.info('API: All Transaction User %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const scheme = "Report";
    const sp = "CostAndIncome";
    // create Request object
    const request = new sql.Request(pool);
    //fields
    request.input('PeriodDetailIds', sql.NVarChar(100), req.body.PeriodDetailIds);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${scheme}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: All Transaction User Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: All Transaction User Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
        // res.status(200).send(result);
    });
})





module.exports = router;
