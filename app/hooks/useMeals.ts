import { useState, useEffect } from "react"

// Type definitions for meal planning system
export type MealType = "breakfast" | "lunch" | "dinner" | "snack"
export type MealStatus = "planned" | "prepped" | "completed"
export type WaterUnit = "cups" | "oz" | "ml" | "l"

export type Meal = {
  id: string
  mealPlanId: string
  date: string
  mealType: MealType
  name: string
  calories: number
  carbs: number
  protein: number
  fats: number
  prepTime: number
  ingredients: string[]
  instructions: string
  assignedTo: string
  status: MealStatus
  createdBy: string
}

export type NutritionGoals = {
  userId: string
  dailyCalories: number
  dailyCarbs: number
  dailyProtein: number
  dailyFats: number
  dailyWater: number
  waterUnit: WaterUnit
}

export type WaterIntake = {
  id: string
  userId: string
  date: string
  amount: number
  unit: WaterUnit
  drinkType: string
  timestamp: string
}

export type SavedMeal = {
  id: string
  userId: string
  name: string
  calories: number
  carbs: number
  protein: number
  fats: number
  ingredients: string[]
  instructions: string
  timesUsed: number
}

/**
 * Custom hook for managing meals, nutrition goals, and water intake
 * 
 * Provides comprehensive meal planning functionality including:
 * - CRUD operations for meals
 * - Nutrition goal management
 * - Water intake tracking
 * - Saved meal templates
 * - State management with loading and error handling
 */
export function useMeals() {
  // State management
  const [meals, setMeals] = useState<Meal[]>([])
  const [nutritionGoals, setNutritionGoals] = useState<Record<string, NutritionGoals>>({})
  const [waterIntake, setWaterIntake] = useState<WaterIntake[]>([])
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch meals for a specific date or all meals
   */
  const fetchMeals = async (date?: string) => {
    try {
      const url = date ? `/api/meals?date=${date}` : "/api/meals"
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch meals")
      const data = await response.json()
      setMeals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch nutrition goals for a specific user
   */
  const fetchNutritionGoals = async (userId: string) => {
    try {
      const response = await fetch(`/api/meals?type=nutrition-goals&userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch nutrition goals")
      const data = await response.json()
      if (data) {
        setNutritionGoals(prev => ({ ...prev, [userId]: data }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  /**
   * Fetch water intake records for a specific user and date
   */
  const fetchWaterIntake = async (userId: string, date: string) => {
    try {
      const response = await fetch(`/api/meals?type=water-intake&userId=${userId}&date=${date}`)
      if (!response.ok) throw new Error("Failed to fetch water intake")
      const data = await response.json()
      setWaterIntake(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  /**
   * Fetch saved meal templates for a specific user
   */
  const fetchSavedMeals = async (userId: string) => {
    try {
      const response = await fetch(`/api/meals?type=saved-meals&userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch saved meals")
      const data = await response.json()
      setSavedMeals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  // Meal CRUD Operations
  
  /**
   * Add a new meal to the plan
   */
  const addMeal = async (meal: Omit<Meal, "id" | "status">) => {
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meal),
      })
      if (!response.ok) throw new Error("Failed to add meal")
      const newMeal = await response.json()
      setMeals((prev) => [...prev, newMeal])
      return newMeal
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Update an existing meal
   */
  const updateMeal = async (id: string, updates: Partial<Meal>) => {
    try {
      const response = await fetch("/api/meals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update meal")
      const updatedMeal = await response.json()
      setMeals((prev) => prev.map((meal) => (meal.id === id ? updatedMeal : meal)))
      return updatedMeal
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Delete a meal from the plan
   */
  const deleteMeal = async (id: string) => {
    try {
      const response = await fetch(`/api/meals?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete meal")
      setMeals((prev) => prev.filter((meal) => meal.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Toggle meal completion status
   */
  const toggleMealComplete = async (id: string) => {
    const meal = meals.find((m) => m.id === id)
    if (meal) {
      const newStatus = meal.status === "completed" ? "planned" : "completed"
      await updateMeal(id, { status: newStatus })
    }
  }

  // Nutrition Goals Management

  /**
   * Update nutrition goals for a user
   */
  const updateNutritionGoals = async (goals: NutritionGoals) => {
    try {
      const response = await fetch("/api/meals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "nutrition-goals", ...goals }),
      })
      if (!response.ok) throw new Error("Failed to update nutrition goals")
      const updatedGoals = await response.json()
      setNutritionGoals(prev => ({ ...prev, [goals.userId]: updatedGoals }))
      return updatedGoals
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  // Water Intake Management

  /**
   * Add water intake record
   */
  const addWaterIntake = async (intake: Omit<WaterIntake, "id" | "timestamp">) => {
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "water-intake", ...intake }),
      })
      if (!response.ok) throw new Error("Failed to add water intake")
      const newIntake = await response.json()
      setWaterIntake((prev) => [...prev, newIntake])
      return newIntake
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  // Saved Meals Management

  /**
   * Save a meal as a template for future use
   */
  const saveMeal = async (meal: Omit<SavedMeal, "id" | "timesUsed">) => {
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "saved-meal", ...meal }),
      })
      if (!response.ok) throw new Error("Failed to save meal")
      const savedMeal = await response.json()
      setSavedMeals((prev) => [...prev, savedMeal])
      return savedMeal
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Use a saved meal template (increments usage count)
   */
  const useSavedMeal = async (savedMealId: string) => {
    try {
      const response = await fetch("/api/meals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "use-saved-meal", id: savedMealId }),
      })
      if (!response.ok) throw new Error("Failed to use saved meal")
      const updatedMeal = await response.json()
      setSavedMeals((prev) => 
        prev.map((meal) => (meal.id === savedMealId ? updatedMeal : meal))
      )
      return updatedMeal
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  // Initialize data on mount
  useEffect(() => {
    fetchMeals()
    // Fetch nutrition goals for both users
    fetchNutritionGoals("Vishwa")
    fetchNutritionGoals("Shruthi")
    // Fetch today's water intake for both users
    const today = new Date().toISOString().split('T')[0]
    fetchWaterIntake("Vishwa", today)
    fetchWaterIntake("Shruthi", today)
  }, [])

  return {
    // State
    meals,
    nutritionGoals,
    waterIntake,
    savedMeals,
    loading,
    error,
    
    // Meal operations
    addMeal,
    updateMeal,
    deleteMeal,
    toggleMealComplete,
    
    // Nutrition goals
    updateNutritionGoals,
    
    // Water intake
    addWaterIntake,
    
    // Saved meals
    saveMeal,
    useSavedMeal,
    
    // Utility functions
    refetchMeals: fetchMeals,
    fetchNutritionGoals,
    fetchWaterIntake,
  }
}
