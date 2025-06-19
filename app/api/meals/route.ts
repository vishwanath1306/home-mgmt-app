import { NextResponse } from "next/server"

// Mock database - replace with actual database in production
let meals = [
  {
    id: "1",
    mealPlanId: "week-1",
    date: new Date().toISOString().split('T')[0],
    mealType: "breakfast",
    name: "Overnight Oats with Berries",
    calories: 350,
    carbs: 45,
    protein: 12,
    fats: 8,
    prepTime: 5,
    ingredients: ["Rolled oats", "Greek yogurt", "Mixed berries", "Honey"],
    instructions: "Mix all ingredients in a jar and refrigerate overnight",
    assignedTo: "Vishwa",
    status: "planned",
    createdBy: "Vishwa",
  },
  {
    id: "2",
    mealPlanId: "week-1",
    date: new Date().toISOString().split('T')[0],
    mealType: "lunch",
    name: "Grilled Chicken Salad",
    calories: 420,
    carbs: 15,
    protein: 35,
    fats: 18,
    prepTime: 20,
    ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Olive oil"],
    instructions: "Grill chicken, toss with greens and dressing",
    assignedTo: "Shruthi",
    status: "planned",
    createdBy: "Shruthi",
  },
]

let nutritionGoals: Record<string, any> = {
  "Vishwa": {
    userId: "Vishwa",
    dailyCalories: 2200,
    dailyCarbs: 275,
    dailyProtein: 110,
    dailyFats: 73,
    dailyWater: 8,
    waterUnit: "cups",
  },
  "Shruthi": {
    userId: "Shruthi",
    dailyCalories: 1800,
    dailyCarbs: 225,
    dailyProtein: 90,
    dailyFats: 60,
    dailyWater: 8,
    waterUnit: "cups",
  },
}

let waterIntake = [
  {
    id: "1",
    userId: "Vishwa",
    date: new Date().toISOString().split('T')[0],
    amount: 2,
    unit: "cups",
    drinkType: "water",
    timestamp: new Date().toISOString(),
  },
]

let savedMeals = [
  {
    id: "1",
    userId: "Vishwa",
    name: "Protein Smoothie",
    calories: 280,
    carbs: 25,
    protein: 30,
    fats: 8,
    ingredients: ["Protein powder", "Banana", "Almond milk", "Spinach"],
    instructions: "Blend all ingredients until smooth",
    timesUsed: 5,
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const date = searchParams.get("date")
  const userId = searchParams.get("userId")

  if (type === "nutrition-goals" && userId) {
    return NextResponse.json(nutritionGoals[userId] || null)
  }

  if (type === "water-intake" && userId && date) {
    const userWaterIntake = waterIntake.filter(
      (intake) => intake.userId === userId && intake.date === date
    )
    return NextResponse.json(userWaterIntake)
  }

  if (type === "saved-meals" && userId) {
    const userSavedMeals = savedMeals.filter((meal) => meal.userId === userId)
    return NextResponse.json(userSavedMeals)
  }

  if (date) {
    const dateMeals = meals.filter((meal) => meal.date === date)
    return NextResponse.json(dateMeals)
  }

  return NextResponse.json(meals)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { type } = body

  if (type === "water-intake") {
    const newWaterIntake = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      timestamp: new Date().toISOString(),
    }
    delete newWaterIntake.type
    waterIntake.push(newWaterIntake)
    return NextResponse.json(newWaterIntake)
  }

  if (type === "saved-meal") {
    const newSavedMeal = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      timesUsed: 1,
    }
    delete newSavedMeal.type
    savedMeals.push(newSavedMeal)
    return NextResponse.json(newSavedMeal)
  }

  // Regular meal creation
  const newMeal = {
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    status: "planned",
  }
  meals.push(newMeal)
  return NextResponse.json(newMeal)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, type, ...updates } = body

  if (type === "nutrition-goals") {
    nutritionGoals[updates.userId] = { ...nutritionGoals[updates.userId], ...updates }
    return NextResponse.json(nutritionGoals[updates.userId])
  }

  // Regular meal update
  meals = meals.map((meal) => (meal.id === id ? { ...meal, ...updates } : meal))
  return NextResponse.json(meals.find((meal) => meal.id === id))
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type")

  if (type === "water-intake" && id) {
    waterIntake = waterIntake.filter((intake) => intake.id !== id)
    return NextResponse.json({ success: true })
  }

  if (type === "saved-meal" && id) {
    savedMeals = savedMeals.filter((meal) => meal.id !== id)
    return NextResponse.json({ success: true })
  }

  if (id) {
    meals = meals.filter((meal) => meal.id !== id)
  }
  return NextResponse.json({ success: true })
} 