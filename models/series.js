const db = require('../middlewares/dbconnection')

class Series {
    constructor(name, title, uploadate) {
        this.name = name
        this.title = title
        this.uploadate = uploadate
    }
    async save() {
        return db.promise().query(`insert into series(name, title, uploadDate) values('${this.name}', '${this.title}', '${this.uploadate}'); select LAST_INSERT_ID() as id;`)
    }
    static async fetchAllSeries() {
        return db.promise().query(`select * from series;`)
    }
    static async fetchSeriesByID(id) {
        return db.promise().query(`select * from series where id = ${id}`)
    }
}

module.exports = Series