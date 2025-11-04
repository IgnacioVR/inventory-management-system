export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  discount: number // discount in percentage or amount
  discountType: "percentage" | "fixed" // percentage or fixed amount
}

export interface PosState {
  cartItems: CartItem[]
  totalDiscount: number
  discountType: "percentage" | "fixed"
}
