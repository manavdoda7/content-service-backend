const Chapter = require('../models/chapter');
const Series = require('../models/series');

const router = require('express').Router()

router.post('/upload', async(req, res)=>{
    console.log('POST /api/upload request');
    const {name, title, chapters} = req.body
    try {
        const d = new Date()
        const uploadDate = String(d.getFullYear()) + "/" +  (String(d.getMonth()+1).length==1?`0${String(d.getMonth()+1)}`:String(1+d.getMonth())) + "/" + String(d.getDate())
        const series = new Series(name, title, uploadDate)
        var id = await series.save()
        id = id[0]
        id = id[1]
        id = id[0].id
        for(let i=0;i<chapters.length;i++) chapters[i].seriesId = id
        const Chapters = new Chapter(chapters)
        Chapters.save()
    } catch(err) {
        console.log('Error in saving to DB', err);
        res.status(408).json({success:false, message:'Please try again after sometime.'})
        return
    }
    res.status(200).json({success:true, message:'Series and Chapters created.'})
})

router.post('/bulkupload', async(req, res)=>{
    console.log('POST /api/bulkupload request');
    let {content} = req.body
    try {
        const d = new Date()
        const uploadDate = String(d.getFullYear()) + "/" +  (String(d.getMonth()+1).length==1?`0${String(d.getMonth()+1)}`:String(1+d.getMonth())) + "/" + String(d.getDate())
        for(let i=0;i<content.length;i++) {
            let {name, chapters, title} = content[i]
            let series = new Series(name, title, uploadDate)
            var id = await series.save()
            id = id[0]
            id = id[1]
            id = id[0].id
            for(let i=0;i<chapters.length;i++) chapters[i].seriesId = id
            let Chapters = new Chapter(chapters)
            Chapters.save()
        }
    } catch(err) {
        console.log('Error in saving to DB', err);
        res.status(408).json({success:false, message:'Please try again after sometime.'})
        return
    }
    res.status(200).json({success:true, message:'Series and Chapters created.'})
})

module.exports = router