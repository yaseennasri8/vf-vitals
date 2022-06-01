import Queue, { Queue as QueueInterface, QueueOptions } from "bull";
import Url from "../../models/Url";
import crawl from "../crawl";
import fs from "fs";
import sendEmail from "../email";
import getWebVitals from "../webvitals";

const constructLinkAndGetVitalsQueue: QueueInterface = new Queue(
  "constructLinkAndGetVitalsQueue",
  {
    redis: { port: process.env.REDIS_PORT, host: process.env.REDIS_URL },
  } as QueueOptions
);

const constructLinkAndGetVitals = async (
  domainUrl: string,
  domainId: string,
  email:string
) => {
  let links = await crawl(domainUrl);
  links?.push(domainUrl);
  console.log(links);
  for (const link of links!) {
    const response = await getWebVitals(link);
    let vitals = { ...response["lhr"]["audits"] };
    const url = await Url.create({
      url: link,
      firstContentfulPaint: vitals["first-contentful-paint"]["numericValue"],
      speedIndex: vitals["speed-index"]["numericValue"],
      totalBlockingTime: vitals["total-blocking-time"]["numericValue"],
      timeToInteractive: vitals["interactive"]["numericValue"],
      largestContentfulPaint:
        vitals["largest-contentful-paint"]["numericValue"],
      cumulativeLayoutShift: vitals["cumulative-layout-shift"]["numericValue"],
      domain: domainId,
    });
    vitals = JSON.stringify(vitals);
    let foldername = `./reports/${domainUrl}`;
    fs.mkdir(foldername, { recursive: true }, async function (err) {
      if (err) {
        console.log(err);
      } else {
        fs.writeFileSync(`${foldername}/${url._id}.json`, vitals);
        await sendEmail([
          {
            filename: "Report ",
            path:
              `./reports/${domainUrl}` +
              `/${url._id}.json`,
          },
        ], email);
      }
    });

    console.log(url);
  }
};

export const constructLinkAndGetVitalsAsync = (
  url: string,
  domainId: string,
  email:string
) => {
  constructLinkAndGetVitalsQueue
    .add({ url, domainId , email})
    .catch((err) =>
      console.log(
        "Error occured while adding to constructLinkAndGetVitalsAsync : ",
        err
      )
    );
};

export const initProcessor = () => {
  constructLinkAndGetVitalsQueue.process(
    async (job: { data: { url: string; domainId: string , email : string} }, done) => {
      await constructLinkAndGetVitals(job.data.url, job.data.domainId, job.data.email).catch(
        (err) =>
          console.log(
            "Error while processing constructLinkAndGetVitals : ",
            err
          )
      );
      done();
    }
  );
};

export const getDomainUrlForCron = async () => {
  const domainUrls = await Url.find();
  console.log("Getting domain url ready for lighthouse:::", domainUrls[0].url);
  for (const domainUrl of domainUrls) {
    const response = await getWebVitals(domainUrl.url);
    const vitals = { ...response["lhr"] };
    domainUrl.firstContentfulPaint =
      vitals["audits"]["first-contentful-paint"]["numericValue"];
    domainUrl.speedIndex = vitals["audits"]["speed-index"]["numericValue"];
    domainUrl.totalBlockingTime =
      vitals["audits"]["total-blocking-time"]["numericValue"];
    domainUrl.timeToInteractive =
      vitals["audits"]["interactive"]["numericValue"];
    domainUrl.largestContentfulPaint =
      vitals["audits"]["largest-contentful-paint"]["numericValue"];
    domainUrl.cumulativeLayoutShift =
      vitals["audits"]["cumulative-layout-shift"]["numericValue"];

    const updatedDomainUrl = await domainUrl.save();

    console.log(updatedDomainUrl);
  }
};
