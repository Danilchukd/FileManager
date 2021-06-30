const express = require('express');
const app = express();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const chokidar = require('chokidar');
const path = require('path');
const port = 3000;


app.use(fileUpload({}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '2.html'));
});

app.get('/download', function(req, res){
    const file = `${__dirname}/uploads`;
    res.download(file);
});

app.post('/', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Файл не загружен.');
    }

    let targetFile = req.files.target_file;
    targetFile.mv(path.join(__dirname, 'uploads', targetFile.name), (err) => {
        if (err)
            return res.status(500).send(err);
        res.send('Файл загружен');
    });
});

const watcher = chokidar.watch(process.cwd(), {
    persistent: true
});
watcher.on('ready', () => {
    watcher.on('add', (path) => console.log(`Файл ${path} добавлен`))
        .on('unlink', (path) => console.log(`Файл ${path} удалён`));
});

function getCurrentFilenames() {
    console.log("\nИмена файлов:");
    fs.readdirSync(__dirname).forEach(file => {
        console.log(file);
    });
    console.log("\n");
}


app.listen(port, () => console.log(`Your app listening at http://localhost:${port}`));
