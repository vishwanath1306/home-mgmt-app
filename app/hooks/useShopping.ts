import { useState, useEffect } from "react"

// Type definitions for shopping management
export type ShoppingCategory = "Groceries" | "Household" | "Personal Care" | "Electronics" | "Clothing" | "Other"
export type PersonType = "Vishwa" | "Shruthi"

export type ShoppingItem = {
  id: string
  item: string
  category: ShoppingCategory
  quantity: number
  unit: string
  estimatedPrice: number
  purchased: boolean
  addedBy: PersonType
  store?: string
  notes?: string
  dateAdded: string
}

/**
 * Custom hook for managing household shopping lists
 * 
 * Provides functionality for:
 * - CRUD operations for shopping items
 * - Item completion toggling
 * - Filtering by category, person, or purchase status
 * - State management with loading and error handling
 * - Automatic data fetching on mount
 */
export function useShopping() {
  // State management
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all shopping items from the API
   */
  const fetchItems = async () => {
    try {
      const response = await fetch("/api/shopping")
      if (!response.ok) throw new Error("Failed to fetch shopping items")
      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add a new shopping item
   */
  const addItem = async (item: Omit<ShoppingItem, "id" | "purchased" | "dateAdded">) => {
    try {
      const response = await fetch("/api/shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
      if (!response.ok) throw new Error("Failed to add shopping item")
      const newItem = await response.json()
      setItems((prev) => [...prev, newItem])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Update an existing shopping item
   */
  const updateItem = async (id: string, updates: Partial<ShoppingItem>) => {
    try {
      const response = await fetch("/api/shopping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update shopping item")
      const updatedItem = await response.json()
      setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)))
      return updatedItem
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Delete a shopping item
   */
  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/shopping?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete shopping item")
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Toggle item purchase status
   */
  const toggleItemPurchased = async (id: string) => {
    const item = items.find((i) => i.id === id)
    if (item) {
      await updateItem(id, { purchased: !item.purchased })
    }
  }

  /**
   * Get items filtered by category
   */
  const getItemsByCategory = (category: ShoppingCategory) => {
    return items.filter(item => item.category === category)
  }

  /**
   * Get items filtered by person who added them
   */
  const getItemsByPerson = (person: PersonType) => {
    return items.filter(item => item.addedBy === person)
  }

  /**
   * Get items filtered by purchase status
   */
  const getItemsByStatus = (purchased: boolean) => {
    return items.filter(item => item.purchased === purchased)
  }

  /**
   * Get items filtered by store
   */
  const getItemsByStore = (store: string) => {
    return items.filter(item => item.store === store)
  }

  /**
   * Calculate total estimated cost
   */
  const calculateTotalCost = (includeAll: boolean = true) => {
    const targetItems = includeAll ? items : items.filter(item => !item.purchased)
    return targetItems.reduce((total, item) => total + (item.estimatedPrice * item.quantity), 0)
  }

  /**
   * Calculate shopping progress
   */
  const calculateProgress = () => {
    if (items.length === 0) return 0
    const purchasedItems = items.filter(item => item.purchased).length
    return Math.round((purchasedItems / items.length) * 100)
  }

  /**
   * Get unique stores from all items
   */
  const getUniqueStores = () => {
    const stores = items.map(item => item.store).filter(Boolean) as string[]
    return [...new Set(stores)]
  }

  /**
   * Clear all purchased items
   */
  const clearPurchasedItems = async () => {
    const purchasedItems = items.filter(item => item.purchased)
    try {
      for (const item of purchasedItems) {
        await deleteItem(item.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  return {
    // State
    items,
    loading,
    error,
    
    // CRUD operations
    addItem,
    updateItem,
    deleteItem,
    toggleItemPurchased,
    
    // Utility functions
    getItemsByCategory,
    getItemsByPerson,
    getItemsByStatus,
    getItemsByStore,
    calculateTotalCost,
    calculateProgress,
    getUniqueStores,
    clearPurchasedItems,
    refetchItems: fetchItems,
  }
} 