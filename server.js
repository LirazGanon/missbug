const express = require('express')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const path = require('path')
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const bugService = require('./services/bug.service')
const pdfService = require('./services/pdf.service')
const userService = require('./services/user.service')

const app = express()
app.use(connectLiveReload());
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});


// LIST
app.get('/api/bug', (req, res) => {
    const { title, page } = req.query

    const filterBy = {
        title: title || '',
        page: +page || 0,
    }

    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
})

// READ
app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params

    var visitBugs = req.cookies.visitBugs || []

    if (visitBugs.length >= 3) {
        return res.status(401).send('Wait for a bit')
    }

    if (!visitBugs.includes(bugId)) {
        visitBugs.push(bugId)
        res.cookie('visitBugs', visitBugs, { maxAge: 10000, httpOnly: true })
    }

    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
})


// ADD
app.post('/api/bug', (req, res) => {

    const { title, severity, description } = req.body
    const bug = {
        title,
        severity,
        description,
    }

    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
})

// UPDATE
app.put('/api/bug/:bugId', (req, res) => {

    const { title, severity, description, _id, owner } = req.body

    const loggedinUser = userService.validateToken(req.cookies.loginToken)

    if (!loggedinUser || !owner ||
         loggedinUser._id !== owner._id && !loggedinUser.isAdmin) return res.status(401).send('Unauthorized')



    const bug = {
        _id,
        title,
        severity,
        description,
        owner
    }

    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
})

// DELETE
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const { owner } = bugService.getById(bugId)
  
    
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    console.log(loggedinUser.isAdmin,'puki')

if(!loggedinUser.isAdmin){
    if (!loggedinUser || !owner || loggedinUser._id !== owner._id) return res.status(401).send('Unauthorized')
}

    bugService.remove(bugId)
        .then(() => {
            res.send('Removed!')
        })
})

// LOGIN
app.post('/api/auth/login', (req, res) => {
    userService.checkLogin(req.body)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)

            } else {
                res.status(401).send('Invalid login')
            }
        })
})

// SIGNUP
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})


// PDF
app.post('/api/pdf', (req, res) => {
    // const bugs = req.body
    const bugs = bugService.getAllBugs()

    const fileLink = pdfService.buildBugsPDF(bugs)

    res.send(fileLink)
})

app.listen(3030, () => console.log('Server running on port 3030!'))