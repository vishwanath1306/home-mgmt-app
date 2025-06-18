import { NextResponse } from "next/server"

// Mock database for shopping lists
let shoppingLists = [
  {
    id: "1",
    item: "Organic milk",
    category: "Dairy",
    price: 4.99,
    quantity: 2,
    addedBy: "vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "2",
    item: "Sourdough bread",
    category: "Bakery",
    price: 3.5,
    quantity: 1,
    addedBy: "shruthi",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "3",
    item: "Spinach (2 bags)",
    category: "Produce",
    price: 5.98,
    quantity: 2,
    addedBy: "vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(shoppingLists)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newItem = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    completed: false,
  }
  shoppingLists.push(newItem)
  return NextResponse.json(newItem)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body
  shoppingLists = shoppingLists.map((item) => (item.id === id ? { ...item, ...updates } : item))
  return NextResponse.json(shoppingLists.find((item) => item.id === id))
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (id) {
    shoppingLists = shoppingLists.filter((item) => item.id !== id)
  }
  return NextResponse.json({ success: true })
} 