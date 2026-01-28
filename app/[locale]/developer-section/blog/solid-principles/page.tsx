"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function SOLIDPrinciplesPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            <li>
              <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                {t("blog-breadcrumb-home")}
              </ButtonLink>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li>
              <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                {t("developer-section-title")}
              </ButtonLink>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li>
              <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                {t("nav-blog")}
              </ButtonLink>
            </li>
            <li className={styles.breadcrumbSeparator}>/</li>
            <li className={styles.breadcrumbCurrent}>{t("solid-title")}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className={styles.headerSection}>
          <Heading className={styles.title}>
            {t("solid-title")}
          </Heading>
          <Text className={styles.subtitle}>
            {t("solid-subtitle")}
          </Text>
          <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
            <Text className={styles.infoText}>
              {t("solid-origin-note")}
            </Text>
          </div>
        </div>

        {/* Single Responsibility Principle */}
        <section id="srp" className={styles.section}>
          <div className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("solid-srp-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("solid-srp-desc")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                showKotlin={true}
                kotlinExample={`// ❌ BAD: Single Responsibility Principle Violation
// This class has multiple responsibilities:
// 1. Order validation
// 2. Price calculation
// 3. Payment processing
// 4. Email notifications

class OrderProcessor {
    fun validateOrder(order: Order): Boolean {
        // Validation logic
        return order.items.isNotEmpty()
    }
    
    fun calculateTotal(order: Order): Double {
        // Price calculation logic
        var total = order.items.sumOf { it.price }
        total += total * 0.08 // Tax
        return total
    }
    
    fun processPayment(order: Order, amount: Double): Boolean {
        // Payment processing logic
        println("Processing payment: \$$amount")
        return true
    }
    
    fun sendConfirmationEmail(order: Order) {
        // Email logic
        println("Sending email for order: \${order.id}")
    }
}

// ✅ GOOD: Single Responsibility Applied
// Each class has ONE responsibility

class OrderValidator {
    fun validate(order: Order): Boolean {
        return order.items.isNotEmpty()
    }
}

class PriceCalculator {
    fun calculateTotal(order: Order): Double {
        var total = order.items.sumOf { it.price }
        total += total * 0.08
        return total
    }
}

class PaymentProcessor {
    fun processPayment(order: Order, amount: Double): Boolean {
        println("Processing payment: \$$amount")
        return true
    }
}

class EmailService {
    fun sendConfirmation(order: Order) {
        println("Sending email for order: \${order.id}")
    }
}

// Orchestrator coordinates but doesn't implement logic
class OrderService {
    private val validator = OrderValidator()
    private val calculator = PriceCalculator()
    private val paymentProcessor = PaymentProcessor()
    private val emailService = EmailService()
    
    fun processOrder(order: Order) {
        if (!validator.validate(order)) return
        val total = calculator.calculateTotal(order)
        if (paymentProcessor.processPayment(order, total)) {
            emailService.sendConfirmation(order)
        }
    }
}

// Benefits:
// ✅ Each class has one reason to change
// ✅ Easy to test in isolation
// ✅ Easy to maintain and modify
// ✅ Clear responsibilities`}
                wrong={`// ❌ WRONG: Multiple responsibilities in one component
export function OrderProcessor() {
  // Responsibility 1: Validation
  const validateOrder = (order: Order) => {
    return order.items.length > 0;
  };

  // Responsibility 2: Price calculation
  const calculateTotal = (order: Order) => {
    let total = order.items.reduce((sum, item) => sum + item.price, 0);
    total += total * 0.08; // Tax
    return total;
  };

  // Responsibility 3: Payment processing
  const processPayment = async (order: Order, amount: number) => {
    console.log("Processing payment:", amount);
    // Payment logic
  };

  // Responsibility 4: Email notifications
  const sendEmail = async (order: Order) => {
    console.log("Sending email for order:", order.id);
    // Email logic
  };

  // All mixed together!
  const handleOrder = async (order: Order) => {
    if (!validateOrder(order)) return;
    const total = calculateTotal(order);
    if (await processPayment(order, total)) {
      await sendEmail(order);
    }
  };

  // Problems:
  // - Multiple reasons to change
  // - Hard to test
  // - Violates SRP
  // - Difficult to maintain

  return <div>...</div>;
}`}
                good={`// ✅ GOOD: Single Responsibility Applied
// Each function/service has ONE responsibility

// Responsibility 1: Validation only
class OrderValidator {
  validate(order: Order): boolean {
    return order.items.length > 0;
  }
}

// Responsibility 2: Price calculation only
class PriceCalculator {
  calculateTotal(order: Order): number {
    let total = order.items.reduce((sum, item) => sum + item.price, 0);
    total += total * 0.08; // Tax
    return total;
  }
}

// Responsibility 3: Payment processing only
class PaymentProcessor {
  async processPayment(order: Order, amount: number): Promise<boolean> {
    console.log("Processing payment:", amount);
    // Payment logic
    return true;
  }
}

// Responsibility 4: Email notifications only
class EmailService {
  async sendConfirmation(order: Order): Promise<void> {
    console.log("Sending email for order:", order.id);
    // Email logic
  }
}

// Orchestrator coordinates but doesn't implement logic
class OrderService {
  private validator = new OrderValidator();
  private calculator = new PriceCalculator();
  private paymentProcessor = new PaymentProcessor();
  private emailService = new EmailService();

  async processOrder(order: Order): Promise<void> {
    if (!this.validator.validate(order)) return;
    const total = this.calculator.calculateTotal(order);
    if (await this.paymentProcessor.processPayment(order, total)) {
      await this.emailService.sendConfirmation(order);
    }
  }
}

// Component only handles UI
export function OrderForm() {
  const orderService = new OrderService();

  const handleSubmit = async (order: Order) => {
    await orderService.processOrder(order);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form UI */}
    </form>
  );
}

// Benefits:
// ✅ Each class/function has one reason to change
// ✅ Easy to test in isolation
// ✅ Easy to maintain and modify
// ✅ Clear separation of concerns
// ✅ Reusable components`}
              />
            </Stack>
          </div>
        </section>

        {/* Open/Closed Principle */}
        <section id="ocp" className={styles.section}>
          <div className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  Open/Closed Principle (OCP)
                </Heading>
                <Text className={styles.sectionDescription}>
                  Software entities should be open for extension but closed for modification. You should be able to add
                  new functionality without changing existing code.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                showKotlin={true}
                kotlinExample={`// ❌ BAD: Open/Closed Principle Violation
// Must modify existing code to add new shapes

class AreaCalculator {
    fun calculateArea(shape: Any): Double {
        return when (shape) {
            is Circle -> Math.PI * shape.radius * shape.radius
            is Rectangle -> shape.width * shape.height
            // ❌ Must modify this class to add Triangle!
            else -> throw IllegalArgumentException("Unknown shape")
        }
    }
}

// ✅ GOOD: Open/Closed Principle Applied
// Open for extension, closed for modification

interface Shape {
    fun area(): Double
}

class Circle(val radius: Double) : Shape {
    override fun area() = Math.PI * radius * radius
}

class Rectangle(val width: Double, val height: Double) : Shape {
    override fun area() = width * height
}

// ✅ Can add new shapes without modifying existing code
class Triangle(val base: Double, val height: Double) : Shape {
    override fun area() = 0.5 * base * height
}

class AreaCalculator {
    fun calculateTotalArea(shapes: List<Shape>): Double {
        return shapes.sumOf { it.area() }
    }
}

// Benefits:
// ✅ Add new shapes without modifying calculator
// ✅ Follows Open/Closed Principle
// ✅ Easy to extend`}
                wrong={`// ❌ WRONG: Must modify existing code to add new button types
const Button = ({ type, ...props }: { type: string; [key: string]: any }) => {
  // Must modify this component to add new button types
  if (type === "primary") {
    return <button className="bg-blue-500" {...props} />;
  } else if (type === "secondary") {
    return <button className="bg-gray-500" {...props} />;
  } else if (type === "danger") {
    return <button className="bg-red-500" {...props} />;
  }
  // ❌ Must add new if-else for each new type!

  return <button {...props} />;
};

// Problems:
// - Must modify component for new types
// - Violates Open/Closed Principle
// - Hard to extend`}
                good={`// ✅ GOOD: Open/Closed Principle Applied
// Open for extension, closed for modification

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

interface ButtonVariant {
  getClassName: () => string;
}

// Base button component (closed for modification)
const Button = ({ variant, ...props }: ButtonProps & { variant: ButtonVariant }) => {
  return (
    <button className={variant.getClassName()} {...props}>
      {props.children}
    </button>
  );
};

// Variants (open for extension)
const PrimaryButtonVariant: ButtonVariant = {
  getClassName: () => "bg-blue-500 hover:bg-blue-600 text-white",
};

const SecondaryButtonVariant: ButtonVariant = {
  getClassName: () => "bg-gray-500 hover:bg-gray-600 text-white",
};

const DangerButtonVariant: ButtonVariant = {
  getClassName: () => "bg-red-500 hover:bg-red-600 text-white",
};

// ✅ Can add new variants without modifying Button component
const SuccessButtonVariant: ButtonVariant = {
  getClassName: () => "bg-green-500 hover:bg-green-600 text-white",
};

// Usage
<Button variant={PrimaryButtonVariant}>Click me</Button>
<Button variant={SuccessButtonVariant}>Success</Button>

// Benefits:
// ✅ Add new variants without modifying Button
// ✅ Follows Open/Closed Principle
// ✅ Easy to extend
// ✅ Testable in isolation`}
              />
            </Stack>
          </div>
        </section>

        {/* Liskov Substitution Principle */}
        <section id="lsp" className={styles.section}>
          <div className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  Liskov Substitution Principle (LSP)
                </Heading>
                <Text className={styles.sectionDescription}>
                  Objects of a superclass should be replaceable with objects of its subclasses without breaking the
                  application. Subtypes must be substitutable for their base types.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                showKotlin={true}
                kotlinExample={`// ❌ BAD: Liskov Substitution Principle Violation
// Square cannot substitute Rectangle without breaking behavior

open class Rectangle {
    open var width: Double = 0.0
    open var height: Double = 0.0
    
    fun area(): Double = width * height
}

class Square : Rectangle() {
    override var width: Double = 0.0
        set(value) {
            field = value
            height = value // ❌ Breaks rectangle behavior!
        }
    
    override var height: Double = 0.0
        set(value) {
            field = value
            width = value // ❌ Breaks rectangle behavior!
        }
}

// This breaks!
fun testRectangle(rect: Rectangle) {
    rect.width = 5.0
    rect.height = 4.0
    println(rect.area()) // Expects 20, but Square gives 16!
}

// ✅ GOOD: Liskov Substitution Applied
// Both can substitute Shape without breaking behavior

interface Shape {
    fun area(): Double
}

class Rectangle(val width: Double, val height: Double) : Shape {
    override fun area() = width * height
}

class Square(val side: Double) : Shape {
    override fun area() = side * side
}

// Both are substitutable
fun calculateTotalArea(shapes: List<Shape>): Double {
    return shapes.sumOf { it.area() }
}

// Benefits:
// ✅ Subtypes are truly substitutable
// ✅ No unexpected behavior
// ✅ Follows Liskov Substitution Principle`}
                wrong={`// ❌ WRONG: Components not substitutable
const Input = ({ type, ...props }: { type: string; [key: string]: any }) => {
  if (type === "text") {
    return <input type="text" {...props} />;
  } else if (type === "number") {
    // ❌ Number input might not accept all text input props
    return <input type="number" {...props} />;
  }
  // Not substitutable - breaks when swapped
};

// Problems:
// - Not truly substitutable
// - Breaks when used interchangeably
// - Violates LSP`}
                good={`// ✅ GOOD: Liskov Substitution Applied
// All input types are substitutable

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Base input component
const BaseInput = ({ value, onChange, placeholder, disabled, type }: InputProps & { type: string }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

// All are substitutable - same interface
const TextInput = (props: InputProps) => (
  <BaseInput {...props} type="text" />
);

const NumberInput = (props: InputProps) => (
  <BaseInput {...props} type="number" />
);

const EmailInput = (props: InputProps) => (
  <BaseInput {...props} type="email" />
);

// Can use any input type interchangeably
function FormField({ InputComponent, ...props }: { InputComponent: React.ComponentType<InputProps> } & InputProps) {
  return <InputComponent {...props} />;
}

// All work the same way!
<FormField InputComponent={TextInput} value={text} onChange={setText} />
<FormField InputComponent={NumberInput} value={number} onChange={setNumber} />
<FormField InputComponent={EmailInput} value={email} onChange={setEmail} />

// Benefits:
// ✅ All input types are substitutable
// ✅ Same interface guarantees compatibility
// ✅ Follows Liskov Substitution Principle
// ✅ No unexpected behavior`}
              />
            </Stack>
          </div>
        </section>

        {/* Dependency Inversion Principle */}
        <section id="dip" className={styles.section}>
          <div className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("solid-dip-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("solid-dip-desc")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                showKotlin={true}
                kotlinExample={`// ✅ GOOD: Dependency Inversion Principle Applied
// High-level modules depend on abstractions, not concrete implementations

// Step 1: Define Abstractions (Interfaces)
data class User(
    val name: String,
    val email: String,
    val dateOfBirth: java.util.Date
)

interface ExportUser {
    fun export(user: User)
}

// Step 2: Implement Concrete Classes
class ExportUserToCSV : ExportUser {
    override fun export(user: User) {
        // Logic to export user to a CSV file
        println("Exported \${user.name} to CSV")
    }
}

class ExportUserToPDF : ExportUser {
    override fun export(user: User) {
        // Logic to export user to a PDF file
        println("Exported \${user.name} to PDF")
    }
}

// Step 3: Use Dependency Injection
// High-level module depends on abstraction, not concrete implementation
class ExportUserUseCase(
    private val exportUser: ExportUser  // Depends on abstraction
) {
    fun execute(user: User) {
        // Export the user data using the injected dependency
        exportUser.export(user)
    }
}

// Usage examples:

// With CSV
val exportUsertoCSV = ExportUserToCSV()
val exportUserUseCaseCSV = ExportUserUseCase(exportUsertoCSV)

exportUserUseCaseCSV.execute(
    User(
        name = "Bobson Paebi",
        email = "paebi@bubstack.tech",
        dateOfBirth = java.util.Date()
    )
)

// With PDF
val exportUsertoPDF = ExportUserToPDF()
val exportUserUseCasePDF = ExportUserUseCase(exportUsertoPDF)

exportUserUseCasePDF.execute(
    User(
        name = "Bobson Paebi",
        email = "paebi@bubstack.tech",
        dateOfBirth = java.util.Date()
    )
)

// Benefits:
// ✅ High-level modules don't depend on low-level modules
// ✅ Both depend on abstractions
// ✅ Easy to test (can inject mocks)
// ✅ Easy to extend (add new export formats)
// ✅ Follows Dependency Inversion Principle`}
                wrong={`// ❌ WRONG: High-level module depends on low-level modules
// Direct dependency on concrete implementations

type User = {
  name: string;
  email: string;
  dateOfBirth: Date;
};

// Low-level module: CSV export
class ExportUserToCSV {
  export(user: User) {
    console.log(\`Exported \${user.name} to CSV\`);
  }
}

// Low-level module: PDF export
class ExportUserToPDF {
  export(user: User) {
    console.log(\`Exported \${user.name} to PDF\`);
  }
}

// ❌ High-level module directly depends on concrete implementations
class ExportUserUseCase {
  private csvExporter = new ExportUserToCSV(); // Direct dependency!
  private pdfExporter = new ExportUserToPDF(); // Direct dependency!

  executeCSV(user: User) {
    this.csvExporter.export(user);
  }

  executePDF(user: User) {
    this.pdfExporter.export(user);
  }
}

// Problems:
// - High-level depends on low-level modules
// - Hard to test (can't inject mocks)
// - Hard to extend (must modify UseCase for new formats)
// - Violates Dependency Inversion Principle
// - Tight coupling`}
                good={`// ✅ GOOD: Dependency Inversion Principle Applied
// High-level modules depend on abstractions, not concrete implementations

// Step 1: Define Abstractions (Interfaces)
type User = {
  name: string;
  email: string;
  dateOfBirth: Date;
};

interface ExportUser {
  export(user: User): void;
}

// Step 2: Implement Concrete Classes
class ExportUserToCSV implements ExportUser {
  export(user: User) {
    // Logic to export user to a CSV file
    console.log(\`Exported \${user.name} to CSV\`);
  }
}

class ExportUserToPDF implements ExportUser {
  export(user: User) {
    // Logic to export user to a PDF file
    console.log(\`Exported \${user.name} to PDF\`);
  }
}

// Step 3: Use Dependency Injection
// High-level module depends on abstraction, not concrete implementation
class ExportUserUseCase {
  constructor(private exportUser: ExportUser) {} // Depends on abstraction

  execute(user: User) {
    // Export the user data using the injected dependency
    this.exportUser.export(user);
  }
}

// Usage examples:

// With CSV
const exportUsertoCSV = new ExportUserToCSV();
const exportUserUseCaseCSV = new ExportUserUseCase(exportUsertoCSV);

exportUserUseCaseCSV.execute({
  name: 'Bobson Paebi',
  email: 'paebi@bubstack.tech',
  dateOfBirth: new Date(),
});

// With PDF
const exportUsertoPDF = new ExportUserToPDF();
const exportUserUseCasePDF = new ExportUserUseCase(exportUsertoPDF);

exportUserUseCasePDF.execute({
  name: 'Bobson Paebi',
  email: 'paebi@bubstack.tech',
  dateOfBirth: new Date(),
});

// React Component Example:
export function UserExportForm() {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  // Create the appropriate exporter based on selection
  const exporter: ExportUser = exportFormat === 'csv' 
    ? new ExportUserToCSV() 
    : new ExportUserToPDF();

  const exportUserUseCase = new ExportUserUseCase(exporter);

  const handleExport = (user: User) => {
    exportUserUseCase.execute(user);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleExport({ name: 'John', email: 'john@example.com', dateOfBirth: new Date() });
    }}>
      <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}>
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
      </select>
      <button type="submit">Export User</button>
    </form>
  );
}

// Benefits:
// ✅ High-level modules don't depend on low-level modules
// ✅ Both depend on abstractions
// ✅ Easy to test (can inject mocks)
// ✅ Easy to extend (add new export formats without modifying UseCase)
// ✅ Follows Dependency Inversion Principle
// ✅ Loose coupling`}
              />
            </Stack>
          </div>
        </section>

        {/* Navigation */}
        <div className={styles.navigation}>
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/design-patterns")}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="flex flex-col items-start">
                <span className="text-xs opacity-70 font-normal">{t("blog-prev")}</span>
                <span className="font-semibold">{t("blog-design-patterns")}</span>
              </span>
            </span>
          </ButtonLink>
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
            <span className="flex items-center gap-2">
              <span className="flex flex-col items-end">
                <span className="text-xs opacity-70 font-normal">{t("nav-blog")}</span>
                <span className="font-semibold">{t("blog-back-blog")}</span>
              </span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </ButtonLink>
        </div>
    </BlogContentLayout>
  );
}

