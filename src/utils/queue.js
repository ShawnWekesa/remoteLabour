/**
 * Background task queue implementation
 *
 * Built on top of bull and Redis, this abstracts away
 * the process of enquing the task and waiting for its
 * completion, and simplifies definition of queue consumers
 * (handler functions).
 *
 * Tasks are autodiscovered from `src/tasks.js` module, which
 * should export async functions.
 *
 * To call such a funtion:
 *
 *     import { tasks } from "./src/utils/queue.js";
 *
 *     const result = await tasks.someFunction(...);
 *
 * This puts the task on the queue. To actually execute
 * the queue, start the worker in another process with:
 *
 *     import { startWorkers } from "./src/utils/queue.js";
 *     startWorkers();
 *
 * This is implemented as `scripts/worker.js`.
 */

import Queue from "bull";

import config from "./config.js";
import * as taskHandlers from "../tasks.js";

const taskQueue = new Queue(config.BG_TASKS_QUEUE, config.REDIS_URL);

export const tasks = {};
export const startedJobs = {};

/**
 * Initialize task proxies
 *
 * Task proxy wraps adding task to the queue and waiting for
 * success or failure. The result is a simple to use async
 * function that returns the actual task return value or throws
 * the actual error if the task failed.
 */
async function init() {
  for (const name in taskHandlers) {
    tasks[name] = async (data) => {
      const job = await taskQueue.add(name, data);

      return new Promise((resolve, reject) => {
        startedJobs[job.id] = { resolve, reject };
      });
    };
  }
}

// Complete jobs we started are resolved
taskQueue.on("global:completed", (jobId, result) => {
  const localJob = startedJobs[jobId];
  if (!localJob) return;

  delete startedJobs[jobId];
  const resultData = JSON.parse(result);
  localJob.resolve(resultData);
});

// Failed jobs we started are rejected
taskQueue.on("global:failed", (jobId, err) => {
  const localJob = startedJobs[jobId];
  if (!localJob) return;

  delete startedJobs[jobId];
  localJob.reject(err);
});

init();

/**
 * Start task workers
 *
 * Attaches task consumers (handler functions) to
 * the queue to actually execute the tasks.
 *
 * This function should be called in processes that
 * want to listen to the task queue and execute queued
 * tasks.
 *
 * Usually, it's only used from `scripts/worker.js`.
 */
export function startWorkers() {
  for (const name in taskHandlers) {
    const handler = taskHandlers[name];
    taskQueue.process(name, handler);
  }
}
