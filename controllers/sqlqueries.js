let createcontent = "create table if not exists series(" +
                    "id int primary key auto_increment," +
                    "name varchar(500)," +
                    "title varchar(1000)," +
                    "uploadDate varchar(50));"

let createChapters = "create table if not exists chapters(" +
                    "id int primary key auto_increment," +
                    "seriesId int," +
                    "name varchar(500)," +
                    "duration varchar(50)," +
                    "foreign key(seriesId) references series(id) on update cascade on delete cascade);"

module.exports = {createcontent, createChapters}