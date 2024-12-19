import prisma from "./lib/prisma";

export const register = async() => {
  //This if statement is important, read here: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
  if (process.env.NEXT_RUNTIME === "nodejs") {

    const { Worker } = await import("bullmq");
    const { connection, jobsQueue } = await import("@/lib");

    new Worker("jobsQueue", async (job) => {
        console.log({job})
    },
      {
        connection, concurrency: 10, removeOnComplete: { count: 1000 }, removeOnFail: { count: 5000 },
      }
    );
  }
};
