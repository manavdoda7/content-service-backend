const Chapter = require('../models/chapter');
const Series = require('../models/series');
const nameValidator = require('../validators/nameValidator')
const chaptersValidator = require('../validators/chaptersValidator')
const router = require('express').Router()

/**
 * @swagger
 * /api/upload:
 *  post:
 *      tags: ["Uploading Data"]
 *      parameters: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          title:
 *                              type: string
 *                          chapters:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                      duration:
 *                                          type: string
 *      security:
 *          bearerAuth: []
 *      summary: "Route for uploading a new Web series"
 *      description: "This route requires 3 parameters name, title and chapter details."
 *      responses: 
 *          '200':
 *              description: Series added to database.
 *          '403':
 *              description: Some feilds are missing or incorrect.
 *          '408':
 *              description: Request timeout error.
 * /api/upload/bulkupload:
 *  post:
 *      tags: ["Uploading Data"]
 *      parameters: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          content:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                      title:
 *                                          type: string
 *                                      chapters:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  name:
 *                                                      type: string
 *                                                  duration:
 *                                                      type: string
 *      security:
 *          bearerAuth: []
 *      summary: "Route for uploading multiple new Web series"
 *      description: "This route requires an array as a parameter which has all the web series to be inserted as objects."
 *      responses: 
 *          '200':
 *              description: Series added to database.
 *          '403':
 *              description: Some feilds are missing or incorrect.
 *          '408':
 *              description: Request timeout error.
 */

router.post('/', async(req, res)=>{
    console.log('POST /api/upload request');
    const {name, title, chapters} = req.body
    console.log(req.body);
    if(nameValidator(name)==0 || nameValidator(title)==0 || chaptersValidator(chapters)==0) return res.status(403).json({success:false, message:'Some of the feilds is/are incorrect.'})
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
    if(content.length==0) return res.status(403).json({success:false, message:'Content array empty.'})
    try {
        const d = new Date()
        const uploadDate = String(d.getFullYear()) + "/" +  (String(d.getMonth()+1).length==1?`0${String(d.getMonth()+1)}`:String(1+d.getMonth())) + "/" + String(d.getDate())
        for(let i=0;i<content.length;i++) {
            let {name, chapters, title} = content[i]
            if(nameValidator(name)==0 || nameValidator(title)==0 || chaptersValidator(chapters)==0) return res.status(403).json({success:false, message:('One of the feilds is incorrect in series '+(i+1)+'.')})
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