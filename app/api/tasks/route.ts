import { NextResponse } from "next/server"

// Mock database - replace with actual database in production
let tasks = [
  {
    id: "1",
    task: "Take out trash",
    assignee: "vishwa",
    priority: "high",
    time: "9:00 AM",
    completed: false,
    category: "Cleaning",
    dueDate: new Date().toISOString(),
  },
  {
    id: "2",
    task: "Grocery shopping",
    assignee: "shruthi",
    priority: "medium",
    time: "2:00 PM",
    completed: false,
    category: "Errands",
    dueDate: new Date().toISOString(),
  },
  {
    id: "3",
    task: "Clean bathroom",
    assignee: "vishwa",
    priority: "medium",
    time: "4:00 PM",
    completed: false,
    category: "Cleaning",
    dueDate: new Date().toISOString(),
  },
  {
    id: "4",
    task: "Prep dinner",
    assignee: "shruthi",
    priority: "low",
    time: "6:00 PM",
    completed: false,
    category: "Cooking",
    dueDate: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newTask = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    completed: false,
  }
  tasks.push(newTask)
  return NextResponse.json(newTask)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body
  tasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
  return NextResponse.json(tasks.find((task) => task.id === id))
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (id) {
    tasks = tasks.filter((task) => task.id !== id)
  }
  return NextResponse.json({ success: true })
} 