"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useTasks } from "@/app/hooks/useTasks"

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDueDate?: string | null
}

export function TaskModal({ open, onOpenChange, defaultDueDate }: TaskModalProps) {
  const { addTask } = useTasks()
  const [formData, setFormData] = useState({
    task: "",
    description: "",
    assignee: "",
    priority: "medium" as "low" | "medium" | "high",
    time: "",
    category: "",
    dueDate: defaultDueDate || new Date().toISOString(),
  })

  // Update dueDate if defaultDueDate changes (e.g., when opening modal for a different day)
  useEffect(() => {
    if (open && defaultDueDate) {
      setFormData((prev) => ({ ...prev, dueDate: defaultDueDate }))
    }
  }, [defaultDueDate, open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await addTask(formData)
      onOpenChange(false)
      setFormData({
        task: "",
        description: "",
        assignee: "",
        priority: "medium",
        time: "",
        category: "",
        dueDate: defaultDueDate || new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">Task</Label>
            <Input
              id="task"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              value={formData.assignee}
              onValueChange={(value) => setFormData({ ...formData, assignee: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vishwa">Vishwa</SelectItem>
                <SelectItem value="Shruthi">Shruthi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setFormData({ ...formData, priority: value })
              }
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
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Errands">Errands</SelectItem>
                <SelectItem value="Pet Care">Pet Care</SelectItem>
                <SelectItem value="Cooking">Cooking</SelectItem>
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
                  {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                  onSelect={(date) =>
                    setFormData({ ...formData, dueDate: date?.toISOString() || new Date().toISOString() })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 