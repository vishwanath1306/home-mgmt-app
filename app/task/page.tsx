"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Plus } from "lucide-react"
import { useTasks } from "../hooks/useTasks"
import { TaskModal } from "@/components/TaskModal"
import { format, addDays, isSameDay, startOfToday } from "date-fns"
import { useRouter } from "next/navigation"
import {
  Home,
  ListTodo,
  ShoppingCart,
  Wallet,
  Plane,
} from "lucide-react"

const NUM_DAYS = 5

export default function TaskPage() {
  const { tasks, toggleTaskComplete } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<string | null>(null)
  const router = useRouter()

  // Generate columns for today + next NUM_DAYS-1 days
  const days = Array.from({ length: NUM_DAYS }, (_, i) => addDays(startOfToday(), i))

  // Group tasks by day
  const tasksByDay = days.map((day) => ({
    date: day,
    tasks: tasks.filter((task) => isSameDay(new Date(task.dueDate), day)),
  }))

  const handleAddTask = (date: Date) => {
    setModalDate(date.toISOString())
    setModalOpen(true)
  }

  // Navigation bar logic (copied from home screen)
  const navTabs = [
    { id: "dashboard", icon: Home, label: "Home", path: "/" },
    { id: "tasks", icon: ListTodo, label: "Tasks", path: "/task" },
    { id: "shopping", icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { id: "finance", icon: Wallet, label: "Finance", path: "/finance" },
    { id: "travel", icon: Plane, label: "Travel", path: "/travel" },
  ]

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-slate-50 flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Tasks Board</h1>
      <div className="flex-1">
        <div className="flex gap-4 overflow-x-auto">
          {tasksByDay.map(({ date, tasks }) => (
            <div key={date.toISOString()} className="flex-1 min-w-[260px]">
              <Card className="bg-white border-slate-200">
                <CardHeader className="flex flex-col gap-2 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{format(date, "EEEE")}</CardTitle>
                    <span className="text-xs text-slate-500">{format(date, "MMM d")}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => handleAddTask(date)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add task
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  {tasks.length === 0 && (
                    <div className="text-slate-400 text-sm text-center">No tasks</div>
                  )}
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1 border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-0 h-5 w-5"
                          onClick={() => toggleTaskComplete(task.id)}
                        >
                          <CheckCircle2
                            className={`h-5 w-5 ${task.completed ? "text-emerald-500" : "text-slate-400"}`}
                          />
                        </Button>
                        <span
                          className={`font-medium text-sm flex-1 ${
                            task.completed ? "line-through text-slate-400" : "text-slate-800"
                          }`}
                        >
                          {task.task}
                        </span>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        {task.time && <span>{task.time}</span>}
                        {task.assignee && <span>• {task.assignee}</span>}
                        {task.category && <span>• {task.category}</span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <TaskModal open={modalOpen} onOpenChange={setModalOpen} defaultDueDate={modalDate} />
      </div>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl bg-white border-t border-slate-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navTabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                tab.id === "tasks" ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
              }`}
              onClick={() => router.push(tab.path)}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 