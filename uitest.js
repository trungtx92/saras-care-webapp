const puppeteer = require('puppeteer');

(async function main(){
    try {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    await page.goto('http://uat.saras.care');
  //  await page.goto('http://app.saras.care/login');
    await page.waitFor('#hero');
    
    const userType= await page.waitForSelector("#app > div > div.hero-content > div > div > div.col-12.col-lg-6.right > div > a");
    await userType.click();

    const login = await page.waitForSelector("#login > div > div:nth-child(1) > div > input");
    await login.type("Test");

    const passwordlog = await page.waitForSelector("#login > div > div:nth-child(2) > div > input");
    await passwordlog.type("Test");

    const name = await page.waitForSelector("#name");
    await name.type("Test");

    const email = await page.waitForSelector("#email");
    await email.type("test@gmail.com");

    const phone = await page.waitForSelector("#phone");
    await phone.type('0123456789');

    const username =await page.waitForSelector("#username");
    await username.type('John');

    const passwordreg = await page.waitForSelector("#password");
    await passwordreg.type('sarasTest@123');

    const confirmpassword = await page.waitForSelector("#confirmpassword");
    await confirmpassword.type("sarasTest@123");

    await page.screenshot({path:"dist/screenshots/submitmessage.png"});

    await browser.close();
    } catch (e) {
        console.log('Err', e);
    }
})();