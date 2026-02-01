/**
 * Kotlin Java Interop course – comparison, calling Java/Kotlin, records, strings, collections, nullability, and standard input.
 * Lessons: Comparison to Java, Calling Java from Kotlin, Calling Kotlin from Java, Using Java records in Kotlin, Strings in Java and Kotlin, Collections in Java and Kotlin, Nullability in Java and Kotlin, Standard input.
 */

export interface KotlinInteropPracticeChallenge {
  id: string;
  title: string;
  description: string;
  hint?: string;
  starterCode: string;
  testCases: { input: string; output: string }[];
  solution?: string;
}

export interface KotlinInteropLesson {
  id: string;
  step: number;
  title: string;
  nextStep?: string;
  prevStep?: string;
  content: string[];
  codeExamples: { code: string; comment?: string }[];
  practice?: KotlinInteropPracticeChallenge[];
  defaultCode: string;
}

export const KOTLIN_JAVA_INTEROP_LESSONS: KotlinInteropLesson[] = [
  {
    id: "comparison-to-java",
    step: 1,
    title: "Comparison to Java",
    nextStep: "calling-java-from-kotlin",
    content: [
      "Kotlin fixes a series of issues that Java suffers from.",
      "Some Java issues addressed in Kotlin: Null references are controlled by the type system. No raw types. Arrays in Kotlin are invariant. Kotlin has proper function types, as opposed to Java's SAM-conversions. Use-site variance without wildcards. Kotlin does not have checked exceptions. Separate interfaces for read-only and mutable collections.",
      "What Java has that Kotlin does not: Checked exceptions. Primitive types that are not classes (the bytecode uses primitives where possible, but they are not explicitly available). Static members are replaced with companion objects, top-level functions, extension functions, or @JvmStatic. Wildcard-types are replaced with declaration-site variance and type projections. The ternary operator a ? b : c is replaced with if expression. Records. Pattern Matching. package-private visibility modifier.",
      "What Kotlin has that Java does not: Lambda expressions + Inline functions = performant custom control structures. Extension functions. Null-safety. Smart casts (Java 16: Pattern Matching for instanceof). String templates. Properties. Primary constructors. First-class delegation. Type inference for variable and property types (Java 10: Local-Variable Type Inference). Singletons. Declaration-site variance & Type projections. Range expressions. Operator overloading. Companion objects. Data classes. Coroutines. Top-level functions. Parameters with default values. Named parameters. Infix functions. Expect and actual declarations. Explicit API mode and better control of API surface.",
      "What's next? Learn how to: Perform typical tasks with strings in Java and Kotlin. Perform typical tasks with collections in Java and Kotlin. Handle nullability in Java and Kotlin.",
    ],
    codeExamples: [],
    defaultCode: `// Comparison to Java – no code required for this lesson.
// Proceed to "Calling Java from Kotlin" for code examples.
fun main() {
    println("Kotlin addresses many Java pain points.")
}`,
    practice: [],
  },
  {
    id: "calling-java-from-kotlin",
    step: 2,
    title: "Calling Java from Kotlin",
    nextStep: "calling-kotlin-from-java",
    prevStep: "comparison-to-java",
    content: [
      "Kotlin is designed with Java interoperability in mind. Existing Java code can be called from Kotlin in a natural way. Pretty much all Java code can be used without any issues.",
      "Getters and setters: Methods that follow the Java conventions for getters and setters (no-argument methods starting with get, single-argument methods starting with set) are represented as properties in Kotlin (synthetic properties). Boolean accessor methods (getter starting with is, setter with set) are represented as properties with the same name as the getter. If the Java class only has a setter, it is not visible as a property in Kotlin.",
      "Methods returning void: If a Java method returns void, it returns Unit when called from Kotlin.",
      "Escaping for Java identifiers: If a Java library uses a Kotlin keyword (in, object, is, etc.) for a method, escape it with a backtick: foo.`is`(bar).",
      "Null-safety and platform types: Any reference in Java may be null. Types of Java declarations are treated as platform types in Kotlin; null-checks are relaxed so safety guarantees match Java. Platform types are non-denotable (you cannot write them explicitly). You can choose nullable or non-nullable when assigning: val nullable: String? = item or val notNull: String = item (the latter may fail at runtime with an assertion). Notation: T! means \"T or T?\"; (Mutable)Collection<T>! and Array<(out) T>! are used in messages.",
      "Nullability annotations: Java types with nullability annotations (JetBrains, JSpecify, Android, JSR-305, FindBugs, Eclipse, Lombok, RxJava 3) are represented as nullable or non-nullable Kotlin types. You can annotate type arguments and type parameters; JSR-305 supports @Nonnull(when=...), type qualifier nicknames, and @TypeQualifierDefault. @UnderMigration in kotlin-annotations-jvm configures migration status.",
      "Mapped types: Java primitive types map to Kotlin types (e.g. int → kotlin.Int). java.lang.Object → kotlin.Any!; boxed primitives (e.g. java.lang.Integer) → nullable Kotlin types (e.g. kotlin.Int?). Java collections map to Kotlin read-only and mutable types (e.g. List<T> → List<T> / MutableList<T>). Java arrays: int[] → IntArray!, String[] → Array<(out) String!>!.",
      "Java generics in Kotlin: Java wildcards become type projections (Foo<? extends Bar> → Foo<out Bar!>!; Foo<? super Bar> → Foo<in Bar!>!). Raw types become star projections (List → List<*>!). Generics are not retained at runtime; is-checks only for star-projected types: if (a is List<*>) is OK.",
      "Java arrays: Arrays in Kotlin are invariant. Use IntArray, DoubleArray, etc. for primitive arrays when calling Java. Use the spread operator * for varargs: javaObj.removeIndicesVarArg(*array).",
      "Operators: Kotlin allows Java methods with the right name and signature as operator overloads. Infix call syntax for Java methods is not allowed.",
      "Checked exceptions: In Kotlin all exceptions are unchecked; you are not forced to catch Java checked exceptions.",
      "Object methods: java.lang.Object becomes Any. wait() and notify() are not available on Any—use java.util.concurrent or cast to java.lang.Object. Use foo::class.java or foo.javaClass for getClass(). Override clone() by extending kotlin.Cloneable. Override finalize() by declaring it without override (must not be private).",
      "Inheritance: At most one Java class (and any number of Java interfaces) can be a supertype. Static members of Java classes are accessed directly (e.g. Character.isLetter(a)); for mapped types use the full Java name (e.g. java.lang.Integer.bitCount(foo)).",
      "Java reflection: Works on Kotlin classes. Use instance::class.java, ClassName::class.java, or instance.javaClass. Use Int::class.javaObjectType for boxed types.",
      "SAM conversions: Kotlin function literals can be converted to Java single-abstract-method interfaces (e.g. Runnable, executor.execute { ... }). Only interfaces, not abstract classes.",
      "JNI: Mark native functions with external: external fun foo(x: Int): Double. Lombok: Lombok-generated declarations can be used from Kotlin; see the Lombok compiler plugin for mixed modules.",
    ],
    codeExamples: [
      {
        code: `import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    for (item in source) {
        list.add(item)
    }
    for (i in 0..source.size - 1) {
        list[i] = source[i]  // get and set are called
    }
}`,
        comment: "Using Java collections from Kotlin; for-loops and operator conventions work.",
      },
      {
        code: `import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) {  // getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY      // setFirstDayOfWeek()
    }
    if (!calendar.isLenient) {  // isLenient()
        calendar.isLenient = true  // setLenient()
    }
}`,
        comment: "Getters and setters become synthetic properties (e.g. firstDayOfWeek, isLenient).",
      },
      {
        code: `val runnable = Runnable { println("This runs in a runnable") }

// In method calls:
// executor.execute { println("This runs in a thread pool") }
// Or explicitly: executor.execute(Runnable { println("...") })`,
        comment: "SAM conversion: lambda becomes Runnable.",
      },
      {
        code: `fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString())  // Java would require catching IOException
    }
}`,
        comment: "Checked exceptions: Kotlin does not force you to catch them.",
      },
      {
        code: `val fooClass = foo::class.java
// or: val fooClass = foo.javaClass

// For boxed primitive class: Int::class.javaObjectType`,
        comment: "Getting Java class: use .java on class reference or .javaClass on instance.",
      },
      {
        code: `// Passing primitive array to Java:
// Java: public void removeIndices(int[] indices) { ... }
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)

// Varargs: public void removeIndicesVarArg(int... indices)
javaObj.removeIndicesVarArg(*array)`,
        comment: "Java arrays: use IntArray and spread operator * for varargs.",
      },
    ],
    defaultCode: `import java.util.*

fun main() {
    val list = ArrayList<Int>()
    list.add(1)
    list.add(2)
    list.add(3)
    for (i in 0..list.size - 1) {
        println("list[$i] = \${list[i]}")
    }
    val runnable = Runnable { println("Hello from Runnable") }
    runnable.run()
}`,
    practice: [],
  },
  {
    id: "calling-kotlin-from-java",
    step: 3,
    title: "Calling Kotlin from Java",
    nextStep: "using-java-records-in-kotlin",
    prevStep: "calling-java-from-kotlin",
    content: [
      "Kotlin code can be easily called from Java. Instances of a Kotlin class can be created and used in Java. Certain differences between Java and Kotlin require attention when integrating Kotlin into Java.",
      "Properties: A Kotlin property compiles to a getter (get prefix), a setter (set prefix for var only), and a private field for properties with backing fields. If the property name starts with is, the getter keeps the same name and the setter replaces is with set (for any type, not just Boolean).",
      "Package-level functions: Top-level functions and properties in a file (e.g. app.kt in package org.example) are compiled into static methods of a class org.example.AppKt. Use @file:JvmName(\"CustomName\") to set a custom Java class name. Use @file:JvmMultifileClass with the same @JvmName in multiple files to generate a single facade class containing all declarations.",
      "Instance fields: Annotate a property with @JvmField to expose it as a Java field (same visibility as the property). Requirements: backing field, not private, no open/override/const, not delegated. lateinit properties are also exposed as fields.",
      "Static fields: Properties in a named object or companion object have static backing fields. Expose them with @JvmField, lateinit, or const. const properties (top-level or in object/companion) become static final fields in Java.",
      "Static methods: Package-level functions are already static. Annotate functions in objects or companion objects with @JvmStatic so the compiler generates a static method in the enclosing class/object plus the instance method. From Java: C.callStatic() works; C.callNonStatic() does not—use C.Companion.callNonStatic(). Same for named objects: Obj.INSTANCE.callNonStatic(). @JvmStatic applies to interface companion objects (Kotlin 1.3+) and to property accessors.",
      "Default methods in interfaces: On the JVM, Kotlin compiles interface functions with bodies to default methods, so Java implementations can use them without reimplementing. Control compatibility with the -jvm-default compiler option (enable, no-compatibility, disable).",
      "Visibility: private → private; protected → protected (Java allows same-package access, Kotlin does not); internal → public with name mangling; public → public.",
      "KClass: To pass a KClass from Java, use kotlin.jvm.JvmClassMappingKt.getKotlinClass(MyClass.class) (equivalent to Class<T>.kotlin).",
      "Signature clashes: Use @JvmName to give a different JVM name (e.g. when type erasure makes two Kotlin functions have the same signature, or a property x vs getX()). Use @get:JvmName and @set:JvmName for accessor names.",
      "Overloads: Use @JvmOverloads on functions or constructors with default parameters so the compiler generates overloads for Java (each overload drops one trailing default parameter). Cannot be used on abstract or interface methods.",
      "Checked exceptions: Kotlin does not declare thrown exceptions. Use @Throws(IOException::class) so Java can catch them.",
      "Null-safety: Java can pass null for non-nullable parameters; Kotlin generates runtime checks, so Java gets NullPointerException immediately.",
      "Variant generics: Declaration-site variance (e.g. Box<out T>) is emitted as use-site wildcards in Java: parameter types get Box<? extends Base>, return types stay Box<Derived> (no wildcards). Use @JvmWildcard to force wildcards where they are not generated; use @JvmSuppressWildcards to remove them.",
      "Nothing: There is no Java counterpart; Kotlin uses raw types (e.g. List emptyList() for List<Nothing>).",
      "Inline value classes: By default they compile to unboxed representations and are not fully usable from Java. Use @JvmExposeBoxed (with @OptIn(ExperimentalStdlibApi::class)) or -Xjvm-expose-boxed so Kotlin generates a public constructor and boxed variants for Java. For inherited interface functions, override them in the implementing class to generate boxed representations.",
    ],
    codeExamples: [
      {
        code: `// Kotlin: var firstName: String
// Java:
//   private String firstName;
//   public String getFirstName() { return firstName; }
//   public void setFirstName(String firstName) { this.firstName = firstName; }

// Property isOpen → getter isOpen(), setter setOpen()`,
        comment: "Properties compile to getter, setter, and (if backed) private field.",
      },
      {
        code: `// app.kt
package org.example

class Util
fun getTime() { /*...*/ }

// Java: new org.example.Util(); org.example.AppKt.getTime();

@file:JvmName("DemoUtils")
package org.example
fun getTime() { /*...*/ }
// Java: org.example.DemoUtils.getTime();`,
        comment: "Package-level functions → AppKt static methods; @JvmName for custom class name.",
      },
      {
        code: `// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass
package org.example
fun getTime() { /*...*/ }

// newutils.kt – same @JvmName + @JvmMultifileClass
@file:JvmName("Utils")
@file:JvmMultifileClass
package org.example
fun getDate() { /*...*/ }
// Java: org.example.Utils.getTime(); org.example.Utils.getDate();`,
        comment: "Multiple files with same generated name: use @JvmMultifileClass to get one facade.",
      },
      {
        code: `class User(id: String) {
    @JvmField val ID = id
}
// Java: return user.ID;

class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
// Java: Key.COMPARATOR.compare(key1, key2);`,
        comment: "@JvmField exposes instance or static field to Java.",
      },
      {
        code: `class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
// Java: C.callStatic(); C.Companion.callNonStatic();

object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
// Java: Obj.callStatic(); Obj.INSTANCE.callNonStatic();`,
        comment: "@JvmStatic generates static method; without it, use Companion or INSTANCE.",
      },
      {
        code: `interface Robot {
    fun move() { println("~walking~") }
    fun speak(): Unit
}
// Java: public class C3PO implements Robot {
//   @Override public void speak() { ... }
// }`,
        comment: "Interface functions with body become default methods on the JVM.",
      },
      {
        code: `@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int> = filter { it > 0 }
fun List<String>.filterValid(): List<String> = filter { it.isNotEmpty() }

@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23`,
        comment: "@JvmName avoids signature clashes; @get/@set for accessor names.",
      },
      {
        code: `class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
// Java: new Circle(0, 0); new Circle(0, 0, 2.0);
//       circle.draw("a"); circle.draw("a", 2); circle.draw("a", 2, "blue");`,
        comment: "@JvmOverloads generates overloads for each default parameter.",
      },
      {
        code: `@Throws(IOException::class)
fun writeToFile() {
    throw IOException()
}
// Java: try { ExampleKt.writeToFile(); } catch (IOException e) { }`,
        comment: "Use @Throws so Java can catch checked exceptions.",
      },
      {
        code: `class Box<out T>(val value: T)
fun unboxBase(box: Box<Base>): Base = box.value
// Java: Base unboxBase(Box<? extends Base> box)

fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// Java: Box<? extends Derived> boxDerived(Derived value)

fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// Java: Base unboxBase(Box<Base> box)`,
        comment: "Variance: parameters get wildcards; @JvmWildcard / @JvmSuppressWildcards to tune.",
      },
      {
        code: `@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

// Java: MyInt input = new MyInt(5);`,
        comment: "@JvmExposeBoxed (with @OptIn) makes inline value class usable from Java.",
      },
    ],
    defaultCode: `// Calling Kotlin from Java – annotations and patterns
import java.util.Comparator

class User(id: String) {
    @JvmField val ID = id
}

class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}

class C {
    companion object {
        @JvmStatic fun callStatic() = println("static")
        fun callNonStatic() = println("companion")
    }
}

fun main() {
    val user = User("u1")
    println(user.ID)
    println(Key.COMPARATOR.compare(Key(1), Key(2)))
    C.callStatic()
    C.Companion.callNonStatic()
}`,
    practice: [],
  },
  {
    id: "using-java-records-in-kotlin",
    step: 4,
    title: "Using Java records in Kotlin",
    nextStep: "strings-java-kotlin",
    prevStep: "calling-kotlin-from-java",
    content: [
      "Records in Java are classes for storing immutable data with a fixed set of components. They have concise syntax and the compiler generates: a private final field per component, a public constructor, equals(), hashCode(), toString(), and a public accessor for each component. Records are very similar to Kotlin data classes.",
      "Using Java records from Kotlin: You can use a Java record the same way you use a class with properties. Access each record component by name (e.g. newPerson.name). No special syntax is required.",
      "Declare records in Kotlin: Kotlin supports emitting JVM record classes only for data classes that meet specific requirements. Use the @JvmRecord annotation on the data class. Note: applying @JvmRecord to an existing class is not binary compatible—it changes the naming of property accessors.",
      "Requirements for @JvmRecord: The module must target JVM 16 bytecode (or 15 with -Xjvm-enable-preview). The class cannot explicitly extend any other class (including Any), because JVM records implicitly extend java.lang.Record; it can implement interfaces. The class cannot declare properties with backing fields except those from the primary constructor. No mutable properties with backing fields. The class cannot be local. The primary constructor must be as visible as the class.",
      "Enable JVM records: Set jvmTarget to 16 or higher in Gradle or Maven (e.g. compilerOptions.jvmTarget = JvmTarget.JVM_16).",
      "Annotate record components (experimental): In Java, annotations on a record component are propagated to the backing field, getter, and constructor parameter. In Kotlin you can replicate this with the all use-site target. Enable it with -Xannotation-target-all or freeCompilerArgs.add(\"-Xannotation-target-all\") in build.gradle.kts. Example: @JvmRecord data class Person(val name: String, @all:Positive val age: Int). With @JvmRecord and @all:, Kotlin propagates the annotation to the property, backing field, constructor parameter, getter/setter, and to the record component if the annotation supports RECORD_COMPONENT.",
      "Make annotations work with record components: To use an annotation on both Kotlin properties and Java record components, add @Target for Kotlin (e.g. CLASS, PROPERTY) and @java.lang.annotation.Target for Java (e.g. ElementType.CLASS, ElementType.RECORD_COMPONENT) on your annotation class.",
    ],
    codeExamples: [
      {
        code: `// Java
public record Person(String name, int age) {}

// Kotlin – use like a class with properties
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
val years = newPerson.age`,
        comment: "Java record components are accessed as properties in Kotlin.",
      },
      {
        code: `@JvmRecord
data class Person(val name: String, val age: Int)

// Generates JVM record: private final fields, constructor,
// equals/hashCode/toString, accessors per component.`,
        comment: "@JvmRecord makes the data class compile to a Java record.",
      },
      {
        code: `// Requirements for @JvmRecord:
// - jvmTarget 16+ (or 15 with -Xjvm-enable-preview)
// - No explicit superclass (can implement interfaces)
// - No extra backing-field properties
// - No mutable backing-field properties
// - Not a local class
// - Primary constructor visibility = class visibility`,
        comment: "Data class must satisfy these to use @JvmRecord.",
      },
      {
        code: `// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}

@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)`,
        comment: "Enable @all with -Xannotation-target-all; use @all:Annotation on component.",
      },
      {
        code: `@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass

@JvmRecord
data class Person(val name: String, @ExampleClass val age: Int)`,
        comment: "Annotation with RECORD_COMPONENT target works on Java record components.",
      },
    ],
    defaultCode: `// Using Java records in Kotlin
// If you have a Java record: public record Person(String name, int age) {}
// In Kotlin you use it like:
//   val p = Person("Kotlin", 10)
//   println(p.name)  // Kotlin
//   println(p.age)   // 10

// Kotlin data class as JVM record (requires jvmTarget 16+)
// @JvmRecord
// data class Person(val name: String, val age: Int)

fun main() {
    // Simulate using a record-like data class
    data class Person(val name: String, val age: Int)
    val p = Person("Kotlin", 10)
    println("\${p.name}, \${p.age}")
}`,
    practice: [],
  },
  {
    id: "strings-java-kotlin",
    step: 5,
    title: "Strings in Java and Kotlin",
    nextStep: "collections-java-kotlin",
    prevStep: "using-java-records-in-kotlin",
    content: [
      "This guide shows how to do typical string tasks in Java and Kotlin, to help you migrate and write idiomatic Kotlin.",
      "Concatenate strings: In Java use + to concatenate. In Kotlin use string templates: $variable for simple values and \${expression} for expressions (e.g. \${name.length}).",
      "Build a string: In Java use StringBuilder and append(). In Kotlin use buildString { } – an inline function that gives you a StringBuilder as implicit this inside the lambda. Under the hood it uses the same StringBuilder as Java.",
      "Create a string from collection items: In Java use Stream with filter(), map(), and Collectors.joining(). In Kotlin use filter {}, map/transform, and joinToString(separator) with an optional transform lambda. For spaces after delimiters, include them in the separator in Java; in Kotlin you can do the same.",
      "Set default value if the string is blank: In Java use the ternary operator (value.isBlank() ? default : value). In Kotlin use the inline ifBlank { default } extension.",
      "Replace characters at the beginning and end: In Java use replaceAll() with regex (e.g. \"^##|##$\"). In Kotlin use removeSurrounding(delimiter) with a literal string.",
      "Replace occurrences: In Java use Pattern and Matcher (e.g. replaceAll()). In Kotlin use the Regex class and regex.replace(input, replacement). Use raw (multiline) strings \"\"\"...\"\"\" to simplify regex patterns and reduce backslashes.",
      "Split a string: In Java split() takes a regex, so you need \"\\\\.\" to split on a period. In Kotlin split() can take varargs of literal delimiters: split(\".\"). For regex, use the overload that accepts a Regex.",
      "Take a substring: In Java use substring(indexOf(\"?\") + 1). In Kotlin use substringAfter(\"?\") or substringAfterLast(\",\") so you don't need to compute indices.",
      "Multiline strings: Before Java 15, use String.join(lineSeparator, ...). In Java 15+ use text blocks \"\"\"...\"\"\"; if the closing \"\"\" is on the next line you get an extra newline. In Kotlin use \"\"\"...\"\"\".trimIndent() – the left-most character defines the line start; trim indents explicitly. Use trimMargin(\"#\") to customize the margin character. Add an empty line explicitly if you want an extra blank line.",
      "What's next? Look through other Kotlin idioms, use the Java to Kotlin converter, or share your favorite idiom.",
    ],
    codeExamples: [
      {
        code: `// Java: "Hello, " + name; "Your name is " + name.length() + " characters long"
// Kotlin:
val name = "Joe"
println("Hello, $name")
println("Your name is \${name.length} characters long")`,
        comment: "String templates: $var and \${expression}.",
      },
      {
        code: `// Java: StringBuilder + append()
// Kotlin:
val countDown = buildString {
    for (i in 5 downTo 1) {
        append(i)
        appendLine()
    }
}
println(countDown)`,
        comment: "buildString { } uses StringBuilder as implicit this.",
      },
      {
        code: `// Java: stream().filter().map().collect(Collectors.joining("; "))
// Kotlin:
val numbers = listOf(1, 2, 3, 4, 5, 6)
val invertedOddNumbers = numbers
    .filter { it % 2 != 0 }
    .joinToString(separator = "; ") { "\${-it}" }
println(invertedOddNumbers)`,
        comment: "joinToString() with optional transform lambda.",
      },
      {
        code: `// Java: nameValue.isBlank() ? "John Doe" : nameValue
// Kotlin:
val name = getName().ifBlank { "John Doe" }
println(name)`,
        comment: "ifBlank { default } for default when blank.",
      },
      {
        code: `// Java: input.replaceAll("^##|##$", "")
// Kotlin:
val input = "##place##holder##"
val result = input.removeSurrounding("##")
println(result)  // place##holder`,
        comment: "removeSurrounding(delimiter) for literal prefix/suffix.",
      },
      {
        code: `// Java: Pattern + Matcher replaceAll()
// Kotlin:
val regex = Regex("""\\w*\\d+\\w*""")
val input = "login: Pokemon5, password: 1q2w3e4r5t"
val replacementResult = regex.replace(input, "xxx")
println("Anonymized: '$replacementResult'")`,
        comment: "Regex class; raw string reduces backslashes in regex.",
      },
      {
        code: `// Java: "text".split("\\\\.")  // regex
// Kotlin:
println("Sometimes.text.should.be.split".split("."))`,
        comment: "split() accepts literal delimiters (varargs).",
      },
      {
        code: `// Java: input.substring(input.indexOf("?") + 1)
// Kotlin:
val input = "Question? 42"
val answer = input.substringAfter("?")
println(answer)  // " 42"

val text = "To be, or not to be, that is the question."
val question = text.substringAfterLast(",")
println(question)  // " that is the question."`,
        comment: "substringAfter() and substringAfterLast() avoid index math.",
      },
      {
        code: `// Kotlin multiline:
val result = """
    Kotlin
       Java
""".trimIndent()
println(result)

val withMargin = """
   |  Kotlin
   |  Java
""".trimMargin("|")
println(withMargin)`,
        comment: "trimIndent() / trimMargin() for multiline strings.",
      },
    ],
    defaultCode: `// Strings in Java and Kotlin
fun main() {
    val name = "Joe"
    println("Hello, $name")
    println("Your name is \${name.length} characters long")

    val countDown = buildString {
        for (i in 5 downTo 1) {
            append(i)
            appendLine()
        }
    }
    println(countDown)

    val numbers = listOf(1, 2, 3, 4, 5, 6)
    val invertedOdd = numbers
        .filter { it % 2 != 0 }
        .joinToString(separator = "; ") { "${"$"}{-it}" }
    println(invertedOdd)

    val input = "##place##holder##"
    println(input.removeSurrounding("##"))

    val answer = "Question? 42".substringAfter("?")
    println(answer)
}`,
    practice: [],
  },
  {
    id: "collections-java-kotlin",
    step: 6,
    title: "Collections in Java and Kotlin",
    nextStep: "nullability-java-kotlin",
    prevStep: "strings-java-kotlin",
    content: [
      "Collections are groups of a variable number of items that are significant to the problem and commonly operated on. This guide compares collection concepts and operations in Java and Kotlin to help you migrate and write idiomatic Kotlin.",
      "Operations that are the same: add/addAll vs +=; contains/containsAll vs in; isEmpty vs isNotEmpty(); removeIf, retainAll, clear; stream() vs sequences and map/filter; put/get vs map[key]=value and map[key]; containsKey/containsValue vs in; remove vs map -= key. For lists: indexOf, lastIndexOf; get/set vs list[index]; subList. Size: size() vs count() or size. Flatten: flatMap/collect vs flatten() or flatMap(). Map: stream().map().collect() vs map(). Reduce: stream().reduce() vs reduce() or fold(). Group and count: groupingBy(classifier, counting()) vs eachCount(). Filter: stream().filter().collect() vs filter(). Predicates: noneMatch/anyMatch/allMatch vs none(), any(), all(). Sort: sort(null) vs sort(); sort(comparator) vs sortDescending(). Take/skip: limit(N)/skip(N) vs take(N)/drop(N); takeWhile/dropWhile. Remove from list: remove(index) vs removeAt(index); remove(element) vs remove(element). Fill: Collections.fill() vs fill(). Distinct: stream().distinct().toList() vs distinct().",
      "Kotlin-only operations: zip(), unzip(); aggregate(); takeLast(), takeLastWhile(), dropLast(), dropLastWhile(); slice(), chunked(), windowed(); + and - operators.",
      "Mutability: In Java you cannot tell from the type whether a list is mutable (e.g. ArrayList), partially mutable (Arrays.asList – add fails at runtime), or immutable (Collections.unmodifiableList). In Kotlin you declare mutable (mutableListOf, add works) or read-only (listOf – add is a compile error).",
      "Covariance: In Java you need List<? extends Shape> to accept List<Rectangle>. In Kotlin read-only List<Shape> accepts List<Rectangle> because read-only collections are covariant. Maps are covariant on the value type. Mutable collections are not covariant.",
      "Ranges and progressions: In Java you compare versionIsInRange(v, min, max) manually. In Kotlin use Version(1,11)..Version(1,30) and v in versionRange.",
      "Comparison by several criteria: Java uses Comparator.comparing(Person::getName).thenComparingInt(Person::getAge). Kotlin uses compareBy(Person::name, Person::age) or sortedWith(compareBy(...)).",
      "Sequences: Java IntStream.iterate(1, e -> e+3).limit(10).sum(). Kotlin generateSequence(1) { it+3 }.take(10).sum(). Kotlin sequences are lazy.",
      "Removal: Java remove(1) removes by index; remove(Integer.valueOf(1)) by value. Kotlin removeAt(1) by index, remove(1) by value.",
      "First/last of possibly empty collection: Java check size and get(0)/get(size-1) or Deque.getFirst()/getLast(). Kotlin firstOrNull() ?: default, lastOrNull() ?: default.",
      "Create set from list: Java Set.copyOf(list). Kotlin list.toSet(). Group: Java Collectors.groupingBy(classifier). Kotlin groupBy(selector). Filter map: Java entrySet().stream().filter().collect(toMap()). Kotlin map.filter { (k,v) -> ... }. Filter by type: Java filter(it instanceof String) and cast. Kotlin filterIsInstance<String>(). Test predicates: none(), any(), all(). Zip: Java manual loop or records. Kotlin colors.zip(animals) { color, animal -> ... }. Associate: Java toMap(keyMapper, valueMapper). Kotlin associateWith { it.length } or associate().",
      "What's next? Kotlin Koans, other idioms, Java to Kotlin converter, discover collections.",
    ],
    codeExamples: [
      {
        code: `// Java: mutable vs unmodifiable – can't tell from type; fails at runtime
// Kotlin: explicit
val numbers = mutableListOf("one", "two", "three")
numbers.add("four")           // OK
val readOnly = listOf("one", "two")
// readOnly.add("three")      // Compilation error`,
        comment: "Read-only vs mutable is explicit in Kotlin; modification fails at compile time.",
      },
      {
        code: `// Java: List<? extends Shape> for covariance
// Kotlin: List<Shape> accepts List<Rectangle>
open class Shape(val name: String)
class Rectangle(name: String) : Shape(name)
fun doSthWithShapes(shapes: List<Shape>) {
    println(shapes.joinToString { it.name })
}
fun main() {
    val rectangles = listOf(Rectangle("r1"), Rectangle("r2"))
    doSthWithShapes(rectangles)
}`,
        comment: "Read-only collections are covariant; List<Rectangle> is a List<Shape>.",
      },
      {
        code: `// Java: versionIsInRange(v, min, max) with compareTo
// Kotlin:
data class Version(val major: Int, val minor: Int) : Comparable<Version> {
    override fun compareTo(other: Version) = compareValuesBy(this, other, Version::major, Version::minor)
}
fun main() {
    val range = Version(1, 11)..Version(1, 30)
    println(Version(0, 9) in range)
    println(Version(1, 20) in range)
}`,
        comment: "Ranges with Comparable; in operator for bounds check.",
      },
      {
        code: `// Java: Comparator.comparing(Person::getName).thenComparingInt(Person::getAge)
// Kotlin:
data class Person(val name: String, val age: Int)
fun main() {
    val persons = listOf(Person("Jack", 35), Person("David", 30), Person("Jack", 25))
    println(persons.sortedWith(compareBy(Person::name, Person::age)))
}`,
        comment: "compareBy() for multi-criteria sorting.",
      },
      {
        code: `// Java: IntStream.iterate(1, e -> e+3).limit(10).sum()
// Kotlin:
val sum = generateSequence(1) { it + 3 }.take(10).sum()
println(sum)  // 145`,
        comment: "Sequences are lazy; generateSequence + take + sum.",
      },
      {
        code: `// Java: remove(1) by index; remove(Integer.valueOf(1)) by value
// Kotlin:
val numbers = mutableListOf(1, 2, 3, 1)
numbers.removeAt(0)
println(numbers)  // [2, 3, 1]
numbers.remove(1)
println(numbers)  // [2, 3]`,
        comment: "removeAt(index) vs remove(element) – no ambiguity.",
      },
      {
        code: `// Java: list.size() > 0 then get(0), get(size-1)
// Kotlin:
val emails = listOf<String>()
val first = emails.firstOrNull() ?: ""
val last = emails.lastOrNull() ?: ""`,
        comment: "firstOrNull() / lastOrNull() with Elvis for default.",
      },
      {
        code: `// Java: Collectors.groupingBy(Request::getUrl)
// Kotlin:
data class Request(val url: String, val code: Int)
val requests = listOf(
    Request("https://a", 200), Request("https://a", 400), Request("https://b", 200)
)
println(requests.groupBy { it.url })`,
        comment: "groupBy() groups elements by key.",
      },
      {
        code: `// Java: stream().filter(it instanceof String).forEach(... cast)
// Kotlin:
val mixed = listOf(null, 1, "two", 3.0, "four")
mixed.filterIsInstance<String>().forEach { println(it.uppercase()) }`,
        comment: "filterIsInstance<T>() and smart cast.",
      },
      {
        code: `// Java: manual loop or Records for pairs
// Kotlin:
val colors = listOf("red", "brown")
val animals = listOf("fox", "bear", "wolf")
println(colors.zip(animals) { color, animal -> "The \${animal.replaceFirstChar { it.uppercase() }} is $color" })`,
        comment: "zip() with transform lambda.",
      },
      {
        code: `// Java: stream().collect(toMap(k -> k, String::length))
// Kotlin:
val words = listOf("one", "two", "three", "four")
println(words.associateWith { it.length })`,
        comment: "associateWith() builds map from collection.",
      },
    ],
    defaultCode: `// Collections in Java and Kotlin
fun main() {
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers += 4
    println(2 in numbers)
    numbers.removeAt(0)
    numbers.remove(1)
    println(numbers)

    val words = listOf("one", "two", "three", "four")
    println(words.associateWith { it.length })
    println(words.filter { it.length > 3 })
    println(words.any { it.endsWith("e") })
    println(words.none { it.isEmpty() })

    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")
    println(colors.zip(animals) { c, a -> "$a is $c" })

    val sum = generateSequence(1) { it + 3 }.take(5).sum()
    println(sum)
}`,
    practice: [],
  },
  {
    id: "nullability-java-kotlin",
    step: 7,
    title: "Nullability in Java and Kotlin",
    nextStep: "standard-input",
    prevStep: "collections-java-kotlin",
    content: [
      "Nullability is the ability of a variable to hold null. Dereferencing null causes NullPointerException. This guide covers how Java and Kotlin handle possibly nullable variables to help you migrate and write idiomatic Kotlin.",
      "Support for nullable types: Kotlin's main difference is explicit nullable types. Types are non-nullable by default; mark with ? (e.g. String?) when a value can be null. The compiler forbids calling methods on possibly null values at compile time, so many NPEs are prevented. At runtime nullable and non-nullable types are the same (no wrapper); checks are compile-time with minimal overhead.",
      "In Java, without null checks, methods can throw NPE. In Kotlin, stringLength(a: String) does not accept null – passing null is a compile error. For nullable arguments use String? and check inside (if (a != null) a.length else 0) or use the safe-call operator: a?.length ?: 0. After a successful check the compiler smart-casts to non-null in that scope.",
      "Platform types: Java types without nullability annotations are treated as platform types in Kotlin. The compiler allows all operations; you decide whether to null-check. NPE can still occur, and redundant null checks are not highlighted. Use JetBrains (@Nullable, @NotNull), JSpecify, or Eclipse annotations so Kotlin respects nullability.",
      "Definitely non-nullable types: To override a Java method with @NotNull parameters, use Kotlin's definitely non-nullable type T & Any (e.g. override fun load(x: T1 & Any): T1 & Any).",
      "Checking the result of a function call: Java if (order != null) processCustomer(order.getCustomer()). Kotlin order?.let { processCustomer(it.customer) } or findOrder()?.customer?.let(::processCustomer).",
      "Default values instead of null: Java if (order == null) order = new Order(...). Kotlin val order = findOrder() ?: Order(Customer(\"Antonio\")).",
      "Functions returning value or null: Java check index before get(i). Kotlin use firstOrNull(), getOrNull(index) so the API signals possible null.",
      "Aggregate operations: Java stream().max(Comparator).orElse(null). Kotlin maxOrNull(), minOrNull(), etc.",
      "Casting safely: Java instanceof then use. Kotlin as? String returns null on failure instead of ClassCastException. Prefer profile?.data as? String over as String? with manual null check.",
      "What's next? Other idioms, Java-to-Kotlin converter, Strings and Collections migration guides.",
    ],
    codeExamples: [
      {
        code: `// Java: stringLength(null) → NullPointerException
// Kotlin: non-null by default
fun stringLength(a: String) = a.length
// stringLength(null)  // Compile error: Null can not be a value of non-null type String

fun stringLengthNullable(a: String?): Int = a?.length ?: 0`,
        comment: "Non-null String rejects null; String? with safe-call and Elvis.",
      },
      {
        code: `// Java: if (order != null) processCustomer(order.getCustomer())
// Kotlin:
data class Order(val customer: Customer)
data class Customer(val name: String)
val order = findOrder()
order?.let { processCustomer(it.customer) }
// Shorter:
findOrder()?.customer?.let(::processCustomer)`,
        comment: "Safe-call ?. with let() for null-safe processing.",
      },
      {
        code: `// Java: if (order == null) order = new Order(new Customer("Antonio"));
// Kotlin:
val order = findOrder() ?: Order(Customer("Antonio"))`,
        comment: "Elvis operator ?: for default when null.",
      },
      {
        code: `// Java: check index before get(i); get(5) throws
// Kotlin:
val numbers = listOf(1, 2)
println(numbers.firstOrNull())
println(numbers.getOrNull(5))  // null`,
        comment: "firstOrNull(), getOrNull() signal possible null in the API.",
      },
      {
        code: `// Java: numbers.stream().max(Comparator.naturalOrder()).orElse(null)
// Kotlin:
val numbers = listOf<Int>()
println("Max: \${numbers.maxOrNull()}")`,
        comment: "maxOrNull(), minOrNull() return null for empty collections.",
      },
      {
        code: `// Java: y instanceof String x ? x.length() : -1
// Kotlin:
fun getStringLength(y: Any): Int {
    val x: String? = y as? String
    return x?.length ?: -1
}
// Prefer: profile?.data as? String instead of manual null check + as String?`,
        comment: "Safe cast as? returns null on failure; no ClassCastException.",
      },
    ],
    defaultCode: `// Nullability in Java and Kotlin
data class Order(val customer: Customer)
data class Customer(val name: String)

fun stringLength(a: String?): Int = a?.length ?: 0

fun main() {
    println(stringLength("hello"))
    println(stringLength(null))

    val numbers = listOf(1, 2, 3)
    println(numbers.firstOrNull())
    println(numbers.getOrNull(10))
    println(numbers.maxOrNull())

    val y: Any = 42
    val s: String? = y as? String
    println(s?.length ?: -1)
}`,
    practice: [],
  },
  {
    id: "standard-input",
    step: 8,
    title: "Standard input",
    prevStep: "nullability-java-kotlin",
    content: [
      "Java Scanner is slow; use it only when you need its specific features (e.g. hasNext(), useDelimiter()). Otherwise prefer Kotlin's readln() to read standard input.",
      "Read with Java Scanner: In Java you use System.in, import Scanner, create Scanner(System.in), and call nextLine(), nextInt(), etc. Always call close() when finished to release resources.",
      "Use Java Scanner in Kotlin: Kotlin interoperates with Java, so you can use java.util.Scanner. Initialize with Scanner(System.`in`) – the backtick on in is required because in is a Kotlin keyword. Use nextLine(), next(), nextInt() and other methods as in Java.",
      "Other Scanner methods: hasNext() returns true if more data is available. useDelimiter(pattern) sets the delimiter (default is whitespace; e.g. useDelimiter(\",\") for comma-separated input). close() closes the stream; always call it when done.",
      "Read with readln(): In Kotlin, readln() is the simplest way to read from standard input. It reads one line and returns it as a String. Use readln().toInt() (or toLong(), toDouble(), etc.) to parse numbers. See the Kotlin docs for more on standard input.",
    ],
    codeExamples: [
      {
        code: `// Java
import java.util.Scanner;
Scanner scanner = new Scanner(System.in);
String line = scanner.nextLine();
int number = scanner.nextInt();
scanner.close();`,
        comment: "Java: System.in, nextLine(), nextInt(), then close().",
      },
      {
        code: `// Kotlin – using Java Scanner
import java.util.Scanner

fun main() {
    val scanner = Scanner(System.\`in\`)
    val line = scanner.nextLine()
    val string = scanner.next()
    val num = scanner.nextInt()
    scanner.close()
}`,
        comment: "System.`in` – backtick required because 'in' is a Kotlin keyword.",
      },
      {
        code: `// Kotlin – preferred: readln()
val name = readln()
val age = readln().toInt()
println("Hello, $name! You are $age years old.")`,
        comment: "readln() returns a String; use .toInt() etc. to parse numbers.",
      },
    ],
    defaultCode: `// Standard input – use readln() unless you need Scanner features
fun main() {
    // readln() reads one line as String
    val name = readln()
    val age = readln().toInt()
    println("Hello, $name! You are $age years old.")
}`,
    practice: [],
  },
];

export function getKotlinInteropLessonById(id: string): KotlinInteropLesson | undefined {
  return KOTLIN_JAVA_INTEROP_LESSONS.find((l) => l.id === id);
}

export function getKotlinInteropLessonByStep(step: number): KotlinInteropLesson | undefined {
  return KOTLIN_JAVA_INTEROP_LESSONS.find((l) => l.step === step);
}
