/**
 * Kotlin Course - Official Kotlin tour content with practice challenges.
 * Lessons include Hello world, Basic types, and Collections.
 */

export interface KotlinPracticeChallenge {
  id: string;
  title: string;
  description: string;
  hint?: string;
  starterCode: string;
  testCases: { input: string; output: string }[];
  solution?: string;
}

export type KotlinLessonContentItem =
  | string
  | { type: "image"; src: string; alt: string };

export interface KotlinLesson {
  id: string;
  step: number;
  title: string;
  nextStep?: string;
  prevStep?: string;
  content: KotlinLessonContentItem[];
  codeExamples: { code: string; comment?: string }[];
  practice?: KotlinPracticeChallenge[];
  defaultCode: string;
}

export const KOTLIN_COURSE_LESSONS: KotlinLesson[] = [
  {
    id: "hello-world",
    step: 1,
    title: "Hello world",
    nextStep: "basic-types",
    content: [
      "Here is a simple program that prints \"Hello, world!\":",
      "In Kotlin: fun is used to declare a function. The main() function is where your program starts from. The body of a function is written within curly braces {}. println() and print() functions print their arguments to standard output.",
      "A function is a set of instructions that performs a specific task. Once you create a function, you can use it whenever you need to perform that task, without having to write the instructions all over again.",
      "Variables — All programs need to be able to store data. In Kotlin, you can declare read-only variables with val and mutable variables with var. You can't change a read-only variable once you have given it a value. Use the assignment operator = to assign a value.",
      "We recommend declaring all variables as read-only (val) by default. Only use mutable variables (var) if you really need to.",
      "String templates — Use template expressions to access data stored in variables. A string value is a sequence of characters in double quotes \". Template expressions always start with a dollar sign $. To evaluate a piece of code in a template expression, place the code within curly braces {} after the dollar sign $.",
    ],
    codeExamples: [
      {
        code: `fun main() {
    println("Hello, world!")
    // Hello, world!
}`,
      },
      {
        code: `val popcorn = 5    // There are 5 boxes of popcorn
val hotdog = 7     // There are 7 hotdogs
var customers = 10 // There are 10 customers in the queue

// Some customers leave the queue
customers = 8
println(customers)
// 8`,
      },
      {
        code: `val customers = 10
println("There are $customers customers")
// There are 10 customers

println("There are \${customers + 1} customers")
// There are 11 customers`,
      },
    ],
    defaultCode: `fun main() {
    println("Hello, world!")
    val popcorn = 5
    val hotdog = 7
    var customers = 10
    customers = 8
    println(customers)
    println("There are $customers customers")
}`,
    practice: [
      {
        id: "hello-practice",
        title: "Exercise",
        description: "Print \"Hello, Kotlin!\" to the console. Use fun main() and println().",
        starterCode: `fun main() {
    // Write your code here
}`,
        testCases: [
          { input: "", output: "Hello, Kotlin!" },
          { input: "ignore", output: "Hello, Kotlin!" },
        ],
        solution: `fun main() {
    println("Hello, Kotlin!")
}`,
      },
    ],
  },
  {
    id: "basic-types",
    step: 2,
    title: "Basic types",
    nextStep: "collections",
    prevStep: "hello-world",
    content: [
      "Every variable and data structure in Kotlin has a type. Types tell the compiler what you are allowed to do with that variable. Kotlin's ability to infer the type is called type inference.",
      "Basic types: Integers (Byte, Short, Int, Long), Unsigned integers (UByte, UShort, UInt, ULong), Floating-point (Float, Double), Booleans (Boolean), Characters (Char), Strings (String).",
      "+=, -=, *=, /=, and %= are augmented assignment operators.",
      "To declare a variable without initializing it, specify its type with :. Kotlin can manage this as long as variables are initialized before the first read.",
    ],
    codeExamples: [
      {
        code: `var customers = 10
customers = 8
customers = customers + 3 // Example of addition: 11
customers += 7            // Example: 18
customers -= 3            // Example: 15
customers *= 2            // Example: 30
customers /= 3            // Example: 10
println(customers) // 10`,
      },
      {
        code: `// Variable declared without initialization
val d: Int
d = 3

// Variable explicitly typed and initialized
val e: String = "hello"

println(d) // 3
println(e) // hello`,
      },
    ],
    defaultCode: `fun main() {
    var customers = 10
    customers = 8
    customers += 3
    println(customers)
    
    val d: Int
    d = 3
    val e: String = "hello"
    println("d=$d, e=$e")
}`,
    practice: [
      {
        id: "basic-types-practice",
        title: "Exercise",
        description: "Declare an Int variable year with value 2024 and a Double variable price with value 19.99. Print both using string templates.",
        starterCode: `fun main() {
    // Write your code here
}`,
        testCases: [
          { input: "", output: "year=2024, price=19.99" },
        ],
        hint: "Use val year: Int = 2024 and val price: Double = 19.99, then println(\"year=$year, price=$price\")",
        solution: `fun main() {
    val year: Int = 2024
    val price: Double = 19.99
    println("year=$year, price=$price")
}`,
      },
    ],
  },
  {
    id: "collections",
    step: 3,
    title: "Collections",
    nextStep: "control-flow",
    prevStep: "basic-types",
    content: [
      "Kotlin provides collections for grouping data: Lists (ordered, allow duplicates), Sets (unordered, unique items), Maps (key-value pairs where keys are unique).",
      "List: listOf() for read-only, mutableListOf() for mutable. Use [] for indexed access, .first(), .last(), .count(), in operator, .add(), .remove().",
      "Set: setOf() for read-only, mutableSetOf() for mutable. Duplicate items are dropped. Use .count(), in operator, .add(), .remove().",
      "Map: mapOf() and mutableMapOf(). Use \"key\" to value. Access with [], add with juiceMenu[\"coconut\"] = 150. Use .count(), .containsKey(), .keys, .values.",
    ],
    codeExamples: [
      {
        code: `// Read only list
val readOnlyShapes = listOf("triangle", "square", "circle")
println(readOnlyShapes)
// [triangle, square, circle]

val shapes: MutableList<String> = mutableListOf("triangle", "square", "circle")
shapes.add("pentagon")
println(shapes[0]) // triangle`,
      },
      {
        code: `// Read-only set (duplicates dropped)
val readOnlyFruit = setOf("apple", "banana", "cherry", "cherry")
println(readOnlyFruit) // [apple, banana, cherry]

println("banana" in readOnlyFruit) // true`,
      },
      {
        code: `// Read-only map
val readOnlyJuiceMenu = mapOf("apple" to 100, "kiwi" to 190, "orange" to 100)
println(readOnlyJuiceMenu["apple"]) // 100
println(readOnlyJuiceMenu.keys)    // [apple, kiwi, orange]
println(readOnlyJuiceMenu.values)  // [100, 190, 100]`,
      },
    ],
    defaultCode: `fun main() {
    val shapes = listOf("triangle", "square", "circle")
    println("First: ${"$"}shapes.first()")
    
    val fruit = setOf("apple", "banana", "cherry")
    println("Count: ${"$"}fruit.count()")
    
    val juiceMenu = mapOf("apple" to 100, "kiwi" to 190)
    println("Apple: ${"$"}juiceMenu["apple"]")
}`,
    practice: [
      {
        id: "collections-ex1",
        title: "Exercise 1",
        description: "You have a list of \"green\" numbers and a list of \"red\" numbers. Print how many numbers there are in total.",
        starterCode: `fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    // Write your code here
}`,
        testCases: [
          { input: "", output: "5" },
        ],
        solution: `fun main() {
    val greenNumbers = listOf(1, 4, 23)
    val redNumbers = listOf(17, 2)
    println(greenNumbers.count() + redNumbers.count())
}`,
      },
      {
        id: "collections-ex2",
        title: "Exercise 2",
        description: "You have a set of protocols supported by your server. A user requests to use a particular protocol. Check whether the requested protocol is supported or not. isSupported must be a Boolean. Print: \"Support for {requested}: {isSupported}\"",
        starterCode: `fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = true  // Replace: check if requested.uppercase() is in SUPPORTED
    println("Support for $requested: $isSupported")
}`,
        hint: "Use the 'in' operator: requested in SUPPORTED (but requested is lowercase, SUPPORTED has uppercase - use requested.uppercase() in SUPPORTED)",
        testCases: [
          { input: "", output: "Support for smtp: false" },
        ],
        solution: `fun main() {
    val SUPPORTED = setOf("HTTP", "HTTPS", "FTP")
    val requested = "smtp"
    val isSupported = requested.uppercase() in SUPPORTED
    println("Support for $requested: $isSupported")
}`,
      },
      {
        id: "collections-ex3",
        title: "Exercise 3",
        description: "Define a map that relates integer numbers from 1 to 3 to their corresponding spelling (1->\"one\", 2->\"two\", 3->\"three\"). Use this map to spell the given number n = 2.",
        starterCode: `fun main() {
    val number2word = mapOf(1 to "???", 2 to "???", 3 to "???")  // Fix: use "one", "two", "three"
    val n = 2
    println("$n is spelt as '\${number2word[n]}'")
}`,
        testCases: [
          { input: "", output: "2 is spelt as 'two'" },
        ],
        solution: `fun main() {
    val number2word = mapOf(1 to "one", 2 to "two", 3 to "three")
    val n = 2
    println("$n is spelt as '${"$"}number2word[n]'")
}`,
      },
    ],
  },
  {
    id: "control-flow",
    step: 4,
    title: "Control flow",
    nextStep: "functions",
    prevStep: "collections",
    content: [
      "Like other programming languages, Kotlin is capable of making decisions based on whether a piece of code is evaluated to be true. Such pieces of code are called conditional expressions. Kotlin is also able to create and iterate through loops.",
      "Conditional expressions — Kotlin provides if and when for checking conditional expressions. If you have to choose between if and when, we recommend using when because it: makes your code easier to read, easier to add another branch, and leads to fewer mistakes.",
      "If — Add the conditional expression within parentheses () and the action within curly braces {}. There is no ternary operator in Kotlin; if can be used as an expression. With one line per action, curly braces are optional.",
      "When — Use when for conditional expressions with multiple branches. Place the value in (), branches in {}, use -> to separate check from action. when can be used as a statement or expression. When with a subject makes code easier to read and helps Kotlin check that all cases are covered.",
      "Ranges — Use .. for inclusive (1..4 = 1,2,3,4), ..< for exclusive end (1..<4 = 1,2,3), downTo for reverse (4 downTo 1), step for increment (1..5 step 2 = 1,3,5). Works with Char too.",
      "Loops — for iterates over a range or collection. while executes while a condition is true. do-while executes at least once then checks the condition.",
    ],
    codeExamples: [
      {
        code: `val d: Int
val check = true
if (check) { d = 1 } else { d = 2 }
println(d) // 1

val a = 1
val b = 2
println(if (a > b) a else b) // 2`,
      },
      {
        code: `val obj = "Hello"
when (obj) {
    "1" -> println("One")
    "Hello" -> println("Greeting")
    else -> println("Unknown")
}
// Greeting

val result = when (obj) {
    "1" -> "One"
    "Hello" -> "Greeting"
    else -> "Unknown"
}
println(result) // Greeting`,
      },
      {
        code: `val trafficLightState = "Red"
val trafficAction = when (trafficLightState) {
    "Green" -> "Go"
    "Yellow" -> "Slow down"
    "Red" -> "Stop"
    else -> "Malfunction"
}
println(trafficAction) // Stop`,
      },
      {
        code: `for (number in 1..5) { print(number) }
// 12345

val cakes = listOf("carrot", "cheese", "chocolate")
for (cake in cakes) {
    println("Yummy, it's a $cake cake!")
}`,
      },
      {
        code: `var cakesEaten = 0
while (cakesEaten < 3) {
    println("Eat a cake")
    cakesEaten++
}

var cakesBaked = 0
do {
    println("Bake a cake")
    cakesBaked++
} while (cakesBaked < cakesEaten)`,
      },
    ],
    defaultCode: `fun main() {
    val trafficLightState = "Red"
    val trafficAction = when (trafficLightState) {
        "Green" -> "Go"
        "Yellow" -> "Slow down"
        "Red" -> "Stop"
        else -> "Malfunction"
    }
    println(trafficAction)
    
    for (n in 1..5) print(n)
    println()
}`,
    practice: [
      {
        id: "controlflow-dice",
        title: "Conditional: Dice game",
        description: "Create a game where you win if two dice show the same number. Read two integers from stdin (one per line). Use if to print \"You win :)\" if they match or \"You lose :(\" otherwise.",
        starterCode: `fun main() {
    val first = readln().toInt()
    val second = readln().toInt()
    // Write your code here
}`,
        hint: "Use if (first == second) { println(\"You win :)\") } else { println(\"You lose :(\") }",
        testCases: [
          { input: "3\n3", output: "You win :)" },
          { input: "2\n5", output: "You lose :(" },
        ],
        solution: `fun main() {
    val first = readln().toInt()
    val second = readln().toInt()
    if (first == second) {
        println("You win :)")
    } else {
        println("You lose :(")
    }
}`,
      },
      {
        id: "controlflow-buttons",
        title: "Conditional: Button actions",
        description: "Using when, print the action for each game button. Read the button from stdin. A->Yes, B->No, X->Menu, Y->Nothing, other->\"There is no such button\"",
        starterCode: `fun main() {
    val button = readln()
    println(
        // Write your code here
    )
}`,
        hint: "Use when (button) { \"A\" -> \"Yes\"; \"B\" -> \"No\"; \"X\" -> \"Menu\"; \"Y\" -> \"Nothing\"; else -> \"There is no such button\" }",
        testCases: [
          { input: "A", output: "Yes" },
          { input: "B", output: "No" },
          { input: "X", output: "Menu" },
          { input: "Y", output: "Nothing" },
          { input: "Z", output: "There is no such button" },
        ],
        solution: `fun main() {
    val button = readln()
    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "There is no such button"
        }
    )
}`,
      },
      {
        id: "controlflow-pizza-while",
        title: "Loops: Pizza slices (while)",
        description: "Refactor the pizza program using a while loop. Count slices until 8, printing each step. Final line: \"There are 8 slices of pizza. Hooray! We have a whole pizza! :D\"",
        starterCode: `fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    // ... refactor with while
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}`,
        hint: "while (pizzaSlices < 7) { pizzaSlices++; println(...) }; pizzaSlices++",
        testCases: [
          {
            input: "",
            output: "There's only 1 slice/s of pizza :(\nThere's only 2 slice/s of pizza :(\nThere's only 3 slice/s of pizza :(\nThere's only 4 slice/s of pizza :(\nThere's only 5 slice/s of pizza :(\nThere's only 6 slice/s of pizza :(\nThere's only 7 slice/s of pizza :(\nThere are 8 slices of pizza. Hooray! We have a whole pizza! :D",
          },
        ],
        solution: `fun main() {
    var pizzaSlices = 0
    while (pizzaSlices < 7) {
        pizzaSlices++
        println("There's only $pizzaSlices slice/s of pizza :(")
    }
    pizzaSlices++
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}`,
      },
      {
        id: "controlflow-fizzbuzz",
        title: "Loops: Fizz buzz",
        description: "Print numbers 1 to 100. Replace divisible by 3 with \"fizz\", by 5 with \"buzz\", by both with \"fizzbuzz\".",
        starterCode: `fun main() {
    // Write your code here
}`,
        hint: "for (number in 1..100) { when { number % 15 == 0 -> \"fizzbuzz\"; number % 3 == 0 -> \"fizz\"; number % 5 == 0 -> \"buzz\"; else -> \"$number\" } }",
        testCases: [
          {
            input: "",
            output: "1\n2\nfizz\n4\nbuzz\nfizz\n7\n8\nfizz\nbuzz\n11\nfizz\n13\n14\nfizzbuzz\n16\n17\nfizz\n19\nbuzz\nfizz\n22\n23\nfizz\nbuzz\n26\nfizz\n28\n29\nfizzbuzz\n31\n32\nfizz\n34\nbuzz\nfizz\n37\n38\nfizz\nbuzz\n41\nfizz\n43\n44\nfizzbuzz\n46\n47\nfizz\n49\nbuzz\nfizz\n52\n53\nfizz\nbuzz\n56\nfizz\n58\n59\nfizzbuzz\n61\n62\nfizz\n64\nbuzz\nfizz\n67\n68\nfizz\nbuzz\n71\nfizz\n73\n74\nfizzbuzz\n76\n77\nfizz\n79\nbuzz\nfizz\n82\n83\nfizz\nbuzz\n86\nfizz\n88\n89\nfizzbuzz\n91\n92\nfizz\n94\nbuzz\nfizz\n97\n98\nfizz\nbuzz",
          },
        ],
        solution: `fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> "$number"
            }
        )
    }
}`,
      },
      {
        id: "controlflow-words",
        title: "Loops: Words starting with l",
        description: "Use for and if to print only the words that start with the letter l from the list.",
        starterCode: `fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // Write your code here
}`,
        hint: "for (w in words) { if (w.startsWith(\"l\")) println(w) }",
        testCases: [
          {
            input: "",
            output: "limousine\nlanguage",
          },
        ],
        solution: `fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}`,
      },
    ],
  },
  {
    id: "functions",
    step: 5,
    title: "Functions",
    nextStep: "classes",
    prevStep: "control-flow",
    content: [
      "You can declare your own functions in Kotlin using the fun keyword. Parameters go in (), each with a type. Return type after () with :. Body in {}. Use return to exit or return a value. Omit return type and return for Unit (nothing useful).",
      "Named arguments — When calling a function, you can use parameter names for readability. With named arguments, parameters can be in any order.",
      "Default parameter values — Use = after the type to give a default. Callers can omit parameters with defaults. After the first skipped parameter, name all subsequent parameters.",
      "Functions without return — If a function doesn't return a useful value, its type is Unit. You don't have to declare Unit or use return.",
      "Single-expression functions — Remove {} and use = for the body. Kotlin infers the return type. Example: fun sum(x: Int, y: Int) = x + y",
      "Early returns — Use return to exit a function early when a condition is met.",
      "Lambda expressions — Concise anonymous functions. Syntax: { params -> body }. Use with .filter(), .map(), etc. Function types: (ParamType) -> ReturnType. Trailing lambdas can be written outside ().",
    ],
    codeExamples: [
      {
        code: `fun sum(x: Int, y: Int): Int {
    return x + y
}
fun main() {
    println(sum(1, 2)) // 3
}`,
      },
      {
        code: `fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}
fun main() {
    printMessageWithPrefix("Hello", "Log")   // [Log] Hello
    printMessageWithPrefix("Hello")          // [Info] Hello
    printMessageWithPrefix(prefix = "Log", message = "Hello")
}`,
      },
      {
        code: `fun sum(x: Int, y: Int) = x + y

val upperCaseString: (String) -> String = { text -> text.uppercase() }
println(upperCaseString("hello")) // HELLO`,
      },
      {
        code: `val numbers = listOf(1, -2, 3, -4, 5, -6)
val positives = numbers.filter { x -> x > 0 }  // [1, 3, 5]
val doubled = numbers.map { x -> x * 2 }       // [2, -4, 6, -8, 10, -12]

println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6`,
      },
    ],
    defaultCode: `fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    val numbers = listOf(1, -2, 3, -4, 5)
    println(numbers.filter { it > 0 })
}`,
    practice: [
      {
        id: "functions-circlearea",
        title: "Exercise 1: circleArea",
        description: "Write a function circleArea that takes radius (Int) and returns the area. Use kotlin.math.PI. Print circleArea(2).",
        starterCode: `import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}`,
        hint: "fun circleArea(radius: Int): Double { return PI * radius * radius }",
        testCases: [
          { input: "", output: "12.566370614359172" },
        ],
        solution: `import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2))
}`,
      },
      {
        id: "functions-circlearea-single",
        title: "Exercise 2: circleArea single-expression",
        description: "Rewrite circleArea as a single-expression function.",
        starterCode: `import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2))
}`,
        hint: "fun circleArea(radius: Int) = PI * radius * radius",
        testCases: [
          { input: "", output: "12.566370614359172" },
        ],
        solution: `import kotlin.math.PI

fun circleArea(radius: Int) = PI * radius * radius

fun main() {
    println(circleArea(2))
}`,
      },
      {
        id: "functions-interval",
        title: "Exercise 3: intervalInSeconds with defaults",
        description: "Add default parameter values (hours=0, minutes=0, seconds=0) and use named arguments so the calls are easier to read.",
        starterCode: `fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}`,
        hint: "fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) = ...",
        testCases: [
          {
            input: "",
            output: "4815\n85\n7200\n600\n3601",
          },
        ],
        solution: `fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(hours = 1, minutes = 20, seconds = 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}`,
      },
      {
        id: "functions-lambda-urls",
        title: "Lambda: Build URLs",
        description: "Use a lambda (e.g. with .map) to create URLs: prefix + \"/\" + id + \"/\" + action for each action. Result: [https://example.com/book-info/5/title, ...]",
        starterCode: `fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here
    println(urls)
}`,
        hint: "actions.map { action -> \"$prefix/$id/$action\" }",
        testCases: [
          {
            input: "",
            output: "[https://example.com/book-info/5/title, https://example.com/book-info/5/year, https://example.com/book-info/5/author]",
          },
        ],
        solution: `fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}`,
      },
      {
        id: "functions-lambda-repeat",
        title: "Lambda: repeatN",
        description: "Write repeatN(n: Int, action: () -> Unit) that runs action n times. Use it to print \"Hello\" 5 times.",
        starterCode: `fun repeatN(n: Int, action: () -> Unit) {
    // Write your code here
}

fun main() {
    // Write your code here
}`,
        hint: "for (i in 1..n) action(). Call: repeatN(5) { println(\"Hello\") }",
        testCases: [
          {
            input: "",
            output: "Hello\nHello\nHello\nHello\nHello",
          },
        ],
        solution: `fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}`,
      },
    ],
  },
  {
    id: "classes",
    step: 6,
    title: "Classes",
    nextStep: "null-safety",
    prevStep: "functions",
    content: [
      "Kotlin supports object-oriented programming with classes and objects. Objects store data; classes declare characteristics. Create objects from classes to avoid repeating declarations.",
      "Properties — Declare in parentheses () after the class name or in the class body {}. Use val for read-only, var for mutable. Properties in () without val/var are not accessible after creation. Class header = content in (). Properties can have default values.",
      "Create instance — Use the constructor. Kotlin auto-creates one from the class header parameters.",
      "Access properties — instance.property. Use string templates: \${instance.property}.",
      "Member functions — Define behavior inside the class body. Call with instance.functionName().",
      "Data classes — Use data keyword. Automatically get toString(), equals()/==, copy(). Useful for storing data without boilerplate.",
      "copy() — Create a copy, optionally with different properties. Safer than modifying the original.",
    ],
    codeExamples: [
      {
        code: `class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.email)           // mary@gmail.com
    contact.email = "jane@gmail.com"
    println(contact.email)           // jane@gmail.com
}`,
      },
      {
        code: `class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}
fun main() {
    val contact = Contact(1, "mary@gmail.com")
    contact.printId()  // 1
}`,
      },
      {
        code: `data class User(val name: String, val id: Int)

val user = User("Alex", 1)
println(user)  // User(name=Alex, id=1)

val secondUser = User("Alex", 1)
println(user == secondUser)  // true

println(user.copy("Max"))   // User(name=Max, id=1)
println(user.copy(id = 3))  // User(name=Alex, id=3)`,
      },
    ],
    defaultCode: `data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    println(user)
    val copy = user.copy(name = "Max")
    println(copy)
}`,
    practice: [
      {
        id: "classes-employee",
        title: "Exercise 1: Employee data class",
        description: "Define a data class Employee with name (val) and salary (var). The main creates one, prints it, adds 10 to salary, then prints again.",
        starterCode: `// Write your code here

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}`,
        hint: "data class Employee(val name: String, var salary: Int)",
        testCases: [
          {
            input: "",
            output: "Employee(name=Mary, salary=20)\nEmployee(name=Mary, salary=30)",
          },
        ],
        solution: `data class Employee(val name: String, var salary: Int)

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}`,
      },
      {
        id: "classes-person",
        title: "Exercise 2: Person, Name, Address, City",
        description: "Declare data classes Name(firstName, lastName), Address(street, city), and City(name, country) so Person compiles. Add println(person) at the end of main.",
        starterCode: `data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
// Write your code here: data class Name(...), Address(...), City(...)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
    println(person)
}`,
        hint: "data class Name(val firstName: String, val lastName: String), data class City(val name: String, val country: String), data class Address(val street: String, val city: City)",
        testCases: [
          {
            input: "",
            output: "Person(name=Name(firstName=John, lastName=Smith), address=Address(street=123 Fake Street, city=City(name=Springfield, country=US)), ownsAPet=false)",
          },
        ],
        solution: `data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
data class Name(val firstName: String, val lastName: String)
data class City(val name: String, val country: String)
data class Address(val street: String, val city: City)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
    println(person)
}`,
      },
      {
        id: "classes-random-generator",
        title: "Exercise 3: RandomEmployeeGenerator",
        description: "Define class RandomEmployeeGenerator with var minSalary, var maxSalary in the header, and names list + generateEmployee() in the body. Use Random.nextInt(from, until) and names.random(). Output varies—use Run to verify.",
        starterCode: `import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// Write your code here

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}`,
        hint: "class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) { val names = listOf(\"John\", \"Mary\", ...); fun generateEmployee() = Employee(names.random(), Random.nextInt(minSalary, maxSalary)) }",
        testCases: [
          {
            input: "",
            output: "Employee(name=John, salary=15)\nEmployee(name=Mary, salary=22)\nEmployee(name=Ann, salary=28)\nEmployee(name=Paul, salary=75)",
          },
        ],
        solution: `import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
    val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
    fun generateEmployee() =
        Employee(names.random(), Random.nextInt(minSalary, maxSalary))
}

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}`,
      },
    ],
  },
  {
    id: "null-safety",
    step: 7,
    title: "Null safety",
    nextStep: "extension-functions",
    prevStep: "classes",
    content: [
      "Kotlin allows null values when something is missing or not yet set. Null safety detects potential null issues at compile time rather than at run time.",
      "Nullable types — By default, types don't accept null. Add ? after the type to make it nullable: String?.",
      "Check for null — Use conditional expressions: if (maybeString != null && maybeString.length > 0).",
      "Safe call operator ?. — Safely access properties or call functions on possibly null objects. Returns null if the object is null. Chain: person.company?.address?.country.",
      "Elvis operator ?: — Provide a default when null is detected. Left side = what to check, right side = default if null. Example: nullable?.length ?: 0",
    ],
    codeExamples: [
      {
        code: `var neverNull: String = "This can't be null"
var nullable: String? = "You can keep a null here"
nullable = null  // OK

fun strLength(notNull: String): Int = notNull.length
// strLength(nullable)  // Compiler error`,
      },
      {
        code: `fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length \${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}
val nullString: String? = null
println(describeString(nullString))  // Empty or null string`,
      },
      {
        code: `fun lengthString(maybeString: String?): Int? = maybeString?.length

val nullString: String? = null
println(lengthString(nullString))  // null
println(nullString?.uppercase())   // null`,
      },
      {
        code: `val nullString: String? = null
println(nullString?.length ?: 0)  // 0`,
      },
    ],
    defaultCode: `fun main() {
    val nullable: String? = null
    println(nullable?.length ?: 0)
    val s = "hello"
    println(s.length)
}`,
    practice: [
      {
        id: "nullsafety-salary",
        title: "Exercise: salaryById",
        description: "Write salaryById(id: Int) that returns the employee's salary for the given id, or 0 if the employee is null. Use employeeById(id)?.salary ?: 0",
        starterCode: `data class Employee(val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}`,
        hint: "employeeById(id)?.salary ?: 0",
        testCases: [
          {
            input: "",
            output: "64",
          },
        ],
        solution: `data class Employee(val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}`,
      },
    ],
  },
  {
    id: "extension-functions",
    step: 8,
    title: "Extension functions",
    nextStep: "scope-functions",
    prevStep: "null-safety",
    content: [
      "In this chapter, you'll explore special Kotlin functions that make your code more concise and readable. Learn how they can help you use efficient design patterns to take your projects to the next level.",
      "In software development, you often need to modify a program's behavior without changing the original source code. For example, you might want to add extra functionality to a class from a third-party library.",
      "You can do this by adding extension functions to extend a class. You call extension functions the same way you call member functions of a class, using a period .",
      "Before introducing the complete syntax for extension functions, you need to understand what a receiver is. The receiver is what the function is called on. In other words, the receiver is where or with whom the information is shared.",
      "To create an extension function, write the name of the class that you want to extend followed by a . and the name of your function. Continue with the rest of the function declaration, including its arguments and return type. The receiver is accessed inside the body by the keyword: this.",
      "You can define extension functions anywhere, which enables you to create extension-oriented designs. These designs separate core functionality from useful but non-essential features, making your code easier to read and maintain.",
    ],
    codeExamples: [
      {
        code: `fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" is the receiver
    println("hello".bold())
    // <b>hello</b>
}`,
        comment: "String is the extended class; bold is the extension function; \"hello\" is the receiver; this refers to the receiver.",
      },
      {
        code: `class HttpResponse(val body: String)
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        println("Requesting $method to $url with headers: $headers")
        return HttpResponse("Response from $url")
    }
}
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())

fun main() {
    val client = HttpClient()
    val getResponseWithExtension = client.get("https://example.com")
    println(getResponseWithExtension.body)
}`,
        comment: "Extension-oriented design: .get() extends HttpClient and calls request() with the right method.",
      },
    ],
    defaultCode: `fun String.bold(): String = "<b>$this</b>"

class HttpResponse(val body: String)
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        return HttpResponse("Response from $url")
    }
}
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())

fun main() {
    println("hello".bold())
    val client = HttpClient()
    println(client.get("https://example.com").body)
}`,
    practice: [
      {
        id: "extension-ex1",
        title: "Exercise 1",
        description: "Write an extension function called isPositive that takes an integer and checks whether it is positive.",
        starterCode: `fun Int.isPositive(): Boolean = false  // Fix: return this > 0

fun main() {
    println(1.isPositive())
    // true
}`,
        testCases: [
          { input: "", output: "true" },
        ],
        hint: "fun Int.isPositive(): Boolean = this > 0",
        solution: `fun Int.isPositive(): Boolean = this > 0

fun main() {
    println(1.isPositive())
    // true
}`,
      },
      {
        id: "extension-ex2",
        title: "Exercise 2",
        description: "Write an extension function called toLowercaseString that takes a string and returns a lowercase version. Hint: Use the .lowercase() function for the String type.",
        starterCode: `fun String.toLowercaseString(): String = this  // Fix: return this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}`,
        testCases: [
          { input: "", output: "hello world!" },
        ],
        hint: "fun String.toLowercaseString(): String = this.lowercase()",
        solution: `fun String.toLowercaseString(): String = this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}`,
      },
    ],
  },
  {
    id: "scope-functions",
    step: 5,
    title: "Scope functions",
    nextStep: "lambda-expressions-with-receiver",
    prevStep: "extension-functions",
    content: [
      "In this chapter, you'll build on your understanding of extension functions to learn how to use scope functions to write more idiomatic code.",
      "In programming, a scope is the area in which your variable or object is recognized. The most commonly referred to scopes are the global scope and the local scope: Global scope – a variable or object that is accessible from anywhere in the program. Local scope – a variable or object that is only accessible within the block or function where it is defined.",
      "In Kotlin, there are also scope functions that allow you to create a temporary scope around an object and execute some code. Scope functions make your code more concise because you don't have to refer to the name of your object within the temporary scope. Depending on the scope function, you can access the object either by referencing it via the keyword this or using it as an argument via the keyword it.",
      "Kotlin has five scope functions in total: let, apply, run, also, and with. Each scope function takes a lambda expression and returns either the object or the result of the lambda expression.",
      "Let – Use the let scope function when you want to perform null checks and later perform further actions with the returned object. You refer to the object via it inside the lambda.",
      "Apply – Use the apply scope function to initialize objects at the time of creation. You refer to the object via this (implicit receiver). apply returns the object itself.",
      "Run – Similar to apply, use run to initialize an object and immediately compute a result. run returns the lambda result.",
      "Also – Use the also scope function to complete an additional action with an object (e.g. logging) and then return the object. You refer to the object via it.",
      "With – Unlike the others, with is not an extension function; you pass the receiver as an argument. Use with when you want to call multiple functions on an object. It returns the lambda result.",
    ],
    codeExamples: [
      {
        code: `fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}
fun getNextAddress(): String? = "sebastian@jetbrains.com"

fun main() {
    val address: String? = getNextAddress()
    val confirm = address?.let { sendNotification(it) }
    println(confirm)
}`,
        comment: "let: null-safe scope; refer to the object via it; returns the lambda result.",
      },
      {
        code: `class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String { println("getting data!"); return "Mock data" }
}
val client = Client().apply {
    token = "asdf"
    connect()
    authenticate()
}
fun main() {
    client.getData()
}`,
        comment: "apply: configure the object at creation; access via this (implicit); returns the object.",
      },
      {
        code: `val medals = listOf("Gold", "Silver", "Bronze")
val result = medals
    .map { it.uppercase() }
    .also { println(it) }
    .filter { it.length > 4 }
    .also { println(it) }
    .reversed()
fun main() {
    println(result)
}`,
        comment: "also: do something (e.g. log) and return the same object; access via it.",
      },
      {
        code: `class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int) = println("rect $x,$y $w x $h")
    fun circ(x: Int, y: Int, rad: Int) = println("circ $x,$y r=$rad")
    fun text(x: Int, y: Int, str: String) = println("text $x,$y \"$str\"")
}
fun main() {
    val canvas = Canvas()
    with(canvas) {
        text(10, 10, "Foo")
        rect(20, 30, 100, 50)
        circ(40, 60, 25)
    }
}`,
        comment: "with(receiver) { ... }: not an extension; pass receiver as argument; call multiple functions.",
      },
    ],
    defaultCode: `fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}
fun getNextAddress(): String? = "sebastian@jetbrains.com"

fun main() {
    val address: String? = getNextAddress()
    val confirm = address?.let { sendNotification(it) }
    println(confirm)
}`,
    practice: [
      {
        id: "scope-ex1",
        title: "Exercise 1",
        description: "Rewrite the .getPriceInEuros() function as a single-expression function that uses safe call operators ?. and the let scope function.",
        starterCode: `data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? = ProductInfo(100.0)
}

fun Product.getPriceInEuros(): Double? {
    val info = getProductInfo()
    if (info == null) return null
    val price = info.priceInDollars
    if (price == null) return null
    return convertToEuros(price)
}

fun convertToEuros(dollars: Double): Double = dollars * 0.85

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()
    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
    } else {
        println("Price information is not available.")
    }
}`,
        testCases: [
          { input: "", output: "Price in Euros: €85.0" },
        ],
        hint: "Use getProductInfo()?.priceInDollars?.let { convertToEuros(it) }",
        solution: `data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? = ProductInfo(100.0)
}

fun Product.getPriceInEuros(): Double? = getProductInfo()?.priceInDollars?.let { convertToEuros(it) }

fun convertToEuros(dollars: Double): Double = dollars * 0.85

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()
    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
    } else {
        println("Price information is not available.")
    }
}`,
      },
      {
        id: "scope-ex2",
        title: "Exercise 2",
        description: "You have an updateEmail() function that updates the email address of a user. Use the apply scope function to update the email address and then the also scope function to print a log message: Updating email for user with ID: \${it.id}.",
        starterCode: `data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = // Write your code here

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    println("Updated User: $updatedUser")
}`,
        testCases: [
          { input: "", output: "Updating email for user with ID: 1\nUpdated User: User(id=1, email=new_email@example.com)" },
        ],
        hint: "user.apply { this.email = newEmail }.also { println(\"Updating email for user with ID: \${it.id}\") }",
        solution: `data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = user.apply {
    this.email = newEmail
}.also { println("Updating email for user with ID: ${"$"}{it.id}") }

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    println("Updated User: $updatedUser")
}`,
      },
    ],
  },
  {
    id: "lambda-expressions-with-receiver",
    step: 6,
    title: "Lambda expressions with receiver",
    nextStep: "classes-and-interfaces",
    prevStep: "scope-functions",
    content: [
      "In this chapter, you'll learn how to use receivers with another type of function, lambda expressions, and how they can help you create a domain-specific language.",
      "In the beginner tour, you learned how to use lambda expressions. Lambda expressions can also have a receiver. In this case, lambda expressions can access any member functions or properties of the receiver without having to explicitly specify the receiver each time. Without these additional references, your code is easier to read and maintain. Lambda expressions with receiver are also known as function literals with receiver.",
      "The syntax for a lambda expression with receiver is different when you define the function type. First, write the receiver that you want to extend. Next, put a . and then complete the rest of your function type definition. For example: MutableList<Int>.() -> Unit has MutableList<Int> as the receiver, no function parameters, and Unit as the return type.",
      "When you pass a lambda with receiver to a function, that function can create an instance of the receiver type, call the lambda on it (so inside the lambda you can call members without qualifying them), and return the instance or a result. This pattern is common in DSLs and builders.",
      "Lambda expressions with receiver are helpful when you want to create a domain-specific language (DSL). Since you have access to the receiver's member functions and properties without explicitly referencing the receiver, your code becomes leaner. Kotlin's ecosystem uses this in buildList(), buildString(), and many API builders.",
    ],
    codeExamples: [
      {
        code: `class Canvas {
    fun drawCircle() = println("🟠 Drawing a circle")
    fun drawSquare() = println("🟥 Drawing a square")
}

fun render(block: Canvas.() -> Unit): Canvas {
    val canvas = Canvas()
    canvas.block()
    return canvas
}

fun main() {
    render {
        drawCircle()
        drawSquare()
    }
}`,
        comment: "block: Canvas.() -> Unit is a lambda with receiver; inside the lambda you call drawCircle()/drawSquare() on the canvas without naming it.",
      },
      {
        code: `class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()
    fun item(name: String) { items.add(MenuItem(name)) }
}

fun menu(name: String, init: Menu.() -> Unit): Menu {
    val menu = Menu(name)
    menu.init()
    return menu
}

fun main() {
    val mainMenu = menu("Main Menu") {
        item("Home")
        item("Settings")
        item("Exit")
    }
    println("Menu: ${"$"}mainMenu.name")
    mainMenu.items.forEach { println("  Item: ${"$"}it.name") }
}`,
        comment: "menu(name) { item(...) } is a DSL; init: Menu.() -> Unit lets you call item() inside the block as if you were inside Menu.",
      },
    ],
    defaultCode: `class Canvas {
    fun drawCircle() = println("🟠 Drawing a circle")
    fun drawSquare() = println("🟥 Drawing a square")
}

fun render(block: Canvas.() -> Unit): Canvas {
    val canvas = Canvas()
    canvas.block()
    return canvas
}

fun main() {
    render {
        drawCircle()
        drawSquare()
    }
}`,
    practice: [
      {
        id: "lambda-receiver-ex1",
        title: "Exercise 1",
        description: "You have a fetchData() function that accepts a lambda expression with receiver. Update the lambda expression to use the append() function so that the output of your code is: Data received - Processed.",
        starterCode: `fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
    println(builder.toString())
}

fun main() {
    fetchData {
        // Write your code here
        // Data received - Processed
    }
}`,
        testCases: [
          { input: "", output: "Data received - Processed" },
        ],
        hint: "Use append(\" - Processed\") inside the lambda; the receiver is a StringBuilder.",
        solution: `fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
    println(builder.toString())
}

fun main() {
    fetchData {
        append(" - Processed")
    }
}`,
      },
      {
        id: "lambda-receiver-ex2",
        title: "Exercise 2",
        description: "You have a Button class and ButtonEvent and Position data classes. Write some code that triggers the onEvent() member function of the Button class to trigger a double-click event. Your code should print \"Double click!\".",
        starterCode: `class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action()
    }
}

data class ButtonEvent(val isRightClick: Boolean, val amount: Int, val position: Position)
data class Position(val x: Int, val y: Int)

fun main() {
    val button = Button()
    button.onEvent {
        // Write your code here
        // Double click!
    }
}`,
        testCases: [
          { input: "", output: "Double click!" },
        ],
        hint: "Inside the lambda the receiver is ButtonEvent; check if amount == 2 and println(\"Double click!\").",
        solution: `class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action()
    }
}

data class ButtonEvent(val isRightClick: Boolean, val amount: Int, val position: Position)
data class Position(val x: Int, val y: Int)

fun main() {
    val button = Button()
    button.onEvent {
        if (amount == 2) println("Double click!")
    }
}`,
      },
      {
        id: "lambda-receiver-ex3",
        title: "Exercise 3",
        description: "Write a function that creates a copy of a list of integers where every element is incremented by 1. Use the provided function skeleton that extends List<Int> with an incremented() function. Inside buildList, iterate over originalList and add each element plus 1.",
        starterCode: `fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        // Write your code here
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // [2, 3, 4]
}`,
        testCases: [
          { input: "", output: "[2, 3, 4]" },
        ],
        hint: "buildList { for (n in originalList) add(n + 1) }",
        solution: `fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        for (n in originalList) add(n + 1)
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
}`,
      },
    ],
  },
  {
    id: "classes-and-interfaces",
    step: 7,
    title: "Classes and interfaces",
    nextStep: "objects",
    prevStep: "lambda-expressions-with-receiver",
    content: [
      "In the beginner tour, you learned how to use classes and data classes to store data. Eventually, you will want to create a hierarchy to efficiently share code. This chapter explains the options Kotlin provides for sharing code and how they can make your code safer and easier to maintain.",
      "By default, classes in Kotlin can't be inherited. Kotlin classes only support single inheritance (one parent). The parent can itself inherit from another class, forming a hierarchy. At the top of Kotlin's class hierarchy is Any; all classes ultimately inherit from Any, which provides toString() and other members.",
      "Abstract classes can be inherited by default. They provide members that other classes inherit or implement. You can't create instances of an abstract class. Use the abstract keyword for the class and for functions or properties without implementation. In the child class, use override to define or change behavior.",
      "Interfaces are similar to classes but you can't create an instance; they have no constructor. Their functions and properties are implicitly open. Use them to define a contract that classes implement. A class can implement multiple interfaces. Use a colon after the class header: class Foo : InterfaceA, InterfaceB.",
      "If an interface has many functions, implementing it can create a lot of boilerplate. In Kotlin you can delegate the implementation to another object using the by keyword: class CanvasSession(val tool: DrawingTool) : DrawingTool by tool. Then you only override the members you want to change.",
    ],
    codeExamples: [
      {
        code: `abstract class Product(val name: String, var price: Double) {
    abstract val category: String
    fun productInfo(): String = "Product: $name, Category: $category, Price: $price"
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

fun main() {
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)
    println(laptop.productInfo())
}`,
        comment: "Abstract class with abstract property; child overrides category and inherits productInfo().",
      },
      {
        code: `interface PaymentMethod {
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        return "Payment of ${"$"}amount initiated using Credit Card ending in \${cardNumber.takeLast(4)}."
    }
}

fun main() {
    val payment = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(payment.initiatePayment(100.0))
}`,
        comment: "Interface with one function; class implements it with override.",
      },
      {
        code: `interface DrawingTool {
    val color: String
    fun draw(shape: String)
    fun getToolInfo(): String
}

class PenTool : DrawingTool {
    override val color = "black"
    override fun draw(shape: String) = println("Drawing $shape in $color")
    override fun getToolInfo(): String = "PenTool(color=$color)"
}

class CanvasSession(val tool: DrawingTool) : DrawingTool by tool {
    override val color = "blue"
}

fun main() {
    val session = CanvasSession(PenTool())
    println(session.getToolInfo())
    session.draw("circle")
}`,
        comment: "Delegation: CanvasSession delegates to tool and only overrides color.",
      },
    ],
    defaultCode: `abstract class Product(val name: String, var price: Double) {
    abstract val category: String
    fun productInfo(): String = "Product: $name, Category: $category, Price: $price"
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

fun main() {
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)
    println(laptop.productInfo())
}`,
    practice: [
      {
        id: "classes-ex1",
        title: "Exercise 1",
        description: "Complete the abstract class SmartDevice so that SmartLight compiles. Then create SmartThermostat that inherits from SmartDevice and implements turnOn(), turnOff(), and adjustTemperature(temperature: Int) with the required print messages.",
        starterCode: `abstract class // Write your code here

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() { println("$name is now ON.") }
    override fun turnOff() { println("$name is now OFF.") }
    fun adjustBrightness(level: Int) { println("Adjusting $name brightness to $level%.") }
}

class SmartThermostat // Write your code here

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    livingRoomLight.turnOn()
    livingRoomLight.adjustBrightness(10)
    livingRoomLight.turnOff()
    bedroomThermostat.turnOn()
    bedroomThermostat.adjustTemperature(5)
    bedroomThermostat.turnOff()
}`,
        testCases: [
          {
            input: "",
            output: "Living Room Light is now ON.\nAdjusting Living Room Light brightness to 10%.\nLiving Room Light is now OFF.\nBedroom Thermostat thermostat is now heating.\nBedroom Thermostat thermostat set to 5°C.\nBedroom Thermostat thermostat is now off.",
          },
        ],
        hint: "abstract class SmartDevice(val name: String) { abstract fun turnOn(); abstract fun turnOff() }",
        solution: `abstract class SmartDevice(val name: String) {
    abstract fun turnOn()
    abstract fun turnOff()
}

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() { println("$name is now ON.") }
    override fun turnOff() { println("$name is now OFF.") }
    fun adjustBrightness(level: Int) { println("Adjusting $name brightness to $level%.") }
}

class SmartThermostat(name: String) : SmartDevice(name) {
    override fun turnOn() { println("$name thermostat is now heating.") }
    override fun turnOff() { println("$name thermostat is now off.") }
    fun adjustTemperature(temperature: Int) { println("$name thermostat set to $temperature°C.") }
}

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    livingRoomLight.turnOn()
    livingRoomLight.adjustBrightness(10)
    livingRoomLight.turnOff()
    bedroomThermostat.turnOn()
    bedroomThermostat.adjustTemperature(5)
    bedroomThermostat.turnOff()
}`,
      },
      {
        id: "classes-ex2",
        title: "Exercise 2",
        description: "Create an interface Media with a property title and a function play(). Then create a class Audio that implements Media, with title and composer in its constructor, and play() printing: Playing audio: $title, composed by $composer.",
        starterCode: `interface // Write your code here

class // Write your code here

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
}`,
        testCases: [
          { input: "", output: "Playing audio: Symphony No. 5, composed by Beethoven" },
        ],
        hint: "interface Media { val title: String; fun play() }. class Audio(override val title: String, val composer: String) : Media",
        solution: `interface Media {
    val title: String
    fun play()
}

class Audio(override val title: String, val composer: String) : Media {
    override fun play() {
        println("Playing audio: $title, composed by $composer")
    }
}

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
}`,
      },
      {
        id: "classes-ex3",
        title: "Exercise 3",
        description: "Add refund() to Refundable interface. In PaymentMethod add authorize(amount) (with implementation) and abstract processPayment(amount). Create CreditCard that implements Refundable and extends PaymentMethod with the required print messages.",
        starterCode: `interface Refundable {
    // Write your code here
}

abstract class PaymentMethod(val name: String) {
    // Write your code here
}

class CreditCard // Write your code here

fun main() {
    val visa = CreditCard("Visa")
    visa.authorize(100.0)
    visa.processPayment(100.0)
    visa.refund(50.0)
}`,
        testCases: [
          {
            input: "",
            output: "Authorizing payment of $100.0.\nProcessing credit card payment of $100.0.\nRefunding $50.0 to the credit card.",
          },
        ],
        hint: "Refundable has fun refund(amount: Double). PaymentMethod has fun authorize(amount: Double) { ... } and abstract fun processPayment(amount: Double).",
        solution: `interface Refundable {
    fun refund(amount: Double)
}

abstract class PaymentMethod(val name: String) {
    fun authorize(amount: Double) {
        println("Authorizing payment of ${"$"}amount.")
    }
    abstract fun processPayment(amount: Double)
}

class CreditCard(name: String) : PaymentMethod(name), Refundable {
    override fun processPayment(amount: Double) {
        println("Processing credit card payment of ${"$"}amount.")
    }
    override fun refund(amount: Double) {
        println("Refunding ${"$"}amount to the credit card.")
    }
}

fun main() {
    val visa = CreditCard("Visa")
    visa.authorize(100.0)
    visa.processPayment(100.0)
    visa.refund(50.0)
}`,
      },
      {
        id: "classes-ex4",
        title: "Exercise 4",
        description: "Define SmartMessenger that implements Messenger and delegates to an instance of BasicMessenger (use by). Override sendMessage() to print \"Sending a smart message: $message\" and then call the delegated sendMessage() with \"[smart] $message\". Do not override receiveMessage().",
        starterCode: `interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) { println("Sending message: $message") }
    override fun receiveMessage(): String = "You've got a new message!"
}

class SmartMessenger // Write your code here

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    basicMessenger.sendMessage("Hello!")
    println(smartMessenger.receiveMessage())
    smartMessenger.sendMessage("Hello from SmartMessenger!")
}`,
        testCases: [
          {
            input: "",
            output: "Sending message: Hello!\nYou've got a new message!\nSending a smart message: Hello from SmartMessenger!\nSending message: [smart] Hello from SmartMessenger!",
          },
        ],
        hint: "class SmartMessenger(val basicMessenger: BasicMessenger) : Messenger by basicMessenger { override fun sendMessage(...) { ... } }",
        solution: `interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) { println("Sending message: $message") }
    override fun receiveMessage(): String = "You've got a new message!"
}

class SmartMessenger(val basicMessenger: BasicMessenger) : Messenger by basicMessenger {
    override fun sendMessage(message: String) {
        println("Sending a smart message: $message")
        basicMessenger.sendMessage("[smart] $message")
    }
}

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    basicMessenger.sendMessage("Hello!")
    println(smartMessenger.receiveMessage())
    smartMessenger.sendMessage("Hello from SmartMessenger!")
}`,
      },
    ],
  },
  {
    id: "objects",
    step: 8,
    title: "Objects",
    nextStep: "open-and-special-classes",
    prevStep: "classes-and-interfaces",
    content: [
      "In this chapter, you'll expand your understanding of classes by exploring object declarations. This knowledge will help you efficiently manage behavior across your projects.",
      "In Kotlin, you can use object declarations to declare a class with a single instance. You declare the class and create that single instance at the same time. Such a class is called a singleton. Objects are useful as a single reference point or to coordinate behavior across a system. Objects are lazy (created only when first accessed) and thread-safe.",
      "To create an object declaration, use the object keyword: object DoAuth { }. Objects can't have constructors. They can inherit from classes and interfaces.",
      "Data objects make it easier to print the contents of an object. Like data classes, they get toString() and equals() automatically. They do not get copy() because there is only one instance. Use the data keyword: data object AppConfig { }.",
      "A class can have one companion object. Properties and functions inside it are shared across all instances. Access them via the class name: MyClass.companionMember(). Use companion object Name { } or companion object { } (default name is Companion). The companion is created when the class is first referenced.",
    ],
    codeExamples: [
      {
        code: `object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main() {
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
}`,
        comment: "Object declaration: single instance (singleton), no constructor; access via DoAuth.",
      },
      {
        code: `data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    println(AppConfig.appName)
}`,
        comment: "Data object: toString() and equals() generated; no copy(); single instance.",
      },
      {
        code: `class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
        }
    }
}

fun main() {
    BigBen.getBongs(3)
}`,
        comment: "Companion object: one per class; access members via class name (BigBen.getBongs).",
      },
    ],
    defaultCode: `object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main() {
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
}`,
    practice: [
      {
        id: "objects-ex1",
        title: "Exercise 1",
        description: "Complete the declaration of the second data object (OrderTwo) that implements the Order interface, so that the main() code runs successfully. OrderTwo should have different orderId, customerName, and orderTotal so the two orders are not identical.",
        starterCode: `interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne : Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // Write your code here

fun main() {
    println("Order name: $OrderOne")
    println("Order name: $OrderTwo")
    println("Are the two orders identical? \${OrderOne == OrderTwo}")
    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
    }
    println("Do the orders have the same customer name? \${OrderOne.customerName == OrderTwo.customerName}")
}`,
        testCases: [
          {
            input: "",
            output: "Order name: OrderOne\nOrder name: OrderTwo\nAre the two orders identical? false\nThe orders are unique.\nDo the orders have the same customer name? false",
          },
        ],
        hint: "data object OrderTwo : Order { override val orderId = \"002\"; override val customerName = \"Bob\"; override val orderTotal = 20.0 }",
        solution: `interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne : Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo : Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 20.0
}

fun main() {
    println("Order name: $OrderOne")
    println("Order name: $OrderTwo")
    println("Are the two orders identical? \${OrderOne == OrderTwo}")
    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
    }
    println("Do the orders have the same customer name? \${OrderOne.customerName == OrderTwo.customerName}")
}`,
      },
      {
        id: "objects-ex2",
        title: "Exercise 2",
        description: "Create an object declaration FlyingSkateboard that implements the Vehicle interface. Implement the name property and move() function. Also add a fly() function that returns \"Woooooooo\" so the main() output is correct.",
        starterCode: `interface Vehicle {
    val name: String
    fun move(): String
}

object // Write your code here

fun main() {
    println("${"$"}{FlyingSkateboard.name}: ${"$"}{FlyingSkateboard.move()}")
    println("${"$"}{FlyingSkateboard.name}: ${"$"}{FlyingSkateboard.fly()}")
}`,
        testCases: [
          {
            input: "",
            output: "Flying Skateboard: Glides through the air with a hover engine\nFlying Skateboard: Woooooooo",
          },
        ],
        hint: "object FlyingSkateboard : Vehicle { override val name = \"Flying Skateboard\"; override fun move() = \"Glides through the air with a hover engine\"; fun fly() = \"Woooooooo\" }",
        solution: `interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"
    fun fly() = "Woooooooo"
}

fun main() {
    println("${"$"}{FlyingSkateboard.name}: ${"$"}{FlyingSkateboard.move()}")
    println("${"$"}{FlyingSkateboard.name}: ${"$"}{FlyingSkateboard.fly()}")
}`,
      },
      {
        id: "objects-ex3",
        title: "Exercise 3",
        description: "Complete the Temperature data class with a companion object that provides fromFahrenheit(fahrenheit: Double): Temperature. The Celsius value is (fahrenheit - 32) * 5 / 9.",
        starterCode: `data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // Write your code here
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${"$"}{temp.celsius}°C is $fahrenheit °F")
}`,
        testCases: [
          {
            input: "",
            output: "32.22222222222222°C is 90.0 °F",
          },
        ],
        hint: "companion object { fun fromFahrenheit(f: Double) = Temperature((f - 32) * 5 / 9) }",
        solution: `data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    companion object {
        fun fromFahrenheit(fahrenheit: Double) = Temperature((fahrenheit - 32) * 5 / 9)
    }
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${"$"}{temp.celsius}°C is $fahrenheit °F")
}`,
      },
    ],
  },
  {
    id: "open-and-special-classes",
    step: 9,
    title: "Open and special classes",
    nextStep: "properties",
    prevStep: "objects",
    content: [
      "In this chapter, you'll learn about open classes, how they work with interfaces, and other special types of classes in Kotlin.",
      "By default, Kotlin classes are not inheritable. To allow inheritance, declare the class as open: open class Vehicle(val make: String, val model: String). A child class uses a colon and calls the parent constructor: class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model).",
      "To allow overriding a member function in the parent, mark it open: open fun displayInfo() { }. In the child, use override: override fun displayInfo() { }. For properties, you can override with override val, but it's often better to pass the value via the parent constructor instead.",
      "A class can inherit one class and implement multiple interfaces. Declare the parent class first after the colon, then the interfaces: class ElectricCar(...) : Car(...), EcoFriendly, ElectricVehicle.",
      "Sealed classes restrict inheritance to the same package. Use sealed class Mammal. They work well with when expressions so you can handle all possible subclasses. Child classes are typically data classes or objects.",
      "Enum classes represent a fixed set of values: enum class State { IDLE, RUNNING, FINISHED }. Enum constants can have properties and member functions; separate constants from members with a semicolon.",
      "Inline value classes (@JvmInline value class Email(val address: String)) have a single property and are inlined at compile time, reducing overhead for small wrapper types.",
    ],
    codeExamples: [
      {
        code: `open class Vehicle(val make: String, val model: String) {
    open fun displayInfo() {
        println("Vehicle: $make $model")
    }
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override fun displayInfo() {
        println("Car: $make $model, Doors: $numberOfDoors")
    }
}

fun main() {
    val car = Car("Toyota", "Corolla", 4)
    car.displayInfo()
}`,
        comment: "open class and open fun; child overrides with override fun.",
      },
      {
        code: `sealed class Mammal(val name: String)
class Cat(val catName: String) : Mammal(catName)
class Human(val humanName: String, val job: String) : Mammal(humanName)

fun greetMammal(mammal: Mammal): String = when (mammal) {
    is Human -> "Hello ${"$"}{mammal.name}; You're working as a ${"$"}{mammal.job}"
    is Cat -> "Hello ${"$"}{mammal.name}"
}

fun main() {
    println(greetMammal(Cat("Snowy")))
}`,
        comment: "Sealed class: subclasses only in same package; when exhausts all cases.",
      },
      {
        code: `enum class State { IDLE, RUNNING, FINISHED }

enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF);
    fun containsRed() = (this.rgb and 0xFF0000 != 0)
}

fun main() {
    println(State.RUNNING)
    println(Color.RED.containsRed())
}`,
        comment: "Enum: fixed set of constants; can have properties and member functions (after ;).",
      },
      {
        code: `@JvmInline
value class Email(val address: String)

fun sendEmail(email: Email) {
    println("Sending email to ${"$"}{email.address}")
}

fun main() {
    sendEmail(Email("example@example.com"))
}`,
        comment: "Inline value class: single property in header; inlined at compile time.",
      },
    ],
    defaultCode: `open class Vehicle(val make: String, val model: String) {
    open fun displayInfo() = println("Vehicle: $make $model")
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override fun displayInfo() = println("Car: $make $model, Doors: $numberOfDoors")
}

fun main() {
    Car("Toyota", "Corolla", 4).displayInfo()
}`,
    practice: [
      {
        id: "open-special-ex1",
        title: "Exercise 1",
        description: "Create a sealed class DeliveryStatus with data classes: Pending(sender: String), InTransit(estimatedDeliveryDate: String), Delivered(deliveryDate: String, recipient: String), Canceled(reason: String). Complete the declaration so printDeliveryStatus and main() run successfully.",
        starterCode: `sealed class // Write your code here

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> println("The package is pending pickup from ${"$"}{status.sender}.")
        is DeliveryStatus.InTransit -> println("The package is in transit and expected to arrive by ${"$"}{status.estimatedDeliveryDate}.")
        is DeliveryStatus.Delivered -> println("The package was delivered to ${"$"}{status.recipient} on ${"$"}{status.deliveryDate}.")
        is DeliveryStatus.Canceled -> println("The delivery was canceled due to: ${"$"}{status.reason}.")
    }
}

fun main() {
    printDeliveryStatus(DeliveryStatus.Pending("Alice"))
    printDeliveryStatus(DeliveryStatus.InTransit("2024-11-20"))
    printDeliveryStatus(DeliveryStatus.Delivered("2024-11-18", "Bob"))
    printDeliveryStatus(DeliveryStatus.Canceled("Address not found"))
}`,
        testCases: [
          {
            input: "",
            output: "The package is pending pickup from Alice.\nThe package is in transit and expected to arrive by 2024-11-20.\nThe package was delivered to Bob on 2024-11-18.\nThe delivery was canceled due to: Address not found.",
          },
        ],
        hint: "sealed class DeliveryStatus; data class Pending(val sender: String) : DeliveryStatus(); similar for InTransit, Delivered, Canceled.",
        solution: `sealed class DeliveryStatus {
    data class Pending(val sender: String) : DeliveryStatus()
    data class InTransit(val estimatedDeliveryDate: String) : DeliveryStatus()
    data class Delivered(val deliveryDate: String, val recipient: String) : DeliveryStatus()
    data class Canceled(val reason: String) : DeliveryStatus()
}

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> println("The package is pending pickup from ${"$"}{status.sender}.")
        is DeliveryStatus.InTransit -> println("The package is in transit and expected to arrive by ${"$"}{status.estimatedDeliveryDate}.")
        is DeliveryStatus.Delivered -> println("The package was delivered to ${"$"}{status.recipient} on ${"$"}{status.deliveryDate}.")
        is DeliveryStatus.Canceled -> println("The delivery was canceled due to: ${"$"}{status.reason}.")
    }
}

fun main() {
    printDeliveryStatus(DeliveryStatus.Pending("Alice"))
    printDeliveryStatus(DeliveryStatus.InTransit("2024-11-20"))
    printDeliveryStatus(DeliveryStatus.Delivered("2024-11-18", "Bob"))
    printDeliveryStatus(DeliveryStatus.Canceled("Address not found"))
}`,
      },
      {
        id: "open-special-ex2",
        title: "Exercise 2",
        description: "Complete the sealed class Status by adding an enum class Problem inside the Error data class with values NETWORK, TIMEOUT, and UNKNOWN, so handleStatus and main() run successfully.",
        starterCode: `sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        // Write your code here
    }
    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${"$"}{status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    handleStatus(Status.Error(Status.Error.Problem.NETWORK))
    handleStatus(Status.OK(listOf("Data1", "Data2")))
}`,
        testCases: [
          {
            input: "",
            output: "Network issue\nData received: [Data1, Data2]",
          },
        ],
        hint: "Inside Error class add: enum class Problem { NETWORK, TIMEOUT, UNKNOWN }",
        solution: `sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        enum class Problem {
            NETWORK,
            TIMEOUT,
            UNKNOWN
        }
    }
    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${"$"}{status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    handleStatus(Status.Error(Status.Error.Problem.NETWORK))
    handleStatus(Status.OK(listOf("Data1", "Data2")))
}`,
      },
    ],
  },
  {
    id: "properties",
    step: 10,
    title: "Properties",
    nextStep: "null-safety-patterns",
    prevStep: "open-and-special-classes",
    content: [
      "Properties have default get() and set() (getters and setters) that use a backing field to store the value. A backing field exists when you use the default accessors or reference the property with the field keyword in custom accessors.",
      "In a custom set(value), use field = value instead of name = value to avoid an infinite loop (assigning to name would call set again). Use field when adding logic like validation, logging, or capitalization.",
      "Extension properties add properties to existing types without a backing field: val String.lastChar: Char get() = this[lastIndex]. You must provide get() (and set() for var); they can't hold state.",
      "Delegated properties delegate get/set to another object: val displayName: String by Delegate. The delegate must provide operator fun getValue(thisRef, property) and optionally setValue for var. Useful for caching, storage, or cross-cutting logic.",
      "Lazy: val x by lazy { expensiveComputation() } initializes only on first access; thread-safe by default. Observable: var x by Delegates.observable(initial) { _, old, new -> ... } runs a lambda when the value changes.",
    ],
    codeExamples: [
      {
        code: `class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { it.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
}`,
        comment: "Custom setter uses field to avoid infinite recursion; capitalizes first letter.",
      },
      {
        code: `data class Person(val firstName: String, val lastName: String)

val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person("John", "Doe")
    println(person.fullName)
}`,
        comment: "Extension property: no backing field; get() computes value from receiver.",
      },
      {
        code: `val databaseConnection: String by lazy {
    println("Connecting...")
    "Connected"
}

fun main() {
    println(databaseConnection)
    println(databaseConnection)
}`,
        comment: "lazy: initializer runs only on first access; same value returned afterward.",
      },
      {
        code: `import kotlin.properties.Delegates.observable

class Thermostat {
    var temperature: Double by observable(20.0) { _, old, new ->
        println("$old°C -> $new°C")
    }
}

fun main() {
    val t = Thermostat()
    t.temperature = 22.5
    t.temperature = 25.0
}`,
        comment: "observable(initial) { _, old, new -> ... } runs when property changes.",
      },
    ],
    defaultCode: `class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { it.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
}`,
    practice: [
      {
        id: "properties-ex1",
        title: "Exercise 1",
        description: "Write a function findOutOfStockBooks(inventory: List<Int>) that returns a list of indices where the quantity is 0. Each index represents a book; the value at that index is the stock count.",
        starterCode: `fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // Write your code here
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}`,
        testCases: [
          { input: "", output: "[1, 3]" },
        ],
        hint: "Use indices.filter { inventory[it] == 0 } or mapIndexed and filterNotNull.",
        solution: `fun findOutOfStockBooks(inventory: List<Int>): List<Int> =
    inventory.indices.filter { inventory[it] == 0 }

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
}`,
      },
      {
        id: "properties-ex2",
        title: "Exercise 2",
        description: "Create an extension property for Double called asMiles that converts kilometers to miles. Formula: miles = kilometers * 0.621371.",
        starterCode: `val // Write your code here

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${"$"}{distanceKm.asMiles} miles")
    val marathonDistance = 42.195
    println("$marathonDistance km is ${"$"}{marathonDistance.asMiles} miles")
}`,
        testCases: [
          {
            input: "",
            output: "5.0 km is 3.106855 miles\n42.195 km is 26.218757 miles",
          },
        ],
        hint: "val Double.asMiles: Double get() = this * 0.621371",
        solution: `val Double.asMiles: Double
    get() = this * 0.621371

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${"$"}{distanceKm.asMiles} miles")
    val marathonDistance = 42.195
    println("$marathonDistance km is ${"$"}{marathonDistance.asMiles} miles")
}`,
      },
      {
        id: "properties-ex3",
        title: "Exercise 3",
        description: "Use lazy properties so isAppServerHealthy and isDatabaseHealthy run the expensive checkAppServer() and checkDatabase() only when first accessed. In main(), declare these lazy properties and use them in the when block.",
        starterCode: `fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    // Write your code here

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
}`,
        testCases: [
          {
            input: "",
            output: "Performing application server health check...\nApplication server is online and healthy",
          },
        ],
        hint: "val isAppServerHealthy by lazy { checkAppServer() }; val isDatabaseHealthy by lazy { checkDatabase() }",
        solution: `fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    val isAppServerHealthy by lazy { checkAppServer() }
    val isDatabaseHealthy by lazy { checkDatabase() }

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
}`,
      },
      {
        id: "properties-ex4",
        title: "Exercise 4",
        description: "In the Budget class, create an observable property remainingBudget (initial value totalBudget). When it changes: print a warning if new value is below 20% of totalBudget; print a good-news message if the new value is greater than the old value.",
        starterCode: `import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // Write your code here
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    myBudget.remainingBudget = 50
    myBudget.remainingBudget = 300
}`,
        testCases: [
          {
            input: "",
            output: "Warning: Your remaining budget (150) is below 20% of your total budget.\nWarning: Your remaining budget (50) is below 20% of your total budget.\nGood news: Your remaining budget increased to 300.",
          },
        ],
        hint: "var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue -> ... }",
        solution: `import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue ->
        if (newValue < totalBudget * 0.2) {
            println("Warning: Your remaining budget ($newValue) is below 20% of your total budget.")
        } else if (newValue > oldValue) {
            println("Good news: Your remaining budget increased to $newValue.")
        }
    }
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    myBudget.remainingBudget = 50
    myBudget.remainingBudget = 300
}`,
      },
    ],
  },
  {
    id: "null-safety-patterns",
    step: 11,
    title: "Null safety",
    nextStep: "libraries-and-apis",
    prevStep: "properties",
    content: [
      "This chapter covers common use cases for null safety and how to make the most of them.",
      "Casting: when Kotlin treats a value as a specific type, that's casting. Smart casting happens automatically after type checks. Use is and !is to check types: is returns true if the object has the type; !is returns true if it doesn't. Use with when or if.",
      "Unsafe cast: as throws if the cast fails. Safe cast: as? returns null on failure instead of throwing. Combine as? with ?. and ?: for concise null-safe code: (it as? String)?.length ?: 0.",
      "Collections and null: filterNotNull() removes nulls from a list; listOfNotNull(...) builds a list without nulls. maxOrNull(), minOrNull(), singleOrNull(predicate), firstNotNullOfOrNull { }, reduceOrNull { } return null when no value or empty.",
      "Early returns: use the Elvis operator with return for preconditions: val user = users[id] ?: return -1. This keeps code flat and fails fast when a value is null or invalid.",
    ],
    codeExamples: [
      {
        code: `fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("It's an Integer with value $obj")
        !is Double -> println("It's NOT a Double")
        else -> println("Unknown type")
    }
}

fun main() {
    printObjectType(42)
    printObjectType(listOf(1, 2, 3))
    printObjectType(3.14)
}`,
        comment: "is and !is for type checks; smart cast narrows type in each branch.",
      },
      {
        code: `fun calculateTotalStringLength(items: List<Any>): Int =
    items.sumOf { (it as? String)?.length ?: 0 }

fun main() {
    println(calculateTotalStringLength(listOf("ab", 1, "cd", null)))
}`,
        comment: "as? safe cast; ?. safe call; ?: Elvis for default; sumOf for total.",
      },
      {
        code: `val emails: List<String?> = listOf("alice@example.com", null, "bob@example.com")
val validEmails = emails.filterNotNull()

fun main() {
    println(validEmails)
    println(listOf(15, 18, 21).maxOrNull())
    println(emptyList<Int>().reduceOrNull { a, b -> a + b })
}`,
        comment: "filterNotNull(); maxOrNull(); reduceOrNull() for empty-safe reduce.",
      },
      {
        code: `fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    val user = users[userId] ?: return -1
    return user.friends.size
}

data class User(val id: Int, val name: String, val friends: List<Int>)

fun main() {
    val users = mapOf(1 to User(1, "Alice", listOf(2, 3)))
    println(getNumberOfFriends(users, 1))
    println(getNumberOfFriends(users, 99))
}`,
        comment: "Elvis with return: users[id] ?: return -1 for early exit when null.",
      },
    ],
    defaultCode: `fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("Int: $obj")
        is String -> println("String: $obj")
        else -> println("Other")
    }
}

fun main() {
    printObjectType(42)
    printObjectType("hello")
}`,
    practice: [
      {
        id: "null-safety-ex1",
        title: "Exercise 1",
        description: "Complete getNotificationPreferences(): use as? to cast user to User (return emptyList() if not); use ?: so userName defaults to \"Guest\" when name is null; use listOfNotNull with takeIf to include email/SMS messages only when enabled.",
        starterCode: `data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = // Write your code here
    val userName = // Write your code here

    return listOfNotNull( /* Write your code here */)
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
}`,
        testCases: [
          {
            input: "",
            output: "[Email Notifications enabled for Alice]\n[SMS Notifications enabled for Guest]\n[]",
          },
        ],
        hint: "validUser = user as? User ?: return emptyList(); userName = validUser.name ?: \"Guest\"; listOfNotNull(\"...\".takeIf { emailEnabled }, \"...\".takeIf { smsEnabled })",
        solution: `data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = user as? User ?: return emptyList()
    val userName = validUser.name ?: "Guest"

    return listOfNotNull(
        "Email Notifications enabled for $userName".takeIf { emailEnabled },
        "SMS Notifications enabled for $userName".takeIf { smsEnabled }
    )
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
}`,
      },
      {
        id: "null-safety-ex2",
        title: "Exercise 2",
        description: "Complete getActiveSubscription() so it uses singleOrNull() with a predicate to return the one active subscription, or null if none or more than one are active.",
        starterCode: `data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // Write your code here

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )
    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )
    println(getActiveSubscription(userWithPremiumPlan))
    println(getActiveSubscription(userWithConflictingPlans))
}`,
        testCases: [
          {
            input: "",
            output: "Subscription(name=Premium Plan, isActive=true)\nnull",
          },
        ],
        hint: "return subscriptions.singleOrNull { it.isActive }",
        solution: `data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? =
    subscriptions.singleOrNull { it.isActive }

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )
    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )
    println(getActiveSubscription(userWithPremiumPlan))
    println(getActiveSubscription(userWithConflictingPlans))
}`,
      },
      {
        id: "null-safety-ex3",
        title: "Exercise 3",
        description: "Complete getActiveUsernames() so that mapNotNull() returns the username when the user is active, or null when not (mapNotNull drops nulls). Use takeIf or an if expression.",
        starterCode: `data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* Write your code here */ }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )
    println(getActiveUsernames(allUsers))
}`,
        testCases: [
          {
            input: "",
            output: "[alice123, charlie99]",
          },
        ],
        hint: "mapNotNull { user -> user.username.takeIf { user.isActive } } or if (user.isActive) user.username else null",
        solution: `data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> =
    users.mapNotNull { user -> user.username.takeIf { user.isActive } }

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )
    println(getActiveUsernames(allUsers))
}`,
      },
      {
        id: "null-safety-ex4",
        title: "Exercise 4",
        description: "Complete validateStock(requested, available): use early returns with the Elvis operator for null checks (requested ?: return -1, available ?: return -1); then return -1 if requested is negative or if requested > available; otherwise return requested.",
        starterCode: `fun validateStock(requested: Int?, available: Int?): Int {
    // Write your code here
}

fun main() {
    println(validateStock(5, 10))
    println(validateStock(null, 10))
    println(validateStock(-2, 10))
}`,
        testCases: [
          {
            input: "",
            output: "5\n-1\n-1",
          },
        ],
        hint: "val validRequested = requested ?: return -1; val validAvailable = available ?: return -1; then if (validRequested < 0) return -1; if (validRequested > validAvailable) return -1; return validRequested",
        solution: `fun validateStock(requested: Int?, available: Int?): Int {
    val validRequested = requested ?: return -1
    val validAvailable = available ?: return -1

    if (validRequested < 0) return -1
    if (validRequested > validAvailable) return -1

    return validRequested
}

fun main() {
    println(validateStock(5, 10))
    println(validateStock(null, 10))
    println(validateStock(-2, 10))
}`,
      },
    ],
  },
  {
    id: "libraries-and-apis",
    step: 12,
    title: "Libraries and APIs",
    nextStep: "coroutines-basics",
    prevStep: "null-safety-patterns",
    content: [
      "Use existing libraries and APIs so you can spend more time coding and less time reinventing the wheel. Libraries distribute reusable code; they expose APIs (functions, classes, properties) you can use in your code.",
      "The Kotlin standard library provides essential types, functions, collections, and utilities. Much of it (the kotlin package) is available without explicit imports. Other parts require import: e.g. import kotlin.time.* or import kotlin.math.pow.",
      "Search before you build: the standard library already covers collections, sequences, string manipulation, and time management. Check the API reference for what exists.",
      "Beyond the standard library, the Kotlin community provides many libraries (e.g. kotlinx-datetime for cross-platform time). Add them as dependencies and import their packages.",
      "Some APIs require opt-in when they are experimental and may change. Use @OptIn(ExperimentalApiName::class) before the function or file that uses them to acknowledge the risk.",
    ],
    codeExamples: [
      {
        code: `fun main() {
    val text = "emosewa si niltoK"
    val reversedText = text.reversed()
    print(reversedText)
}`,
        comment: "Standard library: reversed(), print() from kotlin package are available without import.",
      },
      {
        code: `import kotlin.math.pow

fun main() {
    val x = 2.0
    println(x.pow(3))
}`,
        comment: "Import kotlin.math.pow (or kotlin.math.*) for math functions.",
      },
      {
        code: `import kotlin.time.measureTime

fun main() {
    val duration = measureTime {
        repeat(100) { }
    }
    println("Took: $duration")
}`,
        comment: "kotlin.time.measureTime { } returns Duration for how long the block took.",
      },
      {
        code: `@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    val arr = uintArrayOf(1u, 2u, 3u)
    println(arr.joinToString())
}`,
        comment: "Opt-in: @OptIn(ExperimentalApiName::class) before using experimental APIs.",
      },
    ],
    defaultCode: `import kotlin.math.pow

fun main() {
    val text = "hello"
    println(text.reversed())
    println(2.0.pow(10))
}`,
    practice: [
      {
        id: "libraries-ex1",
        title: "Exercise 1",
        description: "Import the necessary function from kotlin.math and implement calculateCompoundInterest(P, r, n, t). Formula: A = P * (1 + r/n)^(n*t). Use pow(base, exponent) for the power.",
        starterCode: `// Write your code here

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    // Write your code here
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
}`,
        testCases: [
          {
            input: "",
            output: "The accumulated amount is: 1282.0372317085844",
          },
        ],
        hint: "import kotlin.math.pow; return P * pow(1 + r / n, (n * t).toDouble())",
        solution: `import kotlin.math.pow

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    return P * pow(1 + r / n, (n * t).toDouble())
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
}`,
      },
      {
        id: "libraries-ex2",
        title: "Exercise 2",
        description: "Add the correct import from kotlin.time and use measureTime { } to measure how long the data processing block takes. Assign the result to timeTaken.",
        starterCode: `// Write your code here

fun main() {
    val timeTaken = /* Write your code here */ {
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }
    println("Time taken: $timeTaken")
}`,
        testCases: [
          {
            input: "",
            output: "Processed data\nTime taken:",
          },
        ],
        hint: "import kotlin.time.measureTime; val timeTaken = measureTime { ... }",
        solution: `import kotlin.time.measureTime

fun main() {
    val timeTaken = measureTime {
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }
    println("Time taken: $timeTaken")
}`,
      },
      {
        id: "libraries-ex3",
        title: "Exercise 3",
        description: "A new standard library feature you want to use requires opt-in. It is categorized under @ExperimentalStdlibApi. Add the correct @OptIn annotation so the code is allowed to use it.",
        starterCode: `// Add the opt-in annotation for ExperimentalStdlibApi

fun main() {
    println("Using experimental API with opt-in")
}`,
        testCases: [
          {
            input: "",
            output: "Using experimental API with opt-in",
          },
        ],
        hint: "@OptIn(ExperimentalStdlibApi::class) before the function or at the top of the file",
        solution: `@OptIn(ExperimentalStdlibApi::class)
fun main() {
    println("Using experimental API with opt-in")
}`,
      },
    ],
  },
  {
    id: "coroutines-basics",
    step: 13,
    title: "Coroutines basics",
    nextStep: "coroutines-and-channels",
    prevStep: "libraries-and-apis",
    content: [
      "Kotlin provides only minimal low-level APIs in its standard library to enable other libraries to utilize coroutines. Unlike many other languages with similar capabilities, async and await are not keywords in Kotlin and are not even part of its standard library. Moreover, Kotlin's concept of suspending function provides a safer and less error-prone abstraction for asynchronous operations than futures and promises.",
      "kotlinx.coroutines is a rich library for coroutines developed by JetBrains. It contains a number of high-level coroutine-enabled primitives that this guide covers, including launch, async, and others. This is a guide about the core features of kotlinx.coroutines with a series of examples.",
      "In order to use coroutines as well as follow the examples in this guide, you need to add a dependency on the kotlinx-coroutines-core module (e.g. in build.gradle.kts: implementation(\"org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2\")).",
      "Coroutines basics — To create applications that perform multiple tasks at once, a concept known as concurrency, Kotlin uses coroutines. A coroutine is a suspendable computation that lets you write concurrent code in a clear, sequential style. Coroutines can run concurrently with other coroutines and potentially in parallel.",
      "On the JVM and in Kotlin/Native, all concurrent code, such as coroutines, runs on threads, managed by the operating system. Coroutines can suspend their execution instead of blocking a thread. This allows one coroutine to suspend while waiting for some data to arrive and another coroutine to run on the same thread, ensuring effective resource utilization.",
      "Comparing parallel and concurrent threads — For more information about the differences between coroutines and threads, see Comparing coroutines and JVM threads.",
      { type: "image", src: "/images/portfolio/couroutinesBasic/parallelism-and-concurrency.svg", alt: "Diagram: Parallel (multiple threads, one task each), Concurrent (one thread, multiple tasks interleaved), Parallel and Concurrent (multiple threads with interleaved tasks)." },
      "Suspending functions — The most basic building block of coroutines is the suspending function. It allows a running operation to pause and resume later without affecting the structure of your code. To declare a suspending function, use the suspend keyword. You can only call a suspending function from another suspending function. To call suspending functions at the entry point of a Kotlin application, mark the main() function with the suspend keyword.",
      "While the suspend keyword is part of the core Kotlin language, most coroutine features are available through the kotlinx.coroutines library.",
      "Create your first coroutines — To create a coroutine in Kotlin, you need: (1) A suspending function. (2) A coroutine scope in which it can run, for example inside the withContext() function. (3) A coroutine builder like CoroutineScope.launch() to start it. (4) A dispatcher to control which threads it uses.",
      "While you can mark the main() function as suspend in some projects, it may not be possible when integrating with existing code or using a framework. In that case, check the framework's documentation to see if it supports calling suspending functions. If not, use runBlocking() to call them by blocking the current thread.",
      "Add the delay() function to simulate a suspending task, such as fetching data or writing to a database. Use withContext(Dispatchers.Default) to define an entry point for multithreaded concurrent code that runs on a shared thread pool. Use a coroutine builder function like CoroutineScope.launch() to start the coroutine.",
      "Coroutine scope and structured concurrency — When you run many coroutines in an application, you need a way to manage them as groups. Kotlin coroutines rely on a principle called structured concurrency. According to this principle, coroutines form a tree hierarchy of parent and child tasks with linked lifecycles. A parent coroutine waits for its children to complete before it finishes. If the parent coroutine fails or gets canceled, all its child coroutines are recursively canceled too.",
      "To maintain structured concurrency, new coroutines can only be launched in a CoroutineScope that defines and manages their lifecycle. To create a new coroutine scope with the current coroutine context, use the coroutineScope() function. To extract coroutine builders into another function, that function must declare a CoroutineScope receiver.",
      "Coroutine builder functions — A coroutine builder function is a function that accepts a suspend lambda that defines a coroutine to run. Examples: CoroutineScope.launch(), CoroutineScope.async(), runBlocking(), withContext(), coroutineScope(). CoroutineScope.launch() starts a new coroutine without blocking the rest of the scope. CoroutineScope.async() starts a concurrent computation and returns a Deferred handle; use .await() to get the result. Use runBlocking() only when there is no other option to call suspending code from non-suspending code.",
      "Coroutine dispatchers — A coroutine dispatcher controls which thread or thread pool coroutines use for their execution. Coroutines aren't always tied to a single thread; they can pause on one thread and resume on another. You don't have to specify a dispatcher for every coroutine: by default, coroutines inherit the dispatcher from their parent scope. You can specify a dispatcher to run a coroutine in a different context. If the coroutine context doesn't include a dispatcher, coroutine builders use Dispatchers.Default. Dispatchers.Default runs coroutines on a shared pool of threads, ideal for CPU-intensive operations.",
      "Comparing coroutines and JVM threads — While coroutines are suspendable computations that run code concurrently like threads on the JVM, they work differently. A thread is managed by the OS; creating many threads is resource-intensive. A coroutine isn't bound to a specific thread; many coroutines can share the same thread pool. When a coroutine suspends, the thread isn't blocked. This makes coroutines much lighter — you can run millions of them in one process.",
      { type: "image", src: "/images/portfolio/couroutinesBasic/coroutines-and-threads.svg", alt: "Comparing coroutines and JVM threads: threads vs coroutines on shared thread pool." },
      "What's next — Discover more about combining suspending functions in Composing suspending functions. Learn how to cancel coroutines and handle timeouts in Cancellation and timeouts. Dive deeper into execution in Coroutine context and dispatchers. Learn how to return multiple asynchronously computed values in Asynchronous flows.",
    ],
    codeExamples: [
      {
        code: `suspend fun main() {
    showUserInfo()
}

suspend fun showUserInfo() {
    println("Loading user...")
    greet()
    println("User: John Smith")
}

suspend fun greet() {
    println("Hello world from a suspending function")
}`,
        comment: "suspend keyword; suspend fun main() as entry point.",
      },
      {
        code: `// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
}`,
        comment: "Add kotlinx-coroutines-core dependency.",
      },
      {
        code: `import kotlinx.coroutines.*

suspend fun greet() {
    println("The greet() on the thread: \${Thread.currentThread().name}")
    delay(1000L)
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        this.launch { greet() }
        println("The withContext() on the thread: \${Thread.currentThread().name}")
    }
}`,
        comment: "withContext(Dispatchers.Default) + launch { greet() }.",
      },
      {
        code: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.seconds

suspend fun greet() {
    println("The greet() on the thread: \${Thread.currentThread().name}")
    delay(1.seconds)
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        this.launch() { greet() }
        this.launch() {
            println("The CoroutineScope.launch() on the thread: \${Thread.currentThread().name}")
            delay(1.seconds)
        }
        println("The withContext() on the thread: \${Thread.currentThread().name}")
    }
}`,
        comment: "Multiple coroutines on a shared thread pool; output order may vary.",
      },
      {
        code: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.seconds

suspend fun main() {
    coroutineScope {
        this.launch {
            this.launch {
                delay(2.seconds)
                println("Child of the enclosing coroutine completed")
            }
            println("Child coroutine 1 completed")
        }
        this.launch {
            delay(1.seconds)
            println("Child coroutine 2 completed")
        }
    }
    println("Coroutine scope completed")
}`,
        comment: "coroutineScope() creates a root scope; children complete before scope completes.",
      },
      {
        code: `suspend fun main() {
    coroutineScope {
        this.launch { println("1") }
        this.launch { println("2") }
    }
}

fun CoroutineScope.launchAll() {
    this.launch { println("1") }
    this.launch { println("2") }
}`,
        comment: "Extract builders into a function with CoroutineScope receiver.",
      },
      {
        code: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun performBackgroundWork() = coroutineScope {
    this.launch {
        delay(100.milliseconds)
        println("Sending notification in background")
    }
    println("Scope continues")
}`,
        comment: "CoroutineScope.launch() runs without blocking the scope.",
      },
      {
        code: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun main() = withContext(Dispatchers.Default) {
    val firstPage = this.async {
        delay(50.milliseconds)
        "First page"
    }
    val secondPage = this.async {
        delay(100.milliseconds)
        "Second page"
    }
    val pagesAreEqual = firstPage.await() == secondPage.await()
    println("Pages are equal: $pagesAreEqual")
}`,
        comment: "CoroutineScope.async() returns Deferred; use .await() for the result.",
      },
      {
        code: `import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.*

interface Repository { fun readItem(): Int }

object MyRepository : Repository {
    override fun readItem(): Int {
        return runBlocking { myReadItem() }
    }
}

suspend fun myReadItem(): Int {
    delay(100.milliseconds)
    return 4
}`,
        comment: "runBlocking() bridges non-suspending code to suspending; use only when necessary.",
      },
      {
        code: `suspend fun runWithDispatcher() = coroutineScope {
    this.launch(Dispatchers.Default) {
        println("Running on \${Thread.currentThread().name}")
    }
}`,
        comment: "Pass Dispatchers.Default to launch() to specify the dispatcher.",
      },
      {
        code: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.seconds

suspend fun printPeriods() = coroutineScope {
    repeat(50_000) {
        this.launch {
            delay(5.seconds)
            print(".")
        }
    }
}`,
        comment: "50,000 coroutines each wait 5 seconds; lightweight compared to threads.",
      },
      {
        code: `import kotlin.concurrent.thread

fun main() {
    repeat(50_000) {
        thread {
            Thread.sleep(5000L)
            print(".")
        }
    }
}`,
        comment: "50,000 threads use much more memory than the same number of coroutines.",
      },
    ],
    defaultCode: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.seconds

suspend fun greet() {
    println("The greet() on the thread: \${Thread.currentThread().name}")
    delay(1.seconds)
}

suspend fun main() {
    withContext(Dispatchers.Default) {
        this.launch() { greet() }
        this.launch() {
            println("CoroutineScope.launch() on thread: \${Thread.currentThread().name}")
            delay(1.seconds)
        }
        println("withContext() on thread: \${Thread.currentThread().name}")
    }
}`,
  },
  {
    id: "coroutines-and-channels",
    step: 14,
    title: "Coroutines and channels − tutorial",
    nextStep: "cancellation-and-timeouts",
    prevStep: "coroutines-basics",
    content: [
      "In this tutorial you'll learn how to use coroutines in IntelliJ IDEA to perform network requests without blocking the underlying thread or callbacks. No prior knowledge of coroutines is required, but you're expected to be familiar with basic Kotlin syntax. You'll learn: why and how to use suspending functions to perform network requests; how to send requests concurrently using coroutines; and how to share information between different coroutines using channels. For network requests you'll need Retrofit, but the approach works similarly for any library that supports coroutines. You can find solutions for all tasks on the solutions branch of the project's repository.",
      "Before you start: Download and install the latest IntelliJ IDEA, then clone the project template (intro-coroutines). Generate a GitHub token to use the GitHub API: specify a name (e.g. coroutines-tutorial), do not select any scopes, click Generate token, and copy it.",
      { type: "image", src: "/images/portfolio/channels/github-token-settings.png", alt: "Generate a new GitHub token" },
      "Run the code: The program loads contributors for all repositories under the given organization (e.g. kotlin). Open src/contributors/main.kt and run main(). Provide your GitHub username and token, select BLOCKING in the Variant dropdown, then click Load contributors. The UI freezes until loading finishes. Open the program output to see the list of contributors. You'll compare blocking requests, callbacks, coroutines, and channels.",
      { type: "image", src: "/images/portfolio/channels/initial-window.png", alt: "First window" },
      "Blocking requests — You use Retrofit to perform HTTP requests to GitHub: get org repos and get repo contributors. loadContributorsBlocking() fetches repos, then for each repo requests contributors and merges them. getOrgReposCall() and getRepoContributorsCall() return Call; no request is sent until .execute() is invoked. execute() is synchronous and blocks the thread. When you get the response, log it with logRepos()/logUsers(); then get the body or use an empty list on error. An extension bodyList() returns body() ?: emptyList().",
      "All results are logged from the main thread. With BLOCKING selected the window freezes until loading finishes because the main UI thread is blocked.",
      { type: "image", src: "/images/portfolio/channels/blocking.png", alt: "The blocked main thread" },
      "Task 1 — Implement aggregate(): combine users so each contributor appears once; User.contributions should be the total across all projects; sort the list by contributions descending. Use groupBy { it.login }, then for each group create User(login, group.sumOf { it.contributions }), then sortedByDescending { it.contributions }. Alternatively use groupingBy().",
      { type: "image", src: "/images/portfolio/channels/aggregate.png", alt: "The list for the kotlin organization" },
      "Callbacks — To avoid blocking the thread, use callbacks. Move the whole computation to a background thread with thread { loadContributorsBlocking(...) }. The main thread stays free. Change the function signature to take an updateResults callback and call it when loading completes. Use SwingUtilities.invokeLater { updateResults(users, startTime) } so the UI update runs on the main thread. Task 2: Fix loadContributorsBackground() so the resulting list is shown in the UI — call updateResults(loadContributorsBlocking(service, req)) inside the thread block.",
      { type: "image", src: "/images/portfolio/channels/freed-main-thread.png", alt: "The freed main thread" },
      "Use the Retrofit callback API — Start each repo's request with Call.enqueue(callback) so requests run concurrently. The callback handles each response. However, updateResults() must not be called until all callbacks have run. A naive fix (calling updateResults when index == lastIndex) fails because the last repo's response might not be the last to arrive. Fix by tracking how many repos have been processed (e.g. AtomicInteger) or using CountDownLatch(repos.size), countDown() in each callback, await(), then updateResults().",
      { type: "image", src: "/images/portfolio/channels/callbacks.png", alt: "Using callback API" },
      "Suspending functions — Define the API as suspend functions that return Response directly (e.g. suspend fun getOrgRepos(org): Response<List<Repo>>). The thread isn't blocked; the coroutine suspends. Copy loadContributorsBlocking into loadContributorsSuspend and replace .getOrgReposCall(req.org).execute() with .getOrgRepos(req.org) (and similarly for contributors). Use .also { logRepos(req, it) }.bodyList(). Task 4: Implement loadContributorsSuspend() using the new suspend API; the UI stays responsive.",
      "Coroutines — loadContributorsSuspend() is called inside launch { }. launch starts a new coroutine: a suspendable computation. When performing network requests the coroutine suspends and releases the thread; when the response arrives it resumes. So block → suspend, thread → coroutine.",
      { type: "image", src: "/images/portfolio/channels/suspension-process.gif", alt: "Suspending coroutines" },
      { type: "image", src: "/images/portfolio/channels/suspend-requests.png", alt: "Suspending request" },
      "Concurrency — Use async to start concurrent work. async returns Deferred; use .await() to get the result. Unlike launch, async is used when you need a result. Wrap each contributors request in async; then deferreds.awaitAll().flatten().aggregate(). Total time is similar to the callbacks version but without callbacks. Specify async(Dispatchers.Default) { } to run on a shared thread pool. Task 5: Implement loadContributorsConcurrent() using loadContributorsSuspend() and async per repo.",
      { type: "image", src: "/images/portfolio/channels/concurrency.png", alt: "Concurrent coroutines" },
      "Structured concurrency — CoroutineScope defines structure; new coroutines are started inside a scope. launch, async, and runBlocking create a scope; the lambda receiver is CoroutineScope. Nested coroutines are children of the outer one. With structured concurrency, canceling the parent cancels all children; the scope waits for all children. Use coroutineScope { } inside a suspend function to start structured child coroutines. Avoid GlobalScope; use the caller's scope so cancellation and context (e.g. Dispatchers.Default) are inherited.",
      "Showing progress — To show intermediate results as each repo is loaded, pass a callback updateResults(users, completed). Implement loadContributorsProgress() by iterating repos sequentially, loading contributors for each, aggregating into allUsers, and calling updateResults(allUsers, index == repos.lastIndex). Task 6: Implement this without concurrency first. To add concurrency and still show progress, use channels.",
      { type: "image", src: "/images/portfolio/channels/progress.png", alt: "Progress on requests" },
      { type: "image", src: "/images/portfolio/channels/progress-and-concurrency.png", alt: "Concurrent requests with progress" },
      "Channels — Coroutines can share information by communication: one sends to a channel, another receives. A producer sends; a consumer receives. Multiple producers/consumers can use the same channel; each element is received by one consumer. Channel can suspend send() and receive() when full or empty. Interfaces: SendChannel (send, close), ReceiveChannel (receive), Channel extends both. Types: unlimited (queue-like; send never suspends); buffered (fixed size; send suspends when full); rendezvous (buffer 0; send/receive meet); conflated (latest only; send never suspends). Create with Channel<String>(), Channel<String>(10), Channel<String>(CONFLATED), Channel<String>(UNLIMITED).",
      { type: "image", src: "/images/portfolio/channels/using-channel.png", alt: "Using channels" },
      { type: "image", src: "/images/portfolio/channels/using-channel-many-coroutines.png", alt: "Using channels with many coroutines" },
      { type: "image", src: "/images/portfolio/channels/unlimited-channel.png", alt: "Unlimited channel" },
      { type: "image", src: "/images/portfolio/channels/buffered-channel.png", alt: "Buffered channel" },
      { type: "image", src: "/images/portfolio/channels/rendezvous-channel.png", alt: "Rendezvous channel" },
      "Task 7 — Implement loadContributorsChannels(): create a Channel<List<User>>(), for each repo launch { load contributors then channel.send(users) }, then repeat(repos.size) { val users = channel.receive(); allUsers = (allUsers + users).aggregate(); updateResults(allUsers, it == repos.lastIndex) }. Results appear as soon as each repo is ready. Testing: Use virtual time with TestDispatcher (runTest, currentTime) so tests run fast and you can assert timing; refactor tests to use runTest and currentTime instead of runBlocking and System.currentTimeMillis().",
    ],
    codeExamples: [
      {
        code: `fun loadContributorsBlocking(service: GitHubService, req: RequestData): List<User> {
    val repos = service.getOrgReposCall(req.org).execute().also { logRepos(req, it) }.bodyList()
    return repos.flatMap { repo ->
        service.getRepoContributorsCall(req.org, repo.name).execute().also { logUsers(repo, it) }.bodyList()
    }.aggregate()
}`,
        comment: "Blocking: execute() blocks the thread; all on main thread.",
      },
      {
        code: `fun List<User>.aggregate(): List<User> =
    groupBy { it.login }
        .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
        .sortedByDescending { it.contributions }`,
        comment: "Task 1: aggregate users by login, sum contributions, sort descending.",
      },
      {
        code: `thread {
    updateResults(loadContributorsBlocking(service, req))
}
// Caller: loadContributorsBackground(service, req) { users -> SwingUtilities.invokeLater { updateResults(users, startTime) } }`,
        comment: "Background thread + callback; updateResults on main thread with invokeLater.",
      },
      {
        code: `interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(@Path("org") org: String): Response<List<Repo>>
    @GET("repos/{owner}/{repo}/contributors?per_page=100")
    suspend fun getRepoContributors(@Path("owner") owner: String, @Path("repo") repo: String): Response<List<User>>
}`,
        comment: "Suspend API: returns Response directly; thread not blocked.",
      },
      {
        code: `suspend fun loadContributorsSuspend(service: GitHubService, req: RequestData): List<User> {
    val repos = service.getOrgRepos(req.org).also { logRepos(req, it) }.bodyList()
    return repos.flatMap { repo ->
        service.getRepoContributors(req.org, repo.name).also { logUsers(repo, it) }.bodyList()
    }.aggregate()
}`,
        comment: "Suspend version: same structure as blocking, but suspends instead of blocking.",
      },
      {
        code: `launch {
    val users = loadContributorsSuspend(service, req)
    updateResults(users, startTime)
}`,
        comment: "launch starts a coroutine; loadContributorsSuspend runs inside it.",
      },
      {
        code: `fun main() = runBlocking {
    val deferred: Deferred<Int> = async { loadData() }
    println("waiting...")
    println(deferred.await())
}
suspend fun loadData(): Int { delay(1000L); return 42 }`,
        comment: "async returns Deferred; await() suspends until result is ready.",
      },
      {
        code: `suspend fun loadContributorsConcurrent(service: GitHubService, req: RequestData): List<User> = coroutineScope {
    val repos = service.getOrgRepos(req.org).also { logRepos(req, it) }.bodyList()
    val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
        async { service.getRepoContributors(req.org, repo.name).also { logUsers(repo, it) }.bodyList() }
    }
    deferreds.awaitAll().flatten().aggregate()
}`,
        comment: "Concurrent: one async per repo; awaitAll() then flatten and aggregate.",
      },
      {
        code: `suspend fun loadContributorsProgress(
    service: GitHubService, req: RequestData,
    updateResults: suspend (List<User>, Boolean) -> Unit
) {
    val repos = service.getOrgRepos(req.org).also { logRepos(req, it) }.bodyList()
    var allUsers = emptyList<User>()
    for ((index, repo) in repos.withIndex()) {
        val users = service.getRepoContributors(req.org, repo.name).also { logUsers(repo, it) }.bodyList()
        allUsers = (allUsers + users).aggregate()
        updateResults(allUsers, index == repos.lastIndex)
    }
}`,
        comment: "Progress: update UI after each repo; completed true on last.",
      },
      {
        code: `val channel = Channel<String>()
launch { channel.send("A1"); channel.send("A2") }
launch { channel.send("B1") }
launch { repeat(3) { println(channel.receive()) } }`,
        comment: "Rendezvous channel: send/receive suspend until the other is called.",
      },
      {
        code: `suspend fun loadContributorsChannels(
    service: GitHubService, req: RequestData,
    updateResults: suspend (List<User>, Boolean) -> Unit
) = coroutineScope {
    val repos = service.getOrgRepos(req.org).also { logRepos(req, it) }.bodyList()
    val channel = Channel<List<User>>()
    for (repo in repos) {
        launch {
            val users = service.getRepoContributors(req.org, repo.name).also { logUsers(repo, it) }.bodyList()
            channel.send(users)
        }
    }
    var allUsers = emptyList<User>()
    repeat(repos.size) {
        val users = channel.receive()
        allUsers = (allUsers + users).aggregate()
        updateResults(allUsers, it == repos.lastIndex)
    }
}`,
        comment: "Channels: producers send per-repo lists; consumer receives and aggregates.",
      },
    ],
    defaultCode: `import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel

fun main() = runBlocking {
    val channel = Channel<String>()
    launch {
        channel.send("A1")
        channel.send("A2")
        println("A done")
    }
    launch {
        channel.send("B1")
        println("B done")
    }
    launch {
        repeat(3) { println(channel.receive()) }
    }
}`,
  },
  {
    id: "cancellation-and-timeouts",
    step: 15,
    title: "Cancellation and timeouts",
    nextStep: "composing-suspending-functions",
    prevStep: "coroutines-and-channels",
    content: [
      "Cancellation lets you stop a coroutine before it completes. It stops work that's no longer needed, such as when a user closes a window or navigates away in a user interface while a coroutine is still running. You can also use it to release resources early and to stop a coroutine from accessing objects past their disposal.",
      "You can use cancellation to stop long-running coroutines that keep producing values even after other coroutines no longer need them, for example, in pipelines.",
      "Cancellation works through the Job handle, which represents the lifecycle of a coroutine and its parent-child relationships. Job allows you to check whether the coroutine is active and allows you to cancel it, along with its children, as defined by structured concurrency.",
      "Cancel coroutines: A coroutine is canceled when the cancel() function is invoked on its Job handle. Coroutine builder functions such as .launch() return a Job. The .async() function returns a Deferred, which implements Job and supports the same cancellation behavior. You can call cancel() manually, or it can be invoked automatically through cancellation propagation when a parent coroutine is canceled. When a coroutine is canceled, it throws a CancellationException the next time it checks for cancellation. You can use awaitCancellation() to suspend a coroutine until it's canceled.",
      "Catching CancellationException can break the cancellation propagation. If you must catch it, rethrow it to let the cancellation propagate correctly through the coroutine hierarchy.",
      "Cancellation propagation: Structured concurrency ensures that canceling a coroutine also cancels all of its children. This prevents child coroutines from working after the parent has already stopped.",
      "Make coroutines react to cancellation: In Kotlin, coroutine cancellation is cooperative. Coroutines only react to cancellation when they cooperate by suspending or checking for cancellation explicitly.",
      "Suspension points and cancellation: When a coroutine is canceled, it continues running until it reaches a suspension point. If the coroutine suspends there, the suspending function checks whether it has been canceled. If it has, the coroutine stops and throws CancellationException. A call to a suspend function is a suspension point, but it doesn't always suspend. All suspending functions in the kotlinx.coroutines library cooperate with cancellation because they use suspendCancellableCoroutine() internally. Custom suspending functions that use suspendCoroutine() don't react to cancellation.",
      "Check for cancellation explicitly: If a coroutine doesn't suspend for a long time, it doesn't stop when canceled unless it explicitly checks. Use isActive (false when canceled), ensureActive() (throws CancellationException if canceled), or yield() (suspends and checks for cancellation).",
      "Interrupt blocking code: On the JVM, blocking functions like Thread.sleep() or BlockingQueue.take() can be interrupted. Use runInterruptible() so that canceling a coroutine interrupts the thread.",
      "Handle values safely when canceling: When a suspended coroutine is canceled, it resumes with a CancellationException instead of returning values (prompt cancellation). Keep cleanup logic in a place that's guaranteed to run even when the coroutine is canceled (e.g. finally block for closing resources).",
      "Run non-cancelable blocks: Use withContext(NonCancellable) to prevent cancellation from affecting certain parts of a coroutine (e.g. closing resources with a suspending close()). Avoid using NonCancellable with .launch() or .async() as it breaks structured concurrency.",
      "Timeout: Use withTimeoutOrNull(Duration) to automatically cancel a coroutine after a specified duration. If the timeout is exceeded, withTimeoutOrNull() returns null.",
    ],
    codeExamples: [
      {
        code: `suspend fun main() {
    withContext(Dispatchers.Default) {
        val job1Started = CompletableDeferred<Unit>()
        val job1: Job = launch {
            println("The coroutine has started")
            job1Started.complete(Unit)
            try {
                delay(Duration.INFINITE)
            } catch (e: CancellationException) {
                println("The coroutine was canceled: $e")
                throw e
            }
        }
        job1Started.await()
        job1.cancel()
        val job2 = async {
            println("The second coroutine has started")
            try {
                awaitCancellation()
            } catch (e: CancellationException) {
                println("The second coroutine was canceled")
                throw e
            }
        }
        job2.cancel()
    }
    println("All coroutines have completed")
}`,
        comment: "Manual cancellation: job1.cancel() and job2.cancel(). Always rethrow CancellationException.",
      },
      {
        code: `suspend fun main() {
    withContext(Dispatchers.Default) {
        val childrenLaunched = CompletableDeferred<Unit>()
        val parentJob = launch {
            launch {
                println("Child coroutine 1 has started running")
                try { awaitCancellation() } finally { println("Child coroutine 1 has been canceled") }
            }
            launch {
                println("Child coroutine 2 has started running")
                try { awaitCancellation() } finally { println("Child coroutine 2 has been canceled") }
            }
            childrenLaunched.complete(Unit)
        }
        childrenLaunched.await()
        parentJob.cancel()
    }
}`,
        comment: "Canceling the parent cancels all children (structured concurrency).",
      },
      {
        code: `// isActive: check in long-running computation
val listSortingJob = launch {
    var i = 0
    while (isActive) {
        unsortedList.sort()
        ++i
    }
    println("Stopped sorting after $i iterations")
}
delay(100.milliseconds)
listSortingJob.cancel()
listSortingJob.join()`,
        comment: "Use isActive to exit loops when canceled; join() to wait for completion.",
      },
      {
        code: `// ensureActive(): throws CancellationException if canceled
while (true) {
    ++start
    var n = start
    while (n != 1) {
        ensureActive()
        n = if (n % 2 == 0) n / 2 else 3 * n + 1
    }
}`,
        comment: "ensureActive() stops the computation immediately when the coroutine is canceled.",
      },
      {
        code: `// runInterruptible: cancel triggers thread interruption
runInterruptible {
    Thread.sleep(Long.MAX_VALUE)
} // catch InterruptedException and rethrow; cancellation triggers interruption`,
        comment: "Use runInterruptible { } so cancel() interrupts blocking calls like Thread.sleep().",
      },
      {
        code: `try {
    awaitCancellation()
} finally {
    withContext(NonCancellable) {
        shutdownServiceAndWait()
    }
}`,
        comment: "NonCancellable ensures cleanup (e.g. shutdown) runs even when the coroutine is canceled.",
      },
      {
        code: `val slow = withTimeoutOrNull(100.milliseconds) { slowOperation() }
val fast = withTimeoutOrNull(100.milliseconds) { fastOperation() }
// If timeout exceeded, withTimeoutOrNull() returns null.`,
        comment: "withTimeoutOrNull(Duration) cancels the block after the duration; returns null on timeout.",
      },
    ],
    defaultCode: `import kotlinx.coroutines.*
import kotlin.time.Duration.Companion.milliseconds

suspend fun main() {
    withContext(Dispatchers.Default) {
        val job = launch {
            println("Started")
            try {
                delay(500.milliseconds)
                println("Done")
            } catch (e: CancellationException) {
                println("Canceled")
                throw e
            }
        }
        delay(100.milliseconds)
        job.cancel()
        job.join()
        println("All done")
    }
}`,
  },
  {
    id: "composing-suspending-functions",
    step: 16,
    title: "Composing suspending functions",
    nextStep: "coroutine-context-and-dispatchers",
    prevStep: "cancellation-and-timeouts",
    content: [
      "This section covers various approaches to composition of suspending functions.",
      "Sequential by default: If you need two suspending functions to run one after the other (e.g. using the result of the first to decide whether or how to call the second), use normal sequential invocation. Code in a coroutine is sequential by default. Use measureTimeMillis { } to see that both calls add up (e.g. ~2017 ms for two 1-second delays).",
      "Concurrent using async: When there are no dependencies between the two calls and you want the answer faster, use async. Like launch, async starts a separate coroutine that runs concurrently. The difference: launch returns a Job with no result; async returns a Deferred — a non-blocking future. Use .await() on the Deferred to get the result. Deferred is also a Job, so you can cancel it. With two async calls, total time is about the duration of one delay (~1017 ms). Concurrency with coroutines is always explicit.",
      "Lazily started async: Set the start parameter to CoroutineStart.LAZY so the coroutine only starts when its result is needed by await() or when Job.start() is called. Use this when you want to control when each coroutine starts. If you only call await() without start(), the coroutines run sequentially (await starts execution and waits). The use-case for async(start = CoroutineStart.LAZY) is replacing the standard lazy function when the computation involves suspending functions.",
      "Async-style functions: Defining xxxAsync() functions that use GlobalScope.async and return Deferred is a style used in other languages but is strongly discouraged in Kotlin. Such functions are not suspending and can be called from anywhere, but they opt out of structured concurrency. If the caller throws before awaiting, the background work keeps running with no way to cancel it. You must opt in with @OptIn(DelicateCoroutinesApi::class) for GlobalScope.",
      "Structured concurrency with async: Refactor concurrent work into a suspending function that uses coroutineScope { }. Inside it, use async for each part and await the results. If the function throws, all coroutines launched in that scope are cancelled. This keeps cancellation and failure propagation correct.",
      "Cancellation is always propagated through the coroutine hierarchy: If one child async throws (e.g. ArithmeticException), the other child is cancelled and the exception is reported to the caller. You'll see the first child's finally block run (e.g. \"First child was cancelled\") and then the exception message.",
    ],
    codeExamples: [
      {
        code: `suspend fun doSomethingUsefulOne(): Int {
    delay(1000L)
    return 13
}
suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L)
    return 29
}
// Sequential: first one, then two
val time = measureTimeMillis {
    val one = doSomethingUsefulOne()
    val two = doSomethingUsefulTwo()
    println("The answer is \${one + two}")
}
println("Completed in $time ms")`,
        comment: "Sequential by default: ~2017 ms. Use when the second call depends on the first.",
      },
      {
        code: `val time = measureTimeMillis {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    println("The answer is \${one.await() + two.await()}")
}
println("Completed in $time ms")`,
        comment: "Concurrent with async: ~1017 ms. async returns Deferred; await() gets the result.",
      },
      {
        code: `val time = measureTimeMillis {
    val one = async(start = CoroutineStart.LAZY) { doSomethingUsefulOne() }
    val two = async(start = CoroutineStart.LAZY) { doSomethingUsefulTwo() }
    one.start()
    two.start()
    println("The answer is \${one.await() + two.await()}")
}
println("Completed in $time ms")`,
        comment: "Lazily started: start() begins execution; use when you need to control when each starts.",
      },
      {
        code: `suspend fun concurrentSum(): Int = coroutineScope {
    val one = async { doSomethingUsefulOne() }
    val two = async { doSomethingUsefulTwo() }
    one.await() + two.await()
}
val time = measureTimeMillis {
    println("The answer is \${concurrentSum()}")
}
println("Completed in $time ms")`,
        comment: "Structured concurrency: coroutineScope ensures all children are cancelled if the function throws.",
      },
      {
        code: `suspend fun failedConcurrentSum(): Int = coroutineScope {
    val one = async<Int> {
        try {
            delay(Long.MAX_VALUE)
            42
        } finally { println("First child was cancelled") }
    }
    val two = async<Int> {
        println("Second child throws an exception")
        throw ArithmeticException()
    }
    one.await() + two.await()
}
// try { failedConcurrentSum() } catch(e: ArithmeticException) { println("Computation failed") }`,
        comment: "When one child throws, the other is cancelled; cancellation propagates through the hierarchy.",
      },
    ],
    defaultCode: `import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

suspend fun doSomethingUsefulOne(): Int {
    delay(1000L)
    return 13
}
suspend fun doSomethingUsefulTwo(): Int {
    delay(1000L)
    return 29
}

fun main() = runBlocking {
    val time = measureTimeMillis {
        val one = async { doSomethingUsefulOne() }
        val two = async { doSomethingUsefulTwo() }
        println("The answer is \${one.await() + two.await()}")
    }
    println("Completed in $time ms")
}`,
  },
  {
    id: "coroutine-context-and-dispatchers",
    step: 17,
    title: "Coroutine context and dispatchers",
    nextStep: "asynchronous-flow",
    prevStep: "composing-suspending-functions",
    content: [
      "Coroutines always execute in some context represented by a value of type CoroutineContext. The main elements are the Job of the coroutine and its dispatcher.",
      "Dispatchers and threads: The coroutine context includes a CoroutineDispatcher that determines which thread(s) the coroutine uses. The dispatcher can confine execution to a specific thread, dispatch to a thread pool, or let it run unconfined. Builders like launch and async accept an optional CoroutineContext parameter to specify the dispatcher. When launch { } is used without parameters, it inherits the context (and dispatcher) from the CoroutineScope. Dispatchers.Unconfined runs in the caller thread until the first suspension, then resumes in the thread chosen by the suspending function. Dispatchers.Default uses a shared background thread pool. newSingleThreadContext creates a dedicated thread — an expensive resource; release it with close() or reuse it.",
      "Unconfined vs confined: Dispatchers.Unconfined starts in the caller thread but only until the first suspension point; after suspension it resumes in the thread determined by the suspending function. It is appropriate for coroutines that neither consume CPU nor update shared data (e.g. UI) confined to a thread. The default dispatcher inherited from the scope (e.g. runBlocking) confines execution to one thread with predictable scheduling.",
      "Debugging: Coroutines can suspend on one thread and resume on another. The Coroutine Debugger in the Kotlin plugin (IDEA) shows running and suspended coroutines in the Coroutines tab. Without it, use logging: run with -Dkotlinx.coroutines.debug so that log() prints the thread name and coroutine id (e.g. [main @coroutine#2]). Debug mode is also on with -ea.",
      "Jumping between threads: Use runBlocking(context) to run with a specific context. Use withContext(context) to suspend and run a block in a different context (e.g. different dispatcher); when the block finishes, execution returns to the original dispatcher. Use newSingleThreadContext(\"Name\").use { } to release the thread when done.",
      "Job in the context: The coroutine's Job is in its context; use coroutineContext[Job] to retrieve it. isActive on CoroutineScope is a shortcut for coroutineContext[Job]?.isActive == true.",
      "Children of a coroutine: When you launch a coroutine in another's scope, it inherits the context and its Job becomes a child of the parent's Job. Cancelling the parent cancels all children. You can override this: GlobalScope.launch does not inherit a Job from the parent; passing launch(Job()) gives the new coroutine its own Job so it is not tied to the parent and is not cancelled when the parent is.",
      "Parental responsibilities: A parent coroutine always waits for all its children to complete. The parent does not need to track children or call Job.join explicitly.",
      "Naming coroutines: Use CoroutineName(\"name\") so that in debug mode the thread name includes the coroutine name (e.g. [main @v1coroutine#2]). Useful when a coroutine is tied to a specific request or task.",
      "Combining context elements: Use the + operator to add multiple context elements, e.g. launch(Dispatchers.Default + CoroutineName(\"test\")) { }.",
      "Coroutine scope: For objects with a lifecycle (e.g. an Android Activity) that are not coroutines, create a CoroutineScope (CoroutineScope() or MainScope()) and cancel it when the object is destroyed (e.g. mainScope.cancel() in Activity.destroy()) so all launched coroutines are cancelled and you avoid leaks. Android has first-party support for scope in lifecycle-aware components.",
      "Thread-local data: Use threadLocal.asContextElement(value = \"launch\") to pass a thread-local value into a coroutine; the value is restored whenever the coroutine switches context. Without this, the thread-local may have an unexpected value when the coroutine runs on a different thread. Prefer ensurePresent to fail-fast on improper use. Mutations to the ThreadLocal inside the coroutine are not propagated to the caller; use withContext to update. See ThreadContextElement for advanced usage (e.g. logging MDC).",
    ],
    codeExamples: [
      {
        code: `launch { println("main runBlocking: \${Thread.currentThread().name}") }
launch(Dispatchers.Unconfined) { println("Unconfined: \${Thread.currentThread().name}") }
launch(Dispatchers.Default) { println("Default: \${Thread.currentThread().name}") }
launch(newSingleThreadContext("MyOwnThread")) { println("newSingleThreadContext: \${Thread.currentThread().name}") }`,
        comment: "Dispatchers: inherit from scope, Unconfined, Default, or a dedicated thread. Release newSingleThreadContext with close() or reuse.",
      },
      {
        code: `launch(Dispatchers.Unconfined) {
    println("Unconfined: \${Thread.currentThread().name}")
    delay(500)
    println("Unconfined after delay: \${Thread.currentThread().name}")
}
launch {
    println("main: \${Thread.currentThread().name}")
    delay(1000)
    println("main after delay: \${Thread.currentThread().name}")
}`,
        comment: "Unconfined runs in caller thread until first suspension; after delay() it resumes on DefaultExecutor. Confined stays on main.",
      },
      {
        code: `// Run with -Dkotlinx.coroutines.debug
val a = async { log("computing a"); 6 }
val b = async { log("computing b"); 7 }
log("The answer is \${a.await() * b.await()}")`,
        comment: "log() prints [thread @coroutine#id]. Coroutine id is assigned when debug mode is on.",
      },
      {
        code: `newSingleThreadContext("Ctx1").use { ctx1 ->
    newSingleThreadContext("Ctx2").use { ctx2 ->
        runBlocking(ctx1) {
            log("Started in ctx1")
            withContext(ctx2) { log("Working in ctx2") }
            log("Back to ctx1")
        }
    }
}`,
        comment: "runBlocking(ctx) uses that context; withContext(ctx2) switches to ctx2 for the block then returns to the original.",
      },
      {
        code: `println("My job is \${coroutineContext[Job]}")`,
        comment: "Job is part of the context; isActive is a shortcut for coroutineContext[Job]?.isActive == true.",
      },
      {
        code: `val request = launch {
    launch(Job()) {
        delay(1000)
        println("job1: I run independently; not affected by request cancel")
    }
    launch {
        delay(100)
        println("job2: I am a child of request")
        delay(1000)
        println("job2: will not run if request is cancelled")
    }
}
delay(500)
request.cancel()
println("Who survived?")`,
        comment: "launch(Job()) overrides parent Job so this coroutine is not cancelled when request is cancelled.",
      },
      {
        code: `val request = launch {
    repeat(3) { i ->
        launch {
            delay((i + 1) * 200L)
            println("Coroutine $i is done")
        }
    }
    println("request: I'm done, not joining children")
}
request.join()
println("Now request is complete")`,
        comment: "Parent always waits for all children; no need to join each child explicitly.",
      },
      {
        code: `val v1 = async(CoroutineName("v1coroutine")) { delay(500); log("Computing v1"); 6 }
val v2 = async(CoroutineName("v2coroutine")) { delay(1000); log("Computing v2"); 7 }
log("The answer is \${v1.await() * v2.await()}")`,
        comment: "CoroutineName(\"name\") shows up in debug output (e.g. [main @v1coroutine#2]).",
      },
      {
        code: `launch(Dispatchers.Default + CoroutineName("test")) {
    println("Thread: \${Thread.currentThread().name}")
}`,
        comment: "Combine context elements with + (e.g. dispatcher and name).",
      },
      {
        code: `class Activity {
    private val mainScope = MainScope()
    fun destroy() { mainScope.cancel() }
    fun doSomething() {
        repeat(10) { i ->
            mainScope.launch {
                delay((i + 1) * 200L)
                println("Coroutine $i is done")
            }
        }
    }
}
val activity = Activity()
activity.doSomething()
delay(500)
activity.destroy() // cancels all coroutines`,
        comment: "MainScope() ties coroutines to the Activity; cancel() in destroy() cancels all and avoids leaks.",
      },
      {
        code: `threadLocal.set("main")
val job = launch(Dispatchers.Default + threadLocal.asContextElement(value = "launch")) {
    println("Start: \${threadLocal.get()}")
    yield()
    println("After yield: \${threadLocal.get()}")
}
job.join()`,
        comment: "asContextElement(value = \"launch\") ensures the coroutine sees the given value even when it switches threads.",
      },
    ],
    defaultCode: `import kotlinx.coroutines.*

fun main() = runBlocking {
    launch {
        println("main: \${Thread.currentThread().name}")
    }
    launch(Dispatchers.Unconfined) {
        println("Unconfined: \${Thread.currentThread().name}")
        delay(100)
        println("Unconfined after delay: \${Thread.currentThread().name}")
    }
    launch(Dispatchers.Default) {
        println("Default: \${Thread.currentThread().name}")
    }
    delay(500)
}`,
  },
  {
    id: "asynchronous-flow",
    step: 17,
    title: "Asynchronous Flow",
    nextStep: "channels",
    prevStep: "coroutine-context-and-dispatchers",
    content: [
      "A suspending function returns a single value asynchronously. To return multiple asynchronously computed values, use Kotlin Flow.",
      "Representing multiple values: Use collections (e.g. List) for a fixed set, or Sequence with yield() for synchronous streams (blocks the thread). A suspend function can return a List after a delay but returns all values at once.",
      "Flows: Use Flow<Int> and the flow { } builder to represent a stream of values computed asynchronously. Inside flow { } you can call suspend functions (e.g. delay). Use emit(value) to emit and collect { } to consume. The function that returns a Flow is not marked suspend — the flow runs only when collected.",
      "Flows are cold: The code inside a flow builder does not run until the flow is collected. Each collect() runs the flow from the start.",
      "Flow cancellation: Flows follow cooperative cancellation. Use withTimeoutOrNull(duration) { flow.collect { } } to cancel collection after a timeout. Size-limiting operators like take() cancel the flow when the limit is reached.",
      "Flow builders: flow { } is the basic builder. Use flowOf(...) for fixed values and .asFlow() to convert collections or ranges to Flow.",
      "Intermediate operators: map, filter, transform, etc. apply to an upstream flow and return a downstream flow. They are cold and non-suspending; the blocks inside them can call suspend functions. transform can emit multiple values per input.",
      "Terminal operators: collect is the basic one. Others include toList, toSet, first(), single(), reduce, fold. They are suspending and start collection.",
      "Flows are sequential: Unless you use operators that introduce concurrency, each emitted value is processed by all intermediate and terminal operators in the same coroutine, one by one.",
      "Flow context: Collection always runs in the context of the caller. Code in flow { } runs in the context of the collector (context preservation). Do not use withContext inside flow { } to change dispatcher — use flowOn(Dispatchers.Default) instead. flowOn creates a coroutine for the upstream and can change the default sequential nature.",
      "Buffering: Use .buffer() so emission runs concurrently with collection, reducing total time when both emitter and collector are slow.",
      "Conflation: Use .conflate() to skip intermediate values and process only the most recent when the collector is slow.",
      "Processing the latest: collectLatest { } cancels and restarts the block on each new value; only the last value may complete. Similar xxxLatest operators exist for other cases.",
      "Composing flows: zip() combines two flows pair-wise. combine() recomputes when any upstream emits, using the latest value from each.",
      "Flattening: map { requestFlow(it) } gives Flow<Flow<String>>. Use flatMapConcat (sequential), flatMapMerge (concurrent), or flatMapLatest (cancel previous on new value) to flatten.",
      "Flow exceptions: Use try/catch around collect to handle exceptions. For transparent handling use .catch { e -> emit(...) }. catch only handles upstream exceptions; exceptions in collect escape. Use onEach { }.catch { }.collect() to handle all exceptions declaratively.",
      "Flow completion: Use try/finally around collect or .onCompletion { }. onCompletion receives a nullable Throwable (null on success) and does not handle the exception — use catch for that.",
      "Launching flow: Use .onEach { }.launchIn(scope) to run collection in a separate coroutine so code after it continues immediately. launchIn returns a Job. Cancelling the scope cancels the flow (like removeEventListener).",
      "Flow cancellation checks: The flow builder checks ensureActive on each emit. Other operators (e.g. asFlow()) may not. Use .cancellable() to add cancellation checks to busy flows.",
      "Flow and Reactive Streams: Flow is inspired by Reactive Streams; you can convert to/from Publisher (kotlinx-coroutines-reactive) and integrate with Reactor/RxJava.",
    ],
    codeExamples: [
      {
        code: `fun simple(): Flow<Int> = flow {
    for (i in 1..3) {
        delay(100)
        emit(i)
    }
}
fun main() = runBlocking {
    launch { repeat(3) { k -> delay(100); println("Not blocked $k") } }
    simple().collect { value -> println(value) }
}`,
        comment: "flow { } builder, emit(), collect(). Code in flow can suspend; main thread is not blocked.",
      },
      {
        code: `fun simple(): Flow<Int> = flow {
    println("Flow started")
    for (i in 1..3) { delay(100); emit(i) }
}
fun main() = runBlocking {
    val f = simple()
    println("Calling collect...")
    f.collect { println(it) }
    println("Calling collect again...")
    f.collect { println(it) }
}`,
        comment: "Flows are cold: \"Flow started\" prints on each collect, not when simple() is called.",
      },
      {
        code: "(1..3).asFlow().collect { println(it) }\n// or: flowOf(1, 2, 3).collect { println(it) }",
        comment: "Flow builders: asFlow() and flowOf() for fixed values.",
      },
      {
        code: "(1..3).asFlow()\n    .map { performRequest(it) }  // suspend inside map\n    .collect { println(it) }",
        comment: "Intermediate operators (map, filter) can call suspend functions.",
      },
      {
        code: "(1..3).asFlow()\n    .transform { request ->\n        emit(\"Making request $request\")\n        emit(performRequest(request))\n    }\n    .collect { println(it) }",
        comment: "transform can emit multiple values per input.",
      },
      {
        code: "numbers().take(2).collect { println(it) }\n// Emits 1, 2; flow body is cancelled, finally block runs.",
        comment: "take(n) cancels the flow when limit is reached; cancellation uses exceptions so finally runs.",
      },
      {
        code: "val sum = (1..5).asFlow().map { it * it }.reduce { a, b -> a + b }\nprintln(sum) // 55",
        comment: "Terminal operators: reduce, fold, toList, first, etc.",
      },
      {
        code: "fun simple(): Flow<Int> = flow {\n    for (i in 1..3) {\n        Thread.sleep(100)\n        emit(i)\n    }\n}.flowOn(Dispatchers.Default)\n// RIGHT: flowOn changes emission context. Do not use withContext inside flow { }.",
        comment: "Use flowOn(dispatcher) to run emission on another context; withContext inside flow { } violates context preservation.",
      },
      {
        code: "simple()\n    .buffer()\n    .collect { value -> delay(300); println(value) }\n// Faster: emission and collection run concurrently.",
        comment: "buffer() lets emitter run ahead of collector, reducing total time.",
      },
      {
        code: "simple().conflate().collect { value -> delay(300); println(value) }\n// Skips intermediate values; only latest may be processed.",
        comment: "conflate() drops intermediate values when collector is slow.",
      },
      {
        code: "simple().collectLatest { value ->\n    println(\"Collecting $value\")\n    delay(300)\n    println(\"Done $value\")\n}\n// Restarts on each new value; only last may print Done.",
        comment: "collectLatest cancels and restarts on each emission.",
      },
      {
        code: "(1..3).asFlow().zip(flowOf(\"one\",\"two\",\"three\")) { a, b -> \"$a -> $b\" }\n    .collect { println(it) }",
        comment: "zip() pairs values from two flows.",
      },
      {
        code: "nums.combine(strs) { a, b -> \"$a -> $b\" }.collect { println(it) }\n// Recomputes when either flow emits; uses latest from each.",
        comment: "combine() emits when any upstream emits, with latest values from all.",
      },
      {
        code: "(1..3).asFlow().flatMapConcat { requestFlow(it) }.collect { println(it) }\n// flatMapMerge: concurrent collection. flatMapLatest: cancel previous on new value.",
        comment: "Flattening: flatMapConcat (sequential), flatMapMerge (concurrent), flatMapLatest.",
      },
      {
        code: "simple()\n    .catch { e -> emit(\"Caught $e\") }\n    .collect { println(it) }",
        comment: "catch handles upstream exceptions; can emit replacement values. Does not catch downstream (collect) exceptions.",
      },
      {
        code: "simple()\n    .onCompletion { cause -> if (cause != null) println(\"Completed exceptionally\") }\n    .catch { println(\"Caught: $it\") }\n    .collect { println(it) }",
        comment: "onCompletion runs when flow finishes; cause is null on success. It does not handle the exception.",
      },
      {
        code: "events()\n    .onEach { println(\"Event: $it\") }\n    .launchIn(this)\nprintln(\"Done\")\n// Collection runs in a separate coroutine; execution continues immediately.",
        comment: "launchIn(scope) collects in a new coroutine; returns Job. Cancelling scope cancels the flow.",
      },
      {
        code: "(1..5).asFlow().cancellable().collect { value ->\n    if (value == 3) cancel()\n    println(value)\n}\n// cancellable() adds cancellation checks; without it, asFlow() may not check until the end.",
        comment: "Use .cancellable() so busy flows (e.g. asFlow()) respect cancellation.",
      },
    ],
    defaultCode: "import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun simple(): Flow<Int> = flow {\n    for (i in 1..3) {\n        delay(100)\n        emit(i)\n    }\n}\n\nfun main() = runBlocking {\n    simple().collect { value -> println(value) }\n}",
  },
  {
    id: "channels",
    step: 19,
    title: "Channels",
    nextStep: "coroutine-exception-handling",
    prevStep: "asynchronous-flow",
    content: [
      "Deferred transfers a single value between coroutines. Channels transfer a stream of values.",
      "Channel basics: A Channel is similar to BlockingQueue but uses suspending send instead of blocking put and suspending receive instead of blocking take. Create with Channel<Int>(); one coroutine sends, another receives.",
      "Closing and iteration: A channel can be closed to signal no more elements. Call channel.close() when done sending. On the receiver side use for (y in channel) to receive until closed; all elements sent before close are received.",
      "Building channel producers: Use the produce { } coroutine builder to create a ReceiveChannel; the producer sends with send(). On the consumer side use consumeEach { } or for (x in channel). This fits the producer-consumer pattern.",
      "Pipelines: One coroutine produces a stream (possibly infinite), others consume and transform it. Define produceNumbers() that sends in a loop and square(numbers: ReceiveChannel<Int>) that produce { for (x in numbers) send(x * x) }. Connect them and receive; use coroutineContext.cancelChildren() to cancel all when done.",
      "Prime numbers with pipeline: numbersFrom(start) produces integers from start; filter(numbers, prime) produces numbers not divisible by prime. Chain: numbersFrom(2) -> filter(2) -> filter(3) -> ...; each prime received adds a new filter stage. Run in a scope and cancelChildren() when done. Pipelines can use multiple cores (e.g. Dispatchers.Default) and other suspend calls, unlike sequence/iterator.",
      "Fan-out: Multiple coroutines receive from the same channel; work is distributed. Use for (msg in channel) in each processor. Cancelling the producer closes the channel and stops iteration in all processors. Prefer for loop over consumeEach when multiple coroutines consume — consumeEach consumes (cancels) the channel on completion.",
      "Fan-in: Multiple coroutines send to the same channel. Launch several coroutines that each call channel.send(...) in a loop; one receiver receives from the channel.",
      "Buffered channels: Channel() and produce take an optional capacity. Unbuffered (default) is rendezvous: send suspends until receive and vice versa. With capacity, senders can send up to capacity elements before suspending.",
      "Channels are fair: Send and receive are served in FIFO order; the first coroutine to call receive gets the element.",
      "Ticker channels: ticker(delayMillis, initialDelayMillis) produces Unit every time the given delay passes since last consumption. Useful for time-based pipelines and select. Use ReceiveChannel.cancel() when no more elements are needed. Ticker adjusts for consumer pauses by default; use TickerMode.FIXED_DELAY for fixed delay between elements.",
    ],
    codeExamples: [
      {
        code: "val channel = Channel<Int>()\nlaunch {\n    for (x in 1..5) channel.send(x * x)\n}\nrepeat(5) { println(channel.receive()) }\nprintln(\"Done!\")",
        comment: "Channel: suspending send and receive. One coroutine sends, another receives.",
      },
      {
        code: "val channel = Channel<Int>()\nlaunch {\n    for (x in 1..5) channel.send(x * x)\n    channel.close()\n}\nfor (y in channel) println(y)\nprintln(\"Done!\")",
        comment: "close() signals no more elements; for (y in channel) receives until closed.",
      },
      {
        code: "fun CoroutineScope.produceSquares(): ReceiveChannel<Int> = produce {\n    for (x in 1..5) send(x * x)\n}\nfun main() = runBlocking {\n    val squares = produceSquares()\n    squares.consumeEach { println(it) }\n    println(\"Done!\")\n}",
        comment: "produce { } builds a channel producer; consumeEach { } consumes on the receiver side.",
      },
      {
        code: "fun CoroutineScope.produceNumbers() = produce<Int> {\n    var x = 1\n    while (true) send(x++)\n}\nfun CoroutineScope.square(numbers: ReceiveChannel<Int>) = produce<Int> {\n    for (x in numbers) send(x * x)\n}\nval numbers = produceNumbers()\nval squares = square(numbers)\nrepeat(5) { println(squares.receive()) }\ncoroutineContext.cancelChildren()",
        comment: "Pipeline: produceNumbers() -> square(numbers) -> receive. cancelChildren() cancels all.",
      },
      {
        code: "fun CoroutineScope.numbersFrom(start: Int) = produce<Int> {\n    var x = start\n    while (true) send(x++)\n}\nfun CoroutineScope.filter(numbers: ReceiveChannel<Int>, prime: Int) = produce<Int> {\n    for (x in numbers) if (x % prime != 0) send(x)\n}\nvar cur = numbersFrom(2)\nrepeat(10) {\n    val prime = cur.receive()\n    println(prime)\n    cur = filter(cur, prime)\n}\ncoroutineContext.cancelChildren()",
        comment: "Prime pipeline: numbersFrom(2) -> filter(2) -> filter(3) -> ... Each prime adds a filter stage.",
      },
      {
        code: "fun CoroutineScope.produceNumbers() = produce<Int> {\n    var x = 1\n    while (true) { send(x++); delay(100) }\n}\nfun CoroutineScope.launchProcessor(id: Int, channel: ReceiveChannel<Int>) = launch {\n    for (msg in channel) println(\"Processor #$id received $msg\")\n}\nval producer = produceNumbers()\nrepeat(5) { launchProcessor(it, producer) }\ndelay(950)\nproducer.cancel()",
        comment: "Fan-out: multiple processors receive from the same channel; work is distributed.",
      },
      {
        code: "val channel = Channel<String>()\nlaunch { sendString(channel, \"foo\", 200L) }\nlaunch { sendString(channel, \"BAR!\", 500L) }\nrepeat(6) { println(channel.receive()) }\ncoroutineContext.cancelChildren()",
        comment: "Fan-in: multiple coroutines send to the same channel.",
      },
      {
        code: "val channel = Channel<Int>(4)\nval sender = launch {\n    repeat(10) {\n        println(\"Sending $it\")\n        channel.send(it)\n    }\n}\ndelay(1000)\nsender.cancel()",
        comment: "Buffered channel: capacity 4; sender suspends when buffer is full (after 5th send).",
      },
      {
        code: "val table = Channel<Ball>()\nlaunch { player(\"ping\", table) }\nlaunch { player(\"pong\", table) }\ntable.send(Ball(0))\ndelay(1000)\ncoroutineContext.cancelChildren()\nsuspend fun player(name: String, table: Channel<Ball>) {\n    for (ball in table) {\n        ball.hits++\n        println(\"$name $ball\")\n        delay(300)\n        table.send(ball)\n    }\n}",
        comment: "Channels are fair: send/receive served in FIFO order.",
      },
      {
        code: "val tickerChannel = ticker(delayMillis = 200, initialDelayMillis = 0)\nvar next = withTimeoutOrNull(1) { tickerChannel.receive() }\nprintln(\"Initial: $next\")\nnext = withTimeoutOrNull(100) { tickerChannel.receive() }\nprintln(\"Not ready in 100ms: $next\")\nnext = withTimeoutOrNull(120) { tickerChannel.receive() }\nprintln(\"Ready in 200ms: $next\")\ntickerChannel.cancel()",
        comment: "ticker() produces Unit every delayMillis since last consumption. cancel() when done.",
      },
    ],
    defaultCode: "import kotlinx.coroutines.*\nimport kotlinx.coroutines.channels.*\n\nfun main() = runBlocking {\n    val channel = Channel<Int>()\n    launch {\n        for (x in 1..5) channel.send(x * x)\n        channel.close()\n    }\n    for (y in channel) println(y)\n    println(\"Done!\")\n}",
  },
  {
    id: "coroutine-exception-handling",
    step: 20,
    title: "Coroutine exception handling",
    nextStep: "shared-mutable-state-and-concurrency",
    prevStep: "channels",
    content: [
      "This section covers exception handling and cancellation on exceptions. A cancelled coroutine throws CancellationException at suspension points; it is ignored by the machinery. Here we look at exceptions during cancellation and when multiple children throw.",
      "Exception propagation: Coroutine builders either propagate exceptions (launch) or expose them to the user (async, produce). For root coroutines: launch treats exceptions as uncaught (like Thread.uncaughtExceptionHandler); async and produce rely on the user to consume the exception via await or receive. So launch + uncaught exception is printed by the default handler; async exception is only seen when you call await() and catch it.",
      "CoroutineExceptionHandler: Install it on a root coroutine to customize handling of uncaught exceptions (log, show error, terminate). You cannot recover — the coroutine has already completed when the handler runs. Children delegate exception handling to their parent, so a handler on a child is never used; only the root's handler runs. async always catches and represents exceptions in the Deferred, so CoroutineExceptionHandler has no effect for async. Use @OptIn(DelicateCoroutinesApi::class) for GlobalScope.",
      "Cancellation and exceptions: Cancellation uses CancellationException; it is ignored by all handlers. Cancelling a child does not cancel the parent. If a coroutine throws an exception other than CancellationException, it cancels its parent with that exception; this cannot be overridden (structured concurrency). The parent's CoroutineExceptionHandler is invoked only after all children have terminated.",
      "Exceptions aggregation: When multiple children fail, the first exception wins; others are attached as suppressed (exception.suppressed). CancellationException is unwrapped so the original cause reaches the handler.",
      "Supervision: For one-way cancellation (e.g. UI: child failure should not kill the component; component destroy should cancel children), use SupervisorJob or supervisorScope.",
      "SupervisorJob: Like Job but cancellation propagates only downwards. A child's failure does not cancel siblings or the supervisor. Cancelling the supervisor cancels all children.",
      "supervisorScope: Like coroutineScope but propagates cancellation one way only; cancels all children only if the scope itself fails. Waits for all children before completing.",
      "Exceptions in supervised coroutines: With supervision, a child's failure does not propagate to the parent. Each child must handle its own exceptions. CoroutineExceptionHandler installed on a child launched inside supervisorScope is used (unlike in a normal scope where children delegate to parent).",
    ],
    codeExamples: [
      {
        code: "@OptIn(DelicateCoroutinesApi::class)\nfun main() = runBlocking {\n    val job = GlobalScope.launch {\n        println(\"Throwing from launch\")\n        throw IndexOutOfBoundsException()\n    }\n    job.join()\n    println(\"Joined failed job\")\n    val deferred = GlobalScope.async {\n        println(\"Throwing from async\")\n        throw ArithmeticException()\n    }\n    try {\n        deferred.await()\n    } catch (e: ArithmeticException) {\n        println(\"Caught ArithmeticException\")\n    }\n}",
        comment: "launch: exception is uncaught (printed by handler). async: exception only when await().",
      },
      {
        code: "val handler = CoroutineExceptionHandler { _, exception ->\n    println(\"CoroutineExceptionHandler got $exception\")\n}\nval job = GlobalScope.launch(handler) {\n    throw AssertionError()\n}\njob.join()\n// async(handler) { throw ... } — handler not used; use try { await() } catch.",
        comment: "CoroutineExceptionHandler on root handles uncaught exceptions. Not used for async or children.",
      },
      {
        code: "val job = launch {\n    val child = launch {\n        try { delay(Long.MAX_VALUE) } finally { println(\"Child is cancelled\") }\n    }\n    yield()\n    child.cancel()\n    child.join()\n    println(\"Parent is not cancelled\")\n}\njob.join()",
        comment: "Cancelling child does not cancel parent. CancellationException is ignored by handlers.",
      },
      {
        code: "val handler = CoroutineExceptionHandler { _, e -> println(\"Handler got $e\") }\nval job = GlobalScope.launch(handler) {\n    launch { delay(Long.MAX_VALUE); finally { ... } }\n    launch { delay(10); throw ArithmeticException() }\n}\njob.join()\n// Handler runs only after all children terminate.",
        comment: "Parent handles exception only when all children have terminated.",
      },
      {
        code: "val handler = CoroutineExceptionHandler { _, exception ->\n    println(\"Got $exception with suppressed \" + exception.suppressed.contentToString())\n}\nGlobalScope.launch(handler) {\n    launch { try { delay(Long.MAX_VALUE) } finally { throw ArithmeticException() } }\n    launch { delay(100); throw IOException() }\n}\n// First exception (IOException) wins; ArithmeticException in suppressed.",
        comment: "Multiple children fail: first exception wins; others attached as suppressed.",
      },
      {
        code: "val supervisor = SupervisorJob()\nwith(CoroutineScope(coroutineContext + supervisor)) {\n    val first = launch(CoroutineExceptionHandler { _, _ -> }) {\n        throw AssertionError(\"First child fails\")\n    }\n    val second = launch {\n        first.join()\n        println(\"First cancelled: \" + first.isCancelled + \", second still active\")\n        delay(Long.MAX_VALUE)\n    }\n    first.join()\n    supervisor.cancel()\n    second.join()\n}\n// First fails; second is not cancelled. Cancelling supervisor cancels second.",
        comment: "SupervisorJob: cancellation only downwards; child failure does not cancel siblings.",
      },
      {
        code: "try {\n    supervisorScope {\n        val child = launch {\n            try { delay(Long.MAX_VALUE) } finally { println(\"Child cancelled\") }\n        }\n        yield()\n        throw AssertionError()\n    }\n} catch (e: AssertionError) {\n    println(\"Caught assertion error\")\n}\n// Scope fails -> child cancelled. supervisorScope waits for children.",
        comment: "supervisorScope: exception in scope cancels all children; scope waits for them.",
      },
      {
        code: "val handler = CoroutineExceptionHandler { _, e -> println(\"Handler got $e\") }\nsupervisorScope {\n    val child = launch(handler) {\n        throw AssertionError()\n    }\n    println(\"Scope is completing\")\n}\nprintln(\"Scope is completed\")\n// In supervisorScope, child's handler is used (unlike normal scope).",
        comment: "In supervisorScope, CoroutineExceptionHandler on child is used; each child handles its own.",
      },
    ],
    defaultCode: "import kotlinx.coroutines.*\n\n@OptIn(DelicateCoroutinesApi::class)\nfun main() = runBlocking {\n    val handler = CoroutineExceptionHandler { _, e -> println(\"Caught: $e\") }\n    val job = GlobalScope.launch(handler) {\n        throw RuntimeException(\"Test exception\")\n    }\n    job.join()\n    println(\"Done\")\n}",
  },
  {
    id: "shared-mutable-state-and-concurrency",
    step: 21,
    title: "Shared mutable state and concurrency",
    nextStep: "select-expression",
    prevStep: "coroutine-exception-handling",
    content: [
      "Coroutines running in parallel (e.g. Dispatchers.Default) face the same concurrency issues as multi-threaded code. The main issue is synchronizing access to shared mutable state.",
      "The problem: Many coroutines incrementing a shared variable (e.g. counter++) without synchronization leads to lost updates. The final value is almost never the expected total (e.g. 100 * 1000 = 100000) because increments are not atomic.",
      "Volatiles are of no help: @Volatile in Kotlin only guarantees linearizable (atomic) reads and writes of the variable itself. It does not make compound operations like counter++ atomic (read-modify-write). So the counter can still be wrong and may run slower.",
      "Thread-safe data structures: Use atomic or thread-safe types for shared state. For a counter use AtomicInteger and incrementAndGet(). This is fast and correct for simple counters and similar cases. It does not scale well to complex state or operations without ready-made thread-safe types.",
      "Thread confinement fine-grained: Confine all access to shared state to a single thread. Use a single-threaded context (e.g. newSingleThreadContext) and withContext(thatContext) { counter++ } around each update. Correct but slow because every increment switches context.",
      "Thread confinement coarse-grained: Confine large chunks of logic to one thread. Run the whole workload in the single-threaded context, e.g. withContext(counterContext) { massiveRun { counter++ } }. Correct and much faster.",
      "Mutual exclusion: Protect all modifications with a critical section that never runs concurrently. Use Mutex: mutex.withLock { counter++ }. Mutex.lock() is suspending (does not block the thread). Good when there is no natural thread to confine state to but you must update shared state periodically.",
    ],
    codeExamples: [
      {
        code: "suspend fun massiveRun(action: suspend () -> Unit) {\n    val n = 100\n    val k = 1000\n    val time = measureTimeMillis {\n        coroutineScope {\n            repeat(n) { launch { repeat(k) { action() } } }\n        }\n    }\n    println(\"Completed \" + (n * k) + \" actions in \" + time + \" ms\")\n}\nvar counter = 0\nfun main() = runBlocking {\n    withContext(Dispatchers.Default) {\n        massiveRun { counter++ }\n    }\n    println(\"Counter = $counter\")\n}\n// Unlikely to print 100000 — no synchronization.",
        comment: "Shared mutable counter without synchronization: wrong result.",
      },
      {
        code: "@Volatile\nvar counter = 0\nfun main() = runBlocking {\n    withContext(Dispatchers.Default) {\n        massiveRun { counter++ }\n    }\n    println(\"Counter = $counter\")\n}\n// Still wrong: volatile = atomic read/write only, not atomic increment.",
        comment: "Volatile does not fix compound operations like increment.",
      },
      {
        code: "val counter = AtomicInteger()\nfun main() = runBlocking {\n    withContext(Dispatchers.Default) {\n        massiveRun { counter.incrementAndGet() }\n    }\n    println(\"Counter = $counter\")\n}\n// Correct and fast. Use for counters and simple shared state.",
        comment: "AtomicInteger.incrementAndGet() is atomic and fast.",
      },
      {
        code: "val counterContext = newSingleThreadContext(\"CounterContext\")\nvar counter = 0\nfun main() = runBlocking {\n    withContext(Dispatchers.Default) {\n        massiveRun {\n            withContext(counterContext) { counter++ }\n        }\n    }\n    println(\"Counter = $counter\")\n}\n// Correct but slow: every increment switches to single thread.",
        comment: "Fine-grained thread confinement: withContext per update.",
      },
      {
        code: "val counterContext = newSingleThreadContext(\"CounterContext\")\nvar counter = 0\nfun main() = runBlocking {\n    withContext(counterContext) {\n        massiveRun { counter++ }\n    }\n    println(\"Counter = $counter\")\n}\n// Correct and fast: whole run in single-threaded context.",
        comment: "Coarse-grained: confine the whole workload to one thread.",
      },
      {
        code: "val mutex = Mutex()\nvar counter = 0\nfun main() = runBlocking {\n    withContext(Dispatchers.Default) {\n        massiveRun {\n            mutex.withLock { counter++ }\n        }\n    }\n    println(\"Counter = $counter\")\n}\n// Correct. Mutex.lock() suspends; does not block thread.",
        comment: "Mutex.withLock { } protects critical section; good when no natural thread.",
      },
    ],
    defaultCode: "import kotlinx.coroutines.*\nimport kotlinx.coroutines.sync.*\nimport java.util.concurrent.atomic.AtomicInteger\n\nsuspend fun massiveRun(action: suspend () -> Unit) {\n    val n = 100\n    val k = 1000\n    val time = kotlin.system.measureTimeMillis {\n        coroutineScope {\n            repeat(n) { launch { repeat(k) { action() } } }\n        }\n    }\n    println(\"Completed \" + (n * k) + \" actions in \" + time + \" ms\")\n}\n\nfun main() = runBlocking {\n    val counter = AtomicInteger()\n    withContext(Dispatchers.Default) {\n        massiveRun { counter.incrementAndGet() }\n    }\n    println(\"Counter = $counter\")\n}",
  },
  {
    id: "select-expression",
    step: 22,
    title: "Select expression (experimental)",
    nextStep: "debug-coroutines-intellij",
    prevStep: "shared-mutable-state-and-concurrency",
    content: [
      "Select expression lets you await multiple suspending functions at once and use the first result that becomes available. It is experimental; the API may change.",
      "Selecting from channels: Use select<Unit> { } with onReceive clauses to receive from several channels at once. The first clause that can receive (or send) is chosen. Example: fizz.onReceive { } and buzz.onReceive { } in the same select; run in a loop and cancelChildren() when done.",
      "Selecting on close: onReceive throws when the channel is closed. Use onReceiveCatching { it -> it.getOrNull() } to handle closed channels and return a value (e.g. \"Channel 'a' is closed\"). select can return a result: select<String> { ... }. Select is biased: when several clauses are ready, the first one wins. onReceiveCatching is selected immediately when the channel is already closed.",
      "Selecting to send: Use onSend(value) { } to send to the first channel that can accept. Example: producer sends to primary channel or side channel via select { onSend(num) {}; side.onSend(num) {} }, so slow consumers get values on the side channel.",
      "Selecting deferred values: Use onAwait on Deferred in select to wait for the first completed deferred. select<String> { list.forEach { deferred -> deferred.onAwait { answer -> \"...\" } } }. Select is a DSL so you can build clauses in a loop.",
      "Switch over a channel of deferred values: Combine onReceiveCatching and onAwait in one select: wait for either the next Deferred from the channel or for the current Deferred to complete; if a new Deferred arrives, switch to it (e.g. switchMapDeferreds). Useful to replace in-flight work when new input arrives.",
    ],
    codeExamples: [
      {
        code: "fun CoroutineScope.fizz() = produce<String> {\n    while (true) { delay(500); send(\"Fizz\") }\n}\nfun CoroutineScope.buzz() = produce<String> {\n    while (true) { delay(1000); send(\"Buzz!\") }\n}\nsuspend fun selectFizzBuzz(fizz: ReceiveChannel<String>, buzz: ReceiveChannel<String>) {\n    select<Unit> {\n        fizz.onReceive { println(\"fizz -> '$it'\") }\n        buzz.onReceive { println(\"buzz -> '$it'\") }\n    }\n}\nval fizz = fizz()\nval buzz = buzz()\nrepeat(7) { selectFizzBuzz(fizz, buzz) }\ncoroutineContext.cancelChildren()",
        comment: "select<Unit> with onReceive: receive from first channel that has a value.",
      },
      {
        code: "suspend fun selectAorB(a: ReceiveChannel<String>, b: ReceiveChannel<String>): String =\n    select<String> {\n        a.onReceiveCatching { it ->\n            it.getOrNull()?.let { \"a -> '\" + it + \"'\" } ?: \"Channel 'a' is closed\"\n        }\n        b.onReceiveCatching { it ->\n            it.getOrNull()?.let { \"b -> '\" + it + \"'\" } ?: \"Channel 'b' is closed\"\n        }\n    }\n// onReceiveCatching handles closed channel; select returns result. Biased to first clause.",
        comment: "onReceiveCatching for close; select returns String. First ready clause wins.",
      },
      {
        code: "fun CoroutineScope.produceNumbers(side: SendChannel<Int>) = produce<Int> {\n    for (num in 1..10) {\n        delay(100)\n        select<Unit> {\n            onSend(num) {}\n            side.onSend(num) {}\n        }\n    }\n}\nval side = Channel<Int>()\nlaunch { side.consumeEach { println(\"Side channel has $it\") } }\nproduceNumbers(side).consumeEach { println(\"Consuming $it\"); delay(250) }\ncoroutineContext.cancelChildren()",
        comment: "onSend: send to primary or side channel; first that can accept wins.",
      },
      {
        code: "fun CoroutineScope.asyncString(time: Int) = async {\n    delay(time.toLong())\n    \"Waited for $time ms\"\n}\nval list = List(12) { asyncString(Random(3).nextInt(1000)) }\nval result = select<String> {\n    list.withIndex().forEach { (index, deferred) ->\n        deferred.onAwait { \"Deferred \" + index + \" produced '\" + it + \"'\" }\n    }\n}\nprintln(result)\nprintln(list.count { it.isActive }.toString() + \" coroutines still active\")",
        comment: "onAwait: select over Deferred values; first to complete wins.",
      },
      {
        code: "fun CoroutineScope.switchMapDeferreds(input: ReceiveChannel<Deferred<String>>) = produce<String> {\n    var current = input.receive()\n    while (isActive) {\n        val next = select<Deferred<String>?> {\n            input.onReceiveCatching { it.getOrNull() }\n            current.onAwait { value ->\n                send(value)\n                input.receiveCatching().getOrNull()\n            }\n        }\n        if (next == null) break else current = next\n    }\n}\n// Waits for current deferred or next from channel; replaces current when new one arrives.",
        comment: "onReceiveCatching + onAwait: switch to new deferred when it arrives.",
      },
    ],
    defaultCode: "import kotlinx.coroutines.*\nimport kotlinx.coroutines.channels.*\n\nfun CoroutineScope.fizz() = produce<String> {\n    while (true) { delay(500); send(\"Fizz\") }\n}\nfun CoroutineScope.buzz() = produce<String> {\n    while (true) { delay(1000); send(\"Buzz!\") }\n}\n\nfun main() = runBlocking {\n    val fizz = fizz()\n    val buzz = buzz()\n    repeat(5) {\n        select<Unit> {\n            fizz.onReceive { println(\"fizz -> $it\") }\n            buzz.onReceive { println(\"buzz -> $it\") }\n        }\n    }\n    coroutineContext.cancelChildren()\n    println(\"Done\")\n}",
  },
  {
    id: "debug-coroutines-intellij",
    step: 22,
    title: "Debug coroutines using IntelliJ IDEA",
    nextStep: "debug-kotlin-flow-intellij",
    prevStep: "select-expression",
    content: [
      "This tutorial shows how to create Kotlin coroutines and debug them in IntelliJ IDEA. You should already know the basics of coroutines.",
      "Create coroutines: Open a Kotlin project in IntelliJ. For a Gradle project, add kotlinx-coroutines-core to build.gradle(.kts): implementation(\"org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2\"). Open Main.kt in src/main/kotlin and use runBlocking, async, and await as in the code example below. Build the project (Build → Build Project).",
      "Debug coroutines: Set breakpoints on the lines with println(). Run the application in debug mode (Debug next to the run configuration).",
      { type: "image", src: "/images/portfolio/debugcoroutines/coroutine-breakpoint.png", alt: "Set breakpoints and build the project in IntelliJ IDEA." },
      "The Debug tool window shows the Frames tab (call stack), Variables tab, and Coroutines tab. The Coroutines tab lists running or suspended coroutines — for example, one RUNNING and two CREATED.",
      { type: "image", src: "/images/portfolio/debugcoroutines/coroutine-debug-1.png", alt: "Debug tool window with Frames, Variables, and Coroutines tab; three coroutines, first RUNNING." },
      "Click Resume Program. The first coroutine becomes SUSPENDED (waiting for a.await() * b.await()), the second is RUNNING (computing a), and the third is still CREATED.",
      { type: "image", src: "/images/portfolio/debugcoroutines/coroutine-debug-2.png", alt: "After first resume: first coroutine SUSPENDED, second RUNNING, third CREATED." },
      "Resume again. The first stays SUSPENDED, the second has finished and disappeared, and the third is RUNNING (computing b). You can inspect each coroutine in the Coroutines tab to debug your code.",
      { type: "image", src: "/images/portfolio/debugcoroutines/coroutine-debug-3.png", alt: "After second resume: first SUSPENDED, second done, third RUNNING." },
      "Optimized-out variables: When using suspend functions, the debugger may show \"was optimized out\" next to a variable. That means the variable's lifetime was shortened and it no longer exists at that point, so you cannot see its value. To disable this, use the -Xdebug compiler option. Do not use -Xdebug in production — it can cause memory leaks.",
      { type: "image", src: "/images/portfolio/debugcoroutines/variable-optimised-out.png", alt: "Variable \"a\" was optimized out in the debugger." },
    ],
    codeExamples: [
      {
        code: "import kotlinx.coroutines.*\n\nfun main() = runBlocking<Unit> {\n    val a = async {\n        println(\"I'm computing part of the answer\")\n        6\n    }\n    val b = async {\n        println(\"I'm computing another part of the answer\")\n        7\n    }\n    println(\"The answer is \" + (a.await() * b.await()))\n}",
        comment: "Set breakpoints on println() lines, then run in debug mode and use the Coroutines tab.",
      },
    ],
    defaultCode: "import kotlinx.coroutines.*\n\nfun main() = runBlocking<Unit> {\n    val a = async {\n        println(\"I'm computing part of the answer\")\n        6\n    }\n    val b = async {\n        println(\"I'm computing another part of the answer\")\n        7\n    }\n    println(\"The answer is \" + (a.await() * b.await()))\n}",
  },
  {
    id: "debug-kotlin-flow-intellij",
    step: 23,
    title: "Debug Kotlin Flow using IntelliJ IDEA",
    prevStep: "debug-coroutines-intellij",
    content: [
      "This tutorial shows how to create Kotlin Flow and debug it in IntelliJ IDEA. You should already know coroutines and Kotlin Flow.",
      "Create a Kotlin flow: Open a Kotlin project in IntelliJ. For Gradle, add kotlinx-coroutines-core to build.gradle(.kts). Open Main.kt in src/main/kotlin. Create simple() that returns a Flow<Int>: use delay(100) to imitate work, and in a for (i in 1..3) loop use emit(i). In main() use runBlocking, then simple().collect { value -> delay(300); println(value) }. Build the project (Build → Build Project).",
      { type: "image", src: "/images/portfolio/debugkotlinflow/flow-build-project.png", alt: "Build the Kotlin Flow project in IntelliJ IDEA." },
      "Debug the coroutine: Set a breakpoint at the line where emit() is called. Run the code in debug mode (Debug next to the run configuration).",
      { type: "image", src: "/images/portfolio/debugkotlinflow/flow-breakpoint.png", alt: "Set breakpoint at emit() and run in debug mode." },
      "The Debug tool window appears: Frames tab (call stack), Variables tab (e.g. flow emitting the first value), and Coroutines tab (running or suspended coroutines).",
      { type: "image", src: "/images/portfolio/debugkotlinflow/flow-debug-1.png", alt: "Debug tool window; Variables show flow emitting the first value." },
      "Click Resume Program. The program stops at the same breakpoint again — now the flow is emitting the second value.",
      { type: "image", src: "/images/portfolio/debugkotlinflow/flow-debug-2.png", alt: "After resume: flow emitting the second value." },
      "Resume again to see the third value. You can inspect variables and the Coroutines tab at each step.",
      { type: "image", src: "/images/portfolio/debugkotlinflow/flow-resume-debug.png", alt: "Resume debugger to step through flow emission." },
      "Optimized-out variables: The debugger may show \"was optimized out\" next to a variable when using suspend functions — the variable's lifetime was shortened and it no longer exists there. To disable this, use the -Xdebug compiler option. Do not use -Xdebug in production; it can cause memory leaks.",
      { type: "image", src: "/images/portfolio/debugkotlinflow/variable-optimised-out.png", alt: "Variable was optimized out in the debugger." },
      "Add a concurrently running coroutine: Add .buffer() before .collect() so the emitter and collector run concurrently. buffer() stores emitted values and runs the collector in a separate coroutine.",
      "Debug a Kotlin flow with two coroutines: Set a breakpoint at println(value). Run in debug mode. In the Coroutines tab you see two coroutines: the emitter (RUNNING) and the collector (SUSPENDED), because buffer() runs them in separate coroutines.",
      { type: "image", src: "/images/portfolio/debugkotlinflow/flow-debug-3.png", alt: "Two coroutines: emitter RUNNING, collector SUSPENDED." },
      "Click Resume Program. Now the collector coroutine has RUNNING status and the emitter has SUSPENDED status. You can dig deeper into each coroutine to debug your code.",
      { type: "image", src: "/images/portfolio/debugkotlinflow/flow-debug-4.png", alt: "After resume: collector RUNNING, emitter SUSPENDED." },
    ],
    codeExamples: [
      {
        code: "import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun simple(): Flow<Int> = flow {\n    for (i in 1..3) {\n        delay(100)\n        emit(i)\n    }\n}\n\nfun main() = runBlocking {\n    simple()\n        .collect { value ->\n            delay(300)\n            println(value)\n        }\n}",
        comment: "Set breakpoint at emit(). Run in debug and use Variables/Coroutines tabs.",
      },
      {
        code: "fun main() = runBlocking<Unit> {\n    simple()\n        .buffer()\n        .collect { value ->\n            delay(300)\n            println(value)\n        }\n}\n// buffer() runs emitter and collector in separate coroutines. Set breakpoint at println(value).",
        comment: "With buffer(): two coroutines in Coroutines tab. Set breakpoint at println(value).",
      },
    ],
    defaultCode: "import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun simple(): Flow<Int> = flow {\n    for (i in 1..3) {\n        delay(100)\n        emit(i)\n    }\n}\n\nfun main() = runBlocking {\n    simple()\n        .collect { value ->\n            delay(300)\n            println(value)\n        }\n}",
  },
];

export function getKotlinLessonById(id: string): KotlinLesson | undefined {
  return KOTLIN_COURSE_LESSONS.find((l) => l.id === id);
}

export function getKotlinLessonByStep(step: number): KotlinLesson | undefined {
  return KOTLIN_COURSE_LESSONS.find((l) => l.step === step);
}
