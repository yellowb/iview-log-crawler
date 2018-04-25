const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const config = require('../config')

// iView homepage
const url = 'http://i2isd/sites/isdc_ZHA/CDRIVE/Support%20Document/iview/iview_prd.htm';

let scrape = async () => {
    console.log('Opening headless chrome.');
    const browser = await puppeteer.launch({headless: false});   // set to false to view the chrome behavior
    const page = await browser.newPage();
    await page.setViewport({width: 1000, height: 800})

    // Go to homepage
    console.log('Go to iView homepage.');
    await page.goto(url);
    await page.waitFor(5000);

    // Go to 1st WLS_DOM_DOC
    console.log('Go to WLS_DOM_DOC iView page, start to SSO...');
    await page.click('#wlsDisplayTable > tr:nth-child(42) > td:nth-child(4) > a');
    await page.waitFor(3000);

    let pages = await browser.pages();

    // console.log(pages.length);
    // console.log(pages[0].url());
    // console.log(pages[1].url());
    // console.log(pages[2].url());

    // the newly opened page, which mix SSO iframe and content iframe into it.
    let mixedPage = pages[2];
    let frames = await mixedPage.frames();

    // console.log(frames.length);
    // for(let i = 0; i < frames.length; i++) {
    //     console.log(i + ' - ' + frames[i].url() + ' - ' + frames[i].name());
    // }

    // Get the content iframe
    let contentFrame = await frames.find(f => f.name() === 'content_frame');
    if (contentFrame === null) {
        return 0;
    }


    // Open a new page using the content iframe's url
    console.log('Open a new page using the url of content iframe.');
    let contentUrl = contentFrame.url();
    let contentPage = await browser.newPage();
    await contentPage.setViewport({width: 1000, height: 800});
    await contentPage.goto(contentUrl);
    await contentPage.waitFor(3000);
    // Go into a folder
    console.log('Go into the doc folder.');
    await contentPage.click('body > table:nth-child(3) > tbody > tr:nth-child(4) > td > div > table > tbody > tr:nth-child(13) > td:nth-child(4) > p > a');
    await contentPage.waitFor(2000);

    // Get the download link & use a new page to open it
    console.log('Extract the download URL.');
    let downloadLink = await contentPage.$('body > table:nth-child(3) > tbody > tr:nth-child(4) > td > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > p > a:nth-child(3)');


    let cookies = await contentPage.cookies();
    console.log(JSON.stringify(cookies));

    /********* Not work! Puppeteer will timeout at page.goto() when try to download **********/

    // if (!!downloadLink) {
    //
    //     let href = await contentPage.$eval('body > table:nth-child(3) > tbody > tr:nth-child(4) > td > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > p > a:nth-child(3)', el => el.href);
    //
    //
    //     console.log(href);
    //
    //     let downloadUrl = (downloadLink !== null) ? href : null;
    //     console.log('Download URL Found! %s.', downloadUrl);
    //
    //     console.log('Try to download a file.');
    //     let downloadPage = await browser.newPage();
    //     await downloadPage._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: config.downloadedFileDir});
    //     let filesource = await downloadPage.goto(downloadUrl);
    //     // await downloadPage.waitFor(3000);
    //     let buffer = await filesource.buffer();
    //     fs.writeFile("./a.log", buffer, async function (err) {
    //         if (err) {
    //             return console.log(err);
    //         }
    //
    //         console.log("The file was saved!");
    //         await downloadPage.close();
    //         console.log("Download page closed!");
    //     });
    // }
    // else {
    //     console.log('Download URL NOT Found!');
    // }


    console.log('Finished!');
    await browser.close();

    return 0;
};

scrape().then((value) => {
    console.log(value); // Success!
});