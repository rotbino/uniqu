const express = require('express')
    , router = express.Router();

const logger = require('../utils/winstonLogger');

/*------Android Version-------*/
const ANDROID_VERSION = {
    //***********APAMAN********************
    bazzar      : 139,
    myket       : 139,
    apamanSite  : 139,

    //*******NASIM********
    nasim_bazzar      : 139,
    nasim_myket       : 139,
    nasim_site  : 139,

    //*******ARMANI********
    armani_bazzar      : 139,
    armani_myket       : 139,
    armani_site  : 139,

    //*******Tazh********
    tazh_bazzar      : 139,
    tazh_myket       : 139,
    tazh_site  : 139,

};
const ANDROID_LINK = {
    //********************APAMAN************************
    bazzar      : 'https://cafebazaar.ir/app/ir.monta.montaman',
    myket       : 'https://myket.ir/app/ir.monta.montaman',
    apamanSite  : 'https://www.monta.ir/apaman',


    //**********NASIM*************
    nasim_site        : 'https://www.nasimasayesh.co',
    nasim_bazzar      : 'https://cafebazaar.ir/app/ir.monta.montamanNasim',
    nasim_myket       : 'https://myket.ir/app/ir.monta.nasim',

    //**********ARMANI*************
    armani_site        : 'http://armaniesf.com/',
    armani_bazzar      : 'https://cafebazaar.ir/app/ir.monta.montamanArmani',
    armani_myket       : 'https://myket.ir/app/ir.monta.armani',

    //**********ARMANI*************
    tazh_site        : 'http://tazh.com/',
    tazh_bazzar      : 'https://cafebazaar.ir/app/ir.monta.montamanTazh',
    tazh_myket       : 'https://myket.ir/app/ir.monta.tazh',

};

/*------IOS Version-------*/
const IOS_VERSION = {
    //for apaman
    sibApp      : 130,
    apamanSite  : 139,
    anardoni    : 139,
    iapps       : 139,


    //**********NASIM*************
    nasim_sibApp      : 130,
    nasim_site        : 139,
    nasim_anardoni    : 139,
    nasim_iapps       : 139,


    //**********ARMANI*************
    armani_sibApp      : 130,
    armani_site        : 139,
    armani_anardoni    : 139,
    armani_iapps       : 139,

    //**********Tazh*************
    tazh_sibApp      : 130,
    tazh_site        : 139,
    tazh_anardoni    : 139,
    tazh_iapps       : 139,

};
const IOS_LINK = {

    //********************APAMAN************************
    apamanSite        : 'https://www.monta.ir/apaman',
    sibApp            : 'https://sibapp.com/applications/%D8%A7%D9%BE%D8%A7%D9%85%D9%86',
    anardoni          : 'https://anardoni.com/ios/app/0WXAccz6',
    iapps             : 'https://iapps.ir/app/%D8%A7%D9%BE%D8%A7%D9%85%D9%86/7d9e298d-5adf-4e7a-9643-2285749bbfa5-1c2bae23-005c-4e1c-a497-a3cea86ae7f2',

    //**********NASIM*************
    nasim_site        : 'https://www.nasimasayesh.co',
    nasim_sibApp      : 'https://sibapp.com/applications/nasim-1',
    nasim_anardoni    : 'https://anardoni.com/ios/app/0WXAccz6',
    nasim_iapps       : 'https://iapps.ir/app/%D8%A7%D9%BE%D8%A7%D9%85%D9%86/7d9e298d-5adf-4e7a-9643-2285749bbfa5-1c2bae23-005c-4e1c-a497-a3cea86ae7f2',

    //**********Armani*************
    armani_site       : 'http://armaniesf.com/',
    armani_sibApp     : 'https://sibapp.com/applications/%D8%A7%D9%BE%D8%A7%D9%85%D9%86',
    armani_anardon    : 'https://anardoni.com/ios/app/0WXAccz6',
    armani_iapps      : 'https://iapps.ir/app/%D8%A7%D9%BE%D8%A7%D9%85%D9%86/7d9e298d-5adf-4e7a-9643-2285749bbfa5-1c2bae23-005c-4e1c-a497-a3cea86ae7f2',

    //**********Tazh*************
    tazh_site          : 'http://tazh.com/',
    tazh_sibApp        : 'https://sibapp.com/applications/%D8%A7%D9%BE%D8%A7%D9%85%D9%86',
    tazh_anardon       : 'https://anardoni.com/ios/app/0WXAccz6',
    tazh_iapps         : 'https://iapps.ir/app/%D8%A7%D9%BE%D8%A7%D9%85%D9%86/7d9e298d-5adf-4e7a-9643-2285749bbfa5-1c2bae23-005c-4e1c-a497-a3cea86ae7f2',
};


router.get('/android/:storeName/:currentVersion', function (req, res) {
    logger.info('API: version/Android %j', {params: req.params});
    if (parseInt(req.params.currentVersion) < ANDROID_VERSION[req.params.storeName]) {
        res.set({newVersion: 1, url: ANDROID_LINK[req.params.storeName]}).send();
    }else{
        res.set({newVersion: 0}).send();
    }
});

router.get('/ios/:storeName/:currentVersion', function (req, res) {
    logger.info('API: version/IOS %j', {body: req.params});
    if (parseInt(req.params.currentVersion) < IOS_VERSION[req.params.storeName]) {
        res.set({newVersion: 1, url: IOS_LINK[req.params.storeName]}).send();
    }else {
        res.set({newVersion: 0}).send();
    }
});

module.exports = router;
