/**
 * Azure Course — Zero to Hero: 30 lessons covering Azure fundamentals through
 * advanced services. Uses Monaco editor with TypeScript validation.
 *
 * Tiers:
 *   1. Foundations        (1-8)
 *   2. Compute            (9-14)
 *   3. Storage & Data     (15-19)
 *   4. Networking         (20-23)
 *   5. DevOps & CI/CD     (24-27)
 *   6. Security & Monitor (28-30)
 */

import type { WebCourseLesson, LessonSection } from "./webCourseTypes";

type RawLesson = Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & {
  content: [string, string];
  sections?: LessonSection[];
};

function buildAzureLessons(): WebCourseLesson[] {
  const raw: RawLesson[] = [
    /* ══════════════════════════════════════════════════════════════════════
     * TIER 1 — Foundations (Lessons 1-8)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 1 ─────────────────────────────────────────────────────────
    {
      title: "Azure 1: Cloud Concepts & Azure Portal",
      content: [
        "Microsoft Azure is one of the three major cloud platforms. Understanding cloud computing models (IaaS, PaaS, SaaS) is the foundation for everything you'll build.",
        "Define a configuration object that describes the three cloud service models with their Azure examples. Export it and log the PaaS example.",
      ],
      sections: [
        {
          tag: "concept",
          title: "What is Cloud Computing?",
          body: "Cloud computing delivers computing services — servers, storage, databases, networking, software — over the internet. Instead of buying and maintaining physical hardware, you rent resources from a provider like **Azure**. The three service models are: **IaaS** (Infrastructure as a Service) where you manage VMs and networking, **PaaS** (Platform as a Service) where Azure manages the runtime, and **SaaS** (Software as a Service) where everything is managed for you.",
          badges: ["IaaS", "PaaS", "SaaS", "Cloud"],
          code: "// Cloud Service Models\n// IaaS: Azure Virtual Machines — you manage OS, runtime, apps\n// PaaS: Azure App Service — you manage apps, Azure manages the rest\n// SaaS: Microsoft 365 — everything is managed for you",
        },
        {
          tag: "concept",
          title: "Azure Portal Overview",
          body: "The **Azure Portal** (portal.azure.com) is the web-based GUI for managing all Azure resources. Key areas include the **Dashboard** (customizable home), **Resource Groups** (logical containers), **All Services** (browse everything), and the **Cloud Shell** (built-in terminal). You can also use the **Azure CLI** (`az`) or **Azure PowerShell** for scripting.",
          badges: ["Portal", "Dashboard", "Cloud Shell"],
          code: "// Azure CLI — the command-line interface\naz login                    // authenticate\naz account show             // current subscription\naz group list --output table // list resource groups",
        },
        {
          tag: "exercise",
          title: "Define cloud service models",
          body: "Create a `cloudModels` object with keys `IaaS`, `PaaS`, and `SaaS`. Each should have a `description` (string) and an `azureExample` (string). Use Azure Virtual Machines for IaaS, Azure App Service for PaaS, and Microsoft 365 for SaaS. Log the PaaS azure example.",
          badges: ["Practice"],
        },
        {
          tag: "tip",
          title: "Use Azure Cloud Shell for quick tasks",
          body: "Azure Cloud Shell gives you a pre-authenticated Bash or PowerShell terminal right in the browser. It comes with `az` CLI, `kubectl`, `terraform`, and other tools pre-installed. No local setup needed — just open portal.azure.com and click the terminal icon.",
          badges: ["Cloud Shell", "Productivity"],
        },
        {
          tag: "key-point",
          title: "Quiz: Cloud Models",
          body: "Which cloud model does Azure App Service belong to? The answer should be in your code. **PaaS** is the correct answer — Azure manages the infrastructure and runtime, you deploy your code.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Define the three cloud service models\nconst cloudModels = {\n  IaaS: {\n    description: "Infrastructure as a Service",\n    azureExample: "Azure Virtual Machines"\n  },\n  PaaS: {\n    description: "Platform as a Service",\n    azureExample: "Azure App Service"\n  },\n  SaaS: {\n    description: "Software as a Service",\n    azureExample: "Microsoft 365"\n  }\n};\n\nconsole.log("PaaS Example: " + cloudModels.PaaS.azureExample);`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("IaaS") &&
          code.includes("PaaS") &&
          code.includes("SaaS") &&
          code.includes("azureExample") &&
          logs.some((l) => l.includes("App Service")),
        message: "Cloud service models defined correctly!",
      }),
    },

    // ── Lesson 2 ─────────────────────────────────────────────────────────
    {
      title: "Azure 2: Resource Groups & Subscriptions",
      content: [
        "Everything in Azure lives inside a hierarchy: Management Groups > Subscriptions > Resource Groups > Resources. Understanding this is critical for organization, billing, and access control.",
        "Create a function that models the Azure resource hierarchy and logs the subscription.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Azure Resource Hierarchy",
          body: "Azure organizes resources in a tree: **Management Groups** (top-level containers for multiple subscriptions) > **Subscriptions** (billing boundary, linked to an Azure account) > **Resource Groups** (logical container for related resources) > **Resources** (VMs, databases, storage accounts, etc.). Every resource must belong to exactly one resource group, and every resource group to one subscription.",
          badges: ["Hierarchy", "Subscription", "Resource Group"],
          code: "// Azure CLI: Create a resource group\naz group create \\\n  --name myResourceGroup \\\n  --location eastus\n\n// List all resource groups\naz group list --output table",
        },
        {
          tag: "exercise",
          title: "Model the resource hierarchy",
          body: "Create a function `createSubscription` that takes `name: string` and returns an object with `name`, `id` (generate with `sub-` prefix), and a `resourceGroups` array. Add a method `addResourceGroup` that takes a group name and returns the group object with a `resources` array. Log the subscription name.",
          badges: ["Practice", "Hierarchy"],
        },
        {
          tag: "tip",
          title: "Naming conventions matter",
          body: "Use consistent naming: `rg-` prefix for resource groups, `vm-` for VMs, `st` for storage accounts, `kv-` for Key Vaults. Example: `rg-webapp-prod-eastus`. This makes resources instantly identifiable in the portal and CLI output.",
          badges: ["Naming", "Best Practice"],
        },
        {
          tag: "key-point",
          title: "Quiz: Resource Group Rules",
          body: "Can a resource belong to multiple resource groups? **No** — a resource belongs to exactly one resource group. However, resources in different groups can communicate with each other. Deleting a resource group deletes ALL resources inside it.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Model the Azure resource hierarchy\nfunction createSubscription(name: string) {\n  const subscription = {\n    name,\n    id: "sub-" + Math.random().toString(36).substring(2, 10),\n    resourceGroups: [] as { name: string; resources: string[] }[],\n    addResourceGroup(groupName: string) {\n      const group = { name: groupName, resources: [] as string[] };\n      this.resourceGroups.push(group);\n      return group;\n    }\n  };\n  return subscription;\n}\n\nconst mySub = createSubscription("Production");\nconst webGroup = mySub.addResourceGroup("rg-webapp-prod");\nwebGroup.resources.push("vm-web-01", "st-webdata", "sql-webapp");\n\nconsole.log("Subscription: " + mySub.name);\nconsole.log("Resource Groups: " + mySub.resourceGroups.length);\nconsole.log("Resources in " + webGroup.name + ": " + webGroup.resources.join(", "));`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("createSubscription") &&
          code.includes("resourceGroups") &&
          code.includes("addResourceGroup") &&
          logs.some((l) => l.includes("Subscription")),
        message: "Resource hierarchy modeled correctly!",
      }),
    },

    // ── Lesson 3 ─────────────────────────────────────────────────────────
    {
      title: "Azure 3: Azure CLI Essentials",
      content: [
        "The Azure CLI (`az`) is the primary command-line tool for managing Azure resources. Learning it is essential for automation, scripting, and quick operations.",
        "Build a CLI command builder class that constructs Azure CLI commands programmatically and logs the resulting command strings.",
      ],
      sections: [
        {
          tag: "concept",
          title: "Azure CLI Structure",
          body: "Every Azure CLI command follows the pattern: `az <group> <subcommand> --<param> <value>`. Groups map to Azure services: `az vm` for Virtual Machines, `az storage` for Storage, `az webapp` for App Service, etc. Common flags include `--resource-group` (`-g`), `--name` (`-n`), `--location` (`-l`), and `--output` (`-o`) for format (table, json, tsv).",
          badges: ["CLI", "az"],
          code: "// Common Azure CLI commands\naz login                              // authenticate\naz account list --output table        // list subscriptions\naz group create -n myRG -l eastus     // create resource group\naz vm create -g myRG -n myVM --image Ubuntu2204",
        },
        {
          tag: "exercise",
          title: "Build an Azure CLI command builder",
          body: "Create a class `AzCli` with a `command` method that takes a group (e.g., 'vm') and subcommand (e.g., 'create'). Chain `.param(key, value)` calls to add parameters. A `.build()` method returns the full command string. Use it to build a `vm create` command and log it.",
          badges: ["Practice", "CLI Builder"],
        },
        {
          tag: "tip",
          title: "Use --query for JMESPath filtering",
          body: "The `--query` flag uses JMESPath to filter JSON output. For example: `az vm list --query \"[].{Name:name, State:powerState}\"` returns only name and state fields. Combined with `--output table`, this gives you clean, readable output.",
          badges: ["JMESPath", "Filtering"],
        },
        {
          tag: "key-point",
          title: "Quiz: CLI Command Structure",
          body: "What is the correct CLI command to create a resource group named 'rg-dev' in West US? Answer: `az group create --name rg-dev --location westus`. The group is `group`, subcommand is `create`, and required params are `--name` and `--location`.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Azure CLI Command Builder\nclass AzCli {\n  private parts: string[] = ["az"];\n  private params: string[] = [];\n\n  command(group: string, subcommand: string): AzCli {\n    this.parts.push(group, subcommand);\n    return this;\n  }\n\n  param(key: string, value: string): AzCli {\n    this.params.push("--" + key + " " + value);\n    return this;\n  }\n\n  build(): string {\n    return [...this.parts, ...this.params].join(" ");\n  }\n}\n\nconst createVM = new AzCli()\n  .command("vm", "create")\n  .param("resource-group", "rg-webapp-prod")\n  .param("name", "vm-web-01")\n  .param("image", "Ubuntu2204")\n  .param("size", "Standard_B2s")\n  .build();\n\nconsole.log("Command: " + createVM);`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("class AzCli") &&
          code.includes("command(") &&
          code.includes("param(") &&
          code.includes("build()") &&
          logs.some((l) => l.includes("az") && l.includes("vm")),
        message: "CLI command builder works perfectly!",
      }),
    },

    // ── Lesson 4 ─────────────────────────────────────────────────────────
    {
      title: "Azure 4: ARM Templates & Bicep",
      content: [
        "Infrastructure as Code (IaC) is how you define Azure resources declaratively. ARM templates use JSON, while Bicep is a cleaner DSL that compiles to ARM.",
        "Create a function that generates an ARM template JSON for a storage account with configurable parameters.",
      ],
      sections: [
        {
          tag: "concept",
          title: "ARM Templates vs Bicep",
          body: "**ARM Templates** are JSON files that declare Azure resources. They have a fixed schema with `$schema`, `contentVersion`, `parameters`, `variables`, `resources`, and `outputs`. **Bicep** is a domain-specific language that compiles to ARM JSON but is much more readable. Both are idempotent — deploying the same template twice produces the same result.",
          badges: ["ARM", "Bicep", "IaC"],
          code: "// Bicep syntax for a storage account\nparam location string = resourceGroup().location\nparam storageName string\n\nresource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {\n  name: storageName\n  location: location\n  kind: 'StorageV2'\n  sku: { name: 'Standard_LRS' }\n}",
        },
        {
          tag: "exercise",
          title: "Generate an ARM template",
          body: "Create a function `generateARMTemplate` that takes `storageName: string` and `location: string` and returns an ARM template object. The template should have the correct `$schema`, a `resources` array with one `Microsoft.Storage/storageAccounts` resource. Log the JSON output.",
          badges: ["Practice", "ARM Template"],
        },
        {
          tag: "key-point",
          title: "Quiz: IaC Idempotency",
          body: "What happens when you deploy the same ARM template twice with no changes? **Nothing changes** — ARM deployments are idempotent. Azure compares desired state with current state and only modifies what is different.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// ARM Template Generator\nfunction generateARMTemplate(storageName: string, location: string) {\n  return {\n    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",\n    contentVersion: "1.0.0.0",\n    parameters: {},\n    resources: [\n      {\n        type: "Microsoft.Storage/storageAccounts",\n        apiVersion: "2023-01-01",\n        name: storageName,\n        location: location,\n        kind: "StorageV2",\n        sku: { name: "Standard_LRS" }\n      }\n    ],\n    outputs: {\n      storageId: {\n        type: "string",\n        value: "[resourceId('Microsoft.Storage/storageAccounts', '" + storageName + "')]"\n      }\n    }\n  };\n}\n\nconst template = generateARMTemplate("stwebappdata", "eastus");\nconsole.log(JSON.stringify(template, null, 2));`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("generateARMTemplate") &&
          code.includes("Microsoft.Storage/storageAccounts") &&
          code.includes("$schema") &&
          logs.some((l) => l.includes("storageAccounts")),
        message: "ARM template generated correctly!",
      }),
    },

    // ── Lesson 5 ─────────────────────────────────────────────────────────
    {
      title: "Azure 5: Role-Based Access Control (RBAC)",
      content: [
        "Azure RBAC controls who can do what on which resources. It uses role assignments that combine a principal, a role definition, and a scope.",
        "Model an RBAC system with roles, principals, and scopes. Create functions to assign roles and check permissions.",
      ],
      sections: [
        {
          tag: "concept",
          title: "RBAC Components",
          body: "RBAC has three components: **Security Principal** (who — user, group, service principal, managed identity), **Role Definition** (what — a collection of permissions like `Microsoft.Storage/*/read`), and **Scope** (where — management group, subscription, resource group, or resource). Built-in roles include **Owner**, **Contributor**, **Reader**, and **User Access Administrator**.",
          badges: ["RBAC", "Security", "IAM"],
          code: "// Azure CLI: Assign a role\naz role assignment create \\\n  --assignee user@example.com \\\n  --role \"Contributor\" \\\n  --scope /subscriptions/{sub-id}/resourceGroups/myRG",
        },
        {
          tag: "exercise",
          title: "Build an RBAC permission checker",
          body: "Create a `RBACManager` class with `assignRole(principal, role, scope)` and `checkAccess(principal, action, scope)` methods. Define at least three built-in roles (Owner, Contributor, Reader) with their permission patterns. Log the result of checking access.",
          badges: ["Practice", "RBAC"],
        },
        {
          tag: "key-point",
          title: "Quiz: RBAC Scope Inheritance",
          body: "If a user has Contributor role at the subscription level, can they modify resources in a resource group? **Yes** — RBAC is inherited. Roles assigned at a higher scope are inherited by all child scopes.",
          badges: ["Quiz"],
        },
      ],
      defaultCode: `// Azure RBAC Permission System\nconst BUILT_IN_ROLES: Record<string, { permissions: string[]; deny?: string[] }> = {\n  Owner: { permissions: ["*"] },\n  Contributor: { permissions: ["*"], deny: ["Microsoft.Authorization/*"] },\n  Reader: { permissions: ["*/read"] },\n};\n\nclass RBACManager {\n  private assignments: { principal: string; role: string; scope: string }[] = [];\n\n  assignRole(principal: string, role: string, scope: string): void {\n    this.assignments.push({ principal, role, scope });\n    console.log("Assigned " + role + " to " + principal + " at " + scope);\n  }\n\n  checkAccess(principal: string, action: string, scope: string): boolean {\n    return this.assignments.some(a => {\n      if (a.principal !== principal) return false;\n      if (!scope.startsWith(a.scope)) return false;\n      const roleDef = BUILT_IN_ROLES[a.role];\n      if (!roleDef) return false;\n      const allowed = roleDef.permissions.some(p => p === "*" || action.startsWith(p.replace("*", "")));\n      const denied = roleDef.deny?.some(d => action.startsWith(d.replace("/*", "")));\n      return allowed && !denied;\n    });\n  }\n}\n\nconst rbac = new RBACManager();\nrbac.assignRole("alice@contoso.com", "Contributor", "/subscriptions/sub-001");\nrbac.assignRole("bob@contoso.com", "Reader", "/subscriptions/sub-001/resourceGroups/rg-dev");\n\nconsole.log("Alice write: " + rbac.checkAccess("alice@contoso.com", "Microsoft.Storage/write", "/subscriptions/sub-001/resourceGroups/rg-dev"));\nconsole.log("Bob write: " + rbac.checkAccess("bob@contoso.com", "Microsoft.Storage/write", "/subscriptions/sub-001/resourceGroups/rg-dev"));`,
      validationLogic: (code: string, logs: string[]) => ({
        success:
          code.includes("RBACManager") &&
          code.includes("assignRole") &&
          code.includes("checkAccess") &&
          logs.some((l) => l.includes("Assigned")),
        message: "RBAC system implemented correctly!",
      }),
    },

    // ── Lesson 6 ─────────────────────────────────────────────────────────
    {
      title: "Azure 6: Cost Management & Budgets",
      content: [
        "Azure costs can spiral quickly without monitoring. Cost Management + Billing helps you analyze spending, set budgets, and create alerts.",
        "Build a cost tracker that monitors resource spending against budgets and generates alerts when thresholds are crossed.",
      ],
      sections: [
        { tag: "concept", title: "Azure Cost Management", body: "**Azure Cost Management** provides cost analysis, budgets, alerts, and recommendations. **Budgets** set spending limits with alerts at thresholds (e.g., 80%, 100%). **Tags** are critical for cost attribution — tag resources by team, project, or environment.", badges: ["Cost Management", "Budgets", "Tags"], code: "// Azure CLI: Create a budget\naz consumption budget create \\\n  --budget-name MonthlyBudget --amount 1000 \\\n  --time-grain monthly --category cost" },
        { tag: "exercise", title: "Build a cost tracker", body: "Create a `CostTracker` class that can `addResource(name, dailyCost)`, `setBudget(amount)`, and `checkBudget(days)` which calculates projected monthly cost and returns an alert level (ok, warning at 80%, critical at 100%). Log the budget status.", badges: ["Practice", "Cost Management"] },
        { tag: "key-point", title: "Quiz: Budget Alerts", body: "When does Azure stop your resources if you exceed your budget? **It doesn't** — budgets are informational only. They send notifications but do not stop services. To enforce spending limits, use resource quotas or Azure Policy.", badges: ["Quiz"] },
      ],
      defaultCode: `// Azure Cost Tracker\nclass CostTracker {\n  private resources: { name: string; dailyCost: number }[] = [];\n  private budget: number = 0;\n\n  addResource(name: string, dailyCost: number): void {\n    this.resources.push({ name, dailyCost });\n    console.log("Added: " + name + " ($" + dailyCost + "/day)");\n  }\n\n  setBudget(amount: number): void {\n    this.budget = amount;\n    console.log("Budget set: $" + amount + "/month");\n  }\n\n  getDailyCost(): number {\n    return this.resources.reduce((sum, r) => sum + r.dailyCost, 0);\n  }\n\n  checkBudget(daysElapsed: number): { level: string; projected: number; spent: number } {\n    const spent = this.getDailyCost() * daysElapsed;\n    const projected = this.getDailyCost() * 30;\n    const ratio = projected / this.budget;\n    const level = ratio >= 1 ? "CRITICAL" : ratio >= 0.8 ? "WARNING" : "OK";\n    return { level, projected: Math.round(projected), spent: Math.round(spent) };\n  }\n}\n\nconst tracker = new CostTracker();\ntracker.setBudget(500);\ntracker.addResource("vm-web-01", 4.50);\ntracker.addResource("sql-database", 8.20);\ntracker.addResource("storage-account", 0.80);\n\nconst status = tracker.checkBudget(15);\nconsole.log("Status: " + status.level);\nconsole.log("Spent so far: $" + status.spent);\nconsole.log("Projected monthly: $" + status.projected);`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("CostTracker") && code.includes("setBudget") && code.includes("checkBudget") && logs.some((l) => l.includes("Budget set")),
        message: "Cost tracker works! Keep those budgets in check!",
      }),
    },

    // ── Lesson 7 ─────────────────────────────────────────────────────────
    {
      title: "Azure 7: Azure Policy & Governance",
      content: [
        "Azure Policy enforces organizational standards and assesses compliance at scale. Policies can audit, deny, or automatically remediate non-compliant resources.",
        "Create a policy engine that evaluates resources against defined rules and reports compliance status.",
      ],
      sections: [
        { tag: "concept", title: "Azure Policy Fundamentals", body: "An **Azure Policy** is a JSON rule that evaluates resource properties. Effects include **Audit** (log non-compliance), **Deny** (block creation), **Modify** (auto-fix tags), and **DeployIfNotExists** (auto-deploy missing resources). Policies are grouped into **Initiatives** (policy sets).", badges: ["Policy", "Governance", "Compliance"] },
        { tag: "exercise", title: "Build a policy engine", body: "Create a `PolicyEngine` class with `addPolicy(name, rule, effect)` where rule is a function that checks a resource. Add an `evaluate(resource)` method that runs all policies and returns compliance results.", badges: ["Practice", "Policy Engine"] },
        { tag: "key-point", title: "Quiz: Policy Effects", body: "Which policy effect automatically adds missing tags to new resources? **Modify** — it can append, replace, or remove tags during resource creation or updates.", badges: ["Quiz"] },
      ],
      defaultCode: `// Azure Policy Engine\ninterface Resource { name: string; type: string; location: string; tags: Record<string, string>; }\ntype PolicyEffect = "Audit" | "Deny" | "Modify";\n\nclass PolicyEngine {\n  private policies: { name: string; rule: (r: Resource) => boolean; effect: PolicyEffect }[] = [];\n\n  addPolicy(name: string, rule: (r: Resource) => boolean, effect: PolicyEffect): void {\n    this.policies.push({ name, rule, effect });\n  }\n\n  evaluate(resource: Resource): { compliant: boolean; violations: string[] } {\n    const violations: string[] = [];\n    for (const p of this.policies) {\n      if (!p.rule(resource)) violations.push(p.name + " (" + p.effect + ")");\n    }\n    return { compliant: violations.length === 0, violations };\n  }\n}\n\nconst engine = new PolicyEngine();\nengine.addPolicy("require-env-tag", (r) => "Environment" in r.tags, "Deny");\nengine.addPolicy("allowed-locations", (r) => ["eastus", "westus"].includes(r.location), "Deny");\n\nconst good: Resource = { name: "vm-web", type: "VM", location: "eastus", tags: { Environment: "Production" } };\nconst bad: Resource = { name: "vm-rogue", type: "VM", location: "brazilsouth", tags: {} };\n\nconst r1 = engine.evaluate(good);\nconsole.log(good.name + ": " + (r1.compliant ? "COMPLIANT" : "NON-COMPLIANT"));\nconst r2 = engine.evaluate(bad);\nconsole.log(bad.name + ": " + (r2.compliant ? "COMPLIANT" : "NON-COMPLIANT: " + r2.violations.join(", ")));`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("PolicyEngine") && code.includes("evaluate") && logs.some((l) => l.includes("COMPLIANT")),
        message: "Policy engine evaluating correctly!",
      }),
    },

    // ── Lesson 8 ─────────────────────────────────────────────────────────
    {
      title: "Azure 8: Tags & Resource Organization",
      content: [
        "Tags are key-value pairs attached to Azure resources for organization, cost tracking, automation, and governance.",
        "Build a tag management system that enforces required tags, validates values, and generates cost reports grouped by tag.",
      ],
      sections: [
        { tag: "concept", title: "Azure Tags Strategy", body: "Tags are metadata key-value pairs (e.g., `Environment: Production`). Use them for: **Cost allocation**, **Automation** (auto-shutdown dev VMs), **Governance** (enforce via Azure Policy), and **Operations**. Tags are NOT inherited — child resources don't get parent tags automatically.", badges: ["Tags", "Organization"] },
        { tag: "exercise", title: "Build a tag manager", body: "Create a `TagManager` class that defines required tags (with allowed values), validates resources, and generates a cost summary grouped by tag key.", badges: ["Practice", "Tags"] },
        { tag: "key-point", title: "Quiz: Tag Inheritance", body: "Do resources automatically inherit tags from their resource group? **No** — you need Azure Policy with **Modify** effect to copy resource group tags to child resources.", badges: ["Quiz"] },
      ],
      defaultCode: `// Azure Tag Management System\nclass TagManager {\n  private requiredTags: { key: string; allowedValues?: string[] }[] = [];\n\n  requireTag(key: string, allowedValues?: string[]): void {\n    this.requiredTags.push({ key, allowedValues });\n  }\n\n  validate(tags: Record<string, string>): { valid: boolean; missing: string[]; invalid: string[] } {\n    const missing: string[] = [];\n    const invalid: string[] = [];\n    for (const req of this.requiredTags) {\n      if (!(req.key in tags)) missing.push(req.key);\n      else if (req.allowedValues && !req.allowedValues.includes(tags[req.key])) invalid.push(req.key);\n    }\n    return { valid: missing.length === 0 && invalid.length === 0, missing, invalid };\n  }\n\n  costByTag(resources: { name: string; cost: number; tags: Record<string, string> }[], tagKey: string) {\n    const groups: Record<string, number> = {};\n    for (const r of resources) {\n      const val = r.tags[tagKey] || "Untagged";\n      groups[val] = (groups[val] || 0) + r.cost;\n    }\n    return groups;\n  }\n}\n\nconst mgr = new TagManager();\nmgr.requireTag("Environment", ["Production", "Staging", "Development"]);\nmgr.requireTag("Owner");\n\nconst result = mgr.validate({ Environment: "Production", Owner: "team-a" });\nconsole.log("Valid: " + result.valid + " | Missing: " + result.missing.join(", "));\n\nconst costs = mgr.costByTag([\n  { name: "vm-1", cost: 120, tags: { Environment: "Production" } },\n  { name: "vm-2", cost: 80, tags: { Environment: "Development" } },\n  { name: "vm-3", cost: 150, tags: { Environment: "Production" } },\n], "Environment");\nconsole.log("Cost by Environment: " + JSON.stringify(costs));`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("TagManager") && code.includes("validate") && code.includes("costByTag") && logs.some((l) => l.includes("Valid:")),
        message: "Tag management system is solid!",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 2 — Compute (Lessons 9-14)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 9 ─────────────────────────────────────────────────────────
    {
      title: "Azure 9: Virtual Machines",
      content: [
        "Azure VMs are the core IaaS compute offering. Full control over OS, runtime, and configuration.",
        "Build a VM provisioner that configures and validates virtual machine specifications before deployment.",
      ],
      sections: [
        { tag: "concept", title: "Azure VM Fundamentals", body: "An Azure VM requires: a **resource group**, **VM size** (CPU/RAM — e.g., Standard_B2s), an **OS image** (Ubuntu, Windows Server), a **VNet** with subnet, and a **NIC**. VM families: **B-series** (burstable), **D-series** (general purpose), **E-series** (memory-optimized), **F-series** (compute), **N-series** (GPU).", badges: ["VM", "IaaS", "Compute"], code: "// Create a VM with Azure CLI\naz vm create \\\n  --resource-group rg-compute --name vm-web-01 \\\n  --image Ubuntu2204 --size Standard_B2s \\\n  --admin-username azureuser --generate-ssh-keys" },
        { tag: "exercise", title: "Build a VM provisioner", body: "Create a `VMProvisioner` class with a fluent API to set name, size, image, and networking. Add `validate()` and `estimateMonthlyCost()`. Log the result.", badges: ["Practice", "VM"] },
        { tag: "key-point", title: "Quiz: VM SLA", body: "What SLA for a single VM with Premium SSD? **99.9%**. For 99.95%, deploy 2+ VMs in an Availability Set. For 99.99%, use Availability Zones.", badges: ["Quiz"] },
      ],
      defaultCode: `// Azure VM Provisioner\nconst VM_SIZES: Record<string, { vcpus: number; ram: number; costPerHour: number }> = {\n  Standard_B1s:   { vcpus: 1, ram: 1, costPerHour: 0.0104 },\n  Standard_B2s:   { vcpus: 2, ram: 4, costPerHour: 0.0416 },\n  Standard_D2s_v5:{ vcpus: 2, ram: 8, costPerHour: 0.096 },\n  Standard_D4s_v5:{ vcpus: 4, ram: 16, costPerHour: 0.192 },\n};\n\nclass VMProvisioner {\n  private config: Record<string, string> = {};\n\n  name(n: string): VMProvisioner { this.config.name = n; return this; }\n  size(s: string): VMProvisioner { this.config.size = s; return this; }\n  image(i: string): VMProvisioner { this.config.image = i; return this; }\n  resourceGroup(rg: string): VMProvisioner { this.config.resourceGroup = rg; return this; }\n  location(l: string): VMProvisioner { this.config.location = l; return this; }\n\n  validate(): { valid: boolean; errors: string[] } {\n    const required = ["name", "size", "image", "resourceGroup", "location"];\n    const errors = required.filter(f => !this.config[f]).map(f => f + " is required");\n    if (this.config.size && !VM_SIZES[this.config.size]) errors.push("Unknown VM size");\n    return { valid: errors.length === 0, errors };\n  }\n\n  estimateMonthlyCost(): number {\n    const info = VM_SIZES[this.config.size];\n    return info ? Math.round(info.costPerHour * 730 * 100) / 100 : 0;\n  }\n}\n\nconst vm = new VMProvisioner()\n  .name("vm-web-01").size("Standard_B2s").image("Ubuntu2204")\n  .resourceGroup("rg-compute").location("eastus");\n\nconst validation = vm.validate();\nconsole.log("Valid: " + validation.valid);\nconsole.log("Estimated monthly cost: $" + vm.estimateMonthlyCost());`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("VMProvisioner") && code.includes("validate") && code.includes("estimateMonthlyCost") && logs.some((l) => l.includes("Valid: true")),
        message: "VM provisioner ready for deployment!",
      }),
    },

    // ── Lesson 10 ────────────────────────────────────────────────────────
    {
      title: "Azure 10: Azure App Service",
      content: [
        "App Service is Azure's PaaS for hosting web apps, REST APIs, and mobile backends. Deploy code or containers and Azure handles infrastructure.",
        "Build an App Service configuration manager that models plans, web apps, and deployment slots.",
      ],
      sections: [
        { tag: "concept", title: "App Service Architecture", body: "An **App Service Plan** defines compute resources. Multiple **Web Apps** can share one plan. Key features: **Deployment Slots** (zero-downtime swap), **Custom Domains** with free SSL, **Auto-scaling**, and **WebJobs** for background processing. Tiers: Free, Basic, Standard (auto-scale + slots), Premium.", badges: ["App Service", "PaaS", "Web Apps"], code: "// Create App Service\naz appservice plan create --name plan-webapp -g rg-web --sku S1 --is-linux\naz webapp create --name mywebapp -g rg-web --plan plan-webapp --runtime 'NODE:18-lts'" },
        { tag: "exercise", title: "Configure App Service", body: "Create an `AppServiceManager` class managing plans, web apps, and deployment slots. Add a `swap(appName, sourceSlot, targetSlot)` method. Log the configuration.", badges: ["Practice", "App Service"] },
        { tag: "key-point", title: "Quiz: App Service Plans", body: "If you have 3 web apps on one Standard S1 plan, how many VMs? **One** — all apps in a plan share the same compute.", badges: ["Quiz"] },
      ],
      defaultCode: `// Azure App Service Manager\nclass AppServiceManager {\n  private plans: { name: string; tier: string; size: string }[] = [];\n  private apps: { name: string; plan: string; runtime: string; slots: string[] }[] = [];\n\n  createPlan(name: string, tier: string, size: string): void {\n    this.plans.push({ name, tier, size });\n    console.log("Plan created: " + name + " (" + tier + " " + size + ")");\n  }\n\n  createApp(name: string, planName: string, runtime: string): void {\n    this.apps.push({ name, plan: planName, runtime, slots: ["production"] });\n    console.log("Web App created: " + name + " -> " + runtime);\n  }\n\n  addSlot(appName: string, slotName: string): void {\n    const app = this.apps.find(a => a.name === appName);\n    if (app) { app.slots.push(slotName); console.log("Slot added: " + appName + "/" + slotName); }\n  }\n\n  swap(appName: string, source: string, target: string): void {\n    console.log("Swapping " + appName + ": " + source + " <-> " + target);\n    console.log("Warming up " + source + " instance...");\n    console.log("Swap complete! Zero-downtime deployment done.");\n  }\n}\n\nconst mgr = new AppServiceManager();\nmgr.createPlan("plan-webapp", "Standard", "S1");\nmgr.createApp("myapp-prod", "plan-webapp", "NODE:18-lts");\nmgr.addSlot("myapp-prod", "staging");\nmgr.swap("myapp-prod", "staging", "production");`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("AppServiceManager") && code.includes("swap") && logs.some((l) => l.includes("Swap complete")),
        message: "App Service deployment flow mastered!",
      }),
    },

    // ── Lesson 11 ────────────────────────────────────────────────────────
    {
      title: "Azure 11: Azure Functions (Serverless)",
      content: [
        "Azure Functions is the serverless compute service. Write code that runs in response to events and pay only for execution time.",
        "Build a function app simulator that registers functions with triggers and executes them with simulated events.",
      ],
      sections: [
        { tag: "concept", title: "Serverless with Azure Functions", body: "**Triggers** start execution: **HTTP**, **Timer** (CRON), **Blob**, **Queue**, **Event Grid**, **Cosmos DB** change feed. **Bindings** connect to services declaratively. **Plans**: **Consumption** (auto-scale, pay-per-execution), **Premium** (pre-warmed, VNet), **Dedicated** (App Service plan).", badges: ["Serverless", "Functions", "Triggers"], code: "import { app, HttpRequest, HttpResponseInit } from '@azure/functions';\n\napp.http('hello', {\n  methods: ['GET'],\n  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {\n    const name = req.query.get('name') || 'World';\n    return { body: 'Hello, ' + name + '!' };\n  }\n});" },
        { tag: "exercise", title: "Build a Function App simulator", body: "Create a `FunctionApp` class with `register(name, trigger, handler)` and `invoke(name, event)`. Register HTTP, Timer, and Queue functions. Invoke each and log outputs.", badges: ["Practice", "Functions"] },
        { tag: "key-point", title: "Quiz: Function Triggers", body: "How many triggers can one Azure Function have? **Exactly one**. But it can have multiple input and output **bindings**.", badges: ["Quiz"] },
      ],
      defaultCode: `// Azure Functions Simulator\ntype TriggerType = "HTTP" | "Timer" | "Queue" | "Blob";\n\nclass FunctionApp {\n  private functions = new Map<string, { trigger: TriggerType; handler: (event: any) => string }>();\n\n  register(name: string, trigger: TriggerType, handler: (event: any) => string): void {\n    this.functions.set(name, { trigger, handler });\n    console.log("Registered: " + name + " [" + trigger + " trigger]");\n  }\n\n  invoke(name: string, event: any): string {\n    const fn = this.functions.get(name);\n    if (!fn) throw new Error("Function not found: " + name);\n    console.log("Invoking " + name + "...");\n    const result = fn.handler(event);\n    console.log("Result: " + result);\n    return result;\n  }\n}\n\nconst app = new FunctionApp();\napp.register("hello", "HTTP", (req) => "Hello, " + (req.query?.name || "World") + "!");\napp.register("cleanup", "Timer", (t) => "Cleanup at " + t.schedule);\napp.register("processOrder", "Queue", (msg) => "Order #" + msg.orderId + " processed");\n\napp.invoke("hello", { query: { name: "Azure Dev" } });\napp.invoke("cleanup", { schedule: "0 0 * * *" });\napp.invoke("processOrder", { orderId: "ORD-1234" });`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("FunctionApp") && code.includes("register") && code.includes("invoke") && logs.some((l) => l.includes("Registered")) && logs.some((l) => l.includes("Result:")),
        message: "Serverless function app simulator running!",
      }),
    },

    // ── Lesson 12 ────────────────────────────────────────────────────────
    {
      title: "Azure 12: Container Instances",
      content: [
        "Azure Container Instances (ACI) is the fastest way to run containers in Azure. No VM management, no orchestration — just run your container.",
        "Build a container deployment manager that models container groups with resource limits and environment variables.",
      ],
      sections: [
        { tag: "concept", title: "ACI Basics", body: "**Container Groups** (like Kubernetes pods) can have multiple containers sharing network and storage. Key settings: **CPU/Memory** limits, **Environment Variables**, **Restart Policy** (Always, OnFailure, Never). Supports Linux and Windows.", badges: ["ACI", "Containers", "Docker"], code: "az container create -g rg-containers --name myapp \\\n  --image nginx:latest --cpu 1 --memory 1.5 --ports 80" },
        { tag: "exercise", title: "Build a container manager", body: "Create a `ContainerGroupManager` class with multi-container support, resource limits, and a `deploy()` method that validates and logs the plan.", badges: ["Practice", "ACI"] },
        { tag: "key-point", title: "Quiz: ACI vs AKS", body: "When use ACI over AKS? **ACI** for simple, short-lived, or burst workloads. **AKS** when you need orchestration, auto-scaling across pods, and persistent workloads.", badges: ["Quiz"] },
      ],
      defaultCode: `// Container Instance Manager\ninterface ContainerConfig {\n  name: string; image: string; cpu: number; memoryGB: number;\n  ports: number[]; envVars: Record<string, string>;\n}\n\nclass ContainerGroupManager {\n  private name: string;\n  private containers: ContainerConfig[] = [];\n  private restartPolicy: "Always" | "OnFailure" | "Never" = "Always";\n\n  constructor(name: string) { this.name = name; }\n\n  addContainer(config: ContainerConfig): ContainerGroupManager {\n    this.containers.push(config); return this;\n  }\n\n  setRestartPolicy(policy: "Always" | "OnFailure" | "Never"): ContainerGroupManager {\n    this.restartPolicy = policy; return this;\n  }\n\n  deploy(): { success: boolean; summary: string } {\n    const totalCPU = this.containers.reduce((s, c) => s + c.cpu, 0);\n    const totalMem = this.containers.reduce((s, c) => s + c.memoryGB, 0);\n    if (totalCPU > 4) return { success: false, summary: "CPU limit exceeded" };\n    const summary = this.name + ": " + this.containers.length + " containers, " + totalCPU + " CPU, " + totalMem + "GB RAM";\n    console.log("Deploying: " + summary);\n    return { success: true, summary };\n  }\n}\n\nconst group = new ContainerGroupManager("myapp-group")\n  .addContainer({ name: "web", image: "nginx:latest", cpu: 1, memoryGB: 1.5, ports: [80], envVars: { NODE_ENV: "production" } })\n  .addContainer({ name: "sidecar", image: "fluentd:latest", cpu: 0.5, memoryGB: 0.5, ports: [], envVars: {} })\n  .setRestartPolicy("OnFailure");\n\nconst result = group.deploy();\nconsole.log("Success: " + result.success);`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("ContainerGroupManager") && code.includes("deploy") && logs.some((l) => l.includes("Deploying")),
        message: "Container group deployed!",
      }),
    },

    // ── Lesson 13 ────────────────────────────────────────────────────────
    {
      title: "Azure 13: Azure Kubernetes Service (AKS)",
      content: [
        "AKS is Azure's managed Kubernetes. Azure manages the control plane; you manage worker nodes.",
        "Build a Kubernetes manifest generator that creates Deployment and Service objects for AKS.",
      ],
      sections: [
        { tag: "concept", title: "AKS Architecture", body: "AKS has: **Control Plane** (free, managed) and **Node Pools** (your VMs). Key features: **RBAC** with Azure AD, **Virtual Nodes** (ACI burst), **KEDA** event-driven scaling, **Container Insights** monitoring.", badges: ["AKS", "Kubernetes"], code: "az aks create -g rg-k8s -n aks-prod \\\n  --node-count 3 --node-vm-size Standard_D2s_v5 \\\n  --enable-managed-identity --generate-ssh-keys" },
        { tag: "exercise", title: "Generate K8s manifests", body: "Create a `K8sManifestGenerator` with `deployment(name, image, replicas, port)` and `service(name, port, targetPort, type)` methods returning valid manifest objects.", badges: ["Practice", "Kubernetes"] },
        { tag: "key-point", title: "Quiz: AKS Cost", body: "How much does the AKS control plane cost? **Nothing** — you only pay for worker node VMs, storage, and networking.", badges: ["Quiz"] },
      ],
      defaultCode: `// Kubernetes Manifest Generator\nclass K8sManifestGenerator {\n  deployment(name: string, image: string, replicas: number, port: number) {\n    return {\n      apiVersion: "apps/v1", kind: "Deployment",\n      metadata: { name, labels: { app: name } },\n      spec: {\n        replicas,\n        selector: { matchLabels: { app: name } },\n        template: {\n          metadata: { labels: { app: name } },\n          spec: { containers: [{ name, image, ports: [{ containerPort: port }],\n            resources: { requests: { cpu: "100m", memory: "128Mi" }, limits: { cpu: "500m", memory: "256Mi" } } }] }\n        }\n      }\n    };\n  }\n\n  service(name: string, port: number, targetPort: number, type: string = "ClusterIP") {\n    return {\n      apiVersion: "v1", kind: "Service",\n      metadata: { name: name + "-svc" },\n      spec: { type, selector: { app: name }, ports: [{ port, targetPort, protocol: "TCP" }] }\n    };\n  }\n}\n\nconst gen = new K8sManifestGenerator();\nconst deploy = gen.deployment("web-api", "myregistry.azurecr.io/api:v1.2", 3, 8080);\nconst svc = gen.service("web-api", 80, 8080, "LoadBalancer");\nconsole.log("--- Deployment ---");\nconsole.log(JSON.stringify(deploy, null, 2));\nconsole.log("--- Service ---");\nconsole.log(JSON.stringify(svc, null, 2));`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("K8sManifestGenerator") && code.includes("deployment") && code.includes("service") && logs.some((l) => l.includes("Deployment")),
        message: "K8s manifests generated for AKS!",
      }),
    },

    // ── Lesson 14 ────────────────────────────────────────────────────────
    {
      title: "Azure 14: Logic Apps & Workflow Automation",
      content: [
        "Logic Apps is a low-code platform for building automated workflows that integrate services and data.",
        "Build a workflow engine that models triggers, conditions, and actions with a chainable API.",
      ],
      sections: [
        { tag: "concept", title: "Logic Apps Overview", body: "Logic Apps connect **triggers** to **actions** using 400+ connectors. Features: **Conditions**, **Loops**, **Parallel branches**, **Error handling**. Types: **Consumption** (pay-per-execution) and **Standard** (single-tenant, VNet).", badges: ["Logic Apps", "Workflows"] },
        { tag: "exercise", title: "Build a workflow engine", body: "Create a `WorkflowEngine` class with `trigger(type)`, `addAction(name, type, handler)`, and `execute(event)` methods. Log each step.", badges: ["Practice", "Workflows"] },
        { tag: "key-point", title: "Quiz: Logic Apps vs Functions", body: "When use Logic Apps over Functions? **Logic Apps** for integration scenarios and visual workflows. **Functions** for compute-intensive custom code.", badges: ["Quiz"] },
      ],
      defaultCode: `// Workflow Engine Simulator\nclass WorkflowEngine {\n  private triggerType: string = "";\n  private actions: { name: string; type: string; execute: (data: any) => any }[] = [];\n\n  trigger(type: string): WorkflowEngine { this.triggerType = type; console.log("Trigger set: " + type); return this; }\n\n  addAction(name: string, type: string, handler: (data: any) => any): WorkflowEngine {\n    this.actions.push({ name, type, execute: handler }); return this;\n  }\n\n  execute(event: any): void {\n    console.log("\\nWorkflow started [" + this.triggerType + "]");\n    let data = event;\n    for (const action of this.actions) {\n      console.log("  -> " + action.name + " (" + action.type + ")");\n      data = action.execute(data) ?? data;\n    }\n    console.log("Workflow completed!");\n  }\n}\n\nconst wf = new WorkflowEngine()\n  .trigger("HTTP Request")\n  .addAction("Parse", "Transform", (d) => { console.log("     Parsed: " + d.name); return { ...d, parsed: true }; })\n  .addAction("Check Stock", "Database", (d) => { console.log("     Stock OK"); return { ...d, inStock: true }; })\n  .addAction("Notify", "Email", (d) => { console.log("     Email sent to: " + d.email); });\n\nwf.execute({ name: "Order #1001", email: "user@contoso.com" });`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("WorkflowEngine") && code.includes("execute") && logs.some((l) => l.includes("Workflow completed")),
        message: "Workflow engine orchestrating like a pro!",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 3 — Storage & Data (Lessons 15-19)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 15 ────────────────────────────────────────────────────────
    {
      title: "Azure 15: Blob Storage",
      content: [
        "Azure Blob Storage is massively scalable object storage for unstructured data — images, videos, logs, backups.",
        "Build a Blob Storage client simulator with upload/download/list operations and access tier costing.",
      ],
      sections: [
        { tag: "concept", title: "Blob Storage Hierarchy", body: "Three levels: **Storage Account** > **Container** > **Blob**. Blob types: **Block** (most common, up to 190 TB), **Append** (logs), **Page** (VM disks). **Access tiers**: **Hot** (frequent), **Cool** (30-day min), **Cold** (90-day min), **Archive** (offline, hours to rehydrate).", badges: ["Blob Storage", "Tiers"], code: "import { BlobServiceClient } from '@azure/storage-blob';\nconst container = client.getContainerClient('images');\nawait container.createIfNotExists();\nconst blob = container.getBlockBlobClient('photo.jpg');\nawait blob.uploadFile('./photo.jpg');" },
        { tag: "exercise", title: "Simulate Blob Storage", body: "Create a `BlobStorageClient` with methods for creating containers, uploading blobs with metadata/tier, listing blobs, and calculating storage costs.", badges: ["Practice", "Blob Storage"] },
        { tag: "key-point", title: "Quiz: Storage Tiers", body: "Which tier has lowest storage cost but highest access cost? **Archive** — designed for rarely accessed data. Storage is ~$0.001/GB/month but rehydration takes hours.", badges: ["Quiz"] },
      ],
      defaultCode: `// Blob Storage Client Simulator\ntype AccessTier = "Hot" | "Cool" | "Cold" | "Archive";\n\nclass BlobStorageClient {\n  private containers = new Map<string, { name: string; size: number; tier: AccessTier }[]>();\n\n  createContainer(name: string): void {\n    if (!this.containers.has(name)) { this.containers.set(name, []); console.log("Container created: " + name); }\n  }\n\n  upload(container: string, blobName: string, size: number, tier: AccessTier = "Hot"): void {\n    const blobs = this.containers.get(container);\n    if (!blobs) throw new Error("Container not found");\n    blobs.push({ name: blobName, size, tier });\n    console.log("Uploaded: " + container + "/" + blobName + " (" + size + " KB, " + tier + ")");\n  }\n\n  listBlobs(container: string) { return this.containers.get(container) || []; }\n\n  calculateMonthlyCost(container: string): number {\n    const rates: Record<AccessTier, number> = { Hot: 0.018, Cool: 0.01, Cold: 0.0036, Archive: 0.001 };\n    const blobs = this.listBlobs(container);\n    return blobs.reduce((cost, b) => cost + (b.size / 1024 / 1024) * rates[b.tier], 0);\n  }\n}\n\nconst storage = new BlobStorageClient();\nstorage.createContainer("images");\nstorage.createContainer("backups");\nstorage.upload("images", "logo.png", 256, "Hot");\nstorage.upload("images", "banner.jpg", 2048, "Hot");\nstorage.upload("backups", "db-2024.bak", 512000, "Cool");\nstorage.upload("backups", "db-2023.bak", 512000, "Archive");\n\nconsole.log("\\nImages: " + storage.listBlobs("images").length + " blobs");\nconsole.log("Backups cost/mo: $" + storage.calculateMonthlyCost("backups").toFixed(4));`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("BlobStorageClient") && code.includes("upload") && logs.some((l) => l.includes("Container created")) && logs.some((l) => l.includes("Uploaded")),
        message: "Blob Storage operations mastered!",
      }),
    },

    // ── Lesson 16 ────────────────────────────────────────────────────────
    {
      title: "Azure 16: Table Storage & Queue Storage",
      content: [
        "Table Storage is a NoSQL key-value store. Queue Storage provides reliable messaging between components.",
        "Build a Table Storage client with CRUD and a Queue client with message lifecycle management.",
      ],
      sections: [
        { tag: "concept", title: "Table & Queue", body: "**Table Storage** uses **PartitionKey** + **RowKey** composite key. Schemaless — each entity can have different properties. **Queue Storage** provides async messaging. Messages up to 64 KB, stored up to 7 days. Pattern: enqueue > dequeue (invisible) > delete.", badges: ["Table", "Queue", "NoSQL"] },
        { tag: "exercise", title: "Build Table and Queue clients", body: "Create a `TableStore` with `insert/query/delete` and a `MessageQueue` with `enqueue/dequeue/complete`.", badges: ["Practice"] },
        { tag: "key-point", title: "Quiz: Visibility Timeout", body: "What happens if a consumer dequeues a message but crashes? The message becomes **visible again** after the timeout (default 30s). Design consumers to be idempotent!", badges: ["Quiz"] },
      ],
      defaultCode: `// Table + Queue Storage\nclass TableStore {\n  private data = new Map<string, Map<string, Record<string, any>>>();\n\n  insert(pk: string, rk: string, entity: Record<string, any>): void {\n    if (!this.data.has(pk)) this.data.set(pk, new Map());\n    this.data.get(pk)!.set(rk, { ...entity, partitionKey: pk, rowKey: rk });\n    console.log("Table: Inserted " + pk + "/" + rk);\n  }\n\n  query(pk: string): Record<string, any>[] {\n    const partition = this.data.get(pk);\n    return partition ? Array.from(partition.values()) : [];\n  }\n\n  delete(pk: string, rk: string): boolean {\n    const deleted = this.data.get(pk)?.delete(rk) ?? false;\n    console.log("Table: " + (deleted ? "Deleted" : "Not found") + " " + pk + "/" + rk);\n    return deleted;\n  }\n}\n\nclass MessageQueue {\n  private queue: { id: string; body: any; visible: boolean }[] = [];\n  private counter = 0;\n\n  enqueue(message: any): string {\n    const id = "msg-" + (++this.counter);\n    this.queue.push({ id, body: message, visible: true });\n    console.log("Queue: Enqueued " + id);\n    return id;\n  }\n\n  dequeue(): { id: string; body: any } | null {\n    const msg = this.queue.find(m => m.visible);\n    if (msg) { msg.visible = false; console.log("Queue: Dequeued " + msg.id); return { id: msg.id, body: msg.body }; }\n    return null;\n  }\n\n  complete(id: string): void {\n    this.queue = this.queue.filter(m => m.id !== id);\n    console.log("Queue: Completed " + id);\n  }\n}\n\nconst table = new TableStore();\ntable.insert("US", "user-001", { name: "Alice" });\ntable.insert("US", "user-002", { name: "Bob" });\nconsole.log("US users: " + table.query("US").length);\n\nconst queue = new MessageQueue();\nqueue.enqueue({ orderId: "ORD-100", total: 59.99 });\nqueue.enqueue({ orderId: "ORD-101", total: 129.99 });\nconst msg = queue.dequeue();\nif (msg) { console.log("Processing: " + JSON.stringify(msg.body)); queue.complete(msg.id); }`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("TableStore") && code.includes("MessageQueue") && logs.some((l) => l.includes("Table: Inserted")) && logs.some((l) => l.includes("Queue: Enqueued")),
        message: "Table and Queue storage mastered!",
      }),
    },

    // ── Lesson 17 ────────────────────────────────────────────────────────
    {
      title: "Azure 17: Azure Cosmos DB",
      content: [
        "Cosmos DB is Azure's globally distributed, multi-model NoSQL database with single-digit ms reads and 99.999% availability.",
        "Build a Cosmos DB client simulator with partition keys and RU cost estimation.",
      ],
      sections: [
        { tag: "concept", title: "Cosmos DB Core", body: "**Account** > **Database** > **Container** > **Items** (JSON). The **Partition Key** determines data distribution. Throughput measured in **RU/s** (Request Units). APIs: **NoSQL** (recommended), MongoDB, Cassandra, Gremlin, Table. Consistency levels: Strong, Bounded Staleness, **Session** (default), Consistent Prefix, Eventual.", badges: ["Cosmos DB", "NoSQL", "Global"], code: "const { container } = await database.containers.createIfNotExists({\n  id: 'users', partitionKey: { paths: ['/country'] }\n});\nawait container.items.create({ id: '1', country: 'US', name: 'Alice' });" },
        { tag: "exercise", title: "Simulate Cosmos DB with RU tracking", body: "Create a `CosmosDBClient` with `createItem`, `readItem` (by id + partition key), and `query` (with filter). Track estimated RU cost for each operation.", badges: ["Practice", "Cosmos DB"] },
        { tag: "key-point", title: "Quiz: Default Consistency", body: "What is the default consistency level? **Session** — reads never see out-of-order writes within a session. Good balance between latency and correctness.", badges: ["Quiz"] },
      ],
      defaultCode: `// Cosmos DB Simulator\nclass CosmosDBClient {\n  private databases = new Map<string, Map<string, { pk: string; items: any[] }>>();\n  private totalRU = 0;\n\n  createDatabase(name: string): void { this.databases.set(name, new Map()); console.log("DB: " + name); }\n\n  createContainer(db: string, name: string, pk: string): void {\n    this.databases.get(db)?.set(name, { pk, items: [] });\n    console.log("Container: " + db + "/" + name + " (PK: " + pk + ")");\n  }\n\n  createItem(db: string, cont: string, item: any): number {\n    const c = this.databases.get(db)?.get(cont);\n    if (!c) throw new Error("Container not found");\n    c.items.push(item); const ru = 5; this.totalRU += ru;\n    console.log("Created: " + item.id + " (" + ru + " RU)");\n    return ru;\n  }\n\n  readItem(db: string, cont: string, id: string, pkValue: string): any {\n    const c = this.databases.get(db)?.get(cont);\n    if (!c) throw new Error("Container not found");\n    const item = c.items.find(i => i.id === id && i[c.pk] === pkValue);\n    this.totalRU += 1; console.log("Read: " + id + " (1 RU)");\n    return item;\n  }\n\n  query(db: string, cont: string, predicate: (item: any) => boolean): any[] {\n    const c = this.databases.get(db)?.get(cont);\n    if (!c) throw new Error("Container not found");\n    const results = c.items.filter(predicate);\n    const ru = 2.5 + results.length * 0.5; this.totalRU += ru;\n    console.log("Query: " + results.length + " items (" + ru + " RU)");\n    return results;\n  }\n\n  getTotalRU(): number { return this.totalRU; }\n}\n\nconst cosmos = new CosmosDBClient();\ncosmos.createDatabase("ecommerce");\ncosmos.createContainer("ecommerce", "products", "category");\ncosmos.createItem("ecommerce", "products", { id: "p1", category: "electronics", name: "Laptop", price: 999 });\ncosmos.createItem("ecommerce", "products", { id: "p2", category: "electronics", name: "Phone", price: 699 });\ncosmos.createItem("ecommerce", "products", { id: "p3", category: "books", name: "Azure Guide", price: 49 });\ncosmos.readItem("ecommerce", "products", "p1", "electronics");\ncosmos.query("ecommerce", "products", (item) => item.category === "electronics");\nconsole.log("\\nTotal RU: " + cosmos.getTotalRU());`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("CosmosDBClient") && code.includes("createItem") && code.includes("query") && logs.some((l) => l.includes("RU")),
        message: "Cosmos DB with RU tracking!",
      }),
    },

    // ── Lesson 18 ────────────────────────────────────────────────────────
    {
      title: "Azure 18: Azure SQL Database",
      content: [
        "Azure SQL Database is a fully managed relational database engine based on SQL Server with auto-patching, backups, and scaling.",
        "Build a SQL query builder with chainable methods for common query patterns.",
      ],
      sections: [
        { tag: "concept", title: "Azure SQL Options", body: "Models: **Single Database**, **Elastic Pool** (shared resources, multi-tenant), **Managed Instance**. Pricing: **DTU** (bundled) or **vCore** (independent scaling). Features: **Auto-tuning**, **Geo-replication**, **Hyperscale** (up to 100 TB).", badges: ["Azure SQL", "Relational"], code: "az sql db create --name db-webapp --server sql-prod \\\n  -g rg-data --service-objective S1" },
        { tag: "exercise", title: "Build a SQL query builder", body: "Create a `SQLQueryBuilder` with chainable `select`, `from`, `where`, `join`, `orderBy`, `limit` methods and a `build()` method returning SQL.", badges: ["Practice", "SQL"] },
        { tag: "key-point", title: "Quiz: Elastic Pools", body: "Why use Elastic Pools? When multiple databases have **unpredictable usage** — they share resources. One DB idle means others can burst. Saves 50-70% vs individual databases.", badges: ["Quiz"] },
      ],
      defaultCode: `// SQL Query Builder\nclass SQLQueryBuilder {\n  private parts = { select: "*", from: "", where: [] as string[], joins: [] as string[], order: "", limit: 0 };\n\n  select(...cols: string[]): SQLQueryBuilder { this.parts.select = cols.join(", "); return this; }\n  from(table: string): SQLQueryBuilder { this.parts.from = table; return this; }\n  where(cond: string): SQLQueryBuilder { this.parts.where.push(cond); return this; }\n  join(table: string, on: string): SQLQueryBuilder { this.parts.joins.push("JOIN " + table + " ON " + on); return this; }\n  orderBy(col: string, dir: "ASC" | "DESC" = "ASC"): SQLQueryBuilder { this.parts.order = col + " " + dir; return this; }\n  limit(n: number): SQLQueryBuilder { this.parts.limit = n; return this; }\n\n  build(): string {\n    let sql = "SELECT " + this.parts.select + "\\nFROM " + this.parts.from;\n    for (const j of this.parts.joins) sql += "\\n" + j;\n    if (this.parts.where.length) sql += "\\nWHERE " + this.parts.where.join(" AND ");\n    if (this.parts.order) sql += "\\nORDER BY " + this.parts.order;\n    if (this.parts.limit) sql += "\\nOFFSET 0 ROWS FETCH NEXT " + this.parts.limit + " ROWS ONLY";\n    return sql;\n  }\n}\n\nconst query = new SQLQueryBuilder()\n  .select("u.name", "u.email", "o.total")\n  .from("users u")\n  .join("orders o", "u.id = o.user_id")\n  .where("o.total > 100")\n  .where("u.active = 1")\n  .orderBy("o.created_at", "DESC")\n  .limit(20)\n  .build();\n\nconsole.log("Generated SQL:\\n" + query);`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("SQLQueryBuilder") && code.includes("build()") && logs.some((l) => l.includes("SELECT")),
        message: "SQL query builder done!",
      }),
    },

    // ── Lesson 19 ────────────────────────────────────────────────────────
    {
      title: "Azure 19: Azure Cache for Redis",
      content: [
        "Azure Cache for Redis provides an in-memory data store for caching, session management, and real-time analytics.",
        "Build a Redis cache simulator with TTL-based expiration and the cache-aside pattern.",
      ],
      sections: [
        { tag: "concept", title: "Redis in Azure", body: "Tiers: **Basic** (dev), **Standard** (replicated, 99.9% SLA), **Premium** (clustering, VNet). Patterns: **Cache-Aside** (check cache first, load from DB on miss), **Session Store**, **Leaderboard** (sorted sets). Data structures: Strings, Hashes, Lists, Sets, Sorted Sets.", badges: ["Redis", "Caching"] },
        { tag: "exercise", title: "Build cache-aside pattern", body: "Create a `RedisCache` with `set/get` (TTL support), `hSet/hGet`, and a `cacheAside(key, ttl, loader)` method. Log hits vs misses.", badges: ["Practice", "Redis"] },
        { tag: "key-point", title: "Quiz: Cache Stampede", body: "What is a cache stampede? When a popular key expires and hundreds of requests simultaneously hit the DB. Prevent with: **lock-based** rebuilds or **probabilistic early expiration**.", badges: ["Quiz"] },
      ],
      defaultCode: `// Redis Cache with Cache-Aside\nclass RedisCache {\n  private store = new Map<string, { value: any; expiresAt: number }>();\n  private stats = { hits: 0, misses: 0 };\n\n  set(key: string, value: any, ttlSec: number = 3600): void {\n    this.store.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });\n  }\n\n  get(key: string): any | null {\n    const entry = this.store.get(key);\n    if (!entry || Date.now() > entry.expiresAt) { this.store.delete(key); this.stats.misses++; return null; }\n    this.stats.hits++; return entry.value;\n  }\n\n  hSet(key: string, fields: Record<string, any>, ttl: number = 3600): void { this.set(key, fields, ttl); }\n  hGet(key: string, field: string): any | null { const h = this.get(key); return h ? h[field] : null; }\n\n  cacheAside<T>(key: string, ttl: number, loader: () => T): T {\n    const cached = this.get(key);\n    if (cached !== null) { console.log("  CACHE HIT: " + key); return cached; }\n    console.log("  CACHE MISS: " + key + " -> loading from DB...");\n    const value = loader();\n    this.set(key, value, ttl);\n    return value;\n  }\n\n  getStats() { return { ...this.stats, ratio: this.stats.hits / Math.max(1, this.stats.hits + this.stats.misses) }; }\n}\n\nconst cache = new RedisCache();\nconst fakeDB: Record<string, any> = { "user:1": { name: "Alice", role: "admin" }, "user:2": { name: "Bob", role: "user" } };\n\ncache.cacheAside("user:1", 300, () => fakeDB["user:1"]);\ncache.cacheAside("user:1", 300, () => fakeDB["user:1"]); // hit!\ncache.cacheAside("user:2", 300, () => fakeDB["user:2"]);\n\ncache.hSet("session:abc", { userId: "1", role: "admin" }, 1800);\nconsole.log("Session role: " + cache.hGet("session:abc", "role"));\n\nconst stats = cache.getStats();\nconsole.log("\\nCache: " + stats.hits + " hits, " + stats.misses + " misses (" + (stats.ratio * 100).toFixed(0) + "%)");`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("RedisCache") && code.includes("cacheAside") && logs.some((l) => l.includes("CACHE HIT")) && logs.some((l) => l.includes("CACHE MISS")),
        message: "Redis cache-aside pattern implemented!",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 4 — Networking (Lessons 20-23)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 20 ────────────────────────────────────────────────────────
    {
      title: "Azure 20: Virtual Networks & Subnets",
      content: [
        "Azure VNet is the foundation of Azure networking — isolation, segmentation, and connectivity for cloud resources.",
        "Build a VNet CIDR calculator and subnet planner that validates IP ranges and assigns subnets.",
      ],
      sections: [
        { tag: "concept", title: "VNet Fundamentals", body: "A **VNet** is defined by a CIDR block (e.g., `10.0.0.0/16`). **Subnets** divide the VNet. Azure reserves 5 IPs per subnet. **VNet Peering** connects VNets. **Private Endpoints** securely connect to PaaS services.", badges: ["VNet", "Subnet", "CIDR"], code: "az network vnet create --name vnet-prod -g rg-net --address-prefix 10.0.0.0/16\naz network vnet subnet create --vnet-name vnet-prod -g rg-net --name snet-web --address-prefix 10.0.1.0/24" },
        { tag: "exercise", title: "Build a subnet planner", body: "Create a `SubnetPlanner` that takes a VNet CIDR, allocates subnets of requested sizes, and tracks IP usage.", badges: ["Practice", "Networking"] },
        { tag: "key-point", title: "Quiz: Reserved IPs", body: "How many usable IPs in a /24 subnet in Azure? **251** — Azure reserves 5 IPs (.0, .1, .2, .3, .255).", badges: ["Quiz"] },
      ],
      defaultCode: `// VNet Subnet Planner\nclass SubnetPlanner {\n  private vnetCidr: string;\n  private vnetSize: number;\n  private subnets: { name: string; cidr: string; usable: number }[] = [];\n  private nextOctet = 0;\n\n  constructor(cidr: string) {\n    this.vnetCidr = cidr;\n    this.vnetSize = Math.pow(2, 32 - parseInt(cidr.split("/")[1]));\n    console.log("VNet: " + cidr + " (" + this.vnetSize + " total IPs)");\n  }\n\n  addSubnet(name: string, prefix: number): boolean {\n    const size = Math.pow(2, 32 - prefix);\n    const usable = size - 5;\n    const base = this.vnetCidr.split("/")[0].split(".");\n    const cidr = base[0] + "." + base[1] + "." + this.nextOctet + ".0/" + prefix;\n    this.subnets.push({ name, cidr, usable });\n    this.nextOctet += size / 256;\n    console.log("  " + name.padEnd(20) + cidr.padEnd(18) + usable + " usable");\n    return true;\n  }\n\n  summary(): void {\n    const used = this.subnets.reduce((s, sub) => s + sub.usable + 5, 0);\n    console.log("\\n--- Summary ---");\n    console.log("Subnets: " + this.subnets.length + " | Used: " + used + " | Free: " + (this.vnetSize - used));\n  }\n}\n\nconst planner = new SubnetPlanner("10.0.0.0/16");\nplanner.addSubnet("snet-web", 24);\nplanner.addSubnet("snet-app", 24);\nplanner.addSubnet("snet-db", 24);\nplanner.addSubnet("snet-mgmt", 26);\nplanner.addSubnet("snet-gateway", 27);\nplanner.summary();`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("SubnetPlanner") && code.includes("addSubnet") && logs.some((l) => l.includes("VNet:")),
        message: "VNet subnets planned perfectly!",
      }),
    },

    // ── Lesson 21 ────────────────────────────────────────────────────────
    {
      title: "Azure 21: Network Security Groups (NSGs)",
      content: [
        "NSGs are Azure's built-in firewall for filtering traffic based on IP, port, and protocol.",
        "Build an NSG rule engine that evaluates traffic against ordered rules and determines allow/deny.",
      ],
      sections: [
        { tag: "concept", title: "NSG Rules", body: "Each rule has: **Priority** (100-4096, lower = higher), **Source/Destination**, **Protocol**, **Port Range**, **Action** (Allow/Deny). First match wins. NSGs attach to **subnets** or **NICs**.", badges: ["NSG", "Firewall"], code: "az network nsg create -g rg-net -n nsg-web\naz network nsg rule create -g rg-net --nsg-name nsg-web \\\n  -n AllowHTTP --priority 100 --direction Inbound \\\n  --access Allow --protocol Tcp --destination-port-ranges 80 443" },
        { tag: "exercise", title: "Build an NSG evaluator", body: "Create an `NSGEngine` with `addRule(...)` and `evaluate(direction, sourceIP, destPort, protocol)` returning Allow or Deny.", badges: ["Practice", "NSG"] },
        { tag: "key-point", title: "Quiz: Rule Evaluation", body: "With AllowHTTP at priority 100 (port 80 only) and DenyAll at 200, is HTTPS (443) allowed? **No** — port 443 doesn't match AllowHTTP, so it hits DenyAll.", badges: ["Quiz"] },
      ],
      defaultCode: `// NSG Rule Evaluator\ninterface NSGRule {\n  name: string; priority: number; direction: "Inbound" | "Outbound";\n  action: "Allow" | "Deny"; protocol: string; sourceIP: string; destPorts: number[];\n}\n\nclass NSGEngine {\n  private rules: NSGRule[] = [];\n\n  addRule(rule: NSGRule): void {\n    this.rules.push(rule);\n    this.rules.sort((a, b) => a.priority - b.priority);\n  }\n\n  evaluate(direction: "Inbound" | "Outbound", sourceIP: string, destPort: number, protocol: string): { action: string; rule: string } {\n    for (const r of this.rules) {\n      if (r.direction !== direction) continue;\n      if (r.protocol !== "*" && r.protocol !== protocol) continue;\n      if (r.sourceIP !== "*" && !sourceIP.startsWith(r.sourceIP.split(".").slice(0, 2).join("."))) continue;\n      if (!r.destPorts.includes(destPort) && !r.destPorts.includes(0)) continue;\n      return { action: r.action, rule: r.name };\n    }\n    return { action: "Deny", rule: "DefaultDeny" };\n  }\n}\n\nconst nsg = new NSGEngine();\nnsg.addRule({ name: "AllowHTTP", priority: 100, direction: "Inbound", action: "Allow", protocol: "TCP", sourceIP: "*", destPorts: [80, 443] });\nnsg.addRule({ name: "AllowSSH-VNet", priority: 200, direction: "Inbound", action: "Allow", protocol: "TCP", sourceIP: "10.0.0.0/16", destPorts: [22] });\nnsg.addRule({ name: "DenySSH-Public", priority: 300, direction: "Inbound", action: "Deny", protocol: "TCP", sourceIP: "*", destPorts: [22] });\nnsg.addRule({ name: "DenyAll", priority: 4000, direction: "Inbound", action: "Deny", protocol: "*", sourceIP: "*", destPorts: [0] });\n\nconst tests = [\n  { src: "52.1.2.3", port: 80, proto: "TCP", desc: "Public HTTP" },\n  { src: "10.0.1.5", port: 22, proto: "TCP", desc: "VNet SSH" },\n  { src: "52.1.2.3", port: 22, proto: "TCP", desc: "Public SSH" },\n  { src: "52.1.2.3", port: 3389, proto: "TCP", desc: "Public RDP" },\n];\nfor (const t of tests) {\n  const r = nsg.evaluate("Inbound", t.src, t.port, t.proto);\n  console.log(t.desc.padEnd(14) + " -> " + r.action.padEnd(6) + " [" + r.rule + "]");\n}`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("NSGEngine") && code.includes("evaluate") && logs.some((l) => l.includes("Allow")) && logs.some((l) => l.includes("Deny")),
        message: "NSG rule evaluator working!",
      }),
    },

    // ── Lesson 22 ────────────────────────────────────────────────────────
    {
      title: "Azure 22: Load Balancer & Application Gateway",
      content: [
        "Azure Load Balancer (Layer 4) and Application Gateway (Layer 7 with WAF) distribute traffic across backends.",
        "Build a load balancer simulator with round-robin distribution and health checks.",
      ],
      sections: [
        { tag: "concept", title: "L4 vs L7", body: "**Load Balancer**: Layer 4 (TCP/UDP), ultra-fast, round-robin or hash-based. **Application Gateway**: Layer 7 (HTTP), URL-based routing, SSL termination, WAF, cookie affinity. Use LB for non-HTTP; App Gateway for web apps.", badges: ["Load Balancer", "App Gateway", "WAF"] },
        { tag: "exercise", title: "Build a load balancer", body: "Create a `LoadBalancer` class with round-robin distribution, health checks, and stats logging.", badges: ["Practice", "Load Balancing"] },
        { tag: "key-point", title: "Quiz: When App Gateway?", body: "You need SSL termination, URL routing, and WAF. Which? **Application Gateway** — designed for HTTP-layer features.", badges: ["Quiz"] },
      ],
      defaultCode: `// Load Balancer Simulator\nclass LoadBalancer {\n  private backends: { name: string; healthy: boolean; requests: number }[] = [];\n  private idx = 0;\n\n  addBackend(name: string): void { this.backends.push({ name, healthy: true, requests: 0 }); }\n  setHealth(name: string, healthy: boolean): void {\n    const b = this.backends.find(b => b.name === name); if (b) b.healthy = healthy;\n  }\n\n  route(): string {\n    const healthy = this.backends.filter(b => b.healthy);\n    if (!healthy.length) throw new Error("No healthy backends!");\n    const selected = healthy[this.idx % healthy.length];\n    this.idx++; selected.requests++;\n    return selected.name;\n  }\n\n  stats(): void {\n    console.log("\\n--- LB Stats ---");\n    for (const b of this.backends)\n      console.log(b.name.padEnd(14) + (b.healthy ? "OK  " : "DOWN") + " | " + b.requests + " requests");\n  }\n}\n\nconst lb = new LoadBalancer();\nlb.addBackend("backend-01");\nlb.addBackend("backend-02");\nlb.addBackend("backend-03");\nlb.setHealth("backend-02", false);\n\nconsole.log("Distributing 12 requests (backend-02 down):\\n");\nfor (let i = 0; i < 12; i++) console.log("Request " + (i + 1).toString().padStart(2) + " -> " + lb.route());\nlb.stats();`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("LoadBalancer") && code.includes("route") && logs.some((l) => l.includes("Request")) && logs.some((l) => l.includes("Stats")),
        message: "Load balancer distributing traffic!",
      }),
    },

    // ── Lesson 23 ────────────────────────────────────────────────────────
    {
      title: "Azure 23: Azure DNS & Custom Domains",
      content: [
        "Azure DNS hosts your DNS zones on Azure's global anycast network for both public and private resolution.",
        "Build a DNS zone manager that handles A, CNAME, TXT records with resolution simulation.",
      ],
      sections: [
        { tag: "concept", title: "Azure DNS", body: "Record types: **A** (name to IPv4), **AAAA** (IPv6), **CNAME** (alias), **MX** (mail), **TXT** (verification). **Alias records** point to Azure resources and auto-update if IP changes. **Private zones** resolve within VNets.", badges: ["DNS", "Zones", "Records"], code: "az network dns zone create -g rg-dns -n contoso.com\naz network dns record-set a add-record -g rg-dns -z contoso.com -n www -a 20.50.100.1" },
        { tag: "exercise", title: "Build a DNS manager", body: "Create a `DNSZoneManager` with methods to add records and a `resolve(hostname)` method that walks CNAME chains.", badges: ["Practice", "DNS"] },
        { tag: "key-point", title: "Quiz: CNAME at apex", body: "Can you use CNAME at the zone apex (`contoso.com`)? **No** — DNS standards prohibit it. Use Azure **Alias records** instead.", badges: ["Quiz"] },
      ],
      defaultCode: `// DNS Zone Manager\ntype RecordType = "A" | "CNAME" | "TXT" | "MX";\n\nclass DNSZoneManager {\n  private zones = new Map<string, { name: string; type: RecordType; value: string; ttl: number }[]>();\n\n  createZone(domain: string): void { this.zones.set(domain, []); console.log("Zone: " + domain); }\n\n  addRecord(zone: string, name: string, type: RecordType, value: string, ttl: number = 3600): void {\n    this.zones.get(zone)?.push({ name, type, value, ttl });\n    console.log("  " + type.padEnd(6) + name.padEnd(16) + "-> " + value);\n  }\n\n  resolve(hostname: string): string {\n    const parts = hostname.split(".");\n    const zone = parts.slice(-2).join(".");\n    const name = parts.slice(0, -2).join(".") || "@";\n    const records = this.zones.get(zone);\n    if (!records) return "NXDOMAIN";\n    const match = records.find(r => r.name === name);\n    if (!match) return "NXDOMAIN";\n    if (match.type === "CNAME") { console.log("  " + hostname + " -> CNAME -> " + match.value); return match.value; }\n    return match.value;\n  }\n}\n\nconst dns = new DNSZoneManager();\ndns.createZone("contoso.com");\ndns.addRecord("contoso.com", "@", "A", "20.50.100.1");\ndns.addRecord("contoso.com", "www", "CNAME", "contoso.azurewebsites.net");\ndns.addRecord("contoso.com", "api", "A", "20.50.100.2", 300);\ndns.addRecord("contoso.com", "@", "MX", "mail.contoso.com");\n\nconsole.log("\\nResolving:");\nconsole.log("api.contoso.com -> " + dns.resolve("api.contoso.com"));\nconsole.log("www.contoso.com -> " + dns.resolve("www.contoso.com"));`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("DNSZoneManager") && code.includes("resolve") && logs.some((l) => l.includes("Zone:")),
        message: "DNS zone management mastered!",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 5 — DevOps & CI/CD (Lessons 24-27)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 24 ────────────────────────────────────────────────────────
    {
      title: "Azure 24: Azure DevOps Pipelines",
      content: [
        "Azure DevOps Pipelines provides CI/CD with YAML-based pipelines that live in your repo.",
        "Build a pipeline configuration generator that creates multi-stage YAML definitions.",
      ],
      sections: [
        { tag: "concept", title: "Pipeline Architecture", body: "Structure: **Trigger** (push, PR, schedule), **Pool** (agent), **Stages** > **Jobs** > **Steps**. Features: **Templates**, **Environments** (approvals), **Variable Groups**, **Artifacts** (pass data between stages).", badges: ["Azure DevOps", "CI/CD", "Pipelines"] },
        { tag: "exercise", title: "Generate a pipeline", body: "Create a `PipelineGenerator` with `trigger`, `addStage`, `addJob` methods and `generate()` output.", badges: ["Practice", "Pipelines"] },
        { tag: "key-point", title: "Quiz: Agents", body: "**Microsoft-hosted**: fresh VMs per job, no state. **Self-hosted**: your infrastructure, persistent, private network access.", badges: ["Quiz"] },
      ],
      defaultCode: `// Pipeline Generator\nclass PipelineGenerator {\n  private triggers: string[] = [];\n  private stages: { name: string; jobs: { name: string; steps: string[] }[]; dependsOn?: string }[] = [];\n\n  trigger(branches: string[]): PipelineGenerator { this.triggers = branches; return this; }\n\n  addStage(name: string, dependsOn?: string): PipelineGenerator {\n    this.stages.push({ name, jobs: [], dependsOn }); return this;\n  }\n\n  addJob(stage: string, name: string, steps: string[]): PipelineGenerator {\n    const s = this.stages.find(s => s.name === stage);\n    if (s) s.jobs.push({ name, steps }); return this;\n  }\n\n  generate(): string {\n    let y = "trigger:\\n";\n    for (const b of this.triggers) y += "  - " + b + "\\n";\n    for (const s of this.stages) {\n      y += "\\nstages:\\n  - stage: " + s.name + "\\n";\n      if (s.dependsOn) y += "    dependsOn: " + s.dependsOn + "\\n";\n      y += "    jobs:\\n";\n      for (const j of s.jobs) {\n        y += "      - job: " + j.name + "\\n        steps:\\n";\n        for (const step of j.steps) y += "          - script: " + step + "\\n";\n      }\n    }\n    return y;\n  }\n}\n\nconst pipeline = new PipelineGenerator()\n  .trigger(["main", "develop"])\n  .addStage("Build")\n  .addJob("Build", "BuildAndTest", ["npm ci", "npm test", "npm run build"])\n  .addStage("Deploy", "Build")\n  .addJob("Deploy", "DeployToAzure", ["az webapp deploy --name myapp"])\n  .generate();\n\nconsole.log(pipeline);`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("PipelineGenerator") && code.includes("generate") && logs.some((l) => l.includes("trigger")),
        message: "CI/CD pipeline generated!",
      }),
    },

    // ── Lesson 25 ────────────────────────────────────────────────────────
    {
      title: "Azure 25: GitHub Actions for Azure",
      content: [
        "GitHub Actions integrates natively with Azure using official actions for login, deployment, and resource management.",
        "Build a GitHub Actions workflow generator for Azure deployments.",
      ],
      sections: [
        { tag: "concept", title: "GitHub Actions + Azure", body: "Key actions: **azure/login** (OIDC or service principal), **azure/webapps-deploy**, **azure/functions-action**, **azure/aks-set-context**. Best practice: use **OIDC federation** — no stored secrets, short-lived tokens.", badges: ["GitHub Actions", "OIDC"] },
        { tag: "exercise", title: "Generate a workflow", body: "Create a `WorkflowGenerator` that builds GitHub Actions YAML for Azure. Support App Service, Functions, AKS targets.", badges: ["Practice", "GitHub Actions"] },
        { tag: "key-point", title: "Quiz: OIDC", body: "Why OIDC over service principal secrets? **Short-lived tokens** per workflow run — no secrets to rotate or leak.", badges: ["Quiz"] },
      ],
      defaultCode: `// GitHub Actions Workflow Generator\ntype AzureTarget = "AppService" | "Functions" | "AKS";\n\nclass WorkflowGenerator {\n  private name: string;\n  private triggers: string[] = [];\n  private target: AzureTarget;\n  private appName: string;\n  private buildSteps: string[] = [];\n\n  constructor(name: string, target: AzureTarget, appName: string) {\n    this.name = name; this.target = target; this.appName = appName;\n  }\n\n  onPush(branches: string[]): WorkflowGenerator { this.triggers = branches; return this; }\n  addBuildStep(step: string): WorkflowGenerator { this.buildSteps.push(step); return this; }\n\n  generate(): string {\n    let wf = "name: " + this.name + "\\non:\\n  push:\\n    branches:\\n";\n    for (const b of this.triggers) wf += "      - " + b + "\\n";\n    wf += "\\npermissions:\\n  id-token: write\\n  contents: read\\n";\n    wf += "\\njobs:\\n  deploy:\\n    runs-on: ubuntu-latest\\n    steps:\\n";\n    wf += "      - uses: actions/checkout@v4\\n";\n    for (const s of this.buildSteps) wf += "      - run: " + s + "\\n";\n    wf += "      - uses: azure/login@v2\\n";\n    const actions: Record<AzureTarget, string> = {\n      AppService: "azure/webapps-deploy@v3", Functions: "azure/functions-action@v2", AKS: "azure/k8s-deploy@v5"\n    };\n    wf += "      - uses: " + actions[this.target] + "\\n";\n    wf += "        with:\\n          app-name: " + this.appName + "\\n";\n    return wf;\n  }\n}\n\nconst wf = new WorkflowGenerator("Deploy Web App", "AppService", "myapp-prod")\n  .onPush(["main"]).addBuildStep("npm ci").addBuildStep("npm test").addBuildStep("npm run build").generate();\nconsole.log(wf);`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("WorkflowGenerator") && code.includes("generate") && logs.some((l) => l.includes("name:")),
        message: "GitHub Actions workflow generated!",
      }),
    },

    // ── Lesson 26 ────────────────────────────────────────────────────────
    {
      title: "Azure 26: Terraform on Azure",
      content: [
        "Terraform is a multi-cloud IaC tool. The AzureRM provider lets you manage Azure resources with HCL.",
        "Build a Terraform configuration generator for common Azure resources.",
      ],
      sections: [
        { tag: "concept", title: "Terraform + Azure", body: "Key concepts: **State** (stored in Azure Storage blob), **Plan** (preview), **Modules** (reusable), **Data Sources** (query existing). Workflow: `init` > `plan` > `apply`. State locking via blob lease.", badges: ["Terraform", "HCL", "IaC"] },
        { tag: "exercise", title: "Generate Terraform configs", body: "Create a `TerraformGenerator` that builds HCL-like configs for resource groups, storage accounts, and VNets with variable references.", badges: ["Practice", "Terraform"] },
        { tag: "key-point", title: "Quiz: Terraform vs Bicep", body: "When Terraform over Bicep? **Multi-cloud** (Azure + AWS + GCP), team already knows Terraform, or non-Azure providers needed (GitHub, Datadog). Bicep for Azure-only.", badges: ["Quiz"] },
      ],
      defaultCode: `// Terraform Config Generator\nclass TerraformGenerator {\n  private resources: string[] = [];\n\n  addResourceGroup(name: string, location: string): TerraformGenerator {\n    this.resources.push('resource "azurerm_resource_group" "' + name + '" {\\n  name     = "' + name + '"\\n  location = "' + location + '"\\n}');\n    return this;\n  }\n\n  addStorageAccount(name: string, rgRef: string): TerraformGenerator {\n    this.resources.push('resource "azurerm_storage_account" "' + name + '" {\\n  name                     = "' + name + '"\\n  resource_group_name      = azurerm_resource_group.' + rgRef + '.name\\n  location                 = azurerm_resource_group.' + rgRef + '.location\\n  account_tier             = "Standard"\\n  account_replication_type = "LRS"\\n}');\n    return this;\n  }\n\n  addVNet(name: string, rgRef: string, cidr: string): TerraformGenerator {\n    this.resources.push('resource "azurerm_virtual_network" "' + name + '" {\\n  name                = "' + name + '"\\n  resource_group_name = azurerm_resource_group.' + rgRef + '.name\\n  location            = azurerm_resource_group.' + rgRef + '.location\\n  address_space       = ["' + cidr + '"]\\n}');\n    return this;\n  }\n\n  generate(): string {\n    return 'provider "azurerm" {\\n  features {}\\n}\\n\\n' + this.resources.join("\\n\\n");\n  }\n}\n\nconst tf = new TerraformGenerator()\n  .addResourceGroup("rg-webapp-prod", "eastus")\n  .addStorageAccount("stwebappprod", "rg-webapp-prod")\n  .addVNet("vnet-webapp", "rg-webapp-prod", "10.0.0.0/16")\n  .generate();\nconsole.log(tf);`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("TerraformGenerator") && code.includes("generate") && logs.some((l) => l.includes("azurerm")),
        message: "Terraform configs generated!",
      }),
    },

    // ── Lesson 27 ────────────────────────────────────────────────────────
    {
      title: "Azure 27: Azure Container Registry (ACR)",
      content: [
        "ACR is a managed Docker registry integrated with AKS, App Service, and Azure DevOps.",
        "Build an ACR manager that handles image repositories, tags, and vulnerability scanning.",
      ],
      sections: [
        { tag: "concept", title: "ACR Features", body: "Tiers: **Basic**, **Standard**, **Premium** (geo-replication, private link). Features: **ACR Tasks** (cloud builds without Docker), **Vulnerability Scanning**, **Geo-replication**, **Repository-scoped tokens**.", badges: ["ACR", "Docker"], code: "az acr create -g rg-containers -n myregistry --sku Premium\naz acr build -r myregistry -t myapp:v1.0 ." },
        { tag: "exercise", title: "Build an ACR manager", body: "Create an `ACRManager` that tracks repos, tags, scan results, and calculates storage costs.", badges: ["Practice", "ACR"] },
        { tag: "key-point", title: "Quiz: ACR Tasks", body: "Why ACR Tasks over local builds? **No Docker Desktop needed**, source code sent to Azure, builds on Azure compute. Can trigger on git commits.", badges: ["Quiz"] },
      ],
      defaultCode: `// ACR Manager\nclass ACRManager {\n  private repos = new Map<string, { tag: string; size: number; scanned: boolean }[]>();\n  private name: string;\n\n  constructor(name: string) { this.name = name; console.log("Registry: " + name + ".azurecr.io"); }\n\n  push(repo: string, tag: string, sizeMB: number): void {\n    if (!this.repos.has(repo)) this.repos.set(repo, []);\n    this.repos.get(repo)!.push({ tag, size: sizeMB, scanned: false });\n    console.log("Pushed: " + this.name + ".azurecr.io/" + repo + ":" + tag + " (" + sizeMB + " MB)");\n  }\n\n  scan(repo: string, tag: string): void {\n    const images = this.repos.get(repo);\n    const img = images?.find(i => i.tag === tag);\n    if (img) {\n      img.scanned = true;\n      const vulns = Math.floor(Math.random() * 5);\n      console.log("Scan " + repo + ":" + tag + " -> " + (vulns === 0 ? "CLEAN" : vulns + " vulnerabilities"));\n    }\n  }\n\n  summary(): void {\n    let total = 0; let count = 0;\n    console.log("\\n--- Registry ---");\n    for (const [repo, tags] of this.repos) {\n      const size = tags.reduce((s, t) => s + t.size, 0);\n      total += size; count += tags.length;\n      console.log(repo + ": " + tags.length + " tags, " + size + " MB");\n    }\n    console.log("Total: " + count + " images, " + total + " MB ($" + (total * 0.003).toFixed(2) + "/mo)");\n  }\n}\n\nconst acr = new ACRManager("myregistry");\nacr.push("webapp/api", "v1.0", 145);\nacr.push("webapp/api", "v1.1", 148);\nacr.push("webapp/frontend", "latest", 220);\nacr.scan("webapp/api", "v1.1");\nacr.scan("webapp/frontend", "latest");\nacr.summary();`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("ACRManager") && code.includes("push") && code.includes("scan") && logs.some((l) => l.includes("Pushed:")),
        message: "ACR management complete!",
      }),
    },

    /* ══════════════════════════════════════════════════════════════════════
     * TIER 6 — Security & Monitoring (Lessons 28-30)
     * ══════════════════════════════════════════════════════════════════════ */

    // ── Lesson 28 ────────────────────────────────────────────────────────
    {
      title: "Azure 28: Azure Key Vault",
      content: [
        "Key Vault centralizes secrets, encryption keys, and certificates. Never store secrets in code.",
        "Build a Key Vault simulator with secret versioning, rotation, and audit logging.",
      ],
      sections: [
        { tag: "concept", title: "Key Vault Essentials", body: "Stores: **Secrets** (passwords, connection strings), **Keys** (RSA/EC, HSM-backed), **Certificates** (TLS/SSL, auto-renewal). Access: **RBAC** (recommended) or Access Policies. **Managed Identity** for app auth. All operations **audited**. **Soft-delete** and **purge protection** prevent loss.", badges: ["Key Vault", "Secrets", "Security"], code: "az keyvault secret set --vault-name kv-prod \\\n  --name db-connection --value 'Server=...'\n\nimport { SecretClient } from '@azure/keyvault-secrets';\nconst secret = await client.getSecret('db-connection');" },
        { tag: "exercise", title: "Build a Key Vault simulator", body: "Create a `KeyVaultClient` with `setSecret`, `getSecret` (expiry check), `rotateSecret` (versioning), and `auditLog`.", badges: ["Practice", "Key Vault"] },
        { tag: "key-point", title: "Quiz: Managed Identity", body: "Why Managed Identity for Key Vault? **No credentials to manage**. Azure auto-provisions and rotates the identity. No secrets in code, no rotation needed.", badges: ["Quiz"] },
      ],
      defaultCode: `// Key Vault Simulator\nclass KeyVaultClient {\n  private secrets = new Map<string, { value: string; version: number; createdAt: string }[]>();\n  private audit: { op: string; target: string }[] = [];\n\n  setSecret(name: string, value: string): void {\n    const versions = this.secrets.get(name) || [];\n    const v = versions.length + 1;\n    versions.push({ value, version: v, createdAt: new Date().toISOString() });\n    this.secrets.set(name, versions);\n    this.audit.push({ op: "SET", target: name + " v" + v });\n    console.log("Secret set: " + name + " (v" + v + ")");\n  }\n\n  getSecret(name: string): string | null {\n    const versions = this.secrets.get(name);\n    if (!versions?.length) { this.audit.push({ op: "GET_FAIL", target: name }); return null; }\n    const latest = versions[versions.length - 1];\n    this.audit.push({ op: "GET", target: name + " v" + latest.version });\n    return latest.value;\n  }\n\n  rotateSecret(name: string, newValue: string): void {\n    this.setSecret(name, newValue);\n    this.audit.push({ op: "ROTATE", target: name });\n    console.log("Rotated: " + name);\n  }\n\n  listSecrets(): void {\n    console.log("\\n--- Vault ---");\n    for (const [name, versions] of this.secrets)\n      console.log(name.padEnd(25) + "v" + versions[versions.length - 1].version);\n  }\n\n  auditLog(): void {\n    console.log("\\n--- Audit ---");\n    for (const e of this.audit) console.log(e.op.padEnd(12) + e.target);\n  }\n}\n\nconst vault = new KeyVaultClient();\nvault.setSecret("db-connection", "Server=sql-prod;Database=mydb;");\nvault.setSecret("api-key", "sk-abc123");\nvault.setSecret("storage-key", "DefaultEndpoints...");\nconsole.log("Retrieved: " + (vault.getSecret("db-connection") ? "OK" : "FAIL"));\nvault.rotateSecret("api-key", "sk-new-456");\nvault.listSecrets();\nvault.auditLog();`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("KeyVaultClient") && code.includes("setSecret") && code.includes("rotateSecret") && code.includes("auditLog") && logs.some((l) => l.includes("Secret set")) && logs.some((l) => l.includes("Audit")),
        message: "Key Vault security mastered!",
      }),
    },

    // ── Lesson 29 ────────────────────────────────────────────────────────
    {
      title: "Azure 29: Azure Monitor & Application Insights",
      content: [
        "Azure Monitor is the unified monitoring platform. App Insights adds APM with request tracking and anomaly detection.",
        "Build a monitoring dashboard that collects metrics, calculates percentiles, and generates alerts.",
      ],
      sections: [
        { tag: "concept", title: "Azure Monitor", body: "Collects: **Metrics** (CPU, memory), **Logs** (KQL queries), **Traces** (distributed). App Insights adds: **Request tracking**, **Dependency mapping**, **Live Metrics**, **Smart Detection**. Query with **KQL** (Kusto Query Language) — pipe-based, time-series optimized.", badges: ["Monitor", "App Insights", "KQL"], code: "// KQL in Log Analytics\nrequests\n| where timestamp > ago(1h)\n| summarize avg(duration), percentile(duration, 95) by name\n| order by avg_duration desc" },
        { tag: "exercise", title: "Build a monitoring dashboard", body: "Create a `MonitoringDashboard` that tracks requests, calculates P50/P95/P99 percentiles, and generates alert rules based on error rate and latency.", badges: ["Practice", "Monitoring"] },
        { tag: "key-point", title: "Quiz: KQL", body: "What is KQL? **Kusto Query Language** — pipe-based (`| where`, `| summarize`, `| render`), reads top-to-bottom like a pipeline. Used in Log Analytics, App Insights, Data Explorer.", badges: ["Quiz"] },
      ],
      defaultCode: `// Monitoring Dashboard\nclass MonitoringDashboard {\n  private requests: { name: string; duration: number; status: number }[] = [];\n\n  trackRequest(name: string, duration: number, status: number): void {\n    this.requests.push({ name, duration, status });\n  }\n\n  percentile(values: number[], p: number): number {\n    const sorted = [...values].sort((a, b) => a - b);\n    return sorted[Math.max(0, Math.ceil(sorted.length * p / 100) - 1)];\n  }\n\n  report(): void {\n    const byName = new Map<string, number[]>();\n    for (const r of this.requests) {\n      if (!byName.has(r.name)) byName.set(r.name, []);\n      byName.get(r.name)!.push(r.duration);\n    }\n    console.log("--- Performance ---");\n    console.log("Endpoint".padEnd(18) + "P50".padEnd(8) + "P95".padEnd(8) + "P99".padEnd(8) + "Count");\n    for (const [name, d] of byName) {\n      console.log(name.padEnd(18) + (this.percentile(d, 50) + "ms").padEnd(8) + (this.percentile(d, 95) + "ms").padEnd(8) + (this.percentile(d, 99) + "ms").padEnd(8) + d.length);\n    }\n  }\n\n  checkAlerts(): void {\n    const errors = this.requests.filter(r => r.status >= 500);\n    const errorRate = (errors.length / this.requests.length) * 100;\n    console.log("\\n--- Alerts ---");\n    if (errorRate > 5) console.log("ALERT: Error rate " + errorRate.toFixed(1) + "%");\n    else console.log("All clear! Error rate: " + errorRate.toFixed(1) + "%");\n  }\n}\n\nconst dash = new MonitoringDashboard();\nconst endpoints = ["/api/users", "/api/orders", "/api/products"];\nfor (let i = 0; i < 50; i++) {\n  const name = endpoints[i % 3];\n  const duration = Math.floor(Math.random() * 500) + (i % 7 === 0 ? 2000 : 50);\n  const status = Math.random() > 0.92 ? 500 : 200;\n  dash.trackRequest(name, duration, status);\n}\ndash.report();\ndash.checkAlerts();`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("MonitoringDashboard") && code.includes("percentile") && code.includes("checkAlerts") && logs.some((l) => l.includes("Performance")),
        message: "Monitoring dashboard operational!",
      }),
    },

    // ── Lesson 30 ────────────────────────────────────────────────────────
    {
      title: "Azure 30: Cloud Architecture - Putting It All Together",
      content: [
        "Final lesson! Combine everything to architect a complete solution using the Azure Well-Architected Framework.",
        "Build an analyzer that evaluates a design against the five pillars and generates a readiness scorecard.",
      ],
      sections: [
        { tag: "concept", title: "Well-Architected Framework", body: "Five pillars: **Reliability** (resiliency, recovery), **Security** (identity, data protection), **Cost Optimization** (right-sizing, reservations), **Operational Excellence** (DevOps, monitoring), **Performance Efficiency** (scaling, caching). Every decision should be evaluated against these pillars.", badges: ["Well-Architected", "5 Pillars"] },
        { tag: "concept", title: "Reference Architecture", body: "Production web app: **App Service** or AKS, **Azure SQL** + **Redis**, **Blob Storage**, **Key Vault**, **Application Gateway** with WAF, **VNet** + NSGs, **App Insights**, CI/CD pipelines, **Tags** + **Policy** for governance.", badges: ["Architecture"] },
        { tag: "exercise", title: "Build a Well-Architected scorecard", body: "Create a `WellArchitectedAnalyzer` that scores an architecture spec against all five pillars (0-100 each) based on best practices.", badges: ["Practice", "Architecture"] },
        { tag: "key-point", title: "Course Complete!", body: "You have covered Azure from cloud concepts to production architecture! Key takeaways: use **PaaS** when possible, **IaC** for everything, **Managed Identity** for auth, **Monitor** everything, design for **failure**. Next steps: AZ-900, AZ-104, AZ-305 certifications.", badges: ["Congratulations!"] },
      ],
      defaultCode: `// Well-Architected Framework Analyzer\ninterface ArchSpec {\n  compute: string[]; data: string[]; networking: string[];\n  security: string[]; monitoring: string[]; cicd: string[]; governance: string[];\n}\n\nclass WellArchitectedAnalyzer {\n  analyze(spec: ArchSpec): void {\n    console.log("=== Azure Well-Architected Review ===\\n");\n    const scores = {\n      Reliability: this.score(spec, ["scale", "backup", "replica", "load-balancer"], [spec.compute, spec.data, spec.networking]),\n      Security: this.score(spec, ["key-vault", "managed-identity", "waf", "nsg", "rbac"], [spec.security, spec.networking]),\n      Cost: this.score(spec, ["tags", "budgets", "auto-scale", "tiered"], [spec.governance, spec.compute, spec.data]),\n      Operations: this.score(spec, ["app-insights", "alerts", "iac", "pipeline"], [spec.monitoring, spec.cicd]),\n      Performance: this.score(spec, ["redis", "cdn", "auto-scale", "cosmos"], [spec.data, spec.networking, spec.compute]),\n    };\n\n    const bar = (s: number) => "[" + "#".repeat(Math.round(s / 5)) + ".".repeat(20 - Math.round(s / 5)) + "]";\n    for (const [pillar, score] of Object.entries(scores))\n      console.log((pillar + ":").padEnd(18) + bar(score) + " " + score + "/100");\n\n    const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);\n    console.log("\\nOverall: " + overall + "/100 " + (overall >= 80 ? "EXCELLENT" : overall >= 60 ? "GOOD" : "NEEDS WORK"));\n  }\n\n  private score(_spec: ArchSpec, keywords: string[], arrays: string[][]): number {\n    const all = arrays.flat();\n    let score = 30;\n    for (const kw of keywords) if (all.some(item => item.includes(kw))) score += 14;\n    return Math.min(100, score);\n  }\n}\n\nnew WellArchitectedAnalyzer().analyze({\n  compute: ["app-service-auto-scale", "azure-functions"],\n  data: ["azure-sql-backup", "redis-cache", "blob-tiered", "cosmos-db"],\n  networking: ["vnet", "nsg", "app-gateway-load-balancer", "cdn"],\n  security: ["key-vault", "managed-identity", "waf", "rbac"],\n  monitoring: ["app-insights", "alerts", "log-analytics"],\n  cicd: ["github-actions-pipeline", "iac"],\n  governance: ["tags", "budgets", "policy"]\n});`,
      validationLogic: (code: string, logs: string[]) => ({
        success: code.includes("WellArchitectedAnalyzer") && code.includes("analyze") && logs.some((l) => l.includes("Well-Architected")) && logs.some((l) => l.includes("Overall")),
        message: "Azure Zero to Hero — COMPLETE! You are a cloud architect now!",
      }),
    },
  ];

  return raw.map((lesson, i) => {
    const id = `azure-${i + 1}`;
    return {
      ...lesson,
      id,
      step: i + 1,
      nextStep: i < raw.length - 1 ? `azure-${i + 2}` : undefined,
      prevStep: i > 0 ? `azure-${i}` : undefined,
      content: lesson.content,
    };
  });
}

export const AZURE_COURSE_LESSONS = buildAzureLessons();

export function getAzureLessonById(slug: string): WebCourseLesson | undefined {
  return AZURE_COURSE_LESSONS.find((l) => l.id === slug);
}
