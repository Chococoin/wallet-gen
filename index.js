const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const data = require('./database.json');

const compile = async function(templateName, data){
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`)
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
}

hbs.registerHelper('dateFormat', (value, format) => {
    console.log('formatting', value, format);
    return moment(value).format(format);
});

(async function(){
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('shot-list', data);

        await page.setContent(content);
        await page.emulateMedia('screen');
        await page.pdf({
            path: 'mypdf.pdf',
            format: 'A4',
            printBackground: false
        });

        console.log('done');
        await browser.close();
        process.exit();
    } catch(e){
        console.log('Error: ', e)
    }
})();
