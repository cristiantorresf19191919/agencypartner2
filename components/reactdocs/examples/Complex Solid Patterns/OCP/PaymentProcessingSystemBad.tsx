// ❌ BAD EXAMPLE: Open/Closed Principle Violation
// Adding new payment methods requires modifying the PaymentProcessor class
// The class is not closed for modification when new payment types are needed

interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  paymentMethod: string;
  paymentDetails: Record<string, string>;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string | null;
  message: string;
  fees: number;
}

class ComplexPaymentProcessor {
  // ❌ Every new payment method requires modifying this method
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const fees = this.calculateFees(request.paymentMethod, request.amount);
    const totalAmount = request.amount + fees;

    switch (request.paymentMethod) {
      case "credit_card": {
        // ❌ Hard-coded logic for credit card
        const cardNumber = request.paymentDetails["cardNumber"] || "";
        const expiryDate = request.paymentDetails["expiryDate"] || "";
        const cvv = request.paymentDetails["cvv"] || "";

        if (cardNumber.length !== 16 || cvv.length !== 3) {
          return {
            success: false,
            transactionId: null,
            message: "Invalid credit card details",
            fees,
          };
        }

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

      case "paypal": {
        // ❌ Hard-coded logic for PayPal
        const paypalEmail = request.paymentDetails["email"] || "";

        if (!paypalEmail.includes("@")) {
          return {
            success: false,
            transactionId: null,
            message: "Invalid PayPal email",
            fees,
          };
        }

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

      case "bank_transfer": {
        // ❌ Hard-coded logic for bank transfer
        const accountNumber = request.paymentDetails["accountNumber"] || "";
        const routingNumber = request.paymentDetails["routingNumber"] || "";

        if (accountNumber.length < 8 || routingNumber.length !== 9) {
          return {
            success: false,
            transactionId: null,
            message: "Invalid bank account details",
            fees,
          };
        }

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

      case "cryptocurrency": {
        // ❌ Adding cryptocurrency requires modifying this class
        const walletAddress = request.paymentDetails["walletAddress"] || "";
        const cryptoType = request.paymentDetails["cryptoType"] || "BTC";

        if (walletAddress.length < 26) {
          return {
            success: false,
            transactionId: null,
            message: "Invalid wallet address",
            fees,
          };
        }

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

      default:
        return {
          success: false,
          transactionId: null,
          message: `Unsupported payment method: ${request.paymentMethod}`,
          fees: 0.0,
        };
    }
  }

  // ❌ Fee calculation logic also needs modification for each new payment type
  private calculateFees(paymentMethod: string, amount: number): number {
    switch (paymentMethod) {
      case "credit_card":
        return amount * 0.029 + 0.3; // 2.9% + $0.30
      case "paypal":
        return amount * 0.034 + 0.3; // 3.4% + $0.30
      case "bank_transfer":
        return 5.0; // Flat $5 fee
      case "cryptocurrency":
        return amount * 0.01; // 1% fee
      default:
        return 0.0;
    }
  }

  // ❌ Refund logic also requires modification
  async processRefund(
    transactionId: string,
    amount: number,
    paymentMethod: string
  ): Promise<boolean> {
    switch (paymentMethod) {
      case "credit_card":
        console.log(
          `Refunding credit card transaction: ${transactionId}, Amount: $${amount}`
        );
        return true;
      case "paypal":
        console.log(
          `Refunding PayPal transaction: ${transactionId}, Amount: $${amount}`
        );
        return true;
      case "bank_transfer":
        console.log(
          `Refunding bank transfer: ${transactionId}, Amount: $${amount}`
        );
        return true;
      case "cryptocurrency":
        console.log(
          `Refunding cryptocurrency: ${transactionId}, Amount: $${amount}`
        );
        return true;
      default:
        return false;
    }
  }
}

export function PaymentProcessingSystemBad() {
  const processor = new ComplexPaymentProcessor();

  const handleCreditCardPayment = async () => {
    const request: PaymentRequest = {
      amount: 100.0,
      currency: "USD",
      customerId: "CUST-123",
      paymentMethod: "credit_card",
      paymentDetails: {
        cardNumber: "1234567890123456",
        expiryDate: "12/25",
        cvv: "123",
      },
    };

    const response = await processor.processPayment(request);
    console.log(
      `Credit Card Payment: ${response.message}, Transaction: ${response.transactionId}`
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bad: Violating OCP</h2>
      <p className="mb-4 text-gray-600">
        Adding new payment methods (like Apple Pay) requires modifying the
        ComplexPaymentProcessor class. This violates the Open/Closed Principle.
      </p>
      <button
        onClick={handleCreditCardPayment}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Process Credit Card Payment (Check Console)
      </button>
    </div>
  );
}

