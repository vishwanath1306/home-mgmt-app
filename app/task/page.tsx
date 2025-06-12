"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  priority: "low" | "medium" | "high"
  dueDate: Date
  status: "pending" | "completed"
}

export default function TaskPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
    dueDate: new Date(),
    status: "pending",
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...formData, id: task.id } as Task : task
      ))
    } else {
      // Create new task
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData as Omit<Task, "id">,
      }
      setTasks([...tasks, newTask])
    }
    handleCloseModal()
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData(task)
    setIsModalOpen(true)
  }

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
    setFormData({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
      dueDate: new Date(),
      status: "pending",
    })
    router.back()
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-600"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Task Management</h1>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={formData.assignee}
                  onValueChange={(value: string) => setFormData({ ...formData, assignee: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alex">Alex</SelectItem>
                    <SelectItem value="Jordan">Jordan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Task["priority"]) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date: Date | undefined) => setFormData({ ...formData, dueDate: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                  {editingTask ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">{task.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {task.assignee}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded",
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    )}
                  >
                    {task.priority}
                  </span>
                  <span className="text-xs text-slate-500">
                    Due: {format(task.dueDate, "MMM d, yyyy")}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(task)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 