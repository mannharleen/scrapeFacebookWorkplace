const puppeteer = require('puppeteer');
const config = require('./config');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(config.startUrl);    
        // init
        await page.click('#u_0_a');  // login. takes you through saml/sso
        await page.waitForSelector('#groupsJumpTitle') // makes sure page is fully loaded with all redirects completed
        await page.click('#u_0_5 > span > span > input') // click somewhere to avoid that weird black screen
        await page.screenshot({ path: 'example.png' });
    
        // start
    
    
        // stop
        await page.waitFor(60000)
        await browser.close();
    }
    catch(e) {
        console.log(e)
    }
    
})();

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