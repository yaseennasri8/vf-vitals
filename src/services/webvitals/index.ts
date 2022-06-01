const chromeLauncher = require("chrome-launcher");
const lighthouse = require("lighthouse");

const getWebVitals = async (url: string) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = {
    logLevel: "info",
    output: "json",
    onlyCategories: ["performance"],
    port: chrome.port,
  };

  return await lighthouse(url, options);
};

export default getWebVitals;
