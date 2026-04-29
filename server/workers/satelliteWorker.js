const { satelliteQueue } = require('../services/satelliteService');
const axios = require('axios');
const prisma = require('../config/prisma');
const { sendAdminNotification } = require('../services/notificationService');

satelliteQueue.process(async (job) => {
  const { plantationId, imageUrl, lat, lng, areaSqKm } = job.data;

  try {
    // Update job status in DB
    const dbJob = await prisma.satelliteJob.create({
      data: {
        plantationId,
        jobStatus: 'PROCESSING',
      },
    });

    // Call Python microservice
    const response = await axios.post(`${process.env.PYTHON_ML_URL}/analyse`, {
      imageUrl,
      lat,
      lng,
      areaSqKm,
      plantationId,
    });

    const result = response.data;

    // Update SatelliteJob and Plantation
    await prisma.satelliteJob.update({
      where: { id: dbJob.id },
      data: {
        jobStatus: 'COMPLETED',
        ndviResult: result.ndviValue,
        confidenceScore: result.confidenceScore,
        processedAt: new Date(),
      },
    });

    await prisma.plantation.update({
      where: { id: plantationId },
      data: {
        currentNDVI: result.ndviValue,
        qualityGrade: result.qualityGrade,
        satelliteImageUrl: result.satelliteImage,
        status: result.status === 'VERIFIED' ? 'VERIFIED' : 'REJECTED',
      },
    });

    // Notify Admin
    await sendAdminNotification(
      'Satellite Verification Complete',
      `Plantation ${plantationId} has been verified with Grade ${result.qualityGrade}. Ready for approval.`
    );

    console.log(`Job ${job.id} completed for plantation ${plantationId}`);
    return result;
  } catch (error) {
    console.error(`Job ${job.id} failed:`, error.message);
    
    await prisma.satelliteJob.updateMany({
      where: { plantationId, jobStatus: 'PROCESSING' },
      data: { jobStatus: 'FAILED' },
    });

    throw error;
  }
});

console.log('Satellite Worker started...');
