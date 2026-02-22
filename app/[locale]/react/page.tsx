"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeEditor } from "@/components/ui";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";
import { CommandPaletteProvider } from "@/contexts/CommandPaletteContext";
import CommandPalette from "@/components/Search/CommandPalette";

type Lesson = {
  id: string;
  badge: string;
  tag: "concept" | "practice";
  title: string;
  description: string;
  topicBadges: string[];
  code: string;
};

const LESSONS: Lesson[] = [
  {
    id: "1",
    badge: "Step 1",
    tag: "concept",
    title: "Your first React component",
    description:
      "A component is a function that returns JSX — HTML with the power of JavaScript. Create an AppHeader component that returns an <h1> with \"Dashboard\", then use it in App with <AppHeader />.",
    topicBadges: ["Component", "JSX"],
    code: `function AppHeader() {
  return <h1>Dashboard</h1>;
}

function App() {
  return <AppHeader />;
}

export default App;`,
  },
  {
    id: "2",
    badge: "Step 2",
    tag: "practice",
    title: "Props: passing data into components",
    description:
      "Props are inputs you pass to a component. Use destructuring: function UserGreeting({ name }) { ... }. Create UserGreeting that shows \"Hello, {name}!\" and use it in App with <UserGreeting name=\"Alex\" />.",
    topicBadges: ["Props", "Destructuring"],
    code: `function UserGreeting({ name }) {
  return <h2>Hello, {name}!</h2>;
}

function App() {
  return <UserGreeting name="Alex" />;
}

export default App;`,
  },
  {
    id: "3",
    badge: "Step 3",
    tag: "concept",
    title: "JSX and nesting",
    description:
      "JSX looks like HTML but lives in JavaScript. Wrap multiple elements in a single parent (e.g. <div>) or a React Fragment. Create a Card component that returns a div with a heading and a paragraph inside.",
    topicBadges: ["JSX", "Nesting"],
    code: `function Card() {
  return (
    <div>
      <h3>Card title</h3>
      <p>Content here.</p>
    </div>
  );
}

function App() {
  return <Card />;
}

export default App;`,
  },
  {
    id: "4",
    badge: "Step 4",
    tag: "practice",
    title: "Multiple props",
    description:
      "Destructure several props at once: function ProductRow({ name, price }) { ... }. Create ProductRow that displays \"{name} — {price}\" and use it in App with <ProductRow name=\"Widget\" price=\"$9.99\" />.",
    topicBadges: ["Props", "Destructuring"],
    code: `function ProductRow({ name, price }) {
  return <p>{name} — {price}</p>;
}

function App() {
  return <ProductRow name="Widget" price="$9.99" />;
}

export default App;`,
  },
  {
    id: "5",
    badge: "Step 5",
    tag: "concept",
    title: "className in JSX",
    description:
      "In JSX you use className instead of HTML's class. Create a Highlight component that returns a div with className=\"highlight\" and the text \"Important message\".",
    topicBadges: ["className", "JSX"],
    code: `function Highlight() {
  return <div className="highlight">Important message</div>;
}

function App() {
  return <Highlight />;
}

export default App;`,
  },
  {
    id: "6",
    badge: "Step 6",
    tag: "practice",
    title: "Inline styles",
    description:
      "Pass a JavaScript object to the style prop. Use camelCase: fontSize, not font-size. Create StatusBadge with style={{ color: '#22c55e', fontWeight: 'bold' }} and the text \"Active\".",
    topicBadges: ["style", "JSX"],
    code: `function StatusBadge() {
  return (
    <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
      Active
    </span>
  );
}

function App() {
  return <StatusBadge />;
}

export default App;`,
  },
];

export default function ReactLessonsPage() {
  const { createLocalizedPath } = useLocale();

  return (
    <CommandPaletteProvider>
      <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] via-[#0f172a] to-[#0b0f1a] text-white">
        <DeveloperHeader />
        <CommandPalette />

      <section className="pt-16 pb-8 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heading level={1} className="text-4xl md:text-5xl font-bold mb-4">
            React
          </Heading>
          <Text className="text-zinc-400 text-lg">La habilidad mejor pagada</Text>
          <ButtonLink
            href={createLocalizedPath("/")}
            variant="secondary"
            className="mt-6 inline-block !bg-white/5 !border-white/10 !text-zinc-300 hover:!bg-white/10"
          >
            ← Volver al inicio
          </ButtonLink>
        </div>
      </section>

      <section className="px-4 max-w-4xl mx-auto pb-24">
        <Heading level={2} className="text-2xl font-bold mb-8">
          Lecciones de React
        </Heading>

        <Stack direction="col" gap="xl">
          {LESSONS.map((lesson) => (
            <Card
              key={lesson.id}
              variant="elevated"
              className="p-6 md:p-8 !bg-white/5 !border-white/10"
            >
              <Stack direction="col" gap="md">
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full mb-3">
                    {lesson.badge}
                  </span>
                  <Heading level={2} className="text-xl font-bold mb-2">
                    {lesson.title}
                  </Heading>
                  <Text className="text-zinc-400">{lesson.description}</Text>
                </div>

                <CodeEditor
                  code={lesson.code}
                  language="tsx"
                  readOnly={false}
                  height={280}
                  disableLinting={false}
                  autoInjectImports={true}
                  compactToolbar
                  enableMultiFile={true}
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      </section>

        <Footer />
      </main>
    </CommandPaletteProvider>
  );
}
