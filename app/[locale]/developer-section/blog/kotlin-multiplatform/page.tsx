"use client";

import { Stack, Heading, Text, ButtonLink, Card, CodeEditor } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/lib/useLocale";
import BlogContentLayout from "@/components/Layout/BlogContentLayout";
import styles from "../BlogPostPage.module.css";

const unidirectionalCode = [
  "// shared/commonMain/kotlin/ui/SearchScreenModel.kt",
  "",
  "data class UiState(",
  '    val query: String = "",',
  "    val results: List<Item> = emptyList(),",
  "    val isLoading: Boolean = false,",
  "    val error: String? = null",
  ")",
  "",
  "sealed interface Event {",
  "    data class QueryChanged(val value: String) : Event",
  "    data object Search : Event",
  "}",
  "",
  "class SearchViewModel(",
  "    private val repo: Repository",
  ") : ViewModel() {",
  "",
  "    private val _state = MutableStateFlow(UiState())",
  "    val state = _state.asStateFlow()",
  "",
  "    fun on(event: Event) {",
  "        when (event) {",
  "            is Event.QueryChanged -> _state.update { it.copy(query = event.value) }",
  "            Event.Search -> performSearch()",
  "        }",
  "    }",
  "",
  "    private fun performSearch() = viewModelScope.launch {",
  "        _state.update { it.copy(isLoading = true, error = null) }",
  "        try {",
  "            val results = repo.search(_state.value.query)",
  "            _state.update { it.copy(results = results, isLoading = false) }",
  "        } catch (e: Exception) {",
  "            _state.update { it.copy(error = e.message, isLoading = false) }",
  "        }",
  "    }",
  "}",
].join("\n");

const platformAdapterCode = [
  "// commonMain",
  "@Composable",
  "expect fun NativeWebView(",
  "    url: String,",
  "    modifier: Modifier = Modifier",
  ")",
  "",
  "// androidMain",
  "@Composable",
  "actual fun NativeWebView(url: String, modifier: Modifier) {",
  "    AndroidView(",
  "        modifier = modifier,",
  "        factory = { context ->",
  "            WebView(context).apply { settings.javaScriptEnabled = true }",
  "        },",
  "        update = { it.loadUrl(url) }",
  "    )",
  "}",
  "",
  "// iosMain",
  "@Composable",
  "actual fun NativeWebView(url: String, modifier: Modifier) {",
  "    val request = remember(url) { NSURLRequest(NSURL(string = url)) }",
  "",
  "    UIKitView(",
  "        modifier = modifier,",
  "        factory = {",
  "            WKWebView(frame = .zero).apply { loadRequest(request) }",
  "        }",
  "    )",
  "}",
].join("\n");

const adaptiveLayoutsCode = [
  "@Composable",
  "fun AdaptiveFeed(",
  "    posts: List<Post>,",
  "    windowSizeClass: WindowSizeClass",
  ") {",
  "    if (windowSizeClass.widthSizeClass == WindowWidthSizeClass.Expanded) {",
  "        Row(Modifier.fillMaxSize()) {",
  "            Sidebar(Modifier.weight(1f))",
  "            PostGrid(posts, Modifier.weight(3f))",
  "        }",
  "    } else {",
  "        PostList(posts, Modifier.fillMaxSize())",
  "    }",
  "}",
].join("\n");

const navigationCode = [
  "@Serializable object Home",
  "@Serializable data class Details(val id: String)",
  "",
  "@Composable",
  "fun AppNavigation() {",
  "    val navController = rememberNavController()",
  "",
  "    NavHost(navController, startDestination = Home) {",
  "        composable<Home> {",
  "            HomeScreen(onProductClick = { id -> navController.navigate(Details(id)) })",
  "        }",
  "",
  "        composable<Details> { backStackEntry ->",
  "            val args = backStackEntry.toRoute<Details>()",
  "            DetailsScreen(id = args.id)",
  "        }",
  "    }",
  "}",
].join("\n");

const designSystemCode = [
  "object AppTheme {",
  "    val colors = lightColorScheme(...)",
  "    val typography: Typography",
  "        @Composable get() = getPlatformTypography()",
  "}",
  "",
  "@Composable",
  "expect fun getPlatformTypography(): Typography",
  "",
  "// androidMain",
  "@Composable",
  "actual fun getPlatformTypography(): Typography {",
  '    val roboto = GoogleFont("Roboto")',
  "    return Typography(/* Android families using roboto */)",
  "}",
  "",
  "// iosMain",
  "@Composable",
  "actual fun getPlatformTypography(): Typography {",
  "    val sfPro = FontFamily.Default",
  "    return Typography(/* Uses San Francisco under the hood */)",
  "}",
].join("\n");

const composeResourcesCode = [
  "import your_app.generated.resources.Res",
  "import your_app.generated.resources.ic_cart",
  "import your_app.generated.resources.welcome_message",
  "",
  "@Composable",
  "fun WelcomeHeader() {",
  "    Column {",
  "        Image(",
  "            painter = painterResource(Res.drawable.ic_cart),",
  "            contentDescription = null",
  "        )",
  "        Text(stringResource(Res.string.welcome_message))",
  "    }",
  "}",
].join("\n");

const nativeInteractionsCode = [
  "@Composable",
  "fun DetailScreen(onBack: () -> Unit) {",
  "    BackHandler { onBack() }",
  "",
  "    Scaffold(",
  "        topBar = {",
  "            TopAppBar(",
  '                title = { Text("Details") },',
  "                navigationIcon = {",
  "                    IconButton(onClick = onBack) {",
  '                        Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back")',
  "                    }",
  "                }",
  "            )",
  "        }",
  "    ) {",
  "        /* content */",
  "    }",
  "}",
].join("\n");

export default function KotlinMultiplatformUIPage() {
  const { t } = useLanguage();
  const { createLocalizedPath } = useLocale();

  return (
    <BlogContentLayout>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li>
            <ButtonLink
              href={createLocalizedPath("/")}
              variant="secondary"
              className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              {t("blog-breadcrumb-home")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink
              href={createLocalizedPath("/developer-section")}
              variant="secondary"
              className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              {t("developer-section-title")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li>
            <ButtonLink
              href={createLocalizedPath("/developer-section/blog")}
              variant="secondary"
              className="text-xs px-2 py-1 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            >
              {t("nav-blog")}
            </ButtonLink>
          </li>
          <li className={styles.breadcrumbSeparator}>/</li>
          <li className={styles.breadcrumbCurrent}>Kotlin Multiplatform UI</li>
        </ol>
      </nav>

      <div className={styles.headerSection}>
        <Heading className={styles.title}>
          Kotlin Multiplatform: 7 Patterns for Truly Shared UIs
        </Heading>
        <Text className={styles.subtitle}>
          Practical Compose Multiplatform techniques to ship one UI codebase across Android, iOS, and
          Desktop—without papering over platform polish.
        </Text>
        <div className={`${styles.infoBox} ${styles.infoBoxPurple}`}>
          <Text className={styles.infoText}>
            Shared UI means shared behavior, state, and components with small, explicit platform seams
            so every surface still feels native.
          </Text>
        </div>
        <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
          <Text className={styles.infoText}>
            Cross-platform UI usually fails by a thousand “just this one platform thing” cuts. These
            patterns keep one mental model while embracing platform polish.
          </Text>
        </div>
      </div>

      <section id="unidirectional-state" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                1) Unidirectional State, Everywhere
              </Heading>
              <Text className={styles.sectionDescription}>
                Keep an immutable UiState, stream updates, and route all user intent through explicit
                Events. It reads the same on Android and iOS and keeps the UI a pure function of state.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxGreen}`}>
              <Text className={styles.infoText}>
                Predictable state kills “it works on Android” drift and makes previews or harnesses
                trivial.
              </Text>
            </div>
            <CodeEditor code={unidirectionalCode} language="kotlin" readOnly height={360} />
          </Stack>
        </Card>
      </section>

      <section id="platform-adapter" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                2) The Platform Adapter (expect/actual UI)
              </Heading>
              <Text className={styles.sectionDescription}>
                When Compose alone is not enough—maps, webviews, camera feeds—keep your main layout
                pure Kotlin and wrap the messy bridge behind expect/actual.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                You keep one layout file and isolate native interop in tiny, well-defined seams.
              </Text>
            </div>
            <CodeEditor code={platformAdapterCode} language="kotlin" readOnly height={320} />
          </Stack>
        </Card>
      </section>

      <section id="adaptive-layouts" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                3) Adaptive Layouts (not platform checks)
              </Heading>
              <Text className={styles.sectionDescription}>
                Don’t branch on platform; branch on capability. Window size classes make iPad feel
                closer to Desktop than to iPhone, and foldables just work.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
              <Text className={styles.infoText}>
                Layout by size keeps you resilient to new device categories without new code paths.
              </Text>
            </div>
            <CodeEditor code={adaptiveLayoutsCode} language="kotlin" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      <section id="shared-navigation" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                4) Type-safe Shared Navigation
              </Heading>
              <Text className={styles.sectionDescription}>
                Navigation is business logic. Define routes once in commonMain—Voyager or Jetpack
                Navigation for KMP keep Android and iOS in lockstep.
              </Text>
            </div>
            <CodeEditor code={navigationCode} language="kotlin" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      <section id="design-system" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                5) The Design System Bridge
              </Heading>
              <Text className={styles.sectionDescription}>
                Share tokens like colors and spacing, but let typography stay platform-aware. iOS wants
                San Francisco; Android expects Roboto/Product Sans.
              </Text>
            </div>
            <div className={`${styles.infoBox} ${styles.infoBoxBlue}`}>
              <Text className={styles.infoText}>
                Fonts are the biggest tell. Bridge them intentionally so the app feels native instead
                of “almost right.”
              </Text>
            </div>
            <CodeEditor code={designSystemCode} language="kotlin" readOnly height={260} />
          </Stack>
        </Card>
      </section>

      <section id="compose-resources" className={styles.section}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                6) Resources as Code (Compose Resources)
              </Heading>
              <Text className={styles.sectionDescription}>
                Strings, images, and files become type-safe accessors generated at build time. Drop an
                asset into commonMain/composeResources and it works everywhere.
              </Text>
            </div>
            <CodeEditor code={composeResourcesCode} language="kotlin" readOnly height={240} />
          </Stack>
        </Card>
      </section>

      <section id="native-interactions" className={`${styles.section} mb-8`}>
        <Card className={styles.sectionCard}>
          <Stack direction="col" gap="md">
            <div>
              <Heading level={2} className={styles.sectionTitle}>
                7) Native Interactions (Back Handler & Gestures)
              </Heading>
              <Text className={styles.sectionDescription}>
                Respect Android predictive back and iOS swipe-to-go-back. Shared UI still needs to
                honor each system’s muscle memory.
              </Text>
            </div>
            <CodeEditor code={nativeInteractionsCode} language="kotlin" readOnly height={240} />
          </Stack>
        </Card>
      </section>

      <div className={`${styles.infoBox} ${styles.infoBoxGreen} mb-12`}>
        <Text className={styles.infoText}>
          The 100/90/10 rule: 100% shared logic, ~90% shared UI, ~10% platform-specific. Embrace the
          seams instead of hiding them and you keep platform dignity while shipping once.
        </Text>
      </div>

      <div className={styles.navigation}>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog")}>
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="flex flex-col items-start">
              <span className="text-xs opacity-70 font-normal">{t("nav-blog")}</span>
              <span className="font-semibold">{t("blog-back-blog")}</span>
            </span>
          </span>
        </ButtonLink>
        <ButtonLink variant="nav" href={createLocalizedPath("/developer-section/blog/react-patterns")}>
          <span className="flex items-center gap-2">
            <span className="flex flex-col items-end">
              <span className="text-xs opacity-70 font-normal">{t("blog-next")}</span>
              <span className="font-semibold">{t("blog-react-patterns")}</span>
            </span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </ButtonLink>
      </div>
    </BlogContentLayout>
  );
}
