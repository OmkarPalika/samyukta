import { NextRequest, NextResponse } from 'next/server';
import { getTypedCollections } from '@/lib/db-utils';
import { QRGenerator } from '@/lib/qr-generator';

export async function POST(request: NextRequest) {
  try {
    const { team_id } = await request.json();

    if (!team_id) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    const collections = await getTypedCollections();

    // Get team members
    const members = await collections.teamMembers
      .find({ registration_id: team_id })
      .toArray();

    if (members.length === 0) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Generate QR codes for each member
    const qrCodes = await Promise.all(
      members.map(async (member) => {
        const qrCode = await QRGenerator.generateParticipantQR({
          id: member.participant_id?.toString() ?? '',
          name: member.full_name,
          email: member.email,
          college: member.college,
          year: member.year,
          dept: member.department
        });

        // Update member with QR code
        await collections.teamMembers.updateOne(
          { _id: member._id },
          { $set: { qr_code: qrCode, updated_at: new Date() } }
        );

        return {
          participant_id: member.participant_id,
          name: member.full_name,
          qr_code: qrCode
        };
      })
    );

    return NextResponse.json({
      success: true,
      team_id,
      qr_codes: qrCodes
    });

  } catch (error) {
    console.error('QR generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR codes' },
      { status: 500 }
    );
  }
}