const fs = require('fs')
const gBugs = require('../data/bug.json')

module.exports = {
    query,
    getById,
    remove,
    save,
    getAllBugs
}

const itemsPerPage = 2

function query(filterBy) {
    let entities = gBugs
    if (!gBugs || gBugs.length === 0) {
        entities = _createDefaultBugs()
        _saveBugsToFile(entities)
    }

    const { title, page } = filterBy

    const regex = new RegExp(title, 'i')
    let filteredBugs = entities.filter((bug) => regex.test(bug.title))
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
    filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
    return Promise.resolve({ totalPages, filteredBugs })
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const idx = gBugs.findIndex(currBug => currBug._id === bug._id)
        gBugs[idx] = bug
    } else {
        bug._id = _makeId()
        gBugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}



function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile(val = gBugs) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(val, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function getAllBugs() {
    return gBugs
}

function _createDefaultBugs() {
    return [
        {
            _id: 'b101',
            title: 'Button is missing',
            severity: 1,
            description: 'skdjskdjskdjskadj jsdbcj jdbn du n dlks j kds kdflj lds jkdsgj slk kds jas',
            owner:
            {
                username: "puki",
                _id: "zQuW7"
            },
        },
        {
            _id: 'b102',
            title: 'Error while watching',
            severity: 2,
            description: 'skdjfdd dd d d d sd d skdjskdjskadj jsdbcj jdbn du n dlks j kds kdflj lds jkdsgj slk kds jas',

            owner:
            {
                username: "puki",
                _id: "zQuW7"
            },
        },
        {
            _id: 'b103',
            title: 'Warning appears',
            severity: 3,
            description: 'skdjskdjsk  sfsd fadsf ded djskadj jsdbcj jdbn du n dlks j kds kdflj lds jkdsgj slk kds jas',

            owner:
            {
                username: "puki",
                _id: "zQuW7"
            },
        },
    ]
}