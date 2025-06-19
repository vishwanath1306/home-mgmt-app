import { useState, useEffect } from "react"

// Type definitions for task management
export type TaskPriority = "high" | "medium" | "low"
export type TaskCategory = "Cleaning" | "Maintenance" | "Errands" | "Pet Care" | "Cooking" | "Other"
export type PersonType = "Vishwa" | "Shruthi"

export type Task = {
  id: string
  task: string
  assignee: PersonType
  priority: TaskPriority
  time: string
  completed: boolean
  category: TaskCategory
  dueDate: string
}

/**
 * Custom hook for managing household tasks
 * 
 * Provides functionality for:
 * - CRUD operations for tasks
 * - Task completion toggling
 * - Filtering by assignee, priority, or category
 * - State management with loading and error handling
 * - Automatic data fetching on mount
 */
export function useTasks() {
  // State management
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all tasks from the API
   */
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add a new task
   */
  const addTask = async (task: Omit<Task, "id" | "completed">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })
      if (!response.ok) throw new Error("Failed to add task")
      const newTask = await response.json()
      setTasks((prev) => [...prev, newTask])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Update an existing task
   */
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update task")
      const updatedTask = await response.json()
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Delete a task
   */
  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete task")
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  /**
   * Toggle task completion status
   */
  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      await updateTask(id, { completed: !task.completed })
    }
  }

  /**
   * Get tasks filtered by assignee
   */
  const getTasksByAssignee = (assignee: PersonType) => {
    return tasks.filter(task => task.assignee === assignee)
  }

  /**
   * Get tasks filtered by completion status
   */
  const getTasksByStatus = (completed: boolean) => {
    return tasks.filter(task => task.completed === completed)
  }

  /**
   * Get tasks filtered by priority
   */
  const getTasksByPriority = (priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority)
  }

  /**
   * Get tasks filtered by category
   */
  const getTasksByCategory = (category: TaskCategory) => {
    return tasks.filter(task => task.category === category)
  }

  /**
   * Get tasks due on a specific date
   */
  const getTasksByDate = (date: string) => {
    return tasks.filter(task => task.dueDate === date)
  }

  /**
   * Calculate completion percentage for a person or overall
   */
  const calculateCompletionRate = (assignee?: PersonType) => {
    let filteredTasks = tasks
    if (assignee) {
      filteredTasks = tasks.filter(task => task.assignee === assignee)
    }
    
    if (filteredTasks.length === 0) return 0
    
    const completedTasks = filteredTasks.filter(task => task.completed).length
    return Math.round((completedTasks / filteredTasks.length) * 100)
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    // State
    tasks,
    loading,
    error,
    
    // CRUD operations
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    
    // Utility functions
    getTasksByAssignee,
    getTasksByStatus,
    getTasksByPriority,
    getTasksByCategory,
    getTasksByDate,
    calculateCompletionRate,
    refetchTasks: fetchTasks,
  }
} 