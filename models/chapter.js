const db = require("../middlewares/dbconnection")

class Chapter {
    constructor(chapters) {
        this.chapters = chapters
    }
    async save() {
        let q = `insert into chapters(seriesId, name, duration)  values `
        for(let i=0;i<this.chapters.length;i++) {
            q+=`('${this.chapters[i].seriesId}', '${this.chapters[i].name}', '${this.chapters[i].duration}')`
            if(i<this.chapters.length-1) q+=','
        }
        console.log(q);
        return db.promise().query(q)
    }
}

module.exports = Chapter