import { useState, useEffect } from "react"

export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  person: string // 'Vishwa' or 'Shruthi'
  date: string
  type: "expense" | "income"
}

export function useFinance() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/finance")
      if (!response.ok) throw new Error("Failed to fetch expenses")
      const data = await response.json()
      setExpenses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense),
      })
      if (!response.ok) throw new Error("Failed to add expense")
      const newExpense = await response.json()
      setExpenses((prev) => [...prev, newExpense])
      return newExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const response = await fetch("/api/finance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update expense")
      const updatedExpense = await response.json()
      setExpenses((prev) => prev.map((expense) => (expense.id === id ? updatedExpense : expense)))
      return updatedExpense
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/finance?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete expense")
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetchExpenses: fetchExpenses,
  }
} 