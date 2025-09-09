import { type NextRequest, NextResponse } from "next/server"

// Mock queue data - in production, use real-time data
const queueData = {
  "pettah-bus": {
    location: "Pettah Bus Station",
    currentQueue: 15,
    averageWaitTime: 12,
    services: ["Colombo-Kandy", "Colombo-Galle", "Colombo-Jaffna"],
    status: "active",
  },
  "immigration-colombo": {
    location: "Immigration Office - Colombo",
    currentQueue: 28,
    averageWaitTime: 35,
    services: ["Passport Application", "Visa Processing", "Document Verification"],
    status: "active",
  },
  "national-hospital": {
    location: "National Hospital",
    currentQueue: 42,
    averageWaitTime: 25,
    services: ["General Consultation", "Specialist Appointment", "Lab Tests"],
    status: "active",
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get("locationId")

    if (locationId) {
      const location = queueData[locationId as keyof typeof queueData]
      if (!location) {
        return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 })
      }
      return NextResponse.json({
        success: true,
        data: location,
      })
    }

    return NextResponse.json({
      success: true,
      data: queueData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch queue data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locationId, action } = body

    if (!locationId || !action) {
      return NextResponse.json({ success: false, error: "Location ID and action required" }, { status: 400 })
    }

    const location = queueData[locationId as keyof typeof queueData]
    if (!location) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 })
    }

    // Simulate queue operations
    switch (action) {
      case "join":
        location.currentQueue += 1
        break
      case "leave":
        location.currentQueue = Math.max(0, location.currentQueue - 1)
        break
      case "next":
        location.currentQueue = Math.max(0, location.currentQueue - 1)
        break
      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: location,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update queue" }, { status: 500 })
  }
}
