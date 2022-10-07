const yify = require('./yifyAPI.js');
const config = require('./config');
require('dotenv').config();
const languages = require('./languages.json');
const count = 10;
const NodeCache = require("node-cache");
const Cache = new NodeCache();
const filesCache = new NodeCache();
const SearchCache = new NodeCache();
const subsceneCache = new NodeCache();

async function subtitles(type, id, lang) {
    const cachID = `${id}_${lang}`;
    let cached = Cache.get(cachID);
    if (cached) {
        console.log('cached main', cachID, cached);
        return cached
    } else {
        let subtitleslist = SearchCache.get(id);
        if (!subtitleslist) {
            subtitleslist = await yify(id);
            if (subtitleslist) {
                SearchCache.set(id, subtitleslist);
            }
        }
        //console.log(subtitleslist)
        if (subtitleslist && subtitleslist[lang]) {
            let subtitles = subtitleslist[lang];
            const subs = [];
            for (let i = 0; i < subtitles.length; i++) {
                let value = subtitles[i];
                if (value) {
                    let sublink = value.url.replace('https://www.yifysubtitles.org','https://yifysubtitles.org')
                    let link = value.url.replace(config.BaseURL,'')
                    let referer = link.replace('.zip','')  
                    let options = `d=${encodeURIComponent(config.BaseURL)}&h=User-Agent:${encodeURIComponent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36')}`;
                    let url = `http://127.0.0.1:11470/proxy/${options}${link}`;
                    //https://www.yifysubtitles.org/subtitle/nope-2022-arabic-yify-443681.zip
                    //
                    subs.push({
                        lang: languages[lang].iso || languages[lang].id,
                        id: `${cachID}_${i}`,
                        url: `http://127.0.0.1:11470/subtitles.vtt?from=${encodeURIComponent(value.url)}`
                    });
                }
            } 
            //console.log('subs', subs);
            console.log("Cache keys", Cache.keys());
            //subs = subs.filter(Boolean);
            let cached = Cache.set(cachID, subs);
            console.log("cached", cached)
            return subs;
        } else {
            return
        }
    }
}


module.exports = subtitles;