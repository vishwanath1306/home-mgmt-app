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
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useMeals, type MealType } from "@/app/hooks/useMeals"

interface MealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: string | null
  defaultMealType?: MealType | null
}

export function MealModal({ open, onOpenChange, defaultDate, defaultMealType }: MealModalProps) {
  const { addMeal, savedMeals } = useMeals()
  const [formData, setFormData] = useState({
    mealPlanId: "week-1",
    date: defaultDate || new Date().toISOString().split('T')[0],
    mealType: defaultMealType || "breakfast" as MealType,
    name: "",
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
    prepTime: 0,
    ingredients: [""],
    instructions: "",
    assignedTo: "",
    createdBy: "Vishwa",
  })

  // Update date and mealType if props change
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        date: defaultDate || new Date().toISOString().split('T')[0],
        mealType: defaultMealType || "breakfast",
      }))
    }
  }, [defaultDate, defaultMealType, open])

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients]
    newIngredients[index] = value
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] })
  }

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index)
    setFormData({ ...formData, ingredients: newIngredients })
  }

  const loadFromSavedMeal = (savedMeal: any) => {
    setFormData(prev => ({
      ...prev,
      name: savedMeal.name,
      calories: savedMeal.calories,
      carbs: savedMeal.carbs,
      protein: savedMeal.protein,
      fats: savedMeal.fats,
      ingredients: savedMeal.ingredients,
      instructions: savedMeal.instructions,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const cleanedIngredients = formData.ingredients.filter(ing => ing.trim() !== "")
      await addMeal({
        ...formData,
        ingredients: cleanedIngredients,
      })
      onOpenChange(false)
      setFormData({
        mealPlanId: "week-1",
        date: defaultDate || new Date().toISOString().split('T')[0],
        mealType: defaultMealType || "breakfast",
        name: "",
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0,
        prepTime: 0,
        ingredients: [""],
        instructions: "",
        assignedTo: "",
        createdBy: "Vishwa",
      })
    } catch (error) {
      console.error("Error saving meal:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Meal</DialogTitle>
        </DialogHeader>
        
        {/* Saved Meals Quick Select */}
        {savedMeals.length > 0 && (
          <div className="space-y-2 border-b pb-4">
            <Label>Quick Select from Saved Meals</Label>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {savedMeals.slice(0, 3).map((saved) => (
                <Button
                  key={saved.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-2"
                  onClick={() => loadFromSavedMeal(saved)}
                >
                  <div>
                    <div className="font-medium">{saved.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {saved.calories} cal • Used {saved.timesUsed} times
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(new Date(formData.date), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={(date) =>
                      setFormData({ ...formData, date: date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0] })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mealType">Meal Type</Label>
              <Select
                value={formData.mealType}
                onValueChange={(value: MealType) => setFormData({ ...formData, mealType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Meal Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vishwa">Vishwa</SelectItem>
                  <SelectItem value="Shruthi">Shruthi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time (minutes)</Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ingredients</Label>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder="Enter ingredient..."
                  />
                  {formData.ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Enter cooking instructions..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
              Add Meal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 