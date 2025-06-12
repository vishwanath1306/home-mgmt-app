"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  Clock,
  Plus,
  ShoppingCart,
  DollarSign,
  MapPin,
  MessageCircle,
  Calendar,
  Home,
  ListTodo,
  Wallet,
  Plane,
  Bell,
  Star,
  Users,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

type Screen = "dashboard" | "tasks" | "shopping" | "finance" | "travel" | "settings"

export default function HouseholdApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard")
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const router = useRouter()

  const toggleTaskComplete = (taskId: string) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const handleAddTask = () => {
    router.push('/task')
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Good morning! 👋</h1>
          <p className="text-slate-600">Let's tackle today together</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">A</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-blue-100 text-blue-700">J</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-emerald-700">Tasks Done</p>
                <p className="text-2xl font-bold text-emerald-800">3/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">This Month</p>
                <p className="text-2xl font-bold text-blue-800">$1,240</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 justify-start gap-3"
              onClick={handleAddTask}
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
            <Button variant="outline" className="h-12 justify-start gap-3">
              <ShoppingCart className="h-4 w-4" />
              Shopping List
            </Button>
            <Button variant="outline" className="h-12 justify-start gap-3">
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

      {/* Today's Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Today's Tasks</CardTitle>
          <Badge variant="secondary">4 remaining</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: "1", task: "Take out trash", assignee: "Alex", priority: "high", time: "9:00 AM" },
            { id: "2", task: "Grocery shopping", assignee: "Jordan", priority: "medium", time: "2:00 PM" },
            { id: "3", task: "Clean bathroom", assignee: "Alex", priority: "medium", time: "4:00 PM" },
            { id: "4", task: "Prep dinner", assignee: "Jordan", priority: "low", time: "6:00 PM" },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <Button variant="ghost" size="sm" className="p-0 h-6 w-6" onClick={() => toggleTaskComplete(item.id)}>
                <CheckCircle2
                  className={`h-5 w-5 ${
                    completedTasks.includes(item.id) ? "text-emerald-500 fill-emerald-500" : "text-slate-400"
                  }`}
                />
              </Button>
              <div className="flex-1">
                <p
                  className={`font-medium ${completedTasks.includes(item.id) ? "line-through text-slate-500" : "text-slate-800"}`}
                >
                  {item.task}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {item.priority}
                  </Badge>
                  <span className="text-xs text-slate-500">{item.assignee}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-emerald-100 text-emerald-700">J</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">
                Jordan completed <span className="font-medium">Weekly grocery shopping</span>
              </p>
              <p className="text-xs text-slate-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-700">A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">
                Alex added <span className="font-medium">$45.60</span> to shared expenses
              </p>
              <p className="text-xs text-slate-500">4 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", "Cleaning", "Maintenance", "Errands", "Pet Care"].map((category) => (
          <Badge key={category} variant={category === "All" ? "default" : "outline"} className="whitespace-nowrap">
            {category}
          </Badge>
        ))}
      </div>

      {/* Task Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Weekly Progress</span>
            <span className="text-sm text-slate-600">12/20 tasks</span>
          </div>
          <Progress value={60} className="h-2" />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500">Alex: 6 tasks</span>
            <span className="text-xs text-slate-500">Jordan: 6 tasks</span>
          </div>
        </CardContent>
      </Card>

      {/* Task Sections */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            Overdue (2)
          </h3>
          <div className="space-y-2">
            {[
              { task: "Fix leaky faucet", assignee: "Alex", due: "2 days ago", priority: "high" },
              { task: "Schedule car maintenance", assignee: "Jordan", due: "1 day ago", priority: "medium" },
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{item.task}</p>
                      <p className="text-sm text-slate-600">
                        Assigned to {item.assignee} • Due {item.due}
                      </p>
                    </div>
                    <Badge variant="destructive">{item.priority}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            Today (4)
          </h3>
          <div className="space-y-2">
            {[
              { task: "Vacuum living room", assignee: "Alex", time: "10:00 AM", priority: "medium" },
              { task: "Buy groceries", assignee: "Jordan", time: "2:00 PM", priority: "high" },
              { task: "Water plants", assignee: "Alex", time: "6:00 PM", priority: "low" },
              { task: "Prepare dinner", assignee: "Jordan", time: "7:00 PM", priority: "medium" },
            ].map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        <CheckCircle2 className="h-5 w-5 text-slate-400" />
                      </Button>
                      <div>
                        <p className="font-medium text-slate-800">{item.task}</p>
                        <p className="text-sm text-slate-600">
                          {item.assignee} • {item.time}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {item.priority}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderShopping = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Shopping</h1>
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Shopping Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold text-slate-800">12</p>
            <p className="text-sm text-slate-600">Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-slate-800">$89</p>
            <p className="text-sm text-slate-600">Estimated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold text-slate-800">3</p>
            <p className="text-sm text-slate-600">Stores</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Lists */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Weekly Groceries</CardTitle>
              <Badge>8 items</Badge>
            </div>
            <p className="text-sm text-slate-600">Target: Whole Foods • Est. $65</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { item: "Organic milk", category: "Dairy", price: "$4.99", added: "Jordan" },
              { item: "Sourdough bread", category: "Bakery", price: "$3.50", added: "Alex" },
              { item: "Spinach (2 bags)", category: "Produce", price: "$5.98", added: "Jordan" },
              { item: "Greek yogurt", category: "Dairy", price: "$6.99", added: "Alex" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                  <CheckCircle2 className="h-5 w-5 text-slate-400" />
                </Button>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.item}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-slate-500">Added by {item.added}</span>
                  </div>
                </div>
                <span className="font-medium text-slate-800">{item.price}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Household Supplies</CardTitle>
              <Badge>4 items</Badge>
            </div>
            <p className="text-sm text-slate-600">Target: Target • Est. $24</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { item: "Laundry detergent", category: "Cleaning", price: "$8.99", added: "Alex" },
              { item: "Toilet paper (12-pack)", category: "Personal", price: "$12.99", added: "Jordan" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                  <CheckCircle2 className="h-5 w-5 text-slate-400" />
                </Button>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.item}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-slate-500">Added by {item.added}</span>
                  </div>
                </div>
                <span className="font-medium text-slate-800">{item.price}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderFinance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Finances</h1>
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Monthly Overview */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-600">November Spending</p>
            <p className="text-3xl font-bold text-slate-800">$1,240.50</p>
            <p className="text-sm text-emerald-600">$259.50 under budget</p>
          </div>
          <Progress value={75} className="h-3 mb-4" />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-slate-800">$620.25</p>
              <p className="text-sm text-slate-600">Alex</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800">$620.25</p>
              <p className="text-sm text-slate-600">Jordan</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { category: "Groceries", amount: "$485.20", percentage: 65, color: "bg-emerald-500" },
            { category: "Utilities", amount: "$320.00", percentage: 43, color: "bg-blue-500" },
            { category: "Entertainment", amount: "$180.50", percentage: 24, color: "bg-purple-500" },
            { category: "Transportation", amount: "$254.80", percentage: 34, color: "bg-orange-500" },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">{item.category}</span>
                <span className="font-semibold text-slate-800">{item.amount}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              description: "Whole Foods Market",
              amount: "$67.45",
              person: "Jordan",
              date: "Today",
              category: "Groceries",
            },
            {
              description: "Netflix Subscription",
              amount: "$15.99",
              person: "Alex",
              date: "Yesterday",
              category: "Entertainment",
            },
            {
              description: "Gas Station",
              amount: "$42.30",
              person: "Jordan",
              date: "2 days ago",
              category: "Transportation",
            },
            {
              description: "Electric Bill",
              amount: "$89.20",
              person: "Alex",
              date: "3 days ago",
              category: "Utilities",
            },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="p-2 bg-slate-200 rounded-lg">
                <DollarSign className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{transaction.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {transaction.person} • {transaction.date}
                  </span>
                </div>
              </div>
              <span className="font-semibold text-slate-800">{transaction.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderTravel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Travel</h1>
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="h-4 w-4 mr-2" />
          Plan Trip
        </Button>
      </div>

      {/* Upcoming Trip */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">Weekend in Portland</h3>
              <p className="text-blue-700">December 15-17, 2024</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-blue-900">3</p>
              <p className="text-sm text-blue-700">Days</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-blue-900">$850</p>
              <p className="text-sm text-blue-700">Budget</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-blue-900">85%</p>
              <p className="text-sm text-blue-700">Planned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Planning Sections */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Itinerary
              </CardTitle>
              <Badge variant="outline">6 activities</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { day: "Friday", activity: "Flight arrival", time: "2:30 PM", status: "booked" },
              { day: "Friday", activity: "Hotel check-in", time: "4:00 PM", status: "booked" },
              { day: "Saturday", activity: "Powell's Books", time: "10:00 AM", status: "planned" },
              { day: "Saturday", activity: "Food truck tour", time: "1:00 PM", status: "planned" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-16 text-center">
                  <p className="text-xs font-medium text-slate-600">{item.day}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.activity}</p>
                </div>
                <Badge variant={item.status === "booked" ? "default" : "outline"}>{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Packing List
              </CardTitle>
              <Badge variant="outline">12/20 items</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { item: "Warm jacket", packed: true, person: "Alex" },
                { item: "Comfortable shoes", packed: true, person: "Jordan" },
                { item: "Camera", packed: false, person: "Alex" },
                { item: "Phone charger", packed: false, person: "Jordan" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                  <CheckCircle2 className={`h-4 w-4 ${item.packed ? "text-emerald-500" : "text-slate-400"}`} />
                  <div className="flex-1">
                    <p className={`text-sm ${item.packed ? "line-through text-slate-500" : "text-slate-800"}`}>
                      {item.item}
                    </p>
                    <p className="text-xs text-slate-500">{item.person}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Budget Tracking
              </CardTitle>
              <Badge variant="outline">$425 spent</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Budget</span>
                <span className="font-semibold">$850</span>
              </div>
              <Progress value={50} className="h-2" />
              <p className="text-xs text-slate-600">$425 remaining</p>
            </div>
            <div className="space-y-2">
              {[
                { category: "Flights", budgeted: "$300", spent: "$285" },
                { category: "Hotel", budgeted: "$200", spent: "$180" },
                { category: "Food", budgeted: "$250", spent: "$0" },
                { category: "Activities", budgeted: "$100", spent: "$0" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{item.category}</span>
                  <span className="text-slate-800">
                    {item.spent} / {item.budgeted}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Settings</h1>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Partnership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">A</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarFallback className="bg-blue-100 text-blue-700">J</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Alex & Jordan</p>
              <p className="text-sm text-slate-600">Living together since March 2023</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Manage Partnership
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Notifications</p>
              <p className="text-sm text-slate-600">Task reminders and updates</p>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Task Distribution</p>
              <p className="text-sm text-slate-600">How tasks are assigned</p>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Budget Settings</p>
              <p className="text-sm text-slate-600">Monthly limits and categories</p>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-800">Dark Mode</span>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-800">Data Export</span>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-800">Privacy Settings</span>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <MessageCircle className="h-4 w-4 mr-2" />
            Help & FAQ
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Star className="h-4 w-4 mr-2" />
            Rate the App
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <AlertCircle className="h-4 w-4 mr-2" />
            Report an Issue
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return renderDashboard()
      case "tasks":
        return renderTasks()
      case "shopping":
        return renderShopping()
      case "finance":
        return renderFinance()
      case "travel":
        return renderTravel()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 overflow-y-auto">{renderCurrentScreen()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200">
        <div className="flex items-center justify-around py-2">
          {[
            { id: "dashboard", icon: Home, label: "Home" },
            { id: "tasks", icon: ListTodo, label: "Tasks" },
            { id: "shopping", icon: ShoppingCart, label: "Shopping" },
            { id: "finance", icon: Wallet, label: "Finance" },
            { id: "travel", icon: Plane, label: "Travel" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                currentScreen === tab.id ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
              }`}
              onClick={() => setCurrentScreen(tab.id as Screen)}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
