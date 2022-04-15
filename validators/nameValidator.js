function nameValidator(name) {
    return /^[A-Za-z\d\s.\-]+$/.test(name)
}

module.exports=nameValidator