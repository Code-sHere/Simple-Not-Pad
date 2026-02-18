const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// middleware
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// 🔥 COMMON FILES PATH (public/files)
const FILES_DIR = path.join(__dirname, 'public', 'files');

// home
app.get('/', (req, res) => {
    fs.readdir(FILES_DIR, (err, files) => {
        if (err) return console.log(err);

        if (req.query.file) {
            fs.readFile(
                path.join(FILES_DIR, req.query.file),
                'utf-8',
                (err, data) => {
                    if (err) return console.log(err);

                    res.render('index', {
                        tasks: files,
                        title: req.query.file,
                        descri: data,
                        mode: req.query.mode || 'view'
                    });
                }
            );
        } else {
            res.render('index', {
                tasks: files,
                title: null,
                descri: null,
                mode: null
            });
        }
    });
});

// create
app.post('/create', (req, res) => {
    fs.writeFile(
        path.join(FILES_DIR, `${req.body.title}.txt`),
        req.body.descri,
        (err) => {
            if (err) console.log(err);
            else res.redirect('/');
        }
    );
});

// update
app.post('/update', (req, res) => {
    const { oldTitle, title, descri } = req.body;

    const oldPath = path.join(FILES_DIR, `${oldTitle}.txt`);
    const newPath = path.join(FILES_DIR, `${title}.txt`);

    if (oldTitle === title) {
        fs.writeFile(newPath, descri, 'utf-8', (err) => {
            if (err) console.log(err);
            else res.redirect('/');
        });
    } else {
        fs.rename(oldPath, newPath, (err) => {
            if (err) return console.log(err);

            fs.writeFile(newPath, descri, 'utf-8', (err) => {
                if (err) console.log(err);
                else res.redirect('/');
            });
        });
    }
});

// delete
app.delete('/delete/:title', (req, res) => {
    const filepath = path.join(FILES_DIR, req.params.title);

    fs.unlink(filepath, (err) => {
        if (err) console.log(err);
        res.redirect('/');
    });
});

app.listen(5420, () =>
    console.log('🚀 Server chal raha hai on 5420')
);
