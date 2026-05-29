const translate = require('translate-google')

const translateText = async (text, from, to) => {
    try {
        const translated = await translate(text, {
            from,
            to,
        })

        return translated
    } catch (error) {
        console.log(error)

        return text
    }
}

module.exports = translateText