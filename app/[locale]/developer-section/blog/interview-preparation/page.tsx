"use client";

import React from "react";
import { Stack, Heading, Text, ButtonLink, CodeComparison, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

export default function InterviewPreparationPage() {
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
          <li className={styles.breadcrumbCurrent}>Interview Preparation</li>
        </ol>
      </nav>

      {/* Header */}
      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Interview Preparation: Complete Developer Guide
        </Heading>
        <Text className={styles.subtitle}>
          Master technical interviews, system design, coding patterns, and behavioral interviews. This comprehensive guide covers strategies, frameworks, patterns, and techniques used by senior engineers at top tech companies. Learn how to approach interviews with confidence and demonstrate your problem-solving abilities effectively.
        </Text>
      </div>

      {/* Technical Interview Strategies */}
      <section id="technical-strategies" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1. Technical Interview Strategies
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>The Challenge:</strong> Technical interviews can be stressful and unpredictable. Many candidates fail not because they lack skills, but because they don't know how to approach problems systematically or communicate their thinking effectively.
                <br /><br />
                <strong>The Solution:</strong> Learn proven strategies for breaking down problems, communicating your thought process, handling edge cases, and demonstrating senior-level thinking. These frameworks work for coding interviews, system design, architecture discussions, and technical deep-dives.
              </Text>
            </div>

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mb-6`}>
              <Text className={styles.infoText}>
                <strong>Key Principle:</strong> Technical interviews are not just about getting the right answer—they're about demonstrating how you think, communicate, and approach problems. Your process matters as much as your solution.
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ BAD: Jumping to Code Immediately

// Problem: "Find the longest substring without repeating characters"

function solution(s) {
  // Start coding immediately without clarifying
  // No understanding of requirements
  // No discussion of approach
  // No consideration of edge cases
  let result = "";
  for (let i = 0; i < s.length; i++) {
    // ... writing code
  }
  return result;
}

# Why this is bad:
- Shows no systematic thinking
- Doesn't clarify assumptions
- No discussion of trade-offs
- Doesn't demonstrate communication skills
- May solve wrong problem
- Hard to recover if stuck`}
              good={`# ✅ GOOD: Systematic Problem-Solving Approach

// Problem: "Find the longest substring without repeating characters"

// STEP 1: Clarify Requirements
"I'd like to clarify a few things before I start:
1. Are we dealing with ASCII or Unicode characters?
2. Should I handle empty string? Return empty string or 0?
3. What about case sensitivity? Is 'A' different from 'a'?
4. Any space/memory constraints I should be aware of?"

// STEP 2: Discuss Approach
"I'm thinking of using a sliding window approach with a hash map.
- Use two pointers (left, right) for the window
- Use a map to track last seen index of each character
- When we see a duplicate, move left pointer
- Track maximum window size

Time: O(n), Space: O(min(n, m)) where m is charset size"

// STEP 3: Write Code with Explanation
function lengthOfLongestSubstring(s) {
  if (!s) return 0;
  
  const charIndexMap = new Map();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // If we've seen this char and it's within our window
    if (charIndexMap.has(char) && charIndexMap.get(char) >= left) {
      left = charIndexMap.get(char) + 1;
    }
    
    charIndexMap.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

// STEP 4: Test with Examples
"Let me trace through 'abcabcbb':
- a(0): window=[a], length=1
- b(1): window=[ab], length=2
- c(2): window=[abc], length=3
- a(3): duplicate! move left to 1, window=[bca], length=3
- b(4): duplicate! move left to 2, window=[cab], length=3
- c(5): duplicate! move left to 3, window=[abc], length=3
- b(6): duplicate! move left to 5, window=[cb], length=2
- b(7): duplicate! move left to 7, window=[b], length=1
Result: 3 ✓"

// STEP 5: Discuss Edge Cases & Optimizations
"Edge cases handled:
- Empty string: returns 0
- Single character: returns 1
- All same chars: returns 1
- No duplicates: returns string length

Possible optimization: If we know charset size is small (like lowercase letters),
we could use array instead of map for O(1) constant space."`}
            />

            <CodeEditor
              code={`// ✅ Technical Interview Framework

/**
 * The STAR-RT Framework for Technical Interviews
 * STAR: Situation, Task, Action, Result
 * RT: Reasoning & Trade-offs (for technical problems)
 */

const technicalInterviewFramework = {
  // STEP 1: UNDERSTAND & CLARIFY (2-3 minutes)
  understand: {
    readCarefully: 'Read problem statement 2-3 times',
    clarify: {
      inputs: 'What are the input types and constraints?',
      outputs: 'What should the function return?',
      edgeCases: 'What edge cases should I consider?',
      assumptions: 'Can I make any assumptions?',
      examples: 'Walk through examples to confirm understanding'
    },
    example: \`
      Interviewer: "Find the two numbers that add up to a target"
      
      You: "Let me clarify:
      - Input: array of integers and a target sum?
      - Output: indices or values?
      - Can the array have duplicates?
      - Negative numbers allowed?
      - Can I use the same element twice?
      - What should I return if no solution exists?
      - Any time/space constraints?"
    \`
  },

  // STEP 2: BRAINSTORM & DISCUSS (3-5 minutes)
  brainstorm: {
    approach: 'Discuss multiple approaches before coding',
    tradeoffs: {
      bruteForce: 'Start with brute force to show understanding',
      optimized: 'Discuss optimized approach',
      comparison: 'Compare time/space complexity'
    },
    communication: \`
      "I can think of a few approaches:
      
      1. Brute Force: Check all pairs - O(n²) time, O(1) space
      2. Sorting: Sort then use two pointers - O(n log n) time, O(1) space
      3. Hash Map: One pass with map - O(n) time, O(n) space
      
      Given the constraints, I think approach 3 would be best.
      Should I proceed with that?"
    \`
  },

  // STEP 3: EXPLAIN BEFORE CODING (1-2 minutes)
  explain: {
    algorithm: 'Explain your algorithm step-by-step',
    dataStructures: 'Explain data structures you'll use',
    invariants: 'State any invariants you'll maintain',
    example: \`
      "My approach:
      1. Create a hash map to store {number: index}
      2. For each number, calculate complement (target - current)
      3. If complement exists in map, return both indices
      4. Otherwise, add current number and index to map
      
      This maintains the invariant that we've seen all previous numbers,
      so when we find a complement, we can immediately return the answer."
    \`
  },

  // STEP 4: CODE WITH COMMENTARY (10-15 minutes)
  code: {
    principles: {
      cleanCode: 'Write clean, readable code',
      meaningfulNames: 'Use meaningful variable names',
      comments: 'Comment complex logic',
      explanation: 'Explain what you're doing as you code'
    },
    practice: \`
      function twoSum(nums, target) {
        // Map: value -> index
        const seen = new Map();
        
        for (let i = 0; i < nums.length; i++) {
          const complement = target - nums[i];
          
          // Check if we've seen the complement
          if (seen.has(complement)) {
            return [seen.get(complement), i];
          }
          
          // Store current number and index
          seen.set(nums[i], i);
        }
        
        // No solution found (per requirements)
        return [];
      }
    \`
  },

  // STEP 5: TEST & VERIFY (3-5 minutes)
  test: {
    walkthrough: 'Walk through code with examples',
    edgeCases: 'Test edge cases explicitly',
    correctness: 'Verify logic is correct',
    example: \`
      "Let me test with nums = [2, 7, 11, 15], target = 9:
      
      i=0, num=2, complement=7: seen={}, complement not found, seen={2:0}
      i=1, num=7, complement=2: seen={2:0}, complement found! Return [0,1]
      
      Edge cases:
      - Empty array: loop doesn't run, returns []
      - No solution: returns [] after loop
      - Duplicate numbers: handled correctly with map"
    \`
  },

  // STEP 6: OPTIMIZE & DISCUSS (2-3 minutes)
  optimize: {
    analyze: 'Analyze time and space complexity',
    improvements: 'Discuss possible optimizations',
    tradeoffs: 'Discuss trade-offs of different approaches',
    example: \`
      "Complexity Analysis:
      - Time: O(n) - single pass through array
      - Space: O(n) - hash map in worst case
      
      Could we optimize space? Not really, we need to remember
      seen numbers. However, if input was sorted, we could use
      two pointers for O(1) space, but that would require O(n log n)
      sorting time first."
    \`
  }
};

// ✅ Common Patterns Cheat Sheet

const commonPatterns = {
  twoPointers: {
    when: 'Sorted arrays, palindromes, two-sum variants',
    template: \`
      let left = 0;
      let right = array.length - 1;
      
      while (left < right) {
        if (condition) {
          // Move pointers based on condition
          left++;
        } else {
          right--;
        }
      }
    \`
  },
  
  slidingWindow: {
    when: 'Substrings, subarrays with constraints',
    template: \`
      let left = 0;
      const window = new Map(); // or Set
      
      for (let right = 0; right < array.length; right++) {
        // Expand window
        window.add(array[right]);
        
        // Shrink window if needed
        while (window.size > k) {
          window.delete(array[left]);
          left++;
        }
        
        // Process window
      }
    \`
  },
  
  hashMap: {
    when: 'Frequency counting, lookups, complements',
    template: \`
      const map = new Map();
      
      for (const item of items) {
        if (map.has(item)) {
          // Process pair
        } else {
          map.set(item, value);
        }
      }
    \`
  },
  
  dfs: {
    when: 'Trees, graphs, backtracking',
    template: \`
      function dfs(node, visited, result) {
        if (visited.has(node) || !node) return;
        
        visited.add(node);
        result.push(node);
        
        for (const neighbor of node.neighbors) {
          dfs(neighbor, visited, result);
        }
      }
    \`
  },
  
  bfs: {
    when: 'Level-order traversal, shortest path',
    template: \`
      const queue = [start];
      const visited = new Set([start]);
      
      while (queue.length > 0) {
        const node = queue.shift();
        
        // Process node
        
        for (const neighbor of node.neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    \`
  },
  
  binarySearch: {
    when: 'Sorted arrays, search space reduction',
    template: \`
      let left = 0;
      let right = array.length - 1;
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (array[mid] === target) {
          return mid;
        } else if (array[mid] < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      
      return -1;
    \`
  }
};`}
              language="tsx"
              readOnly={true}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Pro Tip:</strong> Always think out loud. Your interviewer wants to see how you think, not just what you code. Explain your reasoning, discuss trade-offs, and show that you're considering multiple approaches even if you ultimately choose one.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* System Design Interview Prep */}
      <section id="system-design" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2. System Design Interview Prep
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>The Challenge:</strong> System design interviews test your ability to design large-scale systems. You need to balance scalability, reliability, performance, and cost while communicating your design clearly.
                <br /><br />
                <strong>The Solution:</strong> Learn a structured approach to system design interviews. Master the fundamentals of distributed systems, common design patterns, trade-offs, and how to scale from a simple system to handling millions of users.
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ BAD: Jumping to Implementation Details

Interviewer: "Design a URL shortener like bit.ly"

You: "Okay, I'll need a database. Let me use PostgreSQL. 
For the short URL, I'll generate random strings. 
Maybe I can use a hash function... 

Actually, let me think about the schema:
- id: primary key
- long_url: varchar
- short_url: varchar

I'll write an API endpoint that takes the long URL..."

# Why this is bad:
- No clarification of requirements
- No scale discussion
- No architecture overview
- Jumping to database choice without reasoning
- Missing key components (caching, load balancing, etc.)
- No consideration of trade-offs`}
              good={`# ✅ GOOD: Structured System Design Approach

Interviewer: "Design a URL shortener like bit.ly"

You: "Great! Let me start by clarifying requirements and scope.

## STEP 1: Requirements Clarification

Functional Requirements:
- Shorten long URLs to short URLs (e.g., bit.ly/abc123)
- Redirect short URLs to original URLs
- URLs should expire after some time
- Users can customize short URLs (optional?)

Non-Functional Requirements:
- High availability (99.9%)
- Low latency (< 100ms redirect)
- Short URLs should be unique

Scale:
- 100M URLs shortened per day
- 10:1 read/write ratio (1B reads/day)
- URLs stored for 2 years average
- 500 bytes per record

## STEP 2: Capacity Estimation

Storage:
- 100M * 365 * 2 years = 73B URLs
- 73B * 500 bytes = 36.5 TB

Traffic:
- Writes: 100M/86400 = ~1,160 writes/sec
- Reads: 1B/86400 = ~11,600 reads/sec

Bandwidth:
- Writes: 1,160 * 500 bytes = 0.58 MB/sec
- Reads: 11,600 * 500 bytes = 5.8 MB/sec

## STEP 3: High-Level Design

\`\`\`
┌─────────┐     ┌──────────┐     ┌──────────┐
│ Client  │────▶│   Load   │────▶│  Web     │
│         │     │ Balancer │     │ Server   │
└─────────┘     └──────────┘     └──────────┘
                                    │    │
                                    ▼    ▼
                            ┌──────────┐  ┌──────────┐
                            │  Cache   │  │Database  │
                            │ (Redis)  │  │ (MySQL)  │
                            └──────────┘  └──────────┘
\`\`\`

## STEP 4: API Design

POST /api/v1/shorten
\{
  "long_url": "https://example.com/very/long/url",
  "expires_in": 365  // days, optional
\}
Response: \{ "short_url": "bit.ly/abc123" \}

GET /\{short_url\}
Response: 301 Redirect to long_url

## STEP 5: Database Schema

url_mappings table:
- id: bigint (primary key)
- short_code: varchar(7) (indexed, unique)
- long_url: varchar(2048)
- created_at: timestamp
- expires_at: timestamp

## STEP 6: Generating Short URLs

Option 1: Base62 encoding
- Use auto-incrementing ID (1, 2, 3...)
- Encode to base62: abc123
- 62^7 = 3.5 trillion unique codes ✓

Option 2: Random generation
- Generate random 7-char strings
- Check uniqueness (collision probability low)

I'll use base62 encoding for simplicity.

## STEP 7: Caching Strategy

- Cache popular URLs (top 20% generate 80% traffic)
- Cache short_code → long_url mapping
- TTL: 24 hours
- Eviction: LRU policy

## STEP 8: Scaling Considerations

Database:
- Horizontal sharding by short_code hash
- Read replicas for reads
- Consistent hashing for distribution

Cache:
- Redis cluster for high availability
- Consistent hashing across nodes

Load Balancing:
- Round-robin for writes
- URL-based routing for reads (cache affinity)

## STEP 9: Additional Features

- Analytics: Track click counts
- Rate limiting: Prevent abuse
- Custom URLs: Additional uniqueness check
- URL expiration: Background job to clean expired URLs
\`\`\`
\`}
            />

            <CodeEditor
              code={`// ✅ System Design Interview Framework

/**
 * The 7-Step System Design Framework
 * Use this structure for any system design interview
 */

const systemDesignFramework = {
  // STEP 1: REQUIREMENTS CLARIFICATION (5 minutes)
  clarify: {
    functional: [
      'Core features and functionality',
      'User stories and use cases',
      'Data models and relationships',
      'API requirements'
    ],
    nonFunctional: [
      'Scale: users, requests, data volume',
      'Performance: latency, throughput',
      'Availability: uptime requirements',
      'Consistency: strong vs eventual',
      'Durability: data loss tolerance'
    ],
    scope: [
      'What to focus on',
      'What to mention but not design',
      'What's out of scope'
    ],
    example: 'Interviewer: "Design Twitter"\\n\\n' +
      'You: "Let me clarify:\\n\\n' +
      'Functional Requirements:\\n' +
      '- Users can post tweets (280 chars)\\n' +
      '- Users can follow other users\\n' +
      '- Users see timeline of tweets from followed users\\n' +
      '- Users can like/retweet tweets\\n' +
      '- Real-time feed updates?\\n\\n' +
      'Non-Functional:\\n' +
      '- Scale: 200M DAU, 100M tweets/day\\n' +
      '- Read:write ratio: 100:1\\n' +
      '- Timeline generation latency: < 200ms\\n' +
      '- Availability: 99.9%\\n\\n' +
      'Should I focus on the feed generation algorithm\\n' +
      'or the overall architecture?"'
  },

  // STEP 2: CAPACITY ESTIMATION (3 minutes)
  capacity: {
    storage: 'Calculate data storage needs',
    bandwidth: 'Calculate network bandwidth',
    requests: 'Calculate request rates',
    memory: 'Calculate cache requirements',
    formula: '// Storage\\n' +
      'Daily new records × Average record size × Retention period\\n\\n' +
      '// Bandwidth\\n' +
      'Requests/sec × Response size\\n\\n' +
      '// Cache\\n' +
      'Read QPS × Cache hit ratio × Average object size',
    example: '"For a messaging system with 500M users:\\n\\n' +
      'Storage:\\n' +
      '- 1B messages/day × 1KB × 30 days = 30 TB\\n' +
      '- User data: 500M × 2KB = 1 TB\\n' +
      '- Total: ~31 TB\\n\\n' +
      'Traffic:\\n' +
      '- Writes: 1B/86400 = ~11,500 writes/sec\\n' +
      '- Reads: 50B/86400 = ~580,000 reads/sec\\n\\n' +
      'Bandwidth:\\n' +
      '- Write: 11,500 × 1KB = 11.5 MB/sec\\n' +
      '- Read: 580,000 × 1KB = 580 MB/sec"'
  },

  // STEP 3: HIGH-LEVEL DESIGN (5 minutes)
  highLevel: {
    components: [
      'Client (mobile, web)',
      'Load balancer',
      'Application servers',
      'Database (SQL/NoSQL)',
      'Cache layer',
      'Message queue',
      'CDN',
      'Search/indexing'
    ],
    diagram: 'Draw simple boxes and arrows:\\n' +
      'Client → LB → App Servers → Database\\n' +
      '                     ↓\\n' +
      '                   Cache\\n' +
      '                     ↓\\n' +
      '              Message Queue',
    principles: [
      'Start simple, add complexity',
      'Show main data flows',
      'Don't get too detailed yet'
    ]
  },

  // STEP 4: DETAILED DESIGN (15-20 minutes)
  detailed: {
    dataModel: {
      tables: 'Database schema design',
      indexes: 'Index strategy',
      partitioning: 'Sharding strategy',
      replication: 'Master-slave or multi-master'
    },
    apis: {
      endpoints: 'REST or GraphQL endpoints',
      request: 'Request format',
      response: 'Response format',
      errors: 'Error handling'
    },
    algorithms: {
      core: 'Core algorithms (feed generation, ranking, etc.)',
      tradeoffs: 'Trade-offs between approaches',
      complexity: 'Time/space complexity'
    },
    example: '// Database Schema\\n' +
      'Users Table:\\n' +
      '- user_id (PK)\\n' +
      '- username (unique)\\n' +
      '- email'
      - created_at
      
      Tweets Table:
      - tweet_id (PK)
      - user_id (FK)
      - content
      - created_at
      
      Follows Table:
      - follower_id (FK)
      - followee_id (FK)
      - created_at
      - Composite PK (follower_id, followee_id)
      
      // Feed Generation Algorithm\\n\\n' +
      'Option 1: Fan-out on Write\\n' +
      '- When user tweets, push to all followers\' timelines\\n' +
      '- Write-heavy: O(followers) per tweet\\n' +
      '- Read-light: O(1) to fetch timeline\\n\\n' +
      'Option 2: Fan-out on Read\\n' +
      '- Fetch tweets from all followed users on read\\n' +
      '- Write-light: O(1) to post tweet\\n' +
      '- Read-heavy: O(followers) to fetch timeline\\n\\n' +
      'Hybrid Approach:\\n' +
      '- Fan-out on write for celebrities (>1M followers)\\n' +
      '- Fan-out on read for regular users\\n' +
      '- Best of both worlds'
  },

  // STEP 5: SCALING & OPTIMIZATION (5-10 minutes)
  scaling: {
    database: [
      'Horizontal sharding',
      'Read replicas',
      'Caching strategy',
      'Denormalization'
    ],
    caching: [
      'What to cache',
      'Cache invalidation',
      'Cache distribution',
      'Cache warming'
    ],
    loadBalancing: [
      'Load balancing strategy',
      'Session affinity',
      'Health checks'
    ],
    cdn: 'CDN for static assets',
    example: \`
      "To scale to 1B users:
      
      Database Sharding:
      - Shard by user_id (hash-based)
      - 1000 shards, each handling 1M users
      - Consistent hashing for distribution
      
      Caching:
      - Redis cluster for hot data
      - Cache user profiles, timelines
      - 80% cache hit rate target
      
      Read Replicas:
      - 1 master, 5 read replicas per shard
      - Read replicas handle reads
      - Master handles writes
      
      Load Balancing:
      - Multiple app server clusters
      - Geographic distribution
      - Health checks every 30s"
    \`
  },

  // STEP 6: RELIABILITY & RESILIENCE (3-5 minutes)
  reliability: {
    singlePoints: 'Identify single points of failure',
    redundancy: 'Add redundancy',
    failover: 'Failover mechanisms',
    monitoring: 'Monitoring and alerting',
    example: \`
      "Reliability measures:
      
      - Database: Master-slave replication
      - App servers: Multiple instances
      - Cache: Redis cluster (no single point)
      - Load balancer: Active-passive setup
      
      Failover:
      - Automatic DB failover (< 30s)
      - Health checks on all services
      - Circuit breakers for external APIs
      
      Monitoring:
      - Track latency, error rates
      - Alert on anomalies
      - Dashboard for real-time metrics"
    \`
  },

  // STEP 7: TRADE-OFFS & ALTERNATIVES (2-3 minutes)
  tradeoffs: {
    discuss: 'Discuss what you chose and why',
    alternatives: 'Mention alternatives considered',
    limitations: 'Acknowledge limitations',
    future: 'How to handle future scale',
    example: \`
      "Trade-offs I made:
      
      Chose SQL over NoSQL:
      - Need ACID transactions for financial data
      - Complex queries needed
      - Can scale horizontally with sharding
      
      Chose eventual consistency:
      - Better performance and availability
      - Acceptable for social feed (few seconds delay OK)
      
      Future considerations:
      - Move to microservices as scale grows
      - Consider graph database for social graph
      - Implement ML for personalized ranking"
    \`
  }
};

// ✅ Common System Design Patterns

const systemDesignPatterns = {
  loadBalancing: {
    roundRobin: 'Distribute requests evenly',
    leastConnections: 'Route to server with fewest connections',
    ipHash: 'Route by client IP (session affinity)',
    weighted: 'Route based on server capacity'
  },
  
  caching: {
    cacheAside: 'App checks cache, then DB',
    writeThrough: 'Write to cache and DB simultaneously',
    writeBack: 'Write to cache, async write to DB',
    refreshAhead: 'Preemptively refresh before expiry'
  },
  
  database: {
    sharding: 'Horizontal partitioning by key',
    replication: 'Copy data across servers',
    denormalization: 'Duplicate data to reduce joins',
    indexing: 'Fast lookups on frequently queried fields'
  },
  
  messageQueues: {
    pubSub: 'Publish-subscribe pattern',
    queue: 'FIFO message processing',
    topics: 'Category-based message routing'
  }
};

// ✅ Scale Numbers Reference

const scaleReference = {
  requests: {
    small: '1K-10K req/sec',
    medium: '10K-100K req/sec',
    large: '100K-1M req/sec',
    veryLarge: '1M+ req/sec'
  },
  users: {
    small: '100K-1M users',
    medium: '1M-10M users',
    large: '10M-100M users',
    veryLarge: '100M+ users'
  },
  storage: {
    small: '1GB-100GB',
    medium: '100GB-1TB',
    large: '1TB-100TB',
    veryLarge: '100TB+'
  },
  latency: {
    cache: '< 1ms',
    database: '1-10ms',
    api: '< 100ms',
    userPerceived: '< 200ms'
  }
};`}
              language="tsx"
              readOnly={true}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxPurple} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Key Tip:</strong> System design interviews are conversations, not presentations. Engage with your interviewer, ask clarifying questions, and be ready to iterate on your design based on feedback. There's rarely one "correct" design—show that you can think through trade-offs and make informed decisions.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Coding Interview Patterns */}
      <section id="coding-patterns" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3. Coding Interview Patterns
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>The Challenge:</strong> Most coding interview problems fall into recognizable patterns. Candidates who don't recognize these patterns waste time reinventing solutions or miss optimizations.
                <br /><br />
                <strong>The Solution:</strong> Master the 15+ essential coding interview patterns. Learn when to apply each pattern, common variations, implementation details, and time/space complexity. This pattern recognition will help you solve problems faster and more confidently.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ Essential Coding Interview Patterns

/**
 * PATTERN 1: Two Pointers
 * Use: Sorted arrays, palindromes, pair problems
 * Time: O(n), Space: O(1)
 */

// Example: Two Sum (sorted array)
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const sum = nums[left] + nums[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [];
}

// Example: Valid Palindrome
function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    // Skip non-alphanumeric
    while (left < right && !isAlphanumeric(s[left])) left++;
    while (left < right && !isAlphanumeric(s[right])) right--;
    
    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    
    left++;
    right--;
  }
  
  return true;
}

/**
 * PATTERN 2: Sliding Window
 * Use: Substrings, subarrays, contiguous sequences
 * Time: O(n), Space: O(k) where k is window size
 */

// Example: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
  const charMap = new Map();
  let left = 0;
  let maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // If character exists and is in current window
    if (charMap.has(char) && charMap.get(char) >= left) {
      left = charMap.get(char) + 1;
    }
    
    charMap.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  
  return maxLength;
}

// Example: Maximum Sum Subarray of Size K
function maxSumSubarray(nums, k) {
  let windowSum = 0;
  let maxSum = 0;
  
  // Initialize first window
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  maxSum = windowSum;
  
  // Slide window
  for (let i = k; i < nums.length; i++) {
    windowSum = windowSum - nums[i - k] + nums[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}

/**
 * PATTERN 3: Fast & Slow Pointers (Floyd's Cycle Detection)
 * Use: Linked list cycles, finding middle, palindrome
 * Time: O(n), Space: O(1)
 */

// Example: Linked List Cycle Detection
function hasCycle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      return true; // Cycle detected
    }
  }
  
  return false;
}

// Example: Find Middle of Linked List
function findMiddle(head) {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

/**
 * PATTERN 4: Merge Intervals
 * Use: Overlapping intervals, scheduling problems
 * Time: O(n log n), Space: O(n)
 */

// Example: Merge Intervals
function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;
  
  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);
  
  const merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];
    
    // If current overlaps with last, merge them
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}

/**
 * PATTERN 5: Cyclic Sort
 * Use: Arrays with numbers in range [1, n]
 * Time: O(n), Space: O(1)
 */

// Example: Find Missing Number
function findMissingNumber(nums) {
  let i = 0;
  const n = nums.length;
  
  // Cyclic sort
  while (i < n) {
    const correctIndex = nums[i];
    
    if (nums[i] < n && nums[i] !== nums[correctIndex]) {
      [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
    } else {
      i++;
    }
  }
  
  // Find first missing number
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i) {
      return i;
    }
  }
  
  return n;
}

/**
 * PATTERN 6: In-place Reversal of Linked List
 * Use: Reverse linked lists efficiently
 * Time: O(n), Space: O(1)
 */

function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}

/**
 * PATTERN 7: Tree BFS (Level Order)
 * Use: Level-by-level traversal, shortest path
 * Time: O(n), Space: O(w) where w is max width
 */

function levelOrderTraversal(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}

/**
 * PATTERN 8: Tree DFS
 * Use: Traversal, path problems, validation
 * Time: O(n), Space: O(h) where h is height
 */

// Preorder: Root -> Left -> Right
function preorderTraversal(root, result = []) {
  if (!root) return;
  
  result.push(root.val);
  preorderTraversal(root.left, result);
  preorderTraversal(root.right, result);
  
  return result;
}

// Inorder: Left -> Root -> Right (gives sorted order for BST)
function inorderTraversal(root, result = []) {
  if (!root) return;
  
  inorderTraversal(root.left, result);
  result.push(root.val);
  inorderTraversal(root.right, result);
  
  return result;
}

// Postorder: Left -> Right -> Root
function postorderTraversal(root, result = []) {
  if (!root) return;
  
  postorderTraversal(root.left, result);
  postorderTraversal(root.right, result);
  result.push(root.val);
  
  return result;
}

/**
 * PATTERN 9: Two Heaps
 * Use: Finding median, kth largest/smallest
 * Time: O(n log n), Space: O(n)
 */

// Example: Find Median from Data Stream
class MedianFinder {
  constructor() {
    this.maxHeap = []; // Lower half
    this.minHeap = []; // Upper half
  }
  
  addNum(num) {
    // Add to max heap first
    this.maxHeap.push(num);
    this.maxHeap.sort((a, b) => b - a);
    
    // Balance heaps
    this.minHeap.push(this.maxHeap.shift());
    this.minHeap.sort((a, b) => a - b);
    
    // If min heap is larger, move back to max heap
    if (this.minHeap.length > this.maxHeap.length) {
      this.maxHeap.push(this.minHeap.shift());
      this.maxHeap.sort((a, b) => b - a);
    }
  }
  
  findMedian() {
    if (this.maxHeap.length > this.minHeap.length) {
      return this.maxHeap[0];
    }
    return (this.maxHeap[0] + this.minHeap[0]) / 2;
  }
}

/**
 * PATTERN 10: Subsets / Backtracking
 * Use: Generate all combinations, permutations
 * Time: O(2^n), Space: O(n) for recursion
 */

// Example: Generate Subsets
function subsets(nums) {
  const result = [];
  
  function backtrack(start, current) {
    result.push([...current]);
    
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop(); // Backtrack
    }
  }
  
  backtrack(0, []);
  return result;
}

// Example: Generate Permutations
function permutations(nums) {
  const result = [];
  
  function backtrack(current) {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    
    for (let num of nums) {
      if (current.includes(num)) continue;
      
      current.push(num);
      backtrack(current);
      current.pop();
    }
  }
  
  backtrack([]);
  return result;
}

/**
 * PATTERN 11: Modified Binary Search
 * Use: Search in rotated arrays, find boundaries
 * Time: O(log n), Space: O(1)
 */

// Example: Search in Rotated Sorted Array
function searchRotated(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] === target) return mid;
    
    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } 
    // Right half is sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  
  return -1;
}

/**
 * PATTERN 12: Top K Elements
 * Use: Find k largest/smallest, frequent elements
 * Time: O(n log k), Space: O(k)
 */

// Example: Find K Largest Elements
function findKLargest(nums, k) {
  const minHeap = [];
  
  for (let num of nums) {
    minHeap.push(num);
    minHeap.sort((a, b) => a - b);
    
    if (minHeap.length > k) {
      minHeap.shift(); // Remove smallest
    }
  }
  
  return minHeap;
}

/**
 * PATTERN 13: K-way Merge
 * Use: Merge k sorted lists/arrays
 * Time: O(n log k), Space: O(k)
 */

// Example: Merge K Sorted Lists
function mergeKLists(lists) {
  const minHeap = [];
  
  // Add first element of each list to heap
  for (let list of lists) {
    if (list) {
      minHeap.push({ val: list.val, list: list });
    }
  }
  
  minHeap.sort((a, b) => a.val - b.val);
  
  const dummy = { next: null };
  let current = dummy;
  
  while (minHeap.length > 0) {
    const { val, list } = minHeap.shift();
    
    current.next = { val, next: null };
    current = current.next;
    
    if (list.next) {
      minHeap.push({ val: list.next.val, list: list.next });
      minHeap.sort((a, b) => a.val - b.val);
    }
  }
  
  return dummy.next;
}

/**
 * PATTERN 14: Topological Sort
 * Use: Ordering with dependencies, course prerequisites
 * Time: O(V + E), Space: O(V)
 */

// Example: Course Schedule
function canFinish(numCourses, prerequisites) {
  const graph = Array(numCourses).fill(0).map(() => []);
  const inDegree = Array(numCourses).fill(0);
  
  // Build graph and calculate in-degrees
  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }
  
  // Find courses with no prerequisites
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }
  
  let completed = 0;
  
  // Process courses
  while (queue.length > 0) {
    const course = queue.shift();
    completed++;
    
    for (let nextCourse of graph[course]) {
      inDegree[nextCourse]--;
      if (inDegree[nextCourse] === 0) {
        queue.push(nextCourse);
      }
    }
  }
  
  return completed === numCourses;
}

/**
 * PATTERN 15: Trie (Prefix Tree)
 * Use: String search, autocomplete, prefix matching
 * Time: O(m) for search, O(m) for insert, Space: O(ALPHABET_SIZE * N * M)
 */

class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  insert(word) {
    let current = this.root;
    
    for (let char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    
    current.isEndOfWord = true;
  }
  
  search(word) {
    let current = this.root;
    
    for (let char of word) {
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    
    return current.isEndOfWord;
  }
  
  startsWith(prefix) {
    let current = this.root;
    
    for (let char of prefix) {
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }
    
    return true;
  }
}`}
              language="tsx"
              readOnly={true}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxOrange} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Pattern Recognition Tip:</strong> Most interview problems are variations of these 15 patterns. Practice recognizing which pattern applies to each problem. Start by identifying the problem type (array, string, tree, graph) and constraints, then match to the appropriate pattern.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Behavioral Interview Techniques */}
      <section id="behavioral-interviews" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4. Behavioral Interview Techniques
              </Heading>
              <Text className={styles.sectionDescription}>
                <strong>The Challenge:</strong> Behavioral interviews assess your soft skills, cultural fit, and how you handle real-world situations. Many technical candidates struggle with these because they focus only on coding.
                <br /><br />
                <strong>The Solution:</strong> Master the STAR method, prepare compelling stories, and learn how to demonstrate leadership, teamwork, problem-solving, and communication skills. Behavioral interviews often determine whether you get the offer, even after passing technical rounds.
              </Text>
            </div>

            <CodeComparison
              language="markdown"
              wrong={`# ❌ BAD: Vague, Unstructured Answer

Interviewer: "Tell me about a time you had a conflict with a team member."

You: "Yeah, so there was this guy on my team who was really difficult 
to work with. He didn't like my approach to something and we had some 
arguments. Eventually we figured it out, but it was annoying. 
I guess we both had to compromise."

# Why this is bad:
- No specific situation
- No clear structure
- Negative tone
- Doesn't show what you learned
- Doesn't demonstrate skills
- Too brief, no depth
- Blames the other person`}
              good={`# ✅ GOOD: STAR Method Answer

Interviewer: "Tell me about a time you had a conflict with a team member."

You: "Sure! Let me walk through this using the STAR framework.

**SITUATION:**
I was working on a feature with a senior developer, let's call him John. 
We disagreed on the architecture approach. I wanted to use a microservices 
pattern for better scalability, while John preferred a monolithic approach 
he was more familiar with. This was blocking progress on a critical feature 
with a tight deadline.

**TASK:**
My responsibility was to find a solution that:
- Met the technical requirements
- Maintained team velocity
- Preserved our working relationship
- Ensured code quality and maintainability

**ACTION:**
I took several steps to resolve this:

1. First, I scheduled a one-on-one meeting to understand John's concerns 
   deeply, rather than discussing in front of the whole team.

2. I researched both approaches thoroughly - gathered case studies, 
   performance benchmarks, and examples from similar projects.

3. I proposed a hybrid approach: start with a modular monolith that 
   could be easily split into microservices later if needed. This addressed 
   John's concerns about complexity while keeping future scalability options open.

4. I created a technical proposal document with pros/cons, trade-offs, 
   and a migration path, and shared it with the entire team for feedback.

5. We held a technical design review where both approaches were discussed 
   objectively, and the team collectively decided on the hybrid approach.

**RESULT:**
- We implemented the solution ahead of schedule
- John and I developed a stronger working relationship and mutual respect
- The modular architecture made it easy to split services later when we scaled
- This experience taught me the value of listening to different perspectives 
  and finding collaborative solutions
- The team adopted this approach for future architectural decisions

**KEY TAKEAWAY:**
I learned that technical disagreements are often about risk tolerance and 
experience. By taking time to understand the other person's perspective and 
finding a middle ground, we can make better decisions together."`}
            />

            <CodeEditor
              code={`// ✅ STAR Method Framework

/**
 * STAR Method: Situation, Task, Action, Result
 * Use this structure for ALL behavioral questions
 */

const starMethod = {
  // SITUATION (1-2 sentences)
  situation: {
    what: 'Set the context briefly',
    include: [
      'Company/project context',
      'Your role',
      'Key people involved',
      'Timeline if relevant'
    ],
    avoid: [
      'Too much background',
      'Irrelevant details',
      'Blaming others',
      'Negative framing'
    ],
    example: \`
      "In my previous role at [Company], I was leading a team of 4 
      developers working on a payment processing feature. We had a 
      2-week deadline to integrate with a new payment gateway due to 
      a compliance requirement."
    \`
  },

  // TASK (1-2 sentences)
  task: {
    what: 'Your responsibility or challenge',
    include: [
      'What you needed to accomplish',
      'Constraints or challenges',
      'Success criteria'
    ],
    example: \`
      "My responsibility was to ensure we met the deadline while 
      maintaining code quality, coordinating with the payment gateway 
      team, and ensuring the rest of the team understood the integration."
    \`
  },

  // ACTION (Bulk of answer - 60-70%)
  action: {
    what: 'What YOU did specifically',
    include: [
      'Specific steps you took',
      'Decisions you made',
      'How you approached the problem',
      'Skills you demonstrated',
      'Use "I" not "we" (shows ownership)'
    ],
    structure: [
      'Step 1: What you did',
      'Step 2: Why you did it',
      'Step 3: How you did it',
      'Step 4: Who you involved',
      'Step 5: What you learned/adapted'
    ],
    example: \`
      "I took several actions:
      
      1. First, I broke down the work into smaller tasks and created 
         a detailed project plan with daily checkpoints.
      
      2. I reached out to the payment gateway support team proactively 
         to understand their API documentation and get answers to technical 
         questions before we started coding.
      
      3. I assigned tasks based on each team member's strengths - gave the 
         authentication work to someone with security experience, and API 
         integration to someone familiar with REST APIs.
      
      4. I implemented daily standups and a shared Slack channel for quick 
         questions to ensure we stayed aligned.
      
      5. When we hit an unexpected API limitation on day 5, I immediately 
         researched workarounds, consulted with the gateway team, and 
         pivoted our approach without delaying the timeline."
    \`
  },

  // RESULT (1-2 sentences + metrics)
  result: {
    what: 'Outcome and what you learned',
    include: [
      'Quantifiable outcomes (numbers, percentages)',
      'Impact on team/company',
      'What you learned',
      'How it improved things',
      'Skills you developed'
    ],
    metrics: [
      'Time saved/delivered',
      'Performance improvements',
      'Cost savings',
      'Team satisfaction',
      'Code quality metrics'
    ],
    example: \`
      "The results were:
      - We delivered the feature 2 days ahead of schedule
      - Zero critical bugs in production
      - Reduced payment processing latency by 30%
      - Team satisfaction score improved as we established better 
        collaboration practices
      
      I learned the importance of proactive communication and breaking 
      down complex tasks. This experience also improved my project 
      management and cross-functional collaboration skills."
    \`
  }
};

// ✅ Common Behavioral Questions & Answer Strategies

const behavioralQuestions = {
  leadership: {
    questions: [
      'Tell me about a time you led a project',
      'Describe a situation where you had to influence without authority',
      'Give an example of when you mentored someone'
    ],
    skills: ['Communication', 'Decision-making', 'Empowerment', 'Vision'],
    example: \`
      Question: "Tell me about a time you led a project"
      
      STAR Answer:
      - S: Cross-functional project to refactor legacy codebase
      - T: Lead 6-person team, ensure no production issues, 3-month timeline
      - A: Created migration plan, held tech sessions, pair programming, 
           daily syncs, risk mitigation
      - R: Completed 2 weeks early, 40% code reduction, zero downtime, 
           team learned new patterns
    \`
  },

  conflict: {
    questions: [
      'Tell me about a time you disagreed with your manager',
      'Describe a conflict with a coworker and how you resolved it',
      'Give an example of handling a difficult team member'
    ],
    skills: ['Communication', 'Empathy', 'Problem-solving', 'Diplomacy'],
    example: \`
      Question: "Tell me about a conflict with a coworker"
      
      STAR Answer:
      - S: Code review disagreement on architecture approach
      - T: Find solution that works technically and maintains relationship
      - A: Private discussion, research both approaches, propose compromise, 
           technical design review
      - R: Better solution chosen, stronger relationship, process improved
    \`
  },

  failure: {
    questions: [
      'Tell me about a time you failed',
      'Describe a mistake you made and what you learned',
      'Give an example of when you missed a deadline'
    ],
    skills: ['Self-awareness', 'Learning', 'Accountability', 'Resilience'],
    tip: 'Choose a failure that led to growth, not a catastrophic one',
    example: \`
      Question: "Tell me about a time you failed"
      
      STAR Answer:
      - S: Performance issue in production that I initially missed
      - T: Fix the issue and prevent recurrence
      - A: Immediate fix deployment, root cause analysis, created monitoring, 
           documented learnings, shared with team
      - R: Issue resolved in 2 hours, new alerts prevented 3 similar issues, 
           team adopted new practices, I became more thorough in code reviews
    \`
  },

  teamwork: {
    questions: [
      'Tell me about working in a team',
      'Describe your ideal team',
      'Give an example of collaboration'
    ],
    skills: ['Collaboration', 'Communication', 'Flexibility', 'Support'],
    example: \`
      Question: "Tell me about working in a team"
      
      STAR Answer:
      - S: Agile team of 5 developers building e-commerce platform
      - T: Deliver features while maintaining high code quality and team velocity
      - A: Active participation in planning, code reviews, knowledge sharing, 
           helping teammates, retrospectives
      - R: Team velocity increased 25%, zero blockers, high team satisfaction, 
           knowledge spread across team
    \`
  },

  problemSolving: {
    questions: [
      'Tell me about a challenging technical problem',
      'Describe a time you had to learn something quickly',
      'Give an example of creative problem-solving'
    ],
    skills: ['Analytical thinking', 'Learning agility', 'Creativity', 'Persistence'],
    example: \`
      Question: "Tell me about a challenging technical problem"
      
      STAR Answer:
      - S: Critical bug causing 10% request failures, unclear root cause
      - T: Identify and fix the issue within 4 hours
      - A: Collected logs, reproduced issue, used debugging tools, 
           consulted documentation, reached out to library maintainers, 
           found race condition, implemented fix
      - R: Issue resolved, 100% success rate restored, documented for team, 
           improved testing to catch similar issues
    \`
  },

  communication: {
    questions: [
      'Tell me about explaining something technical to a non-technical person',
      'Describe a time you had to present to stakeholders',
      'Give an example of written communication'
    ],
    skills: ['Clarity', 'Empathy', 'Adaptability', 'Persuasion'],
    example: \`
      Question: "Tell me about explaining something technical"
      
      STAR Answer:
      - S: Product manager needed to understand why we needed 2 extra weeks
      - T: Explain technical debt issues in business terms
      - A: Created visual diagram, used analogies, focused on business impact, 
           proposed solutions, Q&A session
      - R: PM understood and supported extension, relationship improved, 
           process for technical communication established
    \`
  }
};

// ✅ Answer Preparation Template

const storyTemplate = {
  project: {
    situation: '[Project context, your role, timeline]',
    task: '[What you needed to accomplish]',
    action: [
      '[Specific step 1]',
      '[Specific step 2]',
      '[Specific step 3]'
    ],
    result: '[Outcome + metrics + learnings]'
  },
  
  leadership: {
    situation: '[Team/project context, challenge]',
    task: '[Leadership responsibility]',
    action: [
      '[How you led/influenced]',
      '[Decisions you made]',
      '[How you supported team]'
    ],
    result: '[Team success + your growth]'
  },
  
  failure: {
    situation: '[Context, what went wrong]',
    task: '[Fix the issue, learn from it]',
    action: [
      '[How you addressed it]',
      '[What you learned]',
      '[Prevention measures]'
    ],
    result: '[Outcome + improvements made]'
  },
  
  conflict: {
    situation: '[Context, disagreement]',
    task: '[Resolve while maintaining relationship]',
    action: [
      '[How you approached it]',
      '[Communication strategy]',
      '[Finding solution]'
    ],
    result: '[Resolution + relationship + learnings]'
  }
};

// ✅ Tips for Behavioral Interviews

const behavioralTips = {
  preparation: [
    'Prepare 8-10 stories covering different situations',
    'Use STAR method for all answers',
    'Practice out loud (record yourself)',
    'Quantify results with metrics',
    'Have 2-3 stories for each category (leadership, conflict, failure, etc.)'
  ],
  
  delivery: [
    'Be specific and concrete (avoid vague answers)',
    'Use "I" not "we" (show your contribution)',
    'Show enthusiasm and energy',
    'Be authentic (don\'t memorize word-for-word)',
    'Keep answers 2-3 minutes',
    'End with what you learned'
  ],
  
  redFlags: [
    'Blaming others',
    'Taking all credit',
    'Being too negative',
    'Not learning from mistakes',
    'Lack of self-awareness',
    'Poor communication'
  ],
  
  positiveSignals: [
    'Clear structure (STAR)',
    'Specific examples',
    'Quantifiable results',
    'Shows growth mindset',
    'Demonstrates skills',
    'Authentic and genuine'
  ]
};`}
              language="tsx"
              readOnly={true}
            />

            <div className={`${styles.infoBox} ${styles.infoBoxBlue} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Key Insight:</strong> Behavioral interviews are your chance to show who you are beyond coding. Prepare 8-10 stories using the STAR method covering leadership, conflict resolution, failure, teamwork, and problem-solving. Practice telling these stories naturally—you want to sound authentic, not rehearsed.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>

      {/* Practice Strategy */}
      <section id="practice-strategy" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5. Interview Practice Strategy
              </Heading>
              <Text className={styles.sectionDescription}>
                Effective interview preparation requires a structured practice plan. Learn how to practice efficiently, what to focus on, and how to track your progress. Most candidates practice too much on easy problems or don't practice communicating their solutions.
              </Text>
            </div>

            <CodeEditor
              code={`// ✅ 8-Week Interview Preparation Plan

const interviewPreparationPlan = {
  week1_2: {
    focus: 'Foundation & Pattern Recognition',
    activities: [
      'Review data structures (arrays, linked lists, trees, graphs, hash tables)',
      'Review algorithms (sorting, searching, recursion, dynamic programming)',
      'Learn the 15 essential patterns',
      'Solve 3 easy problems per day focusing on recognizing patterns',
      'Practice explaining solutions out loud'
    ],
    resources: [
      'LeetCode Easy problems',
      'Pattern recognition exercises',
      'Data structure fundamentals review'
    ]
  },

  week3_4: {
    focus: 'Medium Problems & System Design Basics',
    activities: [
      'Solve 2-3 medium problems per day',
      'Practice STAR method for behavioral questions',
      'Study system design fundamentals',
      'Practice coding interviews with friends',
      'Time yourself (45 minutes per problem)'
    ],
    resources: [
      'LeetCode Medium problems',
      'System design primer',
      'Behavioral question bank'
    ]
  },

  week5_6: {
    focus: 'Hard Problems & System Design',
    activities: [
      'Solve 1-2 hard problems per day',
      'Practice system design problems',
      'Mock interviews (technical + behavioral)',
      'Focus on communication and time management',
      'Review common mistakes'
    ],
    resources: [
      'LeetCode Hard problems',
      'System design interview questions',
      'Mock interview platforms'
    ]
  },

  week7_8: {
    focus: 'Mock Interviews & Refinement',
    activities: [
      '2-3 mock interviews per week',
      'Focus on weaknesses identified',
      'Practice company-specific questions',
      'Refine STAR stories',
      'Practice system design presentations'
    ],
    resources: [
      'Company-specific LeetCode questions',
      'System design practice problems',
      'Behavioral interview practice'
    ]
  }
};

// ✅ Daily Practice Routine

const dailyPractice = {
  morning: {
    duration: '1 hour',
    activities: [
      '1 coding problem (medium or hard)',
      'Practice explaining solution',
      'Review time complexity',
      'Note patterns used'
    ]
  },
  
  afternoon: {
    duration: '30 minutes',
    activities: [
      'System design topic study',
      'Or behavioral question practice',
      'Or review previous mistakes'
    ]
  },
  
  evening: {
    duration: '30 minutes',
    activities: [
      'Review solutions',
      'Read discussions',
      'Update notes',
      'Plan next day'
    ]
  }
};

// ✅ Problem-Solving Practice Framework

const practiceFramework = {
  step1_read: {
    time: '2-3 minutes',
    action: 'Read problem 2-3 times carefully',
    checklist: [
      'Understand inputs and outputs',
      'Identify constraints',
      'Note examples and edge cases'
    ]
  },
  
  step2_clarify: {
    time: '1-2 minutes',
    action: 'Ask clarifying questions (even if practicing alone)',
    questions: [
      'What if input is empty?',
      'Are there duplicates?',
      'What about negative numbers?',
      'Any space/time constraints?'
    ]
  },
  
  step3_approach: {
    time: '5-10 minutes',
    action: 'Discuss approach before coding',
    include: [
      'Multiple approaches considered',
      'Time/space complexity',
      'Trade-offs',
      'Why you chose this approach'
    ]
  },
  
  step4_code: {
    time: '15-20 minutes',
    action: 'Code with explanation',
    practices: [
      'Comment complex logic',
      'Use meaningful variable names',
      'Explain as you code',
      'Handle edge cases'
    ]
  },
  
  step5_test: {
    time: '5 minutes',
    action: 'Test with examples',
    include: [
      'Walk through code manually',
      'Test edge cases',
      'Verify correctness',
      'Check for bugs'
    ]
  },
  
  step6_optimize: {
    time: '5 minutes',
    action: 'Analyze and optimize',
    consider: [
      'Can time complexity be improved?',
      'Can space complexity be improved?',
      'Is code readable?',
      'Are there edge cases missed?'
    ]
  }
};

// ✅ Tracking Progress

const progressTracking = {
  problems: {
    track: [
      'Problem difficulty',
      'Time taken',
      'Pattern used',
      'Did you solve it?',
      'Mistakes made',
      'Key learnings'
    ],
    template: \`
      Date: [Date]
      Problem: [Name/URL]
      Difficulty: [Easy/Medium/Hard]
      Pattern: [Two Pointers, etc.]
      Time: [Minutes]
      Solved: [Yes/No]
      Mistakes: [What went wrong]
      Learning: [Key takeaway]
    \`
  },
  
  systemDesign: {
    track: [
      'Design topic',
      'Time spent',
      'Components designed',
      'Questions asked',
      'Feedback received'
    ]
  },
  
  behavioral: {
    track: [
      'Question type',
      'Story used',
      'STAR completeness',
      'Delivery quality',
      'Feedback'
    ]
  }
};

// ✅ Common Mistakes to Avoid

const commonMistakes = {
  coding: [
    'Jumping to code without understanding',
    'Not clarifying requirements',
    'Not considering edge cases',
    'Not explaining thought process',
    'Giving up too early',
    'Not optimizing after solving',
    'Poor variable naming',
    'Not testing thoroughly'
  ],
  
  systemDesign: [
    'Not clarifying requirements',
    'Jumping to implementation',
    'Not discussing scale',
    'Single point of failure',
    'Not discussing trade-offs',
    'Over-engineering',
    'Not drawing diagrams',
    'Not engaging with interviewer'
  ],
  
  behavioral: [
    'Not using STAR method',
    'Being too vague',
    'Blaming others',
    'No quantifiable results',
    'Negative tone',
    'Too long or too short',
    'Not being authentic',
    'Not showing growth'
  ]
};

// ✅ Interview Day Checklist

const interviewDayChecklist = {
  technical: [
    'Confirm interview time and format',
    'Test your setup (coding environment, internet)',
    'Have water and notes nearby',
    'Review key patterns and algorithms',
    'Practice explaining a problem out loud',
    'Get good sleep the night before'
  ],
  
  systemDesign: [
    'Review common system design patterns',
    'Practice drawing diagrams',
    'Review scale numbers',
    'Practice capacity estimation',
    'Review trade-offs discussion points'
  ],
  
  behavioral: [
    'Review your STAR stories',
    'Prepare questions to ask interviewer',
    'Research the company',
    'Review job description',
    'Prepare questions about team/role'
  ]
};

// ✅ Questions to Ask Interviewer

const questionsToAsk = {
  technical: [
    'What does a typical day look like for this role?',
    'What technical challenges is the team facing?',
    'What is the tech stack and why was it chosen?',
    'How does the team approach code reviews?',
    'What is the deployment process like?'
  ],
  
  team: [
    'How is the team structured?',
    'What is the team culture like?',
    'How does the team collaborate?',
    'What opportunities are there for mentorship?',
    'How does the team handle technical disagreements?'
  ],
  
  growth: [
    'What are the growth opportunities?',
    'How does the company support learning?',
    'What does career progression look like?',
    'Are there opportunities to work on different projects?',
    'How does the company handle promotions?'
  ]
};`}
              language="tsx"
              readOnly={true}
            />
          </Stack>
        </Card>
      </section>

      {/* Conclusion */}
      <section id="conclusion" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <Heading level={2} className={styles.sectionTitle}>
              Conclusion
            </Heading>
            <Text className={styles.sectionDescription}>
              Interview preparation is a skill that improves with practice. The key is to:
            </Text>
            <ul style={{ color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li><strong>Practice systematically:</strong> Focus on patterns, not just random problems</li>
              <li><strong>Communicate clearly:</strong> Explain your thinking process out loud</li>
              <li><strong>Prepare stories:</strong> Have STAR stories ready for behavioral questions</li>
              <li><strong>Think in systems:</strong> Practice system design with structured approach</li>
              <li><strong>Learn from mistakes:</strong> Review what went wrong and improve</li>
              <li><strong>Stay consistent:</strong> Regular practice is better than cramming</li>
            </ul>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen} mt-6`}>
              <Text className={styles.infoText}>
                <strong>Final Tip:</strong> Interviews are a two-way street. While you're demonstrating your skills, you're also evaluating if the company and role are right for you. Come prepared with thoughtful questions, engage genuinely with the interviewer, and remember that interview performance doesn't define your worth as a developer.
              </Text>
            </div>
          </Stack>
        </Card>
      </section>
    </BlogContentLayout>
  );
}


