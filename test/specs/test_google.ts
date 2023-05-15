import { Browser } from 'webdriverio';

// Define an array of resolutions
const resolutions = [
  { width: 800, height: 800 },
  { width: 1200, height: 800 },
  { width: 1600, height: 800 },
];

    /*
     * Each of these three tests:
     * 1. Navigates to Google
     * 2. Accepts cookies (if applicable)
     * 3. Searches for the string "MoroSystems" in Google
     * 4. Navigates to the webpage "https://www.morosystems.cz"
     * 5. Tries to find a link with the text "Kariéra" and click it
     * 
     * Note:
     * There are three different layouts of the page "https://www.morosystems.cz" based on the browser resolution.
     * The following code doesn't test that a particular resolution has the particular layout,
     * it rather tests that the link with the text "Kariéra" can be found in each of them.
     */

 describe('Google search GUI test', () => {

  resolutions.forEach((resolution, index) => {

    it(`Test ${index + 1} - Resolution: ${resolution.width}x${resolution.height}`, async () => {

        await browser.setWindowSize(resolution.width, resolution.height);
        // Navigate to Google and refresh the page
        await browser.url(`https://www.google.com/`);
        await browser.refresh();

        // Wait for the cookie accept button to appear
        const cookieButton = await $('#L2AGLb');
        try {
            await cookieButton.waitForDisplayed({ timeout: 5000 });
            await cookieButton.click();
          } catch (error) {
            if (!await cookieButton.isExisting()) {
              console.log('Accept cookies element not found after 5 seconds. Continuing with test execution.');
            } else {
              throw new Error(error);
            }
          }
        
        // Fill in the search bar
        const searchBar = await $('textarea[name="q"]');
        await expect(searchBar).toBeExisting();
        await searchBar.setValue('MoroSystems');

        // Click submit button - this is by no means pretty, but it works
        const submitButton = await $('/html/body/div[1]/div[3]/form/div[1]/div[1]/div[4]/center/input[1]');
        await expect(submitButton).toBeExisting();
        await submitButton.click();

        // Check the correct URL is on the page and click it
           // TODO: If browser/OS is set to EN, it finds the .com equivalent.
           // It should be researched further and accounted for.
        const expectedUrl = 'https://www.morosystems.cz';
        const citeElement = await $('//cite[contains(text(),"'+expectedUrl+'")]');
        await expect(citeElement).toBeExisting();
        const linkElement = await citeElement.$('../../../../..//a');
        await linkElement.click();
        await expect(browser).toHaveUrl(expectedUrl+"/");

        // Wait until page is fully loaded
        await browser.waitUntil(async () => {
          const readyState = await browser.execute(() => document.readyState);
          return readyState === 'complete';
        }, {
          timeout: 10000, // maximum wait time in milliseconds
          timeoutMsg: 'Page did not load within 10 seconds'
        });

        // Find a displayed element in the navigation that contains the text "O nás"
        const aboutUsLinks = await $$('//li//a[contains(text(),"O nás")]');

        let displayedAboutLink;
        for (let link of aboutUsLinks) {
          if (await link.isDisplayedInViewport()) {
            displayedAboutLink = link;
            break;
          }
        }

        // Find link in navigation that contains the text "Kariéra"
        let careerLink;
        if(!displayedAboutLink){
          console.log('INFO: "Kariéra" is hidden in the burger menu.');
          const burgerMenu = await $('//a[contains(@class,"m-main__burger")]');
          await burgerMenu.click();
          careerLink = await $('//a[contains(text(),"Kariéra")][contains(@class,"m-main__link")]');
        }else{
          const classValue = await displayedAboutLink.getAttribute('class');
          if (classValue.includes('js-toggle-submenu')) {
            console.log('INFO: "Kariéra" is hidden under "O nás".');
            displayedAboutLink.moveTo();
            careerLink = await $('//a[contains(text(),"Kariéra")][contains(@class,"dropdown__link")]');
          } else {
            console.log('INFO: "Kariéra" is in the main menu.');
            careerLink = await $('//a[contains(text(),"Kariéra")][contains(@class,"m-main__link")]');
          }
        }

        // Click the "Kariéra" link and check the URL
        await careerLink.waitForClickable();
        await careerLink.click();
        await expect(browser).toHaveUrl(expectedUrl+'/kariera/');

    });
  });
});

