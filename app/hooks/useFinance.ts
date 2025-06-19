import { useState, useEffect } from "react"

// Type definitions for financial management
export type ExpenseType = "expense" | "income"
export type ExpenseCategory = "Groceries" | "Utilities" | "Entertainment" | "Transportation" | "Healthcare" | "Shopping" | "Dining" | "Other"
export type PersonType = "Vishwa" | "Shruthi"

export type Expense = {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  person: PersonType
  date: string
  type: ExpenseType
}

/**
 * Custom hook for managing household finances
 * 
 * Provides functionality for:
 * - CRUD operations for expenses and income
 * - Filtering by date, person, or category
 * - State management with loading and error handling
 * - Automatic data fetching on mount
 */
export function useFinance() {
  // State management
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all financial records from the API
   */
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

  /**
   * Add a new expense or income record
   */
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

  /**
   * Update an existing financial record
   */
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

  /**
   * Delete a financial record
   */
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

  /**
   * Get expenses filtered by date range
   */
  const getExpensesByDateRange = (startDate: string, endDate: string) => {
    return expenses.filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    )
  }

  /**
   * Get expenses by category
   */
  const getExpensesByCategory = (category: ExpenseCategory) => {
    return expenses.filter(expense => expense.category === category)
  }

  /**
   * Get expenses by person
   */
  const getExpensesByPerson = (person: PersonType) => {
    return expenses.filter(expense => expense.person === person)
  }

  /**
   * Calculate total spending for a given period or person
   */
  const calculateTotal = (
    type: ExpenseType = "expense",
    startDate?: string,
    endDate?: string,
    person?: PersonType
  ) => {
    let filtered = expenses.filter(expense => expense.type === type)
    
    if (startDate && endDate) {
      filtered = filtered.filter(expense => 
        expense.date >= startDate && expense.date <= endDate
      )
    }
    
    if (person) {
      filtered = filtered.filter(expense => expense.person === person)
    }
    
    return filtered.reduce((total, expense) => total + expense.amount, 0)
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchExpenses()
  }, [])

  return {
    // State
    expenses,
    loading,
    error,
    
    // CRUD operations
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Utility functions
    getExpensesByDateRange,
    getExpensesByCategory,
    getExpensesByPerson,
    calculateTotal,
    refetchExpenses: fetchExpenses,
  }
} 