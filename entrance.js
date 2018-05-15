const fs = require('fs');
// const sleep = require('sleep');
const http = require('http');
const child_process = require('child_process');
const { download } = require('./downFromList');
const { Builder, By, until, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let keyword = 'husky';
let amount = 30;
// console.log('__dirname: ' + __dirname);
let dir = __dirname + '/pic/';

const css = '#wrapper #imgContainer #imgid .imgpage .imglist .imgitem';

let options = new firefox.Options();
// options.headless();  
// options.setPreference('permissions.default.image', 2);
const driver = new Builder().forBrowser('firefox').setFirefoxOptions(options).build();

let search = () => {

    //会在本目录寻找驱动文件

    (async function main() {

        await driver.get('https://pic.baidu.com');
        await driver.wait(until.elementLocated({ css: '#kw' }), 3000, '网络响应超时');

        // driver.actions({ bridge: true }).move({ x: 0, y: 0, origin: driver.findElement({ css: '#kw' }) }).perform();

        // if (confirm('really?')) { driver.quit() }

        //Creates a condition that will loop until an element is found with the given locator.
        await driver.findElement(By.id('kw')).sendKeys(keyword, Key.RETURN);
        (function loop() {
            driver.executeScript('window.scrollTo(0,document.body.scrollHeight)');
            driver.sleep(300);
            driver.executeScript(`return document.querySelectorAll('${css}').length`).then((l) => {
                if (l >= amount) {
                    // console.log(l);
                    driver.executeScript(`return Array.from(document.querySelectorAll('${css}')).map((i)=>i.getAttribute('data-objurl'))`).then((arr) => {
                        // 返回的数据类型是尽可能的相似,所以这里直接返回arr



                        download(arr, amount, dir);
                        console.log('hi');
                        child_process.exec('open ' + dir);
                        // setTimeout(() => {
                        // console.log('网络超时,但下载了尽可能多的图片');
                        // driver.quit();
                        // process.exit(0);
                        // }, amount * 1000);
                    })
                    return;
                } else {
                    //利用递归实现同步
                    loop();
                }
            });
        })();

    })();
}

search();