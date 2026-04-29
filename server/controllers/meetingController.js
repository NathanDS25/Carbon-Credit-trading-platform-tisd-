const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMeetings = async (req, res) => {
  try {
    const userId = req.user.id;

    const meetings = await prisma.meeting.findMany({
      where: {
        OR: [
          { organizerId: userId },
          { participantId: userId }
        ]
      },
      orderBy: { scheduledAt: 'asc' },
      include: { organizer: true, participant: true }
    });

    res.json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.scheduleMeeting = async (req, res) => {
  try {
    const { participantId, scheduledAt, meetLink } = req.body;
    const organizerId = req.user.id;

    const meeting = await prisma.meeting.create({
      data: {
        organizerId,
        participantId,
        scheduledAt: new Date(scheduledAt),
        meetLink,
        status: 'PENDING'
      }
    });

    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateMeetingStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    
    const meeting = await prisma.meeting.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });

    res.json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
