"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeEditor, FullscreenSection } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function CompositionPatternPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-zinc-400">
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 !bg-white/5 !text-zinc-300 hover:!bg-white/10">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 !bg-white/5 !text-zinc-300 hover:!bg-white/10">
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 !bg-white/5 !text-zinc-300 hover:!bg-white/10">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li>/</li>
          <li className="text-zinc-100 font-medium">Composition</li>
        </ol>
      </nav>

      {/* Header */}
      <Stack direction="col" gap="lg" className="mb-12">
        <div>
          <Heading className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Composition: The Foundation of Modern React
          </Heading>
          <Text size="lg" className="text-zinc-400 max-w-3xl">
            Learn how composition over inheritance creates more flexible, maintainable, and powerful React components. 
            Master the art of building complex UIs from simple, reusable pieces.
          </Text>
        </div>
      </Stack>

      {/* Lesson 1: Composition vs Inheritance */}
      <FullscreenSection id="lesson-1" title="Lesson 1" sectionClassName="mb-16 scroll-mt-24">
        <Card variant="elevated" className="p-8 !bg-white/5 !border-white/10">
          <Stack direction="col" gap="md">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-4">
                Lesson 1
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                Composition vs Inheritance
              </Heading>
              <Text className="text-zinc-300 mb-4">
                React has a powerful composition model, and we recommend using composition instead of inheritance to reuse code between components.
              </Text>
            </div>

            {/* Containment */}
            <div className="mt-6">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                Containment
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Some components don't know their children ahead of time. This is especially common for components like Sidebar or Dialog that represent generic "boxes".
                We recommend that such components use the special <code className="text-purple-400">children</code> prop to pass children elements directly into their output:
              </Text>
              
              <CodeEditor
                code={`function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}`}
                language="tsx"
                readOnly={true}
                height={300}
              />
            </div>

            {/* Multiple Holes */}
            <div className="mt-8">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                Multiple "Holes"
              </Heading>
              <Text className="text-zinc-300 mb-4">
                While this is less common, sometimes you might need multiple "holes" in a component. In such cases you may come up with your own convention instead of using children:
              </Text>
              
              <CodeEditor
                code={`function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}`}
                language="tsx"
                readOnly={true}
                height={250}
              />
            </div>

            {/* Specialization */}
            <div className="mt-8">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                Specialization
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Sometimes we think about components as being "special cases" of other components. For example, we might say that a WelcomeDialog is a special case of Dialog.
                In React, this is also achieved by composition:
              </Text>
              
              <CodeEditor
                code={`function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}`}
                language="tsx"
                readOnly={true}
                height={250}
              />
            </div>

            {/* Class Components Example */}
            <div className="mt-8">
              <Text className="text-zinc-300 mb-4">
                Composition works equally well for components defined as classes:
              </Text>
              
              <CodeEditor
                code={`function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(\`Welcome aboard, \${this.state.login}!\`);
  }
}`}
                language="tsx"
                readOnly={true}
                height={400}
              />
            </div>

            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded mt-6">
              <Heading level={3} className="text-xl font-bold mb-2 text-blue-200">
                So What About Inheritance?
              </Heading>
              <Text className="text-zinc-300">
                At Facebook, we use React in thousands of components, and we haven't found any use cases where we would recommend creating component inheritance hierarchies.
                Props and composition give you all the flexibility you need to customize a component's look and behavior in an explicit and safe way.
              </Text>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Lesson 2: Thinking in Components */}
      <FullscreenSection id="lesson-2" title="Lesson 2" sectionClassName="mb-16 scroll-mt-24">
        <Card variant="elevated" className="p-8 !bg-white/5 !border-white/10">
          <Stack direction="col" gap="md">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-4">
                Lesson 2
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                Thinking in Components: Avoiding Conditional Rendering Hell
              </Heading>
              <Text className="text-zinc-300 mb-4">
                The biggest advantage of React is the ability to compose components together into more components. 
                It's easy to miss this advantage if you've always been used to it.
              </Text>
            </div>

            {/* The Problem with Conditional Rendering */}
            <div className="mt-6">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                The Problem with Conditional Rendering
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Conditional rendering inside JSX starts to become a problem when we use it for rendering different states of a component. 
                Consider this self-contained component:
              </Text>
              
              <CodeEditor
                code={`export function ShoppingList() {
  const { data, isPending } = useQuery(/* ... */)

  return (
    <Card>
      <CardHeading>Welcome 👋</CardHeading>
      <CardContent>
        {data?.assignee ? <UserInfo {...data.assignee} /> : null}
        {isPending ? <Skeleton /> : null}
        {data
          ? data.content.map((item) => (
              <ShoppingItem key={item.id} {...item} />
            ))
          : null}
      </CardContent>
    </Card>
  )
}`}
                language="tsx"
                readOnly={true}
                height={250}
              />
            </div>

            {/* Adding More States */}
            <div className="mt-8">
              <Text className="text-zinc-300 mb-4">
                When we add more states, like an empty screen, the conditional logic becomes complex and hard to read:
              </Text>
              
              <CodeEditor
                code={`export function ShoppingList() {
  const { data, isPending } = useQuery(/* ... */)

  return (
    <Card>
      <CardHeading>Welcome 👋</CardHeading>
      <CardContent>
        {data?.assignee ? <UserInfo {...data.assignee} /> : null}
        {isPending ? <Skeleton /> : null}
        {!data && !isPending ? <EmptyScreen /> : null}
        {data
          ? data.content.map((item) => (
              <ShoppingItem key={item.id} {...item} />
            ))
          : null}
      </CardContent>
    </Card>
  )
}`}
                language="tsx"
                readOnly={true}
                height={280}
              />
            </div>

            {/* Solution: Early Returns */}
            <div className="mt-8">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                Solution: Early Returns with Composition
              </Heading>
              <Text className="text-zinc-300 mb-4">
                The solution is to extract the layout and use early returns. This makes each state clear and easy to understand:
              </Text>
              
              <CodeEditor
                code={`function Layout(props: { children: ReactNode }) {
  return (
    <Card>
      <CardHeading>Welcome 👋</CardHeading>
      <CardContent>{props.children}</CardContent>
    </Card>
  )
}

export function ShoppingList() {
  const { data, isPending } = useQuery(/* ... */)

  if (isPending) {
    return (
      <Layout>
        <Skeleton />
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <EmptyScreen />
      </Layout>
    )
  }

  return (
    <Layout>
      {data.assignee ? <UserInfo {...data.assignee} /> : null}
      {data.content.map((item) => (
        <ShoppingItem key={item.id} {...item} />
      ))}
    </Layout>
  )
}`}
                language="tsx"
                readOnly={true}
                height={400}
              />
            </div>

            <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded mt-6">
              <Heading level={3} className="text-xl font-bold mb-2 text-green-200">
                Key Benefits
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Reduced cognitive load:</strong> Clear path for developers to follow, nothing is nested</li>
                <li><strong>Easy to extend:</strong> Add more conditions without breaking other states</li>
                <li><strong>Better type inference:</strong> TypeScript knows data is defined after handling the empty case</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Lesson 3: The Future of React */}
      <FullscreenSection id="lesson-3" title="Lesson 3" sectionClassName="mb-16 scroll-mt-24">
        <Card variant="elevated" className="p-8 !bg-white/5 !border-white/10">
          <Stack direction="col" gap="md">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-4">
                Lesson 3
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                The Future of React: Enhancing Components through Composition Pattern
              </Heading>
              <Text className="text-zinc-300 mb-4">
                The Composition Pattern is a game-changer, elevating reusability, readability, and maintainability of the code to new heights.
              </Text>
            </div>

            {/* Traditional Approach */}
            <div className="mt-6">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                The Traditional Approach (Prop Hell)
              </Heading>
              <Text className="text-zinc-300 mb-4">
                In traditional component architecture, it's common to pass numerous props throughout the component tree. 
                This can easily lead to "prop hell" as requirements evolve:
              </Text>
              
              <CodeEditor
                code={`interface CtaButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  iconNameLeft?: string;
  iconNameRight?: string;
  iconColorLeft?: string;
  iconColorRight?: string;
  iconSizeLeft?: number;
  iconSizeRight?: number;
  text: string;
}

export const CtaButton: React.FC<CtaButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  iconNameLeft,
  iconNameRight,
  iconColorLeft,
  iconColorRight,
  iconSizeLeft,
  iconSizeRight,
  text,
  className,
  ...props
}) => {
  const classes = \`btn \${variant} \${size} \${className}\`;

  return (
    <button className={classes} {...props}>
      {iconNameLeft && (
        <Icon name={iconNameLeft} size={iconSizeLeft} color={iconColorLeft} />
      )}
      <span>{text}</span>
      {iconNameRight && (
        <Icon
          name={iconNameRight}
          size={iconSizeRight}
          color={iconColorRight}
        />
      )}
    </button>
  );
};

// Usage - 9 props for a simple button!
<CtaButton
   iconNameLeft="+"
   iconColorLeft="red"
   iconNameRight="+"
   iconColorRight="green"
   iconSizeLeft={20}
   iconSizeRight={30}
   text="Add more"
/>`}
                language="tsx"
                readOnly={true}
                height={500}
              />
            </div>

            {/* Composition Pattern Solution */}
            <div className="mt-8">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                The Composition Pattern Solution
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Break down components into smaller, manageable pieces that can be composed together:
              </Text>
              
              <CodeEditor
                code={`interface CtaRootProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'large';
}

export const CtaRoot: React.FC<CtaRootProps> = ({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}) => {
  const classes = \`btn \${variant} \${size} \${className}\`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export const CtaIcon: React.FC<React.ComponentProps<typeof Icon>> = (props) => {
  return <Icon {...props} />;
};

export const CtaText: React.FC<React.ComponentProps<'span'>> = ({
  children,
  ...props
}) => {
  return <span {...props}>{children}</span>;
};

export const Cta = {
  Root: CtaRoot,
  Icon: CtaIcon,
  Text: CtaText,
};

// Usage - Clean and readable!
{/* Icon Left */}
<Cta.Root>
  <Cta.Icon name="+" color="red" size={20} />
  <Cta.Text>Add more</Cta.Text>
</Cta.Root>

{/* Icon Right */}
<Cta.Root>
  <Cta.Text>Add more</Cta.Text>
  <Cta.Icon name="+" color="green" size={20} />
</Cta.Root>

{/* Icon Both sides with different colors and sizes */}
<Cta.Root>
  <Cta.Icon name="+" color="red" size={20} />
  <Cta.Text>Add more</Cta.Text>
  <Cta.Icon name="+" color="green" size={30} />
</Cta.Root>`}
                language="tsx"
                readOnly={true}
                height={600}
              />
            </div>

            <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded mt-6">
              <Heading level={3} className="text-xl font-bold mb-2 text-purple-200">
                Advantages of Composition Pattern
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Reduced Prop-Drilling:</strong> Each sub-component maintains its own props</li>
                <li><strong>Explicit Control:</strong> Each sub-component can be included or excluded explicitly</li>
                <li><strong>Easier Variants:</strong> Rearrange composed sub-components without additional props</li>
                <li><strong>Clear Structure:</strong> Easy to understand component structure at a glance</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Lesson 4: OOP Origins (Kotlin) */}
      <FullscreenSection id="lesson-4" title="Lesson 4" sectionClassName="mb-16 scroll-mt-24">
        <Card variant="elevated" className="p-8 !bg-white/5 !border-white/10">
          <Stack direction="col" gap="md">
            <div>
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-4">
                Lesson 4
              </div>
              <Heading level={2} className="text-3xl font-bold mb-3 text-white">
                Understanding the Origins: Composition in Object-Oriented Programming
              </Heading>
              <Text className="text-zinc-300 mb-4">
                To truly understand composition, it's valuable to see its origins in object-oriented programming. 
                This lesson explores composition vs inheritance in Kotlin, helping us understand the fundamental principles.
              </Text>
            </div>

            {/* Simple Behavior Reuse */}
            <div className="mt-6">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                Simple Behavior Reuse
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Let's start with a simple problem: we have two classes with partially similar behavior. 
                Many developers would extract this using inheritance, but composition is often better:
              </Text>
              
              <CodeEditor
                code={`// ❌ Inheritance Approach
abstract class LoaderWithProgressBar {
    fun load() {
        // show progress bar
        action()
        // hide progress bar
    }
    abstract fun action()
}

class ProfileLoader : LoaderWithProgressBar() {
    override fun action() {
        // load profile
    }
}

// ✅ Composition Approach
class ProgressBar {
    fun show() { 
        /* show progress bar */
    }
    fun hide() { 
        /* hide progress bar */
    }
}

class ProfileLoader {
    val progressBar = ProgressBar()
    
    fun load() {
        progressBar.show()
        // load profile
        progressBar.hide()
    }
}

class ImageLoader {
    val progressBar = ProgressBar()
    
    fun load() {
        progressBar.show()
        // load image
        progressBar.hide()
    }
}`}
                language="kotlin"
                readOnly={true}
                height={450}
              />
            </div>

            {/* Multiple Functionalities */}
            <div className="mt-8">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                Multiple Functionalities
              </Heading>
              <Text className="text-zinc-300 mb-4">
                Composition shines when you need to extract multiple pieces of functionality. 
                You can only extend one class, but you can compose many:
              </Text>
              
              <CodeEditor
                code={`class ImageLoader {
    private val progressBar = ProgressBar()
    private val finishedAlert = FinishedAlert()
    
    fun load() {
        progressBar.show()
        // load image
        progressBar.hide()
        finishedAlert.show()
    }
}

// With inheritance, you'd be forced to place both functionalities 
// in a single superclass, leading to complex hierarchies`}
                language="kotlin"
                readOnly={true}
                height={250}
              />
            </div>

            {/* Inheritance Breaks Encapsulation */}
            <div className="mt-8">
              <Heading level={3} className="text-xl font-bold mb-3 text-white">
                Inheritance Breaks Encapsulation
              </Heading>
              <Text className="text-zinc-300 mb-4">
                When we extend a class, we depend not only on how it works from the outside but also on how it is implemented inside. 
                This is why we say that inheritance breaks encapsulation:
              </Text>
              
              <CodeEditor
                code={`// ❌ Inheritance - breaks encapsulation
class CounterSet<T> : HashSet<T>() {
    var elementsAdded: Int = 0
        private set
    
    override fun add(element: T): Boolean {
        elementsAdded++
        return super.add(element)
    }
    
    override fun addAll(elements: Collection<T>): Boolean {
        elementsAdded += elements.size
        return super.addAll(elements)
    }
}

// Problem: HashSet.addAll() uses add() internally, 
// so counter is incremented twice!

// ✅ Composition with Delegation
class CounterSet<T>(
    private val innerSet: MutableSet<T> = mutableSetOf()
) : MutableSet<T> by innerSet {
    
    var elementsAdded: Int = 0
        private set
    
    override fun add(element: T): Boolean {
        elementsAdded++
        return innerSet.add(element)
    }
    
    override fun addAll(elements: Collection<T>): Boolean {
        elementsAdded += elements.size
        return innerSet.addAll(elements)
    }
}

// Now it works correctly!`}
                language="kotlin"
                readOnly={true}
                height={500}
              />
            </div>

            <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded mt-6">
              <Heading level={3} className="text-xl font-bold mb-2 text-orange-200">
                Key Differences
              </Heading>
              <ul className="list-disc list-inside text-zinc-300 space-y-2">
                <li><strong>Composition is more secure:</strong> We depend only on externally observable behavior</li>
                <li><strong>Composition is more flexible:</strong> We can compose many objects, but extend only one class</li>
                <li><strong>Composition is more explicit:</strong> We know exactly where methods come from</li>
                <li><strong>Inheritance gives polymorphic behavior:</strong> But it's constraining - every subclass must be consistent</li>
              </ul>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Summary */}
      <FullscreenSection id="summary" title="Summary" sectionClassName="mb-16 scroll-mt-24">
        <Card variant="elevated" className="p-8 !bg-gradient-to-br !from-purple-500/20 !to-blue-500/20 !border-purple-500/30">
          <Stack direction="col" gap="md">
            <Heading level={2} className="text-3xl font-bold mb-3 text-white">
              Key Takeaways
            </Heading>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Heading level={3} className="text-xl font-bold mb-3 text-purple-200">
                  When to Use Composition
                </Heading>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>When you need to reuse code between components</li>
                  <li>When you want flexible, customizable components</li>
                  <li>When you need multiple "holes" for different content</li>
                  <li>When building generic container components</li>
                </ul>
              </div>
              <div>
                <Heading level={3} className="text-xl font-bold mb-3 text-blue-200">
                  When to Use Inheritance
                </Heading>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>When there's a definite "is a" relationship</li>
                  <li>When building framework base classes (like React.Component)</li>
                  <li>When you need strong polymorphic behavior</li>
                  <li>When all subclasses should pass the same tests</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <Text className="text-zinc-200 text-lg font-medium">
                Remember: In React, composition is almost always the better choice. 
                Use props and composition to build flexible, maintainable components that can evolve with your application's needs.
              </Text>
            </div>
          </Stack>
        </Card>
      </FullscreenSection>

      {/* Navigation */}
      <div className={styles.navigation}>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="flex flex-col items-start">
              <span className="text-xs opacity-70 font-normal">Previous</span>
              <span className="font-semibold">Back to Blog</span>
            </span>
          </span>
        </ButtonLink>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
          <span className="flex items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="text-xs opacity-70 font-normal">Next</span>
              <span className="font-semibold">More Articles</span>
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
