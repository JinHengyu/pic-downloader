const fs = require('fs');
const http =require('http');

//枚举
const type = ['jpeg', 'jpg', 'png', 'gif'];


exports.download = (list, amount, dir) => {
    if (!fs.existsSync(dir)) fs.mkdir(dir);

    // let i = 0;
    for (let i in list) { //高并发  //IO操作都是异步的

        // if (i >= amount) {
            // console.log('全部完成');
            // callback();
            // child_process.exec('open ' + diretory);
            // driver.quit();
            // return;
        // };
        http.get(list[i], function (res) {
            res.setEncoding('binary');//转成二进制
            var content = '';
            res.on('data', function (data) {
                content += data;    //二进制可像字符串叠加
            }).on('end', function () {
                let mime = res.headers["content-type"];
                let ext;
                if (mime && type.indexOf(ext) !== -1) {
                    ext = mime.match('[^/]*$')[0];
                    //有时候content-type是octet-stream......这时候浏览器根据url名后缀给文件命名
                    // if (type.indexOf(ext) === -1)
                } else
                    ext = list[i].match(/[^.]*$/)[0].split(/(\?|%)/)[0];
                let fileName = `${i}.${ext}`;
                fs.writeFile(dir + fileName, content, 'binary', function (err) {
                    if (err) { };
                    console.log(i + '\t成功');
                    // sleep.msleep(parseInt(Math.random()*1000));
                });
                // loop(++i);
            });
        }).on('error', (err) => {   //中断整个程序?
            console.log(i + '\t!失!败!:')
            console.log(err);
            // loop(++i);
        });
    }
}