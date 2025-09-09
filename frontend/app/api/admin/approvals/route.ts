import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// Mock database - replace with your actual database
const addressChangeRequests = [
  {
    id: "1",
    userId: "user1",
    userName: "John Citizen",
    userEmail: "john@example.com",
    userNIC: "123456789V",
    currentAddress: "123 Main St, Colombo 01",
    newAddress: "456 New Street, Kandy",
    reason: "Job relocation to Kandy office. Starting new position next month.",
    documents: [
      { name: "employment_letter.pdf", type: "pdf", size: 2.5, url: "#" },
      { name: "lease_agreement.pdf", type: "pdf", size: 1.8, url: "#" },
    ],
    status: "pending",
    submittedDate: "2024-01-10",
  },
]

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ requests: addressChangeRequests })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { requestId, action, adminNotes } = await request.json()

    const requestIndex = addressChangeRequests.findIndex((req) => req.id === requestId)

    if (requestIndex === -1) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Update the request
    addressChangeRequests[requestIndex] = {
      ...addressChangeRequests[requestIndex],
      status: action === "approve" ? "approved" : "rejected",
      reviewedDate: new Date().toISOString().split("T")[0],
      adminNotes,
      reviewedBy: session.user?.name || "Admin",
    }

    return NextResponse.json({
      message: `Request ${action === "approve" ? "approved" : "rejected"} successfully`,
      request: addressChangeRequests[requestIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
