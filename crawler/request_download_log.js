const fs = require('fs');
const request = require('request');
const rp = require('request-promise-native');

const logger = require('../logger').logger;

const options = {
    url: 'http://hkgcvpd00040:1234/iview/servlet/DownloadFile?apps=iris4&dirname=/home/ir4logs/ir4domdoc/logs/doc&filename=docExceptions.log',
    encoding: null,
    headers: {
        'Cookie': 'USER_NAME=T1RLAQKkf8BNa062OahNLy9Dis6Fdpoj0xAcrW5mXKjDV5eEPTiYfNoQAACgUSpzatLryHOxpkYG_kx9McaEucrOum6gd1-xyDTuvU8YSK5fkDkKWYulLpLTEXXADisPuNi34xG3WoySaDjIF9i8ZpXqeAdYGYInOFQLCFMPleKo_MEjB17SQ44vvHE7Gd977GXT-640tW17VSvVUL_J_zvP4QWTmCylUrPOo7DAB5F3wbcxQ1rDF1rkj13LirQNFuFzujqFvJVpsooVIQ**; USER_ID=HUANGYE2; JSESSIONID=E5E3DF119AA572098684858B51214C6E'
    }
};

const options1 = {
    url: 'http://hkgcvpd00040:1234/iview/servlet/DownloadFile?apps=iris4&dirname=/home/ir4logs/ir4domdoc/logs/doc&filename=docExceptions.log.1',
    encoding: null,
    headers: {
        'Cookie': 'USER_NAME=T1RLAQKkf8BNa062OahNLy9Dis6Fdpoj0xAcrW5mXKjDV5eEPTiYfNoQAACgUSpzatLryHOxpkYG_kx9McaEucrOum6gd1-xyDTuvU8YSK5fkDkKWYulLpLTEXXADisPuNi34xG3WoySaDjIF9i8ZpXqeAdYGYInOFQLCFMPleKo_MEjB17SQ44vvHE7Gd977GXT-640tW17VSvVUL_J_zvP4QWTmCylUrPOo7DAB5F3wbcxQ1rDF1rkj13LirQNFuFzujqFvJVpsooVIQ**; USER_ID=HUANGYE2; JSESSIONID=E5E3DF119AA572098684858B51214C6E'
    }
};

// let scrape = async () => {
//     let response = rp(options);
//     response.pipe(fs.createWriteStream('loglog.log'));
//     await response;
//
//     console.log("1");
//
//     response = rp(options1);
//     response.pipe(fs.createWriteStream('loglog.log.1'));
//     await response;
//
//     console.log("2");
//
//     return 2;
// };
//
// scrape().then(function (val) {
//     console.log('done %d', val);
// });

// let scrape = async () => {
//
//     let res = await rp.get(options);
//     fs.writeFileSync('loglog.log', res);
//     console.log(1);
//
//     res = await rp.get(options1);
//     fs.writeFileSync('loglog.log.1', res);
//     console.log(2);
//
//
//     return 2;
//
//     // rp.get(options)
//     //     .then(function (res) {
//     //         // const buffer = Buffer.from(res, 'utf8');
//     //         fs.writeFileSync('loglog.log', res);
//     //     });
// };
//
// scrape().then(function (val) {
//     console.log('done %d', val);
// });


/***************************** Better code *****************************/

let extractFileNameFromUrl = (url) => {
    let key = 'filename=';
    let startIdx = url.indexOf(key);
    let keyLength = key.length;
    return url.substring(startIdx + keyLength);
};

let downloadFile = async (options) => {
    let fileName = extractFileNameFromUrl(options.url);
    let res = await rp.get(options);
    fs.writeFileSync('C:\\' + fileName, res);
    logger.info(`Done: ${options.url}`);
};

let downloadFiles = async () => {

    logger.info('Start to download...');

    let links = [options, options1];
    for(let i = 0; i < links.length; i++) {
        await downloadFile(links[i]);
        logger.info(`Looped: ${i}`);
    }
    return links.length;
};

downloadFiles().then(function (val) {
    logger.info(`Finished: ${val}`);
});

// request(options).pipe(fs.createWriteStream('loglog.log'));
//
// console.log('ssss');