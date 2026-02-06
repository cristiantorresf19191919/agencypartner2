/**
 * Coroutines and channels – documentation structure for the Kotlin tutorial page.
 * Used when rendering /developer-section/kotlin-course/coroutines-and-channels.
 */

import type { DocTocItem, DocBlock } from "./coroutinesBasicsDoc";

export const COROUTINES_CHANNELS_TOC: DocTocItem[] = [
  { id: "before-you-start", label: "Before you start" },
  { id: "run-the-code", label: "Run the code" },
  { id: "blocking-requests", label: "Blocking requests" },
  { id: "task-1", label: "Task 1" },
  { id: "solution-task-1", label: "Solution for task 1" },
  { id: "callbacks", label: "Callbacks" },
  {
    id: "background-thread",
    label: "Use a background thread",
  },
  { id: "task-2", label: "Task 2" },
  { id: "solution-task-2", label: "Solution for task 2" },
  { id: "retrofit-callback-api", label: "Use the Retrofit callback API" },
  { id: "suspending-functions", label: "Suspending functions" },
  { id: "coroutines", label: "Coroutines" },
  { id: "concurrency", label: "Concurrency" },
  { id: "structured-concurrency", label: "Structured concurrency" },
  { id: "showing-progress", label: "Showing progress" },
  { id: "channels", label: "Channels" },
  { id: "task-7", label: "Task 7" },
];

const CODE = {
  githubServiceRetrofit: `interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    fun getOrgReposCall(@Path("org") org: String): Call<List<Repo>>

    @GET("repos/{owner}/{repo}/contributors?per_page=100")
    fun getRepoContributorsCall(
        @Path("owner") owner: String,
        @Path("repo") repo: String
    ): Call<List<User>>
}`,
  loadContributorsBlocking: `fun loadContributorsBlocking(
    service: GitHubService,
    req: RequestData
): List<User> {
    val repos = service
        .getOrgReposCall(req.org) // #1
        .execute()               // #2
        .also { logRepos(req, it) } // #3
        .body() ?: emptyList()   // #4

    return repos.flatMap { repo ->
        service
            .getRepoContributorsCall(req.org, repo.name) // #1
            .execute()                                  // #2
            .also { logUsers(repo, it) }                // #3
            .bodyList()                                 // #4
    }.aggregate()
}`,
  bodyList: `fun <T> Response<List<T>>.bodyList(): List<T> {
    return body() ?: emptyList()
}`,
  logOutput: `1770 [AWT-EventQueue-0] INFO Contributors - kotlin: loaded 40 repos
2025 [AWT-EventQueue-0] INFO Contributors - kotlin-examples: loaded 23
2229 [AWT-EventQueue-0] INFO Contributors - kotlin-koans: loaded 45 con
...`,
  whenBlocking: `when (getSelectedVariant()) {
    BLOCKING -> { // Blocking UI thread
        val users = loadContributorsBlocking(service, req)
        updateResults(users, startTime)
    }
}`,
  aggregateSolution: `fun List<User>.aggregate(): List<User> =
    groupBy { it.login }
        .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
        .sortedByDescending { it.contributions }`,
  threadLoadBlocking: `thread {
    loadContributorsBlocking(service, req)
}`,
  loadContributorsBackgroundSignature: `fun loadContributorsBackground(
    service: GitHubService, req: RequestData,
    updateResults: (List<User>) -> Unit
)`,
  loadContributorsBackgroundCall: `loadContributorsBackground(service, req) { users ->
    SwingUtilities.invokeLater {
        updateResults(users, startTime)
    }
}`,
  solutionTask2: `thread {
    updateResults(loadContributorsBlocking(service, req))
}`,
  loadContributorsCallbacks: `fun loadContributorsCallbacks(
    service: GitHubService,
    req: RequestData,
    updateResults: (List<User>) -> Unit
) {
    service.getOrgReposCall(req.org).onResponse { responseRepos -> // #1
        logRepos(req, responseRepos)
        val repos = responseRepos.bodyList()
        val allUsers = mutableListOf<User>()
        for (repo in repos) {
            service.getRepoContributorsCall(req.org, repo.name)
                .onResponse { responseUsers -> // #2
                    logUsers(repo, responseUsers)
                    val users = responseUsers.bodyList()
                    allUsers += users
                }
        }
        // TODO: Why doesn't this code work? How to fix that?
        updateResults(allUsers.aggregate())
    }
}`,
  githubServiceSuspend: `interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): List<Repo>

    @GET("repos/{owner}/{repo}/contributors?per_page=100")
    suspend fun getRepoContributors(
        @Path("owner") owner: String,
        @Path("repo") repo: String
    ): List<User>
}`,
};

export const COROUTINES_CHANNELS_BLOCKS: DocBlock[] = [
  { type: "heading", level: 1, id: "coroutines-and-channels", text: "Coroutines and channels - tutorial" },
  {
    type: "paragraph",
    text: "In this tutorial, you'll learn how to use coroutines in IntelliJ IDEA to perform network requests without blocking the underlying thread or callbacks.",
  },
  {
    type: "infoBox",
    variant: "gray",
    content: "No prior knowledge of coroutines is required, but you're expected to be familiar with basic Kotlin syntax.",
  },
  {
    type: "paragraph",
    text: "You'll learn:",
  },
  {
    type: "list",
    items: [
      "Why and how to use suspending functions to perform network requests.",
      "How to send requests concurrently using coroutines.",
      "How to share information between different coroutines using channels.",
    ],
  },
  {
    type: "paragraph",
    text: "For network requests, you'll need the Retrofit library, but the approach shown in this tutorial works similarly for any other libraries that support coroutines.",
  },
  {
    type: "infoBox",
    variant: "gray",
    content: "You can find solutions for all of the tasks on the solutions branch of the project's repository.",
  },
  { type: "heading", level: 3, id: "before-you-start", text: "Before you start" },
  {
    type: "paragraph",
    text: "Download and install the latest IntelliJ IDEA, then clone the project template (intro-coroutines). Generate a GitHub token to use the GitHub API: specify a name (e.g. coroutines-tutorial), do not select any scopes, click Generate token, and copy it.",
  },
  { type: "image", src: "/images/portfolio/channels/github-token-settings.png", alt: "Generate a new GitHub token" },
  { type: "heading", level: 2, id: "run-the-code", text: "Run the code" },
  {
    type: "paragraph",
    text: "The program loads the contributors for all of the repositories under the given organization (named \"kotlin\" by default). Later you'll add logic to sort the users by the number of their contributions.",
  },
  {
    type: "stepTitle",
    number: 1,
    text: "Open the src/contributors/main.kt file and run the main() function. You'll see the following window:",
  },
  { type: "image", src: "/images/portfolio/channels/initial-window.png", alt: "GitHub Contributors window" },
  {
    type: "paragraph",
    text: "If the font is too small, adjust it by changing the value of setDefaultFontSize(18f) in the main() function.",
  },
  {
    type: "stepTitle",
    number: 2,
    text: "Provide your GitHub username and token (or password) in the corresponding fields.",
  },
  {
    type: "stepTitle",
    number: 3,
    text: "Make sure that the BLOCKING option is selected in the Variant dropdown menu.",
  },
  {
    type: "stepTitle",
    number: 4,
    text: "Click Load contributors. The UI should freeze for some time and then show the list of contributors.",
  },
  {
    type: "stepTitle",
    number: 5,
    text: "Open the program output to ensure the data has been loaded. The list of contributors is logged after each successful request.",
  },
  { type: "heading", level: 2, id: "blocking-requests", text: "Blocking requests" },
  {
    type: "paragraph",
    text: "There are different ways of implementing this logic: by using blocking requests or callbacks. You'll compare these solutions with one that uses coroutines and see how channels can be used to share information between different coroutines.",
  },
  {
    type: "paragraph",
    text: "You will use the Retrofit library to perform HTTP requests to GitHub. It allows requesting the list of repositories under the given organization and the list of contributors for each repository:",
  },
  { type: "code", code: CODE.githubServiceRetrofit, showPlay: false },
  {
    type: "paragraph",
    text: "This API is used by the loadContributorsBlocking() function to fetch the list of contributors for the given organization.",
  },
  {
    type: "stepTitle",
    number: 1,
    text: "Open src/tasks/Request1Blocking.kt to see its implementation:",
  },
  { type: "code", code: CODE.loadContributorsBlocking, showPlay: false },
  {
    type: "list",
    items: [
      "At first, you get a list of the repositories under the given organization and store it in the repos list. Then for each repository, the list of contributors is requested, and all of the lists are merged into one final list of contributors.",
      "getOrgReposCall() and getRepoContributorsCall() both return an instance of the *Call class (#1). At this point, no request is sent.",
      "*Call.execute() is then invoked to perform the request (#2). execute() is a synchronous call that blocks the underlying thread.",
      "The response is logged using logRepos() and logUsers() functions (#3). HTTP response errors are also logged.",
      "You get the response's body for the data, using an empty list as a result in case of an error, and log the corresponding error (#4).",
    ],
  },
  {
    type: "stepTitle",
    number: 2,
    text: "To avoid repeating .body() ?: emptyList(), an extension function bodyList() is declared:",
  },
  { type: "code", code: CODE.bodyList, showPlay: false },
  {
    type: "stepTitle",
    number: 3,
    text: "Run the program again and take a look at the system output in IntelliJ IDEA. It should have something like this:",
  },
  { type: "code", code: CODE.logOutput, showPlay: false, comment: "System output" },
  {
    type: "list",
    items: [
      "The first item on each line is the number of milliseconds that have passed since the program started, then the thread name in square brackets. You can see from which thread the loading request is called.",
      "The final item on each line is the actual message: how many repositories or contributors were loaded.",
    ],
  },
  {
    type: "paragraph",
    text: "This log output demonstrates that all of the results were logged from the main thread. When you run the code with a BLOCKING option, the window freezes and doesn't react to input until the loading is finished. All of the requests are executed from the same thread as the one called loadContributorsBlocking() is from, which is the main UI thread (in Swing, it's an AWT event dispatching thread). This main thread becomes blocked, and that's why the UI is frozen:",
  },
  { type: "image", src: "/images/portfolio/channels/blocking.png", alt: "Blocking UI flow: load, repos, contribs, update results on the main thread" },
  {
    type: "paragraph",
    text: "After the list of contributors has loaded, the result is updated.",
  },
  {
    type: "stepTitle",
    number: 4,
    text: "In src/contributors/Contributors.kt, find the loadContributors() function responsible for choosing how the contributors are loaded and look at how loadContributorsBlocking() is called:",
  },
  { type: "code", code: CODE.whenBlocking, showPlay: false },
  {
    type: "list",
    items: [
      "The updateResults() call goes right after the loadContributorsBlocking() call.",
      "updateResults() updates the UI, so it must always be called from the UI thread.",
      "Since loadContributorsBlocking() is also called from the UI thread, the UI thread becomes blocked and the UI is frozen.",
    ],
  },
  { type: "heading", level: 2, id: "task-1", text: "Task 1" },
  {
    type: "paragraph",
    text: "The first task helps you familiarize yourself with the task domain. Currently, each contributor's name is repeated several times, once for every project they have taken part in. Implement the aggregate() function combining the users so that each contributor is added only once. The User.contributions property should contain the total number of contributions of the given user to all the projects. The resulting list should be sorted in descending order according to the number of contributions.",
  },
  {
    type: "stepTitle",
    number: 1,
    text: "Open src/tasks/Aggregation.kt and implement the List<User>.aggregate() function. Users should be sorted by the total number of their contributions.",
  },
  {
    type: "paragraph",
    text: "The corresponding test file test/tasks/AggregationKtTest.kt shows an example of the expected result.",
  },
  {
    type: "infoBox",
    variant: "gray",
    content: "You can jump between the source code and the test class automatically by using the IntelliJ IDEA shortcut Ctrl+Shift+T / ⇧ ⌘ T.",
  },
  {
    type: "paragraph",
    text: "After implementing this task, the resulting list for the \"kotlin\" organization should be similar to the following:",
  },
  { type: "image", src: "/images/portfolio/channels/aggregate.png", alt: "The list for the kotlin organization" },
  {
    type: "solution",
    taskNumber: 1,
    id: "solution-task-1",
    steps: [
      "To group users by login, use groupBy(), which returns a map from a login to all occurrences of the user with this login in different repositories.",
      "For each map entry, count the total number of contributions for each user and create a new instance of the User class by the given name and total of contributions.",
      "Sort the resulting list in descending order:",
    ],
    code: CODE.aggregateSolution,
    paragraphAfterCode: "An alternative solution is to use the groupingBy() function instead of groupBy().",
  },
  { type: "heading", level: 2, id: "callbacks", text: "Callbacks" },
  {
    type: "paragraph",
    text: "The previous solution works, but it blocks the thread and therefore freezes the UI. A traditional approach that avoids this is to use callbacks.",
  },
  {
    type: "paragraph",
    text: "Instead of calling the code that should be invoked right after the operation is completed, you can extract it into a separate callback, often a lambda, and pass that lambda to the caller in order for it to be called later.",
  },
  {
    type: "paragraph",
    text: "To make the UI responsive, you can either move the whole computation to a separate thread or switch to the Retrofit API which uses callbacks instead of blocking calls.",
  },
  { type: "heading", level: 3, id: "background-thread", text: "Use a background thread" },
  {
    type: "stepTitle",
    number: 1,
    text: "Open src/tasks/Request2Background.kt and see its implementation. First, the whole computation is moved to a different thread. The thread() function starts a new thread:",
  },
  { type: "code", code: CODE.threadLoadBlocking, showPlay: false },
  {
    type: "paragraph",
    text: "Now that all of the loading has been moved to a separate thread, the main thread is free and can be occupied by other tasks:",
  },
  { type: "image", src: "/images/portfolio/channels/freed-main-thread.png", alt: "Freed main thread diagram" },
  {
    type: "stepTitle",
    number: 2,
    text: "The signature of the loadContributorsBackground() function changes. It takes an updateResults() callback as the last argument to call it after all the loading completes:",
  },
  { type: "code", code: CODE.loadContributorsBackgroundSignature, showPlay: false },
  {
    type: "stepTitle",
    number: 3,
    text: "Now when the loadContributorsBackground() is called, the updateResults() call goes in the callback, not immediately afterward as it did before:",
  },
  { type: "code", code: CODE.loadContributorsBackgroundCall, showPlay: false },
  {
    type: "paragraph",
    text: "By calling SwingUtilities.invokeLater, you ensure that the updateResults() call, which updates the results, happens on the main UI thread (AWT event dispatching thread).",
  },
  {
    type: "paragraph",
    text: "However, if you try to load the contributors via the BACKGROUND option, you can see that the list is updated but nothing changes.",
  },
  { type: "heading", level: 2, id: "task-2", text: "Task 2" },
  {
    type: "paragraph",
    text: "Fix the loadContributorsBackground() function in src/tasks/Request2Background.kt so that the resulting list is shown in the UI.",
  },
  {
    type: "solution",
    taskNumber: 2,
    id: "solution-task-2",
    paragraphs: [
      "If you try to load the contributors, you can see in the log that the contributors are loaded but the result isn't displayed. To fix this, call updateResults() on the resulting list of users:",
    ],
    code: CODE.solutionTask2,
    paragraphAfterCode: "Make sure to call the logic passed in the callback explicitly. Otherwise, nothing will happen.",
  },
  { type: "heading", level: 2, id: "retrofit-callback-api", text: "Use the Retrofit callback API" },
  {
    type: "paragraph",
    text: "In the previous solution, the whole loading logic is moved to the background thread, but that still isn't the best use of resources. All of the loading requests go sequentially and the thread is blocked while waiting for the loading result, while it could have been occupied by other tasks. Specifically, the thread could start loading another request to receive the entire result earlier.",
  },
  {
    type: "paragraph",
    text: "Divide the data handling into loading and processing parts. The second processing part should be extracted into a callback.",
  },
  {
    type: "paragraph",
    text: "The loading for each repository can then be started before the result for the previous repository is received (and the corresponding callback is called):",
  },
  { type: "image", src: "/images/portfolio/channels/callback-api-diagram.png", alt: "Retrofit callback API timeline" },
  {
    type: "paragraph",
    text: "The Retrofit callback API can help achieve this. The Call.enqueue() function starts an HTTP request and takes a callback as an argument. In this callback, you need to specify what needs to be done after each request.",
  },
  {
    type: "stepTitle",
    number: 1,
    text: "Open src/tasks/Request3Callbacks.kt and see the implementation of loadContributorsCallbacks() that uses this API:",
  },
  { type: "code", code: CODE.loadContributorsCallbacks, showPlay: false },
  {
    type: "paragraph",
    text: "After reviewing these three attempts at a solution, you can see that writing correct code with callbacks is non-trivial and error-prone, especially when several underlying threads and synchronization occur.",
  },
  {
    type: "infoBox",
    variant: "gray",
    content: "As an additional exercise, you can implement the same logic using a reactive approach with the RxJava library. All of the necessary dependencies and solutions for using RxJava can be found in a separate rx branch. It is also possible to complete this tutorial and implement or check the proposed Rx versions for a proper comparison.",
  },
  { type: "heading", level: 2, id: "suspending-functions", text: "Suspending functions" },
  {
    type: "paragraph",
    text: "You can implement the same logic using suspending functions. Instead of returning Call<List<Repo>>, define the API call as a suspending function as follows:",
  },
  { type: "code", code: CODE.githubServiceSuspend, showPlay: false },
  {
    type: "list",
    items: [
      "getOrgRepos() is defined as a suspend function. When you use a suspending function to perform a request, the underlying thread isn't blocked. More details about how this works will come in later sections.",
      "getOrgRepos() returns the result directly instead of returning a Call. If the result is unsuccessful, an exception is thrown.",
    ],
  },
  { type: "heading", level: 2, id: "coroutines", text: "Coroutines" },
  {
    type: "paragraph",
    text: "When the computation is ready to be continued, it is returned to a thread (not necessarily the same one). Each \"contributors\" request now waits for the result using the suspension mechanism. First, the new request is sent. Then, while waiting for the response, the whole \"load contributors\" coroutine that was started by the launch function is suspended. The coroutine resumes only after the corresponding response is received.",
  },
  { type: "image", src: "/images/portfolio/channels/thread-coroutine-diagram.gif", alt: "Thread and coroutine" },
  { type: "image", src: "/images/portfolio/channels/suspending-request.png", alt: "Suspending request diagram" },
  {
    type: "paragraph",
    text: "While the response is waiting to be received, the thread is free to be occupied by other tasks. The UI stays responsive, despite all the requests taking place on the main UI thread.",
  },
  {
    type: "stepTitle",
    number: 1,
    text: "Run the program using the SUSPEND option. The log confirms that all of the requests are sent to the main UI thread:",
  },
  {
    type: "paragraph",
    text: "AWT-EventQueue-0 @coroutine#1 in the log indicates that the loading is performed on the main UI thread by a coroutine.",
  },
  { type: "heading", level: 2, id: "concurrency", text: "Concurrency" },
  {
    type: "paragraph",
    text: "So far, all the requests are sent sequentially. To make the loading concurrent, use async to start each contributors request. async returns a Deferred; use .await() to get the result. Wrap each contributors request in async, then deferreds.awaitAll().flatten().aggregate(). Specify async(Dispatchers.Default) { } to run on a shared thread pool.",
  },
  { type: "image", src: "/images/portfolio/channels/channels-single-many-coroutines.png", alt: "Concurrent coroutines" },
  { type: "heading", level: 2, id: "structured-concurrency", text: "Structured concurrency" },
  {
    type: "paragraph",
    text: "CoroutineScope defines structure; new coroutines are started inside a scope. launch, async, and runBlocking create a scope; the lambda receiver is CoroutineScope. Nested coroutines are children of the outer one. With structured concurrency, canceling the parent cancels all children; the scope waits for all children. Use coroutineScope { } inside a suspend function to start structured child coroutines. Avoid GlobalScope; use the caller's scope so cancellation and context (e.g. Dispatchers.Default) are inherited.",
  },
  { type: "heading", level: 2, id: "showing-progress", text: "Showing progress" },
  {
    type: "paragraph",
    text: "To show intermediate results as each repo is loaded, pass a callback updateResults(users, completed). Implement loadContributorsProgress() by iterating repos sequentially, loading contributors for each, aggregating into allUsers, and calling updateResults(allUsers, index == repos.lastIndex). To add concurrency and still show progress, use channels.",
  },
  { type: "image", src: "/images/portfolio/channels/progress.png", alt: "Progress on requests" },
  { type: "image", src: "/images/portfolio/channels/progress-and-concurrency.png", alt: "Concurrent requests with progress" },
  { type: "heading", level: 2, id: "channels", text: "Channels" },
  {
    type: "paragraph",
    text: "Coroutines can share information by communication: one sends to a channel, another receives. A producer sends; a consumer receives. Multiple producers/consumers can use the same channel; each element is received by one consumer. Channel can suspend send() and receive() when full or empty. Types: unlimited (queue-like); buffered (fixed size); rendezvous (buffer 0); conflated (latest only).",
  },
  { type: "image", src: "/images/portfolio/channels/using-channel.png", alt: "Using channels" },
  { type: "image", src: "/images/portfolio/channels/using-channel-many-coroutines.png", alt: "Using channels with many coroutines" },
  { type: "image", src: "/images/portfolio/channels/unlimited-channel.png", alt: "Unlimited channel" },
  { type: "image", src: "/images/portfolio/channels/buffered-channel.png", alt: "Buffered channel" },
  { type: "image", src: "/images/portfolio/channels/rendezvous-channel.png", alt: "Rendezvous channel" },
  { type: "heading", level: 2, id: "task-7", text: "Task 7" },
  {
    type: "paragraph",
    text: "Implement loadContributorsChannels(): create a Channel<List<User>>(), for each repo launch a coroutine that loads contributors and sends the result to the channel, then receive from the channel repos.size times, aggregating and calling updateResults. Results appear as soon as each repo is ready.",
  },
];
