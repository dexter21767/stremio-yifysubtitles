const axios = require('axios').default;
const cheerio = require('cheerio')
const config = require('./config');

// Base URL
const baseURL = config.BaseURL;

async function getSubs(id){
    // Search by IMDB id
    if (!id.startsWith('tt')) id = `tt${id}`
    let searchURL = `${baseURL}/movie-imdb/${id}`
    let body = await axios.get(searchURL).then( response => {
        return response.data;
      } ).catch( ( error ) => {
        console.log( error );
      } )
      if (body){
        let $ = cheerio.load(body)

        // Subtitles list
        let subs = []
        $('table.table tbody tr').each(function() {
          let sub = {
            lang: $(this).find('td').eq(1).text().trim(),
            name: $(this).find('td').eq(2).find('a').text().trim().replace('subtitle ', ''),
            url: `${baseURL}/subtitle/` + $(this).find('td').eq(2).find('a').attr('href').split('/')[2] + '.zip',
            uploader: $(this).find('td').eq(4).text().trim(),
            rating: $(this).find('td').first().text().trim()
          }
          subs.push(sub)
        })
  
        // Available languages
        let langs = Array.from(new Set(subs.map(x => x.lang)))
  
        // Results callback
        if (subs.length > 0) {
          subs.sort((a, b) => b.rating - a.rating)
        } 
        return sortByLang(subs);
      }

}

function sortByLang(subs = Array) {
    try {
      let sorted = {}
      subs.map((e,
        i)=> {
        if (sorted[e.lang.toLowerCase()]) {
          sorted[e.lang.toLowerCase()].push(e)
        } else {
          sorted[e.lang.toLowerCase()] = [e]
        }
      })
      return sorted
    }catch(err) {
      return null
    }
  }

// Export Functions
module.exports = getSubs