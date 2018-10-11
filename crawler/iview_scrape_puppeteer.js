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
    if(contentFrame === null) {
        return 0;
    }


    // Open a new page using the content iframe's url
    console.log('Open a new page using the url of content iframe.');
    let contentUrl = contentFrame.url();
    let contentPage = await browser.newPage();
    // walkaround that allow the headless chrome to download files
    await contentPage._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: config.downloadedFileDir});
    await contentPage.setViewport({width: 1000, height: 800});
    await contentPage.goto(contentUrl);
    await contentPage.waitFor(2000);
    // Go into a folder
    console.log('Go into the doc folder.');
    await contentPage.click('body > table:nth-child(3) > tbody > tr:nth-child(4) > td > div > table > tbody > tr:nth-child(13) > td:nth-child(4) > p > a');
    await contentPage.waitFor(1000);
    // Click the download link
    console.log('Try to download a file.');
    await contentPage.click('body > table:nth-child(3) > tbody > tr:nth-child(4) > td > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > p > a:nth-child(3)');
    await contentPage.waitFor(10000);

    // If no error, the file will be downloaded.

    console.log('Finished!');
    await browser.close();

    return 0;
};

scrape().then((value) => {
    console.log(value); // Success!
});