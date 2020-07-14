const logger = require('./winstonLogger');

function setSqlPublicParam(sqlReq,params,userId, BigInt) {
    if(params.CallerUnitID =='null') {
        params.CallerUnitID =null;
    }
    if(params.CallerFormID && params.CallerFormID!='null'){
        sqlReq.input('CallerFormID', BigInt, params.CallerFormID);
    }

    sqlReq.input('CallerBuildingID', BigInt, params.CallerBuildingID);
    sqlReq.input('CallerUnitID', BigInt,params.CallerUnitID);
    sqlReq.input('CallerRoleID', BigInt, params.CallerRoleID);
    sqlReq.input('CallerUserID',BigInt, userId);
}
module.exports = setSqlPublicParam;


