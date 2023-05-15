# testMoroSystemsWeb

This project contains tree tests. Each of them does this for a different screen resolution:

1. Navigates to Google
2. Accepts cookies (if applicable)
3. Searches for the string "MoroSystems" in Google
4. Navigates to the webpage "https://www.morosystems.cz"
5. Tries to find a link with the text "Kariéra" and click it

**Note:** There are three different layouts of the page "https://www.morosystems.cz" based on the browser resolution. The following code doesn't test that a particular resolution has the particular layout, it rather tests that the link with the text "Kariéra" can be found in each of them.

### How to run the tests

```
git clone https://github.com/DannySunik/testMoroSystemsWeb.git
cd .\testMoroSystemsWeb\
npm install
npm run wdio
```
