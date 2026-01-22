"use client";

import { Stack, Heading, Text, ButtonLink } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function RefactoringGuruPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink href={createLocalizedPath("/")} variant="secondary" className="text-xs px-2 py-1 bg-white/10! border-white/20! text-white! hover:bg-white/20!">
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section")} variant="secondary" className="text-xs px-2 py-1 bg-white/10! border-white/20! text-white! hover:bg-white/20!">
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink href={createLocalizedPath("/developer-section/blog")} variant="secondary" className="text-xs px-2 py-1 bg-white/10! border-white/20! text-white! hover:bg-white/20!">
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Refactoring Guru</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            borderRadius: "0.75rem", 
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            🔧
          </div>
          <div>
            <Heading className={styles.title}>
              Refactoring at a Glance
            </Heading>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Comprehensive Guide to Refactoring Techniques and Code Smells
            </Text>
          </div>
        </div>
        <Text className={styles.subtitle}>
          Refactoring is the process of improving existing code without changing its external behaviour. 
          It makes messy code clean and the design simpler. The goal is to fight technical debt and make 
          future development easier and safer. Good refactoring is incremental: small changes followed by 
          tests keep your software working while you improve it.
        </Text>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`} style={{ marginTop: "2rem" }}>
          <Text className={styles.infoText}>
            <strong>Source:</strong> This content is based on Refactoring.Guru, a comprehensive resource for refactoring techniques, 
            design patterns, SOLID principles, and code smells. Learn more at{" "}
            <a href="https://refactoring.guru" target="_blank" rel="noopener noreferrer" style={{ color: "rgb(168, 85, 247)", textDecoration: "underline" }}>
              refactoring.guru
            </a>
          </Text>
        </div>
      </div>

      {/* Introduction Section */}
      <section className={styles.section} id="introduction">
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Refactoring at a Glance
              </Heading>
              <Text className={styles.sectionDescription}>
                Refactoring is the process of improving existing code without changing its external behaviour. 
                It makes messy code clean and the design simpler. The goal is to fight technical debt and make 
                future development easier and safer. Good refactoring is incremental: small changes followed by 
                tests keep your software working while you improve it.
              </Text>
            </div>
            <div style={{ 
              marginTop: "2rem", 
              borderRadius: "0.75rem", 
              overflow: "hidden", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}>
              <img
                src="https://refactoring.guru/images/refactoring/content/refactoring-3x.png"
                alt="Refactoring conveyor illustration"
                style={{ width: "100%", maxWidth: "100%", height: "auto", display: "block" }}
                loading="lazy"
              />
            </div>
          </Stack>
        </div>
      </section>

      {/* Catalog of Refactoring Section */}
      <section className={styles.section} id="catalog-of-refactoring">
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Catalog of Refactoring
              </Heading>
              <Text className={styles.sectionDescription}>
                The catalog groups code smells and refactoring techniques. Smells describe problems in your code; 
                techniques describe the steps to eliminate those problems. Below is an overview of each group 
                and the individual items it contains.
              </Text>
            </div>

            {/* Code Smells */}
            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                Code Smells
              </Heading>
              <Text className={styles.sectionDescription}>
                Code smells highlight recurring patterns of bad design or coding practices. While they don't 
                necessarily indicate bugs, they often signal deeper problems. Here are the main categories:
              </Text>

              <div style={{ display: "grid", gap: "2rem", marginTop: "2rem" }}>
                {/* Bloaters */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/bloaters.png?id=32a44a371122874ebd1e8a2cbb9202b9"
                      alt="Bloaters illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Bloaters
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        Bloaters are methods and classes that have grown so large that they are hard to maintain. 
                        They accumulate over time when no one tackles the excess.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Long Method</li>
                        <li>Large Class</li>
                        <li>Primitive Obsession</li>
                        <li>Long Parameter List</li>
                        <li>Data Clumps</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Object-Orientation Abusers */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/oo-abusers.png?id=dee31050499d8d6b5a2d5b2e84e68cc8"
                      alt="Object‑orientation abusers illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Object‑Orientation Abusers
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        These smells stem from incomplete or incorrect application of object‑oriented principles.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Alternative Classes with Different Interfaces</li>
                        <li>Refused Bequest</li>
                        <li>Switch Statements</li>
                        <li>Temporary Field</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Change Preventers */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/change-preventers.png?id=db5f332e55fd4b993e15c419baf1db41"
                      alt="Change preventers illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Change Preventers
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        These smells mean that making a change in one place requires changes in many other places, 
                        which makes modifications expensive.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Divergent Change</li>
                        <li>Parallel Inheritance Hierarchies</li>
                        <li>Shotgun Surgery</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dispensables */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/dispensables.png?id=b1072dc9efcf8c0374ddbd7e0b8d496f"
                      alt="Dispensables illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Dispensables
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        Dispensables are pointless pieces of code whose absence would make the program cleaner 
                        and easier to understand.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Comments</li>
                        <li>Duplicate Code</li>
                        <li>Data Class</li>
                        <li>Dead Code</li>
                        <li>Lazy Class</li>
                        <li>Speculative Generality</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Couplers */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/couplers.png?id=1a0e96c005372053d5823ccb5282ae7d"
                      alt="Couplers illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Couplers
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        Smells in this group indicate excessive coupling between classes or misuse of delegation.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Feature Envy</li>
                        <li>Inappropriate Intimacy</li>
                        <li>Message Chains</li>
                        <li>Middle Man</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Other Smells */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                    Other Smells
                  </Heading>
                  <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                    Additional smells that don't fit neatly into the above groups.
                  </Text>
                  <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                    <li>Incomplete Library Class</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Refactoring Techniques */}
            <div style={{ marginTop: "3rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                Refactoring Techniques
              </Heading>
              <Text className={styles.sectionDescription}>
                Refactoring techniques describe how to transform code to remove a smell or improve design. 
                They are organised into thematic groups:
              </Text>

              <div style={{ display: "grid", gap: "2rem", marginTop: "2rem" }}>
                {/* Composing Methods */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/composing-methods.png?id=953854e802753495812cb9b2686765f7"
                      alt="Composing methods illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Composing Methods
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        These techniques help to break down long, complex methods into smaller, more readable 
                        pieces and remove duplication.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Extract Method</li>
                        <li>Inline Method</li>
                        <li>Extract Variable</li>
                        <li>Inline Temp</li>
                        <li>Replace Temp with Query</li>
                        <li>Split Temporary Variable</li>
                        <li>Remove Assignments to Parameters</li>
                        <li>Replace Method with Method Object</li>
                        <li>Substitute Algorithm</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Moving Features between Objects */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/moving-features-between-objects.png?id=8ba49e26381112792e32172edf220524"
                      alt="Moving features between objects illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Moving Features between Objects
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        When functionality is poorly distributed among classes, these techniques help move 
                        behaviour and data to where it belongs.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Move Method</li>
                        <li>Move Field</li>
                        <li>Extract Class</li>
                        <li>Inline Class</li>
                        <li>Hide Delegate</li>
                        <li>Remove Middle Man</li>
                        <li>Introduce Foreign Method</li>
                        <li>Introduce Local Extension</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Organizing Data */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/organizing-data.png?id=0be19b5980545dccb976d377ec731d30"
                      alt="Organizing data illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Organizing Data
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        These refactorings help replace primitive data structures with richer objects and clean 
                        up class relationships.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Change Value to Reference</li>
                        <li>Change Reference to Value</li>
                        <li>Duplicate Observed Data</li>
                        <li>Self Encapsulate Field</li>
                        <li>Replace Data Value with Object</li>
                        <li>Replace Array with Object</li>
                        <li>Change Unidirectional Association to Bidirectional</li>
                        <li>Change Bidirectional Association to Unidirectional</li>
                        <li>Encapsulate Field</li>
                        <li>Encapsulate Collection</li>
                        <li>Replace Magic Number with Symbolic Constant</li>
                        <li>Replace Type Code with Class</li>
                        <li>Replace Type Code with Subclasses</li>
                        <li>Replace Type Code with State/Strategy</li>
                        <li>Replace Subclass with Fields</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Simplifying Conditional Expressions */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/simplifying-conditional-expressions.png?id=a551572d527946cd03b647098b67776d"
                      alt="Simplifying conditional expressions illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Simplifying Conditional Expressions
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        Conditionals often become tangled over time. These techniques simplify complex logic.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Consolidate Conditional Expression</li>
                        <li>Consolidate Duplicate Conditional Fragments</li>
                        <li>Decompose Conditional</li>
                        <li>Replace Conditional with Polymorphism</li>
                        <li>Remove Control Flag</li>
                        <li>Replace Nested Conditional with Guard Clauses</li>
                        <li>Introduce Null Object</li>
                        <li>Introduce Assertion</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Simplifying Method Calls */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/simplifying-method-calls.png?id=0af0ac74a5d0d7f8ac33a58b4a479ee6"
                      alt="Simplifying method calls illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Simplifying Method Calls
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        These refactorings reduce the complexity of method signatures and make calls easier to understand.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Add Parameter</li>
                        <li>Remove Parameter</li>
                        <li>Rename Method</li>
                        <li>Separate Query from Modifier</li>
                        <li>Parameterize Method</li>
                        <li>Introduce Parameter Object</li>
                        <li>Preserve Whole Object</li>
                        <li>Remove Setting Method</li>
                        <li>Replace Parameter with Explicit Methods</li>
                        <li>Replace Parameter with Method Call</li>
                        <li>Hide Method</li>
                        <li>Replace Constructor with Factory Method</li>
                        <li>Replace Error Code with Exception</li>
                        <li>Replace Exception with Test</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Dealing with Generalization */}
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem"
                }}>
                  <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                    <img
                      src="https://refactoring.guru/images/refactoring/content/catalog/dealing-with-generalization.png?id=56357b115153175b2eb40563d936087c"
                      alt="Dealing with generalization illustration"
                      style={{ width: "80px", height: "auto", flexShrink: 0 }}
                      loading="lazy"
                    />
                    <div style={{ flex: 1 }}>
                      <Heading level={4} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                        Dealing with Generalization
                      </Heading>
                      <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                        Abstraction and inheritance require careful management. These refactorings adjust hierarchies 
                        and relationships.
                      </Text>
                      <ul style={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.8", paddingLeft: "1.5rem" }}>
                        <li>Pull Up Field</li>
                        <li>Pull Up Method</li>
                        <li>Pull Up Constructor Body</li>
                        <li>Push Down Field</li>
                        <li>Push Down Method</li>
                        <li>Extract Subclass</li>
                        <li>Extract Superclass</li>
                        <li>Extract Interface</li>
                        <li>Collapse Hierarchy</li>
                        <li>Form Template Method</li>
                        <li>Replace Inheritance with Delegation</li>
                        <li>Replace Delegation with Inheritance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </section>

      {/* Clean Code Section */}
      <section className={styles.section} id="clean-code">
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Clean Code
              </Heading>
              <Text className={styles.sectionDescription}>
                The main purpose of refactoring is to fight technical debt. It transforms a mess into clean code 
                and simple design.
              </Text>
              <Text className={styles.sectionDescription} style={{ marginTop: "1rem" }}>
                Nice! But what's clean code, anyway? Here are some of its features:
              </Text>
            </div>

            <div style={{ marginTop: "1.5rem", display: "grid", gap: "1.5rem" }}>
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "0.75rem",
                borderLeft: "4px solid rgb(34, 197, 94)"
              }}>
                <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                  <strong>Clean code is obvious for other programmers.</strong> Poor variable naming, bloated classes 
                  and methods and magic numbers all make code sloppy and difficult to grasp.
                </Text>
              </div>

              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "0.75rem",
                borderLeft: "4px solid rgb(34, 197, 94)"
              }}>
                <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                  <strong>Clean code doesn't contain duplication.</strong> Each time you need to change duplicate code 
                  you must repeat the change everywhere. This increases cognitive load and slows down progress.
                </Text>
              </div>

              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "0.75rem",
                borderLeft: "4px solid rgb(34, 197, 94)"
              }}>
                <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                  <strong>Clean code contains a minimal number of classes and other moving parts.</strong> Less code 
                  means less to keep in your head, lower maintenance cost and fewer bugs.
                </Text>
              </div>

              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "0.75rem",
                borderLeft: "4px solid rgb(34, 197, 94)"
              }}>
                <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                  <strong>Clean code passes all tests.</strong> You know your code is dirty when only 95% of your 
                  tests pass. You're truly in trouble when your test coverage is zero.
                </Text>
              </div>

              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "0.75rem",
                borderLeft: "4px solid rgb(34, 197, 94)"
              }}>
                <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                  <strong>Clean code is easier and cheaper to maintain</strong>
                </Text>
              </div>
            </div>
          </Stack>
        </div>
      </section>

      {/* Technical Debt Section */}
      <section className={styles.section} id="technical-debt">
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Technical Debt
              </Heading>
              <Text className={styles.sectionDescription}>
                Everyone does their best to write excellent code from scratch. There probably isn't a programmer 
                out there who intentionally writes unclean code to the detriment of the project. But at what point 
                does clean code become unclean? The metaphor of "technical debt" was originally suggested by Ward 
                Cunningham: borrowing time by cutting corners is like taking a loan – you pay interest later when 
                the debt slows development down.
              </Text>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                Causes of Technical Debt
              </Heading>
              <div style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Business pressure.</strong> Sometimes business circumstances force you to roll out 
                    features before they're finished. Patches and kludges appear to hide the unfinished parts 
                    of the project.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Lack of understanding of the consequences.</strong> When management doesn't understand 
                    that debt accumulates interest it becomes difficult to allocate time for refactoring.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Failing to combat strict coherence.</strong> A monolithic project makes any change 
                    affect many parts. Team work becomes hard because individual work isn't isolated.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Lack of tests.</strong> Absence of immediate feedback encourages quick but risky 
                    workarounds. In worst cases hot‑fixes are deployed into production without any prior testing.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Lack of documentation.</strong> Poor docs slow down the onboarding of new people and 
                    can grind development to a halt if key people leave the project.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Lack of interaction between team members.</strong> When the knowledge base isn't 
                    distributed across the company people work with outdated understanding of processes and systems.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Long‑term simultaneous development in several branches.</strong> The more changes made 
                    in isolation the greater the total debt when those changes are merged.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Delayed refactoring.</strong> Requirements change over time. Old code becomes obsolete 
                    and must be redesigned. Meanwhile new code depends on the obsolete parts. The longer you wait 
                    the more dependent code has to be reworked later.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Lack of compliance monitoring.</strong> When everyone writes code as they see fit the 
                    project deteriorates.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.25rem", 
                  backgroundColor: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.5rem"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>Incompetence.</strong> Sometimes developers simply don't know how to write decent code.
                  </Text>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </section>

      {/* When to Refactor Section */}
      <section className={styles.section} id="when-to-refactor">
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                When to Refactor
              </Heading>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                Rule of Three
              </Heading>
              <div style={{ 
                marginTop: "1.5rem", 
                marginBottom: "2rem", 
                borderRadius: "0.75rem", 
                overflow: "hidden", 
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}>
                <img 
                  src="https://refactoring.guru/images/refactoring/content/pages/r1.svg?id=0a20f72cdd91691d0e6b29f2c5519e4c" 
                  alt="Rule of Three illustration" 
                  style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto" }}
                  loading="lazy"
                />
              </div>
              <ol style={{ color: "rgba(255, 255, 255, 0.9)", lineHeight: "2", paddingLeft: "1.5rem", fontSize: "1.0625rem" }}>
                <li>When you're doing something for the first time, just get it done</li>
                <li>When you're doing something similar for the second time, cringe at having to repeat but do the same thing anyway</li>
                <li>When you're doing something for the third time, start refactoring</li>
              </ol>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                When Adding a Feature
              </Heading>
              <div style={{ 
                marginTop: "1.5rem", 
                marginBottom: "2rem", 
                borderRadius: "0.75rem", 
                overflow: "hidden", 
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}>
                <img 
                  src="https://refactoring.guru/images/refactoring/content/pages/r2.svg?id=5b3806c58901d111cee12fb60df9e0ac" 
                  alt="When adding a feature illustration" 
                  style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto" }}
                  loading="lazy"
                />
              </div>
              <ul style={{ color: "rgba(255, 255, 255, 0.9)", lineHeight: "2", paddingLeft: "1.5rem", fontSize: "1.0625rem" }}>
                <li>
                  Refactoring helps you understand other people's code. If you have to deal with someone else's 
                  dirty code try to refactor it first. Clean code is much easier to grasp. You will improve it 
                  not only for yourself but also for those who will use it after you.
                </li>
                <li>
                  Refactoring makes it easier to add new features. It's much easier to make changes in clean code.
                </li>
              </ul>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                When Fixing a Bug
              </Heading>
              <div style={{ 
                marginTop: "1.5rem", 
                marginBottom: "2rem", 
                borderRadius: "0.75rem", 
                overflow: "hidden", 
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}>
                <img 
                  src="https://refactoring.guru/images/refactoring/content/pages/r3.svg?id=b3ab8426bd85943ecedccbaf02181342" 
                  alt="When fixing a bug illustration" 
                  style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto" }}
                  loading="lazy"
                />
              </div>
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", lineHeight: "1.8", fontSize: "1.0625rem" }}>
                Bugs in code behave just like those in real life: they live in the darkest, dirtiest places. 
                Clean your code and the errors will practically discover themselves. Managers appreciate proactive 
                refactoring because it eliminates the need for special refactoring tasks later. Happy bosses make 
                happy programmers.
              </Text>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                During a Code Review
              </Heading>
              <div style={{ 
                marginTop: "1.5rem", 
                marginBottom: "2rem", 
                borderRadius: "0.75rem", 
                overflow: "hidden", 
                border: "1px solid rgba(255, 255, 255, 0.1)", 
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              }}>
                <img 
                  src="https://refactoring.guru/images/refactoring/content/pages/r4.svg?id=68c5945ac20e360e480c1254ac94be82" 
                  alt="During a code review illustration" 
                  style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto" }}
                  loading="lazy"
                />
              </div>
              <Text style={{ color: "rgba(255, 255, 255, 0.9)", lineHeight: "1.8", fontSize: "1.0625rem" }}>
                The code review may be the last chance to tidy up the code before it becomes available to the 
                public. It's best to perform such reviews in a pair with the author. That way you can fix simple 
                problems quickly and gauge the effort required for the more difficult ones.
              </Text>
            </div>
          </Stack>
        </div>
      </section>

      {/* How to Refactor Section */}
      <section className={styles.section} id="how-to-refactor">
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                How to Refactor
              </Heading>
              <Text className={styles.sectionDescription}>
                Refactoring should be done as a series of small changes, each of which makes the existing code 
                slightly better while still leaving the program in working order.
              </Text>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Heading level={3} className={styles.categoryTitle}>
                Checklist of Refactoring Done the Right Way
              </Heading>
              <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(34, 197, 94, 0.1)", 
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "0.75rem",
                  borderLeft: "4px solid rgb(34, 197, 94)"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>The code should become cleaner.</strong> If the code remains just as unclean after 
                    refactoring you've wasted your time. This often happens when you bundle many refactorings 
                    into one big change. In extremely sloppy code it may be better to rewrite parts entirely 
                    after writing tests and allocating sufficient time.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(34, 197, 94, 0.1)", 
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "0.75rem",
                  borderLeft: "4px solid rgb(34, 197, 94)"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>New functionality shouldn't be created during refactoring.</strong> Don't mix 
                    refactoring and the development of new features. Separate these processes at least within 
                    individual commits.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(34, 197, 94, 0.1)", 
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  borderRadius: "0.75rem",
                  borderLeft: "4px solid rgb(34, 197, 94)"
                }}>
                  <Text style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.8" }}>
                    <strong>All existing tests must pass after refactoring.</strong> Tests can fail because you 
                    made an error during refactoring or because the tests were too low‑level. In the latter case 
                    refactor the tests or write higher‑level tests. Behaviour‑driven development (BDD)–style tests 
                    help avoid this situation.
                  </Text>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </section>

      {/* Refused Bequest Specific Section - Example */}
      <section className={styles.section} id="refused-bequest-example">
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Example: Refused Bequest
              </Heading>
              <Text className={styles.sectionDescription}>
                Let's explore a specific code smell example: Refused Bequest. If a subclass uses only some of the 
                methods and properties inherited from its parents, the hierarchy is off-kilter. The unneeded methods 
                may simply go unused or be redefined and give off exceptions.
              </Text>
            </div>
          </Stack>
        </div>
      </section>

      {/* Signs and Symptoms Section */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Signs and Symptoms
              </Heading>
              <Text className={styles.sectionDescription}>
                If a subclass uses only some of the methods and properties inherited from its parents, the hierarchy is off-kilter. 
                The unneeded methods may simply go unused or be redefined and give off exceptions.
              </Text>
            </div>
            
            <div style={{ 
              marginTop: "2rem", 
              borderRadius: "0.75rem", 
              overflow: "hidden", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}>
              <img
                src="https://refactoring.guru/images/refactoring/content/smells/refused-bequest-01.png"
                alt="Refused Bequest - Signs and Symptoms"
                style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto" }}
                loading="lazy"
              />
            </div>

            <div style={{ 
              marginTop: "1.5rem", 
              padding: "1.25rem", 
              backgroundColor: "rgba(239, 68, 68, 0.1)", 
              borderLeft: "4px solid rgb(239, 68, 68)",
              borderRadius: "0.5rem"
            }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.95)", fontSize: "0.9375rem", lineHeight: "1.7" }}>
                <strong>⚠️ Warning Signs:</strong> When you see a subclass that overrides many parent methods with empty implementations, 
                throws exceptions in overridden methods, or only uses a small fraction of inherited functionality, you're likely dealing 
                with a Refused Bequest code smell.
              </Text>
            </div>
          </Stack>
        </div>
      </section>

      {/* Reasons for the Problem Section */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Reasons for the Problem
              </Heading>
              <Text className={styles.sectionDescription}>
                Someone was motivated to create inheritance between classes only by the desire to reuse the code in a superclass. 
                But the superclass and subclass are completely different.
              </Text>
            </div>

            <div style={{ 
              marginTop: "2rem", 
              borderRadius: "0.75rem", 
              overflow: "hidden", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}>
              <img
                src="https://refactoring.guru/images/refactoring/content/smells/refused-bequest-02.png"
                alt="Refused Bequest - Reasons for the Problem"
                style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto" }}
                loading="lazy"
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <div style={{ 
                display: "grid", 
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
              }}>
                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(59, 130, 246, 0.1)", 
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "0.5rem"
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🎯</div>
                  <Heading level={4} style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "rgba(255, 255, 255, 0.95)" }}>
                    Code Reuse Motivation
                  </Heading>
                  <Text style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.85)" }}>
                    Inheritance was created primarily to reuse code, not because there's a true "is-a" relationship between classes.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(249, 115, 22, 0.1)", 
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                  borderRadius: "0.5rem"
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🔀</div>
                  <Heading level={4} style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "rgba(255, 255, 255, 0.95)" }}>
                    Conceptual Mismatch
                  </Heading>
                  <Text style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.85)" }}>
                    The superclass and subclass represent different concepts, making the inheritance relationship semantically incorrect.
                  </Text>
                </div>

                <div style={{ 
                  padding: "1.5rem", 
                  backgroundColor: "rgba(168, 85, 247, 0.1)", 
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "0.5rem"
                }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>📦</div>
                  <Heading level={4} style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "rgba(255, 255, 255, 0.95)" }}>
                    Over-Inheritance
                  </Heading>
                  <Text style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.85)" }}>
                    Too much functionality is inherited, but only a small portion is actually needed by the subclass.
                  </Text>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </section>

      {/* Treatment Section */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Treatment
              </Heading>
              <Text className={styles.sectionDescription}>
                There are two main approaches to fix the Refused Bequest code smell, depending on whether inheritance makes sense 
                in your specific case.
              </Text>
            </div>

            <div style={{ 
              marginTop: "2rem", 
              borderRadius: "0.75rem", 
              overflow: "hidden", 
              border: "1px solid rgba(255, 255, 255, 0.1)", 
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            }}>
              <img
                src="https://refactoring.guru/images/refactoring/content/smells/refused-bequest-03.png"
                alt="Refused Bequest - Treatment"
                style={{ width: "100%", maxWidth: "800px", height: "auto", display: "block", margin: "0 auto" }}
                loading="lazy"
              />
            </div>

            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Solution 1 */}
              <div style={{ 
                padding: "2rem", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "0.75rem",
                borderLeft: "4px solid rgb(34, 197, 94)"
              }}>
                <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "0.5rem", 
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    flexShrink: 0
                  }}>
                    1️⃣
                  </div>
                  <div style={{ flex: 1 }}>
                    <Heading level={3} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                      Replace Inheritance with Delegation
                    </Heading>
                    <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                      If inheritance makes no sense and the subclass really does have nothing in common with the superclass, 
                      eliminate inheritance in favor of <strong>Replace Inheritance with Delegation</strong>.
                    </Text>
                    <div style={{ 
                      padding: "1rem", 
                      backgroundColor: "rgba(0, 0, 0, 0.2)", 
                      borderRadius: "0.5rem",
                      marginTop: "1rem"
                    }}>
                      <Text style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)", fontStyle: "italic" }}>
                        💡 <strong>When to use:</strong> When the classes are conceptually different and inheritance was only used for code reuse. 
                        Delegation provides a cleaner, more explicit relationship.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution 2 */}
              <div style={{ 
                padding: "2rem", 
                backgroundColor: "rgba(59, 130, 246, 0.1)", 
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "0.75rem",
                borderLeft: "4px solid rgb(59, 130, 246)"
              }}>
                <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "0.5rem", 
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    flexShrink: 0
                  }}>
                    2️⃣
                  </div>
                  <div style={{ flex: 1 }}>
                    <Heading level={3} style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                      Extract Superclass
                    </Heading>
                    <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", marginBottom: "1rem" }}>
                      If inheritance is appropriate, get rid of unneeded fields and methods in the subclass. Extract all fields and 
                      methods needed by the subclass from the parent class, put them in a new superclass, and set both classes to 
                      inherit from it (<strong>Extract Superclass</strong>).
                    </Text>
                    <div style={{ 
                      padding: "1rem", 
                      backgroundColor: "rgba(0, 0, 0, 0.2)", 
                      borderRadius: "0.5rem",
                      marginTop: "1rem"
                    }}>
                      <Text style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)", fontStyle: "italic" }}>
                        💡 <strong>When to use:</strong> When there is a legitimate inheritance relationship, but the current hierarchy 
                        includes too much unnecessary functionality. Create a more focused common ancestor.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference Table */}
            <div style={{ marginTop: "2.5rem" }}>
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "rgba(255, 255, 255, 0.03)", 
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "0.75rem"
              }}>
                <Heading level={3} style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem", color: "rgba(255, 255, 255, 0.95)" }}>
                  Decision Matrix
                </Heading>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", padding: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem" }}>
                    <Text style={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)" }}>Classes are conceptually different</Text>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>→ Use <strong>Replace Inheritance with Delegation</strong></Text>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", padding: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "0.5rem" }}>
                    <Text style={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)" }}>Inheritance is appropriate but too broad</Text>
                    <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>→ Use <strong>Extract Superclass</strong></Text>
                  </div>
                </div>
              </div>
            </div>
          </Stack>
        </div>
      </section>

      {/* Payoff Section */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                Payoff
              </Heading>
              <Text className={styles.sectionDescription}>
                Fixing the Refused Bequest code smell brings significant benefits to your codebase's clarity and maintainability.
              </Text>
            </div>

            <div style={{ 
              marginTop: "2rem",
              display: "grid",
              gap: "1.5rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
            }}>
              <div style={{ 
                padding: "2rem", 
                backgroundColor: "rgba(168, 85, 247, 0.1)", 
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "0.75rem",
                borderTop: "4px solid rgb(168, 85, 247)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✨</div>
                <Heading level={3} style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                  Improved Code Clarity
                </Heading>
                <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", fontSize: "0.9375rem" }}>
                  You will no longer have to wonder why the <code style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.3)", 
                    padding: "0.125rem 0.375rem", 
                    borderRadius: "0.25rem",
                    fontSize: "0.875rem"
                  }}>Dog</code> class is inherited from the <code style={{ 
                    backgroundColor: "rgba(0, 0, 0, 0.3)", 
                    padding: "0.125rem 0.375rem", 
                    borderRadius: "0.25rem",
                    fontSize: "0.875rem"
                  }}>Chair</code> class (even though they both have 4 legs).
                </Text>
              </div>

              <div style={{ 
                padding: "2rem", 
                backgroundColor: "rgba(34, 197, 94, 0.1)", 
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "0.75rem",
                borderTop: "4px solid rgb(34, 197, 94)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏗️</div>
                <Heading level={3} style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                  Better Organization
                </Heading>
                <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", fontSize: "0.9375rem" }}>
                  Class hierarchies become more logical and easier to understand. Relationships between classes reflect actual 
                  conceptual relationships rather than just code reuse.
                </Text>
              </div>

              <div style={{ 
                padding: "2rem", 
                backgroundColor: "rgba(59, 130, 246, 0.1)", 
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "0.75rem",
                borderTop: "4px solid rgb(59, 130, 246)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
                <Heading level={3} style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem", color: "rgba(255, 255, 255, 0.95)" }}>
                  Reduced Confusion
                </Heading>
                <Text style={{ color: "rgba(255, 255, 255, 0.85)", lineHeight: "1.7", fontSize: "0.9375rem" }}>
                  Developers won't be confused by inheritance relationships that don't make semantic sense. Code becomes more 
                  intuitive and self-documenting.
                </Text>
              </div>
            </div>

            <div style={{ 
              marginTop: "2rem", 
              padding: "1.5rem", 
              backgroundColor: "rgba(34, 197, 94, 0.1)", 
              borderLeft: "4px solid rgb(34, 197, 94)",
              borderRadius: "0.5rem"
            }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.95)", fontSize: "0.9375rem", lineHeight: "1.7" }}>
                <strong>✅ Key Takeaway:</strong> Proper inheritance should represent an "is-a" relationship, not just a mechanism 
                for code reuse. When you fix Refused Bequest, you're making your code's intent clearer and more maintainable.
              </Text>
            </div>
          </Stack>
        </div>
      </section>

      {/* Related Resources Section */}
      <section className={styles.section}>
        <div className={styles.sectionCard}>
          <Stack direction="col" gap="lg">
            <Heading level={2} className={styles.sectionTitle}>
              Related Resources
            </Heading>
            <Text className={styles.sectionDescription}>
              Explore more about refactoring techniques and code smells from Refactoring.Guru.
            </Text>

            <div style={{ 
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              marginTop: "1.5rem"
            }}>
              <a 
                href="https://refactoring.guru/refactoring" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  padding: "1.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  display: "block"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🔨</div>
                <Heading level={4} style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "rgba(255, 255, 255, 0.95)" }}>
                  Refactoring Catalog
                </Heading>
                <Text style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.8)" }}>
                  Browse the complete catalog of refactoring techniques
                </Text>
              </a>

              <a 
                href="https://refactoring.guru/refactoring/smells" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  padding: "1.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  display: "block"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>👃</div>
                <Heading level={4} style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "rgba(255, 255, 255, 0.95)" }}>
                  Code Smells
                </Heading>
                <Text style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.8)" }}>
                  Learn about all code smells and how to fix them
                </Text>
              </a>

              <a 
                href="https://refactoring.guru/design-patterns" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  padding: "1.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  display: "block"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🧩</div>
                <Heading level={4} style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "rgba(255, 255, 255, 0.95)" }}>
                  Design Patterns
                </Heading>
                <Text style={{ fontSize: "0.875rem", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.8)" }}>
                  Explore design patterns and their implementations
                </Text>
              </a>
            </div>
          </Stack>
        </div>
      </section>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div>
          <Text style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Previous
          </Text>
          <ButtonLink 
            href={createLocalizedPath("/developer-section/blog")} 
            variant="secondary"
            className="bg-white/10! border-white/20! text-white! hover:bg-white/20!"
          >
            ← Back to Blog
          </ButtonLink>
        </div>
        <div style={{ textAlign: "right" }}>
          <Text style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.6)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Next
          </Text>
          <ButtonLink 
            href="https://refactoring.guru/smells/alternative-classes-with-different-interfaces" 
            variant="secondary"
            className="bg-white/10! border-white/20! text-white! hover:bg-white/20!"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alternative Classes with Different Interfaces →
          </ButtonLink>
        </div>
      </nav>
    </BlogContentLayout>
  );
}
