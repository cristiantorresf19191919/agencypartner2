/**
 * Soft Skills Interview Questions for Developers
 * 40 comprehensive behavioral interview questions with frameworks and sample answers
 */

export type SoftSkillCategory =
  | "Communication"
  | "Teamwork"
  | "Problem Solving"
  | "Leadership"
  | "Adaptability"
  | "Conflict Resolution"
  | "Time Management"
  | "Growth Mindset";

export interface SoftSkillQuestion {
  id: string;
  questionNumber: number;
  title: string;
  category: SoftSkillCategory;
  question: string;
  context: string;
  whyAsked: string;
  commonMistakes: string[];
  answerFramework: string;
  sampleAnswer: string;
  keyPoints: string[];
  followUpQuestions: string[];
}

export const SOFT_SKILLS_QUESTIONS: SoftSkillQuestion[] = [
  // ============ Communication (1-5) ============
  {
    id: "ss-1-explain-technical-concept",
    questionNumber: 1,
    title: "Explain a Technical Concept to Non-Technical Stakeholders",
    category: "Communication",
    question: "Tell me about a time when you had to explain a complex technical concept to a non-technical stakeholder. How did you approach it?",
    context: "Developers often need to communicate with product managers, designers, clients, or executives who may not have technical backgrounds. This question assesses your ability to bridge the communication gap.",
    whyAsked: "Interviewers want to see if you can simplify complexity without being condescending, use appropriate analogies, and ensure understanding.",
    commonMistakes: [
      "Using too much jargon or technical terms without explanation",
      "Being condescending or impatient",
      "Giving a vague answer without a specific example",
      "Not checking for understanding"
    ],
    answerFramework: "Use the STAR method: Situation (set the scene), Task (what needed to be communicated), Action (your approach), Result (outcome and feedback received).",
    sampleAnswer: `In my previous role, our team needed approval from the marketing department to migrate our email system to a new API. The marketing team was concerned about potential disruptions.

I scheduled a 30-minute meeting where I used the analogy of switching from a local post office to a courier service. I explained that while both deliver mail, the courier (new API) offers tracking, faster delivery, and better reliability.

I created a simple visual diagram showing the before/after flow, avoiding technical terms like 'REST endpoints' or 'webhooks.' Instead, I used phrases like 'automatic notifications' and 'real-time status updates.'

After the presentation, the marketing manager said it was the clearest technical explanation she'd received. We got approval that day, and the migration was completed with zero complaints from the marketing team.`,
    keyPoints: [
      "Choose relatable analogies from everyday life",
      "Use visual aids when possible",
      "Avoid jargon or define it simply",
      "Check for understanding with questions",
      "Focus on benefits, not implementation details"
    ],
    followUpQuestions: [
      "How do you know when your explanation was successful?",
      "What do you do if they still don't understand after your explanation?",
      "How do you handle questions you don't immediately know the answer to?"
    ]
  },
  {
    id: "ss-2-disagree-with-colleague",
    questionNumber: 2,
    title: "Disagreeing with a Colleague's Approach",
    category: "Communication",
    question: "Describe a time when you disagreed with a colleague's technical approach. How did you handle it?",
    context: "Healthy disagreement is normal in software development. This question evaluates your ability to express differing opinions constructively while maintaining professional relationships.",
    whyAsked: "Teams with diverse perspectives build better software. Interviewers want to see you can disagree respectfully and find common ground.",
    commonMistakes: [
      "Describing the colleague negatively or blaming them",
      "Saying you always avoid conflict",
      "Not showing how you sought to understand their perspective",
      "Focusing only on being 'right'"
    ],
    answerFramework: "Focus on: Understanding their perspective first, presenting your concerns with data/examples, finding common ground, and the collaborative resolution.",
    sampleAnswer: `During a code review, a senior colleague proposed using a complex microservices architecture for a feature that I believed could be built more simply as a monolithic module.

Instead of immediately pushing back, I asked questions to understand his reasoning. He was concerned about future scalability. I acknowledged that was valid, then shared my concern about the added complexity for our small team.

I proposed we document both approaches with pros/cons and present them to the team lead. We created a brief technical comparison showing timelines, maintenance overhead, and scalability tradeoffs.

The team decided on a modular monolith approach that could be extracted into services later if needed. My colleague appreciated that I validated his concerns, and we actually became better collaborators after that.`,
    keyPoints: [
      "Seek to understand before being understood",
      "Use 'I' statements instead of 'you' accusations",
      "Back opinions with data or examples",
      "Propose alternatives rather than just criticizing",
      "Focus on the best outcome for the project, not winning"
    ],
    followUpQuestions: [
      "What if they had refused to consider your perspective?",
      "How do you handle disagreements with more senior team members?",
      "Have you ever been wrong in a technical disagreement? What did you learn?"
    ]
  },
  {
    id: "ss-3-receive-critical-feedback",
    questionNumber: 3,
    title: "Receiving Critical Feedback",
    category: "Communication",
    question: "Tell me about a time you received critical feedback on your work. How did you respond?",
    context: "Code reviews, performance reviews, and retrospectives are opportunities for growth. This question assesses your emotional intelligence and growth mindset.",
    whyAsked: "Interviewers want to ensure you can accept feedback gracefully, learn from it, and implement changes without becoming defensive.",
    commonMistakes: [
      "Describing feedback as unfair or unwarranted",
      "Not showing how you actually changed behavior",
      "Being defensive in your answer",
      "Giving an example where you were obviously right"
    ],
    answerFramework: "Structure: The feedback received, your initial reaction, how you processed it, actions you took, and the positive outcome.",
    sampleAnswer: `During a code review, a senior developer told me that my code was 'clever but unmaintainable.' Initially, I felt defensive because I'd spent hours optimizing the solution.

I took a step back and asked her to elaborate. She pointed out that my nested ternaries and one-liners were hard to follow. She said, 'Code is read more than it's written.'

Instead of arguing, I asked if she could show me how she'd approach the same problem. She refactored my 10-line function into 25 lines with clear variable names and comments.

I adopted her approach going forward. Three months later, when I had to debug that same code, I was grateful for the readability. Now I follow the principle that explicit is better than implicit, and I actually mentor others on this.`,
    keyPoints: [
      "Show emotional maturity in your initial reaction",
      "Ask clarifying questions to understand fully",
      "Demonstrate concrete changes you made",
      "Highlight the positive outcome",
      "Show you value feedback as a growth opportunity"
    ],
    followUpQuestions: [
      "How do you differentiate between valid feedback and unfair criticism?",
      "How do you give critical feedback to others?",
      "What's the most impactful feedback you've ever received?"
    ]
  },
  {
    id: "ss-4-communicate-bad-news",
    questionNumber: 4,
    title: "Communicating Bad News to Stakeholders",
    category: "Communication",
    question: "Describe a situation where you had to deliver bad news to a stakeholder or manager. How did you handle it?",
    context: "Projects don't always go as planned. Timelines slip, bugs emerge, and requirements change. This question assesses your integrity and communication skills under pressure.",
    whyAsked: "Transparency and early communication prevent small issues from becoming crises. Interviewers want to see you take ownership rather than hide problems.",
    commonMistakes: [
      "Blaming others or external factors entirely",
      "Describing hiding the issue until it became critical",
      "Not having any solution or mitigation to propose",
      "Being overly apologetic without taking action"
    ],
    answerFramework: "Structure: The bad news, when and how you communicated it, the solutions you proposed, and the outcome.",
    sampleAnswer: `Two weeks before a product launch, I discovered a significant security vulnerability in our authentication flow. Fixing it properly would require delaying the launch by at least a week.

I documented the issue, its potential impact, and three options: delay the launch, launch with a temporary fix and immediate follow-up patch, or limit the initial rollout to reduce risk exposure.

I scheduled a call with my manager within an hour of the discovery. I presented the facts clearly, took responsibility for not catching it earlier in testing, and walked through the options with my recommendations.

My manager appreciated the early notification and thorough analysis. We chose to delay by five days with a limited soft launch. The client was initially disappointed but later thanked us for prioritizing security over speed.`,
    keyPoints: [
      "Communicate early rather than hoping problems resolve",
      "Come prepared with facts and options",
      "Take appropriate responsibility",
      "Focus on solutions, not just the problem",
      "Follow up after the situation is resolved"
    ],
    followUpQuestions: [
      "How do you decide when to escalate issues?",
      "What if your manager had pushed back on delaying?",
      "How do you prevent similar issues in the future?"
    ]
  },
  {
    id: "ss-5-written-communication",
    questionNumber: 5,
    title: "Effective Written Communication",
    category: "Communication",
    question: "How do you ensure your written communication (emails, documentation, Slack messages) is effective? Give an example.",
    context: "Remote work and async communication make written skills essential. This question evaluates your ability to communicate clearly and efficiently in writing.",
    whyAsked: "Poor written communication causes confusion, delays, and friction. Interviewers want to see you can write clearly for different audiences.",
    commonMistakes: [
      "Saying you just write naturally without thought",
      "Not providing a specific example",
      "Ignoring the importance of context and audience",
      "Focusing only on grammar/spelling"
    ],
    answerFramework: "Discuss your process: audience consideration, structure, review, and a specific example with its positive outcome.",
    sampleAnswer: `When writing technical documentation, I follow a structured approach. For a recent API documentation project, I started by identifying my audiences: developers integrating the API, and support staff troubleshooting issues.

For each endpoint, I used a consistent template: what it does (one sentence), when to use it, required parameters with examples, success/error responses, and common gotchas.

I had a colleague with less API experience review it before publishing. She pointed out two areas where I'd assumed knowledge that beginners wouldn't have.

After revisions, we published the docs. Support tickets related to API integration dropped by 40% in the following month. The sales team even started using the docs in demos because they were that clear.`,
    keyPoints: [
      "Consider your audience's knowledge level",
      "Use consistent structure and formatting",
      "Include examples for complex concepts",
      "Get feedback before finalizing",
      "Keep messages concise but complete"
    ],
    followUpQuestions: [
      "How do you handle misunderstandings from written communication?",
      "When do you prefer written vs. verbal communication?",
      "How do you document technical decisions?"
    ]
  },

  // ============ Teamwork (6-10) ============
  {
    id: "ss-6-cross-functional-collaboration",
    questionNumber: 6,
    title: "Cross-Functional Team Collaboration",
    category: "Teamwork",
    question: "Tell me about a successful project where you worked with people from different disciplines (design, product, QA). What made it successful?",
    context: "Modern software development requires collaboration across design, product, engineering, and QA. This question assesses your ability to work effectively with diverse skill sets.",
    whyAsked: "Siloed teams ship worse products. Interviewers want to see you value and leverage diverse perspectives.",
    commonMistakes: [
      "Focusing only on your own contributions",
      "Describing other disciplines as obstacles",
      "Not explaining your specific role in collaboration",
      "Giving a vague answer without concrete practices"
    ],
    answerFramework: "Describe the project, the different disciplines involved, specific collaboration practices, your role, and the successful outcome.",
    sampleAnswer: `I led the frontend development for a checkout redesign project involving a product manager, UX designer, two backend developers, and a QA engineer.

We started with a kickoff where everyone shared their concerns and constraints. The designer was worried about implementation fidelity; I assured her we'd do pixel-perfect implementation and invited her to our frontend reviews.

We established a shared Figma-to-code handoff process with component annotations. I created a shared Slack channel and proposed daily 15-minute syncs during the two-week sprint.

When QA found edge cases the designer hadn't considered, I facilitated a quick session where we solved them together. The backend team appreciated early API feedback from my frontend perspective.

The project shipped on time with zero critical bugs. Our NPS score for checkout increased by 15 points. More importantly, the team asked to work together again.`,
    keyPoints: [
      "Establish clear communication channels early",
      "Understand each discipline's concerns and constraints",
      "Create shared artifacts everyone can reference",
      "Facilitate rather than dominate discussions",
      "Celebrate collective wins, not individual contributions"
    ],
    followUpQuestions: [
      "How do you handle conflicts between disciplines?",
      "What do you do when a designer's vision isn't technically feasible?",
      "How do you ensure QA is involved early enough?"
    ]
  },
  {
    id: "ss-7-help-struggling-teammate",
    questionNumber: 7,
    title: "Helping a Struggling Teammate",
    category: "Teamwork",
    question: "Describe a time when a teammate was struggling with their work. How did you help them?",
    context: "Strong teams support each other. This question evaluates your empathy, mentoring ability, and willingness to help others succeed.",
    whyAsked: "Team players lift others up. Interviewers want to see you care about collective success, not just your own.",
    commonMistakes: [
      "Making yourself the hero of the story",
      "Describing the teammate as incompetent",
      "Just doing their work for them",
      "Not respecting their autonomy or dignity"
    ],
    answerFramework: "Describe how you noticed the struggle, how you approached them, the support you provided, and the outcome for them.",
    sampleAnswer: `A junior developer on my team was taking much longer than expected on a feature and seemed stressed during standups. Instead of waiting for the deadline to pass, I approached him after a meeting.

I said, 'I remember feeling overwhelmed when I started here. Would it help to pair program for an hour?' He seemed relieved and agreed.

We discovered he understood the requirements but was stuck on an unfamiliar library. Rather than taking over, I guided him through the documentation and asked questions to help him reason through solutions.

Over two sessions, he completed the feature himself. I also shared some learning resources for that library. A few weeks later, he was helping another new team member with the same tool.

The key was offering help without judgment and ensuring he owned the solution so he could build confidence.`,
    keyPoints: [
      "Notice early signs of struggle (don't wait for failure)",
      "Approach with empathy, not criticism",
      "Guide rather than do it for them",
      "Respect their autonomy and dignity",
      "Follow up to ensure continued success"
    ],
    followUpQuestions: [
      "How do you balance helping others with your own workload?",
      "What if someone refuses help but clearly needs it?",
      "How do you give feedback to struggling teammates?"
    ]
  },
  {
    id: "ss-8-remote-team-collaboration",
    questionNumber: 8,
    title: "Remote Team Collaboration",
    category: "Teamwork",
    question: "How do you build relationships and collaborate effectively with teammates in different time zones?",
    context: "Distributed teams are now common. This question assesses your async communication skills and ability to maintain team cohesion remotely.",
    whyAsked: "Remote work requires intentional effort to build trust and maintain productivity. Interviewers want to see you can thrive in distributed environments.",
    commonMistakes: [
      "Saying remote work is easy for you without specifics",
      "Not addressing time zone challenges",
      "Ignoring the human/social aspect of remote teams",
      "Relying only on scheduled meetings"
    ],
    answerFramework: "Discuss specific practices for async communication, time zone overlap strategies, and relationship building in remote settings.",
    sampleAnswer: `On my last team, we had developers in California, Poland, and India spanning 13 hours of time zones.

For async work, I started every PR with a detailed description explaining not just what but why, making reviews easier for colleagues reviewing while I slept. I used Loom videos for complex explanations that would take multiple messages.

We identified a 2-hour overlap window and protected it for collaborative work like architecture discussions and pair programming. For non-urgent items, we used Slack threads with clear deadlines.

To build relationships, we had optional monthly 'coffee chats' where we'd randomly pair people for 30-minute non-work conversations. I learned about my Polish colleague's hiking hobby and my Indian teammate's passion for cooking.

After six months, we had the highest team engagement scores in the company despite being fully remote. Our async documentation also made onboarding new members much faster.`,
    keyPoints: [
      "Over-communicate in async messages with context",
      "Use video for complex explanations",
      "Protect overlap time for collaboration",
      "Build relationships intentionally",
      "Document decisions for async visibility"
    ],
    followUpQuestions: [
      "How do you handle urgent issues outside working hours?",
      "What tools have you found most effective for remote work?",
      "How do you prevent remote work burnout?"
    ]
  },
  {
    id: "ss-9-new-team-contribution",
    questionNumber: 9,
    title: "Contributing to a New Team",
    category: "Teamwork",
    question: "Tell me about a time you joined a new team. How did you ramp up and start contributing?",
    context: "Onboarding effectively shows self-sufficiency and learning ability. This question evaluates how you adapt to new environments and establish yourself.",
    whyAsked: "New hires need to become productive quickly. Interviewers want to see you can navigate ambiguity and integrate smoothly.",
    commonMistakes: [
      "Claiming you figured everything out alone",
      "Not showing how you asked for help appropriately",
      "Criticizing the previous code/team",
      "Describing passive onboarding without initiative"
    ],
    answerFramework: "Describe how you learned the codebase/processes, built relationships, and made initial contributions that added value.",
    sampleAnswer: `When I joined my current company, the codebase was 5 years old with limited documentation.

In my first week, I focused on listening and understanding. I scheduled 1:1s with each team member to learn about their areas of expertise and what they wished someone would fix. I took detailed notes and created a personal wiki of domain knowledge.

For code, I started by tracing through the main user flows with a debugger, asking questions in our team channel when stuck. I made my first PR a documentation improvement for the area that confused me most, which veteran engineers appreciated.

By week three, I'd identified a recurring bug in our integration tests that everyone had accepted as flaky. I proposed a fix, got feedback, and shipped it. This built credibility and showed I could contribute while still learning.

After a month, I was picking up feature work and had become the go-to person for questions about the area I'd documented.`,
    keyPoints: [
      "Listen and learn before suggesting changes",
      "Build relationships through 1:1 conversations",
      "Document your learning to help future hires",
      "Find quick wins that add value early",
      "Ask questions openly to show engagement"
    ],
    followUpQuestions: [
      "How long does it typically take you to feel fully productive?",
      "What would you do differently if onboarding again?",
      "How do you handle imposter syndrome when starting?"
    ]
  },
  {
    id: "ss-10-take-team-input",
    questionNumber: 10,
    title: "Incorporating Team Feedback",
    category: "Teamwork",
    question: "Describe a time when your team disagreed with your proposed solution. How did you handle their input?",
    context: "Good solutions often emerge from diverse perspectives. This question evaluates your openness to feedback and collaborative problem-solving.",
    whyAsked: "Interviewers want to see you can put team success above personal preference and genuinely consider others' input.",
    commonMistakes: [
      "Describing how you convinced them you were right",
      "Dismissing their concerns as uninformed",
      "Not showing genuine consideration of alternatives",
      "Taking feedback personally"
    ],
    answerFramework: "Describe your proposal, the team's concerns, how you explored alternatives together, and the final decision.",
    sampleAnswer: `I proposed migrating our monolithic application to microservices to improve scalability. During the tech spec review, several teammates pushed back hard.

Instead of defending my position, I asked each person to share their specific concerns. A senior engineer worried about operational complexity. A junior developer was concerned about learning curve. Our DevOps lead pointed out our monitoring wasn't ready for distributed systems.

I realized I'd been focused on the ideal end state without considering our team's current capabilities and constraints. I proposed we create a decision matrix weighing pros/cons of microservices vs. modular monolith vs. hybrid approach.

After the analysis, we chose a modular monolith that could be decomposed later. It addressed the scalability concerns while being realistic about our team's current state.

Looking back, my original proposal would have caused significant problems. The team's input made the final solution much better.`,
    keyPoints: [
      "Welcome disagreement as valuable input",
      "Ask clarifying questions to understand concerns",
      "Evaluate alternatives objectively",
      "Be willing to change your mind with good reasoning",
      "Credit the team for the improved solution"
    ],
    followUpQuestions: [
      "How do you handle situations where the team can't reach consensus?",
      "What if you're still convinced your approach was better?",
      "How do you build a culture where people feel safe disagreeing?"
    ]
  },

  // ============ Problem Solving (11-15) ============
  {
    id: "ss-11-approach-unfamiliar-problem",
    questionNumber: 11,
    title: "Approaching an Unfamiliar Problem",
    category: "Problem Solving",
    question: "Tell me about a time you had to solve a problem in a domain or technology you weren't familiar with.",
    context: "Developers constantly face new challenges. This question assesses your learning ability and problem-solving approach under uncertainty.",
    whyAsked: "Technology changes rapidly. Interviewers want to see you can navigate unfamiliar territory effectively.",
    commonMistakes: [
      "Claiming you already knew everything",
      "Not showing your learning process",
      "Describing paralysis from uncertainty",
      "Not leveraging available resources"
    ],
    answerFramework: "Describe the unfamiliar area, your learning approach, how you applied new knowledge, and the successful outcome.",
    sampleAnswer: `I was asked to implement real-time notifications using WebSockets, a technology I'd never used before.

I started by spending two hours reading documentation and watching a tutorial to understand the core concepts. Then I sketched the system architecture on paper before writing any code.

I found an open-source chat application using similar technology and studied its implementation. Rather than copying, I understood the patterns and applied them to our use case.

For unknowns, I created small proof-of-concept experiments. When stuck on connection handling, I reached out to a colleague who'd used WebSockets before. A 20-minute conversation saved me hours of trial and error.

I delivered the feature on time. It handled 10,000 concurrent connections in load testing. More importantly, I documented my learnings so the next person wouldn't start from zero.`,
    keyPoints: [
      "Start with foundational understanding before coding",
      "Learn from existing implementations",
      "Build small experiments to test assumptions",
      "Know when to ask for help",
      "Document learnings for others"
    ],
    followUpQuestions: [
      "How do you decide how much to learn before starting?",
      "What resources do you typically use for learning?",
      "How do you handle pressure to deliver while learning?"
    ]
  },
  {
    id: "ss-12-debug-complex-issue",
    questionNumber: 12,
    title: "Debugging a Complex Issue",
    category: "Problem Solving",
    question: "Walk me through your process for debugging a particularly challenging issue.",
    context: "Debugging is a core developer skill. This question evaluates your systematic approach and persistence when facing difficult problems.",
    whyAsked: "Interviewers want to see logical thinking, systematic approaches, and ability to handle frustration productively.",
    commonMistakes: [
      "Describing random trial and error",
      "Not explaining your thought process",
      "Skipping steps in your debugging method",
      "Not using available tools and resources"
    ],
    answerFramework: "Walk through a specific bug: how you reproduced it, narrowed down the cause, verified the fix, and prevented recurrence.",
    sampleAnswer: `We had a production issue where users randomly couldn't log in. It happened once every few hundred requests, making reproduction difficult.

First, I gathered data: affected users, timestamps, server logs, and any error messages. I noticed the failures clustered around specific time windows.

I hypothesized it could be race condition, memory issue, or external dependency. I added detailed logging to the authentication flow and deployed to staging with synthetic traffic.

After analyzing logs, I narrowed it to our session cache. Under high load, the cache write and subsequent read were racing. I reproduced it locally with a load testing script.

The fix was adding appropriate locking. I wrote a regression test that simulated the race condition. Then I created a runbook for similar issues, including the logging approach that helped identify it.

The bug never recurred, and the runbook helped us solve two similar issues faster later.`,
    keyPoints: [
      "Gather data before hypothesizing",
      "Form and test hypotheses systematically",
      "Reproduce the issue reliably before fixing",
      "Verify fixes with tests",
      "Document for future reference"
    ],
    followUpQuestions: [
      "What's the hardest bug you've ever solved?",
      "How do you handle bugs you can't reproduce?",
      "When do you decide to ask for help while debugging?"
    ]
  },
  {
    id: "ss-13-technical-tradeoff-decision",
    questionNumber: 13,
    title: "Making Technical Tradeoff Decisions",
    category: "Problem Solving",
    question: "Describe a situation where you had to choose between multiple technical approaches with different tradeoffs.",
    context: "Engineering is about tradeoffs. This question assesses your decision-making process and ability to weigh competing concerns.",
    whyAsked: "There's rarely a perfect solution. Interviewers want to see you can evaluate options and make defensible decisions.",
    commonMistakes: [
      "Describing the choice as obvious",
      "Not explaining the tradeoffs clearly",
      "Making the decision alone without input",
      "Not considering long-term implications"
    ],
    answerFramework: "Present the problem, the options considered with their tradeoffs, your decision-making process, and the outcome.",
    sampleAnswer: `We needed to add search functionality to our e-commerce platform. The options were: build with PostgreSQL full-text search, integrate Elasticsearch, or use a managed search service like Algolia.

PostgreSQL was simplest with no new infrastructure, but limited in features and would degrade under heavy load. Elasticsearch was powerful but required DevOps investment and expertise we didn't have. Algolia was feature-rich and managed, but expensive at scale.

I created a decision matrix weighing: implementation time, ongoing maintenance, scalability, cost at different traffic levels, and team expertise.

I presented this to the team and product manager. Given our timeline and team size, we chose Algolia for MVP with a plan to evaluate migration to Elasticsearch if costs became prohibitive after reaching scale.

We launched search in two weeks instead of two months. Costs were higher but acceptable for our traffic level. We documented the evaluation so future decisions had context.`,
    keyPoints: [
      "Identify all viable options",
      "List tradeoffs for each option clearly",
      "Consider short-term and long-term implications",
      "Involve stakeholders in the decision",
      "Document reasoning for future reference"
    ],
    followUpQuestions: [
      "How do you handle regret if a decision turns out wrong?",
      "When is good enough better than perfect?",
      "How do you balance technical ideal with business constraints?"
    ]
  },
  {
    id: "ss-14-improve-inefficient-process",
    questionNumber: 14,
    title: "Improving an Inefficient Process",
    category: "Problem Solving",
    question: "Tell me about a time you identified and improved an inefficient process or workflow.",
    context: "Great developers improve not just code but processes. This question evaluates your initiative and ability to drive improvements.",
    whyAsked: "Interviewers want proactive problem-solvers who make teams more efficient, not just those who accept status quo.",
    commonMistakes: [
      "Describing trivial improvements",
      "Not quantifying the impact",
      "Making changes without team buy-in",
      "Ignoring why the old process existed"
    ],
    answerFramework: "Describe the inefficiency, your analysis, the proposed solution, how you got buy-in, and the measurable impact.",
    sampleAnswer: `Our deployment process took 4 hours of manual work: updating configs, running scripts, and verifying each environment. Deployments were stressful and error-prone.

I tracked each deployment for two weeks, documenting time spent on each step. I found 80% was repetitive and scriptable. The remaining 20% were actual human decisions.

I drafted a proposal to automate the repetitive steps and created a prototype CI/CD pipeline. I presented the time analysis and demo to the team, asking for feedback before committing fully.

With team input, we refined the approach and rolled it out over three sprints. We reduced deployment time from 4 hours to 30 minutes. Errors dropped by 90%.

The team was so happy with the improvement that we started looking for other processes to automate. It created a culture of continuous improvement.`,
    keyPoints: [
      "Quantify the current inefficiency",
      "Understand why the current process exists",
      "Propose solutions with evidence",
      "Get buy-in before major changes",
      "Measure the improvement afterwards"
    ],
    followUpQuestions: [
      "How do you identify which processes to improve?",
      "What if the team resists the change?",
      "How do you balance improvement work with feature delivery?"
    ]
  },
  {
    id: "ss-15-work-with-constraints",
    questionNumber: 15,
    title: "Working Within Tight Constraints",
    category: "Problem Solving",
    question: "Describe a project where you had to deliver with significant constraints (time, budget, resources). How did you succeed?",
    context: "Real-world projects have constraints. This question assesses your ability to prioritize, negotiate, and deliver value under pressure.",
    whyAsked: "Interviewers want to see you can be practical and effective, not just theoretical. Constraints test creativity and prioritization.",
    commonMistakes: [
      "Complaining about the constraints",
      "Describing heroic overtime as the solution",
      "Not showing how you prioritized",
      "Delivering poor quality due to rushing"
    ],
    answerFramework: "Describe the constraints, how you prioritized, what tradeoffs you made, and how you delivered value within limits.",
    sampleAnswer: `We had to launch a competitor response feature in 3 weeks instead of the planned 8 weeks. The full scope was impossible.

I worked with the product manager to identify the must-have vs. nice-to-have features. We cut scope to the core value proposition: three features instead of eight, serving 80% of use cases.

For implementation, I chose proven patterns over novel approaches to reduce risk. I paired with another developer to parallelize work and catch issues early.

We were transparent with stakeholders about what would and wouldn't make the deadline. We shipped the core features on time with acceptable quality. The remaining features were added over the following month.

The launch was successful, and the PM appreciated that we delivered a complete, if smaller, product rather than a buggy full version.`,
    keyPoints: [
      "Negotiate scope rather than quality",
      "Identify the highest-value items",
      "Use proven approaches to reduce risk",
      "Communicate constraints and tradeoffs clearly",
      "Deliver complete small over incomplete large"
    ],
    followUpQuestions: [
      "How do you handle unrealistic deadlines?",
      "When should you push back on constraints?",
      "How do you prevent technical debt from accumulating under pressure?"
    ]
  },

  // ============ Leadership (16-20) ============
  {
    id: "ss-16-lead-without-authority",
    questionNumber: 16,
    title: "Leading Without Formal Authority",
    category: "Leadership",
    question: "Tell me about a time you led an initiative or influenced outcomes without having formal authority.",
    context: "Leadership isn't just for managers. This question assesses your ability to drive change and influence through expertise and collaboration.",
    whyAsked: "Companies value informal leaders who improve teams without needing a title. Interviewers want to see initiative and influence skills.",
    commonMistakes: [
      "Waiting for someone to give you authority",
      "Forcing changes on reluctant teammates",
      "Taking credit for team accomplishments",
      "Confusing leadership with management"
    ],
    answerFramework: "Describe the initiative, how you built consensus, how you led without formal power, and the outcome.",
    sampleAnswer: `I noticed our team had no consistent code style, causing lengthy discussions in every code review. As a mid-level developer, I had no authority to mandate changes.

I started by gathering data: I tracked time spent on style discussions in PRs over a month. Then I researched linting tools and created a proposal with the time savings analysis.

Instead of pushing my solution, I invited interested teammates to a lunch discussion. We collaboratively chose ESLint with a specific config, allowing everyone to feel ownership.

I volunteered to set it up and create the migration plan. I made it easy by handling the tooling myself and offering to help teammates with any lint errors.

Within a month, the whole team adopted it. Code review time dropped 20%. My manager noticed and asked me to lead similar initiatives, which eventually led to a tech lead role.`,
    keyPoints: [
      "Identify problems that affect the team",
      "Build your case with data",
      "Involve others in the solution",
      "Do the work to make adoption easy",
      "Lead through service, not authority"
    ],
    followUpQuestions: [
      "How do you handle resistance to change?",
      "What's the difference between leading and managing?",
      "How do you influence senior colleagues?"
    ]
  },
  {
    id: "ss-17-mentor-junior-developer",
    questionNumber: 17,
    title: "Mentoring a Junior Developer",
    category: "Leadership",
    question: "Describe your experience mentoring someone less experienced. What was your approach and what did they achieve?",
    context: "Growing others multiplies your impact. This question assesses your ability to develop talent and share knowledge effectively.",
    whyAsked: "Senior developers are expected to lift others. Interviewers want to see you can teach and invest in others' growth.",
    commonMistakes: [
      "Describing doing their work for them",
      "Being condescending about their knowledge gaps",
      "Not having a structured approach",
      "Focusing only on technical skills"
    ],
    answerFramework: "Describe the mentee, your approach, specific techniques you used, and their growth over time.",
    sampleAnswer: `I was assigned to mentor a bootcamp graduate joining our team. She had potential but lacked production experience and confidence.

I started by understanding her goals and current skills through a 1:1. We created a 90-day plan with clear milestones: first commit, first PR merged, first feature owned, first production issue resolved.

For each milestone, I provided graduated support. Early on, we paired frequently. As she grew, I shifted to code reviews with detailed feedback. I always explained the 'why' behind suggestions, not just the 'what.'

I also introduced her to other team members who could help with areas outside my expertise. She joined our design critique meetings to understand the product side.

After three months, she was independently shipping features and had the confidence to disagree with my code review comments (with good reasoning!). She's now mentoring the next new hire.`,
    keyPoints: [
      "Understand their goals and starting point",
      "Create clear milestones and expectations",
      "Explain reasoning, not just answers",
      "Gradually increase independence",
      "Celebrate their growth and achievements"
    ],
    followUpQuestions: [
      "How do you handle a mentee who isn't progressing?",
      "What's the most important thing you learned from mentoring?",
      "How do you balance mentoring with your own work?"
    ]
  },
  {
    id: "ss-18-drive-technical-decision",
    questionNumber: 18,
    title: "Driving a Technical Decision",
    category: "Leadership",
    question: "Tell me about a significant technical decision you drove. How did you build consensus and ensure successful execution?",
    context: "Technical leadership involves guiding important decisions. This question assesses your ability to lead technical strategy and bring others along.",
    whyAsked: "Interviewers want to see you can own technical direction, not just implement others' decisions.",
    commonMistakes: [
      "Making unilateral decisions without input",
      "Not considering opposing viewpoints",
      "Failing to follow through on execution",
      "Taking sole credit for team decisions"
    ],
    answerFramework: "Describe the decision, how you researched and proposed it, how you built consensus, and how you ensured successful execution.",
    sampleAnswer: `I identified that our frontend build times had grown to 8 minutes, significantly slowing development. I proposed migrating from Webpack to Vite.

First, I created a technical RFC documenting the problem, proposed solution, alternatives considered, risks, and rollback plan. I shared it for async feedback for a week.

I addressed concerns raised: backward compatibility, learning curve, and migration effort. I created a proof-of-concept with one module showing build time dropping to 30 seconds.

After addressing feedback, I led a team decision meeting. Two engineers had concerns about specific plugins; we agreed to tackle those first. We planned the migration in phases over two sprints.

I paired with teammates on tricky migrations and held office hours for questions. We shipped on time, and build times dropped from 8 minutes to 45 seconds. Developer satisfaction surveys improved significantly.`,
    keyPoints: [
      "Document your proposal formally (RFC/design doc)",
      "Research alternatives and address concerns",
      "Get buy-in before starting execution",
      "Plan execution in manageable phases",
      "Support the team through the change"
    ],
    followUpQuestions: [
      "What if consensus couldn't be reached?",
      "How do you handle technical decisions you disagree with?",
      "What makes a good technical RFC?"
    ]
  },
  {
    id: "ss-19-take-ownership",
    questionNumber: 19,
    title: "Taking Ownership of a Problem",
    category: "Leadership",
    question: "Describe a time when you took ownership of a problem that wasn't strictly your responsibility.",
    context: "Ownership mindset is valued in all roles. This question assesses your initiative and willingness to go beyond your job description.",
    whyAsked: "Great team members see problems and solve them, regardless of formal responsibility. Interviewers want to see this mindset.",
    commonMistakes: [
      "Overstepping without coordination",
      "Taking ownership for credit rather than impact",
      "Not respecting others' domains",
      "Describing situations where you had to be asked"
    ],
    answerFramework: "Describe the problem, why you stepped up, how you approached it respectfully, and the outcome.",
    sampleAnswer: `Our customer support team was overwhelmed with a specific type of bug report. The bug was in a module no one on my team owned, and the responsible team was busy with a critical deadline.

Instead of waiting, I investigated the reports myself. I found the root cause in two hours and created a minimal fix. But rather than just submitting a PR to a codebase I didn't own, I reached out to the owning team's tech lead.

I explained what I'd found and offered to submit the fix with their guidance or hand over my analysis for them to implement. They appreciated the proactive help and asked me to submit the PR with one of their engineers as reviewer.

The bug was fixed within a day instead of waiting two weeks. Support tickets dropped immediately. The other team's lead thanked me and said they wished more people took that approach.`,
    keyPoints: [
      "See a problem, own the solution",
      "Respect existing ownership and coordinate",
      "Offer help rather than taking over",
      "Follow through until resolution",
      "Build relationships, not territory"
    ],
    followUpQuestions: [
      "How do you know when to step in vs. wait?",
      "What if the owning team resented your involvement?",
      "How do you balance ownership with boundaries?"
    ]
  },
  {
    id: "ss-20-rally-team-through-difficulty",
    questionNumber: 20,
    title: "Rallying the Team Through Difficulty",
    category: "Leadership",
    question: "Tell me about a time your team faced a significant challenge or setback. How did you help the team through it?",
    context: "Teams face setbacks. This question assesses your ability to maintain morale and lead through difficult times.",
    whyAsked: "Resilience and positive influence during challenges are valuable leadership traits interviewers look for.",
    commonMistakes: [
      "Downplaying the severity of the challenge",
      "Focusing only on your individual contributions",
      "Not acknowledging team members' struggles",
      "Describing toxic positivity over genuine support"
    ],
    answerFramework: "Describe the challenge, its impact on the team, how you provided support, and how the team emerged.",
    sampleAnswer: `Our major product launch had a critical bug that took down the system for 4 hours on day one. The team was demoralized and worried about job security.

I called a quick team meeting to acknowledge the situation honestly. I said, 'This is tough, and it's okay to feel frustrated. But we're going to fix this together.'

I helped organize the incident response: one group on the fix, another on customer communication, a third on monitoring. I took the monitoring shift so others could focus on the harder technical work.

After we recovered, I pushed back when management wanted an immediate post-mortem. I said the team needed 24 hours to decompress first. We had the post-mortem two days later, focused on learning, not blame.

The team actually grew closer through the crisis. We implemented better safeguards that prevented similar issues. Three months later, several team members mentioned it as a formative experience that strengthened the team.`,
    keyPoints: [
      "Acknowledge challenges honestly",
      "Provide practical structure and support",
      "Protect the team when needed",
      "Focus on learning, not blame",
      "Recognize the team's resilience afterward"
    ],
    followUpQuestions: [
      "How do you maintain your own morale during team struggles?",
      "What if a team member was clearly at fault?",
      "How do you prevent burnout during crises?"
    ]
  },

  // ============ Adaptability (21-25) ============
  {
    id: "ss-21-handle-sudden-priority-change",
    questionNumber: 21,
    title: "Handling Sudden Priority Changes",
    category: "Adaptability",
    question: "Describe a time when priorities suddenly changed mid-project. How did you adapt?",
    context: "Business needs change, and developers must adapt. This question assesses your flexibility and ability to handle disruption.",
    whyAsked: "Rigidity slows teams down. Interviewers want to see you can pivot without losing productivity or morale.",
    commonMistakes: [
      "Complaining about the change",
      "Describing resistance rather than adaptation",
      "Not showing how you managed the transition",
      "Ignoring impact on teammates"
    ],
    answerFramework: "Describe the change, your initial reaction, how you adapted, and the successful outcome.",
    sampleAnswer: `Three weeks into a four-week feature build, we learned a competitor had launched similar functionality. Leadership wanted us to pivot to a different differentiating feature immediately.

My initial reaction was frustration, as we'd invested significant effort. But I took a few minutes to process before responding. Then I focused on what we could salvage.

I analyzed our work: 60% of the code was reusable for the new feature with modifications. I proposed a plan to leadership showing what we could carry forward and what needed to be rebuilt.

I also checked in with my teammate who'd done most of the UI work that would be scrapped. I acknowledged his frustration and pointed out skills he'd gained that would help with the new feature.

We delivered the pivoted feature on time by leveraging our existing work. The competitor-response feature ended up being more valuable than the original plan.`,
    keyPoints: [
      "Process your reaction before responding",
      "Look for what can be salvaged or repurposed",
      "Create a clear transition plan",
      "Support teammates through the change",
      "Find the opportunity in the disruption"
    ],
    followUpQuestions: [
      "How do you handle multiple priority changes?",
      "When should you push back on changes?",
      "How do you communicate priority changes to your team?"
    ]
  },
  {
    id: "ss-22-learn-new-technology-quickly",
    questionNumber: 22,
    title: "Learning a New Technology Quickly",
    category: "Adaptability",
    question: "Tell me about a time you had to learn a new technology or framework quickly for a project.",
    context: "Technology evolves constantly. This question assesses your learning agility and ability to become productive in new domains.",
    whyAsked: "Interviewers want to see you can upskill efficiently and apply new knowledge effectively under time pressure.",
    commonMistakes: [
      "Describing superficial learning",
      "Not showing your learning strategy",
      "Claiming expertise after minimal exposure",
      "Not leveraging available resources"
    ],
    answerFramework: "Describe the technology, your learning approach, how you applied it, and the outcome.",
    sampleAnswer: `Our team decided to migrate from REST to GraphQL for our new API. I had no GraphQL experience and had two weeks to become productive.

I created a structured learning plan: day 1-2 fundamentals through official docs and tutorials; day 3-4 building a small personal project; day 5-7 studying our codebase to understand where GraphQL would fit; week 2 implementing a real feature with support from our one GraphQL-experienced colleague.

I time-boxed learning sessions to avoid rabbit holes. When stuck, I'd search for 15 minutes, then ask for help. I kept a document of 'things I wish I knew earlier' for future team members.

By week two, I was contributing productively. Within a month, I'd written documentation and given a lunch-and-learn to help others onboard. The project launched successfully.`,
    keyPoints: [
      "Create a structured learning plan",
      "Balance theory with practical application",
      "Time-box learning to avoid rabbit holes",
      "Know when to ask for help",
      "Share learnings with the team"
    ],
    followUpQuestions: [
      "How do you stay current with technology trends?",
      "What's your go-to approach for learning?",
      "How do you decide what's worth learning deeply?"
    ]
  },
  {
    id: "ss-23-adapt-to-company-change",
    questionNumber: 23,
    title: "Adapting to Organizational Change",
    category: "Adaptability",
    question: "Describe how you adapted to a significant organizational change (new manager, team restructure, process change).",
    context: "Organizations evolve through restructures, leadership changes, and process updates. This question assesses your resilience through change.",
    whyAsked: "Change resistance hurts teams. Interviewers want to see you can thrive through organizational shifts.",
    commonMistakes: [
      "Expressing bitterness about the change",
      "Describing passive acceptance",
      "Not showing how you actively adapted",
      "Ignoring the human element of change"
    ],
    answerFramework: "Describe the change, its impact, how you adapted, and how you supported others through it.",
    sampleAnswer: `Our company reorganized, and my team was merged with another team under a new manager. We went from a tight-knit group of 5 to a larger team of 12 with different processes.

Initially, I was anxious about losing our team culture. Instead of resisting, I scheduled a 1:1 with the new manager to understand her vision and share our team's strengths.

I volunteered to help with integration by documenting our team's tribal knowledge and suggesting process compromises that kept the best of both approaches.

I also reached out to new teammates proactively, setting up coffee chats to build relationships. When former teammates expressed frustration, I listened but also encouraged them to give the new structure a chance.

Within three months, the combined team was more effective than either original team. Our documentation effort became a template for future team mergers.`,
    keyPoints: [
      "Approach change with curiosity, not resistance",
      "Understand leadership's perspective",
      "Proactively contribute to successful transition",
      "Support teammates through the change",
      "Find opportunities in the new structure"
    ],
    followUpQuestions: [
      "How do you handle change you disagree with?",
      "What's the hardest organizational change you've experienced?",
      "How do you help resistant colleagues adapt?"
    ]
  },
  {
    id: "ss-24-handle-ambiguous-requirements",
    questionNumber: 24,
    title: "Handling Ambiguous Requirements",
    category: "Adaptability",
    question: "Tell me about a time you had to work with incomplete or ambiguous requirements. How did you proceed?",
    context: "Requirements are rarely perfect. This question assesses your ability to make progress despite uncertainty.",
    whyAsked: "Waiting for perfect information causes delays. Interviewers want to see you can navigate ambiguity productively.",
    commonMistakes: [
      "Waiting indefinitely for clarity",
      "Making assumptions without validation",
      "Blaming product/business for unclear requirements",
      "Building the wrong thing without checking"
    ],
    answerFramework: "Describe the ambiguity, how you sought clarity, how you proceeded with remaining uncertainty, and the outcome.",
    sampleAnswer: `I was assigned to build an 'admin dashboard' with a one-page spec that said 'show key metrics and allow user management.' No mockups, no specific metrics defined.

Instead of waiting for perfect requirements, I took action. I listed my assumptions and unknowns, then scheduled a 30-minute meeting with the product manager to clarify the most critical questions.

For metrics, we identified three must-haves together. For user management, I proposed starting with the most common operations based on support tickets.

I built an MVP in one week and demoed it. The PM immediately said, 'I also need X and Y' which I'd predicted might happen. Because I'd architected flexibly, adding them was straightforward.

This iterative approach got us to a solid dashboard in three weeks. The PM said it was exactly what she envisioned, even though she couldn't articulate it upfront.`,
    keyPoints: [
      "Document assumptions and unknowns",
      "Proactively seek clarity on critical items",
      "Proceed with reasonable assumptions",
      "Build flexibility for changes",
      "Iterate with stakeholders frequently"
    ],
    followUpQuestions: [
      "How do you prioritize which ambiguities to resolve first?",
      "What if the stakeholder isn't available to clarify?",
      "How do you balance moving fast with getting it right?"
    ]
  },
  {
    id: "ss-25-work-outside-comfort-zone",
    questionNumber: 25,
    title: "Working Outside Your Comfort Zone",
    category: "Adaptability",
    question: "Describe a situation where you had to take on responsibilities outside your comfort zone or expertise.",
    context: "Growth happens outside comfort zones. This question assesses your willingness to stretch and grow.",
    whyAsked: "Teams need flexible members who can fill gaps. Interviewers want to see you embrace growth opportunities.",
    commonMistakes: [
      "Staying only in comfortable areas",
      "Pretending expertise you don't have",
      "Not showing vulnerability or learning",
      "Describing reluctance without growth"
    ],
    answerFramework: "Describe the uncomfortable responsibility, how you approached it, what you learned, and the outcome.",
    sampleAnswer: `Our team lead left unexpectedly, and I was asked to facilitate sprint ceremonies temporarily. I'm naturally introverted and had never led meetings.

I was nervous but saw it as a growth opportunity. I reached out to an engineering manager I respected and asked for tips. She suggested I observe her facilitate a meeting and gave me a framework.

For my first standup, I over-prepared: agenda, talking points, and time allocations. It was awkward, but I got through it. I asked the team for anonymous feedback and iterated.

By week four, I found my own style, less formal than my mentor's but effective for our team. I discovered I actually enjoyed helping the team stay aligned and unblocked.

When we hired a new team lead, I offered to continue facilitating standups. The experience expanded my view of leadership and later helped me transition into a tech lead role.`,
    keyPoints: [
      "Embrace discomfort as growth opportunity",
      "Seek guidance from those with experience",
      "Prepare thoroughly for unfamiliar situations",
      "Ask for feedback and iterate",
      "Reflect on what you learned"
    ],
    followUpQuestions: [
      "What's something you're still uncomfortable with?",
      "How do you push yourself to grow?",
      "When should you say no to stretch assignments?"
    ]
  },

  // ============ Conflict Resolution (26-30) ============
  {
    id: "ss-26-resolve-team-conflict",
    questionNumber: 26,
    title: "Resolving a Conflict Between Team Members",
    category: "Conflict Resolution",
    question: "Describe a time when two colleagues were in conflict. How did you help resolve it?",
    context: "Conflicts happen in teams. This question assesses your conflict resolution skills and ability to maintain team harmony.",
    whyAsked: "Unresolved conflicts hurt productivity. Interviewers want to see you can help navigate interpersonal challenges.",
    commonMistakes: [
      "Taking sides",
      "Avoiding conflict rather than addressing it",
      "Escalating unnecessarily",
      "Gossiping about the conflict"
    ],
    answerFramework: "Describe the conflict, your role, how you helped resolve it, and the outcome.",
    sampleAnswer: `Two teammates had a growing tension over code review comments. One felt the other was overly critical; the other felt their feedback was being ignored.

I noticed the tension affecting team dynamics and approached them individually first. I listened to each perspective without judgment and found both had valid points.

I suggested we have a coffee chat, all three of us, in a neutral setting. I facilitated by establishing ground rules: one person speaks at a time, focus on behaviors not personalities.

It turned out the underlying issue was different expectations about code review purpose. One saw it as gatekeeping quality; the other saw it as collaborative improvement. Once that was clear, we created shared code review guidelines as a team.

The two became effective collaborators. They even presented our code review guidelines at a company engineering meeting.`,
    keyPoints: [
      "Address conflict early before it escalates",
      "Hear all perspectives without judgment",
      "Look for underlying issues",
      "Facilitate, don't dictate solutions",
      "Create structures to prevent recurrence"
    ],
    followUpQuestions: [
      "What if one party refused to engage?",
      "When should conflicts be escalated to management?",
      "How do you prevent conflicts from starting?"
    ]
  },
  {
    id: "ss-27-manage-difficult-stakeholder",
    questionNumber: 27,
    title: "Managing a Difficult Stakeholder",
    category: "Conflict Resolution",
    question: "Tell me about a time you had to work with a difficult stakeholder or client. How did you manage the relationship?",
    context: "Not all stakeholders are easy to work with. This question assesses your professional patience and relationship management skills.",
    whyAsked: "Interviewers want to see you can maintain professionalism and get work done despite challenging relationships.",
    commonMistakes: [
      "Describing the stakeholder only negatively",
      "Avoiding them rather than engaging",
      "Escalating without trying to resolve",
      "Letting frustration show in your answer"
    ],
    answerFramework: "Describe the challenge, your approach to understanding and managing it, and the improved outcome.",
    sampleAnswer: `I worked with a product manager who would frequently change requirements mid-sprint and become frustrated when features weren't exactly as imagined.

Instead of labeling him as difficult, I tried to understand his perspective. In a 1:1, I learned he was under pressure from sales who wanted features for specific clients.

I proposed a solution: a weekly 30-minute sync where he could share upcoming client needs, and we could discuss feasibility before he made promises. I also started sending him daily async updates so he was never surprised.

For mid-sprint changes, we agreed on a process: emergency changes were okay, but regular changes would wait for the next sprint. I helped him distinguish between the two.

Over time, our relationship improved significantly. He told me I was the first developer who truly understood his constraints. Our sprint completion rate went from 60% to 90%.`,
    keyPoints: [
      "Seek to understand their pressures",
      "Build regular communication channels",
      "Create processes that address their needs",
      "Set boundaries with empathy",
      "Focus on partnership, not adversary"
    ],
    followUpQuestions: [
      "What if they refused to follow agreed processes?",
      "How do you handle stakeholders who don't trust developers?",
      "When should you escalate stakeholder issues?"
    ]
  },
  {
    id: "ss-28-push-back-on-unreasonable-request",
    questionNumber: 28,
    title: "Pushing Back on Unreasonable Requests",
    category: "Conflict Resolution",
    question: "Describe a time when you pushed back on an unreasonable request from a manager or stakeholder.",
    context: "Sometimes requests are unreasonable and need to be challenged. This question assesses your judgment and assertiveness.",
    whyAsked: "Yes-people create problems. Interviewers want to see you can respectfully push back when needed.",
    commonMistakes: [
      "Always saying yes to avoid conflict",
      "Pushing back without offering alternatives",
      "Being confrontational or disrespectful",
      "Not picking your battles wisely"
    ],
    answerFramework: "Describe the unreasonable request, why it was problematic, how you pushed back constructively, and the outcome.",
    sampleAnswer: `My manager asked me to implement a 'quick' security fix by storing passwords in plain text temporarily while we migrated systems. He was under pressure to meet a deadline.

I understood the pressure but couldn't compromise on security. I explained the risks: regulatory implications, potential data breach, and damage to user trust. I used specific examples of companies that had been breached.

Instead of just saying no, I proposed alternatives: delay the migration by one week to do it properly, or use a two-phase approach where the secure path was built first.

I offered to work overtime to minimize the delay and drafted a quick summary of the risks for him to share with his manager if needed.

He appreciated that I provided options rather than just pushback. We went with the two-phase approach and launched securely on time.`,
    keyPoints: [
      "Understand the underlying pressure or need",
      "Explain the 'why' behind your pushback",
      "Offer alternative solutions",
      "Be respectful but firm on important issues",
      "Know which battles are worth fighting"
    ],
    followUpQuestions: [
      "What if they insisted despite your pushback?",
      "How do you decide when to push back?",
      "Have you ever been wrong in pushing back?"
    ]
  },
  {
    id: "ss-29-repair-damaged-relationship",
    questionNumber: 29,
    title: "Repairing a Damaged Professional Relationship",
    category: "Conflict Resolution",
    question: "Tell me about a time you damaged a professional relationship and had to repair it.",
    context: "Mistakes happen in relationships. This question assesses your humility and ability to take responsibility and rebuild trust.",
    whyAsked: "Interviewers want to see emotional maturity, accountability, and ability to recover from interpersonal mistakes.",
    commonMistakes: [
      "Blaming the other person",
      "Minimizing your role in the damage",
      "Describing superficial repair without genuine change",
      "Not showing what you learned"
    ],
    answerFramework: "Describe what damaged the relationship, how you recognized your role, steps you took to repair it, and the outcome.",
    sampleAnswer: `During a stressful sprint, I publicly criticized a teammate's code in a standup, calling it 'sloppy.' I was frustrated and spoke without thinking.

She stopped collaborating with me, and the team atmosphere became tense. A colleague pointed out that my comment was inappropriate, even if my technical concerns were valid.

I reflected and realized I'd embarrassed her in front of the team. I scheduled a private conversation, apologized sincerely without excuses, and acknowledged the impact of my words.

I asked how I could make it right. She said she needed me to show I respected her work. Over the following weeks, I made a point to acknowledge her contributions in meetings and provide balanced feedback privately first.

It took about a month for the relationship to fully recover. We actually ended up becoming better collaborators because we'd established honest communication. I learned to never give critical feedback publicly.`,
    keyPoints: [
      "Recognize and own your mistake",
      "Apologize sincerely without excuses",
      "Ask how to make it right",
      "Change behavior consistently",
      "Be patient as trust rebuilds"
    ],
    followUpQuestions: [
      "What if they refused to forgive you?",
      "How do you prevent yourself from similar mistakes?",
      "What's the most important thing you learned from this?"
    ]
  },
  {
    id: "ss-30-handle-unfair-treatment",
    questionNumber: 30,
    title: "Handling Perceived Unfair Treatment",
    category: "Conflict Resolution",
    question: "Describe a time when you felt you were treated unfairly at work. How did you handle it?",
    context: "Perceptions of unfairness can damage morale and relationships. This question assesses your maturity in handling difficult situations.",
    whyAsked: "Interviewers want to see you can address concerns professionally without damaging relationships or productivity.",
    commonMistakes: [
      "Complaining without taking action",
      "Becoming bitter or passive-aggressive",
      "Escalating before trying to resolve directly",
      "Not considering other perspectives"
    ],
    answerFramework: "Describe the situation, your initial reaction, how you addressed it constructively, and the outcome.",
    sampleAnswer: `I was passed over for a tech lead role that went to a colleague with less experience. I initially felt resentful, believing I deserved the promotion.

Instead of complaining to teammates, I asked my manager for feedback on why I wasn't selected. I approached it as wanting to understand, not challenge the decision.

She explained that while my technical skills were strong, the role required more stakeholder management experience, which my colleague had. She outlined what I'd need to demonstrate for future opportunities.

I realized my perception wasn't the full picture. I asked if I could shadow the new tech lead in some stakeholder meetings to build those skills. My manager appreciated my maturity and set that up.

Six months later, a similar role opened, and I got it. The feedback and growth period made me more prepared than I would have been earlier.`,
    keyPoints: [
      "Process your reaction before acting",
      "Seek understanding, not just validation",
      "Consider perspectives you might be missing",
      "Use feedback for growth",
      "Maintain professionalism regardless of outcome"
    ],
    followUpQuestions: [
      "What if the feedback seemed unfair too?",
      "How do you distinguish valid unfairness from perception?",
      "When should unfairness be formally escalated?"
    ]
  },

  // ============ Time Management (31-35) ============
  {
    id: "ss-31-manage-multiple-priorities",
    questionNumber: 31,
    title: "Managing Multiple Competing Priorities",
    category: "Time Management",
    question: "How do you handle having multiple urgent priorities competing for your attention?",
    context: "Developers often juggle multiple tasks and stakeholders. This question assesses your prioritization and organization skills.",
    whyAsked: "Chaos without prioritization hurts productivity. Interviewers want to see you have systems for managing competing demands.",
    commonMistakes: [
      "Saying you just work harder",
      "Not having a clear prioritization framework",
      "Trying to do everything at once",
      "Not communicating about tradeoffs"
    ],
    answerFramework: "Describe a specific situation with competing priorities, your prioritization approach, how you communicated, and the outcome.",
    sampleAnswer: `Last month, I had a production bug to fix, a feature deadline, and was supporting a teammate with an integration issue, all marked as urgent.

I started by listing all three tasks with their actual urgency and impact. The production bug affected 5% of users; the feature was needed for a sales demo in two days; the teammate was blocked without my help.

I used a simple framework: impact versus effort. I spent 30 minutes unblocking my teammate with enough guidance that she could continue independently. Then I fixed the production bug (high impact, medium effort) and created a quick patch.

For the feature, I communicated with the PM that I could deliver 80% functionality by the deadline. I was transparent about the tradeoffs.

All three were addressed successfully. The key was communication: everyone knew what to expect and why.`,
    keyPoints: [
      "List and assess all priorities objectively",
      "Use a framework (impact, urgency, effort)",
      "Communicate tradeoffs to stakeholders",
      "Look for quick wins that unblock others",
      "Be realistic about what's achievable"
    ],
    followUpQuestions: [
      "What if everything truly is equally urgent?",
      "How do you handle constant interruptions?",
      "What tools do you use for task management?"
    ]
  },
  {
    id: "ss-32-meet-tight-deadline",
    questionNumber: 32,
    title: "Meeting a Tight Deadline",
    category: "Time Management",
    question: "Tell me about a time you had to meet a very tight deadline. How did you ensure success?",
    context: "Deadlines create pressure. This question assesses your ability to perform under time constraints without sacrificing quality.",
    whyAsked: "Business needs sometimes require fast delivery. Interviewers want to see you can handle pressure effectively.",
    commonMistakes: [
      "Describing all-nighters as the solution",
      "Cutting corners on quality",
      "Not planning or just winging it",
      "Working in isolation without communication"
    ],
    answerFramework: "Describe the deadline, your planning approach, execution tactics, and how you delivered successfully.",
    sampleAnswer: `We needed to launch a payment integration in one week instead of the planned three weeks due to a partner contract deadline.

I immediately broke down the work into must-have versus nice-to-have features. The must-haves were: process payments and handle errors gracefully. Nice-to-haves like detailed analytics could come later.

I created a daily milestone plan and shared it with the team and stakeholders so everyone knew the progress checkpoints.

I focused ruthlessly on the critical path, deferring code cleanup and edge cases that weren't blocking launch. I paired with a colleague on the trickiest integration to avoid getting stuck.

We shipped the core functionality in five days, allowing two days for testing. The launch was successful with zero payment failures. We added the deferred features over the following two weeks.`,
    keyPoints: [
      "Break work into critical versus deferrable",
      "Create visible milestones and checkpoints",
      "Focus ruthlessly on the critical path",
      "Communicate progress frequently",
      "Don't sacrifice core quality for speed"
    ],
    followUpQuestions: [
      "How do you prevent technical debt from tight deadlines?",
      "What if you realized the deadline was impossible?",
      "How do you recover from deadline pressure?"
    ]
  },
  {
    id: "ss-33-balance-deep-work-availability",
    questionNumber: 33,
    title: "Balancing Deep Work with Availability",
    category: "Time Management",
    question: "How do you balance the need for focused coding time with being available to your team?",
    context: "Developers need focus time, but teams need collaboration. This question assesses how you manage this tension.",
    whyAsked: "Constant context-switching hurts productivity, but so does unavailability. Interviewers want to see thoughtful approaches.",
    commonMistakes: [
      "Being always available (no deep work)",
      "Being always unavailable (hurting team)",
      "Not having a system",
      "Not communicating your availability"
    ],
    answerFramework: "Describe your approach, specific tactics you use, how you communicate availability, and the outcomes.",
    sampleAnswer: `I protect focus time while remaining a good team player through a few practices.

I block 2-3 hours each morning as focus time on my calendar and communicate this to my team. During this time, I turn off Slack notifications and work on complex tasks that need deep concentration.

For urgent issues, teammates know they can text me. In practice, this is rare because most things can wait an hour or two.

I batch communication: I check Slack at set intervals (after focus time, after lunch, end of day) and respond to everything then. I've found this is faster than constant partial attention.

For PR reviews, I commit to reviewing within 4 hours during working time, so teammates aren't blocked waiting.

This system increased my output significantly while teammates report I'm still responsive. The key is communicating the system so people know what to expect.`,
    keyPoints: [
      "Schedule and protect focus time",
      "Communicate availability clearly",
      "Have escalation paths for true emergencies",
      "Batch communication for efficiency",
      "Make response time commitments"
    ],
    followUpQuestions: [
      "How do you handle cultures that expect instant responses?",
      "What's your ideal focus time length?",
      "How do you handle focus time when collaborating heavily?"
    ]
  },
  {
    id: "ss-34-handle-context-switching",
    questionNumber: 34,
    title: "Handling Frequent Context Switching",
    category: "Time Management",
    question: "How do you maintain productivity when your work requires frequent context switching?",
    context: "Many roles involve juggling different types of work. This question assesses your ability to manage cognitive load.",
    whyAsked: "Context switching has costs. Interviewers want to see you understand this and have strategies to manage it.",
    commonMistakes: [
      "Saying you're good at multitasking (you're not)",
      "Not acknowledging the cost of switching",
      "Not having strategies to minimize impact",
      "Getting stressed by switching without coping"
    ],
    answerFramework: "Describe a high-switching environment, your strategies for managing it, and how you maintain quality.",
    sampleAnswer: `On my current team, I handle code reviews, production support, and feature development, requiring constant context switches.

I minimize switching costs with several strategies. First, I keep detailed notes on where I left off in each context, so I can resume quickly. I use a simple template: current status, next steps, blockers.

Second, I batch similar tasks. I do all code reviews in one session, handle all Slack messages together, and group similar types of coding work.

Third, I use checklists for complex tasks so I don't forget steps when interrupted. This is especially important for deployments or debugging sessions.

Finally, I've accepted that perfect productivity isn't possible with frequent switching. I aim for 'good enough' progress across all areas rather than perfection in one.

My delivery rate has stayed consistent even as my responsibilities expanded, and I've avoided the burnout that context switching can cause.`,
    keyPoints: [
      "Document state before switching",
      "Batch similar tasks together",
      "Use checklists for complex tasks",
      "Accept reduced efficiency and plan for it",
      "Protect some time for deep focus"
    ],
    followUpQuestions: [
      "What's your biggest challenge with context switching?",
      "How do you handle surprise interruptions?",
      "What tools help you manage multiple contexts?"
    ]
  },
  {
    id: "ss-35-long-term-project-motivation",
    questionNumber: 35,
    title: "Maintaining Motivation on Long Projects",
    category: "Time Management",
    question: "How do you stay motivated and productive on long-term projects that span months?",
    context: "Long projects can lead to fatigue. This question assesses your ability to sustain effort over extended periods.",
    whyAsked: "Many important projects take months. Interviewers want to see you can maintain quality and motivation over time.",
    commonMistakes: [
      "Not acknowledging motivation challenges",
      "Relying only on willpower",
      "Not having progress markers",
      "Isolating on long projects"
    ],
    answerFramework: "Describe a long project, challenges you faced, strategies for maintaining momentum, and how you delivered.",
    sampleAnswer: `I spent eight months leading a backend rewrite project. By month three, the team's motivation was declining as the end seemed far away.

I implemented several strategies. First, we broke the project into two-week sprints with clear, achievable goals. Celebrating small wins (completed migrations, improved performance metrics) kept morale up.

Second, I created a visible progress tracker showing percentage complete. Seeing 40% done felt better than seeing a distant finish line.

Third, I varied the work to prevent monotony. I rotated team members between challenging and routine tasks, and we scheduled 'innovation days' where people could work on related improvements of their choice.

Finally, I kept connecting our work to impact. Every month, I shared metrics showing how our improvements were helping users. This reminded us why the work mattered.

We delivered on time and under budget. Team surveys showed motivation actually increased over the project.`,
    keyPoints: [
      "Break long projects into visible milestones",
      "Celebrate incremental progress",
      "Vary work to prevent monotony",
      "Connect work to meaningful impact",
      "Check in on team motivation regularly"
    ],
    followUpQuestions: [
      "What do you do when you lose motivation?",
      "How do you handle project fatigue?",
      "What's the longest project you've worked on?"
    ]
  },

  // ============ Growth Mindset (36-40) ============
  {
    id: "ss-36-biggest-failure-learned",
    questionNumber: 36,
    title: "Learning from Your Biggest Failure",
    category: "Growth Mindset",
    question: "What's the biggest mistake or failure you've experienced in your career, and what did you learn from it?",
    context: "Failure is a teacher. This question assesses your self-awareness, humility, and ability to grow from setbacks.",
    whyAsked: "Everyone fails. Interviewers want to see you can own failures, learn from them, and grow stronger.",
    commonMistakes: [
      "Describing a minor failure to avoid vulnerability",
      "Blaming others or circumstances",
      "Not showing genuine learning",
      "Describing something that wasn't actually your fault"
    ],
    answerFramework: "Describe a genuine failure, own your role, explain what you learned, and show how you applied that learning.",
    sampleAnswer: `Early in my career, I shipped a feature without adequate testing because I was confident in my code. It caused a data corruption bug that affected hundreds of users and took a week to fully resolve.

The root cause was my overconfidence. I had assumed my code was correct without verification. I was also conflict-averse and hadn't pushed back when asked to skip testing to meet a deadline.

I learned several lessons. First, test coverage isn't optional, especially for data operations. Second, my confidence should be proportional to my verification, not my assumptions. Third, speaking up about risks is my responsibility, even if it's uncomfortable.

I now advocate strongly for testing and have never shipped a similar bug. When asked to cut testing, I explain the trade-offs clearly. The failure was painful, but it made me a much better engineer.`,
    keyPoints: [
      "Choose a real, meaningful failure",
      "Own your role completely",
      "Extract specific, actionable lessons",
      "Show how you applied the learning",
      "Demonstrate growth from the experience"
    ],
    followUpQuestions: [
      "How did you handle the immediate aftermath?",
      "Have you had similar situations since?",
      "How do you prevent overconfidence now?"
    ]
  },
  {
    id: "ss-37-seek-feedback-improvement",
    questionNumber: 37,
    title: "Proactively Seeking Feedback",
    category: "Growth Mindset",
    question: "How do you actively seek feedback to improve your skills?",
    context: "Growth requires feedback. This question assesses whether you actively pursue improvement rather than waiting for it.",
    whyAsked: "Self-directed learners outperform those who only improve when told to. Interviewers want to see initiative in growth.",
    commonMistakes: [
      "Only accepting feedback when given",
      "Not having specific feedback practices",
      "Asking for feedback but not acting on it",
      "Only seeking positive feedback"
    ],
    answerFramework: "Describe your feedback-seeking practices, specific examples, how you process feedback, and improvements made.",
    sampleAnswer: `I actively seek feedback through several channels.

For code, I ask reviewers to be specifically critical. I say, 'Please don't go easy on me. What could be better?' This permission makes people more honest.

Quarterly, I ask my manager three specific questions: What should I start doing? Stop doing? Continue doing? The specificity gets more actionable feedback than 'How am I doing?'

I also do informal peer feedback exchanges. A colleague and I give each other candid feedback monthly. We've agreed to be honest because we both want to grow.

When I receive feedback, I write it down, sit with it for a day before responding, and then identify one specific action to take. For example, feedback that I spoke too quickly in presentations led me to join Toastmasters.

This habit has accelerated my growth more than any course or book.`,
    keyPoints: [
      "Ask for feedback proactively and regularly",
      "Make it safe for people to be honest",
      "Ask specific questions, not general ones",
      "Process feedback before reacting",
      "Take concrete action on feedback received"
    ],
    followUpQuestions: [
      "How do you handle feedback you disagree with?",
      "What's the most impactful feedback you've received?",
      "How do you give feedback to others?"
    ]
  },
  {
    id: "ss-38-skill-development-approach",
    questionNumber: 38,
    title: "Continuous Skill Development",
    category: "Growth Mindset",
    question: "How do you approach continuous learning and skill development as a developer?",
    context: "Technology evolves rapidly. This question assesses your commitment to staying current and growing your capabilities.",
    whyAsked: "Stagnant developers become obsolete. Interviewers want to see you have a sustainable approach to continuous learning.",
    commonMistakes: [
      "Saying you learn on the job only",
      "Listing courses without application",
      "Not having a learning system",
      "Chasing every new technology without depth"
    ],
    answerFramework: "Describe your learning philosophy, specific practices, how you apply learning, and examples of skills developed.",
    sampleAnswer: `I balance depth and breadth in my learning with a structured approach.

For depth, I choose one technology each quarter to learn thoroughly. This quarter it's Kubernetes. I allocate 5 hours weekly, using a mix of documentation, courses, and hands-on projects.

For breadth, I follow engineering blogs and newsletters, spending 30 minutes daily scanning what's new. This helps me know what exists even if I don't master everything.

I learn best by building, so I always have a side project applying what I'm learning. For Kubernetes, I'm deploying my personal projects on a home cluster.

I also learn from colleagues. I attend all lunch-and-learns and often ask teammates to explain their areas of expertise. Teaching others is how I solidify my own understanding.

This approach has kept me current and led to several career opportunities that required skills I'd developed proactively.`,
    keyPoints: [
      "Have a structured learning approach",
      "Balance depth in focus areas with breadth awareness",
      "Apply learning through projects",
      "Learn from and teach colleagues",
      "Make learning a sustainable habit"
    ],
    followUpQuestions: [
      "How do you decide what to learn next?",
      "How do you balance learning with work demands?",
      "What's on your learning list currently?"
    ]
  },
  {
    id: "ss-39-change-opinion-with-evidence",
    questionNumber: 39,
    title: "Changing Your Opinion with New Evidence",
    category: "Growth Mindset",
    question: "Tell me about a time when you had a strong opinion that you changed based on new information.",
    context: "Intellectual humility is valuable. This question assesses your ability to update beliefs when presented with better information.",
    whyAsked: "Stubborn engineers cause problems. Interviewers want to see you can change your mind when warranted.",
    commonMistakes: [
      "Claiming to never be wrong",
      "Describing a trivial opinion change",
      "Not showing genuine conviction before the change",
      "Not explaining what changed your mind"
    ],
    answerFramework: "Describe your original strong opinion, the new information, how you processed it, and your changed position.",
    sampleAnswer: `I was strongly against using TypeScript, believing it added complexity without proportional benefit. I advocated for plain JavaScript in team discussions.

Then I joined a team with a large TypeScript codebase. Initially, I was frustrated with type annotations. But after a month, I noticed something: I was catching bugs during development that would have reached production in JavaScript projects.

I tracked my experience. The types prevented several null reference errors and API mismatches. Refactoring was dramatically safer because the compiler caught mistakes. Onboarding new team members was faster because types served as documentation.

I had to admit I was wrong. The overhead I'd complained about was actually investment that paid off. I'm now a TypeScript advocate and have helped convert two other projects.

The experience taught me to be skeptical of strong opinions I've never tested in practice.`,
    keyPoints: [
      "Have genuine conviction in the original position",
      "Be open to evidence that challenges your view",
      "Update your position based on evidence, not pressure",
      "Own the change without defensiveness",
      "Apply the lesson (be more open-minded)"
    ],
    followUpQuestions: [
      "What opinions do you hold now that might be wrong?",
      "How do you stay open to being wrong?",
      "What makes you change your mind versus dig in?"
    ]
  },
  {
    id: "ss-40-career-growth-vision",
    questionNumber: 40,
    title: "Your Career Growth Vision",
    category: "Growth Mindset",
    question: "Where do you see yourself in your career in 5 years, and how are you working toward that?",
    context: "Career direction shows ambition and planning. This question assesses your self-awareness and goal orientation.",
    whyAsked: "Interviewers want to see alignment between your goals and what the role offers, plus evidence you're actively growing.",
    commonMistakes: [
      "Giving generic answers like 'your manager'",
      "Not having thought about it",
      "Goals disconnected from current actions",
      "Goals that don't fit the company/role"
    ],
    answerFramework: "Describe your career vision, why it excites you, and specific actions you're taking now to get there.",
    sampleAnswer: `In five years, I see myself as a technical leader who shapes architecture decisions and grows other engineers, either as a staff engineer or engineering manager, depending on organizational needs.

What excites me about this direction is the multiplied impact. Right now, I can deliver what I build. In that role, I'd enable entire teams to build better software.

I'm working toward this through several actions. I'm developing technical depth by leading architecture discussions and proposing designs for complex features. I'm building leadership skills by mentoring junior developers and leading cross-team initiatives.

I'm also developing my communication skills because influence at that level requires explaining complex ideas clearly. I've started writing technical blog posts and presenting at team meetings.

This role excites me because it's on that growth path. The opportunity to work on [relevant technical challenges] while growing leadership skills aligns perfectly with my direction.`,
    keyPoints: [
      "Have a clear, specific direction",
      "Explain why it excites you (not just what it is)",
      "Show current actions toward that goal",
      "Connect your goals to the role you're interviewing for",
      "Show flexibility in the exact path"
    ],
    followUpQuestions: [
      "What's your biggest gap in reaching that goal?",
      "How would this role help you get there?",
      "What would make you change your career direction?"
    ]
  },
];

// ============ Helper Functions ============

export function getSoftSkillQuestionById(id: string): SoftSkillQuestion | undefined {
  return SOFT_SKILLS_QUESTIONS.find((q) => q.id === id);
}

export function getAllSoftSkillQuestionIds(): string[] {
  return SOFT_SKILLS_QUESTIONS.map((q) => q.id);
}

export function getSoftSkillQuestionsByCategory(category: SoftSkillCategory): SoftSkillQuestion[] {
  return SOFT_SKILLS_QUESTIONS.filter((q) => q.category === category);
}

export function getAllSoftSkillCategories(): SoftSkillCategory[] {
  return [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Leadership",
    "Adaptability",
    "Conflict Resolution",
    "Time Management",
    "Growth Mindset",
  ];
}
