"use client";

import { useState } from "react";
import { Card, Modal, Sidebar } from "@/components/patterns";
import { Stack, Heading, Text, Button, ButtonLink, CodeComparison } from "@/components/ui";

export default function ContainmentPatternPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Stack direction="col" gap="lg" className="mb-12">
          <div>
            <ButtonLink variant="secondary" href="/patterns" className="mb-4 inline-block">
              ← Back to Patterns
            </ButtonLink>
            <Heading className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Containment Pattern
            </Heading>
            <Text size="lg" className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
              The Containment Pattern uses the <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">children</code> prop
              to create flexible wrapper components. Instead of hardcoding content, components accept any children,
              making them highly reusable and composable.
            </Text>
          </div>
        </Stack>

        {/* Example 1: Card Component */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Card Component
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  The Card component provides a styled container but doesn&apos;t care what goes inside.
                  This makes it reusable for any content type.
                </Text>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card variant="default">
                  <Heading level={3} className="text-xl mb-2">Default Card</Heading>
                  <Text size="base">This card accepts any children you want to put inside it.</Text>
                </Card>

                <Card variant="outlined">
                  <Heading level={3} className="text-xl mb-2">Outlined Card</Heading>
                  <Text size="base">Same component, different variant, completely different content.</Text>
                </Card>

                <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
                  <Heading level={3} className="text-xl mb-2">Custom Styled</Heading>
                  <Text size="base">You can even override styles while keeping the base structure.</Text>
                </Card>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Hardcoded content - not reusable
function UserCard() {
  return (
    <div>
      <h3>John Doe</h3>
      <p>john@example.com</p>
      <button>Edit Profile</button>
    </div>
  );
}

// Now you need a different card? Create another component!
function ProductCard() {
  return (
    <div>
      <h3>Product Name</h3>
      <p>$99.99</p>
      <button>Buy Now</button>
    </div>
  );
}`}
                good={`// ✅ GOOD: Accepts children - fully reusable
function Card({ children, variant = "default" }) {
  return (
    <div>
      {children}
    </div>
  );
}

// Now use it for ANY content
<Card variant="default">
  <h3>John Doe</h3>
  <p>john@example.com</p>
  <button>Edit Profile</button>
</Card>

<Card variant="outlined">
  <h3>Product Name</h3>
  <p>$99.99</p>
  <button>Buy Now</button>
</Card>

<Card>
  <p>Any content you want!</p>
</Card>`}
              />
            </Stack>
          </Card>
        </section>

        {/* Example 2: Modal Component */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Modal Component
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  The Modal component manages the overlay and container, but the content is completely flexible.
                  You can use it for confirmation dialogs, forms, or any other content.
                </Text>
              </div>

              <Button onClick={() => setModalOpen(true)} className="w-fit mb-6">
                Open Modal
              </Button>

              <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="md">
                <Stack direction="col" gap="md">
                  <Heading level={2}>Modal Title</Heading>
                  <Text>
                    This modal content is passed as children. The Modal component doesn&apos;t know
                    or care what&apos;s inside - it just provides the backdrop and container.
                  </Text>
                  <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setModalOpen(false)}>
                      Confirm
                    </Button>
                  </div>
                </Stack>
              </Modal>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Hardcoded modal content
function DeleteModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div>
      <div>
        <h2>Delete Item</h2>
        <p>Are you sure you want to delete this item?</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

// Need a different modal? Create another component!
function EditModal({ isOpen, onClose }) {
  // ... duplicate backdrop/container code
}`}
                good={`// ✅ GOOD: Flexible content via children
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Now use it for any content
<Modal isOpen={showDelete} onClose={closeDelete}>
  <h2>Delete Item</h2>
  <p>Are you sure?</p>
  <button onClick={handleDelete}>Delete</button>
</Modal>

<Modal isOpen={showEdit} onClose={closeEdit}>
  <h2>Edit Item</h2>
  <form>
    <input />
    <button>Save</button>
  </form>
</Modal>`}
              />
            </Stack>
          </Card>
        </section>

        {/* Example 3: Sidebar Component */}
        <section className="mb-16">
          <Card variant="elevated" className="p-8">
            <Stack direction="col" gap="md">
              <div>
                <Heading level={2} className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                  Sidebar Component
                </Heading>
                <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Instead of hardcoding navigation items, the Sidebar accepts children for maximum flexibility.
                  Use it for navigation, user profiles, filters, or any sidebar content.
                </Text>
              </div>

              <div className="flex gap-4 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-6">
                <Sidebar>
                  <nav className="space-y-2">
                    <a href="#" className="block px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                      Dashboard
                    </a>
                    <a href="#" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      Projects
                    </a>
                    <a href="#" className="block px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      Settings
                    </a>
                  </nav>
                </Sidebar>
                <div className="flex-1 p-6">
                  <Text>Main content area - the Sidebar doesn&apos;t care what&apos;s here!</Text>
                </div>
              </div>

              <CodeComparison
                language="tsx"
                wrong={`// ❌ WRONG: Hardcoded navigation items
function Sidebar() {
  return (
    <aside>
      <a href="/dashboard">Dashboard</a>
      <a href="/projects">Projects</a>
      <a href="/settings">Settings</a>
    </aside>
  );
}

// Can't reuse this component with different links!
// You'd need to create AdminSidebar, UserSidebar, etc.`}
                good={`// ✅ GOOD: Accepts children - reusable anywhere
function Sidebar({ children }) {
  return (
    <aside>
      {children}
    </aside>
  );
}

// Now use it with any content
<Sidebar>
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/projects">Projects</a>
  </nav>
</Sidebar>

<Sidebar>
  <UserProfile />
  <MenuItems />
  <LogoutButton />
</Sidebar>`}
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

