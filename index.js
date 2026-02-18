const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


//middleware


const methodOverride = require('method-override');
app.use(methodOverride('_method'));


//home
app.get('/', (req, res) => {
    const filepath = path.join(__dirname, 'files');

    fs.readdir(filepath, (err, files) => {
        if (err) return console.log(err);

        if (req.query.file) {
            fs.readFile(
                path.join(filepath, req.query.file),
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
                mode:null
            });
        }
    });
});

app.post('/create', (req, res) => {
    fs.writeFile(path.join(__dirname, 'files', `${req.body.title}.txt`), req.body.descri, (err) => {
        if (err) console.log(err);
        else res.redirect('/');
    })
})

app.post('/update', (req, res) => {

    const { oldTitle, title, descri } = req.body;

    const oldpath = path.join(__dirname, 'files', `${oldTitle}.txt`);
    const newpath = path.join(__dirname, 'files', `${title}.txt`);

    if (oldTitle === title) {
        fs.writeFile(newpath, descri, 'utf-8', (err) => {
            if (err) console.log(err);
            else res.redirect('/');
        });
    } else {
        fs.rename(oldpath, newpath, (err) => {
            if (err) console.log(err);

            fs.writeFile(newpath, descri, 'utf-8', (err) => {
                if (err) console.log(err);
                else res.redirect('/');
            })
        })
    }
})


app.delete('/delete/:title',(req,res)=>{
    const filepath = path.join(__dirname, 'files', `${req.params.title}`);

    fs.unlink(filepath,(err)=>{
        if(err) console.log(err);
        return res.redirect('/');
    })
     
})


app.listen(5420, () => console.log("🚀 Server chal raha hai on 5420"))