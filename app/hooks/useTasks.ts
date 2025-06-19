import { useState, useEffect } from "react"

export type Task = {
  id: string
  task: string
  assignee: string // 'Vishwa' or 'Shruthi'
  priority: "high" | "medium" | "low"
  time: string
  completed: boolean
  category: string
  dueDate: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      await updateTask(id, { completed: !task.completed })
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refetchTasks: fetchTasks,
  }
} 