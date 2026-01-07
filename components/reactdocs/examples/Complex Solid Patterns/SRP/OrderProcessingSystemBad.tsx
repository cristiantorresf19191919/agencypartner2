// ❌ BAD EXAMPLE: Single Responsibility Principle Violation
// This component/class has multiple responsibilities: validation, pricing, payment, inventory, emails, and database operations

interface ComplexOrder {
  id: string;
  customerId: string;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

class ComplexOrderProcessor {
  // ❌ Responsibility 1: Order Validation
  validateOrder(order: ComplexOrder): boolean {
    if (order.items.length === 0) {
      console.log("❌ Order validation failed: No items in order");
      return false;
    }

    if (!this.checkCustomerExists(order.customerId)) {
      console.log("❌ Order validation failed: Customer not found");
      return false;
    }

    if (order.shippingAddress.trim() === "") {
      console.log("❌ Order validation failed: Invalid shipping address");
      return false;
    }

    return true;
  }

  private checkCustomerExists(customerId: string): boolean {
    return customerId.trim() !== "";
  }

  // ❌ Responsibility 2: Price Calculation
  calculateTotalPrice(order: ComplexOrder): number {
    let subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply discounts
    if (order.items.length > 5) {
      subtotal *= 0.9; // 10% discount
    }

    // Calculate tax
    const tax = subtotal * 0.08; // 8% tax

    // Calculate shipping
    const shipping = this.calculateShippingCost(order.items.length);

    return subtotal + tax + shipping;
  }

  private calculateShippingCost(itemCount: number): number {
    if (itemCount <= 3) return 5.0;
    if (itemCount <= 10) return 10.0;
    return 15.0;
  }

  // ❌ Responsibility 3: Payment Processing
  async processPayment(
    order: ComplexOrder,
    totalAmount: number
  ): Promise<boolean> {
    console.log(
      `Processing payment of $${totalAmount} using ${order.paymentMethod}`
    );

    switch (order.paymentMethod) {
      case "credit_card":
        return await this.processCreditCardPayment(
          order.customerId,
          totalAmount
        );
      case "paypal":
        return await this.processPayPalPayment(order.customerId, totalAmount);
      case "bank_transfer":
        return await this.processBankTransfer(order.customerId, totalAmount);
      default:
        console.log(
          `❌ Unsupported payment method: ${order.paymentMethod}`
        );
        return false;
    }
  }

  private async processCreditCardPayment(
    customerId: string,
    amount: number
  ): Promise<boolean> {
    console.log("Processing credit card payment...");
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  private async processPayPalPayment(
    customerId: string,
    amount: number
  ): Promise<boolean> {
    console.log("Processing PayPal payment...");
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  private async processBankTransfer(
    customerId: string,
    amount: number
  ): Promise<boolean> {
    console.log("Processing bank transfer...");
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  // ❌ Responsibility 4: Inventory Management
  async updateInventory(order: ComplexOrder): Promise<boolean> {
    console.log(`Updating inventory for order ${order.id}`);

    for (const item of order.items) {
      const currentStock = await this.getCurrentStock(item.productId);
      if (currentStock < item.quantity) {
        console.log(
          `❌ Insufficient stock for product ${item.productId}`
        );
        return false;
      }

      await this.decreaseStock(item.productId, item.quantity);
      console.log(
        `Reduced stock for product ${item.productId} by ${item.quantity}`
      );
    }

    return true;
  }

  private async getCurrentStock(productId: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return 100; // Mock stock
  }

  private async decreaseStock(productId: string, quantity: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    console.log(`Decreasing stock for ${productId} by ${quantity}`);
  }

  // ❌ Responsibility 5: Email Notifications
  async sendOrderConfirmationEmail(
    order: ComplexOrder,
    totalAmount: number
  ): Promise<void> {
    const customerEmail = await this.getCustomerEmail(order.customerId);
    const emailContent = `
Dear Customer,

Your order #${order.id} has been confirmed.
Total amount: $${totalAmount}
Shipping address: ${order.shippingAddress}

Thank you for your purchase!
    `.trim();

    await this.sendEmail(
      customerEmail,
      `Order Confirmation - Order #${order.id}`,
      emailContent
    );
    console.log(`Order confirmation email sent to ${customerEmail}`);
  }

  private async getCustomerEmail(customerId: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return `customer${customerId}@example.com`;
  }

  private async sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(`Sending email to ${to} with subject: ${subject}`);
  }

  // ❌ Responsibility 6: Database Operations
  async saveOrderToDatabase(
    order: ComplexOrder,
    totalAmount: number
  ): Promise<void> {
    console.log(`Saving order ${order.id} to database`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(
      `Order saved: ID=${order.id}, Customer=${order.customerId}, Total=$${totalAmount}`
    );
  }

  // ❌ This method does EVERYTHING - violates SRP
  async processOrder(order: ComplexOrder): Promise<boolean> {
    // Step 1: Validate
    if (!this.validateOrder(order)) {
      return false;
    }

    // Step 2: Calculate price
    const totalPrice = this.calculateTotalPrice(order);
    console.log(`Total price calculated: $${totalPrice}`);

    // Step 3: Check inventory
    if (!(await this.updateInventory(order))) {
      return false;
    }

    // Step 4: Process payment
    if (!(await this.processPayment(order, totalPrice))) {
      await this.rollbackInventory(order);
      return false;
    }

    // Step 5: Save to database
    await this.saveOrderToDatabase(order, totalPrice);

    // Step 6: Send email
    await this.sendOrderConfirmationEmail(order, totalPrice);

    console.log(`✅ Order ${order.id} processed successfully`);
    return true;
  }

  private async rollbackInventory(order: ComplexOrder): Promise<void> {
    console.log(`Rolling back inventory changes for order ${order.id}`);
  }
}

export function OrderProcessingSystemBad() {
  const processor = new ComplexOrderProcessor();

  const order: ComplexOrder = {
    id: "ORD-001",
    customerId: "CUST-123",
    items: [
      { productId: "PROD-1", quantity: 2, price: 25.0 },
      { productId: "PROD-2", quantity: 1, price: 50.0 },
      { productId: "PROD-3", quantity: 3, price: 15.0 },
    ],
    shippingAddress: "123 Main St, City, Country",
    paymentMethod: "credit_card",
  };

  const handleProcessOrder = async () => {
    await processor.processOrder(order);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bad: Violating SRP</h2>
      <p className="mb-4 text-gray-600">
        This processor class handles validation, pricing, payment, inventory,
        emails, and database operations - too many responsibilities!
      </p>
      <button
        onClick={handleProcessOrder}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Process Order (Check Console)
      </button>
    </div>
  );
}

