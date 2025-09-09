import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const appointments = [
  {
    id: "1",
    service: "Bus Ticket - Colombo to Kandy",
    location: "Pettah Bus Station",
    date: "2024-01-15",
    time: "09:00",
    status: "confirmed",
    queuePosition: 3,
    estimatedWait: "15 mins",
    type: "transport",
    userId: "user1",
  },
  {
    id: "2",
    service: "Passport Application",
    location: "Immigration Office - Colombo",
    date: "2024-01-16",
    time: "14:30",
    status: "pending",
    queuePosition: 12,
    estimatedWait: "45 mins",
    type: "government",
    userId: "user1",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    let filteredAppointments = appointments

    if (userId) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.userId === userId)
    }

    if (type && type !== "all") {
      filteredAppointments = filteredAppointments.filter((apt) => apt.type === type)
    }

    if (status && status !== "all") {
      filteredAppointments = filteredAppointments.filter((apt) => apt.status === status)
    }

    return NextResponse.json({
      success: true,
      data: filteredAppointments,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service, location, date, time, type, userId } = body

    // Validate required fields
    if (!service || !location || !date || !time || !type || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Generate new appointment
    const newAppointment = {
      id: Date.now().toString(),
      service,
      location,
      date,
      time,
      type,
      userId,
      status: "pending" as const,
      queuePosition: Math.floor(Math.random() * 20) + 1,
      estimatedWait: `${Math.floor(Math.random() * 60) + 10} mins`,
    }

    appointments.push(newAppointment)

    return NextResponse.json({
      success: true,
      data: newAppointment,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create appointment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, queuePosition, estimatedWait } = body

    const appointmentIndex = appointments.findIndex((apt) => apt.id === id)

    if (appointmentIndex === -1) {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 })
    }

    // Update appointment
    if (status) appointments[appointmentIndex].status = status
    if (queuePosition) appointments[appointmentIndex].queuePosition = queuePosition
    if (estimatedWait) appointments[appointmentIndex].estimatedWait = estimatedWait

    return NextResponse.json({
      success: true,
      data: appointments[appointmentIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Appointment ID required" }, { status: 400 })
    }

    const appointmentIndex = appointments.findIndex((apt) => apt.id === id)

    if (appointmentIndex === -1) {
      return NextResponse.json({ success: false, error: "Appointment not found" }, { status: 404 })
    }

    appointments.splice(appointmentIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete appointment" }, { status: 500 })
  }
}
