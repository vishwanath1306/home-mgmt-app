"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus,
  Calendar,
  Home,
  ListTodo,
  Wallet,
  Plane,
  ShoppingCart,
  MapPin,
  CheckCircle2,
  DollarSign,
  Clock,
  Users,
} from "lucide-react"

export default function TravelPage() {
  const [activeTrip, setActiveTrip] = useState("portland")

  // Mock data for travel planning
  const trips = {
    portland: {
      title: "Weekend in Portland",
      dates: "December 15-17, 2024",
      days: 3,
      budget: 850,
      plannedPercentage: 85,
      itinerary: [
        { day: "Friday", activity: "Flight arrival", time: "2:30 PM", status: "booked" },
        { day: "Friday", activity: "Hotel check-in", time: "4:00 PM", status: "booked" },
        { day: "Saturday", activity: "Powell's Books", time: "10:00 AM", status: "planned" },
        { day: "Saturday", activity: "Food truck tour", time: "1:00 PM", status: "planned" },
        { day: "Sunday", activity: "Coffee shops", time: "9:00 AM", status: "planned" },
        { day: "Sunday", activity: "Flight departure", time: "6:00 PM", status: "booked" },
      ],
      packing: [
        { item: "Warm jacket", packed: true, person: "Vishwa" },
        { item: "Comfortable shoes", packed: true, person: "Shruthi" },
        { item: "Camera", packed: false, person: "Vishwa" },
        { item: "Phone charger", packed: false, person: "Shruthi" },
        { item: "Travel documents", packed: true, person: "Both" },
        { item: "Umbrella", packed: false, person: "Vishwa" },
      ],
      budget_breakdown: [
        { category: "Flights", budgeted: 300, spent: 285 },
        { category: "Hotel", budgeted: 200, spent: 180 },
        { category: "Food", budgeted: 250, spent: 0 },
        { category: "Activities", budgeted: 100, spent: 0 },
      ],
    },
  }

  const currentTrip = trips[activeTrip as keyof typeof trips]
  const totalSpent = currentTrip.budget_breakdown.reduce((sum, item) => sum + item.spent, 0)

  return (
    <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Travel</h1>
              <p className="text-slate-600">Plan and manage your trips</p>
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Plan Trip
            </Button>
          </div>

          {/* Upcoming Trip Overview */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900">{currentTrip.title}</h3>
                  <p className="text-blue-700">{currentTrip.dates}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-blue-900">{currentTrip.days}</p>
                  <p className="text-sm text-blue-700">Days</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-900">${currentTrip.budget}</p>
                  <p className="text-sm text-blue-700">Budget</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-900">{currentTrip.plannedPercentage}%</p>
                  <p className="text-sm text-blue-700">Planned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Itinerary */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Itinerary
                  </CardTitle>
                  <Badge variant="outline">{currentTrip.itinerary.length} activities</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-80 overflow-y-auto">
                  {currentTrip.itinerary.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-16 text-center">
                        <p className="text-xs font-medium text-slate-600">{item.day}</p>
                        <p className="text-xs text-slate-500">{item.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm">{item.activity}</p>
                      </div>
                      <Badge variant={item.status === "booked" ? "default" : "outline"} className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Packing List */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Packing List
                  </CardTitle>
                  <Badge variant="outline">
                    {currentTrip.packing.filter(item => item.packed).length}/{currentTrip.packing.length} packed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
                  {currentTrip.packing.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                      <CheckCircle2 
                        className={`h-4 w-4 ${item.packed ? "text-emerald-500" : "text-slate-400"}`} 
                      />
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
          </div>

          {/* Budget Tracking */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Budget Tracking
                </CardTitle>
                <Badge variant="outline">${totalSpent} spent</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Budget</span>
                  <span className="font-semibold">${currentTrip.budget}</span>
                </div>
                <Progress value={(totalSpent / currentTrip.budget) * 100} className="h-2" />
                <p className="text-xs text-slate-600">${currentTrip.budget - totalSpent} remaining</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {currentTrip.budget_breakdown.map((item, index) => (
                  <div key={index} className="text-center p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-800">{item.category}</p>
                    <p className="text-lg font-bold text-slate-800">${item.spent}</p>
                    <p className="text-xs text-slate-500">of ${item.budgeted}</p>
                    <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
                      <div
                        className="bg-emerald-500 h-1 rounded-full"
                        style={{ width: `${(item.spent / item.budgeted) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {[
              { id: "home", icon: Home, label: "Home", href: "/" },
              { id: "tasks", icon: ListTodo, label: "Tasks", href: "/task" },
              { id: "shopping", icon: ShoppingCart, label: "Shopping", href: "/shopping" },
              { id: "finance", icon: Wallet, label: "Finance", href: "/finance" },
              { id: "travel", icon: Plane, label: "Travel", href: "/travel" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  tab.id === "travel" ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
                }`}
                onClick={() => window.location.href = tab.href}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 