"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Plus, DollarSign, MapPin, Trash2, Leaf, Home as HomeIcon, ShoppingBag } from "lucide-react"
import { useShopping } from "../hooks/useShopping"
import { ShoppingModal } from "@/components/ShoppingModal"
import {
  Home,
  ListTodo,
  ShoppingCart,
  Wallet,
  Plane,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ShoppingPage() {
  const { shopping, loading, error, deleteShoppingItem, toggleShoppingComplete } = useShopping()
  const [shoppingModalOpen, setShoppingModalOpen] = useState(false)
  const router = useRouter()

  // Navigation bar logic (copied from home/tasks page)
  const navTabs = [
    { id: "dashboard", icon: Home, label: "Home", path: "/" },
    { id: "tasks", icon: ListTodo, label: "Tasks", path: "/task" },
    { id: "shopping", icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { id: "finance", icon: Wallet, label: "Finance", path: "/finance" },
    { id: "travel", icon: Plane, label: "Travel", path: "/travel" },
  ]

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteShoppingItem(id)
      } catch (error) {
        console.error("Error deleting shopping item:", error)
      }
    }
  }

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

  // Categorize shopping items
  const groceriesItems = shopping.filter((item: any) => item.category === "Groceries & Fresh")
  const householdItems = shopping.filter((item: any) => item.category === "Household Essentials")
  const longTermItems = shopping.filter((item: any) => item.category === "Long-term Purchases")

  const ShoppingListCard = ({ 
    title, 
    description, 
    items, 
    icon: Icon, 
    iconColor, 
    bgColor 
  }: {
    title: string
    description: string
    items: any[]
    icon: any
    iconColor: string
    bgColor: string
  }) => (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className={`pb-3 ${bgColor} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${iconColor} rounded-lg`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800">{title}</CardTitle>
              <p className="text-sm text-slate-700">{description}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white text-slate-700">{items.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {items.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <Icon className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">No items in this list</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6"
                  onClick={() => toggleShoppingComplete(item.id)}
                >
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      item.completed ? "text-emerald-600 fill-emerald-600" : "text-slate-400"
                    }`}
                  />
                </Button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${
                      item.completed ? "line-through text-slate-500" : "text-slate-800"
                    } truncate`}
                  >
                    {item.item}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-600 truncate">
                      Qty: {item.quantity} • Added by {item.addedBy}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-800">${item.price.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-red-50"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Shopping</h1>
              <p className="text-slate-600">Manage your shopping lists by category</p>
            </div>
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setShoppingModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Shopping Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold text-slate-800">{shopping.length}</p>
                <p className="text-sm text-slate-600">Total Items</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Leaf className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-slate-800">{groceriesItems.length}</p>
                <p className="text-sm text-slate-600">Groceries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <HomeIcon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-slate-800">{householdItems.length}</p>
                <p className="text-sm text-slate-600">Household</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-slate-800">
                  ${shopping.reduce((sum: number, item: any) => sum + item.price, 0).toFixed(2)}
                </p>
                <p className="text-sm text-slate-600">Total Cost</p>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Groceries & Fresh Items */}
            <ShoppingListCard
              title="Groceries & Fresh Items"
              description="Weekly essentials: vegetables, fruits, dairy, bread, and pantry staples"
              items={groceriesItems}
              icon={Leaf}
              iconColor="bg-green-600"
              bgColor="bg-green-50"
            />

            {/* Household Essentials */}
            <ShoppingListCard
              title="Household Essentials"
              description="Monthly/quarterly needs: cleaning supplies, filters, and maintenance items"
              items={householdItems}
              icon={HomeIcon}
              iconColor="bg-blue-600"
              bgColor="bg-blue-50"
            />

            {/* Long-term Purchases */}
            <ShoppingListCard
              title="Long-term Purchases"
              description="Big-ticket items: appliances, furniture, and major household investments"
              items={longTermItems}
              icon={ShoppingBag}
              iconColor="bg-purple-600"
              bgColor="bg-purple-50"
            />
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
                  tab.id === "shopping" ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
                }`}
                onClick={() => router.push(tab.href)}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <ShoppingModal open={shoppingModalOpen} onOpenChange={setShoppingModalOpen} />
    </div>
  )
} 