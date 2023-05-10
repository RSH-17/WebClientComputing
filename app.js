const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

let user = '';

const app = express();
app.use(express.static(__dirname));

app.listen(52271, () => {
    console.log('upload: http://127.0.0.1:52271');
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    let html = '';
    fs.readFile('./html/index.html', (err, files) => {
        html += files.toString('utf-8');
        
        res.type('text/html');
        res.send(html);
    });
});

app.get('/contents', (req, res) => {
    fs.readdir('./resource/text', (err, files) => {
        let html = '<!DOCTYPE html> \
                    <head> \
                        <meta charset="UTF-8"> \
                        <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"> \
                        <title>Community</title> \
                    </head>\
                    <body>';

        for (i in files) {
            let encode = encodeURI(i);
            html += `<form action="http://127.0.0.1:52271/contents/${encode}" method="get">`;
            html += `<button id="file_btn">${files[i]}</button>`;
            html += '</form>';
        }

        html += '</body></html>';

        res.type('text/html');
        res.send(html);
    });
});

app.get('/contents/:id', (req, res) => {
    const id = req.params.id;

    let html = '<!DOCTYPE html> \
                    <head> \
                        <meta charset="UTF-8"> \
                        <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"> \
                        <title>Community</title> \
                        <link rel="stylesheet" href="../css/index.css"> \
                    </head>\
                    <body>';

    fs.readdir('./resource/text', (err, files) => {
        fs.readFile(`./resource/text/${files[id]}`, (err, data) => {
            const posting = JSON.parse(data);

            html += `<h1>Title: ${posting.title}</h1>`;
            html += `<h2>Author: ${posting.author}</h2>`;
            html += `<h3>Content: ${posting.content}</h3>`;

            html += '</body></html>';

            res.type('text/html');
            res.send(html);
        });
    });
});

app.post('/search', (req, res) => {
    const key = req.body.search;
    
    fs.readdir('./resource/text', (err, files) => {
        let html = '<!DOCTYPE html> \
                    <head> \
                        <meta charset="UTF-8"> \
                        <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"> \
                        <title>Community</title> \
                    </head>\
                    <body>';

        for (i in files) {
            if (files[i].includes(key)) {
                let encode = encodeURI(i);
                html += `<form action="http://127.0.0.1:52271/contents/${encode}" method="get">`;
                html += `<button id="file_btn">${files[i]}</button>`;
                html += '</form>';
            }
        }

        html += '</body></html>';

        res.type('text/html');
        res.send(html);
    });
});


app.post('/', (req, res) => {
    const body = req.body;

    const data = {
        title : body.title,
        content : body.content,
        author : user
    };
    
    fs.readdir('./resource/text', (err, files) => {
        fs.writeFile(`./resource/text/${files.length} ${data.title}.json`, JSON.stringify(data),(err) => {
            if (err) console.log('Error: ', err);
            else console.log('File created'); 
        });
    });

    res.sendFile(__dirname + "/html/index.html");
});

app.post('/post', (req, res) => {
    user = req.body.user;
    res.sendFile(__dirname + "/html/post.html");
});
