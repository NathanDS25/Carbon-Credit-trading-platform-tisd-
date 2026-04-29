const Queue = require('bull');
const satelliteQueue = new Queue('satellite-analysis', process.env.REDIS_URL || 'redis://localhost:6379');

const addAnalysisJob = async (plantationData) => {
  return await satelliteQueue.add(plantationData, {
    attempts: 3,
    backoff: 5000,
  });
};

module.exports = {
  addAnalysisJob,
  satelliteQueue
};
