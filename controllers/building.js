
const express = require('express'), router = express.Router();
const sql = require("mssql");

const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const setSqlPublicParam =require("../utils/utility");




//alireza code

//______________________Define Building_____________________//
router.post('/defineBuilding',function (req,res) {
    logger.info('API: define building User %j', {body: req.body, userId: req.userId});


    const scheme = "Marketing";
    const sp = "Building_InsertOrUpdate";
    // create Request object
    const request = new sql.Request(pool);
    if (req.body.ID) {
        request.input( "ID", sql.BigInt, req.body.ID );
    }
    request.input('Name', sql.NVarChar(200), req.body.Name);
    request.input('BuildingTypeID', sql.BigInt, req.body.BuildingTypeID);
    request.input('ProvinceID', sql.BigInt, req.body.ProvinceID);
    request.input('CityID', sql.BigInt, req.body.CityID);
    request.input('Region', sql.BigInt, req.body.Region);
    request.input('SubRegionID', sql.BigInt, req.body.SubRegionID);
    request.input('Address', sql.NVarChar(500), req.body.Address);
    request.input('PostalCode', sql.NVarChar(500), req.body.PostalCode);
    request.input('NumberOfFloors', sql.TinyInt, req.body.NumberOfFloors);
    request.input('NumberOfUnits', sql.TinyInt, req.body.NumberOfUnits);
    request.input('ConstructionYear', sql.BigInt, req.body.ConstractionYear);
    request.input('CurrencyID', sql.NVarChar(3), req.body.CurrencyID);

    request.input('CallerFormID', sql.BigInt, req.body.CallerFormID);
    request.input('CallerRoleID', sql.BigInt, req.body.CallerRoleID);
    request.input('CallerUserID', sql.BigInt, req.body.CallerUserID);

    // query to the database and get the data
    request.execute(`${scheme}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Define Building User Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Define Building User Result: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
        // res.status(200).send(result);
    });
});

//______________________Get My Building _____________________//
router.get('/buildingSelect/:CallerUserID.:CallerRoleID.:CallerFormID', function (req, res) {
    logger.info('API: buildingSelect %j');
    //connect to your database
    //sp
    const shema = "Marketing";
    const sp = "Building_Select";

    const request = new sql.Request(pool);

    request.input('CallerUserID', sql.BigInt, req.params.CallerUserID);
    request.input('CallerRoleID', sql.BigInt, req.params.CallerRoleID);
    request.input('CallerFormID', sql.BigInt, req.params.CallerFormID);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: buildingSelect Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: buildingSelect : %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
});


//______________________Enum Building Type Select_____________________//
router.get('/buildingTypeSelect', function (req, res) {

    logger.info('API: buildingTypeSelect %j');
    //connect to your database
    //sp
    const shema = "Marketing";
    const sp = "EnumBuildingType_Select";

    const request = new sql.Request(pool);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: buildingTypeSelect Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: buildingTypeSelect Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
})

//______________________Enum Currency_____________________//
router.get('/enumCurrency', function (req, res) {

    logger.info('API: enumCurrency %j');
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumCurrency_Select";

    const request = new sql.Request(pool);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: buildingTypeSelect Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: enumCurrency Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
})

//______________________Enum Province_____________________//
router.get('/enumProvince', function (req, res) {

    logger.info('API: enumProvince %j');
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumProvince_Select";

    const request = new sql.Request(pool);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: enumProvince Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: enumProvince Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
})


//______________________Enum City_____________________//
router.get('/enumCity/:ProvinceID', function (req, res) {

    logger.info('API: enumCity %j');
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumCity_Select";

    const request = new sql.Request(pool);
    request.input('ProvinceID', sql.BigInt, req.params.ProvinceID);
    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: enumCity Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: enumCity Resul: %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
})
//______________________Enum Region_____________________//
router.get('/enumSubRegion/:CityID', function (req, res) {

    logger.info('API: enumRegion %j');
    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumSubRegion_Select";

    const request = new sql.Request(pool);


    request.input('CityID', sql.BigInt, req.params.CityID);


    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: enumSubRegion Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: enumSubRegion : %j', {code: 200, Response: result});
        // send data as a response
        CheckException.handler(res, result);
    });
})


module.exports = router;
