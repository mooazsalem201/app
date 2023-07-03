const express = require('express');
const puppeteer = require('puppeteer');
const urlParse = require('url-parse');

const app = express();



app.get('/flag', async (req, res) => {

    try {
        const clientIp = req.socket.remoteAddress;
        if (clientIp !== '127.0.0.1' && clientIp !== '::1' && clientIp !== '::ffff:127.0.0.1') {
            res.status(403).send('Forbidden this endpoint is only allowed from localhost');
            //console.log(clientIp);
            return;
        }else{

        var Flag = "EGCERT{PlaceHolder}"
        res.send(Flag);
    }

    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Unknown Error');
    }
});


app.get('/render', async (req, res) => {


    try {

        // Check if URL format is valid
        const parsedUrl = urlParse(req.query.url);
        if (parsedUrl.hostname === '' || parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            res.status(400).send('Invalid URL format, Only http,https are allowed');
            return;
        }

        // Check if image extension is valid
        const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.bmp'];
        const extension = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(extension)) {
            res.status(400).send('Invalid image extension, Only: png, jpg, jpeg, gif, TIFF, BMP. are allowed');
            return;
        }



        // Take screenshot

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        page.setJavaScriptEnabled(false)
        const response = await page.goto(req.query.url);

        // Check if response status is 200
        if (response.status() !== 200) {
            res.status(400).send('Invalid response status');
            await browser.close();
            return;
        }


        //check content type
        if (!/^image\//i.test(response.headers()['content-type'])) {
            res.status(400).send('Invalid content type');
            return;
        }

        const screenshot = await page.screenshot({
            type: 'png'
        });
        await browser.close();

        res.setHeader('content-type', 'image/png');
        res.send(screenshot);


    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Unknown Error');
    }

    //  Todo add watermark to the image
});

app.listen(1337, () => {
    console.log('Server listening on port 1337');
});
