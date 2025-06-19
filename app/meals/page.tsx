"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Utensils, 
  Target, 
  Droplets, 
  Clock, 
  User, 
  CheckCircle2,
  Trash2,
  Home,
  ListTodo,
  ShoppingCart,
  Wallet,
  Plane,
  Calendar as CalendarIcon,
  Users,
  ChevronRight,
  ChevronDown,
  Coffee,
  Sun,
  Moon,
  Cookie,
  TrendingUp,
  Award,
  Flame
} from "lucide-react"
import { useMeals } from "../hooks/useMeals"
import { MealModal } from "@/components/MealModal"
import { useRouter } from "next/navigation"
import { format, startOfWeek, addDays } from "date-fns"

export default function MealsPage() {
  const { 
    meals, 
    nutritionGoals, 
    waterIntake, 
    loading, 
    error, 
    deleteMeal, 
    toggleMealComplete,
    addWaterIntake,
    updateNutritionGoals
  } = useMeals()
  
  const [mealModalOpen, setMealModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedMealType, setSelectedMealType] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<"Vishwa" | "Shruthi">("Vishwa")
  const [viewMode, setViewMode] = useState<"My Meals" | "Partner's Meals" | "Our Meals">("Our Meals")
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const router = useRouter()

  // Get current week dates
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  
  const todayString = today.toISOString().split('T')[0]
  const todayMeals = meals.filter(meal => meal.date === todayString)

  // Filter meals based on view mode
  const getFilteredMeals = (date: string) => {
    const dateMeals = meals.filter(meal => meal.date === date)
    if (viewMode === "My Meals") {
      return dateMeals.filter(meal => meal.assignedTo === currentUser || meal.createdBy === currentUser)
    } else if (viewMode === "Partner's Meals") {
      const partner = currentUser === "Vishwa" ? "Shruthi" : "Vishwa"
      return dateMeals.filter(meal => meal.assignedTo === partner || meal.createdBy === partner)
    }
    return dateMeals
  }

  // Calculate daily nutrition for current user
  const userNutritionGoals = nutritionGoals[currentUser]
  const userTodayMeals = todayMeals.filter(meal => 
    meal.assignedTo === currentUser && meal.status === "completed"
  )
  
  const dailyNutrition = userTodayMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    carbs: acc.carbs + meal.carbs,
    protein: acc.protein + meal.protein,
    fats: acc.fats + meal.fats,
  }), { calories: 0, carbs: 0, protein: 0, fats: 0 })

  // Calculate water intake for current user
  const userTodayWater = waterIntake
    .filter(intake => intake.userId === currentUser && intake.date === todayString)
    .reduce((total, intake) => total + intake.amount, 0)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this meal?")) {
      try {
        await deleteMeal(id)
      } catch (error) {
        console.error("Error deleting meal:", error)
      }
    }
  }

  const handleAddWater = async (amount: number) => {
    try {
      await addWaterIntake({
        userId: currentUser,
        date: todayString,
        amount,
        unit: "cups",
        drinkType: "water",
      })
    } catch (error) {
      console.error("Error adding water:", error)
    }
  }

  const openMealModal = (date: string, mealType: any) => {
    setSelectedDate(date)
    setSelectedMealType(mealType)
    setMealModalOpen(true)
  }

  const toggleDayExpansion = (dateString: string) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dateString)) {
      newExpanded.delete(dateString)
    } else {
      newExpanded.add(dateString)
    }
    setExpandedDays(newExpanded)
  }

  // Calculate daily summary stats
  const getDailySummary = (dateString: string) => {
    const dayMeals = getFilteredMeals(dateString)
    const completedMeals = dayMeals.filter(meal => meal.status === "completed")
    const totalCalories = completedMeals.reduce((acc, meal) => acc + meal.calories, 0)
    const targetCalories = userNutritionGoals?.dailyCalories || 2000
    const completionPercentage = Math.round((completedMeals.length / Math.max(dayMeals.length, 1)) * 100)
    
    let statusColor = "bg-slate-100 border-slate-200"
    if (dayMeals.length === 0) {
      statusColor = "bg-slate-50 border-slate-200"
    } else if (completionPercentage >= 100) {
      statusColor = "bg-emerald-50 border-emerald-200"
    } else if (completionPercentage >= 50) {
      statusColor = "bg-amber-50 border-amber-200"
    } else if (dayMeals.length > 0) {
      statusColor = "bg-blue-50 border-blue-200"
    }

    return {
      totalMeals: dayMeals.length,
      completedMeals: completedMeals.length,
      totalCalories,
      targetCalories,
      completionPercentage,
      statusColor,
      hasPlannedMeals: dayMeals.length > 0
    }
  }

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return Coffee
      case 'lunch': return Sun
      case 'dinner': return Moon
      case 'snack': return Cookie
      default: return Utensils
    }
  }

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex-1 p-4 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-slate-600">Loading your meal plan...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex-1 p-4 pb-20 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto">
              <Utensils className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-red-500 font-medium">Unable to load meal plan</p>
            <p className="text-slate-600 text-sm">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto bg-slate-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-4 pb-20 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Meal Planning</h1>
              <p className="text-slate-600">Track nutrition and plan delicious meals</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={currentUser === "Vishwa" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentUser("Vishwa")}
                className="text-xs"
              >
                Vishwa
              </Button>
              <Button
                variant={currentUser === "Shruthi" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentUser("Shruthi")}
                className="text-xs"
              >
                Shruthi
              </Button>
            </div>
          </div>

          {/* Today's Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-emerald-500 rounded-lg w-fit mx-auto mb-2">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-emerald-800">{todayMeals.length}</p>
                <p className="text-xs text-emerald-700">Meals Today</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-blue-500 rounded-lg w-fit mx-auto mb-2">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {userNutritionGoals ? Math.round((dailyNutrition.calories / userNutritionGoals.dailyCalories) * 100) : 0}%
                </p>
                <p className="text-xs text-blue-700">Calorie Goal</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-cyan-500 rounded-lg w-fit mx-auto mb-2">
                  <Droplets className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-cyan-800">
                  {userTodayWater}/{userNutritionGoals?.dailyWater || 8}
                </p>
                <p className="text-xs text-cyan-700">Water (cups)</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-purple-500 rounded-lg w-fit mx-auto mb-2">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-purple-800">
                  {todayMeals.filter(m => m.status === "completed").length}
                </p>
                <p className="text-xs text-purple-700">Completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Quick Actions</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => openMealModal(todayString, "breakfast")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Meal
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 4].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleAddWater(amount)}
                  >
                    <Droplets className="h-3 w-3 mr-1" />
                    +{amount} cup{amount > 1 ? 's' : ''}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Progress */}
          {userNutritionGoals && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Today's Nutrition - {currentUser}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Calories</span>
                        <span className="text-sm text-slate-600">
                          {dailyNutrition.calories}/{userNutritionGoals.dailyCalories}
                        </span>
                      </div>
                      <Progress value={(dailyNutrition.calories / userNutritionGoals.dailyCalories) * 100} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Protein</span>
                        <span className="text-sm text-slate-600">
                          {dailyNutrition.protein}g/{userNutritionGoals.dailyProtein}g
                        </span>
                      </div>
                      <Progress value={(dailyNutrition.protein / userNutritionGoals.dailyProtein) * 100} className="h-3" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Carbs</span>
                        <span className="text-sm text-slate-600">
                          {dailyNutrition.carbs}g/{userNutritionGoals.dailyCarbs}g
                        </span>
                      </div>
                      <Progress value={(dailyNutrition.carbs / userNutritionGoals.dailyCarbs) * 100} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Fats</span>
                        <span className="text-sm text-slate-600">
                          {dailyNutrition.fats}g/{userNutritionGoals.dailyFats}g
                        </span>
                      </div>
                      <Progress value={(dailyNutrition.fats / userNutritionGoals.dailyFats) * 100} className="h-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Summary Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Weekly Overview ({format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d")})
              </CardTitle>
              <div className="flex gap-2">
                {["My Meals", "Partner's Meals", "Our Meals"].map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setViewMode(mode as any)}
                  >
                    {mode === "My Meals" ? "Mine" : mode === "Partner's Meals" ? "Partner" : "Both"}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekDays.map((day) => {
                  const dateString = day.toISOString().split('T')[0]
                  const dayMeals = getFilteredMeals(dateString)
                  const isToday = dateString === todayString
                  const isExpanded = expandedDays.has(dateString)
                  const summary = getDailySummary(dateString)

                  return (
                    <Card key={dateString} className={`transition-all duration-200 ${summary.statusColor} ${isToday ? 'ring-2 ring-emerald-300' : ''}`}>
                      <CardContent className="p-0">
                        {/* Summary Header - Always Visible */}
                        <div 
                          className="p-4 cursor-pointer hover:bg-black/5 transition-colors"
                          onClick={() => toggleDayExpansion(dateString)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-center">
                                <div className="font-semibold text-slate-800">{format(day, "EEE")}</div>
                                <div className="text-xs text-slate-600">{format(day, "MMM d")}</div>
                              </div>
                              
                              {isToday && (
                                <Badge variant="default" className="bg-emerald-600 text-white text-xs">
                                  Today
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4">
                              {/* Daily Summary Stats */}
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Utensils className="h-4 w-4 text-slate-500" />
                                  <span className="font-medium">{summary.totalMeals}</span>
                                  <span className="text-slate-600">meals</span>
                                </div>
                                
                                {summary.totalCalories > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">{summary.totalCalories}</span>
                                    <span className="text-slate-600">cal</span>
                                  </div>
                                )}
                                
                                {summary.hasPlannedMeals && (
                                  <div className="flex items-center gap-2">
                                    <Progress value={summary.completionPercentage} className="h-2 w-16" />
                                    <span className="text-xs font-medium text-slate-600">
                                      {summary.completionPercentage}%
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openMealModal(dateString, "breakfast")
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-slate-500" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-slate-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Meal Details */}
                        {isExpanded && (
                          <div className="border-t bg-white/50 p-4 space-y-3">
                            {dayMeals.length === 0 ? (
                              <div className="text-center py-6 text-slate-500">
                                <Utensils className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm">No meals planned</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => openMealModal(dateString, "breakfast")}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Plan your first meal
                                </Button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {dayMeals.map((meal) => {
                                  const MealIcon = getMealTypeIcon(meal.mealType)
                                  return (
                                    <div
                                      key={meal.id}
                                      className="bg-white rounded-lg p-3 border group hover:shadow-sm transition-all"
                                    >
                                      <div className="flex items-start gap-3">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-0 h-6 w-6 mt-0.5 flex-shrink-0"
                                          onClick={() => toggleMealComplete(meal.id)}
                                        >
                                          <CheckCircle2
                                            className={`h-5 w-5 ${
                                              meal.status === "completed" 
                                                ? "text-emerald-500 fill-emerald-500" 
                                                : "text-slate-400"
                                            }`}
                                          />
                                        </Button>
                                        
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <div className={`p-1 rounded text-white ${
                                              meal.mealType === 'breakfast' ? 'bg-orange-500' :
                                              meal.mealType === 'lunch' ? 'bg-blue-500' :
                                              meal.mealType === 'dinner' ? 'bg-purple-500' : 'bg-green-500'
                                            }`}>
                                              <MealIcon className="h-3 w-3" />
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                                              {meal.mealType}
                                            </span>
                                          </div>
                                          
                                          <p className={`font-medium text-sm mb-1 ${
                                            meal.status === "completed" ? "line-through text-slate-500" : "text-slate-800"
                                          }`}>
                                            {meal.name}
                                          </p>
                                          
                                          <div className="flex items-center gap-3 text-xs text-slate-600">
                                            <span>{meal.calories} cal</span>
                                            <span>•</span>
                                            <span>{meal.assignedTo}</span>
                                          </div>
                                        </div>
                                        
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                          onClick={() => handleDelete(meal.id)}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
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
              { id: "meals", icon: Utensils, label: "Meals", href: "/meals" },
              { id: "finance", icon: Wallet, label: "Finance", href: "/finance" },
              { id: "travel", icon: Plane, label: "Travel", href: "/travel" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  tab.id === "meals" ? "text-emerald-600 bg-emerald-50" : "text-slate-600"
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

      <MealModal 
        open={mealModalOpen} 
        onOpenChange={setMealModalOpen}
        defaultDate={selectedDate}
        defaultMealType={selectedMealType}
      />
    </div>
  )
} 