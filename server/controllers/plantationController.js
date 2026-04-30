const { z } = require('zod');
const prisma = require('../config/prisma');
const { addAnalysisJob } = require('../services/satelliteService');
const { mintCreditsOnChain } = require('../services/blockchainService');
const { uploadToSupabase } = require('../services/uploadService');

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
    const { name, lat, lng, areaSqKm } = validatedData;
    
    // Handle image upload if present
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      console.log('⏳ Uploading image to Supabase...');
      imageUrl = await uploadToSupabase(req.file);
      console.log('✅ Image uploaded:', imageUrl);
    }

    if (!imageUrl) {
        return res.status(400).json({ success: false, error: 'Satellite image is required' });
    }
    
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
    const { status, state } = req.query;
    const where = status ? { status } : {};
    if (state) {
      where.state = state;
    }
    const plantations = await prisma.plantation.findMany({
      where,
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

    // Calculate credits (Fallback: use 0.7 NDVI if analysis not yet saved)
    const currentNDVI = plantation.currentNDVI || 0.7;
    const creditsToAward = Math.floor(currentNDVI * plantation.areaSqKm * 100);

    // Mint on chain
    const txHash = await mintCreditsOnChain(plantation.user.walletAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', creditsToAward);

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
      data: { 
        creditBalance: { increment: creditsToAward },
        totalCreditsEarned: { increment: creditsToAward }
      },
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

const previewAnalysis = async (req, res, next) => {
  try {
    const { lat, lng, areaSqKm } = req.body;
    const axios = require('axios');
    
    console.log(`⏳ Probing satellite data for ${lat}, ${lng}...`);
    const response = await axios.post(`${process.env.PYTHON_ML_URL}/analyse`, {
      imageUrl: "", // Python service fetches its own if empty
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      areaSqKm: parseFloat(areaSqKm || 1.0),
      plantationId: "PREVIEW"
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Satellite Probe Failed:', error.message);
    res.status(500).json({ success: false, error: 'Could not fetch satellite preview. Check your connection.' });
  }
};

module.exports = {
  createPlantation,
  getMyPlantations,
  getAllPlantations,
  getPlantationDetail,
  approvePlantation,
  rejectPlantation,
  previewAnalysis,
};
