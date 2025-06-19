"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Plus, DollarSign, MapPin, Trash2, Leaf, Home as HomeIcon, ShoppingBag } from "lucide-react"
import { useShopping, type ShoppingCategory } from "../hooks/useShopping"
import { ShoppingModal } from "@/components/ShoppingModal"
import {
  Home,
  ListTodo,
  ShoppingCart,
  Wallet,
  Plane,
  Utensils,
} from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * Shopping Page Component
 * 
 * Displays and manages shopping lists organized by categories:
 * - Groceries: Fresh food and everyday food items
 * - Household: Cleaning supplies, toiletries, and household essentials
 * - Personal Care: Personal hygiene and care products
 * - Electronics: Tech items and gadgets
 * - Clothing: Apparel and accessories
 * - Other: Miscellaneous items
 */
export default function ShoppingPage() {
  // Use the updated hook API
  const { items, loading, error, deleteItem, toggleItemPurchased, calculateTotalCost, calculateProgress } = useShopping()
  const [shoppingModalOpen, setShoppingModalOpen] = useState(false)
  const router = useRouter()

  /**
   * Handle item deletion with confirmation
   */
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(id)
      } catch (error) {
        console.error("Error deleting shopping item:", error)
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex-1 p-4 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-slate-600">Loading your shopping lists...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex-1 p-4 pb-20 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto">
              <ShoppingCart className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-red-500 font-medium">Unable to load shopping lists</p>
            <p className="text-slate-600 text-sm">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Categorize shopping items using the updated categories
  const groceriesItems = items.filter(item => item.category === "Groceries")
  const householdItems = items.filter(item => item.category === "Household")
  const personalCareItems = items.filter(item => item.category === "Personal Care")
  const electronicsItems = items.filter(item => item.category === "Electronics")
  const clothingItems = items.filter(item => item.category === "Clothing")
  const otherItems = items.filter(item => item.category === "Other")

  // Calculate statistics
  const totalCost = calculateTotalCost()
  const remainingCost = calculateTotalCost(false) // Only unpurchased items
  const progress = calculateProgress()

  /**
   * Reusable Shopping List Card Component
   */
  const ShoppingListCard = ({ 
    title, 
    description, 
    items: categoryItems, 
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
          <Badge variant="secondary" className="bg-white text-slate-700">
            {categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {categoryItems.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <Icon className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">No items in this category</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setShoppingModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
            {categoryItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:shadow-sm transition-all">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6 flex-shrink-0"
                  onClick={() => toggleItemPurchased(item.id)}
                >
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      item.purchased ? "text-emerald-600 fill-emerald-600" : "text-slate-400"
                    }`}
                  />
                </Button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${
                      item.purchased ? "line-through text-slate-500" : "text-slate-800"
                    } truncate`}
                  >
                    {item.item}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-600">
                      {item.quantity} {item.unit} • Added by {item.addedBy}
                    </span>
                    {item.store && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{item.store}</span>
                      </>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-xs text-slate-500 mt-1 truncate">{item.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-800">
                    ${(item.estimatedPrice * item.quantity).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 flex-shrink-0"
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
    <div className="w-full mx-auto bg-slate-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Shopping Lists</h1>
              <p className="text-slate-600">Organize your shopping by category</p>
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

          {/* Shopping Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-emerald-500 rounded-lg w-fit mx-auto mb-2">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-emerald-800">{items.length}</p>
                <p className="text-xs text-emerald-700">Total Items</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-blue-500 rounded-lg w-fit mx-auto mb-2">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-blue-800">${remainingCost.toFixed(0)}</p>
                <p className="text-xs text-blue-700">Remaining Cost</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-purple-500 rounded-lg w-fit mx-auto mb-2">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-purple-800">{progress}%</p>
                <p className="text-xs text-purple-700">Completed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-orange-500 rounded-lg w-fit mx-auto mb-2">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-orange-800">${totalCost.toFixed(0)}</p>
                <p className="text-xs text-orange-700">Total Budget</p>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Lists by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ShoppingListCard
              title="Groceries"
              description="Fresh food and everyday items"
              items={groceriesItems}
              icon={Leaf}
              iconColor="bg-green-500"
              bgColor="bg-green-50"
            />
            
            <ShoppingListCard
              title="Household"
              description="Cleaning supplies and essentials"
              items={householdItems}
              icon={HomeIcon}
              iconColor="bg-blue-500"
              bgColor="bg-blue-50"
            />
            
            <ShoppingListCard
              title="Personal Care"
              description="Health and hygiene products"
              items={personalCareItems}
              icon={ShoppingBag}
              iconColor="bg-pink-500"
              bgColor="bg-pink-50"
            />
            
            <ShoppingListCard
              title="Electronics"
              description="Tech items and gadgets"
              items={electronicsItems}
              icon={DollarSign}
              iconColor="bg-purple-500"
              bgColor="bg-purple-50"
            />
            
            <ShoppingListCard
              title="Clothing"
              description="Apparel and accessories"
              items={clothingItems}
              icon={ShoppingBag}
              iconColor="bg-indigo-500"
              bgColor="bg-indigo-50"
            />
            
            <ShoppingListCard
              title="Other"
              description="Miscellaneous items"
              items={otherItems}
              icon={ShoppingCart}
              iconColor="bg-gray-500"
              bgColor="bg-gray-50"
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
              { id: "meals", icon: Utensils, label: "Meals", href: "/meals" },
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