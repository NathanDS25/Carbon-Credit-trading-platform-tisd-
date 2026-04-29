const { z } = require('zod');
const prisma = require('../config/prisma');
const { addAnalysisJob } = require('../services/satelliteService');
const { mintCreditsOnChain } = require('../services/blockchainService');

const plantationSchema = z.object({
  name: z.string().min(3),
  lat: z.number().or(z.string().transform(v => parseFloat(v))),
  lng: z.number().or(z.string().transform(v => parseFloat(v))),
  areaSqKm: z.number().or(z.string().transform(v => parseFloat(v))),
  imageUrl: z.string().url(),
});

const createPlantation = async (req, res, next) => {
  try {
    const validatedData = plantationSchema.parse(req.body);
    const { name, lat, lng, areaSqKm, imageUrl } = validatedData;
    
    const plantation = await prisma.plantation.create({
      data: {
        userId: req.user.id,
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        areaSqKm: parseFloat(areaSqKm),
        imageUrl,
        status: 'PENDING',
      },
    });

    // Push to analysis queue
    await addAnalysisJob({
      plantationId: plantation.id,
      imageUrl,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      areaSqKm: parseFloat(areaSqKm),
    });

    console.log('✅ Plantation created successfully');
    res.status(201).json({ success: true, data: plantation });
  } catch (error) {
    next(error);
  }
};

const getMyPlantations = async (req, res, next) => {
  try {
    const plantations = await prisma.plantation.findMany({
      where: { userId: req.user.id },
      include: { satelliteJobs: true },
    });
    res.json({ success: true, data: plantations });
  } catch (error) {
    next(error);
  }
};

const getAllPlantations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const plantations = await prisma.plantation.findMany({
      where: status ? { status } : {},
      include: { user: true },
    });
    res.json({ success: true, data: plantations });
  } catch (error) {
    next(error);
  }
};

const getPlantationDetail = async (req, res, next) => {
  try {
    const plantation = await prisma.plantation.findUnique({
      where: { id: req.params.id },
      include: { user: true, satelliteJobs: true },
    });
    res.json({ success: true, data: plantation });
  } catch (error) {
    next(error);
  }
};

const approvePlantation = async (req, res, next) => {
  try {
    const plantation = await prisma.plantation.findUnique({
      where: { id: req.params.id },
      include: { user: true },
    });

    if (!plantation) return res.status(404).json({ success: false, error: 'Plantation not found' });

    // Calculate credits (Mock logic: 100 credits per unit of NDVI diff/area)
    const creditsToAward = (plantation.currentNDVI || 0.5) * plantation.areaSqKm * 100;

    // Mint on chain
    const txHash = await mintCreditsOnChain(plantation.user.walletAddress, creditsToAward);

    const updated = await prisma.plantation.update({
      where: { id: plantation.id },
      data: {
        status: 'VERIFIED',
        creditsAwarded: creditsToAward,
        verifiedAt: new Date(),
        txHash,
      },
    });

    // Update user balance
    await prisma.user.update({
      where: { id: plantation.userId },
      data: { creditBalance: { increment: creditsToAward } },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const rejectPlantation = async (req, res, next) => {
  try {
    const updated = await prisma.plantation.update({
      where: { id: req.params.id },
      data: { status: 'REJECTED' },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlantation,
  getMyPlantations,
  getAllPlantations,
  getPlantationDetail,
  approvePlantation,
  rejectPlantation,
};
