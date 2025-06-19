"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus,
  DollarSign,
  Calendar,
  Home,
  ListTodo,
  Wallet,
  Plane,
  ShoppingCart,
  Trash2,
  Edit,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { useFinance } from "../hooks/useFinance"
import { FinanceModal } from "@/components/FinanceModal"
import { format } from "date-fns"

export default function FinancePage() {
  const { expenses, loading, error, deleteExpense } = useFinance()
  const [financeModalOpen, setFinanceModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex-1 p-4 pb-20 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex-1 p-4 pb-20 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const vishwaTotal = expenses
    .filter((expense) => expense.person === "Vishwa")
    .reduce((sum, expense) => sum + expense.amount, 0)
  const shruthiTotal = expenses
    .filter((expense) => expense.person === "Shruthi")
    .reduce((sum, expense) => sum + expense.amount, 0)

  // Group by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id)
      } catch (error) {
        console.error("Error deleting expense:", error)
      }
    }
  }

  return (
    <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Finances</h1>
              <p className="text-slate-600">Track your shared expenses</p>
            </div>
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setFinanceModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>

          {/* Monthly Overview */}
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <p className="text-sm text-slate-600">Total Expenses</p>
                <p className="text-3xl font-bold text-slate-800">${totalExpenses.toFixed(2)}</p>
                <p className="text-sm text-emerald-600">This month</p>
              </div>
              <Progress value={75} className="h-3 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-slate-800">${vishwaTotal.toFixed(2)}</p>
                  <p className="text-sm text-slate-600">Vishwa</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800">${shruthiTotal.toFixed(2)}</p>
                  <p className="text-sm text-slate-600">Shruthi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-800 text-sm">{category}</span>
                        <span className="font-semibold text-slate-800 text-sm">${amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(amount / totalExpenses) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {expenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((expense) => (
                      <div key={expense.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="p-2 bg-slate-200 rounded-lg">
                          <DollarSign className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate">{expense.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {expense.category}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {expense.person} • {format(new Date(expense.date), "MMM d")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-800">${expense.amount.toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
                  tab.id === "finance" ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
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

      <FinanceModal open={financeModalOpen} onOpenChange={setFinanceModalOpen} />
    </div>
  )
} 