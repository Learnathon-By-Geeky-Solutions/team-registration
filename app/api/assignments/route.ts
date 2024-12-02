import { NextResponse } from 'next/server';
import { assignMentorsToTeams, getAssignmentStatus } from '@/lib/utils/assignment';

export async function POST() {
  try {
    const result = await assignMentorsToTeams();
    if (result.success) {
      return NextResponse.json({ message: 'Assignment completed successfully' });
    } else {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const status = await getAssignmentStatus();
    if (status.success) {
      return NextResponse.json(status.data);
    } else {
      return NextResponse.json(
        { error: status.error }, 
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}