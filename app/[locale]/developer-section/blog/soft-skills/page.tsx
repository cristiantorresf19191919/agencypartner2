"use client";

import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import { BlogContentLayout } from "@/components/Layout/BlogContentLayout";
import { useBlogPostContent } from "@/lib/blogTranslations";
import { getCategoryForPost } from "@/lib/blogCategories";
import styles from "../BlogPostPage.module.css";

export default function SoftSkillsPage() {
  const { t, language } = useLanguage();
  const { createLocalizedPath } = useLocale();
  const postContent = useBlogPostContent('soft-skills', language);
  const category = getCategoryForPost("soft-skills");

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
          {category && (
            <>
              <li className={styles.breadcrumbSeparator}>/</li>
              <li>
                <ButtonLink href={createLocalizedPath(`/developer-section/blog/category/${category.slug}`)} variant="secondary" className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  {category.title}
                </ButtonLink>
              </li>
            </>
          )}
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>
            {postContent?.breadcrumbLabel || 'Soft Skills'}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          {postContent?.title || 'Senior Developer Soft Skills & Communication'}
        </Heading>
        <Text className={styles.subtitle}>
          {postContent?.subtitle || 'Master the soft skills that define senior developers. Learn effective communication strategies, the art of asking questions, knowledge sharing, proactivity, accountability, and the mindset that separates senior engineers from the rest. These skills are often more important than technical expertise.'}
        </Text>
      </div>

      {/* The Art of Asking Questions */}
      <section id="asking-questions" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. The Art of Asking Questions
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>The Problem:</strong> Many developers either ask too many questions without context or spend days stuck because they're afraid to ask.
                <br /><br />
                <strong>The Solution:</strong> Master when, how, and who to ask. Senior developers know that asking the right questions at the right time is a superpower.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Principle:</strong> It's not about asking fewer questions—it's about asking better questions. The quality and timing of your questions matter more than the quantity.
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ BAD: Vague, Unprepared Question

"Hey, the API is broken. Can you help?"

# Why this is bad:
- No context about what "broken" means
- No information about what was tried
- No error messages or logs
- Wastes the helper's time
- Shows lack of preparation`}
              good={`# ✅ GOOD: Structured, Context-Rich Question

Subject: API returning 500 errors on user creation endpoint

Hi [Name],

I'm working on the user registration feature and encountering 500 errors 
on POST /api/users. Here's what I've found:

**Context:**
- Endpoint: POST /api/users
- Environment: Staging
- Error started: 2 hours ago

**What I've tried:**
1. Checked API logs - seeing "Database connection timeout"
2. Verified database is up (other endpoints work)
3. Tested with Postman - same error
4. Checked recent deployments - no changes in last 24h

**Error details:**
- Status: 500 Internal Server Error
- Response: {"error": "Connection pool exhausted"}
- Logs: [attached error.log]

**What I need:**
- Is this a known issue?
- Should I check database connection pool settings?
- Any recent infrastructure changes I should be aware of?

Thanks!

# Why this is good:
- Clear subject line
- Context about what's happening
- Shows effort and research
- Specific error information
- Clear ask for help
- Respects the helper's time`}
            />

            <CodeEditor
              code={`// ✅ Question Framework Template

/**
 * Before asking a question, structure it using this framework:
 */

const questionFramework = {
  // 1. WHEN to ask
  timing: {
    askImmediately: [
      'Production issue affecting users',
      'Security concern',
      'Blocking multiple team members',
      'Time-sensitive deadline'
    ],
    researchFirst: [
      'Documentation exists but unclear',
      'Similar issues in codebase',
      'Can be solved with investigation',
      'Non-critical feature'
    ],
    neverAsk: [
      'Answer is in documentation you haven\'t read',
      'Same question asked and answered recently',
      'Can be found with 5-minute search'
    ]
  },

  // 2. HOW to ask
  structure: {
    subject: 'Clear, specific subject line',
    context: {
      what: 'What you\'re working on',
      when: 'When the issue started',
      where: 'Environment, system, component'
    },
    research: {
      tried: 'What you\'ve already attempted',
      found: 'What you discovered',
      references: 'Links to docs, tickets, PRs'
    },
    question: {
      specific: 'Precise question, not vague',
      actionable: 'What you need to move forward',
      options: 'Multiple approaches you\'re considering'
    }
  },

  // 3. WHO to ask
  audience: {
    directOwner: 'When context matters deeply',
    teamChannel: 'For general knowledge sharing',
    asyncDocument: 'For complex, multi-part questions',
    manager: 'For process, priority, or resource questions'
  }
};

// ✅ Example: Technical Question
const technicalQuestion = \`
Subject: React Query cache invalidation strategy for nested data

Hi Team,

I'm implementing a feature where we need to invalidate related 
queries when a parent entity is updated. 

**Context:**
- Using React Query v5
- Data structure: User -> Posts -> Comments (nested)
- When a User is updated, we need to invalidate all related queries

**What I've tried:**
1. Using queryClient.invalidateQueries(['users', userId])
2. This works for user data, but not for nested posts/comments
3. Tried queryClient.invalidateQueries({ predicate: ... }) but 
   performance is slow with large datasets

**Question:**
What's the recommended pattern for invalidating nested query 
relationships in React Query? Should I:
- A) Manually invalidate each nested query type?
- B) Use a custom invalidation strategy?
- C) Restructure the query keys?

**References:**
- React Query docs: [link]
- Similar pattern in UserProfile.tsx: [link]

Thanks!
\`;

// ✅ Example: Process Question
const processQuestion = \`
Subject: Code review process for hotfixes

Hi [Tech Lead],

I need to deploy a critical security fix to production. The standard 
review process usually takes 2-3 days, but this needs to go out today.

**Context:**
- Security vulnerability in authentication flow
- Affects all users
- Fix is ready and tested locally

**What I've done:**
- Created PR with fix
- Added security team as reviewers
- Tested in staging environment
- Documented the vulnerability and fix

**Question:**
What's the process for expedited reviews for security hotfixes?
Should I:
- Request urgent review in PR?
- Escalate to security team directly?
- Use a different deployment process?

**Timeline:**
- Need to deploy within 4 hours
- Standard process won't meet this deadline

Thanks for your guidance!
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Knowledge Sharing */}
      <section id="knowledge-sharing" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. Knowledge Sharing & Documentation
              </Heading>
              <Text className={styles.sectionDescription}>
                Senior developers don't hoard knowledge—they share it. Every question you answer, every problem you solve, is an opportunity to help others.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Knowledge Sharing Strategies

/**
 * 1. Document as you go
 * When you solve a problem, document it immediately
 */

const knowledgeSharingPractices = {
  // Document solutions immediately
  immediateDocumentation: {
    when: 'Right after solving a problem',
    what: 'The problem, solution, and why',
    where: 'Team wiki, README, or code comments',
    format: {
      problem: 'Clear description',
      solution: 'Step-by-step approach',
      context: 'Why this solution works',
      alternatives: 'Other approaches considered',
      references: 'Links to related docs'
    }
  },

  // Enhance existing documentation
  improveDocumentation: {
    action: 'When you find outdated or missing docs, update them',
    value: 'Helps the next person immediately',
    example: \`
      // Found this in onboarding:
      // "Run npm install" - but it was missing setup steps
      
      // Updated to:
      // 1. Install Node.js 18+
      // 2. Run npm install
      // 3. Copy .env.example to .env
      // 4. Run npm run setup:db
    \`
  },

  // Share learnings in team channels
  teamSharing: {
    format: \`
      💡 Learning: [Brief title]
      
      Context: [What you were working on]
      Problem: [What you encountered]
      Solution: [How you solved it]
      Key takeaway: [Main lesson]
      
      Full details: [Link to doc/wiki]
    \`,
    frequency: 'Weekly or when you learn something valuable'
  },

  // Code review as teaching
  codeReviewSharing: {
    approach: 'Explain the "why" not just "what"',
    example: \`
      // Instead of: "Use useMemo here"
      // Say: "Consider useMemo here because this calculation 
      // runs on every render and the inputs rarely change. 
      // This will improve performance for the parent component."
    \`
  }
};

// ✅ Documentation Template
const documentationTemplate = \`# [Feature/Process Name]

## Overview
Brief description of what this covers.

## Prerequisites
- Requirement 1
- Requirement 2

## Step-by-Step Guide

### Step 1: [Action]
\`\`\`
code example
\`\`\`

**Why:** Explanation of why this step matters

### Step 2: [Action]
...

## Common Issues

### Issue: [Description]
**Symptoms:** What you'll see
**Solution:** How to fix it
**Prevention:** How to avoid it

## Related Documentation
- [Link 1]
- [Link 2]

## Last Updated
[Date] by [Name]
\`;

// ✅ Runbook Template (for operations)
const runbookTemplate = \`# [Service Name] Runbook

## Service Overview
- Purpose: [What this service does]
- Owner: [Team/Person]
- On-call: [Rotation schedule]

## Common Operations

### Deploy
1. Check current version: \`git describe --tags\`
2. Run tests: \`npm test\`
3. Deploy: \`./scripts/deploy.sh staging\`
4. Verify: [Health check URL]

### Rollback
1. Identify last known good version
2. \`git checkout [version-tag]\`
3. \`./scripts/deploy.sh production\`

## Troubleshooting

### Issue: High error rate
**Check:**
- CloudWatch metrics
- Application logs
- Database connections

**Fix:**
- [Step-by-step resolution]

## Escalation
- Level 1: [Who to contact]
- Level 2: [Escalation path]
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Communication Strategies */}
      <section id="communication" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Effective Communication Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                Communication has three pillars: Explain, Share Status, and Raise Flags. Master these to become an effective senior developer.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ The Three Pillars of Communication

const communicationPillars = {
  // Pillar 1: EXPLAIN
  explain: {
    principle: 'People don't know what's in your head',
    techniques: {
      startFromBeginning: {
        wrong: 'Starting from the middle of your thought process',
        right: 'Provide context first, then details'
      },
      beConcise: {
        wrong: 'Rambling explanations',
        right: 'Clear, structured, to-the-point'
      },
      useExamples: {
        wrong: 'Abstract concepts only',
        right: 'Concrete examples that illustrate the point'
      },
      checkUnderstanding: {
        wrong: 'Assuming people understood',
        right: 'Ask "Does this make sense?" or "Any questions?"'
      }
    },
    example: \`
      // ❌ BAD: Starting from the middle
      "So the issue is that the cache isn't invalidating properly 
       because of the way we're structuring the keys..."
      
      // ✅ GOOD: Context first
      "I found a bug in our caching layer. Here's the situation:
       1. We cache user data with key: ['user', userId]
       2. When user updates, we invalidate that key
       3. BUT we also have nested queries like ['user', userId, 'posts']
       4. These nested queries aren't being invalidated
       
       The root cause is our query key structure doesn't support 
       hierarchical invalidation. I propose we restructure to use 
       a flat key structure with prefixes.
       
       Does this align with your understanding?"
    \`
  },

  // Pillar 2: SHARE STATUS
  shareStatus: {
    principle: 'Visibility prevents misunderstandings',
    when: [
      'Starting a new task',
      'Making progress',
      'Encountering blockers',
      'Completing work',
      'Changing direction'
    ],
    format: {
      async: \`
        📊 Status Update: [Task Name]
        
        ✅ Completed:
        - [What you finished]
        
        🔄 In Progress:
        - [What you're working on]
        
        ⏭️ Next:
        - [What's coming up]
        
        🚦 Blockers:
        - [Any blockers or dependencies]
        
        📅 ETA: [Expected completion]
      \`,
      sync: 'Brief verbal update in standup or meetings'
    },
    frequency: {
      daily: 'At standup',
      weekly: 'End of week summary',
      onBlockers: 'Immediately when blocked',
      onCompletion: 'When work is done'
    }
  },

  // Pillar 3: RAISE FLAGS
  raiseFlags: {
    principle: 'Early warning saves time and resources',
    when: [
      'Timeline at risk',
      'Technical risk identified',
      'Scope creep detected',
      'Resource constraints',
      'Dependencies delayed'
    ],
    format: \`
      🚩 Flag: [Issue Type]
      
      Issue: [Clear description]
      Impact: [What this affects]
      Timeline: [When this becomes critical]
      Options: [Possible solutions]
      Recommendation: [What you suggest]
      Action Needed: [What you need from others]
    \`,
    example: \`
      🚩 Flag: Timeline Risk
      
      Issue: The authentication refactor is taking longer than 
             estimated due to legacy code dependencies.
      
      Impact: 
      - User management feature delayed by 3 days
      - May affect Q4 release timeline
      
      Timeline: 
      - Current ETA: 5 days (was 2 days)
      - Critical if not resolved by Friday
      
      Options:
      1. Extend timeline (recommended)
      2. Reduce scope (remove some features)
      3. Add another developer
      
      Recommendation: Option 1 - extend timeline to ensure quality
      
      Action Needed: 
      - Product approval for timeline extension
      - Update project plan
    \`
  }
};

// ✅ Communication Templates

// Status Update Template
const statusUpdate = \`
📊 Weekly Status: [Your Name] - Week of [Date]

✅ Completed:
- [Task 1] - [Brief description]
- [Task 2] - [Brief description]

🔄 In Progress:
- [Current Task] - [Status, blockers if any]

⏭️ Next Week:
- [Planned work]

📈 Metrics:
- PRs merged: [number]
- Code reviews: [number]
- Documentation updated: [yes/no]

🚦 Blockers:
- [Any blockers or help needed]
\`;

// Technical Explanation Template
const technicalExplanation = \`
## [Topic/Decision]

### Context
[Why we're discussing this]

### Current State
[What exists now]

### Proposed Change
[What we want to do]

### Why This Approach
[Rationale and benefits]

### Alternatives Considered
1. [Option 1] - [Why not chosen]
2. [Option 2] - [Why not chosen]

### Impact
- Technical: [What changes technically]
- Team: [How this affects the team]
- Timeline: [How long this takes]

### Questions/Concerns
[Open questions for discussion]
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Proactivity & Resourcefulness */}
      <section id="proactivity" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Proactivity & Resourcefulness
              </Heading>
              <Text className={styles.sectionDescription}>
                Senior developers don't wait for solutions—they create them. Being resourceful means taking initiative and knowing how to get things done.
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ REACTIVE: Waiting for Help

**Developer A's Approach:**
- "My environment is broken"
- "Still waiting for someone to fix it" (Day 1)
- "Still waiting..." (Day 2)
- "Still waiting..." (Day 3)

**Problems:**
- No initiative to solve the problem
- Relies entirely on others
- Doesn't document what's wrong
- Doesn't try alternative approaches
- Wastes time for everyone`}
              good={`# ✅ PROACTIVE: Taking Initiative

**Developer B's Approach:**
- "My environment is broken, investigating..."
- "Tried X, Y, Z - still seeing issue"
- "Found similar issue in docs, trying solution..."
- "Fixed! Here's what worked: [solution]"

**Benefits:**
- Shows ownership and initiative
- Documents the problem clearly
- Tries multiple solutions
- Shares solution with team
- Saves time for everyone`}
            />

            <CodeEditor
              code={`// ✅ Resourcefulness Framework

const resourcefulnessPractices = {
  // 1. Try before asking
  selfService: {
    steps: [
      '1. Read the error message carefully',
      '2. Search internal documentation',
      '3. Search codebase for similar patterns',
      '4. Check recent changes/PRs',
      '5. Try common solutions',
      '6. Document what you tried',
      '7. THEN ask for help with context'
    ],
    timeLimit: 'Spend 30-60 minutes researching before asking',
    exception: 'Production issues, security concerns - ask immediately'
  },

  // 2. Build relationships
  networking: {
    why: 'Relationships make solving problems easier',
    how: [
      'Help others when you can',
      'Participate in team discussions',
      'Share knowledge openly',
      'Be approachable and friendly',
      'Remember people's expertise areas'
    ],
    example: \`
      // Instead of cold-asking in channel:
      "Hey @channel, how do I configure X?"
      
      // Build relationship first:
      "Hey Sarah, I remember you worked on X last month. 
       I'm hitting an issue with Y. Do you have 5 minutes 
       to point me in the right direction?"
    \`
  },

  // 3. Use available resources
  leverageResources: {
    internal: [
      'Team documentation',
      'Codebase examples',
      'Previous PRs and discussions',
      'Team knowledge base',
      'Internal Slack channels'
    ],
    external: [
      'Official documentation',
      'Stack Overflow (with critical thinking)',
      'GitHub issues and discussions',
      'Community forums',
      'Technical blogs'
    ],
    criticalThinking: \`
      Don't just copy-paste solutions. Understand:
      - Why the solution works
      - What trade-offs it has
      - If it fits your context
      - If there's a better approach
    \`
  },

  // 4. Create solutions, not just problems
  solutionOriented: {
    approach: 'Always come with potential solutions',
    format: \`
      Problem: [Description]
      
      What I've tried:
      - [Attempt 1]
      - [Attempt 2]
      
      Potential solutions I'm considering:
      1. [Solution A] - Pros: X, Cons: Y
      2. [Solution B] - Pros: X, Cons: Y
      
      Recommendation: [Which one and why]
      
      What I need: [Specific help or decision]
    \`
  }
};

// ✅ Proactive Communication Examples

// Proactive Status Update
const proactiveUpdate = \`
💡 Initiative: I noticed our API response times are slower 
   than usual. I'm investigating and will share findings.

🔍 Investigation:
- Checked CloudWatch metrics - p95 latency up 200ms
- Reviewed recent deployments - no obvious changes
- Checking database query performance next

📅 Update: Will share findings by EOD

💬 Help needed: None right now, but will flag if I find 
   something that needs team attention.
\`;

// Proactive Improvement
const proactiveImprovement = \`
🚀 Improvement Opportunity: I noticed our onboarding docs 
   are missing setup steps for the new database migration tool.

✅ Action taken: I've updated the onboarding guide with:
   - Database setup instructions
   - Migration commands
   - Troubleshooting section

📝 PR: [Link to documentation PR]

💡 Benefit: New team members can set up in 10 minutes 
   instead of 2 hours.
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Setting Expectations & Getting Feedback */}
      <section id="expectations-feedback" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Setting Expectations & Getting Feedback
              </Heading>
              <Text className={styles.sectionDescription}>
                You are the architect of your own career. Take ownership by setting clear expectations and actively seeking feedback.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Career Ownership Framework

const careerOwnership = {
  // Setting Expectations
  setExpectations: {
    withManager: {
      frequency: 'Quarterly or when priorities change',
      topics: [
        'Career goals and growth path',
        'Technical skills to develop',
        'Projects and responsibilities',
        'Performance expectations',
        'Promotion timeline and criteria'
      ],
      format: \`
        📋 Expectations Discussion - [Your Name]
        
        Career Goals:
        - Short-term (3-6 months): [Goals]
        - Long-term (1-2 years): [Goals]
        
        Current Focus Areas:
        1. [Area 1] - [Why it matters]
        2. [Area 2] - [Why it matters]
        
        What I need from you:
        - [Support/Resources needed]
        - [Feedback frequency]
        - [Growth opportunities]
        
        Success Metrics:
        - [How I'll know I'm on track]
      \`
    },
    withTeam: {
      when: 'Starting new projects or taking on responsibilities',
      format: \`
        👋 Setting Expectations: [Project/Responsibility]
        
        My role: [What you're responsible for]
        Timeline: [When things will be done]
        Communication: [How you'll keep team updated]
        Dependencies: [What you need from others]
        Deliverables: [What you'll produce]
      \`
    }
  },

  // Getting Feedback
  getFeedback: {
    frequency: {
      formal: 'Quarterly performance reviews',
      informal: 'After major projects or milestones',
      continuous: 'Regular check-ins with manager'
    },
    howToAsk: {
      specific: \`
        Instead of: "How am I doing?"
        Ask: "What's one thing I could improve in my code reviews?"
      \`,
      actionable: \`
        Instead of: "Am I meeting expectations?"
        Ask: "What specific skills should I focus on to reach 
              the next level?"
      \`,
      timely: \`
        Instead of: Waiting for annual review
        Ask: Right after completing a project or milestone
      \`
    },
    feedbackRequestTemplate: \`
      📝 Feedback Request: [Topic/Project]
      
      Context: [What you worked on]
      Specific areas:
      1. [Area 1] - What could I improve?
      2. [Area 2] - How did I do?
      3. [Area 3] - Any suggestions?
      
      Timeline: [When you need feedback by]
      Format: [Written/Verbal/Async]
    \`
  },

  // Understanding Your Manager
  understandManager: {
    techniques: [
      {
        name: 'Know What They Value',
        how: 'Pay attention to what they praise and prioritize',
        example: 'If they value documentation, make that a strength'
      },
      {
        name: 'Identify Preferences',
        how: 'Notice communication style, meeting preferences, etc.',
        example: 'Do they prefer async updates or regular sync meetings?'
      },
      {
        name: 'Active Listening',
        how: 'Listen for priorities and concerns in meetings',
        example: 'Take notes on what matters to them'
      },
      {
        name: 'Comparative Analysis',
        how: 'Observe how they interact with high performers',
        example: 'What behaviors do they reward?'
      }
    ],
    exercise: \`
      📝 Manager Observation Exercise:
      
      Take notes during management meetings:
      - What do they value?
      - How do they react to different people?
      - What communication style works?
      - What tone gets positive responses?
      - What concerns do they raise?
      
      Use these insights to align your work and communication.
    \`
  }
};

// ✅ Feedback Request Examples

// After a Project
const projectFeedbackRequest = \`
Hi [Manager],

I just completed the authentication refactor project. I'd love 
to get your feedback on a few areas:

1. Technical execution - How was the code quality and 
   architecture decisions?

2. Communication - Did I keep stakeholders informed 
   appropriately?

3. Project management - How did I handle timeline and 
   scope management?

4. Areas for growth - What should I focus on for the next 
   project?

Would you have 15 minutes this week to discuss? I'm also 
happy to receive written feedback if that's easier.

Thanks!
\`;

// Career Growth Discussion
const careerGrowthDiscussion = \`
📋 Career Growth Discussion - [Your Name]

Current Level: Senior Developer
Target Level: Staff Engineer (12-18 months)

Skills to Develop:
1. System design at scale
   - Action: Lead architecture for next major feature
   - Timeline: Q2
   
2. Cross-team collaboration
   - Action: Partner with Product team on roadmap
   - Timeline: Ongoing
   
3. Mentoring
   - Action: Mentor 2 junior developers
   - Timeline: Q1-Q2

What I need:
- Opportunities to lead larger projects
- Feedback on system design work
- Exposure to cross-functional collaboration

Success Metrics:
- Lead architecture for 2+ major features
- Positive feedback from mentees
- Recognition from Product team for collaboration
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Accountability & Ownership */}
      <section id="accountability" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6. Accountability & Ownership
              </Heading>
              <Text className={styles.sectionDescription}>
                Senior developers take ownership of their work, their mistakes, and their growth. Accountability builds trust and demonstrates seniority.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Accountability Practices

const accountabilityFramework = {
  // Own Your Work
  ownership: {
    principles: [
      'Take responsibility for outcomes, not just tasks',
      'Follow through on commitments',
      'Communicate proactively when things change',
      'Fix problems you create',
      'Learn from mistakes'
    ],
    examples: {
      good: \`
        ✅ "I committed to finishing this by Friday. I'm on track, 
            but I found a technical issue that might delay it by 
            a day. Here's my plan to mitigate..."
      \`,
      bad: \`
        ❌ "The deadline was Friday but I couldn't finish because 
            the API was slow. Not my fault."
      \`
    }
  },

  // Own Your Mistakes
  mistakes: {
    approach: {
      acknowledge: 'Admit mistakes quickly and clearly',
      analyze: 'Understand what went wrong and why',
      fix: 'Take action to resolve the issue',
      learn: 'Document learnings to prevent recurrence',
      share: 'Share learnings with team (if appropriate)'
    },
    template: \`
      🚨 Issue Acknowledgment: [What happened]
      
      What happened: [Clear description]
      Impact: [Who/what was affected]
      Root cause: [Why it happened]
      
      Immediate fix: [What's being done now]
      Long-term prevention: [How we'll prevent this]
      
      My responsibility: [What you own]
      Learnings: [What you learned]
    \`
  },

  // Own Your Growth
  growth: {
    selfAssessment: {
      questions: [
        'Am I meeting my commitments?',
        'Am I improving my skills?',
        'Am I contributing to team success?',
        'What feedback have I received?',
        'What should I focus on next?'
      ],
      frequency: 'Monthly self-reflection'
    },
    actionPlan: \`
      📈 Growth Plan - [Your Name]
      
      Strengths:
      - [Strength 1] - [How to leverage]
      - [Strength 2] - [How to leverage]
      
      Areas for Improvement:
      - [Area 1] - [Action plan]
      - [Area 2] - [Action plan]
      
      Goals:
      - [Goal 1] - [Timeline]
      - [Goal 2] - [Timeline]
      
      Support Needed:
      - [What you need from manager/team]
    \`
  }
};

// ✅ Accountability Examples

// Owning a Mistake
const mistakeOwnership = \`
🚨 Issue: Production deployment caused errors

What happened:
I deployed a change that introduced a bug in the payment 
processing flow. The issue was a missing null check that 
I should have caught in code review.

Impact:
- ~50 transactions failed before rollback
- Users saw error messages
- No data loss (transactions were queued)

Root cause:
- Rushed to meet deadline
- Skipped edge case testing
- Didn't get code review from payment team expert

Immediate fix:
✅ Rolled back deployment (completed)
✅ Verified transactions are processing (completed)
✅ Notified affected users (in progress)

Long-term prevention:
- Add integration tests for payment flow
- Require payment team review for payment-related changes
- Add pre-deployment checklist

My responsibility:
I own this mistake and will ensure the prevention measures 
are implemented. I've also scheduled a post-mortem to 
document learnings.

Learnings:
- Never skip testing for "simple" changes
- Always get domain expert review for critical paths
- Better to delay than deploy broken code
\`;

// Owning Your Work
const workOwnership = \`
✅ Project Update: User Authentication Refactor

Status: On track for Friday completion

What I committed to:
- Refactor authentication system
- Update all dependent services
- Write migration guide
- Complete by Friday EOD

Progress:
✅ Core refactor complete
✅ 3/5 services updated
🔄 2 services remaining (on track)
📝 Migration guide in progress

Risks:
- One service has complex dependencies (monitoring)
- Mitigation: Working with service owner directly

Confidence: High - will meet Friday deadline

Next update: Thursday EOD
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Respect in the Workplace */}
      <section id="respect" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                7. Respect in the Workplace
              </Heading>
              <Text className={styles.sectionDescription}>
                Respect extends to services, infrastructure, organization, clients, production environment, and most importantly—yourself, your job, and your time.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Respect Framework

const respectPractices = {
  // Respect for Infrastructure
  infrastructure: {
    principles: [
      'Treat production with extreme care',
      'Follow deployment procedures',
      'Test thoroughly before deploying',
      'Monitor and respond to alerts',
      'Document changes and decisions'
    ],
    examples: {
      production: \`
        ✅ Always:
        - Test in staging first
        - Get approvals for production changes
        - Deploy during low-traffic windows
        - Have rollback plan ready
        - Monitor after deployment
        
        ❌ Never:
        - Deploy untested code to production
        - Skip approval processes
        - Make changes during peak hours
        - Ignore monitoring alerts
      \`
    }
  },

  // Respect for Colleagues
  colleagues: {
    principles: [
      'Value others' time and expertise',
      'Give constructive feedback',
      'Acknowledge good work',
      'Help when you can',
      'Assume positive intent'
    ],
    codeReview: {
      respectful: \`
        ✅ "I see you're using approach X. Have you considered 
            approach Y? It might be more performant for this 
            use case. What do you think?"
      \`,
      disrespectful: \`
        ❌ "This is wrong. You should use Y instead."
      \`
    }
  },

  // Respect for Organization
  organization: {
    principles: [
      'Understand business context',
      'Respect company policies',
      'Represent company well',
      'Protect company assets',
      'Contribute to company success'
    ],
    examples: [
      'Following security policies',
      'Protecting customer data',
      'Respecting intellectual property',
      'Being professional in external communications'
    ]
  },

  // Self-Respect
  selfRespect: {
    principles: [
      'Set healthy boundaries',
      'Say no when appropriate',
      'Take breaks and time off',
      'Advocate for yourself',
      'Maintain work-life balance'
    ],
    boundaries: \`
      ✅ Healthy boundaries:
      - "I can't take on this project right now, but I can 
         help find someone who can."
      - "I need to focus on my current priorities. Can we 
         discuss this next week?"
      - "I'm not available after hours unless it's a 
         production emergency."
      
      ❌ Poor boundaries:
      - Always saying yes to everything
      - Working excessive hours regularly
      - Not taking time off
      - Not advocating for your needs
    \`
  }
};

// ✅ Respectful Communication Examples

// Respectful Disagreement
const respectfulDisagreement = \`
I understand the reasoning behind using library X, and I 
appreciate the research you've done. 

I have some concerns about long-term maintenance:
- Library X hasn't been updated in 2 years
- We'd be the only team using it
- Similar functionality exists in our standard stack

I'd like to propose we explore option Y, which aligns with 
our tech stack and has active maintenance. 

What do you think? I'm open to discussing the trade-offs.
\`;

// Respectful Feedback
const respectfulFeedback = \`
Thanks for the PR! I really like how you've structured the 
components.

I noticed a few areas we could improve:
1. The error handling could be more specific
2. We might want to add loading states
3. Consider extracting the API call to a custom hook

These are suggestions - happy to discuss if you have 
different thoughts. Overall, great work on this feature!
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Holding Off Judgment */}
      <section id="judgment" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                8. Holding Off Judgment
              </Heading>
              <Text className={styles.sectionDescription}>
                Understand the history and context before challenging the status quo. Senior developers ask "why" before suggesting "how to improve."
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ IMMEDIATE JUDGMENT

**New Developer's Approach:**
- "This code is terrible, we should rewrite it"
- "Why are we using this old library?"
- "This architecture doesn't make sense"
- "We should do it my way"

**Problems:**
- Doesn't understand historical context
- Doesn't know constraints that existed
- Comes across as arrogant
- Damages relationships
- May suggest worse solutions`}
              good={`# ✅ UNDERSTAND FIRST, THEN CHALLENGE

**Senior Developer's Approach:**
- "I'm curious about the history of this codebase..."
- "What constraints existed when this was built?"
- "I'd like to understand the reasoning before suggesting changes"
- "After learning more, here's what I think we could improve..."

**Benefits:**
- Gains respect and trust
- Understands full context
- Makes better suggestions
- Builds relationships
- Creates collaborative environment`}
            />

            <CodeEditor
              code={`// ✅ Context-Gathering Framework

const contextGathering = {
  // Questions to Ask Before Judging
  questions: [
    'What was the original requirement?',
    'What constraints existed at the time?',
    'Who made this decision and why?',
    'What alternatives were considered?',
    'What has changed since then?',
    'What would break if we changed this?',
    'What's the cost/benefit of changing?'
  ],

  // Process
  process: {
    step1: 'Observe and learn (first 30-90 days)',
    step2: 'Ask questions to understand context',
    step3: 'Build relationships with team',
    step4: 'Understand business constraints',
    step5: 'Then propose improvements respectfully'
  },

  // Respectful Challenge Template
  challengeTemplate: \`
    💭 Improvement Suggestion: [Topic]
    
    Current approach: [What exists now]
    
    Context I've gathered:
    - [Historical context 1]
    - [Constraint that existed]
    - [Reasoning I understand]
    
    What's changed:
    - [New constraint removed]
    - [New technology available]
    - [New business requirement]
    
    Proposed improvement:
    - [What could be better]
    - [Why now is a good time]
    - [How to implement]
    
    Trade-offs:
    - Pros: [Benefits]
    - Cons: [Costs/risks]
    
    Open to discussion and feedback!
  \`
};

// ✅ Examples

// Understanding Legacy Code
const legacyCodeApproach = \`
Instead of: "This code is a mess, we need to rewrite it"

Try: "I'm working on understanding this codebase. I noticed 
      this module uses patterns that seem outdated. Can 
      someone help me understand:
      - What the original requirements were?
      - What constraints existed when this was built?
      - Why this approach was chosen?
      
      I'm asking because I want to propose improvements, 
      but I want to make sure I understand the full context 
      first."
\`;

// Understanding Architecture Decisions
const architectureApproach = \`
Instead of: "This architecture doesn't scale, we should 
            use microservices"

Try: "I've been learning about our current architecture. 
      It's a monolith, which I know can have scaling 
      challenges. Before suggesting changes, I'd like to 
      understand:
      - What were the original scaling requirements?
      - What's our current scale and growth trajectory?
      - What pain points are we actually experiencing?
      - What would be the cost of migrating?
      
      I'm curious to learn the history and then we can 
      discuss if/when a change makes sense."
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Avoiding High Maintenance */}
      <section id="high-maintenance" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                9. Avoiding High Maintenance Behavior
              </Heading>
              <Text className={styles.sectionDescription}>
                Maintain a "can-do" attitude. High maintenance behavior is a turn-off and prevents growth. Focus on solutions, not just problems.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ High Maintenance vs. Low Maintenance

const maintenanceBehaviors = {
  // Signs of High Maintenance
  highMaintenance: {
    traits: [
      'Argues in infinite loops',
      'Always has an opinion and must be heard',
      'Thinks they know best about everything',
      'Needs to be entertained with only attractive tasks',
      'Complains excessively',
      'Focuses on problems, not solutions',
      'Drains energy from team'
    ],
    examples: {
      arguing: \`
        ❌ "I don't think we should use React Query."
        ✅ "I have concerns about React Query. Here are the 
            trade-offs I see, and here's an alternative 
            approach. What do you think?"
      \`,
      complaining: \`
        ❌ "This task is boring. Why do I always get the 
            uninteresting work?"
        ✅ "I understand this task needs to be done. I'll 
            complete it efficiently so I can move on to 
            more challenging work."
      \`,
      taskSelection: \`
        ❌ "I only want to work on the new feature, not 
            the bug fixes."
        ✅ "I'll handle the bug fixes. Once those are done, 
            I'd love to contribute to the new feature."
      \`
    }
  },

  // Low Maintenance (Can-Do Attitude)
  lowMaintenance: {
    traits: [
      'Focuses on solutions',
      'Takes on necessary work',
      'Positive and constructive',
      'Respects team decisions',
      'Energizes the team',
      'Adaptable and flexible'
    ],
    examples: {
      solutionFocused: \`
        ✅ "I see the challenge. Here are three ways we 
            could approach this. I recommend option 2 
            because..."
      \`,
      flexible: \`
        ✅ "I understand we need to pivot. I'll adjust my 
            approach and keep the team updated."
      \`,
      constructive: \`
        ✅ "I have concerns, but I trust the team's decision. 
            I'll support it and help make it successful."
      \`
    }
  },

  // How to Avoid High Maintenance
  prevention: {
    techniques: [
      'Focus on solutions, not just problems',
      'Be flexible with task assignments',
      'Respect team decisions even if you disagree',
      'Save strong opinions for truly important issues',
      'Maintain positive attitude',
      'Be a team player'
    ],
    selfCheck: \`
      Ask yourself:
      - Am I complaining more than contributing?
      - Am I arguing for the sake of arguing?
      - Am I being flexible and adaptable?
      - Am I focusing on solutions?
      - Am I energizing or draining the team?
    \`
  }
};

// ✅ Communication Examples

// High Maintenance vs. Low Maintenance
const taskAssignment = {
  highMaintenance: \`
    ❌ "Why do I always get the boring tasks? I'm a senior 
        developer, I should be working on the interesting 
        features."
  \`,
  lowMaintenance: \`
    ✅ "I'll take care of the bug fixes. They're important 
        for our users. Once I'm done, I'd be happy to 
        contribute to the new feature work."
  \`
};

const disagreement = {
  highMaintenance: \`
    ❌ "This is a terrible decision. We should do it my 
        way. I've been doing this for 10 years and I know 
        what I'm talking about."
  \`,
  lowMaintenance: \`
    ✅ "I have some concerns about this approach. Here's 
        what I'm thinking, but I trust the team's decision. 
        I'll support it and help make it successful."
  \`
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Building Relationships */}
      <section id="relationships" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                10. Building Relationships
              </Heading>
              <Text className={styles.sectionDescription}>
                Strong relationships make everything easier—solving problems, getting help, collaborating, and advancing your career.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Relationship Building Strategies

const relationshipBuilding = {
  // Help Others
  helping: {
    principle: 'Help others succeed, and they'll help you',
    ways: [
      'Answer questions in team channels',
      'Review PRs thoroughly and constructively',
      'Share knowledge and documentation',
      'Mentor junior developers',
      'Volunteer for cross-team projects',
      'Offer to pair program',
      'Share useful resources'
    ],
    example: \`
      ✅ "I see you're working on X. I did something similar 
          last month. Here's a doc I wrote that might help, 
          and I'm happy to pair if you want."
    \`
  },

  // Be Approachable
  approachability: {
    traits: [
      'Respond to messages promptly',
      'Be friendly and welcoming',
      'Don't make people feel stupid for asking',
      'Celebrate others' successes',
      'Be genuine and authentic'
    ],
    communication: {
      welcoming: \`
        ✅ "Great question! I'm happy to help. Let me 
            explain..."
      \`,
      encouraging: \`
        ✅ "That's a really interesting approach! I like 
            how you're thinking about this."
      \`
    }
  },

  // Network Strategically
  networking: {
    withinTeam: [
      'Regular 1:1s with team members',
      'Pair programming sessions',
      'Knowledge sharing sessions',
      'Team social events'
    ],
    crossTeam: [
      'Collaborate on cross-functional projects',
      'Attend other teams' demos',
      'Participate in company-wide initiatives',
      'Join internal communities of practice'
    ],
    externally: [
      'Attend meetups and conferences',
      'Contribute to open source',
      'Write blog posts',
      'Speak at events'
    ]
  },

  // Remember People
  memory: {
    whatToRemember: [
      'People's names and roles',
      'Their expertise areas',
      'Projects they're working on',
      'Their communication preferences',
      'Personal details (when appropriate)'
    ],
    how: \`
      - Take notes after meetings
      - Use a contacts/notes system
      - Reference previous conversations
      - Follow up on things they mentioned
    \`
  }
};

// ✅ Relationship Building Examples

// Offering Help
const offerHelp = \`
Hey Sarah,

I saw your message about struggling with the authentication 
refactor. I worked on something similar last quarter. 

I'm happy to:
- Pair program on it for an hour
- Review your approach and give feedback
- Share the patterns I used

Let me know what would be most helpful!

Best,
[Your Name]
\`;

// Celebrating Others
const celebrateOthers = \`
🎉 Great work on the payment integration, Mike! 

I know that was a complex piece of work with lots of edge 
cases. The error handling you implemented is really solid, 
and I learned a lot from reviewing your PR.

Thanks for pushing through the challenges!
\`;

// Building Cross-Team Relationships
const crossTeamBuilding = \`
Hi Product Team,

I wanted to reach out and introduce myself. I'm [Name], 
a senior developer on the Platform team.

I'm interested in understanding your roadmap better so 
I can:
- Provide technical input early in the planning process
- Identify potential technical challenges
- Suggest technical solutions that align with your goals

Would you be open to a brief sync where I can learn about 
your priorities and share how I might be able to help?

Thanks!
\`;`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Senior Developer Mindset */}
      <section id="mindset" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                11. Senior Developer Mindset
              </Heading>
              <Text className={styles.sectionDescription}>
                Seniority isn't just about years of experience—it's a mindset. It's about how you approach problems, work with others, and contribute to the team's success.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Senior Developer Mindset Framework

const seniorMindset = {
  // Growth Mindset
  growth: {
    principles: [
      'Always learning',
      'Embracing challenges',
      'Learning from failures',
      'Seeking feedback',
      'Continuous improvement'
    ],
    practices: [
      'Read technical blogs and books',
      'Experiment with new technologies',
      'Learn from code reviews',
      'Attend conferences and meetups',
      'Teach others (reinforces learning)'
    ]
  },

  // Systems Thinking
  systemsThinking: {
    principles: [
      'Think beyond your immediate task',
      'Consider impact on entire system',
      'Understand business context',
      'Think long-term, not just short-term',
      'Consider trade-offs and consequences'
    ],
    questions: [
      'How does this affect other parts of the system?',
      'What are the long-term implications?',
      'What could go wrong?',
      'How will this scale?',
      'What's the maintenance cost?'
    ]
  },

  // Ownership Mindset
  ownership: {
    principles: [
      'Own outcomes, not just tasks',
      'Think like an owner',
      'Take initiative',
      'Be accountable',
      'Care about quality'
    ],
    examples: [
      'Not just fixing bugs, but preventing them',
      'Not just writing code, but ensuring it works well',
      'Not just completing tasks, but delivering value',
      'Not just following process, but improving it'
    ]
  },

  // Collaborative Mindset
  collaboration: {
    principles: [
      'Success is team success',
      'Help others succeed',
      'Share knowledge freely',
      'Respect different perspectives',
      'Build consensus'
    ],
    practices: [
      'Pair programming',
      'Code reviews as teaching',
      'Knowledge sharing sessions',
      'Mentoring',
      'Cross-team collaboration'
    ]
  },

  // Pragmatic Mindset
  pragmatism: {
    principles: [
      'Perfect is the enemy of good',
      'Make informed trade-offs',
      'Solve real problems',
      'Be practical, not dogmatic',
      'Choose the right tool for the job'
    ],
    balance: \`
      Balance:
      - Quality vs. Speed
      - Innovation vs. Stability
      - Best practices vs. Practicality
      - Ideal solution vs. Good enough
    \`
  }
};

// ✅ Mindset Comparison

const mindsetComparison = {
  junior: {
    focus: 'Completing assigned tasks',
    questions: 'How do I do this?',
    scope: 'My immediate work',
    learning: 'Learning syntax and tools',
    collaboration: 'Getting help when stuck'
  },
  mid: {
    focus: 'Writing good code',
    questions: 'How do I do this well?',
    scope: 'My feature/module',
    learning: 'Learning patterns and practices',
    collaboration: 'Working with team on features'
  },
  senior: {
    focus: 'Delivering value and solving problems',
    questions: 'Why are we doing this? What's the best approach?',
    scope: 'System, team, and business impact',
    learning: 'Learning architecture and trade-offs',
    collaboration: 'Enabling team success and mentoring'
  }
};

// ✅ Daily Practices for Senior Mindset

const dailyPractices = {
  morning: [
    'Review team priorities and blockers',
    'Check for urgent issues',
    'Plan day with context in mind'
  ],
  duringWork: [
    'Think about system impact',
    'Consider long-term implications',
    'Share knowledge as you learn',
    'Help others when you can',
    'Document decisions and learnings'
  ],
  endOfDay: [
    'Update team on progress',
    'Document what you learned',
    'Reflect on what went well',
    'Identify improvements for tomorrow'
  ],
  weekly: [
    'Review team goals and progress',
    'Share knowledge with team',
    'Seek feedback on your work',
    'Plan for upcoming challenges'
  ]
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Tools for Growth */}
      <section id="tools" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                12. Tools for Tracking Growth
              </Heading>
              <Text className={styles.sectionDescription}>
                Use tools to track your progress, but remember: only compare yourself to your past self, not to others.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Growth Tracking Tools

const growthTools = {
  // Personal Development Journal
  journal: {
    format: \`
      # Weekly Reflection - Week of [Date]
      
      ## What I Accomplished
      - [Achievement 1]
      - [Achievement 2]
      
      ## What I Learned
      - [Learning 1]
      - [Learning 2]
      
      ## Challenges Faced
      - [Challenge 1] - [How I handled it]
      - [Challenge 2] - [What I learned]
      
      ## Feedback Received
      - [Feedback 1] - [Action plan]
      - [Feedback 2] - [Action plan]
      
      ## Goals for Next Week
      - [Goal 1]
      - [Goal 2]
      
      ## Skills Development
      - [Skill] - [Progress made]
    \`,
    frequency: 'Weekly or bi-weekly'
  },

  // Skills Matrix
  skillsMatrix: {
    categories: [
      'Technical Skills',
      'Communication',
      'Leadership',
      'Problem Solving',
      'Collaboration'
    ],
    tracking: \`
      Skill: [Name]
      Current Level: [1-5]
      Target Level: [1-5]
      Progress: [What you're doing to improve]
      Last Updated: [Date]
    \`,
    review: 'Quarterly'
  },

  // Achievement Log
  achievementLog: {
    purpose: 'Track accomplishments for reviews and growth',
    format: \`
      Date: [Date]
      Achievement: [What you accomplished]
      Impact: [Who/what was affected]
      Skills Demonstrated: [Skills used]
      Metrics: [Quantifiable results if applicable]
    \`,
    examples: [
      'Led architecture for new feature',
      'Mentored junior developer',
      'Improved system performance by X%',
      'Documented complex process',
      'Resolved production incident'
    ]
  },

  // Feedback Tracker
  feedbackTracker: {
    format: \`
      Date: [Date]
      From: [Person]
      Type: [Positive/Constructive]
      Topic: [What it was about]
      Key Points: [Main feedback]
      Action Items: [What you'll do]
      Follow-up: [When to check progress]
    \`,
    review: 'Monthly to identify patterns'
  }
};

// ✅ Self-Assessment Template

const selfAssessment = \`
# Self-Assessment - [Quarter/Period]

## Strengths
1. [Strength] - [Evidence/Example]
2. [Strength] - [Evidence/Example]

## Areas for Growth
1. [Area] - [Current state] → [Target state]
   - Action plan: [What you'll do]
   - Timeline: [When]
   
2. [Area] - [Current state] → [Target state]
   - Action plan: [What you'll do]
   - Timeline: [When]

## Goals Progress
- [Goal 1]: [Progress] / [Target]
- [Goal 2]: [Progress] / [Target]

## Feedback Summary
- Positive: [Themes]
- Constructive: [Themes]
- Action items: [What to work on]

## Next Steps
- [Action 1]
- [Action 2]
\`;

// ✅ Comparison: You vs. Your Past Self

const healthyComparison = {
  good: [
    'Comparing your skills now vs. 6 months ago',
    'Tracking improvement in specific areas',
    'Celebrating growth and progress',
    'Identifying areas that need more focus'
  ],
  bad: [
    'Comparing yourself to colleagues',
    'Feeling inadequate because others are "better"',
    'Focusing on what you lack vs. what you have',
    'Using others as the only benchmark'
  ],
  mindset: \`
    ✅ "I've improved significantly in system design 
        compared to last year."
    
    ❌ "John is a better architect than me, I'll never 
        be as good."
  \`
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}

