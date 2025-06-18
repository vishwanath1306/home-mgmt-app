import { useState, useEffect } from "react"

export type ShoppingItem = {
  id: string
  item: string
  category: string
  price: number
  quantity: number
  addedBy: string // 'vishwa' or 'shruthi'
  completed: boolean
  date: string
}

export function useShopping() {
  const [shopping, setShopping] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchShopping = async () => {
    try {
      const response = await fetch("/api/shopping")
      if (!response.ok) throw new Error("Failed to fetch shopping list")
      const data = await response.json()
      setShopping(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addShoppingItem = async (item: Omit<ShoppingItem, "id" | "completed">) => {
    try {
      const response = await fetch("/api/shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
      if (!response.ok) throw new Error("Failed to add item")
      const newItem = await response.json()
      setShopping((prev) => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const updateShoppingItem = async (id: string, updates: Partial<ShoppingItem>) => {
    try {
      const response = await fetch("/api/shopping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update item")
      const updatedItem = await response.json()
      setShopping((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const deleteShoppingItem = async (id: string) => {
    try {
      const response = await fetch(`/api/shopping?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete item")
      setShopping((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const toggleShoppingComplete = async (id: string) => {
    const item = shopping.find((t) => t.id === id)
    if (item) {
      await updateShoppingItem(id, { completed: !item.completed })
    }
  }

  useEffect(() => {
    fetchShopping()
  }, [])

  return {
    shopping,
    loading,
    error,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    toggleShoppingComplete,
    refetchShopping: fetchShopping,
  }
} 