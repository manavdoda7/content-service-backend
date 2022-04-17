const checkAuth = require('../middlewares/checkAuth');
const Series = require('../models/series');
const url = require('../url');
const axios = require('axios');
const Chapter = require('../models/chapter');
const intValidator = require('../validators/intValidator')

const router = require('express').Router()


/**
 * @swagger
 * /api/user/:
 *  get:
 *      tags: ["User Routes"]
 *      parameters: []
 *      summary: "Route for viewing all the unlocked content for a user."
 *      description: "This route lists all the webseries and their unlocked chapters for a user."
 *      responses: 
 *          '200':
 *              description: Lists all the unlocked content.
 *          '403':
 *              description: User unauthorized.
 *          '408':
 *              description: Request timeout error.
 * /api/user/series/{id}:
 *  get:
 *      tags: ["User Routes"]
 *      parameters: 
 *        - name: id
 *          in: path
 *          description: ID of the show.
 *          required: true
 *          type: integer
 *      summary: "Route for viewing the details and unlocked episodes of a particular web series."
 *      description: "This route enlists the information about a particular web series and all the unlocked chapters of that series."
 *      responses: 
 *          '200':
 *              description: Lists all the details of web series and unlocked content.
 *          '403':
 *              description: Series ID doesn't exist or user unauthorized.
 *          '408':
 *              description: Request timeout error.
 */

router.get('/', checkAuth, async(req, res)=>{
    console.log('GET /api/user request');
    let series
    try {
        await axios.post(url+'api/dailypass/', {"body":""}, {
            headers: {
                authorization: req.headers.authorization
            }
        })
        series = await Series.fetchAllSeries()
        series = series[0]
        for(let i=0;i<series.length;i++) {
            let date = series[i].uploadDate
            let chaptersCount = 3
            await axios.post(url+'api/dailypass/'+req.username, {date}).then(response=>{
                chaptersCount += response.data.count
            })
            console.log(chaptersCount);
            let chapters = await Chapter.fetchNChapters(series[i].id, chaptersCount)
            series[i].chapters = chapters[0]
        }
    } catch(err) {
        console.log('Error in fetching series data. ', err);
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, series:series})
})

router.get('/series/:id', checkAuth, async(req, res)=>{
    if(!intValidator(req.params.id)) return res.status(403).json({success:false, message:'Series id should be an integer'})
    console.log('GET /api/user/series request');
    let series
    try {
        await axios.post(url+'api/dailypass/', {"body":""}, {
            headers: {
                authorization: req.headers.authorization
            }
        })
        series = await Series.fetchSeriesByID(req.params.id)
        series = series[0]
        for(let i=0;i<series.length;i++) {
            let date = series[i].uploadDate
            let chaptersCount = 3
            await axios.post(url+'api/dailypass/'+req.username, {date}).then(response=>{
                chaptersCount += response.data.count
            })
            console.log(chaptersCount);
            let chapters = await Chapter.fetchNChapters(series[i].id, chaptersCount)
            series[i].chapters = chapters[0]
        }
    } catch(err) {
        console.log('Error in fetching series data. ', err);
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, series:series})
})

module.exports = router