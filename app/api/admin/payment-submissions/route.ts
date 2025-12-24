import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import PaymentSubmission from '@/models/PaymentSubmission'
import User from '@/models/User'
import { isAdminEmail } from '@/lib/adminConfig'

// Check if user is admin
async function isAdmin(email: string): Promise<boolean> {
  return isAdminEmail(email)
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin access
    if (!(await isAdmin(session.user.email))) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build filter
    const filter: any = {}
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      filter.status = status
    }

    // Add search functionality
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i') // Case-insensitive search
      filter.$or = [
        { email: searchRegex },
        { userUpiId: searchRegex }
      ]
    }

    // Get submissions with pagination
    const submissions = await (PaymentSubmission as any).find(filter)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await PaymentSubmission.countDocuments(filter)

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching payment submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}