# Home Management App

A comprehensive home management application built for couples to organize their household tasks, meal planning, shopping lists, finances, and travel together.

## ✨ Features

- **Dashboard**: Central hub with quick overview of all household activities
- **Task Management**: Create, assign, and track household tasks with priorities and categories
- **Meal Planning**: Weekly meal planning with nutrition tracking and water intake monitoring
- **Shopping Lists**: Organized shopping with categories, price estimates, and store assignments
- **Finance Tracking**: Expense and income tracking with category-based budgeting
- **Travel Planning**: Trip planning and organization (coming soon)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Drag & Drop**: @dnd-kit

### Project Structure

```
home-mgmt-app/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Dashboard (main page)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── hooks/                    # Custom React hooks
│   │   ├── useTasks.ts          # Task management
│   │   ├── useMeals.ts          # Meal planning & nutrition
│   │   ├── useShopping.ts       # Shopping list management
│   │   └── useFinance.ts        # Financial tracking
│   ├── api/                      # API routes
│   │   ├── tasks/route.ts
│   │   ├── meals/route.ts
│   │   ├── shopping/route.ts
│   │   └── finance/route.ts
│   ├── meals/page.tsx           # Meal planning page
│   ├── task/page.tsx            # Task management page
│   ├── shopping/page.tsx        # Shopping list page
│   ├── finance/page.tsx         # Finance tracking page
│   └── travel/page.tsx          # Travel planning page
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   ├── TaskModal.tsx            # Task creation modal
│   ├── MealModal.tsx            # Meal planning modal
│   ├── ShoppingModal.tsx        # Shopping item modal
│   ├── FinanceModal.tsx         # Expense tracking modal
│   └── theme-provider.tsx       # Theme management
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities
└── public/                      # Static assets
```

## 🧹 Recent Cleanup & Refactoring

This codebase has been thoroughly cleaned up and refactored to improve maintainability, type safety, and performance:

### ✅ What Was Cleaned Up

1. **Removed Dead Code**
   - Eliminated unused render functions in main page (renderTasks, renderShopping, etc.)
   - Removed redundant currentScreen state management
   - Cleaned up unused imports throughout the codebase

2. **Improved Type Safety**
   - Added comprehensive type definitions for all data models
   - Replaced `any` types with proper TypeScript interfaces
   - Enhanced type safety in hooks and components

3. **Better Code Organization**
   - Restructured main dashboard to focus only on overview functionality
   - Organized hooks with clear separation of concerns
   - Added comprehensive JSDoc comments throughout

4. **Enhanced Hooks**
   - `useTasks.ts`: Added utility functions for filtering and calculations
   - `useMeals.ts`: Improved nutrition tracking and water intake management
   - `useShopping.ts`: Enhanced shopping list functionality with better categorization
   - `useFinance.ts`: Added financial calculations and filtering options

5. **Component Improvements**
   - Updated modals to use proper TypeScript types
   - Enhanced form validation and error handling
   - Improved accessibility and user experience

6. **Navigation Consistency**
   - Simplified navigation logic
   - All feature pages now have dedicated routes
   - Consistent bottom navigation across all pages

### 🔧 Code Quality Improvements

- **Comments**: Added comprehensive documentation for all functions and components
- **Type Definitions**: Exported proper TypeScript types for better intellisense
- **Error Handling**: Improved error boundaries and user feedback
- **Performance**: Removed unnecessary re-renders and optimized data fetching
- **Consistency**: Standardized naming conventions and code patterns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd home-mgmt-app
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## 📝 Usage

### Dashboard
The main dashboard provides a quick overview of:
- Task completion progress
- Today's meal plans
- Shopping list status
- Monthly spending
- Upcoming travel plans

### Task Management
- Create tasks with priorities (high, medium, low)
- Assign to either Vishwa or Shruthi
- Categorize by type (Cleaning, Maintenance, Errands, etc.)
- Set due dates and time estimates
- Track completion status

### Meal Planning
- Plan meals for the week with drag-and-drop interface
- Track nutrition goals (calories, protein, carbs, fats)
- Monitor water intake
- Switch between user views (My Meals, Partner's Meals, Our Meals)
- Mark meals as completed

### Shopping Lists
- Add items with categories and estimated prices
- Specify quantities and units
- Assign to specific stores
- Track purchase status
- Calculate total estimated costs

### Finance Tracking
- Log expenses and income
- Categorize transactions
- Track spending by person
- Monitor monthly budgets
- View spending patterns

## 🤝 Contributing

This is a personal project for Vishwa and Shruthi's household management. The codebase is well-documented and follows modern React/Next.js best practices.

## 📄 License

Private - Personal use only

---

Built with ❤️ by Vishwa & Shruthi