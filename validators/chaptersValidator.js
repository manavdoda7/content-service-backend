function chaptersValidator(chapters) {
    for(let i=0;i<chapters.length;i++) {
        if(/^[A-Za-z\d\s.\-]+$/.test(chapters[i].name)==0) return 0;
        if(/^\d{1,2}:\d{1,2}$/.test(chapters[i].duration)==0) return 0
    }
    return 1
}

module.exports=chaptersValidator