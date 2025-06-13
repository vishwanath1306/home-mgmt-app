import { NextResponse } from "next/server"

// This would typically come from a database
let tasks = [
  {
    id: "1",
    title: "Take out trash",
    description: "Empty all trash bins in the house",
    assignee: "Alex",
    priority: "high" as const,
    dueDate: new Date().toISOString(),
    status: "pending" as const,
  },
  {
    id: "2",
    title: "Grocery shopping",
    description: "Buy weekly groceries from Whole Foods",
    assignee: "Jordan",
    priority: "medium" as const,
    dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    status: "pending" as const,
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
    dueDate: new Date(body.dueDate).toISOString(),
  }
  tasks.push(newTask)
  return NextResponse.json(newTask)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body
  
  tasks = tasks.map(task => 
    task.id === id 
      ? { ...task, ...updates, dueDate: new Date(updates.dueDate).toISOString() }
      : task
  )
  
  return NextResponse.json(tasks.find(task => task.id === id))
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
  }
  
  tasks = tasks.filter(task => task.id !== id)
  return NextResponse.json({ success: true })
} 