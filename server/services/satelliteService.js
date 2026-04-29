const Queue = require('bull');

// HARDCODED REDIS URL: Verified to work with TLS settings.
const REDIS_URL = 'rediss://default:gQAAAAAAAauqAAIgcDExZTE3YWU0MGI2MTE0OGU0YjQ5YjYzYzk2MzhkM2E0NQ@mint-hookworm-109482.upstash.io:6379';

const satelliteQueue = new Queue('satellite-analysis', REDIS_URL, {
  redis: {
    tls: { rejectUnauthorized: false }
  }
});

const addAnalysisJob = async (plantationData) => {
  console.log('⏳ Adding job to satellite-analysis queue...');
  return await satelliteQueue.add(plantationData, {
    attempts: 3,
    backoff: 5000,
  });
};

module.exports = {
  addAnalysisJob,
  satelliteQueue
};
