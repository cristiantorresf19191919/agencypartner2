"use client";

import { Layout, Card } from "@/components/patterns";
import { Stack, Heading, Text, ButtonLink, CodeComparison } from "@/components/ui";

const useGetUser = () => {
  return { name: "John Doe", email: "john@example.com", avatar: "JD" };
};

export default function SlotPatternPage() {
  // Mock user data for Layout slot pattern demo
  const user = useGetUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/patterns" className="mb-4 inline-block">
              ← Back to Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Slot Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              The Slot Pattern uses named slots (props that accept React elements) to avoid prop drilling.
              Instead of passing data through multiple component layers, you create components where they&apos;re needed
              and pass the complete component to the layout.
            </Text>
          </div>
        </Stack>

        {/* Example: Layout Component */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Layout Component
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Instead of prop drilling (passing user data through Layout → Header → UserAvatar),
                  we use slots. The parent creates components with the data they need and passes them in.
                  The Layout component doesn&apos;t need to know about user data, authentication, or any business logic.
                </Text>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-6">
                <Layout
                  headerSlot={
                    <div className="px-6 py-4 flex items-center justify-between">
                      <h3 className="font-bold text-zinc-900 dark:text-zinc-100">My App</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {user.avatar}
                        </div>
                        <span className="text-zinc-700 dark:text-zinc-300">{user.name}</span>
                      </div>
                    </div>
                  }
                  sidebarSlot={
                    <div className="p-4">
                      <nav className="space-y-2">
                        <a href="#" className="block px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">Home</a>
                        <a href="#" className="block px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">About</a>
                      </nav>
                    </div>
                  }
                  contentSlot={
                    <div>
                      <Heading level={2} className="mb-4">Main Content</Heading>
                      <Text>
                        The Layout component doesn&apos;t know about user data - it just renders the slots we provide.
                        No prop drilling needed!
                      </Text>
                    </div>
                  }
                  footerSlot={
                    <div className="px-6 py-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                      © 2025 My App. All rights reserved.
                    </div>
                  }
                />
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Prop drilling - passing data through components that don't use it
function App({ user }) {
  return <Layout user={user} />;
}

function Layout({ user }) {
  return (
    <div>
      <Header user={user} /> {/* Just passing through */}
      <MainContent />
    </div>
  );
}

function Header({ user }) {
  return (
    <nav>
      <UserAvatar user={user} /> {/* Finally used here */}
    </nav>
  );
}

// Problems:
// - Layout doesn't need 'user' but has to accept it
// - Hard to change structure
// - Components are tightly coupled`}
                good={`// ✅ GOOD: Slot pattern - parent creates components with data
function App({ user }) {
  // Create the header HERE where we have the data
  const header = (
    <Header>
      <UserAvatar user={user} />
    </Header>
  );

  return (
    <Layout
      headerSlot={header}
      contentSlot={<MainContent />}
    />
  );
}

function Layout({ headerSlot, contentSlot }) {
  return (
    <div>
      <header>{headerSlot}</header>
      <main>{contentSlot}</main>
    </div>
  );
}

// Benefits:
// - Layout doesn't know about 'user' at all
// - No prop drilling
// - Easy to rearrange slots
// - Components are decoupled`}
              />
            </Stack>
          </Card>
        </section>

        <div className="text-center">
          <ButtonLink variant="secondary" href="/patterns">
            ← Back to Patterns
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

