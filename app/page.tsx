"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle2,
  Plus,
  ShoppingCart,
  DollarSign,
  MapPin,
  MessageCircle,
  Home,
  ListTodo,
  Wallet,
  Plane,
  Bell,
  Utensils,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useTasks } from "./hooks/useTasks"
import { useShopping } from "./hooks/useShopping"
import { ShoppingModal } from "@/components/ShoppingModal"
import { FinanceModal } from "@/components/FinanceModal"

/**
 * Main Dashboard Component - Home Management App
 * 
 * This is the central hub that provides:
 * - Quick overview of tasks, expenses, shopping, meals, and travel
 * - Navigation to dedicated pages for each feature
 * - Quick action buttons for common tasks
 */
export default function HouseholdApp() {
  // State for modals - these are the only modals that can be opened from the dashboard
  const [shoppingModalOpen, setShoppingModalOpen] = useState(false)
  const [financeModalOpen, setFinanceModalOpen] = useState(false)
  
  // Hooks for data management
  const { tasks, toggleTaskComplete } = useTasks()
  const router = useRouter()

  /**
   * Handles navigation between different sections of the app
   * All sections except dashboard redirect to dedicated pages
   */
  const handleNavigation = (section: string) => {
    switch (section) {
      case "tasks":
        router.push("/task")
        break
      case "shopping":
        router.push("/shopping")
        break
      case "meals":
        router.push("/meals")
        break
      case "finance":
        router.push("/finance")
        break
      case "travel":
        router.push("/travel")
        break
      default:
        // Stay on dashboard
        break
    }
  }

  // Calculate task completion stats for dashboard overview
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Good morning! 👋</h1>
              <p className="text-slate-600">Let's tackle today together</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              {/* User avatars for the couple */}
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">V</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-blue-100 text-blue-700">S</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Today's Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Tasks Overview */}
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500 rounded-md">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-emerald-700">Tasks Done</p>
                    <p className="text-lg font-bold text-emerald-800">{completedTasks}/{totalTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Finance Overview */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500 rounded-md">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-blue-700">This Month</p>
                    <p className="text-lg font-bold text-blue-800">$1,240</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopping Overview */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500 rounded-md">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-purple-700">Shopping</p>
                    <p className="text-lg font-bold text-purple-800">12 items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meals Overview */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500 rounded-md">
                    <Utensils className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-green-700">Today's Meals</p>
                    <p className="text-lg font-bold text-green-800">3 planned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Overview */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-500 rounded-md">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-orange-700">Next Trip</p>
                    <p className="text-lg font-bold text-orange-800">Dec 15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-12 justify-start gap-3"
                    onClick={() => handleNavigation("tasks")}
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 justify-start gap-3"
                    onClick={() => setShoppingModalOpen(true)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Shopping List
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 justify-start gap-3"
                    onClick={() => handleNavigation("meals")}
                  >
                    <Utensils className="h-4 w-4" />
                    Plan Meals
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 justify-start gap-3"
                    onClick={() => setFinanceModalOpen(true)}
                  >
                    <DollarSign className="h-4 w-4" />
                    Log Expense
                  </Button>
                  <Button variant="outline" className="h-12 justify-start gap-3">
                    <MessageCircle className="h-4 w-4" />
                    Send Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Tasks Preview */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Today's Tasks</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation("tasks")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.slice(0, 4).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group hover:shadow-sm transition-all">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 w-6 flex-shrink-0"
                        onClick={() => toggleTaskComplete(task.id)}
                      >
                        <CheckCircle2
                          className={`h-5 w-5 ${
                            task.completed ? "text-emerald-500 fill-emerald-500" : "text-slate-400"
                          }`}
                        />
                      </Button>
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                          {task.task}
                        </p>
                        <p className="text-xs text-slate-600">{task.assignee} • {task.category}</p>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-6 text-slate-500">
                      <p className="text-sm">No tasks for today</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleNavigation("tasks")}
                      >
                        Add your first task
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {[
              { id: "dashboard", icon: Home, label: "Home" },
              { id: "tasks", icon: ListTodo, label: "Tasks" },
              { id: "shopping", icon: ShoppingCart, label: "Shopping" },
              { id: "meals", icon: Utensils, label: "Meals" },
              { id: "finance", icon: Wallet, label: "Finance" },
              { id: "travel", icon: Plane, label: "Travel" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  tab.id === "dashboard" ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
                }`}
                onClick={() => handleNavigation(tab.id)}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg"
        onClick={() => handleNavigation("tasks")}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Modals - only the ones that can be opened from dashboard */}
      <ShoppingModal open={shoppingModalOpen} onOpenChange={setShoppingModalOpen} />
      <FinanceModal open={financeModalOpen} onOpenChange={setFinanceModalOpen} />
    </div>
  )
}
