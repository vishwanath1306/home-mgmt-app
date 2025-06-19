"use client"

import React, { useState } from "react"
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
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const NUM_DAYS = 5

// Draggable Task Component
function DraggableTask({ task, toggleTaskComplete }: { task: any; toggleTaskComplete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1 border border-slate-100 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="p-0 h-5 w-5"
          onClick={(e) => {
            e.stopPropagation()
            toggleTaskComplete(task.id)
          }}
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
  )
}

// Task Overlay for Drag Preview
function TaskOverlay({ task }: { task: any }) {
  return (
    <div className="bg-white rounded-lg p-3 flex flex-col gap-1 border border-slate-200 shadow-lg opacity-90">
      <div className="flex items-center gap-2">
        <CheckCircle2
          className={`h-5 w-5 ${task.completed ? "text-emerald-500" : "text-slate-400"}`}
        />
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
  )
}

export default function TaskPage() {
  const { tasks, toggleTaskComplete, updateTask } = useTasks()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<any>(null)
  const [columnTasks, setColumnTasks] = useState<{ [date: string]: string[] }>(() => {
    // Initialize with current tasks
    const days = Array.from({ length: NUM_DAYS }, (_, i) => addDays(startOfToday(), i))
    const map: { [date: string]: string[] } = {}
    days.forEach(day => {
      const key = day.toISOString()
      map[key] = tasks.filter(t => isSameDay(new Date(t.dueDate), day)).map(t => t.id)
    })
    return map
  })
  const router = useRouter()

  // Keep columnTasks in sync with tasks
  React.useEffect(() => {
    const days = Array.from({ length: NUM_DAYS }, (_, i) => addDays(startOfToday(), i))
    setColumnTasks(prev => {
      const newMap: { [date: string]: string[] } = {}
      days.forEach(day => {
        const key = day.toISOString()
        newMap[key] = tasks.filter(t => isSameDay(new Date(t.dueDate), day)).map(t => t.id)
      })
      return newMap
    })
  }, [tasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const days = Array.from({ length: NUM_DAYS }, (_, i) => addDays(startOfToday(), i))
  const columnIds = days.map(day => day.toISOString())

  const handleAddTask = (date: Date) => {
    setModalDate(date.toISOString())
    setModalOpen(true)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return
    const activeId = active.id as string
    const overId = over.id as string
    // Find source and destination columns
    let sourceCol = null
    let destCol = null
    for (const col in columnTasks) {
      if (columnTasks[col].includes(activeId)) sourceCol = col
      if (col === overId || columnTasks[col].includes(overId)) destCol = col
    }
    if (!sourceCol || !destCol) return
    // If dropped in same column, reorder
    if (sourceCol === destCol) {
      const oldIndex = columnTasks[sourceCol].indexOf(activeId)
      let newIndex = columnTasks[destCol].indexOf(overId)
      if (oldIndex === newIndex) return
      if (newIndex === -1) newIndex = columnTasks[destCol].length - 1
      const newItems = arrayMove(columnTasks[sourceCol], oldIndex, newIndex)
      setColumnTasks({ ...columnTasks, [sourceCol]: newItems })
    } else {
      // Move to another column
      const newSource = columnTasks[sourceCol].filter(id => id !== activeId)
      let destIndex = columnTasks[destCol].indexOf(overId)
      if (destIndex === -1) destIndex = columnTasks[destCol].length
      const newDest = [...columnTasks[destCol]]
      newDest.splice(destIndex, 0, activeId)
      setColumnTasks({ ...columnTasks, [sourceCol]: newSource, [destCol]: newDest })
      // Update dueDate in backend
      try {
        await updateTask(activeId, { dueDate: destCol })
      } catch (e) {
        // revert UI if error
        setColumnTasks({ ...columnTasks })
      }
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columnIds} strategy={verticalListSortingStrategy}>
            <div className="flex gap-4 overflow-x-auto">
              {days.map((date) => {
                const key = date.toISOString()
                const taskIds = columnTasks[key] || []
                const dayTasks = taskIds.map(id => tasks.find(t => t.id === id)).filter(Boolean)
                return (
                  <div key={key} className="flex-1 min-w-[260px]">
                    <Card className="bg-white border-slate-200 h-full">
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
                        <SortableContext id={key} items={taskIds} strategy={verticalListSortingStrategy}>
                          {dayTasks.length === 0 && (
                            <div className="text-slate-400 text-sm text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                              Drop tasks here
                            </div>
                          )}
                          {dayTasks.map((task: any) => (
                            <DraggableTask
                              key={task.id}
                              task={task}
                              toggleTaskComplete={toggleTaskComplete}
                            />
                          ))}
                        </SortableContext>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeTask ? <TaskOverlay task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
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