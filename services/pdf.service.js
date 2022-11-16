const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = {
    buildBugsPDF,
}

function buildBugsPDF(bugs, filename = 'public/pdf/bugs.pdf') {
    const doc = new PDFDocument();
    const localPath = `pdf/pdf_${_makeId()}.pdf`
    filename = `public/${localPath}`
    doc.pipe(fs.createWriteStream(filename));
    bugs.forEach((bug, idx) => {

        doc.fontSize(25);
        doc.text(bug.title, {
            width: 500,
            align: 'center',
            underline: true
        }
        );

        doc.fontSize(20);
        doc.fillColor('red')
        doc.text('Severity: ' + bug.severity, {
            width: 500,
            align: 'center',
        }
        );

        doc.fontSize(18);
        doc.fillColor('black')
        doc.moveDown();
        doc.text(bug.description, {
            width: 500,
            align: 'left'
        }
        );
        console.log(idx, bugs.length, 'line 39')
        if (idx === bugs.length - 1) return
        doc.moveDown();
        doc.image(`data/bugs.png`, {
            fit: [500, 30],
            align: 'center'
        })
        doc.moveDown();

    })
    doc.end();

    setTimeout(() => {
        fs.unlinkSync(filename)  
    }, 10000);
    return localPath
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}


