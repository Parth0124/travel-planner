import { Browser } from "puppeteer";
import prisma from "./lib/prisma";

const SBR_WS_ENDPOINT ="wss://brd-customer-hl_678127ab-zone-arklyte:179ntn5byxdm@brd.superproxy.io:9222";

export const register = async() => {

  if (process.env.NEXT_RUNTIME === "nodejs") {

    const { Worker } = await import("bullmq");
    const puppeteer = await import("puppeteer");
    const { connection } = await import("./lib/redis");
    const { jobsQueue } = await import("./lib/queue");

    new Worker(
      "jobsQueue",
      async (job) => {
        try {
          const browser = await puppeteer.connect({
            browserWSEndpoint: SBR_WS_ENDPOINT,
          });
          const page = await browser.newPage();
          if (job.data.jobType.type === "location") {
            console.log("Connected! Navigating to " + job.data.url);
            await page.goto(job.data.url);
            console.log("Navigated! Scraping page content...");
            // const packages = await startLocationScraping(page);
          //   await prisma.jobs.update({
          //     where: { id: job.data.id },
          //     data: { isComplete: true, status: "complete" },
          //   });
          //   for (const pkg of packages) {
          //     const jobCreated = await prisma.jobs.findFirst({
          //       where: {
          //         url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
          //       },
          //     });
          //     if (!jobCreated) {
          //       const job = await prisma.jobs.create({
          //         data: {
          //           url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg?.id}`,
          //           jobType: { type: "package" },
          //         },
          //       });
          //       jobsQueue.add("package", { ...job, packageDetails: pkg });
          //     }
          //   }
          // } else if (job.data.jobType.type === "package") {
          //   const alreadyScrapped = await prisma.trips.findUnique({
          //     where: { id: job.data.packageDetails.id },
          //   });
          //   if (!alreadyScrapped) {
          //     console.log("Connected! Navigating to " + job.data.url);
          //     await page.goto(job.data.url, { timeout: 120000 });
          //     console.log("Navigated! Scraping page content...");
          //     const pkg = await startPackageScraping(
          //       page,
          //       job.data.packageDetails
          //     );
          //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //     // @ts-ignore
          //     await prisma.trips.create({ data: pkg });
          //     await prisma.jobs.update({
          //       where: { id: job.data.id },
          //       data: { isComplete: true, status: "complete" },
          //     });
          //   }
          // } else if (job.data.jobType.type === "flight") {
          //   console.log("in flight scraping");
          //   console.log("Connected! Navigating to " + job.data.url);
          //   await page.goto(job.data.url);
          //   console.log("Navigated! Scraping page content...");
          //   const flights = await startFlightScraping(page);

          //   await prisma.jobs.update({
          //     where: { id: job.data.id },
          //     data: { isComplete: true, status: "complete" },
          //   });

          //   for (const flight of flights) {
          //     await prisma.flights.create({
          //       data: {
          //         name: flight.airlineName,
          //         logo: flight.airlineLogo,
          //         from: job.data.jobType.source,
          //         to: job.data.jobType.destination,
          //         departureTime: flight.departureTime,
          //         arrivalTime: flight.arrivalTime,
          //         duration: flight.flightDuration,
          //         price: flight.price,
          //         jobId: job.data.id,
          //       },
          //     });
          //   }
          // } else if (job.data.jobType.type === "hotels") {
          //   console.log("Connected! Navigating to " + job.data.url);
          //   await page.goto(job.data.url, { timeout: 120000 });
          //   console.log("Navigated! Scraping page content...");
          //   const hotels = await startHotelScraping(
          //     page,
          //     browser,
          //     job.data.location
          //   );

          //   console.log(`Scraping Complete, ${hotels.length} hotels found.`);

          //   await prisma.jobs.update({
          //     where: { id: job.data.id },
          //     data: { isComplete: true, status: "complete" },
          //   });

          //   console.log("COMPLETE.");
          }
        } catch (error) {
          console.log({ error });
          await prisma.jobs.update({
            where: { id: job.data.id },
            data: { isComplete: true, status: "failed" },
          });
        } finally {

          console.log("Browser closed successfully.");
        }
      },
      {
        connection,
        concurrency: 10,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      }
    );
  }
};
