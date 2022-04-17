const Chapter = require('../models/chapter');
const Series = require('../models/series');
const intValidator = require('../validators/intValidator')
const router = require('express').Router()

/**
 * @swagger
 * /api/view/:
 *  get:
 *      tags: ["Viewing Metadata"]
 *      parameters: []
 *      security:
 *          bearerAuth: []
 *      summary: "Route for viewing all the metadata."
 *      description: "This route lists all the metadata dividing it into series and chapters."
 *      responses: 
 *          '200':
 *              description: Lists all the web series.
 *          '408':
 *              description: Request timeout error.
 * /api/view/{id}:
 *  get:
 *      tags: ["Viewing Metadata"]
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: ID of the show.
 *          required: true
 *          type: integer
 *      security:
 *          bearerAuth: []
 *      summary: "Route for viewing the details about a particular web series."
 *      description: "This route enlists the information about a particular web series and all the chapters of that series."
 *      responses: 
 *          '200':
 *              description: Lists all the details of web series and chapters.
 *          '403':
 *              description: Series ID doesn't exist.
 *          '408':
 *              description: Request timeout error.
 */

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
    console.log(typeof(req.params.id), req.params.id);
    if(!intValidator(req.params.id)) return res.status(403).json({success:false, message:'Invalid series ID.'})
    console.log(`GET /api/view/${req.params.id}`);
    let series, chapters
    try {
        series = await Series.fetchSeriesByID(req.params.id)
        series = series[0]
        series = series[0]
        if(series==undefined) return res.status(403).json({success:false, message:'Invalid series ID.'})
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