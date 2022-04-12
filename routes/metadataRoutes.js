const Chapter = require('../models/chapter');
const Series = require('../models/series');

const router = require('express').Router()

router.get('/', async(req, res)=>{
    console.log('GET /api/ request');
    let series, chapters
    try {
        series = await Series.fetchAllSeries()
        series = series[0]
        chapters = await Chapter.fetchAllChapters()
        chapters = chapters[0]
        for(let i=0;i<series.length;i++) series[i].episodes = []
        for(let i=0;i<chapters.length;i++) {
            series[chapters[i].seriesId - 1].episodes.push(chapters[i])
        }
    } catch(err) {
        console.log('Error in fetching shows.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, result:series})
})

router.get('/:id', async(req, res)=>{
    console.log(`GET /api/view/${req.params.id}`);
    let series, chapters
    try {
        series = await Series.fetchSeriesByID(req.params.id)
        series = series[0]
        series = series[0]
        chapters = await Chapter.fetchChaptersBySeriesID(req.params.id)
        chapters = chapters[0]
        series.chapters = chapters
    } catch(err) {
        console.log('Error in fetching series', err);
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    res.status(200).json({success:true, series:series})
})

module.exports = router