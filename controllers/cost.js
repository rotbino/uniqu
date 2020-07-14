const express = require('express')
    , router = express.Router();
const sql = require("mssql");

const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const setSqlPublicParam =require("../utils/utility");


//______________________Enum Cost Type Select_____________________//
router.get('/type/:CallerBuildingID', function (req, res) {

    logger.info('API: Cost/Type_Select %j', {params: req.params, userId: req.userId});
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumCostType_Select";

    const request = new sql.Request(pool);
    request.input('CallerFormID', sql.BigInt, req.body.CallerFormID?req.body.CallerFormID:null);
    request.input('CallerBuildingID', sql.BigInt, req.body.CallerBuildingID);
    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Cost/Type_Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Cost/Type_Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);

    });
});

//______________________Cost Type Insert,Rmove,Update_____________________//
router.put('/type/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {


    logger.info('API: Cost_Type/cud %j', {body: req.body, token_userId: req.userId});

    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumCostType_InsertOrUpdate";


    // create Request object
    const request = new sql.Request(pool);


    //fields
    const id = req.body.ID;
    if (id) {
        //edit stage
        request.input('ID', sql.BigInt, id);
        const isDisabled = req.body.isDisabled;
        if (isDisabled) {
            logger.info('API: Cost_Type/Delete %j', {id: id, isDisabled: isDisabled});
            //delete stage
            request.input('IsDisabled', sql.Bit, isDisabled);
        } else {
            logger.info('API: Cost_Type/Update %j', {id: id});

            request.input('Name', sql.NVarChar(100), req.body.Name);
            request.input('CostClassID', sql.BigInt, req.body.CostClassID);
            request.input('IsPeriodical', sql.Bit, req.body.IsPeriodical);
        }
    } else {
        logger.info('*** API: Cost_Type/Insert');

        request.input('Name', sql.NVarChar(100), req.body.Name);
        request.input('CostClassID', sql.BigInt, req.body.CostClassID);
        request.input('IsPeriodical', sql.BigInt, req.body.IsPeriodical);
    }

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Cost_Type/cud Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset
        }

        logger.info('API: Cost_Type/cud Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
        // if (result[0].ResultCode === 1)
        //     res.status(200).send(result);
        // else
        //     res.status()
    });
});

//______________________Enum Cost Class Select_____________________// EnumCostClass_Select
router.get('/class', function (req, res) {

    logger.info('API: Cost/Class_Select %j', {params: req.params, userId: req.userId});
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumCostClass_Select";


    // create Request object
    const request = new sql.Request(pool);
    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Cost/Class_Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Cost/Class_Select Result: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);

    });
});

//______________________Enum Calculate Type Select_____________________//
router.get('/calculate', function (req, res) {

    logger.info('API: Cost/Calculate_Type %j', {params: req.params, userId: req.userId});
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumCalculateType_Select";

    // create Request object
    const request = new sql.Request(pool);
    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Cost/Calculate_Type Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Cost/Calculate_Type Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
        // res.status(200).send(result);
    });
});

//______________________Enum Occupation Type Select_____________________//
router.get('/occupation', function (req, res) {

    logger.info('API: Cost/EnumOccupation_Type %j', {params: req.params, userId: req.userId});
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumOccupationType_Select";

    // create Request object
    const request = new sql.Request(pool);
    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Cost/EnumOccupation_Type Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Cost/EnumOccupation_Type Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Add Cost Result________________//
router.post('/addResult/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: cost/addResult %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "Calculation";


    // create Request object
    const request = new sql.Request(pool);

    request.input('ID', sql.BigInt, req.body.ID ? req.body.ID : null);
    request.input('CostTypeID', sql.BigInt, req.body.CostTypeID);
    request.input('Price', sql.BigInt, req.body.Price);
    request.input('PeriodDetailID', sql.BigInt, req.body.PeriodDetailID);
    request.input('HasConfirmed', sql.Bit, req.body.HasConfirmed);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);

    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: cost/addResult Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: cost/addResult Result: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Add Cost ________________//
router.post('/add/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: costAdd/crud %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "Calculation_InsertOrUpdate";


    // create Request object
    const request = new sql.Request(pool);


    //fields
    const id = req.body.ID;
    if (id) {
        //edit stage
        request.input('ID', sql.BigInt, id);
        const isDisabled = req.body.isDisabled;
        if (isDisabled) {
            logger.info('API: costAdd/Delete %j', {id: id, isDisabled: isDisabled});
            //delete stage
            request.input('IsDisabled', sql.Bit, isDisabled);
        } else {
            logger.info('API: costAdd/Update %j', {id: id});

            request.input('CostTypeID', sql.BigInt, req.body.CostTypeID);
            request.input('TotalPrice', sql.BigInt, req.body.TotalPrice);
            request.input('BillNumber', sql.VARCHAR(100), req.body.BillNumber);
            request.input('CostTypeDetailName', sql.NVARCHAR(100), req.body.CostTypeDetailName);
            request.input('StartDate', sql.DATE, req.body.StartDate);
            request.input('EndDate', sql.DATE, req.body.EndDate);
            request.input('PeriodDetailID', sql.BigInt, req.body.PeriodDetailID);
             if(req.body.InstallmentData && req.body.InstallmentData.length>0){
                 let InstallmentData=JSON.stringify(req.body.InstallmentData);
                 logger.info('InstallmentData=', InstallmentData);
                 request.input('InstallmentData', sql.VARCHAR(2000), InstallmentData);
             }

        }
    } else {
        logger.info('API: costAdd/Insert');
        request.input('CostTypeID', sql.BigInt, req.body.CostTypeID);
        request.input('TotalPrice', sql.BigInt, req.body.TotalPrice);
        request.input('BillNumber', sql.VARCHAR(100), req.body.BillNumber);
        request.input('CostTypeDetailName', sql.NVARCHAR(100), req.body.CostTypeDetailName);
        request.input('StartDate', sql.DATE, req.body.StartDate);
        request.input('EndDate', sql.DATE, req.body.EndDate);
        request.input('PeriodDetailID', sql.BigInt, req.body.PeriodDetailID);
        if(req.body.InstallmentData && req.body.InstallmentData.length>0){
            let InstallmentData=JSON.stringify(req.body.InstallmentData);
            logger.info('InstallmentData=', InstallmentData);
            request.input('InstallmentData', sql.VARCHAR(2000), InstallmentData);
        }
    }

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);


    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: costAdd/ Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: cost/Add Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________select list of Cost________________//
router.get('/list/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: cost/list %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "Calculation_Select";


    // create Request object
    const request = new sql.Request(pool);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: cost/list Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: cost/list Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Edit Cost________________//

router.get('/edit/:CalculationHeaderID.:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: cost/edit %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "Calculation_SelectWithCalculationHeaderID";


    // create Request object
    const request = new sql.Request(pool);

    request.input('CalculationHeaderID', sql.BigInt, req.params.CalculationHeaderID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: cost/edit Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: cost/edit Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});
//______________________Delete Cost________________//
router.post('/delete/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: costRemove/crud %j', {body: req.body, userId: req.userId});

    const shema = "Accounting";
    const sp = "Calculation_Delete";

    // create Request object
    const request = new sql.Request(pool);

    request.input('ID', sql.BigInt, req.body.ID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt)

    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: costRemove/ Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: cost/Remove Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});
module.exports = router;
