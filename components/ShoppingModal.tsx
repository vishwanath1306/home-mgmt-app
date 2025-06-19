"use client"

import { useState } from "react"
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
import { useShopping, type ShoppingCategory, type PersonType } from "@/app/hooks/useShopping"

interface ShoppingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Shopping Modal Component
 * 
 * Provides a form interface for adding new shopping items with:
 * - Item name and category selection
 * - Quantity and unit specification
 * - Estimated price entry
 * - Store assignment (optional)
 * - Notes field (optional)
 * - Person assignment
 */
export function ShoppingModal({ open, onOpenChange }: ShoppingModalProps) {
  const { addItem } = useShopping()
  
  // Form state with proper typing
  const [formData, setFormData] = useState({
    item: "",
    category: "" as ShoppingCategory | "",
    quantity: 1,
    unit: "pcs",
    estimatedPrice: 0,
    addedBy: "Vishwa" as PersonType,
    store: "",
    notes: "",
  })

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.item || !formData.category) {
      return
    }
    
    try {
      await addItem({
        ...formData,
        category: formData.category as ShoppingCategory,
        store: formData.store || undefined,
        notes: formData.notes || undefined,
      })
      
      // Close modal and reset form
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error saving shopping item:", error)
    }
  }

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      item: "",
      category: "",
      quantity: 1,
      unit: "pcs",
      estimatedPrice: 0,
      addedBy: "Vishwa",
      store: "",
      notes: "",
    })
  }

  /**
   * Handle modal close
   */
  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Shopping Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="item">Item Name *</Label>
            <Input
              id="item"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              placeholder="e.g., Organic Bananas"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: ShoppingCategory) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Household">Household</SelectItem>
                <SelectItem value="Personal Care">Personal Care</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="lbs">Pounds</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="bottles">Bottles</SelectItem>
                  <SelectItem value="packs">Packs</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimated Price */}
          <div className="space-y-2">
            <Label htmlFor="estimatedPrice">Estimated Price</Label>
            <Input
              id="estimatedPrice"
              type="number"
              min={0}
              step={0.01}
              value={formData.estimatedPrice}
              onChange={(e) => setFormData({ ...formData, estimatedPrice: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          {/* Store (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="store">Store (Optional)</Label>
            <Input
              id="store"
              value={formData.store}
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
              placeholder="e.g., Walmart, Target"
            />
          </div>

          {/* Added By */}
          <div className="space-y-2">
            <Label htmlFor="addedBy">Added By</Label>
            <Select
              value={formData.addedBy}
              onValueChange={(value: PersonType) => setFormData({ ...formData, addedBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vishwa">Vishwa</SelectItem>
                <SelectItem value="Shruthi">Shruthi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions or preferences..."
              rows={2}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={!formData.item || !formData.category}
            >
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 