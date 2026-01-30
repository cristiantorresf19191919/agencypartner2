/**
 * Modern Android Developer (MAD) Playbook
 * Comprehensive guide to Android development with Jetpack Compose and Kotlin
 */

export interface AndroidLesson {
  id: string;
  level: number;
  title: string;
  concept: string;
  description: string;
  code: string;
  explanation: string;
}

export const ANDROID_LESSONS: AndroidLesson[] = [
  {
    id: "level-1-hello-compose",
    level: 1,
    title: "The Atom (Hello Compose)",
    concept: "Composable Functions",
    description: `In modern Android, UI is not a separate XML file. It is a Kotlin function annotated with \`@Composable\`.`,
    code: `// MainActivity.kt
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // This is the entry point. No setContentView(R.layout...)
        setContent {
            Greeting("Android Developer")
        }
    }
}

// A simple UI component
@Composable
fun Greeting(name: String) {
    // Material 3 Text component
    Text(text = "Hello, $name!")
}`,
    explanation: `In Jetpack Compose, UI components are functions annotated with \`@Composable\`. The \`setContent\` function replaces the old \`setContentView(R.layout.activity_main)\` pattern. No XML layouts needed!`,
  },
  {
    id: "level-2-state-interactivity",
    level: 2,
    title: "State & Interactivity",
    concept: "Reactive State Management",
    description: `Reactivity. When \`state\` changes, the UI automatically "recomposes" (redraws). We use \`remember\` to keep state across redraws.`,
    code: `import androidx.compose.runtime.*
import androidx.compose.material3.*

@Composable
fun CounterScreen() {
    // "remember" preserves the value during recomposition
    // "mutableStateOf" makes it observable (triggering UI updates)
    var count by remember { mutableIntStateOf(0) }

    Button(onClick = { count++ }) {
        Text(text = "Clicked $count times")
    }
}`,
    explanation: `\`remember\` preserves state across recompositions (when the function is called again). \`mutableStateOf\` creates an observable state that triggers recomposition when changed. This is Compose's reactive system.`,
  },
  {
    id: "level-3-layouts-modifiers",
    level: 3,
    title: "Layouts & Modifiers",
    concept: "Compose Layout System",
    description: `No more nested XML layouts. We use \`Column\` (vertical), \`Row\` (horizontal), and \`Box\` (z-index stacking). **Modifiers** control styling (padding, size, clicks).`,
    code: `import androidx.compose.foundation.layout.*
import androidx.compose.foundation.background
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun UserCard() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .background(Color.LightGray)
            .padding(8.dp), // Order matters! Inner padding.
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Mock Avatar
        Box(modifier = Modifier.size(50.dp).background(Color.Blue))
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column {
            Text("Cristian Script", style = MaterialTheme.typography.headlineSmall)
            Text("Senior Engineer", style = MaterialTheme.typography.bodyMedium)
        }
    }
}`,
    explanation: `Compose uses \`Column\`, \`Row\`, and \`Box\` instead of LinearLayout, RelativeLayout, etc. Modifiers are applied in order (outer to inner), so \`padding(16.dp)\` then \`background\` then \`padding(8.dp)\` creates a border effect.`,
  },
  {
    id: "level-4-lists",
    level: 4,
    title: "Lists (The new RecyclerView)",
    concept: "LazyColumn for Lists",
    description: `\`LazyColumn\` renders only what is on screen. It replaces the complex RecyclerView + Adapter boilerplate.`,
    code: `import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items

@Composable
fun ChatList(messages: List<String>) {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // DSL for defining list content
        items(messages) { message ->
            Text(text = message, modifier = Modifier.padding(8.dp))
        }
    }
}`,
    explanation: `\`LazyColumn\` is Compose's equivalent to RecyclerView. It only composes visible items, making it efficient for large lists. The \`items\` function provides a DSL for defining list content.`,
  },
  {
    id: "level-5-state-hoisting",
    level: 5,
    title: "State Hoisting (Unidirectional Data Flow)",
    concept: "Unidirectional Data Flow",
    description: `UI components should be dumb. They receive data (\`state\`) and emit events (\`callbacks\`). They shouldn't change state themselves.`,
    code: `// 1. Dumb Component (Stateless)
@Composable
fun SearchBar(
    query: String,            // State comes down
    onQueryChanged: (String) -> Unit // Events go up
) {
    TextField(
        value = query,
        onValueChange = onQueryChanged
    )
}

// 2. Smart Parent (Stateful)
@Composable
fun SearchScreen() {
    var query by remember { mutableStateOf("") }

    // The parent manages the state and passes it down
    SearchBar(
        query = query,
        onQueryChanged = { newText -> query = newText }
    )
}`,
    explanation: `State hoisting means moving state up to the nearest common ancestor. Child components receive state as parameters and emit events via callbacks. This makes components reusable and testable.`,
  },
  {
    id: "level-6-viewmodel-flow",
    level: 6,
    title: "ViewModel & Flow (Architecture)",
    concept: "MVVM with StateFlow",
    description: `Business logic lives in the \`ViewModel\`. The UI observes \`StateFlow\`. This survives configuration changes (rotation).`,
    code: `import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

// 1. The Logic
class UserViewModel : ViewModel() {
    // Private mutable state
    private val _uiState = MutableStateFlow(UserUiState())
    // Public read-only state
    val uiState = _uiState.asStateFlow()

    fun loadData() {
        _uiState.update { it.copy(isLoading = true) }
        // ... async work ...
        _uiState.update { it.copy(isLoading = false, name = "Cristian") }
    }
}

data class UserUiState(val name: String = "", val isLoading: Boolean = false)

// 2. The UI consumption
@Composable
fun UserScreen(viewModel: UserViewModel = androidx.lifecycle.viewmodel.compose.viewModel()) {
    // "collectAsStateWithLifecycle" is the safest way to collect flows in UI
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    if (state.isLoading) {
        CircularProgressIndicator()
    } else {
        Text("Welcome, \${state.name}")
    }
}`,
    explanation: `ViewModel holds business logic and survives configuration changes. \`StateFlow\` is a hot flow that emits the current state to collectors. \`collectAsStateWithLifecycle\` automatically stops collecting when the lifecycle is destroyed, preventing leaks.`,
  },
  {
    id: "level-7-navigation",
    level: 7,
    title: "Modern Navigation",
    concept: "Navigation Compose",
    description: `Single Activity, multiple Composable destinations. Defined via a Navigation Graph.`,
    code: `import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        
        composable("home") {
            HomeScreen(
                onNavigateToProfile = { userId -> 
                    navController.navigate("profile/$userId") 
                }
            )
        }

        // Handling Arguments
        composable("profile/{userId}") { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId")
            ProfileScreen(userId)
        }
    }
}`,
    explanation: `Navigation Compose uses a type-safe, declarative API. Routes are defined as strings with optional parameters. The \`NavHost\` manages the navigation graph and back stack automatically.`,
  },
  {
    id: "level-8-side-effects",
    level: 8,
    title: "Side Effects",
    concept: "LaunchedEffect & Side Effects",
    description: `Running code that isn't UI (timers, analytics, snackbars) inside Composable functions safely.`,
    code: `@Composable
fun AutoSaveScreen(onSave: () -> Unit) {
    // launchedEffect runs ONCE when the component enters the screen
    // or when 'key1' changes.
    LaunchedEffect(Unit) {
        delay(5000) // Wait 5 seconds
        onSave()
    }

    // rememberCoroutineScope allows launching coroutines from callbacks (like onClick)
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    Button(onClick = {
        scope.launch {
            snackbarHostState.showSnackbar("Saved!")
        }
    }) {
        Text("Manual Save")
    }
}`,
    explanation: `\`LaunchedEffect\` runs side effects (like API calls, timers) when a Composable enters composition or when keys change. \`rememberCoroutineScope\` provides a coroutine scope tied to the composition lifecycle for launching coroutines from callbacks.`,
  },
  {
    id: "level-9-network-stack",
    level: 9,
    title: "The Full Network Stack (Retrofit + Repository)",
    concept: "Clean Architecture Data Layer",
    description: `The "Clean Architecture" way to fetch data.`,
    code: `// The Interface (API)
import retrofit2.http.GET

interface UserService {
    @GET("users/me")
    suspend fun getUser(): UserDto // Suspend function for Coroutines
}

// The Repository (Data Source)
import javax.inject.Inject

class UserRepository @Inject constructor(
    private val api: UserService
) {
    // Expose a Flow, or a suspend function
    fun getUserStream(): Flow<User> = flow {
        emit(api.getUser().toDomain())
    }
}

// The Consumption (ViewModel)
@HiltViewModel
class MainViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {
    
    val userState = repository.getUserStream()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = User.Empty
        )
}`,
    explanation: `Clean Architecture separates concerns: API (Retrofit interface), Repository (data source abstraction), and ViewModel (business logic). Retrofit uses suspend functions for coroutines. \`stateIn\` converts a Flow to a StateFlow, sharing the subscription across collectors.`,
  },
  {
    id: "level-10-dependency-injection",
    level: 10,
    title: "Dependency Injection (Hilt)",
    concept: "Hilt for DI",
    description: `Automating how classes get their dependencies.`,
    code: `@Module
@InstallIn(SingletonComponent::class) // Available throughout the app
object NetworkModule {

    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .build()
    }

    @Provides
    fun provideUserService(retrofit: Retrofit): UserService {
        return retrofit.create(UserService::class.java)
    }
}

// Application setup
@HiltAndroidApp
class MyApp : Application()

// Activity Setup
@AndroidEntryPoint
class MainActivity : ComponentActivity() { ... }`,
    explanation: `Hilt (built on Dagger) automates dependency injection. \`@Module\` defines how to create dependencies. \`@InstallIn\` specifies the component scope. \`@HiltAndroidApp\` initializes Hilt in the Application class. \`@AndroidEntryPoint\` enables field injection in Activities/Fragments.`,
  },
];

export function getAndroidLessonById(id: string): AndroidLesson | undefined {
  return ANDROID_LESSONS.find((lesson) => lesson.id === id);
}

export function getAndroidLessonByLevel(level: number): AndroidLesson | undefined {
  return ANDROID_LESSONS.find((lesson) => lesson.level === level);
}
