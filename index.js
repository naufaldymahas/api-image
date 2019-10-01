const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')

const app = express()
const port = 8080
const db = require('./database')

app.use(bodyParser.json())
app.use(cors())
app.use('/files', express.static('uploads'))

let multerStorageConfig = multer.diskStorage({
    destination: (req, files, cb) => {
        cb(null, './uploads')
    },

    filename: (req, file, cb) => {
        console.log(req)
        cb(null, `PRD-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
})

let filterConfig = (req, file, cb) => {
    if (file.mimetype.split('/')[1] == 'png' || file.mimetype.split('/')[1] == 'jpeg') {
        cb(null, true)
    } else {
        req.validation = {error: true, msg: 'File must be an image'}
        cb(null, false)
    }
}

let upload = multer({
    storage: multerStorageConfig,
    fileFilter: filterConfig
})

app.post('/uploadimage', upload.single('aneh'), (req, res) => {
    let sql = `insert into images values (0, '${req.body.name}', '${req.file.path}')`
    db.query(sql, (err, result) => {
        if (err) throw err
        res.send(result)
        console.log(req)
    })
})

app.get('/getlist', (req, res) => {
    let sql = `select * from images`
    db.query(sql, (err, result)=> {
        if (err) throw err
        res.send(result)
    })
})

app.listen(port, console.log('Listening port ' + port))