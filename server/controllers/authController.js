const prisma = require('../config/prisma');
const { z } = require('zod');

const registerSchema = z.object({
  firebaseUid: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['NGO', 'COMPANY', 'ADMIN']),
  walletAddress: z.string().optional(),
});

const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await prisma.user.create({
      data: validatedData,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { role: role.toUpperCase() }
    });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  register,
  getMe,
  updateRole
};
