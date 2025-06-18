"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Plus } from "lucide-react"
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
  const { shopping, toggleShoppingComplete } = useShopping()
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  // Navigation bar logic (copied from home/tasks page)
  const navTabs = [
    { id: "dashboard", icon: Home, label: "Home", path: "/" },
    { id: "tasks", icon: ListTodo, label: "Tasks", path: "/task" },
    { id: "shopping", icon: ShoppingCart, label: "Shopping", path: "/shopping" },
    { id: "finance", icon: Wallet, label: "Finance", path: "/finance" },
    { id: "travel", icon: Plane, label: "Travel", path: "/travel" },
  ]

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Shopping List</h1>
      <Button className="mb-4 bg-emerald-500 hover:bg-emerald-600" onClick={() => setModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" /> Add Item
      </Button>
      <div className="space-y-4 flex-1">
        {shopping.length === 0 && <div className="text-slate-400 text-center">No items in your shopping list.</div>}
        {shopping.map((item) => (
          <Card key={item.id} className="border-slate-200">
            <CardContent className="flex items-center gap-3 p-4">
              <Button
                variant="ghost"
                size="icon"
                className="p-0 h-6 w-6"
                onClick={() => toggleShoppingComplete(item.id)}
              >
                <CheckCircle2 className={`h-5 w-5 ${item.completed ? "text-emerald-500" : "text-slate-400"}`} />
              </Button>
              <div className="flex-1">
                <p className={`font-medium ${item.completed ? "line-through text-slate-400" : "text-slate-800"}`}>{item.item}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Badge variant="outline">{item.category}</Badge>
                  <span>Qty: {item.quantity}</span>
                  <span>${item.price}</span>
                  <span>• {item.addedBy}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ShoppingModal open={modalOpen} onOpenChange={setModalOpen} />
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navTabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                tab.id === "shopping" ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
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