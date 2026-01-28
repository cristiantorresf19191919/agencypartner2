// ✅ GOOD EXAMPLE: Open/Closed Principle Applied
// New payment methods can be added by creating new classes implementing the PaymentMethod interface
// The PaymentProcessor class remains closed for modification but open for extension

interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  paymentDetails: Record<string, string>;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string | null;
  message: string;
  fees: number;
}

// ✅ Abstraction - closed for modification
interface PaymentMethod {
  process(request: PaymentRequest): Promise<PaymentResponse>;
  calculateFees(amount: number): number;
  processRefund(transactionId: string, amount: number): Promise<boolean>;
  validateDetails(details: Record<string, string>): boolean;
}

// ✅ Extension 1: Credit Card Payment - open for extension
class CreditCardPaymentMethod implements PaymentMethod {
  async process(request: PaymentRequest): Promise<PaymentResponse> {
    const fees = this.calculateFees(request.amount);
    const totalAmount = request.amount + fees;

    if (!this.validateDetails(request.paymentDetails)) {
      return {
        success: false,
        transactionId: null,
        message: "Invalid credit card details",
        fees,
      };
    }

    const cardNumber = request.paymentDetails["cardNumber"] || "";
    const transactionId = `CC-${Date.now()}`;
    console.log(
      `Processing credit card payment: ${cardNumber}, Amount: $${totalAmount}`
    );

    return {
      success: true,
      transactionId,
      message: "Credit card payment processed",
      fees,
    };
  }

  calculateFees(amount: number): number {
    return amount * 0.029 + 0.3; // 2.9% + $0.30
  }

  async processRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(
      `Refunding credit card transaction: ${transactionId}, Amount: $${amount}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  validateDetails(details: Record<string, string>): boolean {
    const cardNumber = details["cardNumber"] || "";
    const cvv = details["cvv"] || "";
    return cardNumber.length === 16 && cvv.length === 3;
  }
}

// ✅ Extension 2: PayPal Payment - open for extension
class PayPalPaymentMethod implements PaymentMethod {
  async process(request: PaymentRequest): Promise<PaymentResponse> {
    const fees = this.calculateFees(request.amount);
    const totalAmount = request.amount + fees;

    if (!this.validateDetails(request.paymentDetails)) {
      return {
        success: false,
        transactionId: null,
        message: "Invalid PayPal email",
        fees,
      };
    }

    const paypalEmail = request.paymentDetails["email"] || "";
    const transactionId = `PP-${Date.now()}`;
    console.log(
      `Processing PayPal payment: ${paypalEmail}, Amount: $${totalAmount}`
    );

    return {
      success: true,
      transactionId,
      message: "PayPal payment processed",
      fees,
    };
  }

  calculateFees(amount: number): number {
    return amount * 0.034 + 0.3; // 3.4% + $0.30
  }

  async processRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(
      `Refunding PayPal transaction: ${transactionId}, Amount: $${amount}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  validateDetails(details: Record<string, string>): boolean {
    const email = details["email"] || "";
    return email.includes("@") && email.includes(".");
  }
}

// ✅ Extension 3: Bank Transfer Payment - open for extension
class BankTransferPaymentMethod implements PaymentMethod {
  async process(request: PaymentRequest): Promise<PaymentResponse> {
    const fees = this.calculateFees(request.amount);
    const totalAmount = request.amount + fees;

    if (!this.validateDetails(request.paymentDetails)) {
      return {
        success: false,
        transactionId: null,
        message: "Invalid bank account details",
        fees,
      };
    }

    const accountNumber = request.paymentDetails["accountNumber"] || "";
    const transactionId = `BT-${Date.now()}`;
    console.log(
      `Processing bank transfer: ${accountNumber}, Amount: $${totalAmount}`
    );

    return {
      success: true,
      transactionId,
      message: "Bank transfer processed",
      fees,
    };
  }

  calculateFees(amount: number): number {
    return 5.0; // Flat $5 fee
  }

  async processRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(
      `Refunding bank transfer: ${transactionId}, Amount: $${amount}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  validateDetails(details: Record<string, string>): boolean {
    const accountNumber = details["accountNumber"] || "";
    const routingNumber = details["routingNumber"] || "";
    return accountNumber.length >= 8 && routingNumber.length === 9;
  }
}

// ✅ Extension 4: Cryptocurrency Payment - open for extension
class CryptocurrencyPaymentMethod implements PaymentMethod {
  async process(request: PaymentRequest): Promise<PaymentResponse> {
    const fees = this.calculateFees(request.amount);
    const totalAmount = request.amount + fees;

    if (!this.validateDetails(request.paymentDetails)) {
      return {
        success: false,
        transactionId: null,
        message: "Invalid wallet address",
        fees,
      };
    }

    const walletAddress = request.paymentDetails["walletAddress"] || "";
    const cryptoType = request.paymentDetails["cryptoType"] || "BTC";
    const transactionId = `CRYPTO-${Date.now()}`;
    console.log(
      `Processing cryptocurrency payment: ${cryptoType}, Address: ${walletAddress}, Amount: $${totalAmount}`
    );

    return {
      success: true,
      transactionId,
      message: "Cryptocurrency payment processed",
      fees,
    };
  }

  calculateFees(amount: number): number {
    return amount * 0.01; // 1% fee
  }

  async processRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(
      `Refunding cryptocurrency: ${transactionId}, Amount: $${amount}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  validateDetails(details: Record<string, string>): boolean {
    const walletAddress = details["walletAddress"] || "";
    return walletAddress.length >= 26;
  }
}

// ✅ Extension 5: Apple Pay Payment - open for extension (NEW, no modification needed!)
class ApplePayPaymentMethod implements PaymentMethod {
  async process(request: PaymentRequest): Promise<PaymentResponse> {
    const fees = this.calculateFees(request.amount);
    const totalAmount = request.amount + fees;

    if (!this.validateDetails(request.paymentDetails)) {
      return {
        success: false,
        transactionId: null,
        message: "Invalid Apple Pay token",
        fees,
      };
    }

    const token = request.paymentDetails["token"] || "";
    const transactionId = `AP-${Date.now()}`;
    console.log(
      `Processing Apple Pay payment: Token: ${token}, Amount: $${totalAmount}`
    );

    return {
      success: true,
      transactionId,
      message: "Apple Pay payment processed",
      fees,
    };
  }

  calculateFees(amount: number): number {
    return amount * 0.025 + 0.25; // 2.5% + $0.25
  }

  async processRefund(transactionId: string, amount: number): Promise<boolean> {
    console.log(
      `Refunding Apple Pay transaction: ${transactionId}, Amount: $${amount}`
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }

  validateDetails(details: Record<string, string>): boolean {
    const token = details["token"] || "";
    return token.trim().length > 0 && token.length >= 32;
  }
}

// ✅ Payment Processor Factory - closed for modification
class PaymentProcessorFactory {
  createPaymentMethod(methodType: string): PaymentMethod {
    switch (methodType) {
      case "credit_card":
        return new CreditCardPaymentMethod();
      case "paypal":
        return new PayPalPaymentMethod();
      case "bank_transfer":
        return new BankTransferPaymentMethod();
      case "cryptocurrency":
        return new CryptocurrencyPaymentMethod();
      case "apple_pay":
        return new ApplePayPaymentMethod();
      default:
        throw new Error(`Unsupported payment method: ${methodType}`);
    }
  }
}

class PaymentProcessingService {
  private factory = new PaymentProcessorFactory();

  // ✅ This method never needs to change when adding new payment methods
  async processPayment(
    request: PaymentRequest,
    paymentMethodType: string
  ): Promise<PaymentResponse> {
    const paymentMethod = this.factory.createPaymentMethod(paymentMethodType);
    return paymentMethod.process(request);
  }

  async processRefund(
    transactionId: string,
    amount: number,
    paymentMethodType: string
  ): Promise<boolean> {
    const paymentMethod = this.factory.createPaymentMethod(paymentMethodType);
    return paymentMethod.processRefund(transactionId, amount);
  }
}

export function PaymentProcessingSystemGood() {
  const paymentService = new PaymentProcessingService();

  const handleCreditCardPayment = async () => {
    const request: PaymentRequest = {
      amount: 100.0,
      currency: "USD",
      customerId: "CUST-123",
      paymentDetails: {
        cardNumber: "1234567890123456",
        expiryDate: "12/25",
        cvv: "123",
      },
    };

    const response = await paymentService.processPayment(request, "credit_card");
    console.log(
      `Credit Card Payment: ${response.message}, Transaction: ${response.transactionId}`
    );
  };

  const handleApplePayPayment = async () => {
    const request: PaymentRequest = {
      amount: 75.0,
      currency: "USD",
      customerId: "CUST-123",
      paymentDetails: {
        token: "applepay_token_12345678901234567890123456789012",
      },
    };

    const response = await paymentService.processPayment(request, "apple_pay");
    console.log(
      `Apple Pay Payment: ${response.message}, Transaction: ${response.transactionId}`
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Good: Following OCP</h2>
      <p className="mb-4 text-gray-600">
        New payment methods (like Apple Pay) can be added by creating a new
        class implementing PaymentMethod. The PaymentProcessingService class
        never needs to change.
      </p>
      <div className="space-x-2">
        <button
          onClick={handleCreditCardPayment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Process Credit Card (Check Console)
        </button>
        <button
          onClick={handleApplePayPayment}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Process Apple Pay (Check Console)
        </button>
      </div>
    </div>
  );
}

