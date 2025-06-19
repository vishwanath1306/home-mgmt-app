import { NextResponse } from "next/server"

// Mock database for finance/expenses
let expenses = [
  {
    id: "1",
    description: "Whole Foods Market",
    amount: 67.45,
    category: "Groceries",
    person: "Vishwa",
    date: new Date().toISOString(),
    type: "expense" as const,
  },
  {
    id: "2",
    description: "Netflix Subscription",
    amount: 15.99,
    category: "Entertainment",
    person: "Shruthi",
    date: new Date(Date.now() - 86400000).toISOString(), // yesterday
    type: "expense" as const,
  },
  {
    id: "3",
    description: "Gas Station",
    amount: 42.30,
    category: "Transportation",
    person: "Vishwa",
    date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    type: "expense" as const,
  },
  {
    id: "4",
    description: "Electric Bill",
    amount: 89.20,
    category: "Utilities",
    person: "Shruthi",
    date: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    type: "expense" as const,
  },
]

export async function GET() {
  return NextResponse.json(expenses)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newExpense = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    type: "expense",
  }
  expenses.push(newExpense)
  return NextResponse.json(newExpense)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body
  expenses = expenses.map((expense) => (expense.id === id ? { ...expense, ...updates } : expense))
  return NextResponse.json(expenses.find((expense) => expense.id === id))
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (id) {
    expenses = expenses.filter((expense) => expense.id !== id)
  }
  return NextResponse.json({ success: true })
} 