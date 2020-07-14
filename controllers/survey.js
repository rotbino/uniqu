const express = require('express')
    , router = express.Router();

const sql = require("mssql");

const logger = require('../utils/winstonLogger');
const CheckException = require('../utils/CheckException');
const PushNotification = require('../utils/PushNotification');
const setSqlPublicParam =require("../utils/utility");


//______________________Survey Insert,Rmove,Update_____________________//
router.post('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        logger.error('API: Survey/cud not have Token: x-access-token not set');
        return res.status(400).send('bad data');
    }

    logger.info('API: Survey/cud %j', {body: req.body, token_userId: req.userId});

    //connect to your database

    //sp
    const shema = "dbo";
    const sp = "BuildingSurvey_InsertOrUpdate";

    // create Request object
    const request = new sql.Request(pool);


    //fields
    const ID = req.body.ID;
    if (ID) {
        //edit stage
        request.input('ID', sql.BigInt, ID);
        const isDisabled = req.body.isDisabled;
        if (isDisabled) {
            logger.info('API: Survey/Delete %j', {id: ID, isDisabled: isDisabled});
            //delete stage
            request.input('IsDisabled', sql.Bit, isDisabled);
        } else {
            logger.info('API: Survey/Update %j', {id: ID});

            request.input('Question', sql.NVarChar(1000), req.body.Question);
            // request.input('Title', sql.NVarChar(100), req.body.Title);
            request.input('QuestionType', sql.Bit, req.body.QuestionType);
            request.input('AnswerOne', sql.NVarChar(1000), req.body.AnswerOne);
            request.input('AnswerTwo', sql.NVarChar(1000), req.body.AnswerTwo);
            request.input('AnswerThree', sql.NVarChar(1000), req.body.AnswerThree);
            request.input('AnswerFour', sql.NVarChar(1000), req.body.AnswerFour);
            request.input('StartFromDate', sql.DATE, req.body.StartFromDate);
            request.input('DestinationBuildingID', sql.NVarChar(500), JSON.stringify(req.body.DestinationBuildingID));
            request.input('DestinationRoleID', sql.NVarChar(500), req.body.DestinationRoleID ? JSON.stringify(req.body.DestinationRoleID) : null);
            request.input('ViewResultDestinationRoleID', sql.NVarChar(500), req.body.ViewResultDestinationRoleID ? JSON.stringify(req.body.ViewResultDestinationRoleID) : null);
        }
    } else {
        logger.info('*** API: Survey/Insert');

        request.input('Question', sql.NVarChar(1000), req.body.Question);
        // request.input('Title', sql.NVarChar(100), req.body.Title);
        request.input('QuestionType', sql.Bit, req.body.QuestionType);
        request.input('AnswerOne', sql.NVarChar(1000), req.body.AnswerOne);
        request.input('AnswerTwo', sql.NVarChar(1000), req.body.AnswerTwo);
        request.input('AnswerThree', sql.NVarChar(1000), req.body.AnswerThree);
        request.input('AnswerFour', sql.NVarChar(1000), req.body.AnswerFour);
        request.input('StartFromDate', sql.DATE, req.body.StartFromDate);
        request.input('DestinationBuildingID', sql.NVarChar(500), JSON.stringify(req.body.DestinationBuildingID));
        request.input('DestinationRoleID', sql.NVarChar(500), req.body.DestinationRoleID ? JSON.stringify(req.body.DestinationRoleID) : null);
        request.input('ViewResultDestinationRoleID', sql.NVarChar(500), req.body.ViewResultDestinationRoleID ? JSON.stringify(req.body.ViewResultDestinationRoleID) : null);
    }

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) {
            logger.error("API: Survey/cud Error: %s", err);
        } else {
            let result = null;
            if (recordset) {
                result = recordset.recordset;
            }
            logger.info('API: Survey/CRU Resul: %j', {code: 200, Response: result});
            // send data as a response
            CheckException.handler(res, result);
            // res.status(200).send(result);
            PushNotification.getSend();
        }
    });
});

//______________________Survey Select_____________________//
router.get('/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: Survey/Select %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "BuildingSurvey_Select";

    // create Request object
    const request = new sql.Request(pool);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Survey/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }

        logger.info('API: Survey/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

//______________________Submit Survey_____________________//
router.post('/opinion/:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        logger.error('API: Survey/Submit **********BadData**********');
        return res.status(400).send('bad data');
    }

    logger.info('API: Survey/Submit %j', {body: req.body, userId: req.userId});

    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "BuildingSurvey_Opinion";

    // create Request object
    const request = new sql.Request(pool);


    //fields
    request.input('BuildingSurveyID', sql.BigInt, req.body.BuildingSurveyID);
    request.input('Answer', sql.TinyInt, req.body.Answer);

    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: Survey/Submit Error: %s", err);
        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }

        logger.info('API: Survey/Submit Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});

router.get('/getBuildingSurveyOpinion/:BuildingSurveyID.:CallerFormID.:CallerBuildingID.:CallerUnitID.:CallerRoleID', function (req, res) {

    logger.info('API: BuildingSurveyOpinion/Select %j', {params: req.params, userId: req.userId});

    //connect to your database
    //sp
    const shema = "dbo";
    const sp = "BuildingSurveyOpinion_Select";

    // create Request object
    const request = new sql.Request(pool);

    //fields
    request.input('BuildingSurveyID', sql.BigInt, req.params.BuildingSurveyID);
    setSqlPublicParam(request,req.params,req.userId, sql.BigInt);
    request.execute(`${shema}.${sp}`, function (err, recordset) {
        if (err) logger.error("API: BuildingSurveyOpinion/Select Error: %s", err);

        let result = null;
        if (recordset) {
            result = recordset.recordset;
        }

        logger.info('API: BuildingSurveyOpinion/Select Resul: %j', {code: 200, Response: result});
        // send data as a response
        // res.status(200).send(result);
        CheckException.handler(res, result);
    });
});


module.exports = router;
