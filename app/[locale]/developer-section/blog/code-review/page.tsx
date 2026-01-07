"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function CodeReviewPage() {
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
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Code Review Best Practices</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Code Review Best Practices
        </Heading>
        <Text className={styles.subtitle}>
          Master the art of code review: Effective PR reviews, providing constructive feedback, reviewing architecture decisions, and comprehensive security checklists. Learn how senior engineers conduct reviews that improve code quality, share knowledge, and build stronger teams.
        </Text>
      </div>

      {/* Effective PR Reviews */}
      <section id="effective-pr-reviews" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Effective PR Reviews
              </Heading>
              <Text className={styles.sectionDescription}>
                Conduct thorough, efficient, and valuable code reviews that improve code quality and team knowledge.
              </Text>
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                1.1 Review Checklist
              </Heading>
              <Text className={styles.text}>
                A systematic approach ensures nothing is missed. Use this checklist for every review:
              </Text>
              
              <CodeEditor
                code={`// ✅ Code Review Checklist Template

/**
 * PR Review Checklist
 * 
 * FUNCTIONALITY
 * [ ] Does the code solve the problem described in the PR?
 * [ ] Are edge cases handled?
 * [ ] Are error cases handled gracefully?
 * [ ] Does it integrate correctly with existing code?
 * [ ] Are there any breaking changes? If so, are they documented?
 * 
 * CODE QUALITY
 * [ ] Is the code readable and maintainable?
 * [ ] Are variable/function names descriptive?
 * [ ] Is there code duplication that should be extracted?
 * [ ] Are there magic numbers/strings that should be constants?
 * [ ] Is the code following project conventions?
 * 
 * PERFORMANCE
 * [ ] Are there any obvious performance issues?
 * [ ] Are database queries optimized?
 * [ ] Are unnecessary re-renders avoided?
 * [ ] Is memory usage reasonable?
 * 
 * TESTING
 * [ ] Are there adequate tests?
 * [ ] Do tests cover edge cases?
 * [ ] Are tests maintainable and readable?
 * [ ] Do tests actually test what they claim to test?
 * 
 * DOCUMENTATION
 * [ ] Is complex logic documented?
 * [ ] Are public APIs documented?
 * [ ] Is the PR description clear?
 * [ ] Are breaking changes documented?
 * 
 * SECURITY
 * [ ] Are inputs validated and sanitized?
 * [ ] Are there any security vulnerabilities?
 * [ ] Are secrets properly handled?
 * [ ] Are permissions checked?
 */`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                1.2 Review Process Best Practices
              </Heading>
              <Text className={styles.text}>
                Follow a structured process to ensure efficient and effective reviews:
              </Text>

              <CodeComparison
                language="markdown"
                wrong={`# ❌ BAD: Unstructured Review Process

1. Open PR
2. Skim through code quickly
3. Comment on random things
4. Approve or request changes
5. Move on

Problems:
- Misses important issues
- Inconsistent feedback
- Doesn't help the author learn
- Creates friction in the team`}
                good={`# ✅ GOOD: Structured Review Process

## Step 1: Understand the Context
- Read the PR description thoroughly
- Understand the problem being solved
- Check related issues/tickets
- Review the branch diff in context

## Step 2: First Pass - High-Level Review
- Understand the overall approach
- Check if the solution aligns with architecture
- Verify it solves the stated problem
- Look for obvious issues

## Step 3: Second Pass - Detailed Review
- Review each file systematically
- Check code quality and style
- Verify logic correctness
- Look for edge cases
- Check test coverage

## Step 4: Third Pass - Integration Review
- Check integration with existing code
- Verify no breaking changes
- Check performance implications
- Review security aspects

## Step 5: Provide Feedback
- Be specific and actionable
- Explain the "why" behind suggestions
- Prioritize feedback (must-fix vs nice-to-have)
- Be respectful and constructive`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                1.3 Review Timing and Responsiveness
              </Heading>
              <Text className={styles.text}>
                Timely reviews are crucial for team velocity and developer experience:
              </Text>

              <CodeEditor
                code={`// ✅ Review Timing Best Practices

/**
 * Review Timing Guidelines
 */

// ✅ GOOD: Set clear expectations
const REVIEW_SLA = {
  small: "2-4 hours",      // < 100 lines
  medium: "4-8 hours",     // 100-500 lines
  large: "1 business day", // > 500 lines
  urgent: "1-2 hours"      // Hotfixes, critical bugs
};

// ✅ GOOD: Acknowledge quickly
async function acknowledgePR(pr: PullRequest) {
  // Even if you can't review immediately, acknowledge
  await comment(pr, "Thanks for the PR! I'll review this by EOD.");
  
  // Or request more time if needed
  if (pr.isLarge()) {
    await comment(pr, "This is a large PR. I'll need until tomorrow to review thoroughly.");
  }
}

// ✅ GOOD: Block time for reviews
const REVIEW_SCHEDULE = {
  morning: "9-10 AM: Review queue",
  afternoon: "2-3 PM: Review queue",
  endOfDay: "Review any remaining PRs"
};

// ❌ BAD: Let PRs sit for days
// ❌ BAD: Review without understanding context
// ❌ BAD: Rush through reviews to meet SLA

// ✅ GOOD: Use review tools effectively
const REVIEW_TOOLS = {
  github: "Use 'Request changes' for blocking issues",
  gitlab: "Use 'Needs work' for must-fix items",
  bitbucket: "Use 'Needs work' appropriately"
};

// ✅ GOOD: Batch similar reviews
// If multiple PRs touch the same area, review them together
// to understand the full context`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                1.4 PR Size and Scope
              </Heading>
              <Text className={styles.text}>
                Reviewing PR size and scope helps maintain code quality and review efficiency:
              </Text>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ BAD: Massive PR with everything
// 2000+ lines, 50+ files, multiple features

// This PR includes:
// - New authentication system
// - Database migration
// - API endpoints
// - Frontend components
// - Tests
// - Documentation
// - Bug fixes
// - Refactoring

// Problems:
// - Too much to review effectively
// - Hard to understand the full picture
// - High risk of missing issues
// - Difficult to rollback if needed`}
                good={`// ✅ GOOD: Focused, incremental PRs

// PR 1: Database schema changes
// - Migration files
// - Model updates
// - Tests for models
// ~200 lines

// PR 2: Backend API endpoints
// - New routes
// - Controller logic
// - Request/response types
// - API tests
// ~300 lines

// PR 3: Frontend components
// - New UI components
// - Integration with API
// - Component tests
// ~400 lines

// PR 4: Integration and polish
// - End-to-end tests
// - Documentation
// - Bug fixes from testing
// ~200 lines

// Benefits:
// - Easier to review
// - Clearer purpose
// - Lower risk
// - Faster feedback loop
// - Easier to rollback if needed`}
              />
            </div>
          </Stack>
        </Card>
      </section>

      {/* Providing Constructive Feedback */}
      <section id="constructive-feedback" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Providing Constructive Feedback
              </Heading>
              <Text className={styles.sectionDescription}>
                Give feedback that helps developers grow, improves code quality, and maintains a positive team culture.
              </Text>
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                2.1 Feedback Principles
              </Heading>
              <Text className={styles.text}>
                Effective feedback follows these core principles:
              </Text>

              <CodeComparison
                language="markdown"
                wrong={`# ❌ BAD: Destructive Feedback Examples

"This is wrong."
"Why did you do it this way?"
"This code is terrible."
"Fix this."
"Not how I would do it."
"This doesn't make sense."
"Change everything."`}
                good={`# ✅ GOOD: Constructive Feedback Examples

## Be Specific
❌ "This function is too long"
✅ "This function handles 3 responsibilities. Consider extracting 
   the validation logic (lines 10-25) and the formatting logic 
   (lines 30-45) into separate functions."

## Explain the Why
❌ "Use a different approach"
✅ "Using a Map here would improve lookup performance from O(n) 
   to O(1) since we're doing multiple lookups. Here's an example..."

## Offer Solutions
❌ "This won't work"
✅ "This approach might have issues with concurrent requests. 
   Consider using a mutex or queue. Here's a pattern we've used 
   before: [link to example]"

## Acknowledge Good Work
✅ "Great catch on the edge case!"
✅ "I like how you've simplified this logic."
✅ "Nice use of the existing utility function."

## Ask Questions
❌ "This is wrong"
✅ "I'm curious about this approach. What was your reasoning 
   for using X instead of Y? I'm wondering if Y might be 
   simpler here."

## Be Respectful
✅ "Thanks for the PR! A few thoughts..."
✅ "This is a solid implementation. One suggestion..."
✅ "I appreciate the thorough testing. One edge case to consider..."`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                2.2 Feedback Templates
              </Heading>
              <Text className={styles.text}>
                Use these templates to structure your feedback effectively:
              </Text>

              <CodeEditor
                code={`// ✅ Feedback Template: Code Quality Issue

/**
 * Template: Addressing Code Quality
 */

// Example 1: Code Duplication
const feedback1 = \`Great work on this feature! I noticed that the validation 
logic in UserService.validateEmail() is very similar to the logic in 
UserService.validatePhone(). 

Consider extracting this into a shared validator function to reduce 
duplication and make future changes easier:

\`\`\`typescript
function validateFormat(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

// Then use it in both places
validateFormat(email, EMAIL_REGEX);
validateFormat(phone, PHONE_REGEX);
\`\`\`

This would make the code more maintainable. What do you think?\`;

// Example 2: Performance Concern
const feedback2 = \`Nice implementation! I'm concerned about the performance 
of this nested loop (lines 45-52). With 1000 users and 1000 orders, 
this would be O(n*m) = 1,000,000 operations.

Consider using a Map for O(1) lookups:

\`\`\`typescript
const userMap = new Map(users.map(u => [u.id, u]));
orders.forEach(order => {
  const user = userMap.get(order.userId);
  // ...
});
\`\`\`

This would reduce it to O(n+m). Would this work for your use case?\`;

// Example 3: Naming Suggestion
const feedback3 = \`The function works well! The name \`processData\` is a 
bit generic. Since it's specifically calculating user statistics, 
consider renaming it to \`calculateUserStatistics\` to make the 
intent clearer. What do you think?\`;

// Example 4: Edge Case
const feedback4 = \`Solid implementation! One edge case to consider: what 
happens if \`items\` is an empty array? The current code might throw 
an error. Consider adding a guard:

\`\`\`typescript
if (items.length === 0) {
  return { total: 0, average: 0 };
}
\`\`\`

Thoughts?\`;`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                2.3 Prioritizing Feedback
              </Heading>
              <Text className={styles.sectionDescription}>
                Not all feedback is equal. Prioritize to help developers focus on what matters most:
              </Text>

              <CodeEditor
                code={`// ✅ Feedback Priority Levels

/**
 * Priority Levels for Code Review Feedback
 */

enum FeedbackPriority {
  // Must fix before merging
  BLOCKING = "BLOCKING",
  
  // Should fix, but can be in follow-up PR
  IMPORTANT = "IMPORTANT",
  
  // Nice to have, optional
  SUGGESTION = "SUGGESTION",
  
  // Question or discussion point
  QUESTION = "QUESTION"
}

// ✅ BLOCKING: Security issues, bugs, breaking changes
const blockingFeedback = {
  type: FeedbackPriority.BLOCKING,
  message: "This SQL query is vulnerable to injection attacks. " +
           "Please use parameterized queries before merging.",
  example: \`// ❌ VULNERABLE
const query = \`SELECT * FROM users WHERE id = \${userId}\`;

// ✅ SAFE
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);\`
};

// ✅ IMPORTANT: Code quality, maintainability
const importantFeedback = {
  type: FeedbackPriority.IMPORTANT,
  message: "This function is doing too much. Consider splitting it " +
           "into smaller functions for better testability. Can be " +
           "addressed in a follow-up PR if needed.",
  followUp: true
};

// ✅ SUGGESTION: Style, minor improvements
const suggestionFeedback = {
  type: FeedbackPriority.SUGGESTION,
  message: "Consider using optional chaining here: \`user?.profile?.name\` " +
           "instead of nested ternaries. Not required, just a style preference.",
  optional: true
};

// ✅ QUESTION: Understanding, discussion
const questionFeedback = {
  type: FeedbackPriority.QUESTION,
  message: "I'm curious about this approach. What was your reasoning " +
           "for using a recursive function here? I'm wondering if an " +
           "iterative approach might be simpler.",
  discussion: true
};

// ✅ GOOD: Use appropriate priority in review tools
function leaveReview(pr: PullRequest, feedback: Feedback[]) {
  const blocking = feedback.filter(f => f.priority === FeedbackPriority.BLOCKING);
  const nonBlocking = feedback.filter(f => f.priority !== FeedbackPriority.BLOCKING);
  
  if (blocking.length > 0) {
    // Use "Request changes" or "Needs work"
    pr.requestChanges(blocking);
  } else if (nonBlocking.length > 0) {
    // Use "Approve with suggestions" or "Approve"
    pr.approveWithComments(nonBlocking);
  } else {
    pr.approve();
  }
}`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                2.4 Handling Disagreements
              </Heading>
              <Text className={styles.text}>
                Disagreements are normal. Handle them constructively:
              </Text>

              <CodeEditor
                code={`// ✅ Handling Review Disagreements

/**
 * When you disagree with feedback or approach
 */

// ✅ GOOD: Acknowledge and explain
const response1 = \`Thanks for the feedback! I understand your concern about 
performance. I chose this approach because:

1. The data set is small (< 100 items), so the performance difference 
   is negligible
2. This approach is more readable and maintainable
3. We can optimize later if needed when we have real performance data

Would you like to discuss this further, or should we proceed with 
this approach and add a TODO to revisit if performance becomes an issue?\`;

// ✅ GOOD: Ask for clarification
const response2 = \`I appreciate the suggestion! I'm not sure I understand 
the concern. Could you help me understand what specific issue you're 
seeing? I'd like to make sure I address the right problem.\`;

// ✅ GOOD: Propose alternatives
const response3 = \`Great point! I see the issue now. What do you think 
about this alternative approach? It addresses your concern while 
keeping the code simple:

[proposed solution]

Does this work better?\`;

// ✅ GOOD: Agree to disagree (with escalation)
const response4 = \`I understand your perspective, but I have concerns 
about this approach because [reasons]. 

Since we have different views, should we:
1. Discuss this in a team meeting to get more perspectives?
2. Create a small spike to test both approaches?
3. Document the decision and revisit after we have more data?

What do you think?\`;

// ❌ BAD: Dismissive responses
// "I disagree"
// "This is fine"
// "You're wrong"
// "I'll change it but I don't agree"

// ✅ GOOD: Escalate when needed
// If there's a fundamental disagreement about architecture or approach,
// involve the team lead or have a design review meeting`}
              />
            </div>
          </Stack>
        </Card>
      </section>

      {/* Reviewing Architecture Decisions */}
      <section id="architecture-review" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Reviewing Architecture Decisions
              </Heading>
              <Text className={styles.sectionDescription}>
                Evaluate architectural choices, design patterns, and system design decisions in code reviews.
              </Text>
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                3.1 Architecture Review Checklist
              </Heading>
              <Text className={styles.text}>
                Use this checklist when reviewing architectural decisions:
              </Text>

              <CodeEditor
                code={`// ✅ Architecture Review Checklist

/**
 * Architecture Review Questions
 */

const ARCHITECTURE_CHECKLIST = {
  // Design Patterns
  designPatterns: [
    "Is the chosen design pattern appropriate for this problem?",
    "Are patterns used consistently across the codebase?",
    "Are patterns over-engineered for the problem size?",
    "Do patterns align with team conventions?",
  ],
  
  // Separation of Concerns
  separationOfConcerns: [
    "Are responsibilities clearly separated?",
    "Is there tight coupling that should be loosened?",
    "Are boundaries between layers/modules clear?",
    "Is business logic separated from infrastructure?",
  ],
  
  // Scalability
  scalability: [
    "Will this scale to expected load?",
    "Are there bottlenecks that will become problems?",
    "Is the data model appropriate for growth?",
    "Can this be extended without major refactoring?",
  ],
  
  // Maintainability
  maintainability: [
    "Is the code easy to understand?",
    "Will new team members be able to work with this?",
    "Is the complexity justified?",
    "Are there clear extension points?",
  ],
  
  // Integration
  integration: [
    "Does this integrate well with existing systems?",
    "Are there breaking changes?",
    "Is backward compatibility maintained?",
    "Are dependencies reasonable?",
  ],
  
  // Testing
  testability: [
    "Is the code testable?",
    "Are dependencies injectable?",
    "Can components be tested in isolation?",
    "Are there clear interfaces for mocking?",
  ]
};

// ✅ Example: Reviewing a new service
function reviewServiceArchitecture(service: Service) {
  const concerns = [];
  
  // Check separation of concerns
  if (service.hasBusinessLogic() && service.hasDatabaseAccess()) {
    concerns.push({
      type: "separation",
      message: "Service mixes business logic with data access. " +
               "Consider extracting data access to a repository layer.",
      example: \`// Current: Service does everything
class UserService {
  async getUser(id: string) {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return this.transformUser(user);
  }
}

// Better: Separate concerns
class UserRepository {
  async findById(id: string) {
    return db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}

class UserService {
  constructor(private repo: UserRepository) {}
  
  async getUser(id: string) {
    const user = await this.repo.findById(id);
    return this.transformUser(user);
  }
}\`
    });
  }
  
  // Check testability
  if (!service.hasDependencyInjection()) {
    concerns.push({
      type: "testability",
      message: "Service has hard dependencies, making it difficult to test. " +
               "Consider dependency injection.",
    });
  }
  
  return concerns;
}`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                3.2 Common Architecture Issues
              </Heading>
              <Text className={styles.text}>
                Watch for these common architectural problems:
              </Text>

              <CodeComparison
                language="typescript"
                wrong={`// ❌ BAD: Tight Coupling
class OrderService {
  private db = new MySQLDatabase(); // Hard dependency
  private email = new SendGridEmail(); // Hard dependency
  private cache = new RedisCache(); // Hard dependency
  
  async processOrder(order: Order) {
    // Can't test without real database, email service, cache
    const user = await this.db.query('SELECT * FROM users WHERE id = ?', [order.userId]);
    await this.email.send(user.email, 'Order confirmed');
    await this.cache.set(\`order:\${order.id}\`, order);
  }
}

// Problems:
// - Hard to test
// - Hard to swap implementations
// - Violates dependency inversion principle`}
                good={`// ✅ GOOD: Loose Coupling with Dependency Injection
interface Database {
  query(sql: string, params: any[]): Promise<any>;
}

interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface Cache {
  set(key: string, value: any): Promise<void>;
  get(key: string): Promise<any>;
}

class OrderService {
  constructor(
    private db: Database,
    private email: EmailService,
    private cache: Cache
  ) {}
  
  async processOrder(order: Order) {
    // Easy to test with mocks
    const user = await this.db.query('SELECT * FROM users WHERE id = ?', [order.userId]);
    await this.email.send(user.email, 'Order confirmed');
    await this.cache.set(\`order:\${order.id}\`, order);
  }
}

// Benefits:
// - Easy to test with mocks
// - Can swap implementations
// - Follows dependency inversion principle
// - More maintainable`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                3.3 Reviewing Design Patterns
              </Heading>
              <Text className={styles.text}>
                Evaluate whether design patterns are used appropriately:
              </Text>

              <CodeEditor
                code={`// ✅ Reviewing Design Pattern Usage

/**
 * Common Pattern Review Scenarios
 */

// Example 1: Factory Pattern
// ✅ GOOD: Factory when you need complex object creation
class PaymentProcessorFactory {
  create(type: PaymentType): PaymentProcessor {
    switch (type) {
      case PaymentType.CREDIT_CARD:
        return new CreditCardProcessor();
      case PaymentType.PAYPAL:
        return new PayPalProcessor();
      case PaymentType.STRIPE:
        return new StripeProcessor();
      default:
        throw new Error(\`Unknown payment type: \${type}\`);
    }
  }
}

// ❌ BAD: Factory for simple object creation
class UserFactory {
  create(name: string, email: string): User {
    return new User(name, email); // Over-engineered
  }
}

// Example 2: Strategy Pattern
// ✅ GOOD: Strategy when behavior varies
interface DiscountStrategy {
  calculate(price: number): number;
}

class RegularDiscount implements DiscountStrategy {
  calculate(price: number) { return price * 0.9; }
}

class VIPDiscount implements DiscountStrategy {
  calculate(price: number) { return price * 0.7; }
}

class PricingService {
  constructor(private strategy: DiscountStrategy) {}
  
  calculatePrice(basePrice: number) {
    return this.strategy.calculate(basePrice);
  }
}

// ❌ BAD: Strategy for single behavior
class SimpleCalculator {
  constructor(private strategy: AddStrategy) {} // Only one strategy
  // Should just have an add method
}

// Example 3: Observer Pattern
// ✅ GOOD: Observer for event-driven systems
class EventEmitter {
  private listeners = new Map<string, Function[]>();
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }
}

// ❌ BAD: Observer for simple callbacks
class SimpleService {
  private callback?: Function;
  
  setCallback(cb: Function) {
    this.callback = cb; // Just use a callback, not observer pattern
  }
}

// Review Questions:
// 1. Is the pattern solving a real problem?
// 2. Is the complexity justified?
// 3. Will this pattern make the code easier to maintain?
// 4. Is the pattern used consistently?
// 5. Are there simpler alternatives?`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                3.4 Performance and Scalability Review
              </Heading>
              <Text className={styles.text}>
                Evaluate performance implications and scalability concerns:
              </Text>

              <CodeComparison
                language="typescript"
                wrong={`// ❌ BAD: N+1 Query Problem
async function getUsersWithOrders() {
  const users = await db.query('SELECT * FROM users');
  
  // N+1 problem: 1 query for users + N queries for orders
  for (const user of users) {
    user.orders = await db.query(
      'SELECT * FROM orders WHERE userId = ?',
      [user.id]
    );
  }
  
  return users;
}

// If you have 1000 users, this makes 1001 queries!
// Performance: O(n) queries`}
                good={`// ✅ GOOD: Efficient Query with JOIN
async function getUsersWithOrders() {
  // Single query with JOIN
  const results = await db.query(\`
    SELECT 
      u.id, u.name, u.email,
      o.id as orderId, o.total, o.createdAt
    FROM users u
    LEFT JOIN orders o ON u.id = o.userId
  \`);
  
  // Group results in memory
  const userMap = new Map();
  for (const row of results) {
    if (!userMap.has(row.id)) {
      userMap.set(row.id, {
        id: row.id,
        name: row.name,
        email: row.email,
        orders: []
      });
    }
    
    if (row.orderId) {
      userMap.get(row.id).orders.push({
        id: row.orderId,
        total: row.total,
        createdAt: row.createdAt
      });
    }
  }
  
  return Array.from(userMap.values());
}

// Only 1 query regardless of number of users
// Performance: O(1) queries + O(n) processing`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                3.5 API Design Review
              </Heading>
              <Text className={styles.text}>
                Review API design for consistency, usability, and maintainability:
              </Text>

              <CodeEditor
                code={`// ✅ API Design Review Checklist

/**
 * API Design Review Points
 */

// 1. Naming Consistency
// ✅ GOOD: Consistent naming
GET /api/users/:id
GET /api/users/:id/orders
POST /api/users/:id/orders

// ❌ BAD: Inconsistent naming
GET /api/user/:id
GET /api/users/:id/getOrders
POST /api/createOrder

// 2. HTTP Methods
// ✅ GOOD: Proper HTTP methods
GET /api/users          // List
GET /api/users/:id      // Get one
POST /api/users         // Create
PUT /api/users/:id      // Update (full)
PATCH /api/users/:id    // Update (partial)
DELETE /api/users/:id   // Delete

// ❌ BAD: Using POST for everything
POST /api/getUsers
POST /api/updateUser
POST /api/deleteUser

// 3. Response Format
// ✅ GOOD: Consistent response format
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    total?: number;
  };
  errors?: ApiError[];
}

// ❌ BAD: Inconsistent formats
// Sometimes: { user: {...} }
// Sometimes: { data: {...} }
// Sometimes: {...} directly

// 4. Error Handling
// ✅ GOOD: Consistent error format
interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// Status codes:
// 400: Bad Request (validation errors)
// 401: Unauthorized
// 403: Forbidden
// 404: Not Found
// 500: Internal Server Error

// ❌ BAD: Always 200 with error in body
{
  status: 200,
  body: { error: "User not found" }
}

// 5. Versioning
// ✅ GOOD: API versioning
/api/v1/users
/api/v2/users

// ❌ BAD: No versioning strategy
// Makes breaking changes difficult

// 6. Pagination
// ✅ GOOD: Consistent pagination
GET /api/users?page=1&limit=20
{
  data: [...],
  meta: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }
}

// ❌ BAD: No pagination or inconsistent
GET /api/users?offset=0&count=20
GET /api/users?skip=0&take=20`}
              />
            </div>
          </Stack>
        </Card>
      </section>

      {/* Security Review Checklist */}
      <section id="security-review" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Security Review Checklist
              </Heading>
              <Text className={styles.sectionDescription}>
                Comprehensive security checklist for code reviews. Catch vulnerabilities before they reach production.
              </Text>
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                4.1 Input Validation and Sanitization
              </Heading>
              <Text className={styles.text}>
                Always validate and sanitize user input:
              </Text>

              <CodeComparison
                language="typescript"
                wrong={`// ❌ BAD: No input validation
app.post('/api/users', async (req, res) => {
  const { email, age, name } = req.body;
  
  // Directly using user input - DANGEROUS
  await db.query(
    \`INSERT INTO users (email, age, name) VALUES ('\${email}', \${age}, '\${name}')\`
  );
  
  res.json({ success: true });
});

// Vulnerabilities:
// - SQL Injection
// - No type validation
// - No length limits
// - XSS if data is displayed`}
                good={`// ✅ GOOD: Proper validation and parameterized queries
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(150),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\\s]+$/)
});

app.post('/api/users', async (req, res) => {
  try {
    // Validate input
    const validated = userSchema.parse(req.body);
    
    // Use parameterized queries
    await db.query(
      'INSERT INTO users (email, age, name) VALUES (?, ?, ?)',
      [validated.email, validated.age, validated.name]
    );
    
    res.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        errors: error.errors 
      });
    }
    throw error;
  }
});`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                4.2 Authentication and Authorization
              </Heading>
              <Text className={styles.text}>
                Verify proper authentication and authorization:
              </Text>

              <CodeEditor
                code={`// ✅ Authentication & Authorization Review

/**
 * Security Checklist: Auth
 */

// ✅ GOOD: Proper authentication check
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ✅ GOOD: Role-based authorization
async function requireRole(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// ✅ GOOD: Resource-level authorization
async function canAccessOrder(req: Request, res: Response, next: NextFunction) {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  
  // Check if user owns the resource or is admin
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  req.order = order;
  next();
}

// ✅ GOOD: Using middleware
app.get('/api/orders/:id', 
  requireAuth,
  canAccessOrder,
  async (req, res) => {
    res.json(req.order);
  }
);

// ❌ BAD: Missing auth checks
app.get('/api/admin/users', async (req, res) => {
  // No authentication check!
  const users = await User.findAll();
  res.json(users);
});

// ❌ BAD: Client-side only authorization
// Frontend: if (user.role === 'admin') { showAdminPanel(); }
// Backend: No check - anyone can call the API

// Security Review Questions:
// 1. Is authentication required for all protected endpoints?
// 2. Is authorization checked (not just authentication)?
// 3. Are resource-level permissions verified?
// 4. Are admin endpoints properly protected?
// 5. Is sensitive data filtered based on user permissions?
// 6. Are tokens properly validated and not expired?
// 7. Is password hashing using secure algorithms (bcrypt, argon2)?`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                4.3 Secrets and Sensitive Data
              </Heading>
              <Text className={styles.text}>
                Ensure secrets and sensitive data are handled securely:
              </Text>

              <CodeComparison
                language="typescript"
                wrong={`// ❌ BAD: Hardcoded secrets
const API_KEY = 'sk_live_1234567890abcdef';
const DB_PASSWORD = 'mypassword123';
const JWT_SECRET = 'secret123';

// ❌ BAD: Secrets in code
const config = {
  apiKey: process.env.API_KEY || 'default_key', // Fallback to hardcoded
  database: {
    password: 'hardcoded_password'
  }
};

// ❌ BAD: Logging sensitive data
console.log('User data:', user);
console.log('Request body:', req.body); // Might contain passwords
console.log('Token:', token);`}
                good={`// ✅ GOOD: Environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY environment variable is required');
}

const config = {
  apiKey: API_KEY,
  database: {
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
  },
  jwtSecret: process.env.JWT_SECRET
};

// ✅ GOOD: Using secret management
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManager({ region: 'us-east-1' });
  const response = await client.getSecretValue({ SecretId: secretName });
  return response.SecretString!;
}

// ✅ GOOD: Safe logging
logger.info('User authenticated', { 
  userId: user.id, 
  // Don't log sensitive data
});

logger.debug('Request received', {
  method: req.method,
  path: req.path,
  // Don't log body if it contains sensitive data
  body: sanitizeForLogging(req.body)
});

function sanitizeForLogging(data: any): any {
  const sensitive = ['password', 'token', 'secret', 'apiKey', 'ssn'];
  const sanitized = { ...data };
  
  for (const key of Object.keys(sanitized)) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

// ✅ GOOD: Secure password handling
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Sufficient for bcrypt
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(
  password: string, 
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Security Review Checklist:
// [ ] No hardcoded secrets in code
// [ ] Secrets stored in environment variables or secret management
// [ ] No secrets in version control (.gitignore checked)
// [ ] No secrets in logs
// [ ] Passwords are hashed (never plain text)
// [ ] API keys are not exposed to frontend
// [ ] Database credentials are secure
// [ ] JWT secrets are strong and rotated`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                4.4 XSS and Injection Prevention
              </Heading>
              <Text className={styles.text}>
                Prevent Cross-Site Scripting (XSS) and injection attacks:
              </Text>

              <CodeEditor
                code={`// ✅ XSS and Injection Prevention

/**
 * XSS Prevention in React
 */

// ✅ GOOD: React auto-escapes by default
function UserComment({ comment }: { comment: string }) {
  // Safe: React escapes HTML automatically
  return <div>{comment}</div>;
}

// ✅ GOOD: Sanitize if HTML is needed
import DOMPurify from 'dompurify';

function RichComment({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href']
  });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ❌ BAD: Unsanitized HTML
function DangerousComment({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // Vulnerable to XSS!
}

/**
 * SQL Injection Prevention
 */

// ✅ GOOD: Parameterized queries
async function getUser(id: string) {
  return db.query('SELECT * FROM users WHERE id = ?', [id]);
}

// ✅ GOOD: Using ORM (prevents injection)
async function getUser(id: string) {
  return User.findOne({ where: { id } });
}

// ❌ BAD: String concatenation
async function getUser(id: string) {
  return db.query(\`SELECT * FROM users WHERE id = '\${id}'\`);
  // Vulnerable to SQL injection!
}

/**
 * Command Injection Prevention
 */

// ✅ GOOD: Validate and sanitize
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runCommand(command: string) {
  // Whitelist allowed commands
  const allowedCommands = ['ls', 'pwd', 'date'];
  const [cmd, ...args] = command.split(' ');
  
  if (!allowedCommands.includes(cmd)) {
    throw new Error('Command not allowed');
  }
  
  // Validate arguments
  for (const arg of args) {
    if (!/^[a-zA-Z0-9._-]+$/.test(arg)) {
      throw new Error('Invalid characters in arguments');
    }
  }
  
  return execAsync(command);
}

// ❌ BAD: Direct execution
async function runCommand(command: string) {
  return execAsync(command); // Vulnerable to command injection!
}

/**
 * NoSQL Injection Prevention
 */

// ✅ GOOD: Parameterized queries
async function findUser(username: string) {
  return User.findOne({ 
    username: username // MongoDB driver handles this safely
  });
}

// ❌ BAD: String interpolation in queries
async function findUser(username: string) {
  return db.collection('users').find({
    $where: \`this.username === "\${username}"\`
  }); // Vulnerable to NoSQL injection!
}

// Security Review Checklist:
// [ ] All user input is validated
// [ ] HTML is sanitized before rendering
// [ ] SQL queries use parameterized statements
// [ ] No eval() or similar dangerous functions
// [ ] Command execution is restricted and validated
// [ ] NoSQL queries use safe methods
// [ ] File uploads are validated and scanned
// [ ] URLs are validated before use`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                4.5 CORS and CSRF Protection
              </Heading>
              <Text className={styles.text}>
                Review Cross-Origin Resource Sharing (CORS) and Cross-Site Request Forgery (CSRF) protection:
              </Text>

              <CodeEditor
                code={`// ✅ CORS and CSRF Protection

/**
 * CORS Configuration
 */

// ✅ GOOD: Restrictive CORS
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://myapp.com',
      'https://www.myapp.com'
    ];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// ❌ BAD: Permissive CORS
app.use(cors({
  origin: '*', // Allows any origin!
  credentials: true // Dangerous with wildcard origin
}));

/**
 * CSRF Protection
 */

// ✅ GOOD: CSRF tokens
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

app.use(cookieParser());

const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Generate token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ token: req.csrfToken() });
});

// Protect state-changing endpoints
app.post('/api/users', csrfProtection, (req, res) => {
  // CSRF token validated automatically
  // Process request...
});

// ✅ GOOD: SameSite cookies
app.use(session({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Prevents CSRF
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ✅ GOOD: Custom headers (for API)
// Require custom header that browser won't send cross-origin
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const customHeader = req.headers['x-requested-with'];
    if (customHeader !== 'XMLHttpRequest') {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  next();
});

// Security Review Checklist:
// [ ] CORS is properly configured (not too permissive)
// [ ] Credentials are only allowed with specific origins
// [ ] CSRF protection is enabled for state-changing operations
// [ ] CSRF tokens are properly validated
// [ ] Cookies have SameSite attribute set
// [ ] Cookies are HttpOnly and Secure in production
// [ ] Custom headers are used for API protection when appropriate`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                4.6 Rate Limiting and DDoS Protection
              </Heading>
              <Text className={styles.text}>
                Implement rate limiting to prevent abuse:
              </Text>

              <CodeEditor
                code={`// ✅ Rate Limiting

/**
 * Rate Limiting Implementation
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// ✅ GOOD: General rate limiting
const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

// ✅ GOOD: Stricter limits for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ✅ GOOD: Different limits for different endpoints
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
});

const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10, // 10 requests per minute
});

app.use('/api/search', strictLimiter); // Expensive operation
app.use('/api/data', apiLimiter); // Regular API

// ✅ GOOD: User-based rate limiting
async function userRateLimit(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next();
  }
  
  const key = \`rate_limit:user:\${req.user.id}\`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  
  if (count > 100) { // 100 requests per minute per user
    return res.status(429).json({ 
      error: 'Rate limit exceeded' 
    });
  }
  
  res.setHeader('X-RateLimit-Remaining', 100 - count);
  next();
}

app.use('/api/', userRateLimit);

// Security Review Checklist:
// [ ] Rate limiting is implemented
// [ ] Different limits for different endpoints
// [ ] Auth endpoints have stricter limits
// [ ] Rate limits are enforced server-side
// [ ] Rate limit headers are included in responses
// [ ] Rate limiting works across multiple servers (Redis)
// [ ] DDoS protection is considered
// [ ] IP-based and user-based limits are used appropriately`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                4.7 Complete Security Review Checklist
              </Heading>
              <Text className={styles.text}>
                Use this comprehensive checklist for every security review:
              </Text>

              <CodeEditor
                code={`// ✅ Complete Security Review Checklist

/**
 * Security Review Checklist
 * Use this for every code review
 */

const SECURITY_CHECKLIST = {
  // Input Validation
  inputValidation: [
    "[ ] All user input is validated",
    "[ ] Input length limits are enforced",
    "[ ] Input types are verified",
    "[ ] Special characters are handled safely",
    "[ ] File uploads are validated (type, size)",
    "[ ] File uploads are scanned for malware",
  ],
  
  // Authentication & Authorization
  auth: [
    "[ ] Authentication is required for protected endpoints",
    "[ ] Tokens are properly validated",
    "[ ] Tokens expire appropriately",
    "[ ] Password requirements are enforced",
    "[ ] Passwords are hashed (never plain text)",
    "[ ] Multi-factor authentication is considered where needed",
    "[ ] Authorization is checked (not just authentication)",
    "[ ] Resource-level permissions are verified",
    "[ ] Admin endpoints are properly protected",
  ],
  
  // Data Protection
  dataProtection: [
    "[ ] Sensitive data is encrypted at rest",
    "[ ] Sensitive data is encrypted in transit (HTTPS)",
    "[ ] PII is handled according to regulations",
    "[ ] Secrets are not hardcoded",
    "[ ] Secrets are stored securely (env vars, secret management)",
    "[ ] Secrets are not logged",
    "[ ] Database credentials are secure",
  ],
  
  // Injection Prevention
  injection: [
    "[ ] SQL queries use parameterized statements",
    "[ ] NoSQL queries use safe methods",
    "[ ] HTML is sanitized before rendering",
    "[ ] No eval() or dangerous code execution",
    "[ ] Command execution is restricted and validated",
    "[ ] Template injection is prevented",
  ],
  
  // XSS Prevention
  xss: [
    "[ ] User input is escaped when displayed",
    "[ ] dangerouslySetInnerHTML is avoided or sanitized",
    "[ ] Content Security Policy is configured",
    "[ ] XSS vulnerabilities in third-party libraries are checked",
  ],
  
  // CSRF Protection
  csrf: [
    "[ ] CSRF tokens are used for state-changing operations",
    "[ ] CSRF tokens are properly validated",
    "[ ] SameSite cookies are configured",
    "[ ] Custom headers are used for API protection",
  ],
  
  // CORS
  cors: [
    "[ ] CORS is properly configured",
    "[ ] CORS is not too permissive",
    "[ ] Credentials are only allowed with specific origins",
    "[ ] CORS headers are validated",
  ],
  
  // Rate Limiting
  rateLimiting: [
    "[ ] Rate limiting is implemented",
    "[ ] Different limits for different endpoints",
    "[ ] Auth endpoints have stricter limits",
    "[ ] Rate limits are enforced server-side",
  ],
  
  // Error Handling
  errorHandling: [
    "[ ] Error messages don't leak sensitive information",
    "[ ] Stack traces are not exposed in production",
    "[ ] Generic error messages for users",
    "[ ] Detailed errors only in logs",
  ],
  
  // Dependencies
  dependencies: [
    "[ ] Dependencies are up to date",
    "[ ] Known vulnerabilities are checked",
    "[ ] Unused dependencies are removed",
    "[ ] Dependency versions are pinned",
  ],
  
  // Logging & Monitoring
  logging: [
    "[ ] Sensitive data is not logged",
    "[ ] Security events are logged",
    "[ ] Failed login attempts are logged",
    "[ ] Unusual activity is monitored",
  ],
  
  // API Security
  apiSecurity: [
    "[ ] API endpoints are properly authenticated",
    "[ ] API rate limiting is implemented",
    "[ ] API versioning is considered",
    "[ ] API documentation doesn't expose sensitive info",
  ],
  
  // File Security
  fileSecurity: [
    "[ ] File uploads are validated",
    "[ ] File paths are sanitized",
    "[ ] File access is restricted",
    "[ ] File execution is prevented",
  ],
  
  // Session Security
  sessionSecurity: [
    "[ ] Sessions are properly managed",
    "[ ] Session tokens are secure",
    "[ ] Sessions expire appropriately",
    "[ ] Session fixation is prevented",
  ]
};

// ✅ Use this checklist in your review process
function performSecurityReview(code: Code): SecurityIssues[] {
  const issues: SecurityIssues[] = [];
  
  // Check each category
  for (const [category, checks] of Object.entries(SECURITY_CHECKLIST)) {
    // Perform checks...
    // Add issues if found...
  }
  
  return issues;
}`}
              />
            </div>
          </Stack>
        </Card>
      </section>

      {/* Best Practices Summary */}
      <section id="summary" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Code Review Best Practices Summary
              </Heading>
              <Text className={styles.sectionDescription}>
                Key takeaways for effective code reviews.
              </Text>
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                The Golden Rules
              </Heading>
              <Text className={styles.text}>
                Follow these golden rules for every code review:
              </Text>

              <CodeEditor
                code={`// ✅ Code Review Golden Rules

/**
 * 1. Be Respectful and Constructive
 * - Remember: you're reviewing code, not the person
 * - Focus on improvement, not criticism
 * - Acknowledge good work
 * - Explain the "why" behind suggestions
 */

/**
 * 2. Be Specific and Actionable
 * - Point to exact lines or sections
 * - Provide examples or alternatives
 * - Explain the impact of issues
 * - Prioritize feedback (blocking vs suggestion)
 */

/**
 * 3. Review Promptly
 * - Acknowledge PRs quickly
 * - Set clear expectations for review time
 * - Don't let PRs sit for days
 * - Batch reviews when possible
 */

/**
 * 4. Focus on What Matters
 * - Functionality and correctness
 * - Security vulnerabilities
 * - Performance issues
 * - Maintainability and readability
 * - Don't nitpick on style (use linters)
 */

/**
 * 5. Learn and Teach
 * - Use reviews as learning opportunities
 * - Share knowledge and patterns
 * - Ask questions to understand
 * - Document decisions and patterns
 */

/**
 * 6. Use Tools Effectively
 * - Use review tools' features (approve, request changes)
 * - Use checklists for consistency
 * - Automate what can be automated (linters, tests)
 * - Focus human review on what matters
 */

/**
 * 7. Keep PRs Focused
 * - Encourage small, focused PRs
 * - Review architecture for large changes
 * - Consider design reviews for major features
 * - Break down large PRs when possible
 */

/**
 * 8. Security First
 * - Always check for security issues
 * - Use security checklists
 * - Don't skip security review for "small" changes
 * - Stay updated on security best practices
 */`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                Review Process Flow
              </Heading>
              <Text className={styles.text}>
                Follow this process for consistent, effective reviews:
              </Text>

              <CodeEditor
                code={`// ✅ Code Review Process Flow

/**
 * Step 1: Preparation
 * - Read the PR description
 * - Understand the problem being solved
 * - Check related issues/tickets
 * - Review the branch in context
 */

/**
 * Step 2: First Pass - High Level
 * - Understand the overall approach
 * - Check if solution aligns with architecture
 * - Verify it solves the stated problem
 * - Look for obvious issues
 * - Check PR size (is it too large?)
 */

/**
 * Step 3: Second Pass - Detailed Review
 * - Review each file systematically
 * - Check code quality and style
 * - Verify logic correctness
 * - Look for edge cases
 * - Check test coverage
 * - Review documentation
 */

/**
 * Step 4: Third Pass - Integration & Security
 * - Check integration with existing code
 * - Verify no breaking changes
 * - Check performance implications
 * - Perform security review
 * - Check for dependencies
 */

/**
 * Step 5: Provide Feedback
 * - Be specific and actionable
 * - Explain the "why"
 * - Prioritize feedback
 * - Be respectful
 * - Acknowledge good work
 */

/**
 * Step 6: Follow Up
 * - Respond to author's questions
 * - Review changes promptly
 * - Approve when ready
 * - Learn from the review
 */`}
              />
            </div>

            <div className={styles.subsection}>
              <Heading level={3} className={styles.subsectionTitle}>
                Common Pitfalls to Avoid
              </Heading>
              <Text className={styles.text}>
                Avoid these common code review mistakes:
              </Text>

              <CodeEditor
                code={`// ❌ Common Code Review Pitfalls

/**
 * Pitfall 1: Nitpicking
 * - Don't comment on every minor style issue
 * - Use linters for style enforcement
 * - Focus on what matters: functionality, security, maintainability
 */

/**
 * Pitfall 2: Being Vague
 * - Don't say "this is wrong" without explanation
 * - Don't say "fix this" without context
 * - Always explain the "why"
 * - Provide examples or alternatives
 */

/**
 * Pitfall 3: Delaying Reviews
 * - Don't let PRs sit for days
 * - Don't review at the last minute
 * - Acknowledge PRs quickly
 * - Set aside time for reviews
 */

/**
 * Pitfall 4: Approving Without Review
 * - Don't rubber-stamp approvals
 * - Don't approve PRs you haven't reviewed
 * - Take reviews seriously
 * - Your approval means you've verified the code
 */

/**
 * Pitfall 5: Ignoring Tests
 * - Don't skip reviewing tests
 * - Verify tests actually test the code
 * - Check test coverage
 * - Ensure tests are maintainable
 */

/**
 * Pitfall 6: Skipping Security
 * - Don't assume security is someone else's job
 * - Always check for security issues
 * - Use security checklists
 * - Stay updated on vulnerabilities
 */

/**
 * Pitfall 7: Not Learning
 * - Don't just point out issues
 * - Use reviews to learn
 * - Share knowledge
 * - Ask questions to understand
 */

/**
 * Pitfall 8: Being Defensive
 * - Don't take feedback personally
 * - Don't be defensive about your code
 * - Be open to suggestions
 * - Remember: the goal is better code
 */`}
              />
            </div>
          </Stack>
        </Card>
      </section>

      {/* Navigation */}
      <div className={styles.navigationSection}>
        <Card className={styles.navCard}>
          <Stack direction="row" gap="md" className={styles.navButtons}>
            <ButtonLink
              href={createLocalizedPath("/developer-section/blog")}
              variant="secondary"
              className={styles.navButton}
            >
              ← Back to Blog
            </ButtonLink>
          </Stack>
        </Card>
      </div>
    </BlogContentLayout>
  );
}
