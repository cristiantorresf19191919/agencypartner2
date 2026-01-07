"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function DesignPatternsPage() {
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
            <li className={styles.breadcrumbCurrent}>{t("design-patterns-title")}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className={styles.headerSection}>
          <Heading className={styles.title}>
            {t("design-patterns-title")}
          </Heading>
          <Text className={styles.subtitle}>
            {t("design-patterns-subtitle")}
          </Text>
          <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
            <Text className={styles.infoText}>
              {t("design-patterns-origin-note")}
            </Text>
          </div>
        </div>

        {/* Strategy Pattern */}
        <section id="strategy" className={styles.section}>
          <div className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  {t("design-patterns-strategy-title")}
                </Heading>
                <Text className={styles.sectionDescription}>
                  {t("design-patterns-strategy-desc")}
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                showKotlin={true}
                kotlinExample={`// ✅ Strategy Pattern in Kotlin (OOP Origin)
// Defines a family of algorithms and makes them interchangeable

interface PaymentStrategy {
    fun pay(amount: Double)
}

// Concrete strategies
class CreditCardPayment(
    private val cardNumber: String,
    private val name: String
) : PaymentStrategy {
    override fun pay(amount: Double) {
        println("Processing credit card payment: \$$amount")
        println("Card: $cardNumber, Name: $name")
    }
}

class PayPalPayment(
    private val email: String
) : PaymentStrategy {
    override fun pay(amount: Double) {
        println("Processing PayPal payment: \$$amount")
        println("Email: $email")
    }
}

class BitcoinPayment(
    private val walletAddress: String
) : PaymentStrategy {
    override fun pay(amount: Double) {
        println("Processing Bitcoin payment: \$$amount")
        println("Wallet: $walletAddress")
    }
}

// Context class
class PaymentProcessor {
    private var strategy: PaymentStrategy? = null
    
    fun setPaymentStrategy(strategy: PaymentStrategy) {
        this.strategy = strategy
    }
    
    fun processPayment(amount: Double) {
        strategy?.pay(amount) 
            ?: throw IllegalStateException("Payment strategy not set")
    }
}

// Usage
fun main() {
    val processor = PaymentProcessor()
    
    processor.setPaymentStrategy(
        CreditCardPayment("1234-5678", "John Doe")
    )
    processor.processPayment(100.0)
    
    // Easy to switch strategies
    processor.setPaymentStrategy(
        PayPalPayment("user@example.com")
    )
    processor.processPayment(50.0)
}

// Benefits:
// ✅ Algorithms encapsulated in separate classes
// ✅ Easy to add new payment methods
// ✅ No need to modify existing code
// ✅ Follows Open/Closed Principle`}
                wrong={`// ❌ WRONG: All logic in one place, hard to extend
const PaymentForm = () => {
  const [paymentType, setPaymentType] = useState("credit");
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    
    // All payment logic mixed together
    if (paymentType === "credit") {
      console.log("Processing credit card payment:", paymentAmount);
      // Credit card logic here
    } else if (paymentType === "paypal") {
      console.log("Processing PayPal payment:", paymentAmount);
      // PayPal logic here
    } else if (paymentType === "bitcoin") {
      console.log("Processing Bitcoin payment:", paymentAmount);
      // Bitcoin logic here
    }
    
    // Problems:
    // - Hard to add new payment methods
    // - Violates Open/Closed Principle
    // - All logic in one place
    // - Hard to test individual strategies
  };

  return (
    <div>
      <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
        <option value="credit">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bitcoin">Bitcoin</option>
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};`}
                good={`// ✅ GOOD: Strategy Pattern in React
// Encapsulate algorithms in separate functions/objects

interface PaymentStrategy {
  pay: (amount: number) => void;
}

// Concrete strategies
const creditCardStrategy: PaymentStrategy = {
  pay: (amount: number) => {
    console.log("Processing credit card payment:", amount);
    // Credit card processing logic
  },
};

const paypalStrategy: PaymentStrategy = {
  pay: (amount: number) => {
    console.log("Processing PayPal payment:", amount);
    // PayPal processing logic
  },
};

const bitcoinStrategy: PaymentStrategy = {
  pay: (amount: number) => {
    console.log("Processing Bitcoin payment:", amount);
    // Bitcoin processing logic
  },
};

// Strategy map (similar to context in OOP)
const paymentStrategies: Record<string, PaymentStrategy> = {
  credit: creditCardStrategy,
  paypal: paypalStrategy,
  bitcoin: bitcoinStrategy,
};

// Component using strategy pattern
const PaymentForm = () => {
  const [paymentType, setPaymentType] = useState("credit");
  const [amount, setAmount] = useState("");

  const handlePayment = () => {
    const paymentAmount = parseFloat(amount);
    const strategy = paymentStrategies[paymentType];
    
    if (strategy) {
      strategy.pay(paymentAmount);
    } else {
      console.error("Unknown payment type");
    }
  };

  return (
    <div>
      <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
        <option value="credit">Credit Card</option>
        <option value="paypal">PayPal</option>
        <option value="bitcoin">Bitcoin</option>
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

// Benefits:
// ✅ Easy to add new payment methods
// ✅ Each strategy is independent
// ✅ Follows Open/Closed Principle
// ✅ Strategies are testable in isolation
// ✅ Clean separation of concerns`}
              />
            </Stack>
          </div>
        </section>

        {/* Observer Pattern */}
        <section id="observer" className={styles.section}>
          <div className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  Observer Pattern
                </Heading>
                <Text className={styles.sectionDescription}>
                  The Observer pattern defines a one-to-many dependency between objects. When one object changes state,
                  all its dependents are notified and updated automatically.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                showKotlin={true}
                kotlinExample={`// ✅ Observer Pattern in Kotlin (OOP Origin)
// One-to-many dependency: when subject changes, observers are notified

interface Observer {
    fun update(data: String)
}

interface Subject {
    fun attach(observer: Observer)
    fun detach(observer: Observer)
    fun notifyObservers()
}

class NewsAgency : Subject {
    private val observers = mutableListOf<Observer>()
    private var news: String = ""
    
    override fun attach(observer: Observer) {
        observers.add(observer)
    }
    
    override fun detach(observer: Observer) {
        observers.remove(observer)
    }
    
    override fun notifyObservers() {
        observers.forEach { it.update(news) }
    }
    
    fun setNews(news: String) {
        this.news = news
        notifyObservers()
    }
}

class NewsChannel(private val name: String) : Observer {
    override fun update(data: String) {
        println("$name received news: $data")
    }
}

// Usage
fun main() {
    val agency = NewsAgency()
    val channel1 = NewsChannel("CNN")
    val channel2 = NewsChannel("BBC")
    
    agency.attach(channel1)
    agency.attach(channel2)
    
    agency.setNews("Breaking: New React version released!")
    // Output:
    // CNN received news: Breaking: New React version released!
    // BBC received news: Breaking: New React version released!
}

// Benefits:
// ✅ Loose coupling between subject and observers
// ✅ Dynamic subscription/unsubscription
// ✅ Broadcasts changes to multiple observers`}
                wrong={`// ❌ WRONG: Tight coupling, manual updates
const NewsDisplay = () => {
  const [news, setNews] = useState("");
  const [channel1News, setChannel1News] = useState("");
  const [channel2News, setChannel2News] = useState("");

  const updateNews = (newNews: string) => {
    setNews(newNews);
    // Manual updates - tight coupling!
    setChannel1News(newNews);
    setChannel2News(newNews);
  };

  // Problems:
  // - Manual updates required
  // - Tight coupling
  // - Hard to add new observers
  // - Easy to forget to update one

  return (
    <div>
      <button onClick={() => updateNews("Breaking news!")}>
        Update News
      </button>
      <div>Channel 1: {channel1News}</div>
      <div>Channel 2: {channel2News}</div>
    </div>
  );
};`}
                good={`// ✅ GOOD: Observer Pattern in React
// Use React's built-in state management and hooks

// Custom hook implementing observer pattern
function useObserver<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const observers = useRef<Set<(value: T) => void>>(new Set());

  const subscribe = useCallback((callback: (value: T) => void) => {
    observers.current.add(callback);
    return () => observers.current.delete(callback);
  }, []);

  const update = useCallback((newValue: T) => {
    setValue(newValue);
    observers.current.forEach(callback => callback(newValue));
  }, []);

  return { value, update, subscribe };
}

// Usage
const NewsAgency = () => {
  const { value: news, update, subscribe } = useObserver("");

  return (
    <div>
      <button onClick={() => update("Breaking: New React version!")}>
        Update News
      </button>
      <NewsChannel name="CNN" subscribe={subscribe} />
      <NewsChannel name="BBC" subscribe={subscribe} />
    </div>
  );
};

const NewsChannel = ({ name, subscribe }: { name: string; subscribe: any }) => {
  const [channelNews, setChannelNews] = useState("");

  useEffect(() => {
    const unsubscribe = subscribe((news: string) => {
      setChannelNews(news);
    });
    return unsubscribe;
  }, [subscribe]);

  return <div>{name}: {channelNews}</div>;
};

// Or use Context API (React's built-in observer pattern)
const NewsContext = createContext<{
  news: string;
  setNews: (news: string) => void;
}>({ news: "", setNews: () => {} });

const NewsProvider = ({ children }) => {
  const [news, setNews] = useState("");
  return (
    <NewsContext.Provider value={{ news, setNews }}>
      {children}
    </NewsContext.Provider>
  );
};

// Benefits:
// ✅ Automatic updates via React's reactivity
// ✅ Loose coupling with Context
// ✅ Easy to add new observers
// ✅ Built into React's architecture`}
              />
            </Stack>
          </div>
        </section>

        {/* Factory Pattern */}
        <section id="factory" className={styles.section}>
          <div className={styles.sectionCard}>
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className={styles.sectionTitle}>
                  Factory Pattern
                </Heading>
                <Text className={styles.sectionDescription}>
                  The Factory pattern provides an interface for creating objects without specifying their exact classes.
                  It centralizes object creation logic.
                </Text>
              </div>

              <CodeComparison
                language="tsx"
                showKotlin={true}
                kotlinExample={`// ✅ Factory Pattern in Kotlin (OOP Origin)
// Centralizes object creation logic

interface Button {
    fun render(): String
}

class WindowsButton : Button {
    override fun render() = "Windows Button"
}

class MacButton : Button {
    override fun render() = "Mac Button"
}

class LinuxButton : Button {
    override fun render() = "Linux Button"
}

// Factory interface
interface ButtonFactory {
    fun createButton(): Button
}

class WindowsButtonFactory : ButtonFactory {
    override fun createButton() = WindowsButton()
}

class MacButtonFactory : ButtonFactory {
    override fun createButton() = MacButton()
}

class LinuxButtonFactory : ButtonFactory {
    override fun createButton() = LinuxButton()
}

// Factory creator
object ButtonFactoryCreator {
    fun createFactory(os: String): ButtonFactory {
        return when (os) {
            "Windows" -> WindowsButtonFactory()
            "Mac" -> MacButtonFactory()
            "Linux" -> LinuxButtonFactory()
            else -> throw IllegalArgumentException("Unknown OS")
        }
    }
}

// Usage
fun main() {
    val factory = ButtonFactoryCreator.createFactory("Mac")
    val button = factory.createButton()
    println(button.render()) // "Mac Button"
}

// Benefits:
// ✅ Centralized creation logic
// ✅ Easy to add new button types
// ✅ Hides creation complexity`}
                wrong={`// ❌ WRONG: Direct instantiation, scattered logic
const Button = ({ os }: { os: string }) => {
  // Creation logic scattered in component
  let button;
  
  if (os === "Windows") {
    button = { render: () => "Windows Button" };
  } else if (os === "Mac") {
    button = { render: () => "Mac Button" };
  } else if (os === "Linux") {
    button = { render: () => "Linux Button" };
  }
  
  // Problems:
  // - Creation logic in component
  // - Hard to test
  // - Violates Single Responsibility
  // - Scattered across codebase

  return <div>{button?.render()}</div>;
};`}
                good={`// ✅ GOOD: Factory Pattern in React
// Centralize creation logic in factory functions

interface Button {
  render: () => string;
}

// Concrete button implementations
const createWindowsButton = (): Button => ({
  render: () => "Windows Button",
  });

const createMacButton = (): Button => ({
  render: () => "Mac Button",
});

const createLinuxButton = (): Button => ({
  render: () => "Linux Button",
});

// Factory function
const createButton = (os: string): Button => {
  const factories: Record<string, () => Button> = {
    Windows: createWindowsButton,
    Mac: createMacButton,
    Linux: createLinuxButton,
  };

  const factory = factories[os];
  if (!factory) {
    throw new Error(\`Unknown OS: \${os}\`);
  }

  return factory();
};

// Component using factory
const Button = ({ os }: { os: string }) => {
  const button = useMemo(() => createButton(os), [os]);

  return <div>{button.render()}</div>;
};

// Or use React component factory
const ButtonFactory = {
  create: (os: string) => {
    switch (os) {
      case "Windows":
        return <WindowsButton />;
      case "Mac":
        return <MacButton />;
      case "Linux":
        return <LinuxButton />;
      default:
        return <DefaultButton />;
    }
  },
};

// Benefits:
// ✅ Centralized creation logic
// ✅ Easy to test factories
// ✅ Single Responsibility
// ✅ Easy to extend`}
              />
            </Stack>
          </div>
        </section>

        {/* Navigation */}
        <div className={styles.navigation}>
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/react-patterns")}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="flex flex-col items-start">
                <span className="text-xs opacity-70 font-normal">{t("blog-prev")}</span>
                <span className="font-semibold">{t("blog-react-patterns")}</span>
              </span>
            </span>
          </ButtonLink>
          <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/solid-principles")}>
            <span className="flex items-center gap-2">
              <span className="flex flex-col items-end">
                <span className="text-xs opacity-70 font-normal">{t("blog-next")}</span>
                <span className="font-semibold">{t("blog-solid-principles")}</span>
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

