const express = require('express'),
    router = express.Router();
const sql = require('mssql');
const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const PushNotification = require('../utils/PushNotification');
const PaymentFactory = require('../utils/PaymentFactory');
const setSqlPublicParam =require("../utils/utility");


//______________________Facility Insert,Rmove,Update_____________________//
router.post('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Facility/cud %j', {body: req.body, token_userId: req.userId});

    //connect to your database
    //sp
    const shema = "Facility";
    const sp = "BuildingFacility_InsertOrUpdate";


    // create Request object
    const request = new sql.Request(pool);


    //fields
    const id = req.body.ID;
    if (id) {
        //edit stage
        request.input('ID', sql.BigInt, id);
         if (req.body.hasOwnProperty('Activate')) {
            logger.info('API: Facility/Building Activate %j', {id: id, Activate: req.body.Activate});
            request.input('Activate', sql.Bit, req.body.Activate);
         }
         if (req.body.hasOwnProperty('IsDisabled')) {
            logger.info('API: Facility/Building Disabled %j', {id: id, isDisabled: req.body.IsDisabled});
            request.input('IsDisabled', sql.Bit, req.body.IsDisabled);
         }
         if (req.body.hasOwnProperty('IsDeleted')) {
            logger.info('API: Facility/Building Deleted %j', {id: id, IsDeleted: req.body.IsDeleted});
            request.input('IsDeleted', sql.Bit, req.body.IsDeleted);
          }  else {
            logger.info('API: Facility/Update %j', {id: id});
             if(req.body.Image && req.body.Image!=='null')
                 request.input('Image', sql.NVarChar(1000), req.body.Image);
             if(req.body.Description && req.body.Description!=='null')
                 request.input('Description', sql.NVarChar(1000), req.body.Description);
             if(req.body.Tel && req.body.Tel!=='null')
                 request.input('Tel', sql.NVarChar(50), req.body.Tel);
             if(req.body.Capacity && req.body.Capacity!=='null')
                 request.input('Capacity', sql.BigInt, req.body.Capacity);
             if(req.body.Data && req.body.Data!=='null')
                request.input('Data', sql.NVARCHAR(8000), req.body.Data);
        }
    } else {
        logger.info('*** API: Facility/Insert');
        request.input('FacilityID', sql.BigInt, req.body.FacilityID);
        if(req.body.Image && req.body.Image!=='null')
            request.input('Image', sql.NVarChar(1000), req.body.Image);
        if(req.body.Description && req.body.Description!=='null')
            request.input('Description', sql.NVarChar(1000), req.body.Description);
        if(req.body.Tel && req.body.Tel!=='null')
            request.input('Tel', sql.NVarChar(50), req.body.Tel);
        if(req.body.Capacity && req.body.Capacity!=='null')
            request.input('Capacity', sql.BigInt, req.body.Capacity);
        if(req.body.Data && req.body.Data!=='null')
            request.input('Data', sql.NVARCHAR(8000), req.body.Data);
    }


    request.input('MinTimeToReserve', sql.BigInt, req.body.MinTimeToReserve?req.body.MinTimeToReserve:null);
    request.input('MaxTimeToReserve', sql.BigInt, req.body.MaxTimeToReserve?req.body.MaxTimeToReserve:null);
    request.input('HasCheckBalance', sql.BIT, req.body.HasCheckBalance?req.body.HasCheckBalance:false);
    request.input('CheckBalancePrice', sql.BigInt, req.body.CheckBalancePrice?req.body.CheckBalancePrice:null);

    request.input('HasAccessForEmptyUnit', sql.BIT, req.body.HasAccessForEmptyUnit?req.body.HasAccessForEmptyUnit:false);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset
        }

        logger.info('API: Facility/cud Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Facility Select_____________________//
router.get('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID.:IsDisabled', function (req, res) {

    logger.info('API: Facility/Select %j', {body: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Facility";
    const sp = "BuildingFacility_Select";


    // create Request object
    const request = new sql.Request(pool);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________BuildingFacility filter_____________________//
router.post('/filter/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Facility/filter %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Facility";
    const sp = "BuildingFacility_SelectDetail";



    const request = new sql.Request(pool);

    request.input('Offset', sql.BIGINT,req.body.PageIndex?req.body.PageIndex:0);
    request.input('Length', sql.BIGINT,req.body.PageSize?req.body.PageSize:300);

    const FacilitydIds = req.body.FacilitydIds;
    if (FacilitydIds != null && FacilitydIds !== "null") {
        request.input('FacilitydIds', sql.VARCHAR(100), JSON.stringify(FacilitydIds));
    }

    const StatusIds = req.body.StatusIds;
    if (StatusIds != null && StatusIds !== "null") {
        request.input('StatusIds', sql.VARCHAR(100),JSON.stringify(StatusIds) );
    }

    const GenderTypeIds = req.body.GenderTypeIds;
    if (GenderTypeIds != null && GenderTypeIds !== "null") {
        request.input('GenderTypeIds', sql.VARCHAR(100), JSON.stringify(GenderTypeIds));
    }

    const FromDate = req.body.FromDate;
    if (FromDate != null && FromDate !== "null") {
        request.input('FromDate',sql.DATE, FromDate);
    }

    const SpecificDayIds = req.body.SpecificDayIds;
    if (SpecificDayIds != null && SpecificDayIds !== "null") {
        request.input('SpecificDayIds', sql.VARCHAR(100), JSON.stringify(SpecificDayIds));
    }

    const FromPrice = req.body.FromPrice;
    if (FromPrice != null && FromPrice !== "null") {
        request.input('FromPrice',sql.BIGINT, FromPrice);
    }

    const ToPrice = req.body.ToPrice;
    if (ToPrice != null && ToPrice !== "null") {
        request.input('ToPrice',sql.BIGINT, ToPrice);
    }

    const JustAvailable = req.body.JustAvailable;
    if (JustAvailable != null && JustAvailable !== "null") {
        request.input('JustAvailable',sql.BIT, JustAvailable);
    }

    const AcceptGuest = req.body.AcceptGuest;
    if (AcceptGuest != null && AcceptGuest !== "null") {
        request.input('AcceptGuest',sql.BIT, AcceptGuest);
    }

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/filter Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/filter Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________checkUserCanReserve filter_____________________//
router.post('/checkUserCanReserve/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Facility/fcheckUserCanReserve %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Facility";
    const sp = "BuildingFacilityScheduleReserve_BeforeInsert";
    const request = new sql.Request(pool);

    request.input('BuildingFacilityScheduleID', sql.BigInt, req.body.BuildingFacilityScheduleID?req.body.BuildingFacilityScheduleID:null);
    request.input('BuildingFacilityID', sql.BigInt, req.body.BuildingFacilityID?req.body.BuildingFacilityID:null);
    request.input('ReserveDate', sql.Date, req.body.ReserveDate?req.body.ReserveDate:false);
    request.input('TotalPrice', sql.BigInt, req.body.TotalPrice?req.body.TotalPrice:null);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/checkUserCanReserve Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/checkUserCanReserve Resul: %j', {code: 200, Response: result});
        CheckException.handler(res, result);
    });
});

//______________________BuildingFacility ScheduleReserve _____________________//


//______________________Facility Type_____________________//
router.get('/type', function (req, res) {

    logger.info('API: Facility Type/Select %j', {userId: req.userId});

    //connect to your database
    //sp
    const shema = "Facility";
    const sp = "EnumFacility_Select";


    // create Request object
    const request = new sql.Request(pool);


    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility Type/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility Type/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Facility day of Week_____________________//
router.get('/weekDay', function (req, res) {

    logger.info('API: Facility weekDay/Select %j', {userId: req.userId});

    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "EnumWeekDay_Select";


    // create Request object
    const request = new sql.Request(pool);


    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility weekDay/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility weekDay/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Facility Schedule Status_____________________//
router.get('/scheduleStatus', function (req, res) {

    logger.info('API: Facility scheduleStatus/Select %j', {userId: req.userId});

    //connect to your database
    //sp
    const shema = "Facility";
    const sp = "EnumScheduleStatus_Select";


    // create Request object
    const request = new sql.Request(pool);


    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility scheduleStatus/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility scheduleStatus/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});




router.get('/statusList', function (req, res) {

    logger.info('API: Facility/Select %j', {body: req.params, userId: req.userId});
    //connect to your database
    //sp
    const shema = "Facility";
    const sp = "EnumScheduleStatus_Select";

    // create Request object
    const request = new sql.Request(pool);

    // query to the database and get the data
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/statusList Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/statusList Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

router.post('/reserveWithoutPaymeny/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Facility/reserve %j', {body: req.body, userId: req.userId});

    const shema = "Facility";
    const sp = "BuildingFacilityScheduleReserve_InsertOrUpdate";

    const request = new sql.Request(pool);

    const ID = req.body.ID;
    if (ID != null && ID !== "null") {
        request.input('ID',sql.BIGINT, ID);
    }

    request.input('BuildingFacilityScheduleID', sql.BIGINT, req.body.BuildingFacilityScheduleID);

    const BuildingFacilityID = req.body.BuildingFacilityID;
    if (BuildingFacilityID != null && BuildingFacilityID !== "null") {
        request.input('BuildingFacilityID', sql.BIGINT, BuildingFacilityID);
    }

    const UserID = req.body.UserID;
    if (UserID != null && UserID !== "null") {
        request.input('UserID', sql.BIGINT, UserID);
    }



    const UnitID = req.body.UnitID;
    if (UnitID != null && UnitID !== "null") {
        request.input('UnitID', sql.BIGINT, UnitID);
    }

    const ReserveDate = req.body.ReserveDate;
    if (ReserveDate != null && ReserveDate !== "null") {
        request.input('ReserveDate', sql.Date, ReserveDate);
    }

    request.input('GuestCount', sql.BigInt, req.body.GuestCount ? req.body.GuestCount : 0);
    request.input('Status', sql.BIGINT, req.body.Status ? req.body.Status : 1);
    request.input('HasCalled', sql.BIT, req.body.HasCalled ? req.body.HasCalled : false);

    const TotalPrice = req.body.TotalPrice;
    if (TotalPrice != null && TotalPrice !== "null") {
        request.input('TotalPrice', sql.BIGINT, TotalPrice);
    }

    const PaymentTypeID = req.body.PaymentTypeID;
    if (PaymentTypeID != null && PaymentTypeID !== "null") {
        request.input('PaymentTypeID', sql.BIGINT, PaymentTypeID);
    }

    const Description = req.body.Description;
    if (Description != null && Description !== "null") {
        request.input('Description', sql.NVARCHAR(500), Description);
    }

    const HasCalled = req.body.HasCalled;
    if (HasCalled != null && HasCalled !== "null") {
        request.input('HasCalled', sql.BIGINT, HasCalled);
    }


    const DayOfWeek = req.body.DayOfWeek;
    if (DayOfWeek != null && DayOfWeek !== "null") {
        request.input('DayOfWeek', sql.BIGINT, DayOfWeek);
    }

    const IsSchedule = req.body.IsSchedule;
    if (IsSchedule != null && IsSchedule !== "null") {
        request.input('DayOfWeek', sql.BIT, IsSchedule);
    }

    const FromHour = req.body.FromHour;
    if (FromHour != null && FromHour !== "null") {
        request.input('FromHour', sql.CHAR(5), FromHour);
    }

    const ToHour = req.body.ToHour;
    if (ToHour != null && ToHour !== "null") {
        request.input('ToHour', sql.CHAR(5), ToHour);
    }

    const GenderType = req.body.GenderType;
    if (GenderType != null && GenderType !== "null") {
        request.input('GenderType', sql.BIT, GenderType);
    }

    const ScheduleStatusID = req.body.ScheduleStatusID;
    if (ScheduleStatusID != null && ScheduleStatusID !== "null") {
        request.input('ScheduleStatusID', sql.BIGINT, ScheduleStatusID);
    }

    const Price = req.body.Price;
    if (Price != null && Price !== "null") {
        request.input('Price', sql.BIGINT, Price);
    }
    const AcceptGuest = req.body.AcceptGuest;
    if (AcceptGuest != null && AcceptGuest !== "null") {
        request.input('AcceptGuest',sql.BIT, AcceptGuest);
    }
    const MaxGuest = req.body.MaxGuest;
    if (MaxGuest != null && MaxGuest !== "null") {
        request.input('MaxGuest', sql.BIGINT, MaxGuest);
    }

    const PricePerGuest = req.body.PricePerGuest;
    if (PricePerGuest != null && PricePerGuest !== "null") {
        request.input('PricePerGuest', sql.BIGINT, PricePerGuest);
    }

    const OwnerCount = req.body.OwnerCount;
    if (OwnerCount != null && OwnerCount !== "null") {
        request.input('OwnerCount', sql.BIGINT, OwnerCount);
    }


    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/reserve Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/reserve Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});


//______________________Payment manually for reserve facility________________//
router.post('/reserveByManuallyPayment/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: facility/reserveByManuallyPayment %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const shema = "Accounting";
    const sp = "Payment_Manual";


    // create Request object
    const request = new sql.Request(pool);


    request.input('BuildingID', sql.BigInt, req.body.CallerBuildingID);
    request.input('UnitID', sql.BigInt, req.body.UnitID);
    request.input('UserID', sql.BigInt, req.body.UserID);
    request.input('PaymentTypeID', sql.BigInt, req.body.PaymentTypeID);
    request.input('TotalPrice', sql.BigInt, req.body.TotalPrice);
    request.input('Description', sql.NVarChar(500), req.body.Description);

    //Card Data
    request.input('BuildingAccountID', sql.BigInt, req.body.BuildingAccountID ? req.body.BuildingAccountID : null);
    request.input('BankReference', sql.VarChar(50), req.body.BankReference ? req.body.BankReference : null);
    request.input('CardNo', sql.VarChar(50), req.body.CardNo ? req.body.CardNo : null);

    // Check Data
    request.input('ChequeBankID', sql.BigInt, req.body.ChequeBankID ? req.body.ChequeBankID : null);
    request.input('ChequeName', sql.NVarChar(200), req.body.ChequeName ? req.body.ChequeName : null);
    request.input('ChequeDate', sql.DATE, req.body.ChequeDate ? req.body.ChequeDate : null);
    request.input('ChequeNo', sql.VARCHAR(50), req.body.ChequeNo ? req.body.ChequeNo : null); //*

    //Image in Check & Card
    request.input('Image', sql.NVarChar(1000), req.body.Image ? req.body.Image : null);

    //facility
    request.input('PurchaseTypeID', sql.BigInt, req.body.PurchaseTypeID ? req.body.PurchaseTypeID : null);
    request.input('ReserveDate', sql.DATE, req.body.ReserveDate ? req.body.ReserveDate : null);
    request.input('OwnerCount', sql.BigInt, req.body.OwnerCount ? req.body.OwnerCount : null);
    request.input('GuestCount', sql.BigInt, req.body.GuestCount ? req.body.GuestCount : 0);
    request.input('TempID', sql.BigInt, req.body.TempID ? req.body.TempID : null);


    setSqlPublicParam(request,req.params,req.userId, sql.BigInt)
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/reserveByManuallyPayment Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }

        logger.info('API: Facility/reserveByManuallyPayment Resul: %j', {code: 200, Response: result});
        CheckException.handler(res, result);
        //PushNotification.getSend()
    });
});

//______________________Facility GET RESERVED with ID&Date_____________________//

router.get('/getReserved/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID.:BuildingFacilityScheduleID.:ReserveDate', function (req, res) {

    logger.info('API: Facility/BuildingFacilityScheduleReserve %j', {body: req.params, userId: req.userId});

    const shema = "Facility";
    const sp = "BuildingFacilityScheduleReserve_Select";

    const request = new sql.Request(pool);

    request.input('BuildingFacilityScheduleID', sql.BigInt, req.params.BuildingFacilityScheduleID);
    request.input('ReserveDate', sql.DATE, req.params.ReserveDate);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/BuildingFacilityScheduleReserve_Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/BuildingFacilityScheduleReserve_Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Facility GET USER RESERVES with USERID_____________________//

router.get('/getUserReserved/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Facility/BuildingFacilityScheduleReserve_SelectWithUserID %j', {body: req.params, userId: req.userId});

    const shema = "Facility";
    const sp = "BuildingFacilityScheduleReserve_SelectWithUserID";
    const request = new sql.Request(pool);

    request.input('UserID', sql.BigInt, req.params.UserID);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/BuildingFacilityScheduleReserve_SelectWithUserID Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/BuildingFacilityScheduleReserve_SelectWithUserID Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});


//______________________Facility CANCEL RESERVE ________________//
router.post('/cancelReserve/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {
    logger.info('API: Facility/cancelReserve3333 %j', {body: req.body, userId: req.userId});

    const shema = "Facility";
    const sp = "BuildingFacilityScheduleReserve_InsertOrUpdate";

    const request = new sql.Request(pool);


    request.input('ID',sql.BIGINT, Number(req.body.ID));
    request.input('HasCanceled', sql.BIT, true);
    request.input('CanceledDescription', sql.NVARCHAR(1000), req.body.CanceledDescription?req.body.CanceledDescription:null);
    request.input('ReturnPrice', sql.BIGINT, req.body.ReturnPrice?req.body.ReturnPrice:null);
    request.input('CanceledRequestDate', sql.Date, req.body.CanceledRequestDate);
    request.input('CanceledRequestTime', sql.CHAR(5), req.body.CanceledRequestTime);


    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Facility/cancelReserve Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }
        logger.info('API: Facility/cancelReserve Resul: %j', {code: 200, Response: result});
        CheckException.handler(res, result);
    });
});


module.exports = router;

