const prisma = require('../config/prisma');
const { z } = require('zod');

const listingSchema = z.object({
  creditsAmount: z.number().positive(),
  pricePerCreditINR: z.number().positive(),
  pricePerCreditETH: z.string(),
  qualityGrade: z.enum(['A', 'B', 'C']),
});

const listCredits = async (req, res, next) => {
  try {
    const validatedData = listingSchema.parse(req.body);
    const { creditsAmount, pricePerCreditINR, pricePerCreditETH, qualityGrade } = validatedData;

    // Check if user has enough credits in DB
    if (req.user.creditBalance < creditsAmount) {
      return res.status(400).json({ success: false, error: 'Insufficient credits' });
    }

    const listing = await prisma.creditListing.create({
      data: {
        sellerId: req.user.id,
        creditsAmount,
        pricePerCreditINR,
        pricePerCreditETH,
        qualityGrade,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const listings = await prisma.creditListing.findMany({
      where: { status: 'ACTIVE' },
      include: { seller: { select: { name: true, email: true } } },
    });
    res.json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

const buyCredits = async (req, res, next) => {
  try {
    const { txHash } = req.body;
    const listingId = req.params.id;

    const listing = await prisma.creditListing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing || listing.status !== 'ACTIVE') {
      return res.status(404).json({ success: false, error: 'Listing not available' });
    }

    // Record trade
    const trade = await prisma.trade.create({
      data: {
        buyerId: req.user.id,
        sellerId: listing.sellerId,
        listingId: listing.id,
        creditsAmount: listing.creditsAmount,
        inrPaid: listing.pricePerCreditINR * listing.creditsAmount,
        ethPaid: listing.pricePerCreditETH, // Total price in ETH should be passed or calculated
        txHash,
        status: 'COMPLETED',
      },
    });

    // Update listing status
    await prisma.creditListing.update({
      where: { id: listingId },
      data: { status: 'SOLD' },
    });

    // Update balances
    await prisma.user.update({
      where: { id: req.user.id },
      data: { creditBalance: { increment: listing.creditsAmount } },
    });

    await prisma.user.update({
      where: { id: listing.sellerId },
      data: { creditBalance: { decrement: listing.creditsAmount } },
    });

    res.json({ success: true, data: trade });
  } catch (error) {
    next(error);
  }
};

const companySell = async (req, res, next) => {
    // Implementation for company selling to another company
    res.status(501).json({ success: false, error: 'Not implemented yet' });
};

module.exports = {
  listCredits,
  getListings,
  buyCredits,
  companySell,
};
