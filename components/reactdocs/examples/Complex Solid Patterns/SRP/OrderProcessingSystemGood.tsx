// ✅ GOOD EXAMPLE: Single Responsibility Principle Applied
// Each class/service has a single, well-defined responsibility
// Classes are focused, testable, and maintainable

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

// ✅ Responsibility 1: Order Validation Only
type ValidationResult =
  | { success: true }
  | { success: false; errors: string[] };

class OrderValidator {
  private customerRepository = new CustomerRepository();

  validate(order: ComplexOrder): ValidationResult {
    const errors: string[] = [];

    if (order.items.length === 0) {
      errors.push("Order must contain at least one item");
    }

    if (!this.customerRepository.exists(order.customerId)) {
      errors.push(`Customer ${order.customerId} not found`);
    }

    if (order.shippingAddress.trim() === "") {
      errors.push("Shipping address is required");
    }

    if (order.paymentMethod.trim() === "") {
      errors.push("Payment method is required");
    }

    return errors.length === 0
      ? { success: true }
      : { success: false, errors };
  }
}

// ✅ Responsibility 2: Price Calculation Only
class PriceCalculator {
  private taxCalculator = new TaxCalculator();
  private shippingCalculator = new ShippingCalculator();
  private discountCalculator = new DiscountCalculator();

  calculateTotal(order: ComplexOrder): number {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = this.discountCalculator.calculateDiscount(order);
    const discountedSubtotal = subtotal - discount;
    const tax = this.taxCalculator.calculateTax(discountedSubtotal);
    const shipping = this.shippingCalculator.calculateShipping(
      order.items.length
    );

    return discountedSubtotal + tax + shipping;
  }
}

class TaxCalculator {
  private readonly taxRate = 0.08; // 8%

  calculateTax(amount: number): number {
    return amount * this.taxRate;
  }
}

class ShippingCalculator {
  calculateShipping(itemCount: number): number {
    if (itemCount <= 3) return 5.0;
    if (itemCount <= 10) return 10.0;
    return 15.0;
  }
}

class DiscountCalculator {
  calculateDiscount(order: ComplexOrder): number {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 10% discount for orders with more than 5 items
    return order.items.length > 5 ? subtotal * 0.1 : 0.0;
  }
}

// ✅ Responsibility 3: Payment Processing Only
interface PaymentProcessor {
  process(customerId: string, amount: number): Promise<PaymentResult>;
}

interface PaymentResult {
  success: boolean;
  transactionId: string | null;
}

class CreditCardProcessor implements PaymentProcessor {
  async process(customerId: string, amount: number): Promise<PaymentResult> {
    console.log(
      `Processing credit card payment of $${amount} for customer ${customerId}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      success: true,
      transactionId: `TXN-CC-${Date.now()}`,
    };
  }
}

class PayPalProcessor implements PaymentProcessor {
  async process(customerId: string, amount: number): Promise<PaymentResult> {
    console.log(
      `Processing PayPal payment of $${amount} for customer ${customerId}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      success: true,
      transactionId: `TXN-PP-${Date.now()}`,
    };
  }
}

class BankTransferProcessor implements PaymentProcessor {
  async process(customerId: string, amount: number): Promise<PaymentResult> {
    console.log(
      `Processing bank transfer of $${amount} for customer ${customerId}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      success: true,
      transactionId: `TXN-BT-${Date.now()}`,
    };
  }
}

class PaymentProcessorFactory {
  create(paymentMethod: string): PaymentProcessor {
    switch (paymentMethod) {
      case "credit_card":
        return new CreditCardProcessor();
      case "paypal":
        return new PayPalProcessor();
      case "bank_transfer":
        return new BankTransferProcessor();
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }
}

// ✅ Responsibility 4: Inventory Management Only
interface ItemReservation {
  id: string;
  productId: string;
  quantity: number;
}

type InventoryReservationResult =
  | { success: true; reservations: ItemReservation[] }
  | { success: false; message: string };

class InventoryManager {
  private inventoryRepository = new InventoryRepository();

  async reserveItems(order: ComplexOrder): Promise<InventoryReservationResult> {
    const reservations: ItemReservation[] = [];

    for (const item of order.items) {
      const availableStock = await this.inventoryRepository.getStock(
        item.productId
      );

      if (availableStock < item.quantity) {
        // Rollback previous reservations
        for (const reservation of reservations) {
          await this.inventoryRepository.releaseReservation(reservation);
        }
        return {
          success: false,
          message: `Insufficient stock for product ${item.productId}. Available: ${availableStock}, Required: ${item.quantity}`,
        };
      }

      const reservation = await this.inventoryRepository.reserve(
        item.productId,
        item.quantity
      );
      reservations.push(reservation);
    }

    return { success: true, reservations };
  }

  async releaseReservations(reservations: ItemReservation[]): Promise<void> {
    for (const reservation of reservations) {
      await this.inventoryRepository.releaseReservation(reservation);
    }
  }
}

// ✅ Responsibility 5: Email Notifications Only
class EmailNotificationService {
  private customerRepository = new CustomerRepository();
  private emailSender = new EmailSender();

  async sendOrderConfirmation(
    order: ComplexOrder,
    totalAmount: number
  ): Promise<void> {
    const customerEmail = this.customerRepository.getEmail(order.customerId);
    const emailContent = OrderEmailTemplate.generateConfirmation(
      order,
      totalAmount
    );

    await this.emailSender.send(
      customerEmail,
      `Order Confirmation - Order #${order.id}`,
      emailContent
    );
  }
}

class OrderEmailTemplate {
  static generateConfirmation(
    order: ComplexOrder,
    totalAmount: number
  ): string {
    return `
Dear Customer,

Your order #${order.id} has been confirmed.
Total amount: $${totalAmount}
Shipping address: ${order.shippingAddress}

Thank you for your purchase!
    `.trim();
  }
}

// ✅ Responsibility 6: Database Operations Only
class OrderRepository {
  async save(
    order: ComplexOrder,
    totalAmount: number,
    transactionId: string | null
  ): Promise<void> {
    console.log(
      `Saving order to database: ID=${order.id}, Customer=${order.customerId}, Total=$${totalAmount}, Transaction=${transactionId}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  async findById(orderId: string): Promise<ComplexOrder | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return null;
  }
}

// Supporting classes
class CustomerRepository {
  exists(customerId: string): boolean {
    return customerId.trim() !== "";
  }

  getEmail(customerId: string): string {
    return `customer${customerId}@example.com`;
  }
}

class InventoryRepository {
  private stock: Map<string, number> = new Map([
    ["PROD-1", 100],
    ["PROD-2", 50],
    ["PROD-3", 200],
  ]);

  async getStock(productId: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.stock.get(productId) || 0;
  }

  async reserve(
    productId: string,
    quantity: number
  ): Promise<ItemReservation> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const currentStock = this.stock.get(productId) || 0;
    this.stock.set(productId, currentStock - quantity);
    return {
      id: `RES-${Date.now()}`,
      productId,
      quantity,
    };
  }

  async releaseReservation(reservation: ItemReservation): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const currentStock = this.stock.get(reservation.productId) || 0;
    this.stock.set(reservation.productId, currentStock + reservation.quantity);
  }
}

class EmailSender {
  async send(to: string, subject: string, body: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(`Sending email to ${to} with subject: ${subject}`);
    console.log(`Body: ${body}`);
  }
}

// ✅ Orchestrator: Coordinates the process but doesn't implement business logic
type OrderProcessingResult =
  | {
      success: true;
      orderId: string;
      totalAmount: number;
      transactionId: string;
    }
  | { success: false; message: string };

class OrderProcessingService {
  private validator = new OrderValidator();
  private priceCalculator = new PriceCalculator();
  private paymentProcessorFactory = new PaymentProcessorFactory();
  private inventoryManager = new InventoryManager();
  private emailService = new EmailNotificationService();
  private orderRepository = new OrderRepository();

  async processOrder(order: ComplexOrder): Promise<OrderProcessingResult> {
    // Step 1: Validate
    const validation = this.validator.validate(order);
    if (!validation.success && "errors" in validation) {
      return {
        success: false,
        message: validation.errors.join(", "),
      };
    } else if (!validation.success) {
        return { success: false, message: "Validation failed" };
    }

    // Step 2: Calculate price
    const totalPrice = this.priceCalculator.calculateTotal(order);
    console.log(`Total price calculated: $${totalPrice}`);

    // Step 3: Reserve inventory
    const inventoryResult = await this.inventoryManager.reserveItems(order);
    if (!inventoryResult.success && "message" in inventoryResult) {
      return {
        success: false,
        message: inventoryResult.message,
      };
    } else if (!inventoryResult.success) {
         return { success: false, message: "Inventory reservation failed" };
    }

    const reservations = inventoryResult.reservations;

    // Step 4: Process payment
    const paymentProcessor = this.paymentProcessorFactory.create(
      order.paymentMethod
    );
    const paymentResult = await paymentProcessor.process(
      order.customerId,
      totalPrice
    );

    if (!paymentResult.success) {
      await this.inventoryManager.releaseReservations(reservations);
      return {
        success: false,
        message: "Payment processing failed",
      };
    }

    // Step 5: Save order
    await this.orderRepository.save(
      order,
      totalPrice,
      paymentResult.transactionId
    );

    // Step 6: Send confirmation email
    await this.emailService.sendOrderConfirmation(order, totalPrice);

    console.log(`✅ Order ${order.id} processed successfully`);
    return {
      success: true,
      orderId: order.id,
      totalAmount: totalPrice,
      transactionId: paymentResult.transactionId!,
    };
  }
}

export function OrderProcessingSystemGood() {
  const orderService = new OrderProcessingService();

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
    const result = await orderService.processOrder(order);
    if (result.success) {
      console.log(
        `Order processed: ${result.orderId}, Total: $${result.totalAmount}`
      );
    } else {
      const msg = "message" in result ? result.message : "Unknown error";
      console.log(`Order processing failed: ${msg}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Good: Following SRP</h2>
      <p className="mb-4 text-gray-600">
        Each class has a single responsibility: validation, pricing, payment,
        inventory, emails, and database operations are separated into focused
        classes.
      </p>
      <button
        onClick={handleProcessOrder}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Process Order (Check Console)
      </button>
    </div>
  );
}

