const puppeteer = require('puppeteer');
const config = require('./config');

const MAXNUMLIKES = 2;
const LIKEorUNLIKE_1or2 = 2;
// const browser
// const page

(async () => {
    try {
        // before init
        const browser = await puppeteer.launch({ headless: false });
        const context = browser.defaultBrowserContext();
        await context.overridePermissions('https://originenergy.workplace.com', ['geolocation']);
        const page = await browser.newPage();
        await page.goto(config.startUrl);
        
        // init
        await page.click('#u_0_a');  // login. takes you through saml/sso
        await page.waitForSelector('#groupsJumpTitle') // makes sure page is fully loaded with all redirects completed
        await page.click('span > span > input') // click somewhere to avoid that weird black screen        
        await page.waitForSelector('._4t35') // wait for "create group" element on the page
        
        // start
        let likeInfos = await page.evaluate(() => {
            return [...document.querySelectorAll('._4-u2.mbm._4mrt._5jmm._5pat._5v3q._7cqq._4-u8 span._81hb')].map(x => x.textContent)
        })

        let totalNumLikes = likeInfos.length / 2
        console.log('Total likes on the current page = ', totalNumLikes)
        let displayValue = []
        let actualValue = []

        likeInfos.forEach((x, idx) => {
            if (idx % 2 === 0) {
                actualValue.push(x)
            }
            else {
                displayValue.push(x)
            }
        })


        let toClickIds = []
        for (let i = 0; i < totalNumLikes; i++) {            
            let predicate
            if (LIKEorUNLIKE_1or2 === 1) { predicate = actualValue[i] === displayValue[i]}
            else if (LIKEorUNLIKE_1or2 === 2) { predicate = actualValue[i] !== displayValue[i] }
            if (predicate) {
                // get only those wheich havent already been liked
                let toClickId = await page.evaluate((nth) => {
                    // get the unique id from parent of the like button
                    let reqId = document.querySelectorAll('._4-u2.mbm._4mrt._5jmm._5pat._5v3q._7cqq._4-u8 ._6a-y._3l2t._18vj')[nth].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id
                    return reqId
                }, i)
                toClickIds.push(toClickId)
                if (toClickIds.length >= MAXNUMLIKES ) {
                    break
                }
            }                       
        }
        console.log('toClickIds = ', toClickIds)

        // use the id and actually click the like button
        for (let i = 0; i< toClickIds.length; i++) {
            toClickId = toClickIds[i]
            let selector = '#' + toClickId + ' ._6a-y._3l2t._18vj'
            if (LIKEorUNLIKE_1or2 === 1) console.log('Going to LIKE post with id = ', selector)
            else if (LIKEorUNLIKE_1or2 === 2) console.log('Going to UNLIKE post with id = ', selector)
            
            await page.hover(selector);            
            await page.click(selector)

            if (LIKEorUNLIKE_1or2 === 1) console.log('we just LIKED a post with id = ', toClickId)
            else if (LIKEorUNLIKE_1or2 === 2) console.log('we just UNLIKED a post with id = ', toClickId)            
        }        
        // stop
        stop(browser, page)
    }
    catch (e) {
        console.log(e)
        stop(browser, page)
    }
})();

async function stop(browser, page) {
    console.log('THE END')
    // await page.waitFor(600000)
    await browser.close();
}

// some notes [outdated notes]:
/*
# each post has 2 "likes information"
// all even show total liked count
// all odd elements show what is displayed
document.querySelector('._4-u2.mbm._4mrt._5jmm._5pat._5v3q._7cqq._4-u8 span._81hb').textContent

# likes information i.e. what is displayed eg. "you and xx". (sames as odd above)
document.querySelector('._4-u2.mbm._4mrt._5jmm._5pat._5v3q._7cqq._4-u8 #js_ib > span._81hb').textContent

#like button
document.querySelector('._4-u2.mbm._4mrt._5jmm._5pat._5v3q._7cqq._4-u8 ._3_16._6a-y._3l2t._18vj')
*/