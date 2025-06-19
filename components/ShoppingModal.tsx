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
import { useShopping } from "@/app/hooks/useShopping"

interface ShoppingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShoppingModal({ open, onOpenChange }: ShoppingModalProps) {
  const { addShoppingItem } = useShopping()
  const [formData, setFormData] = useState({
    item: "",
    category: "",
    price: 0,
    quantity: 1,
    addedBy: "Vishwa",
    date: new Date().toISOString(),
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await addShoppingItem(formData)
      onOpenChange(false)
      setFormData({
        item: "",
        category: "",
        price: 0,
        quantity: 1,
        addedBy: "Vishwa",
        date: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving item:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Shopping Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item</Label>
            <Input
              id="item"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Bakery">Bakery</SelectItem>
                <SelectItem value="Produce">Produce</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addedBy">Added By</Label>
            <Select
              value={formData.addedBy}
              onValueChange={(value) => setFormData({ ...formData, addedBy: value })}
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 