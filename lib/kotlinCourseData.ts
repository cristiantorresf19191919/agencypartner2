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

export interface KotlinLesson {
  id: string;
  step: number;
  title: string;
  nextStep?: string;
  prevStep?: string;
  content: string[];
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
    nextStep: "null-safety",
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
    id: "null-safety",
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
    prevStep: "null-safety",
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
];

export function getKotlinLessonById(id: string): KotlinLesson | undefined {
  return KOTLIN_COURSE_LESSONS.find((l) => l.id === id);
}

export function getKotlinLessonByStep(step: number): KotlinLesson | undefined {
  return KOTLIN_COURSE_LESSONS.find((l) => l.step === step);
}
