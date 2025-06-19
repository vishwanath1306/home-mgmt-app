import { NextResponse } from "next/server"

// Mock database for shopping lists
let shoppingLists = [
  // Groceries & Fresh Items (Weekly/Frequent purchases)
  {
    id: "1",
    item: "Organic milk",
    category: "Groceries & Fresh",
    price: 4.99,
    quantity: 2,
    addedBy: "Vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "2",
    item: "Sourdough bread",
    category: "Groceries & Fresh",
    price: 3.5,
    quantity: 1,
    addedBy: "Shruthi",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "3",
    item: "Spinach (2 bags)",
    category: "Groceries & Fresh",
    price: 5.98,
    quantity: 2,
    addedBy: "Vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "4",
    item: "Bell peppers",
    category: "Groceries & Fresh",
    price: 3.29,
    quantity: 3,
    addedBy: "Shruthi",
    completed: true,
    date: new Date().toISOString(),
  },
  {
    id: "5",
    item: "Rice (5lb bag)",
    category: "Groceries & Fresh",
    price: 8.99,
    quantity: 1,
    addedBy: "Vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "6",
    item: "Greek yogurt",
    category: "Groceries & Fresh",
    price: 6.49,
    quantity: 2,
    addedBy: "Shruthi",
    completed: false,
    date: new Date().toISOString(),
  },
  // Household Essentials (Monthly/Quarterly purchases)
  {
    id: "7",
    item: "AC air filter",
    category: "Household Essentials",
    price: 12.99,
    quantity: 2,
    addedBy: "Vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "8",
    item: "Dishwasher pods",
    category: "Household Essentials",
    price: 15.99,
    quantity: 1,
    addedBy: "Shruthi",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "9",
    item: "Bathroom cleaner",
    category: "Household Essentials",
    price: 4.79,
    quantity: 2,
    addedBy: "Vishwa",
    completed: true,
    date: new Date().toISOString(),
  },
  {
    id: "10",
    item: "Light bulbs (LED)",
    category: "Household Essentials",
    price: 9.99,
    quantity: 1,
    addedBy: "Shruthi",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "11",
    item: "Laundry detergent",
    category: "Household Essentials",
    price: 11.49,
    quantity: 1,
    addedBy: "Vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  // Long-term Purchases (Big ticket items)
  {
    id: "12",
    item: "Robot vacuum cleaner",
    category: "Long-term Purchases",
    price: 299.99,
    quantity: 1,
    addedBy: "Vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "13",
    item: "Stand mixer",
    category: "Long-term Purchases",
    price: 189.99,
    quantity: 1,
    addedBy: "Shruthi",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "14",
    item: "Air purifier",
    category: "Long-term Purchases",
    price: 149.99,
    quantity: 1,
    addedBy: "Vishwa",
    completed: false,
    date: new Date().toISOString(),
  },
  {
    id: "15",
    item: "Office chair",
    category: "Long-term Purchases",
    price: 249.99,
    quantity: 1,
    addedBy: "Shruthi",
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