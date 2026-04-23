/**
 * Mathematics for Machine Learning - Interactive Course Data
 *
 * Lessons 1-9: Chapter 1 (Introduction) + Chapter 2 (Linear Algebra).
 * Follows the same buildLessons() pattern used by reactCourseData.ts:
 * lessons are declared without ids/step/next/prev, and those fields are
 * auto-assigned by buildMMLLessons().
 */

import type { MMLLesson } from "./mmlTypes";

type RawMMLLesson = Omit<MMLLesson, "id" | "step" | "nextStep" | "prevStep">;

function buildMMLLessons(): MMLLesson[] {
  const raw: RawMMLLesson[] = [
    // =========================================================================
    // LESSON 1 — Chapter 1: Introduction and Motivation
    // =========================================================================
    {
      title: "Why Math for Machine Learning",
      titleEs: "Por qué necesitamos matemáticas para Machine Learning",
      chapter: "Introduction and Motivation",
      chapterEs: "Introducción y motivación",
      chapterNumber: 1,
      content: [
        "Machine learning is, at its core, a **mathematical conversation with data**. When you train a neural network, fit a regression model, or cluster a dataset, you are really asking a question in the language of linear algebra, calculus, probability, and optimization. Without that language, the field collapses into a pile of opaque APIs: you can call `model.fit(X, y)` but you cannot reason about *why* it works, *when* it breaks, or *how* to fix it.",
        "The four mathematical pillars you will meet in this course map almost one-to-one onto ML ideas. **Linear algebra** gives us vectors and matrices — the natural representation for features, weights, and images. **Analytic geometry** equips those vectors with distance, angle, and projection, which underpin similarity, loss, and regularization. **Matrix decompositions** (eigen, SVD, PCA) unlock dimensionality reduction and numerical stability. Finally, **vector calculus** turns learning into an optimization problem: every gradient descent step is a directional derivative of a loss function.",
        "Consider a simple example: linear regression. The model is $\\hat{y} = \\mathbf{w}^\\top \\mathbf{x} + b$. To even write this down we need **vectors** ($\\mathbf{x}$, $\\mathbf{w}$), the **dot product** ($\\mathbf{w}^\\top \\mathbf{x}$), a **loss function** (squared error), and a way to **minimize** it (either a closed-form solution using the pseudo-inverse, or an iterative gradient method). Every one of those ingredients is a chapter in this book.",
        "Probability and statistics deserve special mention. Machine learning is largely the art of making decisions under uncertainty: we do not get to see the true data-generating process, only samples from it. Concepts like *random variables*, *likelihood*, *Bayes' rule*, and *expected loss* are what distinguish a principled learner from a curve-fitting machine. Later chapters will introduce these tools and use them to build linear regression, PCA, Gaussian mixture models, and support vector machines from first principles.",
        "**Worked example — a prediction from linear regression:** Suppose $\\mathbf{w} = (2, -1)$, $b = 0.5$, and a single data point $\\mathbf{x} = (3, 4)$. The prediction is $\\hat{y} = \\mathbf{w}^\\top \\mathbf{x} + b = 2\\cdot 3 + (-1)\\cdot 4 + 0.5 = 6 - 4 + 0.5 = 2.5$. Every piece — the dot product, the addition, the choice of $\\mathbf{w}$ — comes from linear algebra and optimization working together.",
        "**Worked example — one step of gradient descent:** For loss $L(w) = w^2$, the derivative is $L'(w) = 2w$. Starting at $w_0 = 3$ with learning rate $\\eta = 0.1$, one step gives $w_1 = w_0 - \\eta L'(w_0) = 3 - 0.1 \\cdot 6 = 2.4$. Repeat: $w_2 = 2.4 - 0.1 \\cdot 4.8 = 1.92$. The parameter is marching toward the minimum at $w = 0$ — calculus in action.",
        "A final word on mindset. The math here is not a gatekeeping ritual — it is a **toolbox**. You do not need to memorize proofs to use the tools, but you do need enough intuition to pick the right one. Throughout this course we pair each concept with a visualization, an interactive exercise, and a concrete ML connection, so the symbols stay tethered to the problems they solve.",
      ],
      contentEs: [
        "El machine learning es, en esencia, una **conversación matemática con datos**. Cuando entrenas una red neuronal, ajustas un modelo de regresión o agrupas un conjunto de datos, en realidad estás formulando una pregunta en el lenguaje del álgebra lineal, el cálculo, la probabilidad y la optimización. Sin ese lenguaje, el campo se reduce a un montón de APIs opacas: puedes llamar a `model.fit(X, y)`, pero no puedes razonar sobre *por qué* funciona, *cuándo* se rompe o *cómo* arreglarlo.",
        "Los cuatro pilares matemáticos que encontrarás en este curso se corresponden casi uno a uno con ideas de ML. El **álgebra lineal** nos da vectores y matrices — la representación natural de características, pesos e imágenes. La **geometría analítica** equipa a esos vectores con distancia, ángulo y proyección, que son la base de la similitud, la pérdida y la regularización. Las **descomposiciones matriciales** (autovalores, SVD, PCA) abren la reducción de dimensión y la estabilidad numérica. Finalmente, el **cálculo vectorial** convierte el aprendizaje en un problema de optimización: cada paso del descenso por gradiente es una derivada direccional de una función de pérdida.",
        "Considera un ejemplo simple: la regresión lineal. El modelo es $\\hat{y} = \\mathbf{w}^\\top \\mathbf{x} + b$. Solo para escribir esto necesitamos **vectores** ($\\mathbf{x}$, $\\mathbf{w}$), el **producto punto** ($\\mathbf{w}^\\top \\mathbf{x}$), una **función de pérdida** (error cuadrático) y una forma de **minimizarla** (ya sea una solución cerrada mediante la pseudo-inversa o un método iterativo del gradiente). Cada uno de esos ingredientes es un capítulo de este libro.",
        "La probabilidad y la estadística merecen una mención especial. El machine learning es en gran medida el arte de tomar decisiones bajo incertidumbre: no vemos el verdadero proceso generador de datos, solo muestras. Conceptos como *variables aleatorias*, *verosimilitud*, *regla de Bayes* y *pérdida esperada* son los que distinguen a un aprendiz riguroso de una máquina de ajuste de curvas. Capítulos posteriores introducirán estas herramientas para construir regresión lineal, PCA, mezclas gaussianas y SVM desde primeros principios.",
        "**Ejemplo trabajado — una predicción de regresión lineal:** Supón $\\mathbf{w} = (2, -1)$, $b = 0.5$ y un único punto $\\mathbf{x} = (3, 4)$. La predicción es $\\hat{y} = \\mathbf{w}^\\top \\mathbf{x} + b = 2\\cdot 3 + (-1)\\cdot 4 + 0.5 = 6 - 4 + 0.5 = 2.5$. Cada pieza — el producto punto, la suma, la elección de $\\mathbf{w}$ — proviene del álgebra lineal y la optimización trabajando juntas.",
        "**Ejemplo trabajado — un paso de descenso por gradiente:** Para la pérdida $L(w) = w^2$, la derivada es $L'(w) = 2w$. Partiendo de $w_0 = 3$ con tasa de aprendizaje $\\eta = 0.1$, un paso da $w_1 = w_0 - \\eta L'(w_0) = 3 - 0.1 \\cdot 6 = 2.4$. Repite: $w_2 = 2.4 - 0.1 \\cdot 4.8 = 1.92$. El parámetro avanza hacia el mínimo en $w = 0$ — cálculo en acción.",
        "Una palabra final sobre la actitud. Las matemáticas aquí no son un ritual de guardabarreras — son una **caja de herramientas**. No necesitas memorizar demostraciones para usar las herramientas, pero sí necesitas suficiente intuición para escoger la correcta. A lo largo del curso emparejamos cada concepto con una visualización, un ejercicio interactivo y una conexión concreta con ML, para que los símbolos nunca se desliguen de los problemas que resuelven.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "A loss landscape in one dimension",
          titleEs: "Un paisaje de pérdida en una dimensión",
          description: "Learning is optimization. Here the curve $L(w) = w^2$ shows a convex loss; training moves the parameter $w$ toward the minimum at $w = 0$.",
          descriptionEs: "Aprender es optimizar. Aquí la curva $L(w) = w^2$ muestra una pérdida convexa; el entrenamiento mueve el parámetro $w$ hacia el mínimo en $w = 0$.",
          config: {
            fn: "x^2",
            domain: [-3, 3],
            showTangent: true,
          },
        },
        {
          type: "vector-2d",
          title: "Features as vectors",
          titleEs: "Características como vectores",
          description: "A data point with two features is just a 2D vector. ML algorithms manipulate millions of these at once.",
          descriptionEs: "Un punto de datos con dos características es simplemente un vector 2D. Los algoritmos de ML manipulan millones de estos a la vez.",
          config: {
            vectors: [[3, 2], [1, -1], [-2, 2]],
            labels: ["x₁", "x₂", "x₃"],
            showSum: false,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which mathematical area most directly describes how a neural network updates its weights during training?",
          questionEs: "¿Qué área matemática describe más directamente cómo una red neuronal actualiza sus pesos durante el entrenamiento?",
          options: [
            "Graph theory",
            "Vector calculus (gradients and partial derivatives)",
            "Number theory",
            "Set theory only",
          ],
          optionsEs: [
            "Teoría de grafos",
            "Cálculo vectorial (gradientes y derivadas parciales)",
            "Teoría de números",
            "Solo teoría de conjuntos",
          ],
          correctIndex: 1,
          hint: "Training minimizes a loss function by taking small steps in a direction that reduces it.",
          hintEs: "El entrenamiento minimiza una función de pérdida dando pequeños pasos en una dirección que la reduce.",
          explanation: "Gradient descent relies on **vector calculus**: the gradient $\\nabla L$ tells us the direction of steepest ascent, and we step in the opposite direction. Linear algebra represents the weights, but the *update rule itself* is calculus.",
          explanationEs: "El descenso por gradiente se apoya en el **cálculo vectorial**: el gradiente $\\nabla L$ nos dice la dirección de mayor ascenso, y nos movemos en la dirección opuesta. El álgebra lineal representa los pesos, pero la *regla de actualización en sí* es cálculo.",
        },
        {
          type: "drag-to-match",
          question: "Match each ML idea to its underlying mathematical pillar.",
          questionEs: "Empareja cada idea de ML con su pilar matemático subyacente.",
          leftItems: [
            "PCA (finding principal directions)",
            "Gradient descent",
            "Bayesian inference",
            "Representing an image as a flat array of pixel values",
          ],
          rightItems: [
            "Linear algebra / matrix decomposition",
            "Vector calculus",
            "Probability",
            "Vectors / linear algebra",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
          hint: "Each pillar shows up in a specific algorithmic role.",
          hintEs: "Cada pilar aparece en un rol algorítmico específico.",
          explanation: "PCA diagonalizes a covariance matrix (decomposition), gradient descent differentiates a loss (calculus), Bayesian methods reason with distributions (probability), and feature vectors live in linear-algebra land.",
          explanationEs: "PCA diagonaliza una matriz de covarianza (descomposición), el descenso por gradiente deriva una pérdida (cálculo), los métodos bayesianos razonan con distribuciones (probabilidad) y los vectores de características viven en el reino del álgebra lineal.",
        },
        {
          type: "multiple-choice",
          question: "Why is it not enough to 'just use libraries' without understanding the math?",
          questionEs: "¿Por qué no basta con 'simplemente usar librerías' sin entender las matemáticas?",
          options: [
            "Libraries are often incorrect.",
            "Without math you cannot diagnose failures, pick appropriate models, or adapt methods to new problems.",
            "Math is required to run the code at all.",
            "There is no real reason — libraries are sufficient.",
          ],
          optionsEs: [
            "Las librerías suelen ser incorrectas.",
            "Sin matemáticas no puedes diagnosticar fallos, elegir modelos adecuados ni adaptar métodos a problemas nuevos.",
            "Las matemáticas son necesarias para ejecutar el código.",
            "No hay razón real — las librerías son suficientes.",
          ],
          correctIndex: 1,
          hint: "Think about what happens when your model underfits, diverges, or gives strange predictions.",
          hintEs: "Piensa en qué pasa cuando tu modelo subajusta, diverge o da predicciones extrañas.",
          explanation: "Libraries are excellent at *executing* known recipes. Mathematical literacy is what lets you **debug, extend, and choose between** them — exactly the skills separating practitioners from power users.",
          explanationEs: "Las librerías son excelentes *ejecutando* recetas conocidas. La alfabetización matemática es lo que te permite **depurar, extender y elegir** entre ellas — exactamente las habilidades que distinguen a un practicante de un usuario avanzado.",
        },
      ],
      keyTakeaways: [
        "ML rests on four pillars: linear algebra, analytic geometry, matrix decompositions, and vector calculus, plus probability.",
        "Every ML algorithm can be traced back to concrete mathematical objects — vectors, matrices, functions, and distributions.",
        "Math is a toolbox for diagnosis and design, not just theory for its own sake.",
      ],
      keyTakeawaysEs: [
        "El ML descansa sobre cuatro pilares: álgebra lineal, geometría analítica, descomposiciones matriciales y cálculo vectorial, más probabilidad.",
        "Todo algoritmo de ML puede rastrearse hasta objetos matemáticos concretos: vectores, matrices, funciones y distribuciones.",
        "Las matemáticas son una caja de herramientas para diagnóstico y diseño, no teoría por la teoría.",
      ],
    },

    // =========================================================================
    // LESSON 2 — Chapter 2.1: Systems of Linear Equations
    // =========================================================================
    {
      title: "Systems of Linear Equations",
      titleEs: "Sistemas de Ecuaciones Lineales",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "A **system of linear equations** is a collection of equations in which each unknown appears only to the first power and is never multiplied by another unknown. A familiar example is $2x + 3y = 7$ and $x - y = 1$. The word *linear* means each equation traces out a flat object: a line in two dimensions, a plane in three, and a **hyperplane** in higher dimensions.",
        "Why do machine learners care? Because fitting a linear model is literally solving a system. Given training examples $(\\mathbf{x}_i, y_i)$, the least-squares regression problem asks for a weight vector $\\mathbf{w}$ such that $X\\mathbf{w} \\approx \\mathbf{y}$, where $X$ stacks the feature vectors as rows. When $X$ is square and invertible the system has a unique solution; when it is not (the common case in ML), we fall back on approximation via the *normal equations* — still a linear system.",
        "Every linear system has one of three possible **outcomes**: a unique solution, no solution, or infinitely many solutions. Geometrically in 2D, two lines can meet at a single point (unique), be parallel and never meet (none), or coincide entirely (infinite). This trichotomy generalizes perfectly to higher dimensions and is the reason we care about concepts like **rank** and **consistency** later on.",
        "A compact way to write a linear system is $A\\mathbf{x} = \\mathbf{b}$, where $A$ is the **coefficient matrix**, $\\mathbf{x}$ is the vector of unknowns, and $\\mathbf{b}$ is the constants vector. This notation is not just shorthand — it reveals structure. Many properties of the solution set (existence, uniqueness) can be read off from $A$ alone, before we ever start solving. That is the power of moving from equations to matrices.",
        "**Worked example — a unique solution:** Solve $2x + 3y = 7$ and $x - y = 1$. From the second equation, $x = y + 1$. Substituting: $2(y+1) + 3y = 7 \\Rightarrow 5y + 2 = 7 \\Rightarrow y = 1$, so $x = 2$. The unique intersection point is $(2, 1)$ — check: $2\\cdot 2 + 3\\cdot 1 = 7$ ✓ and $2 - 1 = 1$ ✓.",
        "**Worked example — no solution (parallel lines):** Consider $x + y = 2$ and $2x + 2y = 5$. The second equation is $2(x+y) = 5$, i.e. $x + y = 2.5$. But the first says $x + y = 2$. These cannot both hold, so the system is **inconsistent** — geometrically two parallel lines that never meet.",
        "**ML connection — normal equations:** For the regression system $X\\mathbf{w} = \\mathbf{y}$ with $X \\in \\mathbb{R}^{100 \\times 5}$, there are 100 equations but only 5 unknowns — usually no exact solution exists. The normal equations $X^\\top X \\mathbf{w} = X^\\top \\mathbf{y}$ are a *square* $5\\times 5$ linear system whose unique solution (when $X$ has full column rank) is the least-squares fit.",
        "Solving a system by hand usually means **Gaussian elimination**: repeated row operations that simplify $A$ into an upper-triangular form, followed by back-substitution. We will formalize this in the next lesson. The key takeaway for now: a linear system is a geometric intersection problem, a matrix equation, and a solvable algorithmic puzzle — three viewpoints on the same object.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Two equations, one intersection",
          description: "The equations $2x + 3y = 7$ and $x - y = 1$ meet at $(2, 1)$. Each line is one equation; their crossing point is the unique solution.",
          config: {
            vectors: [[2, 1]],
            labels: ["solution (2,1)"],
            showSum: false,
          },
        },
        {
          type: "matrix-transform-2d",
          title: "The coefficient matrix as a transformation",
          description: "Solving $A\\mathbf{x} = \\mathbf{b}$ asks: which input $\\mathbf{x}$ does $A$ send to $\\mathbf{b}$? Here we visualize the action of a $2\\times 2$ matrix on the plane.",
          config: {
            matrix: [
              [2, 3],
              [1, -1],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "vector-input",
          question: "Solve the system: $x + y = 5$ and $x - y = 1$. Enter $(x, y)$.",
          dimensions: 2,
          answer: [3, 2],
          tolerance: 0.01,
          showPreview: true,
          hint: "Add the two equations to eliminate $y$.",
          explanation: "Adding: $2x = 6 \\Rightarrow x = 3$. Substituting: $3 + y = 5 \\Rightarrow y = 2$. The two lines meet at $(3, 2)$.",
        },
        {
          type: "multiple-choice",
          question: "A system of two equations in two unknowns has lines that are parallel but distinct. How many solutions does it have?",
          options: ["Exactly one", "None", "Infinitely many", "Cannot be determined"],
          correctIndex: 1,
          hint: "Parallel lines that never meet share no points.",
          explanation: "Distinct parallel lines never intersect, so there is no $(x, y)$ satisfying both equations — the system is **inconsistent**. This corresponds to the column vector $\\mathbf{b}$ lying outside the column space of $A$.",
        },
        {
          type: "multiple-choice",
          question: "In $A\\mathbf{x} = \\mathbf{b}$, what do the columns of $A$ represent geometrically when the system is solvable?",
          options: [
            "The solution vector directly",
            "A basis of vectors whose linear combinations can produce $\\mathbf{b}$",
            "The eigenvalues of the system",
            "The rows of $\\mathbf{b}$",
          ],
          correctIndex: 1,
          hint: "The matrix-vector product $A\\mathbf{x}$ is a weighted sum of the columns of $A$.",
          explanation: "$A\\mathbf{x} = x_1 \\mathbf{a}_1 + x_2 \\mathbf{a}_2 + \\dots$ — the system is solvable exactly when $\\mathbf{b}$ lies in the **column space** of $A$. The components of $\\mathbf{x}$ are the coefficients of that combination.",
        },
      ],
      keyTakeaways: [
        "A linear system $A\\mathbf{x}=\\mathbf{b}$ has either 0, 1, or infinitely many solutions.",
        "Geometrically, each equation is a hyperplane; solutions are their intersection.",
        "Linear regression and many ML methods reduce to solving (or approximating) a linear system.",
      ],
      keyTakeawaysEs: [
        "Un sistema lineal $A\mathbf{x}=\mathbf{b}$ tiene 0, 1 o infinitas soluciones.",
        "Geométricamente, cada ecuación es un hiperplano; las soluciones son su intersección.",
        "La regresión lineal y muchos métodos de ML se reducen a resolver (o aproximar) un sistema lineal.",
      ],
    },

    // =========================================================================
    // LESSON 3 — Chapter 2.2: Matrices
    // =========================================================================
    {
      title: "Matrices",
      titleEs: "Matrices",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "A **matrix** is a rectangular array of numbers arranged into rows and columns. We denote an $m \\times n$ matrix as $A \\in \\mathbb{R}^{m \\times n}$, where $m$ is the number of rows and $n$ is the number of columns. The entry in row $i$ and column $j$ is written $a_{ij}$. In machine learning, a dataset with $m$ examples and $n$ features is usually stored as such a matrix — often called the **design matrix**.",
        "Matrices support three fundamental operations. **Addition** and **scalar multiplication** work entry-wise and require matching dimensions (for addition). **Matrix multiplication**, in contrast, is subtler. The product $AB$ is defined only when the number of columns of $A$ equals the number of rows of $B$, and the $(i,j)$ entry of $AB$ is the dot product of row $i$ of $A$ with column $j$ of $B$: $(AB)_{ij} = \\sum_{k} a_{ik} b_{kj}$.",
        "Matrix multiplication is **not commutative**: in general $AB \\neq BA$, even when both products are defined. It is, however, **associative** ($(AB)C = A(BC)$) and **distributive** over addition. These algebraic laws are what let us factor, rearrange, and decompose expressions in ML — for example, when deriving the normal equations $(X^\\top X)\\mathbf{w} = X^\\top \\mathbf{y}$.",
        "Special matrices show up everywhere. The **identity matrix** $I_n$ has ones on the diagonal and zeros elsewhere; it satisfies $IA = AI = A$. The **transpose** $A^\\top$ flips rows and columns, and $(AB)^\\top = B^\\top A^\\top$. A matrix is **symmetric** if $A = A^\\top$ (covariance matrices are always symmetric), **diagonal** if only the diagonal is non-zero, and **orthogonal** if $A^\\top A = I$ (orthogonal matrices preserve lengths and angles — think rotations and reflections).",
        "The **inverse** $A^{-1}$, when it exists, satisfies $A A^{-1} = A^{-1} A = I$. A matrix is **invertible** (also called *non-singular*) iff it is square and its columns are linearly independent. Not every matrix has an inverse — for the ones that do not, we reach for generalized inverses like the Moore–Penrose pseudo-inverse, which is the beating heart of least-squares solutions.",
        "**Worked example — matrix multiplication:** Let $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$ and $B = \\begin{pmatrix}0 & 1 \\\\ 1 & 0\\end{pmatrix}$. Then $AB = \\begin{pmatrix}1\\cdot 0 + 2\\cdot 1 & 1\\cdot 1 + 2\\cdot 0 \\\\ 3\\cdot 0 + 4\\cdot 1 & 3\\cdot 1 + 4\\cdot 0\\end{pmatrix} = \\begin{pmatrix}2 & 1 \\\\ 4 & 3\\end{pmatrix}$. Each entry is a row-of-$A$ dotted with a column-of-$B$.",
        "**Worked example — non-commutativity:** Using the same matrices, $BA = \\begin{pmatrix}0\\cdot 1 + 1\\cdot 3 & 0\\cdot 2 + 1\\cdot 4 \\\\ 1\\cdot 1 + 0\\cdot 3 & 1\\cdot 2 + 0\\cdot 4\\end{pmatrix} = \\begin{pmatrix}3 & 4 \\\\ 1 & 2\\end{pmatrix} \\neq AB$. So $AB \\neq BA$ — matrix multiplication order matters, unlike scalar multiplication.",
        "**Worked example — inverse of a 2×2:** For $A = \\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}$ with $ad - bc \\neq 0$, $A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix}$. For $A = \\begin{pmatrix}2 & 1 \\\\ 1 & 1\\end{pmatrix}$, $\\det = 2 - 1 = 1$, so $A^{-1} = \\begin{pmatrix}1 & -1 \\\\ -1 & 2\\end{pmatrix}$. Verify: $AA^{-1} = \\begin{pmatrix}1 & 0 \\\\ 0 & 1\\end{pmatrix} = I$ ✓.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "A matrix is a linear transformation",
          description: "This $2\\times 2$ matrix rotates and scales the plane. Every $A\\mathbf{x}$ sends a point to a new point according to these rules.",
          config: {
            matrix: [
              [1, 1],
              [0, 1],
            ],
            animateFromIdentity: true,
          },
        },
        {
          type: "matrix-transform-2d",
          title: "Rotation matrix (90 degrees)",
          description: "The matrix $\\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$ rotates vectors by 90° counter-clockwise. It is orthogonal: $A^\\top A = I$.",
          config: {
            matrix: [
              [0, -1],
              [1, 0],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "matrix-input",
          question: "Compute $AB$ where $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 5 & 6 \\\\ 7 & 8 \\end{pmatrix}$.",
          rows: 2,
          cols: 2,
          answer: [
            [19, 22],
            [43, 50],
          ],
          tolerance: 0.01,
          hint: "Each entry is a dot product of a row of $A$ with a column of $B$.",
          explanation: "Top-left: $1\\cdot 5 + 2\\cdot 7 = 19$. Top-right: $1\\cdot 6 + 2\\cdot 8 = 22$. Bottom-left: $3\\cdot 5 + 4\\cdot 7 = 43$. Bottom-right: $3\\cdot 6 + 4\\cdot 8 = 50$.",
        },
        {
          type: "matrix-input",
          question: "What is the transpose of $\\begin{pmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{pmatrix}$?",
          rows: 3,
          cols: 2,
          answer: [
            [1, 4],
            [2, 5],
            [3, 6],
          ],
          tolerance: 0.01,
          hint: "Rows become columns.",
          explanation: "The transpose swaps rows and columns, so a $2 \\times 3$ matrix becomes $3 \\times 2$. Entry $(i,j)$ moves to position $(j,i)$.",
        },
        {
          type: "multiple-choice",
          question: "Which statement about matrix multiplication is TRUE in general?",
          options: [
            "$AB = BA$ always",
            "$AB$ is defined for any two matrices",
            "$(AB)^\\top = B^\\top A^\\top$",
            "Every square matrix has an inverse",
          ],
          correctIndex: 2,
          hint: "Transposing a product reverses the order.",
          explanation: "Matrix multiplication is **not commutative**, and $AB$ requires the inner dimensions to match. The identity $(AB)^\\top = B^\\top A^\\top$ (note the reversed order) holds always. Only matrices with linearly independent columns are invertible.",
        },
      ],
      keyTakeaways: [
        "A matrix is both a data container and a linear transformation.",
        "Matrix multiplication is associative and distributive but **not commutative**.",
        "Special matrices — identity, diagonal, symmetric, orthogonal — each have properties that simplify ML algorithms.",
      ],
      keyTakeawaysEs: [
        "Una matriz es a la vez un contenedor de datos y una transformación lineal.",
        "La multiplicación de matrices es asociativa y distributiva pero **no conmutativa**.",
        "Las matrices especiales —identidad, diagonal, simétrica, ortogonal— tienen propiedades que simplifican los algoritmos de ML.",
      ],
    },

    // =========================================================================
    // LESSON 4 — Chapter 2.3: Solving Systems of Linear Equations
    // =========================================================================
    {
      title: "Solving Systems of Linear Equations",
      titleEs: "Resolución de Sistemas de Ecuaciones Lineales",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "Now that we have matrices, we can formalize how to *solve* $A\\mathbf{x} = \\mathbf{b}$. The canonical algorithm is **Gaussian elimination**. The idea: apply a sequence of **elementary row operations** to reduce $A$ (augmented with $\\mathbf{b}$) to an upper-triangular form called **row-echelon form**, then back-substitute. The three legal operations are swapping two rows, scaling a row by a non-zero constant, and adding a multiple of one row to another.",
        "A stronger target is **reduced row-echelon form (RREF)**: every pivot is 1, and each pivot column has zeros everywhere else. From RREF the solution (or the parametric family of solutions) can be read off directly. Because row operations correspond to multiplying by invertible elementary matrices, they do not change the solution set — just the ease of reading it.",
        "Variables corresponding to pivot columns are **basic variables**; the others are **free variables**. When every column has a pivot, the solution is unique. When some columns lack pivots, each free variable contributes an extra dimension to the solution set. When the augmented column has a pivot but the coefficient column does not (a row like $[0 \\, 0 \\, \\dots \\, 0 \\,|\\, 1]$), the system is inconsistent and has no solution.",
        "The **general solution** of a consistent system is $\\mathbf{x} = \\mathbf{x}_p + \\mathbf{x}_h$, where $\\mathbf{x}_p$ is any *particular* solution to $A\\mathbf{x} = \\mathbf{b}$ and $\\mathbf{x}_h$ is any solution to the *homogeneous* system $A\\mathbf{x} = \\mathbf{0}$. The homogeneous solutions form a vector space — the **null space** of $A$ — whose dimension equals the number of free variables. This structural view is central to later topics like rank and linear mappings.",
        "**Worked example — Gaussian elimination on a 3×3 system:** Solve $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$. Write the augmented matrix $\\left[\\begin{smallmatrix}1 & 1 & 1 & | & 6 \\\\ 2 & -1 & 1 & | & 3 \\\\ 1 & 2 & -1 & | & 2\\end{smallmatrix}\\right]$. R2 ← R2 − 2R1 gives row $(0, -3, -1\\,|\\,-9)$. R3 ← R3 − R1 gives $(0, 1, -2\\,|\\,-4)$. R3 ← R3 + R2/3 gives $(0, 0, -7/3\\,|\\,-7)$, so $z = 3$. Back-substitute: $-3y - 3 = -9 \\Rightarrow y = 2$, then $x + 2 + 3 = 6 \\Rightarrow x = 1$. Solution $(1, 2, 3)$ ✓.",
        "**Worked example — inconsistent system detected:** Consider $\\left[\\begin{smallmatrix}1 & 1 & | & 2 \\\\ 2 & 2 & | & 5\\end{smallmatrix}\\right]$. R2 ← R2 − 2R1 gives $(0, 0 \\,|\\, 1)$ — a row that reads $0 = 1$, which is impossible. The system has **no solution**. Seeing a row of zeros on the left with a non-zero right-hand side is the algebraic fingerprint of inconsistency.",
        "In practice, modern ML code uses numerically stable variants of Gaussian elimination: **LU decomposition** (factor $A = LU$ into lower and upper triangular matrices) and **QR decomposition** (factor $A = QR$ into orthogonal and upper-triangular). The LU approach powers most dense direct solvers; QR is more robust for least-squares problems. Under the hood, `numpy.linalg.solve` and `torch.linalg.solve` are doing exactly this.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Row operations preserve the solution set",
          description: "Elementary row operations change the matrix but not the solution. Here is the final triangular form after elimination.",
          config: {
            matrix: [
              [1, 2],
              [0, 1],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "vector-input",
          question: "Solve by elimination: $x + 2y = 5$, $3x + 4y = 11$. Enter $(x, y)$.",
          dimensions: 2,
          answer: [1, 2],
          tolerance: 0.01,
          showPreview: true,
          hint: "Subtract 3× the first equation from the second to eliminate $x$.",
          explanation: "R2 → R2 − 3·R1 gives $-2y = -4$, so $y = 2$. Back-substituting: $x + 4 = 5 \\Rightarrow x = 1$. The unique solution is $(1, 2)$.",
        },
        {
          type: "multiple-choice",
          question: "A $3 \\times 3$ system in RREF has two pivots. What does this tell you?",
          options: [
            "The system always has a unique solution.",
            "There is one free variable; the solution set (if consistent) is a line.",
            "The system has no solution regardless of $\\mathbf{b}$.",
            "The matrix is orthogonal.",
          ],
          correctIndex: 1,
          hint: "Free variables correspond to columns without a pivot.",
          explanation: "With 3 unknowns and 2 pivots, exactly one variable is free. The homogeneous solution set is 1-dimensional (a line through the origin), and the general solution — if the system is consistent — is a **parallel line**: $\\mathbf{x}_p + t \\mathbf{v}$.",
        },
        {
          type: "multiple-choice",
          question: "Which factorization is most commonly used under the hood of numerical linear solvers for square systems?",
          options: [
            "Eigendecomposition",
            "LU decomposition",
            "Singular Value Decomposition (always)",
            "Cholesky for every matrix",
          ],
          correctIndex: 1,
          hint: "It essentially stores the result of Gaussian elimination.",
          explanation: "**LU decomposition** ($A = LU$) records the elimination steps: $L$ holds the multipliers, $U$ is the echelon form. It is cheap to reuse across many right-hand sides. Cholesky is an LU specialization for symmetric positive-definite matrices, and SVD is heavier but more robust.",
        },
      ],
      keyTakeaways: [
        "Gaussian elimination + back-substitution solves any linear system or proves inconsistency.",
        "Solutions have the form $\\mathbf{x}_p + \\mathbf{x}_h$: a particular solution plus the null space.",
        "Real solvers use LU or QR decompositions for numerical stability and efficiency.",
      ],
      keyTakeawaysEs: [
        "La eliminación gaussiana + sustitución hacia atrás resuelve cualquier sistema lineal o demuestra que es inconsistente.",
        "Las soluciones tienen la forma $\mathbf{x}_p + \mathbf{x}_h$: una solución particular más el espacio nulo.",
        "Los resolvedores reales usan descomposiciones LU o QR por estabilidad numérica y eficiencia.",
      ],
    },

    // =========================================================================
    // LESSON 5 — Chapter 2.4: Vector Spaces
    // =========================================================================
    {
      title: "Vector Spaces",
      titleEs: "Espacios Vectoriales",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "So far we have worked with concrete vectors in $\\mathbb{R}^n$. The true power of linear algebra, however, comes from abstracting: a **vector space** over the real numbers is any set $V$ equipped with an addition and a scalar multiplication that satisfy eight familiar axioms (associativity, commutativity of addition, existence of a zero vector, existence of additive inverses, compatibility of scalar multiplication, two distributive laws, and the identity $1 \\cdot \\mathbf{v} = \\mathbf{v}$).",
        "This abstraction is not academic hairsplitting. Once a set obeys the axioms, *every theorem of linear algebra applies automatically*. The space of polynomials of degree ≤ $n$, the space of $m \\times n$ matrices, the space of continuous functions on $[0, 1]$ — all are vector spaces, and concepts like linear combinations, independence, and bases transfer wholesale.",
        "A **subspace** $U \\subseteq V$ is a subset that is itself a vector space under the inherited operations. Concretely, $U$ must contain the zero vector and be **closed under addition and scalar multiplication**: for any $\\mathbf{u}_1, \\mathbf{u}_2 \\in U$ and any scalar $\\lambda$, both $\\mathbf{u}_1 + \\mathbf{u}_2$ and $\\lambda \\mathbf{u}_1$ must still lie in $U$. A line through the origin in $\\mathbb{R}^2$ is a subspace; a line that misses the origin is not.",
        "Two subspaces attached to every matrix $A$ are cornerstones of ML. The **column space** (or *range*) is the span of $A$'s columns — exactly the set of $\\mathbf{b}$ for which $A\\mathbf{x} = \\mathbf{b}$ has a solution. The **null space** (or *kernel*) is the set of $\\mathbf{x}$ with $A\\mathbf{x} = \\mathbf{0}$ — the directions in input space that $A$ flattens to zero. The fundamental theorem of linear algebra relates their dimensions: the **rank-nullity theorem** states that for $A \\in \\mathbb{R}^{m\\times n}$, $\\dim(\\text{col}(A)) + \\dim(\\text{null}(A)) = n$.",
        "**Worked example — verifying a subspace:** Is $U = \\{(x, y, z) \\in \\mathbb{R}^3 : x + y + z = 0\\}$ a subspace? Check (1) zero: $(0,0,0)$ satisfies $0+0+0=0$ ✓. (2) Closure under addition: if $\\mathbf{u} = (u_1,u_2,u_3)$ and $\\mathbf{v} = (v_1,v_2,v_3)$ both satisfy the equation, then $(u_1+v_1)+(u_2+v_2)+(u_3+v_3) = 0 + 0 = 0$ ✓. (3) Scalar multiplication: $\\lambda u_1 + \\lambda u_2 + \\lambda u_3 = \\lambda \\cdot 0 = 0$ ✓. It's a 2-D plane through the origin.",
        "**Worked example — NOT a subspace:** The set $W = \\{(x, y) : x \\geq 0\\}$ is the right half-plane. It contains $(0,0)$ ✓, and sums of non-negative-$x$ vectors stay non-negative ✓, BUT $\\lambda = -1$ times $(1, 0)$ gives $(-1, 0) \\notin W$. **Not closed under scalar multiplication**, so not a subspace — it's only closed under non-negative scalars.",
        "**Worked example — rank-nullity numeric check:** For $A = \\begin{pmatrix}1 & 2 & 3 \\\\ 2 & 4 & 6\\end{pmatrix}$ ($m=2, n=3$), row 2 = 2·row 1, so rank = 1. By rank-nullity, nullity = $n - \\text{rank} = 3 - 1 = 2$. Indeed, any $(x, y, z)$ with $x + 2y + 3z = 0$ lies in $\\text{null}(A)$ — a 2-dimensional plane.",
        "Why should a machine learner care about subspaces? Because features live in them. When PCA reduces a dataset to its top $k$ directions, it projects onto a $k$-dimensional subspace. When a neural network's hidden layer has rank-deficient weights, certain input directions are collapsed and forever invisible to the rest of the network. Understanding subspaces is the key to diagnosing representational capacity.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "A subspace: line through the origin",
          description: "The span of $\\mathbf{v} = (2,1)$ is the set $\\{\\lambda \\mathbf{v} : \\lambda \\in \\mathbb{R}\\}$ — a 1-dimensional subspace of $\\mathbb{R}^2$.",
          config: {
            vectors: [[2, 1]],
            labels: ["v"],
            showSpan: true,
          },
        },
        {
          type: "vector-3d",
          title: "Vector spaces in 3D",
          description: "Three vectors in $\\mathbb{R}^3$. Their span is a subspace — either a line, a plane, or all of $\\mathbb{R}^3$, depending on independence.",
          config: {
            vectors: [
              [1, 0, 0],
              [0, 1, 0],
              [1, 1, 0],
            ],
            labels: ["e₁", "e₂", "v"],
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which of the following is NOT a subspace of $\\mathbb{R}^2$?",
          options: [
            "The line $y = 2x$",
            "The single point $\\{(0,0)\\}$",
            "The line $y = x + 1$",
            "All of $\\mathbb{R}^2$",
          ],
          correctIndex: 2,
          hint: "A subspace must contain the zero vector.",
          explanation: "The line $y = x + 1$ does not pass through the origin, so $\\mathbf{0}$ is not in it — disqualifying it as a subspace. The first, second, and fourth all contain the origin and are closed under the vector operations.",
        },
        {
          type: "multiple-choice",
          question: "For $A \\in \\mathbb{R}^{5 \\times 3}$ with $\\dim(\\text{null}(A)) = 1$, what is $\\dim(\\text{col}(A))$?",
          options: ["1", "2", "3", "5"],
          correctIndex: 1,
          hint: "Use the rank-nullity theorem with $n = 3$.",
          explanation: "Rank-nullity: $\\dim(\\text{col}(A)) + \\dim(\\text{null}(A)) = n = 3$. With nullity 1, the rank (column-space dimension) must be 2.",
        },
        {
          type: "drag-to-match",
          question: "Match each vector space with a natural basis.",
          leftItems: [
            "Polynomials of degree ≤ 2",
            "$\\mathbb{R}^3$",
            "$2 \\times 2$ diagonal matrices",
          ],
          rightItems: [
            "$\\{1, x, x^2\\}$",
            "$\\{\\mathbf{e}_1, \\mathbf{e}_2, \\mathbf{e}_3\\}$",
            "$\\{\\text{diag}(1,0), \\text{diag}(0,1)\\}$",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
          hint: "A basis needs to span the space and be independent.",
          explanation: "Each of these is a classic basis. Notice that polynomials and diagonal matrices are genuinely vector spaces — the abstraction pays off because the same theorems (independence, dimension, change of basis) apply to all of them.",
        },
      ],
      keyTakeaways: [
        "A vector space is any set with addition and scalar multiplication satisfying 8 axioms.",
        "A subspace must contain $\\mathbf{0}$ and be closed under the operations.",
        "Every matrix has a column space and a null space; their dimensions sum to $n$ (rank-nullity).",
      ],
      keyTakeawaysEs: [
        "Un espacio vectorial es todo conjunto con suma y multiplicación escalar que cumple 8 axiomas.",
        "Un subespacio debe contener $\mathbf{0}$ y ser cerrado bajo las operaciones.",
        "Toda matriz tiene un espacio columna y un espacio nulo; sus dimensiones suman $n$ (rango-nulidad).",
      ],
    },

    // =========================================================================
    // LESSON 6 — Chapter 2.5: Linear Independence
    // =========================================================================
    {
      title: "Linear Independence",
      titleEs: "Independencia Lineal",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "A set of vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_k\\}$ is **linearly independent** if the only way to form the zero vector as $\\lambda_1 \\mathbf{v}_1 + \\lambda_2 \\mathbf{v}_2 + \\dots + \\lambda_k \\mathbf{v}_k = \\mathbf{0}$ is with all $\\lambda_i = 0$. If any non-trivial combination gives zero, the vectors are **linearly dependent** and (at least) one is a redundant combination of the others.",
        "Independence is the mathematical statement of *non-redundancy*. Intuitively, $k$ independent vectors point in *genuinely different* directions, each contributing a dimension that the others cannot fake. Dependent vectors, by contrast, have overlap: one of them can be expressed using the rest, so removing it loses no information.",
        "There is a clean algorithmic test: form the matrix $A$ whose columns are the vectors $\\mathbf{v}_i$. The vectors are linearly independent iff the homogeneous system $A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution $\\mathbf{x} = \\mathbf{0}$ — equivalently, iff $A$ has full column rank, or (in the square case) iff $\\det(A) \\neq 0$. You can always run Gaussian elimination and count pivots: *number of pivots = number of independent columns*.",
        "Some quick facts that often show up in problems. Any set containing the zero vector is automatically dependent. Any set with more vectors than the dimension of the surrounding space is automatically dependent: you cannot have five independent vectors in $\\mathbb{R}^4$. A single non-zero vector is always independent.",
        "**Worked example — dependent pair:** Check if $\\mathbf{v}_1 = (1, 2)$ and $\\mathbf{v}_2 = (2, 4)$ are independent. Solve $\\lambda_1(1,2) + \\lambda_2(2,4) = (0,0)$. From the first coordinate, $\\lambda_1 + 2\\lambda_2 = 0$, so $\\lambda_1 = -2\\lambda_2$. Taking $\\lambda_2 = 1, \\lambda_1 = -2$ gives a non-trivial combination summing to zero — **dependent**. Indeed, $\\mathbf{v}_2 = 2\\mathbf{v}_1$.",
        "**Worked example — independent standard basis:** For $\\mathbf{e}_1 = (1, 0)$ and $\\mathbf{e}_2 = (0, 1)$, $\\lambda_1(1,0) + \\lambda_2(0,1) = (\\lambda_1, \\lambda_2) = (0,0)$ forces $\\lambda_1 = \\lambda_2 = 0$. Only the trivial combination works — **independent**. These two vectors span all of $\\mathbb{R}^2$.",
        "**Worked example — three vectors in $\\mathbb{R}^3$:** Are $(1,0,0), (1,1,0), (1,1,1)$ independent? Form the matrix with these as columns and compute the determinant: $\\det\\begin{pmatrix}1&1&1\\\\0&1&1\\\\0&0&1\\end{pmatrix} = 1\\cdot 1\\cdot 1 = 1 \\neq 0$ (upper triangular). Non-zero determinant ⟹ **independent**. They form a basis of $\\mathbb{R}^3$.",
        "In ML, linear independence of features matters enormously. If two columns of your design matrix $X$ are linearly dependent (e.g., `temperature_celsius` and `temperature_fahrenheit`), then $X^\\top X$ is singular and the ordinary least-squares solution is **not unique** — the model weights are ill-defined. This is the issue behind *multicollinearity* in regression, and it is also why regularization (ridge, lasso) is so often necessary in practice.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Independent vectors span the plane",
          description: "$(1,0)$ and $(0,1)$ point in genuinely different directions — their span is all of $\\mathbb{R}^2$.",
          config: {
            vectors: [
              [1, 0],
              [0, 1],
            ],
            labels: ["e₁", "e₂"],
            showSpan: true,
          },
        },
        {
          type: "vector-2d",
          title: "Dependent vectors collapse to a line",
          description: "$(1,1)$ and $(2,2)$ are scalar multiples — their span is a 1D line, not the full plane.",
          config: {
            vectors: [
              [1, 1],
              [2, 2],
            ],
            labels: ["v₁", "v₂=2v₁"],
            showSpan: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Are the vectors $(1, 2)$, $(2, 4)$, $(3, 0)$ in $\\mathbb{R}^2$ linearly independent?",
          options: [
            "Yes — there are three of them",
            "No — the first two are scalar multiples",
            "No — any 3 vectors in $\\mathbb{R}^2$ must be dependent",
            "Both B and C are correct",
          ],
          correctIndex: 3,
          hint: "There are two independent reasons a set can be dependent.",
          explanation: "$(2,4) = 2\\cdot(1,2)$, so those two alone are already dependent. Moreover, **any** set of 3 or more vectors in a 2-dimensional space is forced to be dependent by a counting argument.",
        },
        {
          type: "multiple-choice",
          question: "A $4 \\times 4$ matrix $A$ has determinant 0. What follows about its columns?",
          options: [
            "They are linearly independent.",
            "They span $\\mathbb{R}^4$.",
            "They are linearly dependent.",
            "$A$ is orthogonal.",
          ],
          correctIndex: 2,
          hint: "Zero determinant signals a collapse.",
          explanation: "$\\det(A) = 0$ iff $A$'s columns are **linearly dependent**, iff $A$ is singular, iff $A\\mathbf{x} = \\mathbf{0}$ has non-trivial solutions. All of these are equivalent statements for square matrices.",
        },
        {
          type: "multiple-choice",
          question: "You train linear regression on features including both `height_cm` and `height_m`. What happens?",
          options: [
            "The model generalizes better because of redundancy.",
            "The design matrix has dependent columns, making the least-squares solution non-unique.",
            "Nothing — linear regression tolerates duplicates.",
            "The loss function becomes non-convex.",
          ],
          correctIndex: 1,
          hint: "Perfect collinearity is linear dependence.",
          explanation: "Because `height_m = 0.01 · height_cm`, those feature columns are linearly dependent. $X^\\top X$ is singular and the normal equations have infinitely many solutions — a symptom of **multicollinearity** that ridge regression or feature pruning can fix.",
        },
      ],
      keyTakeaways: [
        "Vectors are independent iff the only combination giving $\\mathbf{0}$ is the trivial one.",
        "You can test independence by counting pivots of the matrix whose columns are the vectors.",
        "Dependent features cause multicollinearity and non-unique regression solutions.",
      ],
      keyTakeawaysEs: [
        "Los vectores son independientes sii la única combinación que da $\mathbf{0}$ es la trivial.",
        "Puedes comprobar independencia contando los pivotes de la matriz cuyas columnas son los vectores.",
        "Las características dependientes causan multicolinealidad y soluciones de regresión no únicas.",
      ],
    },

    // =========================================================================
    // LESSON 7 — Chapter 2.6: Basis and Rank
    // =========================================================================
    {
      title: "Basis and Rank",
      titleEs: "Base y Rango",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "A **basis** of a vector space $V$ is a set of vectors that is both **linearly independent** and **spanning** — every vector in $V$ can be written as a unique linear combination of basis elements. Every basis of a given finite-dimensional space has the same number of vectors, and that number is the **dimension** of the space. This is remarkable: dimension does not depend on which basis you chose, only on the space itself.",
        "The most familiar basis of $\\mathbb{R}^n$ is the **standard basis** $\\{\\mathbf{e}_1, \\dots, \\mathbf{e}_n\\}$, where $\\mathbf{e}_i$ has a 1 in position $i$ and zeros elsewhere. But infinitely many other bases exist. For instance, $\\{(1,1), (1,-1)\\}$ is a perfectly valid basis of $\\mathbb{R}^2$. Choosing a *different* basis can dramatically simplify a problem — this is the motivation for eigendecomposition and PCA.",
        "The **coordinates** of a vector $\\mathbf{v}$ in a basis $B = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$ are the unique scalars $c_1, \\dots, c_n$ satisfying $\\mathbf{v} = \\sum c_i \\mathbf{b}_i$. The same geometric vector has different coordinate representations in different bases — a fact that is easy to forget but crucial for transformations like change-of-basis matrices.",
        "The **rank** of a matrix $A$ is the dimension of its column space — equivalently, the number of linearly independent columns, the number of pivots in its row-echelon form, or (a beautiful identity) the dimension of its row space. A key fact: $\\text{rank}(A) = \\text{rank}(A^\\top)$, i.e. **row rank equals column rank**. This identity has real consequences: for a tall matrix $A \\in \\mathbb{R}^{m \\times n}$ with $m > n$, the rank is at most $n$, because there are only $n$ columns to be independent.",
        "**Worked example — computing rank by elimination:** For $A = \\begin{pmatrix}1 & 2 & 3\\\\2 & 4 & 7\\\\3 & 6 & 10\\end{pmatrix}$: R2 ← R2 − 2R1 gives $(0, 0, 1)$; R3 ← R3 − 3R1 gives $(0, 0, 1)$; R3 ← R3 − R2 gives $(0, 0, 0)$. Two non-zero rows remain → **rank = 2**. The third column is *not* in the span of the first two's linear dependency pattern, so the rank is 2 rather than 1.",
        "**Worked example — coordinates in a non-standard basis:** In the basis $B = \\{(1,1), (1,-1)\\}$, find the coordinates of $\\mathbf{v} = (4, 2)$. Solve $c_1(1,1) + c_2(1,-1) = (4,2)$: $c_1 + c_2 = 4$, $c_1 - c_2 = 2$. Adding: $2c_1 = 6 \\Rightarrow c_1 = 3$, then $c_2 = 1$. So $[\\mathbf{v}]_B = (3, 1)$ — the same geometric vector has different coordinates in different bases.",
        "Rank is the central diagnostic in many ML pipelines. A **full-rank** design matrix lets ordinary least-squares produce a unique solution. A **low-rank** weight matrix in a trained neural network is often a sign that the model has compressed information into fewer effective dimensions — the basis of modern techniques like LoRA (Low-Rank Adaptation), which adapts large models by adding a small, low-rank update rather than retraining all parameters.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Two different bases of $\\mathbb{R}^2$",
          description: "Both $\\{e_1, e_2\\}$ and the rotated basis $\\{(1,1), (1,-1)\\}$ span the plane with 2 independent vectors.",
          config: {
            vectors: [
              [1, 0],
              [0, 1],
              [1, 1],
              [1, -1],
            ],
            labels: ["e₁", "e₂", "b₁", "b₂"],
          },
        },
        {
          type: "matrix-transform-2d",
          title: "Rank deficiency collapses the plane",
          description: "The matrix $\\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix}$ has rank 1: it squashes the whole plane onto a line.",
          config: {
            matrix: [
              [1, 2],
              [2, 4],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "What is the rank of $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 0 & 0 & 1 \\end{pmatrix}$?",
          answer: 2,
          tolerance: 0,
          hint: "Row 2 is a multiple of row 1. After elimination, count pivot rows.",
          explanation: "Row 2 − 2·Row 1 = 0, so there are only 2 independent rows (and columns). The rank is 2. Equivalently, the column space is 2-dimensional — the three columns span a plane in $\\mathbb{R}^3$, not all of it.",
        },
        {
          type: "multiple-choice",
          question: "How many vectors are in any basis of $\\mathbb{R}^n$?",
          options: ["$n-1$", "exactly $n$", "at least $n+1$", "it depends on the basis"],
          correctIndex: 1,
          hint: "Think about the definition of dimension.",
          explanation: "Every basis of $\\mathbb{R}^n$ has exactly $n$ vectors. Fewer cannot span; more cannot be independent. This invariant *is* what we mean by the dimension of $\\mathbb{R}^n$.",
        },
        {
          type: "multiple-choice",
          question: "For $A \\in \\mathbb{R}^{1000 \\times 5}$, what is the maximum possible rank?",
          options: ["5", "1000", "5000", "Infinite"],
          correctIndex: 0,
          hint: "Rank is bounded by both row count and column count.",
          explanation: "$\\text{rank}(A) \\leq \\min(m, n) = \\min(1000, 5) = 5$. A tall skinny matrix is limited by its number of columns. This is why you cannot extract more than 5 independent directions from a design matrix with 5 features.",
        },
      ],
      keyTakeaways: [
        "A basis is a maximal independent set; its size is the dimension.",
        "The rank of a matrix equals the dimension of its column (or row) space.",
        "Rank governs uniqueness of solutions in regression and the effective capacity of learned representations.",
      ],
      keyTakeawaysEs: [
        "Una base es un conjunto independiente maximal; su tamaño es la dimensión.",
        "El rango de una matriz es la dimensión de su espacio columna (o fila).",
        "El rango gobierna la unicidad de soluciones en regresión y la capacidad efectiva de las representaciones aprendidas.",
      ],
    },

    // =========================================================================
    // LESSON 8 — Chapter 2.7: Linear Mappings
    // =========================================================================
    {
      title: "Linear Mappings",
      titleEs: "Aplicaciones Lineales",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "A **linear mapping** (or linear transformation) between vector spaces $V$ and $W$ is a function $T : V \\to W$ that respects both vector operations: for all $\\mathbf{u}, \\mathbf{v} \\in V$ and scalars $\\lambda$, $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ and $T(\\lambda \\mathbf{v}) = \\lambda T(\\mathbf{v})$. Geometrically, linear maps send lines through the origin to lines through the origin; parallel lines remain parallel; the origin stays fixed.",
        "The fundamental theorem of linear maps is this: **every linear map between finite-dimensional vector spaces, once a basis is fixed, is multiplication by a matrix**. Conversely, every matrix defines a linear map. This turns abstract geometric transformations into concrete computations — a deeply practical fact for any ML implementation.",
        "Two subspaces are attached to every linear map. The **kernel** (or null space) $\\ker(T) = \\{\\mathbf{v} \\in V : T(\\mathbf{v}) = \\mathbf{0}\\}$ measures information lost; a larger kernel means more inputs collapse to the same output. The **image** (or range) $\\text{im}(T) = \\{T(\\mathbf{v}) : \\mathbf{v} \\in V\\}$ is the set of possible outputs. Rank-nullity lives here: $\\dim(V) = \\dim(\\ker T) + \\dim(\\text{im} T)$.",
        "A linear map is **injective** (one-to-one) iff its kernel is trivial (just $\\mathbf{0}$), **surjective** (onto) iff its image fills all of $W$, and **bijective** (an isomorphism) iff both. Two finite-dimensional vector spaces are isomorphic iff they have the same dimension — a stunning result that says, up to relabeling, there is only one real vector space of each dimension.",
        "**Worked example — applying a rotation:** The 90° counterclockwise rotation is $R = \\begin{pmatrix}0 & -1\\\\ 1 & 0\\end{pmatrix}$. Apply it to the point $(2, 1)$: $R\\binom{2}{1} = \\binom{0\\cdot 2 + (-1)\\cdot 1}{1\\cdot 2 + 0\\cdot 1} = \\binom{-1}{2}$. The vector $(2,1)$ rotates to $(-1, 2)$ — check by plotting: it's 90° counterclockwise as expected.",
        "**Worked example — shear on a square's corners:** Apply the shear $S = \\begin{pmatrix}1 & 1\\\\0 & 1\\end{pmatrix}$ to the unit square's corners $(0,0), (1,0), (1,1), (0,1)$. Results: $(0,0), (1,0), (2,1), (1,1)$. The bottom edge stays fixed; the top edge slides right by 1 — parallelogram from a square. Note lines remain lines and parallelism is preserved.",
        "**Worked example — kernel of a projection:** For $T(x,y) = (x, 0)$ (projection onto the $x$-axis), the kernel is $\\{(x,y) : T(x,y) = (0,0)\\} = \\{(0, y) : y \\in \\mathbb{R}\\}$ — the $y$-axis. Image is the $x$-axis. Rank-nullity check: $\\dim(\\ker) + \\dim(\\text{im}) = 1 + 1 = 2 = \\dim(\\mathbb{R}^2)$ ✓.",
        "Changing the basis of the domain or codomain transforms the matrix of a linear map by **similarity**: $A' = P^{-1} A P$ for a change-of-basis matrix $P$. Similar matrices represent *the same linear map* in different coordinate systems and share invariants like rank, determinant, trace, and eigenvalues. This is the theoretical foundation for diagonalization — the secret sauce behind PCA, eigenfaces, and spectral methods.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Shear: a classic linear map",
          description: "The matrix $\\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$ shears the plane horizontally. Parallelograms remain parallelograms; the origin is fixed.",
          config: {
            matrix: [
              [1, 1],
              [0, 1],
            ],
            animateFromIdentity: true,
          },
        },
        {
          type: "matrix-transform-2d",
          title: "A rank-1 linear map",
          description: "This projection onto the $x$-axis has a 1-D image (the $x$-axis) and a 1-D kernel (the $y$-axis). Rank + nullity = 1 + 1 = 2 ✓",
          config: {
            matrix: [
              [1, 0],
              [0, 0],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which of the following functions $T: \\mathbb{R}^2 \\to \\mathbb{R}^2$ is a linear map?",
          options: [
            "$T(x, y) = (x + 1, y)$",
            "$T(x, y) = (x^2, y)$",
            "$T(x, y) = (2x + y, x - y)$",
            "$T(x, y) = (\\sin x, y)$",
          ],
          correctIndex: 2,
          hint: "Linear maps preserve the origin and distribute over addition and scaling.",
          explanation: "Option C is a matrix product with $A = \\begin{pmatrix}2 & 1 \\\\ 1 & -1\\end{pmatrix}$ — clearly linear. Option A shifts the origin, option B squares a variable, and option D applies a non-linear function. None of these satisfy the linearity axioms.",
        },
        {
          type: "vector-input",
          question: "Apply the linear map $T(\\mathbf{x}) = A\\mathbf{x}$ with $A = \\begin{pmatrix}1 & 2 \\\\ 3 & 0\\end{pmatrix}$ to the vector $(1, 1)$. Enter the result.",
          dimensions: 2,
          answer: [3, 3],
          tolerance: 0.01,
          showPreview: true,
          hint: "Matrix-vector product: each output component is a dot product.",
          explanation: "$T(1,1) = (1\\cdot 1 + 2\\cdot 1,\\; 3\\cdot 1 + 0\\cdot 1) = (3, 3)$. The map sends $(1,1)$ to the point $(3,3)$.",
        },
        {
          type: "multiple-choice",
          question: "A linear map $T: \\mathbb{R}^5 \\to \\mathbb{R}^3$ has $\\dim(\\text{im}(T)) = 3$. Is it injective, surjective, both, or neither?",
          options: [
            "Injective only",
            "Surjective only",
            "Both (an isomorphism)",
            "Neither",
          ],
          correctIndex: 1,
          hint: "Compare dimensions and use rank-nullity.",
          explanation: "The image fills $\\mathbb{R}^3$, so $T$ is **surjective**. By rank-nullity, $\\dim(\\ker T) = 5 - 3 = 2 > 0$, so it is not injective. You cannot have an isomorphism between spaces of different dimensions.",
        },
      ],
      keyTakeaways: [
        "Linear maps preserve vector addition and scalar multiplication; they are represented by matrices.",
        "Every linear map has a kernel and an image; their dimensions sum to the domain dimension.",
        "Similar matrices $A' = P^{-1}AP$ describe the same map in different bases and share invariants like rank and eigenvalues.",
      ],
      keyTakeawaysEs: [
        "Las aplicaciones lineales preservan la suma de vectores y la multiplicación escalar; se representan mediante matrices.",
        "Toda aplicación lineal tiene un núcleo y una imagen; sus dimensiones suman la dimensión del dominio.",
        "Las matrices semejantes $A' = P^{-1}AP$ describen el mismo mapa en distintas bases y comparten invariantes como rango y autovalores.",
      ],
    },

    // =========================================================================
    // LESSON 9 — Chapter 2.8: Affine Spaces
    // =========================================================================
    {
      title: "Affine Spaces",
      titleEs: "Espacios Afines",
      chapter: "Linear Algebra",
      chapterEs: "Álgebra Lineal",
      chapterNumber: 2,
      content: [
        "An **affine space** is, roughly, a vector space that has forgotten where its origin is. Formally, an affine subspace of a vector space $V$ is a set of the form $\\mathbf{x}_0 + U = \\{\\mathbf{x}_0 + \\mathbf{u} : \\mathbf{u} \\in U\\}$, where $\\mathbf{x}_0$ is any point and $U$ is a linear subspace. When $\\mathbf{x}_0 = \\mathbf{0}$, the affine subspace coincides with $U$ itself; otherwise, it is a **translate** of $U$ that need not pass through the origin.",
        "Familiar examples: a line in $\\mathbb{R}^2$ not through the origin is a 1-dimensional affine subspace; a plane in $\\mathbb{R}^3$ that is shifted off the origin is a 2-dimensional affine subspace. In general, the solution set of a consistent (non-homogeneous) linear system $A\\mathbf{x} = \\mathbf{b}$ is an affine subspace: it is a particular solution $\\mathbf{x}_p$ plus the null space of $A$.",
        "**Affine maps** are the natural transformations between affine spaces. They have the form $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{t}$, combining a linear map $A$ with a translation $\\mathbf{t}$. Unlike pure linear maps, affine maps do not need to fix the origin — they can translate the whole space. Affine maps preserve lines, parallelism, and ratios of distances along a line, but not angles or absolute distances.",
        "A trick that shows up throughout computer graphics and ML: we can embed an affine map into a **linear map in one higher dimension**. Append a 1 to every vector ($\\mathbf{x} \\mapsto (\\mathbf{x}, 1)$) and use a block matrix $\\begin{pmatrix} A & \\mathbf{t} \\\\ \\mathbf{0}^\\top & 1 \\end{pmatrix}$ to capture the entire affine map as ordinary matrix-vector multiplication. This is the same **homogeneous coordinate** trick used in OpenGL transformation pipelines.",
        "**Worked example — affine line in $\\mathbb{R}^2$:** The line through $(1, 2)$ with direction $(3, 1)$ is $L = \\{(1, 2) + t(3, 1) : t \\in \\mathbb{R}\\} = \\{(1 + 3t, 2 + t)\\}$. At $t = 0$ we get $(1,2)$; at $t = 1$ we get $(4,3)$; at $t = -1$ we get $(-2, 1)$. This line does NOT pass through the origin, so it's affine, not linear.",
        "**Worked example — homogeneous coordinates trick:** To embed the affine map $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{t}$ with $A = \\begin{pmatrix}2 & 0 \\\\ 0 & 2\\end{pmatrix}$, $\\mathbf{t} = (3, 1)$ as a linear map, use the 3×3 block matrix $M = \\begin{pmatrix}2 & 0 & 3 \\\\ 0 & 2 & 1 \\\\ 0 & 0 & 1\\end{pmatrix}$. Applying to $\\mathbf{x} = (1, 1, 1)$: $M\\mathbf{x} = (2+3, 2+1, 1) = (5, 3, 1)$ — the last coord stays 1; the first two give $T(1,1) = (5, 3)$ ✓.",
        "Affine ideas thread through ML more than you might expect. Classical linear regression with a bias term is an affine model: $\\hat{y} = \\mathbf{w}^\\top \\mathbf{x} + b$ is linear in $\\mathbf{w}$ and $b$, but not linear in $\\mathbf{x}$ alone (because of the $+b$). Most neural-network layers are affine-followed-by-non-linear: $\\mathbf{h} = \\sigma(W\\mathbf{x} + \\mathbf{b})$. Support vector machines carve out decision boundaries that are affine hyperplanes — solution sets of $\\mathbf{w}^\\top \\mathbf{x} + b = 0$. Understanding affine subspaces is thus the right language for half of modern modeling.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "An affine line vs. a linear line",
          description: "The red line through the origin is a linear subspace; the blue, translated line is an affine subspace — same direction vector, different offset.",
          config: {
            vectors: [
              [2, 1],
              [2, 3],
            ],
            labels: ["linear span", "affine (shifted)"],
          },
        },
        {
          type: "matrix-transform-2d",
          title: "Affine transformation preview",
          description: "In 2D, an affine map $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{t}$ can rotate, scale, shear, and translate all at once.",
          config: {
            matrix: [
              [1, 0.5],
              [0.5, 1],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which of the following is an affine subspace of $\\mathbb{R}^3$ but NOT a linear subspace?",
          options: [
            "The origin $\\{(0,0,0)\\}$",
            "The $xy$-plane $\\{(x,y,0)\\}$",
            "The plane $\\{(x,y,z) : z = 1\\}$",
            "All of $\\mathbb{R}^3$",
          ],
          correctIndex: 2,
          hint: "Linear subspaces must contain the origin; affine subspaces need not.",
          explanation: "The plane $z = 1$ is parallel to the $xy$-plane but shifted up by 1, so it is affine (a translate of a linear subspace) but not linear (it misses the origin). The other three are all linear subspaces.",
        },
        {
          type: "vector-input",
          question: "Apply the affine map $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{t}$, with $A = \\begin{pmatrix}2 & 0 \\\\ 0 & 3\\end{pmatrix}$ and $\\mathbf{t} = (1, -1)$, to the point $(1, 1)$.",
          dimensions: 2,
          answer: [3, 2],
          tolerance: 0.01,
          showPreview: true,
          hint: "First multiply, then add the translation.",
          explanation: "$A(1,1) = (2, 3)$. Adding $\\mathbf{t} = (1, -1)$: $(2 + 1,\\; 3 - 1) = (3, 2)$. Affine maps always decompose as linear-then-translate.",
        },
        {
          type: "multiple-choice",
          question: "An SVM's decision boundary satisfies $\\mathbf{w}^\\top \\mathbf{x} + b = 0$. Geometrically, what is this set?",
          options: [
            "A linear subspace (always through the origin)",
            "An affine hyperplane (not necessarily through the origin)",
            "A single point",
            "A curve, not a plane",
          ],
          correctIndex: 1,
          hint: "The bias $b$ shifts the boundary.",
          explanation: "Setting $\\mathbf{w}^\\top \\mathbf{x} + b = 0$ defines an **affine hyperplane** — a linear hyperplane $\\mathbf{w}^\\top \\mathbf{x} = 0$ shifted by the bias $b$. Without $b$, every classifier would be forced to pass through the origin, a severe restriction that real SVMs avoid.",
        },
      ],
      keyTakeaways: [
        "An affine subspace is a translated linear subspace: $\\mathbf{x}_0 + U$.",
        "Affine maps have the form $A\\mathbf{x} + \\mathbf{t}$ — linear plus translation.",
        "Linear regression with bias, neural-net layers, and SVM boundaries are all affine objects.",
      ],
      keyTakeawaysEs: [
        "Un subespacio afín es un subespacio lineal trasladado: $\mathbf{x}_0 + U$.",
        "Las aplicaciones afines tienen la forma $A\mathbf{x} + \mathbf{t}$ — lineal más traslación.",
        "La regresión lineal con sesgo, las capas de redes neuronales y las fronteras de SVM son todos objetos afines.",
      ],
    },

    // =========================================================================
    // LESSON 10 — Chapter 3.1: Norms
    // =========================================================================
    {
      title: "Norms",
      titleEs: "Normas",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "A **norm** on a vector space $V$ is a function $\\|\\cdot\\| : V \\to \\mathbb{R}_{\\geq 0}$ that assigns each vector a non-negative length. Formally, it must satisfy three axioms: **absolute homogeneity** ($\\|\\lambda \\mathbf{v}\\| = |\\lambda| \\cdot \\|\\mathbf{v}\\|$), the **triangle inequality** ($\\|\\mathbf{u} + \\mathbf{v}\\| \\leq \\|\\mathbf{u}\\| + \\|\\mathbf{v}\\|$), and **positive definiteness** ($\\|\\mathbf{v}\\| = 0 \\iff \\mathbf{v} = \\mathbf{0}$).",
        "The three most important norms in ML form a family. The **Euclidean** or $L_2$ norm $\\|\\mathbf{x}\\|_2 = \\sqrt{x_1^2 + \\dots + x_n^2}$ is the straight-line distance you know from school. The **Manhattan** or $L_1$ norm $\\|\\mathbf{x}\\|_1 = |x_1| + \\dots + |x_n|$ measures block-by-block travel. The **max** or $L_\\infty$ norm $\\|\\mathbf{x}\\|_\\infty = \\max_i |x_i|$ returns the largest component.",
        "These are unified by the **$L_p$ norm**: $\\|\\mathbf{x}\\|_p = \\left(\\sum_i |x_i|^p\\right)^{1/p}$ for $p \\geq 1$. As $p \\to \\infty$ we recover $L_\\infty$. The **unit ball** $\\{\\mathbf{x} : \\|\\mathbf{x}\\| \\leq 1\\}$ has a distinct shape for each $p$: a diamond for $L_1$, a circle for $L_2$, a square for $L_\\infty$. That shape is not cosmetic — it determines the geometry of regularization.",
        "In ML, norms measure the *size* of parameters or errors. **Ridge regression** adds $\\lambda \\|\\mathbf{w}\\|_2^2$ to the loss, shrinking weights smoothly toward zero. **Lasso regression** uses $\\lambda \\|\\mathbf{w}\\|_1$ instead; because the $L_1$ unit ball has sharp corners on the axes, the optimum often lands exactly on an axis, producing a **sparse** weight vector. Switching norms literally changes the geometry of the solution.",
        "**Worked example — L2 norm:** Let $\\mathbf{v} = (3, 4)$. Then $\\|\\mathbf{v}\\|_2 = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$. Geometrically, this is the length of the vector from origin to $(3, 4)$ — the famous 3-4-5 right triangle.",
        "**Worked example — comparing $L_1$, $L_2$, $L_\\infty$:** For $\\mathbf{v} = (3, -4)$: $\\|\\mathbf{v}\\|_1 = |3| + |-4| = 7$, $\\|\\mathbf{v}\\|_2 = \\sqrt{9 + 16} = 5$, $\\|\\mathbf{v}\\|_\\infty = \\max(|3|, |-4|) = 4$. Observe $\\|\\mathbf{v}\\|_\\infty \\leq \\|\\mathbf{v}\\|_2 \\leq \\|\\mathbf{v}\\|_1$ — a general inequality that follows from the shape nesting of the unit balls.",
        "**Worked example — higher-dimensional L2:** $\\|(1, 1, 1, 1)\\|_2 = \\sqrt{1 + 1 + 1 + 1} = \\sqrt{4} = 2$. In general, $\\|(1, 1, \\dots, 1)\\|_2 = \\sqrt{n}$ for an $n$-dimensional all-ones vector — a useful reference point for normalization.",
        "A powerful fact: in any *finite-dimensional* vector space, all norms are **equivalent** in the sense that they induce the same topology — convergence in one norm implies convergence in any other. Practically, this means your choice of norm affects numerical values and geometry, but not qualitative properties like continuity or limits. In infinite dimensions (function spaces), this equivalence breaks, which is why functional analysis becomes far richer.",
      ],
      visualizations: [
        {
          type: "norm-balls",
          title: "Unit balls of $L_1$, $L_2$, $L_\\infty$",
          description: "The set $\\{\\mathbf{x} : \\|\\mathbf{x}\\|_p = 1\\}$ — a diamond, circle, and square respectively. Same vectors, different definitions of length.",
          config: {},
        },
        {
          type: "vector-2d",
          title: "Three norms of the same vector",
          description: "For $\\mathbf{v} = (3, 4)$: $\\|\\mathbf{v}\\|_2 = 5$, $\\|\\mathbf{v}\\|_1 = 7$, $\\|\\mathbf{v}\\|_\\infty = 4$.",
          config: {
            vectors: [[3, 4]],
            labels: ["v = (3,4)"],
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Compute the $L_2$ norm of $\\mathbf{v} = (1, 2, 2)$.",
          answer: 3,
          tolerance: 0.01,
          hint: "$\\|\\mathbf{v}\\|_2 = \\sqrt{v_1^2 + v_2^2 + v_3^2}$.",
          explanation: "$\\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{1 + 4 + 4} = \\sqrt{9} = 3$. This is the Euclidean distance from the origin to the point $(1, 2, 2)$.",
        },
        {
          type: "numeric-input",
          question: "Compute the $L_1$ norm of $\\mathbf{v} = (-2, 3, -1, 4)$.",
          answer: 10,
          tolerance: 0.01,
          hint: "Sum the absolute values of each component.",
          explanation: "$\\|\\mathbf{v}\\|_1 = |-2| + |3| + |-1| + |4| = 2 + 3 + 1 + 4 = 10$. The $L_1$ norm is also called the taxicab or Manhattan norm.",
        },
        {
          type: "multiple-choice",
          question: "Why does Lasso ($L_1$ regularization) tend to produce sparse solutions while Ridge ($L_2$) does not?",
          options: [
            "Lasso is computationally faster.",
            "The $L_1$ unit ball has corners on the axes, so the optimum often lies exactly on a coordinate axis (some weights = 0).",
            "Ridge is applied only to bias terms.",
            "Sparsity is caused by the learning rate, not the norm.",
          ],
          correctIndex: 1,
          hint: "Look at the shape of the unit balls.",
          explanation: "When the loss's level sets first touch the $L_1$ diamond, contact usually happens at a **corner** — where one or more coordinates are zero. The smooth $L_2$ circle has no such corners, so Ridge produces small but generally non-zero weights.",
        },
      ],
      keyTakeaways: [
        "A norm assigns a non-negative length satisfying homogeneity, the triangle inequality, and positive definiteness.",
        "$L_1$, $L_2$, and $L_\\infty$ are the workhorses; their unit balls have distinctive shapes.",
        "Regularization picks a norm, and that choice changes the geometry of solutions (sparse vs. smooth).",
      ],
      keyTakeawaysEs: [
        "Una norma asigna una longitud no negativa que cumple homogeneidad, desigualdad triangular y definida positiva.",
        "$L_1$, $L_2$ y $L_\infty$ son las normas más usadas; sus bolas unidad tienen formas distintivas.",
        "La regularización elige una norma, y esa elección cambia la geometría de las soluciones (dispersa vs. suave).",
      ],
    },

    // =========================================================================
    // LESSON 11 — Chapter 3.2: Inner Products
    // =========================================================================
    {
      title: "Inner Products",
      titleEs: "Productos Internos",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "An **inner product** $\\langle \\cdot, \\cdot \\rangle : V \\times V \\to \\mathbb{R}$ is a function that eats two vectors and returns a scalar, satisfying three properties: **symmetry** ($\\langle \\mathbf{u}, \\mathbf{v}\\rangle = \\langle \\mathbf{v}, \\mathbf{u}\\rangle$), **linearity** in each argument, and **positive definiteness** ($\\langle \\mathbf{v}, \\mathbf{v}\\rangle \\geq 0$, with equality iff $\\mathbf{v} = \\mathbf{0}$). The most familiar example is the **dot product**: $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = \\mathbf{u}^\\top \\mathbf{v} = \\sum_i u_i v_i$.",
        "Every inner product induces a norm via $\\|\\mathbf{v}\\| = \\sqrt{\\langle \\mathbf{v}, \\mathbf{v}\\rangle}$. In $\\mathbb{R}^n$ with the standard dot product, this gives the familiar Euclidean norm. But we can build *weighted* inner products too: $\\langle \\mathbf{u}, \\mathbf{v}\\rangle_A = \\mathbf{u}^\\top A \\mathbf{v}$ for any **symmetric positive definite** matrix $A$. Different $A$s produce different geometries on the same vector space.",
        "A profound consequence of the axioms is the **Cauchy–Schwarz inequality**: $|\\langle \\mathbf{u}, \\mathbf{v}\\rangle| \\leq \\|\\mathbf{u}\\| \\cdot \\|\\mathbf{v}\\|$, with equality iff the two vectors are parallel. This single inequality powers countless proofs — the triangle inequality falls out of it, as does the definition of the angle between vectors.",
        "Inner products go far beyond $\\mathbb{R}^n$. On the space of continuous functions on $[a, b]$, the integral $\\langle f, g\\rangle = \\int_a^b f(x) g(x) \\, dx$ is an inner product. This is the foundation of Fourier analysis: the sine and cosine functions are *orthogonal* under this product, so expressing a signal as a sum of them is the analog of expressing a vector in an orthogonal basis.",
        "**Worked example — dot product:** $\\langle (1, 2, 3), (4, -1, 2) \\rangle = 1\\cdot 4 + 2\\cdot(-1) + 3\\cdot 2 = 4 - 2 + 6 = 8$. Positive, so the vectors point in a generally similar direction (angle < 90°).",
        "**Worked example — verifying bilinearity:** Take $\\mathbf{u} = (1, 0)$, $\\mathbf{v} = (0, 1)$, $\\mathbf{w} = (1, 1)$. Check $\\langle \\mathbf{u} + \\mathbf{v}, \\mathbf{w}\\rangle = \\langle(1,1), (1,1)\\rangle = 1 + 1 = 2$, and $\\langle \\mathbf{u}, \\mathbf{w}\\rangle + \\langle \\mathbf{v}, \\mathbf{w}\\rangle = (1 + 0) + (0 + 1) = 2$ ✓. The inner product distributes over addition.",
        "**Worked example — weighted inner product:** Take $A = \\begin{pmatrix}2 & 0\\\\0 & 1\\end{pmatrix}$ (SPD) and $\\mathbf{u} = \\mathbf{v} = (1, 1)$. Then $\\langle \\mathbf{u}, \\mathbf{v}\\rangle_A = \\mathbf{u}^\\top A \\mathbf{v} = (1, 1)\\binom{2}{1} = 3$, while the standard inner product is $\\mathbf{u}^\\top \\mathbf{v} = 2$. Weighting stretches the first coordinate twice as much — a different geometry on the same space.",
        "In ML, inner products are the atom of **similarity**. Cosine similarity $\\frac{\\langle \\mathbf{u}, \\mathbf{v}\\rangle}{\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|}$ measures how aligned two vectors are regardless of magnitude — central to word embeddings and retrieval. **Kernel methods** (like the kernel trick in SVMs) replace the standard dot product with $\\kappa(\\mathbf{u}, \\mathbf{v}) = \\langle \\phi(\\mathbf{u}), \\phi(\\mathbf{v})\\rangle$ where $\\phi$ implicitly maps data into a higher-dimensional feature space, never computing $\\phi$ directly.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Dot product as alignment",
          description: "For $\\mathbf{u} = (2, 1)$, $\\mathbf{v} = (1, 2)$: $\\mathbf{u}^\\top \\mathbf{v} = 2 + 2 = 4$. Positive dot product means the angle between them is acute.",
          config: {
            vectors: [[2, 1], [1, 2]],
            labels: ["u", "v"],
          },
        },
        {
          type: "vector-2d",
          title: "Negative dot product",
          description: "For $\\mathbf{u} = (2, 1)$, $\\mathbf{v} = (-1, 1)$: $\\mathbf{u}^\\top \\mathbf{v} = -2 + 1 = -1$. Negative means the angle is obtuse.",
          config: {
            vectors: [[2, 1], [-1, 1]],
            labels: ["u", "v"],
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Compute $\\langle \\mathbf{u}, \\mathbf{v}\\rangle$ for $\\mathbf{u} = (1, 2, 3)$ and $\\mathbf{v} = (4, -1, 2)$.",
          answer: 8,
          tolerance: 0.01,
          hint: "Sum the products of corresponding components.",
          explanation: "$1\\cdot 4 + 2\\cdot(-1) + 3\\cdot 2 = 4 - 2 + 6 = 8$. The positive value indicates the two vectors are more than 90° apart in the same general direction.",
        },
        {
          type: "multiple-choice",
          question: "Which property does the dot product NOT satisfy?",
          options: [
            "$\\langle \\mathbf{u}, \\mathbf{v}\\rangle = \\langle \\mathbf{v}, \\mathbf{u}\\rangle$",
            "$\\langle \\mathbf{u} + \\mathbf{w}, \\mathbf{v}\\rangle = \\langle \\mathbf{u}, \\mathbf{v}\\rangle + \\langle \\mathbf{w}, \\mathbf{v}\\rangle$",
            "$\\langle \\mathbf{v}, \\mathbf{v}\\rangle \\geq 0$",
            "$\\langle \\mathbf{u}, \\mathbf{v}\\rangle \\leq \\mathbf{u} + \\mathbf{v}$",
          ],
          correctIndex: 3,
          hint: "One option is ungrammatical — scalars vs vectors.",
          explanation: "The fourth option is nonsensical: it compares a scalar to a vector sum. The first three are exactly the symmetry, linearity, and positive definiteness axioms.",
        },
        {
          type: "multiple-choice",
          question: "Two text embeddings have dot product 0.95 (after normalization). What does this tell us?",
          options: [
            "The texts are unrelated.",
            "The embeddings are nearly parallel, so the texts are semantically similar.",
            "The embeddings are orthogonal.",
            "One embedding is zero.",
          ],
          correctIndex: 1,
          hint: "Normalized dot product is cosine similarity, bounded by 1.",
          explanation: "After normalization, $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = \\cos\\theta$. A value near 1 means $\\theta \\approx 0$ — the vectors point in nearly the same direction, indicating high semantic similarity. This is how retrieval and RAG systems rank documents.",
        },
      ],
      keyTakeaways: [
        "An inner product generalizes the dot product: symmetric, bilinear, positive definite.",
        "Every inner product induces a norm via $\\|\\mathbf{v}\\| = \\sqrt{\\langle \\mathbf{v}, \\mathbf{v}\\rangle}$.",
        "Cosine similarity and kernel methods in ML are direct applications of inner products.",
      ],
      keyTakeawaysEs: [
        "Un producto interno generaliza el producto punto: simétrico, bilineal, definido positivo.",
        "Todo producto interno induce una norma vía $\|\mathbf{v}\| = \sqrt{\langle \mathbf{v}, \mathbf{v}\rangle}$.",
        "La similitud del coseno y los métodos de kernel en ML son aplicaciones directas de los productos internos.",
      ],
    },

    // =========================================================================
    // LESSON 12 — Chapter 3.3: Lengths and Distances
    // =========================================================================
    {
      title: "Lengths and Distances",
      titleEs: "Longitudes y Distancias",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "Once we have a norm, we automatically get a **distance** between any two points: $d(\\mathbf{u}, \\mathbf{v}) = \\|\\mathbf{u} - \\mathbf{v}\\|$. The distance inherits all the good behavior of the norm — non-negativity, symmetry, the triangle inequality — so every normed space is also a **metric space**. And because every inner product induces a norm, every inner-product space automatically comes with a notion of distance.",
        "The **Euclidean distance** $d_2(\\mathbf{u}, \\mathbf{v}) = \\sqrt{\\sum_i (u_i - v_i)^2}$ is the default in most ML contexts — it is the distance you would measure with a ruler. The **Manhattan distance** $d_1$, **Chebyshev distance** $d_\\infty$, and **Mahalanobis distance** $d_M(\\mathbf{u}, \\mathbf{v}) = \\sqrt{(\\mathbf{u} - \\mathbf{v})^\\top \\Sigma^{-1} (\\mathbf{u} - \\mathbf{v})}$ (which re-scales by a covariance matrix) are all common alternatives tailored to different data geometries.",
        "A classical identity connects distance to inner product: $\\|\\mathbf{u} - \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 - 2\\langle \\mathbf{u}, \\mathbf{v}\\rangle + \\|\\mathbf{v}\\|^2$. This is the **law of cosines** in vector form, and it is how most similarity-to-distance conversions work under the hood. It also explains why squared Euclidean distance is often preferred computationally: it avoids the square root while preserving ordering.",
        "The closest-point problem — given a query, find the nearest training point — is the heart of **$k$-nearest-neighbors** classification, retrieval-augmented generation, and clustering. The *choice of distance* changes the answer. For images you may want cosine distance on embeddings; for time series, dynamic time warping; for distributions, the Wasserstein distance. Getting the metric right is half the battle.",
        "**Worked example — Euclidean distance:** Distance between $\\mathbf{u} = (1, 2)$ and $\\mathbf{v} = (4, 6)$: $\\mathbf{u} - \\mathbf{v} = (-3, -4)$, so $d_2(\\mathbf{u}, \\mathbf{v}) = \\sqrt{9 + 16} = 5$. Another 3-4-5 triangle, this time interpreted as separation between two points.",
        "**Worked example — triangle inequality check:** With $\\mathbf{u} = (3, 0)$, $\\mathbf{v} = (0, 4)$: $\\|\\mathbf{u}\\| = 3$, $\\|\\mathbf{v}\\| = 4$, $\\|\\mathbf{u} + \\mathbf{v}\\| = \\|(3, 4)\\| = 5$. Check $5 \\leq 3 + 4 = 7$ ✓. Since $\\mathbf{u}, \\mathbf{v}$ are orthogonal the inequality is strict (Pythagoras gives exact 5).",
        "**Worked example — law of cosines identity:** For $\\mathbf{u} = (1, 0)$, $\\mathbf{v} = (1, 1)$: $\\|\\mathbf{u}\\|^2 = 1$, $\\|\\mathbf{v}\\|^2 = 2$, $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = 1$. Then $\\|\\mathbf{u} - \\mathbf{v}\\|^2 = 1 - 2\\cdot 1 + 2 = 1$. Direct check: $\\mathbf{u} - \\mathbf{v} = (0, -1)$ has squared norm 1 ✓.",
        "Two subtle pitfalls. First, in very high dimensions most pairs of random points are roughly equidistant — the so-called **concentration of distances** — so naive Euclidean distance loses discriminative power. Second, raw features with different scales (age in years, income in dollars) will be dominated by the larger scale. This is why **standardization** (subtract mean, divide by standard deviation) or using the Mahalanobis metric is essential before measuring distance on real-world data.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Euclidean distance = length of the difference",
          description: "$d(\\mathbf{u}, \\mathbf{v}) = \\|\\mathbf{u} - \\mathbf{v}\\|$. The difference vector connects the tips.",
          config: {
            vectors: [[4, 3], [1, 1], [3, 2]],
            labels: ["u", "v", "u-v"],
          },
        },
        {
          type: "norm-balls",
          title: "Unit balls = equidistant sets",
          description: "Each unit ball is the set of points at distance exactly 1 from the origin under the corresponding norm.",
          config: {},
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Compute the Euclidean distance between $\\mathbf{u} = (1, 2)$ and $\\mathbf{v} = (4, 6)$.",
          answer: 5,
          tolerance: 0.01,
          hint: "Take $\\mathbf{u} - \\mathbf{v}$ and compute its length.",
          explanation: "$\\mathbf{u} - \\mathbf{v} = (-3, -4)$. $\\|\\mathbf{u} - \\mathbf{v}\\|_2 = \\sqrt{9 + 16} = \\sqrt{25} = 5$. The classic 3-4-5 right triangle.",
        },
        {
          type: "numeric-input",
          question: "Compute the Manhattan distance between $\\mathbf{u} = (2, -1, 3)$ and $\\mathbf{v} = (5, 1, 0)$.",
          answer: 8,
          tolerance: 0.01,
          hint: "Sum absolute differences component-by-component.",
          explanation: "$|2 - 5| + |-1 - 1| + |3 - 0| = 3 + 2 + 3 = 8$. Manhattan distance measures travel along axis-aligned paths.",
        },
        {
          type: "multiple-choice",
          question: "Why is feature standardization usually recommended before computing Euclidean distances for $k$-NN?",
          options: [
            "It speeds up the algorithm.",
            "Features with large numerical scales will dominate the distance, swamping smaller-scaled features regardless of importance.",
            "Distances are not defined on raw data.",
            "Euclidean distance requires integer inputs.",
          ],
          correctIndex: 1,
          hint: "Think about comparing age (0–100) with income (0–1,000,000).",
          explanation: "Without scaling, `income` will contribute differences of thousands while `age` contributes single digits, making age effectively invisible in the distance. Standardizing puts features on comparable scales so each contributes according to its true information content.",
        },
      ],
      keyTakeaways: [
        "Distance is induced by a norm: $d(\\mathbf{u}, \\mathbf{v}) = \\|\\mathbf{u} - \\mathbf{v}\\|$.",
        "Different metrics (Euclidean, Manhattan, Mahalanobis) encode different geometries.",
        "High-dimensional and unstandardized data require careful distance choice and preprocessing.",
      ],
      keyTakeawaysEs: [
        "La distancia es inducida por una norma: $d(\mathbf{u}, \mathbf{v}) = \|\mathbf{u} - \mathbf{v}\|$.",
        "Distintas métricas (euclidiana, Manhattan, Mahalanobis) codifican geometrías distintas.",
        "Datos de alta dimensión o sin estandarizar exigen elegir cuidadosamente la distancia y preprocesar.",
      ],
    },

    // =========================================================================
    // LESSON 13 — Chapter 3.4: Angles and Orthogonality
    // =========================================================================
    {
      title: "Angles and Orthogonality",
      titleEs: "Ángulos y Ortogonalidad",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "From an inner product we can extract the **angle** between two non-zero vectors via $\\cos\\theta = \\frac{\\langle \\mathbf{u}, \\mathbf{v}\\rangle}{\\|\\mathbf{u}\\| \\cdot \\|\\mathbf{v}\\|}$. Cauchy–Schwarz guarantees this ratio lies in $[-1, 1]$, so $\\theta \\in [0, \\pi]$ is well-defined. When $\\theta = 0$ the vectors are parallel and pointing the same way; when $\\theta = \\pi$ they are anti-parallel; when $\\theta = \\pi/2$ they are **orthogonal**.",
        "Two vectors are **orthogonal**, written $\\mathbf{u} \\perp \\mathbf{v}$, exactly when $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = 0$. Orthogonality is the vector analog of 'independent' or 'unrelated' — orthogonal directions contribute cleanly separate information. Geometrically, two orthogonal vectors meet at a right angle, but algebraically orthogonality extends to any inner-product space, including spaces of functions.",
        "The **Pythagorean theorem** generalizes to any inner-product space: if $\\mathbf{u} \\perp \\mathbf{v}$, then $\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2$. This is not a coincidence — the Pythagorean theorem *is* what you get when you expand the squared norm and use orthogonality to kill the cross term. Every 'variance decomposition' in statistics is Pythagoras in disguise.",
        "A matrix $Q$ is **orthogonal** if $Q^\\top Q = I$, i.e., its columns form an orthonormal set (unit length, pairwise perpendicular). Orthogonal matrices preserve inner products: $\\langle Q\\mathbf{u}, Q\\mathbf{v}\\rangle = \\langle \\mathbf{u}, \\mathbf{v}\\rangle$. Consequently they preserve lengths and angles — they are exactly the **rigid motions** of space: rotations and reflections. Orthogonal transformations are the best-behaved linear maps, numerically stable and information-preserving.",
        "**Worked example — 45° angle:** For $\\mathbf{u} = (1, 0)$ and $\\mathbf{v} = (1, 1)$: $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = 1$, $\\|\\mathbf{u}\\| = 1$, $\\|\\mathbf{v}\\| = \\sqrt{2}$. So $\\cos\\theta = 1/\\sqrt{2} \\approx 0.707$, giving $\\theta = 45°$ (or $\\pi/4$). Geometrically $(1,1)$ bisects the first quadrant.",
        "**Worked example — orthogonality:** $\\mathbf{u} = (3, 4)$ and $\\mathbf{v} = (-4, 3)$: $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = 3\\cdot(-4) + 4\\cdot 3 = -12 + 12 = 0$. **Orthogonal**, 90° apart. In general, for any $(a,b)$, the vector $(-b, a)$ is perpendicular — a handy 2D trick.",
        "**Worked example — Pythagoras:** If $\\mathbf{u} = (3, 0)$ and $\\mathbf{v} = (0, 4)$ (orthogonal), then $\\|\\mathbf{u} + \\mathbf{v}\\|^2 = \\|(3, 4)\\|^2 = 25 = 9 + 16 = \\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2$ ✓. Orthogonality makes the cross term $2\\langle \\mathbf{u}, \\mathbf{v}\\rangle$ vanish.",
        "Angles are everywhere in ML. **Cosine similarity** $\\cos\\theta$ is the go-to retrieval metric because it ignores vector magnitude. **Attention scores** in transformers compute $\\mathbf{q}^\\top \\mathbf{k} / \\sqrt{d}$ — a scaled dot product, essentially an unnormalized cosine. **Orthogonal initialization** of weights in RNNs prevents gradient explosion by keeping signal magnitudes stable. The angle concept, once abstract, is the backbone of modern representation learning.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Orthogonal vectors",
          description: "$\\mathbf{u} = (3, 1)$ and $\\mathbf{v} = (-1, 3)$ are orthogonal: $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = -3 + 3 = 0$, so the angle is exactly 90°.",
          config: {
            vectors: [[3, 1], [-1, 3]],
            labels: ["u", "v ⊥ u"],
          },
        },
        {
          type: "matrix-transform-2d",
          title: "A rotation is orthogonal",
          description: "$Q = \\begin{pmatrix}\\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}$ preserves lengths and angles. Here $\\theta = 30°$.",
          config: {
            matrix: [
              [0.866, -0.5],
              [0.5, 0.866],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Two unit vectors have inner product $0.5$. What is the angle $\\theta$ between them, in degrees?",
          answer: 60,
          tolerance: 1,
          hint: "$\\cos\\theta = 0.5$; solve for $\\theta$.",
          explanation: "$\\cos^{-1}(0.5) = 60°$ (or $\\pi/3$ radians). This is a classic pair in the equilateral triangle — each internal angle of the triangle appears as the angle between edges.",
        },
        {
          type: "multiple-choice",
          question: "Are $\\mathbf{u} = (1, 2, -1)$ and $\\mathbf{v} = (3, -1, 1)$ orthogonal?",
          options: [
            "Yes — their dot product is 0.",
            "No — their dot product is 2.",
            "No — their dot product is -2.",
            "Cannot determine without magnitudes.",
          ],
          correctIndex: 0,
          hint: "Compute $\\mathbf{u}^\\top \\mathbf{v}$.",
          explanation: "$1\\cdot 3 + 2\\cdot(-1) + (-1)\\cdot 1 = 3 - 2 - 1 = 0$. Orthogonality requires only that the inner product vanish, not any particular magnitudes.",
        },
        {
          type: "multiple-choice",
          question: "Why does cosine similarity ignore vector magnitude, and why is this useful for text embeddings?",
          options: [
            "It is a bug in the definition.",
            "Dividing by $\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|$ normalizes the result; useful because document length shouldn't dominate topical similarity.",
            "Magnitude is always 1 for embeddings.",
            "Cosine similarity is only defined for integers.",
          ],
          correctIndex: 1,
          hint: "Think about what the normalization achieves.",
          explanation: "A long document and a short document about the same topic should be 'close' regardless of token count. Cosine similarity extracts only the **direction** of each embedding, making similarity depend on content rather than length — exactly the property you want for retrieval.",
        },
      ],
      keyTakeaways: [
        "$\\cos\\theta = \\langle \\mathbf{u}, \\mathbf{v}\\rangle / (\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|)$ defines the angle between vectors.",
        "Orthogonal vectors have zero inner product; orthogonal matrices preserve lengths and angles.",
        "Cosine similarity and attention mechanisms use this geometry at the heart of modern ML.",
      ],
      keyTakeawaysEs: [
        "$\cos\theta = \langle \mathbf{u}, \mathbf{v}\rangle / (\|\mathbf{u}\|\|\mathbf{v}\|)$ define el ángulo entre vectores.",
        "Los vectores ortogonales tienen producto interno cero; las matrices ortogonales preservan longitudes y ángulos.",
        "La similitud del coseno y los mecanismos de atención usan esta geometría en el corazón del ML moderno.",
      ],
    },

    // =========================================================================
    // LESSON 14 — Chapter 3.5: Orthonormal Basis
    // =========================================================================
    {
      title: "Orthonormal Basis",
      titleEs: "Base Ortonormal",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "A set of vectors $\\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$ is **orthonormal** if each has unit length ($\\|\\mathbf{b}_i\\| = 1$) and any two are orthogonal ($\\langle \\mathbf{b}_i, \\mathbf{b}_j\\rangle = 0$ for $i \\neq j$). Compactly, $\\langle \\mathbf{b}_i, \\mathbf{b}_j\\rangle = \\delta_{ij}$ (the Kronecker delta). An **orthonormal basis** is a basis that happens to be orthonormal — the best possible coordinate system.",
        "Why 'best possible'? Coordinates in an orthonormal basis are trivially computed: $c_i = \\langle \\mathbf{v}, \\mathbf{b}_i\\rangle$. No matrix inversion needed, just dot products. Moreover, lengths and inner products look exactly as in the standard basis: $\\langle \\mathbf{u}, \\mathbf{v}\\rangle = \\sum_i u_i v_i$ when both are expressed in an ONB. Orthonormality preserves Euclidean geometry.",
        "The **Gram–Schmidt process** constructs an orthonormal basis from any basis. Given $\\{\\mathbf{v}_1, \\dots, \\mathbf{v}_n\\}$: set $\\mathbf{u}_1 = \\mathbf{v}_1$, then iteratively subtract projections onto earlier $\\mathbf{u}_i$s: $\\mathbf{u}_k = \\mathbf{v}_k - \\sum_{i<k} \\frac{\\langle \\mathbf{v}_k, \\mathbf{u}_i\\rangle}{\\langle \\mathbf{u}_i, \\mathbf{u}_i\\rangle} \\mathbf{u}_i$. Finally normalize each $\\mathbf{u}_k$ to unit length. The procedure constructs the **QR decomposition** $A = QR$ used by many solvers.",
        "Numerically, classical Gram–Schmidt accumulates rounding error badly. **Modified Gram–Schmidt** reduces this by re-projecting each vector against the running orthonormalized set rather than the originals. For higher stability, **Householder reflections** or **Givens rotations** compute QR without ever explicitly forming the intermediate Gram-Schmidt vectors — this is what `numpy.linalg.qr` does.",
        "**Worked example — Gram–Schmidt on two vectors:** Start with $\\mathbf{v}_1 = (1, 1)$ and $\\mathbf{v}_2 = (1, 0)$. Set $\\mathbf{u}_1 = \\mathbf{v}_1 = (1, 1)$. Compute projection coefficient: $\\langle \\mathbf{v}_2, \\mathbf{u}_1\\rangle / \\|\\mathbf{u}_1\\|^2 = 1/2$. Then $\\mathbf{u}_2 = (1, 0) - \\tfrac{1}{2}(1, 1) = (\\tfrac{1}{2}, -\\tfrac{1}{2})$. Check orthogonality: $\\langle \\mathbf{u}_1, \\mathbf{u}_2\\rangle = \\tfrac{1}{2} - \\tfrac{1}{2} = 0$ ✓.",
        "**Worked example — normalizing to unit length:** Continuing above, $\\|\\mathbf{u}_1\\| = \\sqrt{2}$, $\\|\\mathbf{u}_2\\| = \\sqrt{1/2} = 1/\\sqrt{2}$. Normalize: $\\mathbf{q}_1 = (1/\\sqrt{2}, 1/\\sqrt{2})$, $\\mathbf{q}_2 = (1/\\sqrt{2}, -1/\\sqrt{2})$. Verify $\\|\\mathbf{q}_i\\| = 1$ and $\\langle \\mathbf{q}_1, \\mathbf{q}_2\\rangle = 1/2 - 1/2 = 0$ — a valid ONB of $\\mathbb{R}^2$ rotated 45° from the standard basis.",
        "Orthonormal bases show up constantly in ML. The **Discrete Fourier Transform** uses an ONB of complex sinusoids. **Wavelet bases** provide multi-resolution ONBs of functions. **PCA** finds an ONB of data-adapted directions, and **random orthogonal matrices** are used for initialization and low-distortion dimensionality reduction via the Johnson–Lindenstrauss lemma. Whenever you see an orthonormal basis, expect clean math and stable computation.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Two orthonormal bases of $\\mathbb{R}^2$",
          description: "The standard basis $\\{e_1, e_2\\}$ (black) and a rotated ONB $\\{(\\frac{1}{\\sqrt 2}, \\frac{1}{\\sqrt 2}), (-\\frac{1}{\\sqrt 2}, \\frac{1}{\\sqrt 2})\\}$ (red). Both describe the same plane.",
          config: {
            vectors: [[1, 0], [0, 1], [0.707, 0.707], [-0.707, 0.707]],
            labels: ["e₁", "e₂", "b₁", "b₂"],
          },
        },
        {
          type: "vector-2d",
          title: "Gram–Schmidt step",
          description: "Given $\\mathbf{v}_1 = (2, 0)$ and $\\mathbf{v}_2 = (1, 2)$, subtract the projection of $\\mathbf{v}_2$ onto $\\mathbf{v}_1$ to get an orthogonal pair.",
          config: {
            vectors: [[2, 0], [1, 2], [0, 2]],
            labels: ["v₁", "v₂", "u₂"],
          },
        },
      ],
      exercises: [
        {
          type: "vector-input",
          question: "Apply Gram–Schmidt to $\\mathbf{v}_1 = (1, 0)$ and $\\mathbf{v}_2 = (1, 1)$. Enter the second orthogonal vector $\\mathbf{u}_2$ (before normalization).",
          dimensions: 2,
          answer: [0, 1],
          tolerance: 0.01,
          showPreview: true,
          hint: "$\\mathbf{u}_2 = \\mathbf{v}_2 - \\frac{\\langle \\mathbf{v}_2, \\mathbf{v}_1\\rangle}{\\|\\mathbf{v}_1\\|^2} \\mathbf{v}_1$.",
          explanation: "$\\langle \\mathbf{v}_2, \\mathbf{v}_1\\rangle = 1$, $\\|\\mathbf{v}_1\\|^2 = 1$, so the projection is $(1, 0)$. $\\mathbf{u}_2 = (1, 1) - (1, 0) = (0, 1)$, which is indeed orthogonal to $\\mathbf{v}_1$.",
        },
        {
          type: "multiple-choice",
          question: "If $Q$ has orthonormal columns, what is $Q^\\top Q$?",
          options: [
            "The zero matrix",
            "$Q$ itself",
            "The identity matrix $I$",
            "Undefined",
          ],
          correctIndex: 2,
          hint: "Each entry $(i,j)$ of $Q^\\top Q$ is $\\langle \\mathbf{q}_i, \\mathbf{q}_j\\rangle$.",
          explanation: "The $(i,j)$ entry of $Q^\\top Q$ is $\\mathbf{q}_i^\\top \\mathbf{q}_j = \\delta_{ij}$, so $Q^\\top Q = I$. This is the defining identity of orthonormal columns (and, when $Q$ is square, of orthogonal matrices).",
        },
        {
          type: "multiple-choice",
          question: "Why are orthonormal bases numerically preferred in ML algorithms?",
          options: [
            "They are faster to store.",
            "Inner products and lengths keep their simple form, and orthonormal transformations do not amplify numerical errors.",
            "They are required by Python.",
            "Only orthonormal bases span vector spaces.",
          ],
          correctIndex: 1,
          hint: "Think about condition number and rounding error.",
          explanation: "Orthogonal matrices have condition number 1 — they do not magnify floating-point error. Coordinates computed via dot products are numerically stable. Contrast with general bases, where change-of-basis can amplify tiny perturbations significantly.",
        },
      ],
      keyTakeaways: [
        "Orthonormal means unit length and pairwise orthogonal — the friendliest coordinate system.",
        "Gram–Schmidt constructs an ONB from any basis and underlies the QR decomposition.",
        "Orthogonal matrices preserve inner products and are numerically stable.",
      ],
      keyTakeawaysEs: [
        "Ortonormal significa longitud unidad y ortogonales entre sí — el sistema de coordenadas más amigable.",
        "Gram–Schmidt construye una base ortonormal a partir de cualquier base y fundamenta la descomposición QR.",
        "Las matrices ortogonales preservan productos internos y son numéricamente estables.",
      ],
    },

    // =========================================================================
    // LESSON 15 — Chapter 3.6: Orthogonal Complement
    // =========================================================================
    {
      title: "Orthogonal Complement",
      titleEs: "Complemento Ortogonal",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "Given a subspace $U$ of an inner-product space $V$, its **orthogonal complement** is the set $U^\\perp = \\{\\mathbf{v} \\in V : \\langle \\mathbf{v}, \\mathbf{u}\\rangle = 0 \\text{ for all } \\mathbf{u} \\in U\\}$ — every vector that is orthogonal to every vector in $U$. This is itself a subspace, and it is the 'leftover' directions that $U$ misses.",
        "The crucial structural fact: $V = U \\oplus U^\\perp$, meaning every vector $\\mathbf{v} \\in V$ decomposes *uniquely* as $\\mathbf{v} = \\mathbf{v}_U + \\mathbf{v}_{U^\\perp}$ with $\\mathbf{v}_U \\in U$ and $\\mathbf{v}_{U^\\perp} \\in U^\\perp$. This is the **orthogonal decomposition** and it is the backbone of projections, least squares, and Fourier analysis. Dimensions also add: $\\dim U + \\dim U^\\perp = \\dim V$.",
        "A second pleasant property: $(U^\\perp)^\\perp = U$ — taking the complement twice returns you to the original subspace (in finite dimensions). So $U$ and $U^\\perp$ form a perfectly balanced pair, each fully determining the other.",
        "The **four fundamental subspaces** of a matrix $A \\in \\mathbb{R}^{m \\times n}$ are orthogonal complements in two natural pairings. Inside $\\mathbb{R}^n$: the null space $\\text{null}(A)$ and the row space $\\text{row}(A) = \\text{col}(A^\\top)$ are orthogonal complements. Inside $\\mathbb{R}^m$: the left null space $\\text{null}(A^\\top)$ and the column space $\\text{col}(A)$ are orthogonal complements. This is **Strang's fundamental theorem of linear algebra** in a single picture.",
        "**Worked example — complement of a line in $\\mathbb{R}^2$:** The line $U = \\text{span}\\{(1, 2)\\}$ has complement $U^\\perp = \\{(x, y) : x + 2y = 0\\} = \\text{span}\\{(2, -1)\\}$. Verify: $\\langle (1, 2), (2, -1)\\rangle = 2 - 2 = 0$ ✓. Dimensions add: $\\dim U + \\dim U^\\perp = 1 + 1 = 2 = \\dim \\mathbb{R}^2$.",
        "**Worked example — normal of a plane in $\\mathbb{R}^3$:** The plane $U = \\{(x, y, z) : x + y + z = 0\\}$ is 2-dimensional. Its orthogonal complement is $U^\\perp = \\text{span}\\{(1, 1, 1)\\}$ — the normal vector to the plane, 1-dimensional. Any vector like $(1, -1, 0) \\in U$ satisfies $\\langle (1,-1,0), (1,1,1)\\rangle = 0$ ✓.",
        "**Worked example — orthogonal decomposition:** Decompose $\\mathbf{v} = (3, 1)$ into $U$-part and $U^\\perp$-part for $U = \\text{span}\\{(1, 0)\\}$. Project onto $U$: $\\mathbf{v}_U = (3, 0)$. Residual: $\\mathbf{v}_{U^\\perp} = (3, 1) - (3, 0) = (0, 1)$. Reconstruct: $(3, 0) + (0, 1) = (3, 1)$ ✓, and $(3, 0) \\perp (0, 1)$ ✓.",
        "Applications abound. In regression, the residual vector $\\mathbf{y} - X\\hat{\\mathbf{w}}$ lies in the orthogonal complement of the column space of $X$ — that's *why* the normal equations $X^\\top(\\mathbf{y} - X\\hat{\\mathbf{w}}) = 0$ hold. In signal processing, separating a signal into 'useful subspace' plus 'noise subspace' is exactly an orthogonal decomposition. In PCA, the top-$k$ principal directions and the discarded directions are orthogonal complements.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "$U$ and $U^\\perp$ in $\\mathbb{R}^2$",
          description: "The subspace $U$ spanned by $(2, 1)$ has complement spanned by $(-1, 2)$. Together they fill $\\mathbb{R}^2$.",
          config: {
            vectors: [[2, 1], [-1, 2]],
            labels: ["U: span(2,1)", "U⊥: span(-1,2)"],
          },
        },
        {
          type: "vector-3d",
          title: "Line and its orthogonal plane",
          description: "In $\\mathbb{R}^3$, the orthogonal complement of a line is a plane (and vice versa). Dimensions add to 3.",
          config: {
            vectors: [[1, 1, 1], [1, -1, 0], [1, 1, -2]],
            labels: ["U: line", "U⊥", "U⊥"],
          },
        },
      ],
      exercises: [
        {
          type: "vector-input",
          question: "In $\\mathbb{R}^2$, find a non-zero vector orthogonal to $\\mathbf{u} = (3, 4)$.",
          dimensions: 2,
          answer: [4, -3],
          tolerance: 0.01,
          showPreview: true,
          hint: "For a 2D vector $(a, b)$, the vector $(b, -a)$ is always orthogonal.",
          explanation: "$(4, -3)$ satisfies $3\\cdot 4 + 4\\cdot(-3) = 12 - 12 = 0$. Any scalar multiple (like $(-4, 3)$ or $(8, -6)$) also works — $U^\\perp$ is a full 1-D line.",
        },
        {
          type: "multiple-choice",
          question: "For $A \\in \\mathbb{R}^{4 \\times 3}$ with rank 2, what is $\\dim(\\text{null}(A))$?",
          options: ["1", "2", "3", "4"],
          correctIndex: 0,
          hint: "Row space has dimension = rank. Null space is its orthogonal complement in $\\mathbb{R}^3$.",
          explanation: "The row space has dimension 2 (= rank) and lives in $\\mathbb{R}^3$ (= number of columns). Its orthogonal complement — the null space — has dimension $3 - 2 = 1$. This matches rank-nullity.",
        },
        {
          type: "multiple-choice",
          question: "In least-squares regression, why is the residual $\\mathbf{y} - X\\hat{\\mathbf{w}}$ orthogonal to the column space of $X$?",
          options: [
            "By coincidence.",
            "Because the optimal fit is the projection of $\\mathbf{y}$ onto $\\text{col}(X)$, and residuals live in the orthogonal complement.",
            "Because $X$ is orthogonal.",
            "The residual is zero, so orthogonality is trivial.",
          ],
          correctIndex: 1,
          hint: "Think about orthogonal decomposition $\\mathbf{y} = \\mathbf{y}_{\\text{col}(X)} + \\mathbf{y}_{\\text{col}(X)^\\perp}$.",
          explanation: "OLS finds $\\hat{\\mathbf{w}}$ so that $X\\hat{\\mathbf{w}}$ is the orthogonal projection of $\\mathbf{y}$ onto the column space. By definition of projection, the residual $\\mathbf{y} - X\\hat{\\mathbf{w}}$ sits in the orthogonal complement — giving the normal equations $X^\\top(\\mathbf{y} - X\\hat{\\mathbf{w}}) = 0$.",
        },
      ],
      keyTakeaways: [
        "$U^\\perp$ is all vectors orthogonal to every element of $U$; it is itself a subspace.",
        "Every vector splits uniquely as $\\mathbf{v}_U + \\mathbf{v}_{U^\\perp}$, and dimensions add.",
        "Row space and null space are orthogonal complements — the geometric heart of least squares.",
      ],
      keyTakeawaysEs: [
        "$U^\perp$ es el conjunto de vectores ortogonales a todo elemento de $U$; es a su vez un subespacio.",
        "Todo vector se descompone de forma única como $\mathbf{v}_U + \mathbf{v}_{U^\perp}$, y las dimensiones se suman.",
        "El espacio fila y el espacio nulo son complementos ortogonales — el corazón geométrico de mínimos cuadrados.",
      ],
    },

    // =========================================================================
    // LESSON 16 — Chapter 3.7: Orthogonal Projections
    // =========================================================================
    {
      title: "Orthogonal Projections",
      titleEs: "Proyecciones Ortogonales",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "An **orthogonal projection** onto a subspace $U$ is the linear map $\\pi_U : V \\to V$ that sends each vector $\\mathbf{v}$ to its unique best approximation by an element of $U$ — the vector $\\mathbf{u}^* \\in U$ minimizing $\\|\\mathbf{v} - \\mathbf{u}\\|$. By the orthogonal decomposition theorem, this $\\mathbf{u}^*$ is exactly the $U$-component of $\\mathbf{v}$.",
        "For a 1-D subspace spanned by a unit vector $\\mathbf{b}$, the projection is simple: $\\pi_{\\mathbf{b}}(\\mathbf{v}) = \\langle \\mathbf{v}, \\mathbf{b}\\rangle \\mathbf{b}$. When $\\mathbf{b}$ is not unit, divide by its squared norm: $\\pi_{\\mathbf{b}}(\\mathbf{v}) = \\frac{\\langle \\mathbf{v}, \\mathbf{b}\\rangle}{\\langle \\mathbf{b}, \\mathbf{b}\\rangle} \\mathbf{b}$. The scalar $\\langle \\mathbf{v}, \\mathbf{b}\\rangle / \\|\\mathbf{b}\\|^2$ is the **coordinate** of the projection along $\\mathbf{b}$.",
        "For a general subspace $U = \\text{col}(B)$ where $B$'s columns are a basis of $U$, the projection matrix is $P_U = B(B^\\top B)^{-1} B^\\top$. If the columns of $B$ are orthonormal, this simplifies to $P_U = BB^\\top$. Projection matrices are **symmetric** ($P^\\top = P$) and **idempotent** ($P^2 = P$): projecting twice is the same as projecting once.",
        "The **least-squares solution** to $A\\mathbf{x} = \\mathbf{b}$ (when exact solutions don't exist) is exactly $\\hat{\\mathbf{x}} = (A^\\top A)^{-1} A^\\top \\mathbf{b}$ — the preimage of the projection of $\\mathbf{b}$ onto $\\text{col}(A)$. Every regression problem, every curve fit, every dimension-reduction step is secretly an orthogonal projection in disguise.",
        "**Worked example — project onto a line:** Project $\\mathbf{v} = (2, 3)$ onto $\\text{span}\\{(1, 0)\\}$. Since $\\mathbf{b} = (1, 0)$ is a unit vector, $\\pi(\\mathbf{v}) = \\langle \\mathbf{v}, \\mathbf{b}\\rangle \\mathbf{b} = 2 \\cdot (1, 0) = (2, 0)$. The residual $(0, 3)$ is perpendicular to the $x$-axis ✓.",
        "**Worked example — project onto a non-unit line:** Project $\\mathbf{v} = (3, 4)$ onto $\\text{span}\\{(1, 1)\\}$. Here $\\|\\mathbf{b}\\|^2 = 2$ and $\\langle \\mathbf{v}, \\mathbf{b}\\rangle = 7$. So $\\pi(\\mathbf{v}) = \\frac{7}{2}(1, 1) = (3.5, 3.5)$. The residual $(-0.5, 0.5)$ is indeed orthogonal to $(1,1)$: $-0.5 + 0.5 = 0$ ✓.",
        "**Worked example — projection matrix onto the $xy$-plane:** For $B = \\begin{pmatrix}1 & 0\\\\0 & 1\\\\0 & 0\\end{pmatrix}$ (orthonormal columns), $P = BB^\\top = \\begin{pmatrix}1 & 0 & 0\\\\0 & 1 & 0\\\\0 & 0 & 0\\end{pmatrix}$. Applied to $(1, 2, 3)$ gives $(1, 2, 0)$ — the $z$-component is dropped. Check $P^2 = P$ ✓ (idempotent).",
        "Projections also power **feature extraction** and **denoising**. PCA projects data onto the top-$k$ principal subspace, discarding noise directions. In image compression, projecting onto a wavelet or DCT basis and keeping the largest coefficients is a lossy projection that the human eye hardly notices. Whenever you approximate something complicated with something simpler, a projection is almost certainly under the hood.",
      ],
      visualizations: [
        {
          type: "vector-2d",
          title: "Projecting a vector onto a line",
          description: "$\\mathbf{v} = (3, 2)$ projects onto the line $\\text{span}(1, 1)$ giving $\\pi(\\mathbf{v}) = (2.5, 2.5)$. The residual $\\mathbf{v} - \\pi(\\mathbf{v})$ is perpendicular to the line.",
          config: {
            vectors: [[3, 2], [2.5, 2.5], [0.5, -0.5]],
            labels: ["v", "π(v)", "v - π(v)"],
          },
        },
        {
          type: "vector-3d",
          title: "Projection onto a plane",
          description: "In $\\mathbb{R}^3$, projecting onto a 2-D plane drops the vector 'straight down' along the plane's normal.",
          config: {
            vectors: [[1, 2, 3], [1, 2, 0], [0, 0, 3]],
            labels: ["v", "π(v)", "residual"],
          },
        },
      ],
      exercises: [
        {
          type: "vector-input",
          question: "Project $\\mathbf{v} = (4, 3)$ onto the line spanned by $\\mathbf{b} = (1, 0)$.",
          dimensions: 2,
          answer: [4, 0],
          tolerance: 0.01,
          showPreview: true,
          hint: "Projecting onto the $x$-axis sets the $y$-coordinate to zero.",
          explanation: "$\\langle \\mathbf{v}, \\mathbf{b}\\rangle = 4$, $\\|\\mathbf{b}\\|^2 = 1$, so $\\pi(\\mathbf{v}) = 4\\mathbf{b} = (4, 0)$. The residual $(0, 3)$ is perpendicular to the $x$-axis.",
        },
        {
          type: "numeric-input",
          question: "What is the squared distance from $\\mathbf{v} = (1, 2, 2)$ to the $xy$-plane (the subspace $z = 0$)?",
          answer: 4,
          tolerance: 0.01,
          hint: "The distance is the length of the component perpendicular to the plane.",
          explanation: "Projecting onto the $xy$-plane gives $(1, 2, 0)$; the residual is $(0, 0, 2)$, which has squared norm $4$. The projection is the closest point; the residual length is the distance.",
        },
        {
          type: "multiple-choice",
          question: "Which property does a projection matrix $P$ satisfy?",
          options: [
            "$P = P^{-1}$",
            "$P^2 = P$ (idempotent)",
            "$P$ is always orthogonal",
            "$P$ is always invertible",
          ],
          correctIndex: 1,
          hint: "Projecting a vector that's already in the subspace leaves it unchanged.",
          explanation: "Projections are **idempotent**: once a vector is projected into $U$, projecting again does nothing. This is the defining algebraic property: $P^2 = P$. Projections are generally not invertible (they collapse $U^\\perp$ to zero).",
        },
      ],
      keyTakeaways: [
        "$\\pi_U(\\mathbf{v})$ is the closest point in $U$ to $\\mathbf{v}$; the residual is in $U^\\perp$.",
        "Projection matrices are symmetric and idempotent: $P^\\top = P$ and $P^2 = P$.",
        "Least squares, PCA, and many ML techniques are orthogonal projections.",
      ],
      keyTakeawaysEs: [
        "$\pi_U(\mathbf{v})$ es el punto de $U$ más cercano a $\mathbf{v}$; el residual está en $U^\perp$.",
        "Las matrices de proyección son simétricas e idempotentes: $P^\top = P$ y $P^2 = P$.",
        "Mínimos cuadrados, PCA y muchas técnicas de ML son proyecciones ortogonales.",
      ],
    },

    // =========================================================================
    // LESSON 17 — Chapter 3.8: Rotations
    // =========================================================================
    {
      title: "Rotations",
      titleEs: "Rotaciones",
      chapter: "Analytic Geometry",
      chapterEs: "Geometría Analítica",
      chapterNumber: 3,
      content: [
        "A **rotation** is a linear transformation that preserves lengths, angles, and orientation. In $\\mathbb{R}^2$, rotation by angle $\\theta$ counterclockwise is the matrix $R_\\theta = \\begin{pmatrix}\\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}$. Its columns are unit vectors 90° apart; it satisfies $R^\\top R = I$ and $\\det R = +1$ (the $+1$ is what distinguishes rotations from reflections, which have $\\det = -1$).",
        "Rotations in $\\mathbb{R}^2$ form a **group** under composition: $R_\\alpha R_\\beta = R_{\\alpha + \\beta}$, rotations commute, and every rotation has an inverse $R_\\theta^{-1} = R_{-\\theta} = R_\\theta^\\top$. This beautiful structure is called $SO(2)$, the **special orthogonal group** in 2 dimensions.",
        "In 3D, rotations are specified by an axis and an angle. Elementary rotations about the $x$-, $y$-, and $z$-axes have well-known $3\\times 3$ matrix forms; any rotation can be decomposed into three such elementary ones via **Euler angles**. Unlike 2D, 3D rotations do **not** commute — rotating yaw-then-pitch is different from pitch-then-yaw, a fact pilots and robotics engineers know intimately.",
        "Higher-dimensional rotations live in $SO(n)$, the group of orthogonal matrices with determinant $+1$. These preserve Euclidean distance and orientation in any number of dimensions. An important fact: every rotation can be written as $R = e^{A}$ for some skew-symmetric matrix $A$ (i.e., $A^\\top = -A$). This is the bridge between the **Lie group** $SO(n)$ and its **Lie algebra** $\\mathfrak{so}(n)$, used in robotics and differential geometry.",
        "**Worked example — rotate by 90°:** $R_{90°} = \\begin{pmatrix}0 & -1\\\\1 & 0\\end{pmatrix}$. Apply to $\\mathbf{e}_1 = (1, 0)$: $R\\mathbf{e}_1 = (0, 1) = \\mathbf{e}_2$ — the $x$-axis rotates to the $y$-axis, as expected. Apply to $(2, 3)$: result is $(-3, 2)$. Length preserved: $\\sqrt{4 + 9} = \\sqrt{9 + 4}$ ✓.",
        "**Worked example — rotate by 45°:** $R_{45°} = \\begin{pmatrix}\\cos 45° & -\\sin 45°\\\\ \\sin 45° & \\cos 45°\\end{pmatrix} = \\tfrac{1}{\\sqrt 2}\\begin{pmatrix}1 & -1\\\\1 & 1\\end{pmatrix}$. Apply to $(1, 0)$: get $(1/\\sqrt 2, 1/\\sqrt 2)$ — the diagonal direction. Length is $\\sqrt{1/2 + 1/2} = 1$ ✓.",
        "**Worked example — composition of rotations:** $R_{30°}R_{60°} = R_{90°}$ — rotations compose by *adding* angles. Algebraically, $\\cos(30° + 60°) = \\cos 30° \\cos 60° - \\sin 30° \\sin 60°$, the well-known trig identity that emerges naturally from matrix multiplication.",
        "Rotations matter in ML beyond graphics. In PCA, a data rotation aligns axes with directions of maximum variance. In normalizing flows, each invertible transformation is often a composition of rotations and scalings. **Rotary Position Embedding (RoPE)** in modern transformers encodes positions by rotating query/key vectors in high-dimensional space — a mathematically elegant way to inject sequence position that preserves inner products up to phase. Knowing your rotations is surprisingly practical.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Rotation by 45°",
          description: "$R_{45°} = \\begin{pmatrix}\\frac{\\sqrt 2}{2} & -\\frac{\\sqrt 2}{2} \\\\ \\frac{\\sqrt 2}{2} & \\frac{\\sqrt 2}{2}\\end{pmatrix}$ rotates every point by $45°$ counterclockwise.",
          config: {
            matrix: [
              [0.707, -0.707],
              [0.707, 0.707],
            ],
            animateFromIdentity: true,
          },
        },
        {
          type: "matrix-transform-3d",
          title: "3D rotation about the $z$-axis",
          description: "A rotation in the $xy$-plane leaves the $z$-axis fixed. The matrix has the 2D rotation block and a 1 in the corner.",
          config: {
            matrix: [
              [0.866, -0.5, 0],
              [0.5, 0.866, 0],
              [0, 0, 1],
            ],
          },
        },
      ],
      exercises: [
        {
          type: "matrix-input",
          question: "Write the $2\\times 2$ rotation matrix for $\\theta = 90°$ counterclockwise.",
          rows: 2,
          cols: 2,
          answer: [
            [0, -1],
            [1, 0],
          ],
          tolerance: 0.01,
          hint: "$\\cos 90° = 0$, $\\sin 90° = 1$.",
          explanation: "$R_{90°} = \\begin{pmatrix}0 & -1 \\\\ 1 & 0\\end{pmatrix}$. Check: $(1, 0) \\mapsto (0, 1)$ and $(0, 1) \\mapsto (-1, 0)$ — a quarter turn counterclockwise.",
        },
        {
          type: "vector-input",
          question: "Rotate the vector $(1, 0)$ by $90°$ counterclockwise. Enter the result.",
          dimensions: 2,
          answer: [0, 1],
          tolerance: 0.01,
          showPreview: true,
          hint: "Apply $R_{90°}$ to the vector.",
          explanation: "$R_{90°}(1, 0) = (0\\cdot 1 + (-1)\\cdot 0,\\; 1\\cdot 1 + 0\\cdot 0) = (0, 1)$. The positive $x$-axis rotates to the positive $y$-axis.",
        },
        {
          type: "multiple-choice",
          question: "Which statement about 3D rotations is TRUE?",
          options: [
            "They always commute.",
            "They do not commute in general — rotation order matters.",
            "They are determined by a single angle.",
            "They have determinant $-1$.",
          ],
          correctIndex: 1,
          hint: "Think about the difference between yaw-then-pitch and pitch-then-yaw.",
          explanation: "3D rotations **do not commute**: $R_x R_y \\neq R_y R_x$ in general. This non-commutativity is the source of Gimbal lock and the reason quaternions are used in practice. Rotations always have determinant $+1$ (reflections have $-1$).",
        },
      ],
      keyTakeaways: [
        "A rotation is an orthogonal matrix with $\\det = +1$ — it preserves lengths, angles, and orientation.",
        "2D rotations commute and form $SO(2)$; 3D rotations do not commute.",
        "Rotations appear in PCA, RoPE embeddings, and normalizing flows in modern ML.",
      ],
      keyTakeawaysEs: [
        "Una rotación es una matriz ortogonal con $\det = +1$ — preserva longitudes, ángulos y orientación.",
        "Las rotaciones 2D conmutan y forman $SO(2)$; las rotaciones 3D no conmutan.",
        "Las rotaciones aparecen en PCA, embeddings RoPE y normalizing flows del ML moderno.",
      ],
    },

    // =========================================================================
    // LESSON 18 — Chapter 4.1: Determinant and Trace
    // =========================================================================
    {
      title: "Determinant and Trace",
      titleEs: "Determinante y Traza",
      chapter: "Matrix Decompositions",
      chapterEs: "Descomposiciones Matriciales",
      chapterNumber: 4,
      content: [
        "The **determinant** $\\det(A)$ of a square matrix is a single scalar that captures the **signed volume scaling factor** of the linear map $\\mathbf{x} \\mapsto A\\mathbf{x}$. If $\\det(A) = 3$, the map triples areas (in 2D) or volumes (in 3D). If $\\det(A) < 0$, it reverses orientation (like a reflection). If $\\det(A) = 0$, the map collapses space — volumes become zero because the image is lower-dimensional.",
        "For a $2\\times 2$ matrix, $\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$. In higher dimensions, the determinant expands recursively via **cofactor expansion** or is computed numerically from the LU decomposition as the product of pivots. Key identities: $\\det(AB) = \\det(A)\\det(B)$, $\\det(A^\\top) = \\det(A)$, and $\\det(A^{-1}) = 1/\\det(A)$.",
        "The determinant is the gatekeeper of invertibility: $A$ is invertible iff $\\det(A) \\neq 0$. Singular matrices live on a thin surface in the space of all matrices, the **zero set** of the determinant polynomial. Numerically, a near-zero determinant warns of ill-conditioning — though the determinant itself can be a misleading size estimate (condition number is a better diagnostic).",
        "The **trace** $\\text{tr}(A)$ is the sum of diagonal entries. Despite its simple definition, it has rich properties: $\\text{tr}(AB) = \\text{tr}(BA)$ (even when $AB \\neq BA$!), it is linear ($\\text{tr}(A + B) = \\text{tr}(A) + \\text{tr}(B)$), and it equals the **sum of eigenvalues**. Dually, the determinant equals the **product of eigenvalues**.",
        "**Worked example — 2×2 determinant:** For $A = \\begin{pmatrix}3 & 2 \\\\ 1 & 4\\end{pmatrix}$, $\\det A = 3\\cdot 4 - 2\\cdot 1 = 12 - 2 = 10$. So $A$ scales areas by 10: the unit square $[0,1]^2$ becomes a parallelogram of area 10.",
        "**Worked example — singular matrix (det = 0):** $A = \\begin{pmatrix}1 & 2\\\\2 & 4\\end{pmatrix}$: $\\det = 1\\cdot 4 - 2\\cdot 2 = 0$. The two columns $(1,2)$ and $(2,4)$ are parallel, so the image is a line, not a 2D region — zero area. Singular.",
        "**Worked example — trace and eigenvalues:** For $A = \\begin{pmatrix}2 & 1\\\\0 & 3\\end{pmatrix}$: $\\text{tr}(A) = 2 + 3 = 5$, and the eigenvalues are $\\lambda_1 = 2, \\lambda_2 = 3$ (diagonal of triangular matrix). Sum: $2 + 3 = 5$ ✓. Product: $6 = \\det(A) = 2\\cdot 3 - 1\\cdot 0 = 6$ ✓.",
        "Both show up throughout ML. The **log-determinant** $\\log \\det(A)$ appears in multivariate Gaussian log-likelihoods and is a key term in normalizing flow training (where the change of variables formula requires $\\log|\\det(\\partial f/\\partial \\mathbf{x})|$). The trace powers the **Frobenius norm** $\\|A\\|_F^2 = \\text{tr}(A^\\top A)$, used as a matrix-level regularizer. Understanding determinant and trace is the key to reading many probabilistic ML papers.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Determinant as area scaling",
          description: "This matrix has $\\det = 2 \\cdot 3 - 1 \\cdot 0 = 6$, meaning it scales every area by 6. A unit square becomes a parallelogram of area 6.",
          config: {
            matrix: [
              [2, 1],
              [0, 3],
            ],
            animateFromIdentity: true,
          },
        },
        {
          type: "matrix-transform-2d",
          title: "Determinant zero = collapse",
          description: "$\\det\\begin{pmatrix}1 & 2 \\\\ 2 & 4\\end{pmatrix} = 0$ — the matrix sends the whole plane to a line, so the area scaling factor is zero.",
          config: {
            matrix: [
              [1, 2],
              [2, 4],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Compute $\\det\\begin{pmatrix}3 & 1 \\\\ 2 & 4\\end{pmatrix}$.",
          answer: 10,
          tolerance: 0.01,
          hint: "For a 2×2 matrix: $ad - bc$.",
          explanation: "$3\\cdot 4 - 1\\cdot 2 = 12 - 2 = 10$. The matrix scales areas by 10.",
        },
        {
          type: "numeric-input",
          question: "Find $\\text{tr}(A)$ for $A = \\begin{pmatrix}4 & 1 & -2 \\\\ 3 & 5 & 0 \\\\ 0 & 7 & 2\\end{pmatrix}$.",
          answer: 11,
          tolerance: 0.01,
          hint: "Sum the diagonal.",
          explanation: "$\\text{tr}(A) = 4 + 5 + 2 = 11$. Off-diagonal entries don't matter. This also equals the sum of the matrix's eigenvalues.",
        },
        {
          type: "multiple-choice",
          question: "Which identity always holds, even when $AB \\neq BA$?",
          options: [
            "$\\text{tr}(AB) = \\text{tr}(A) \\cdot \\text{tr}(B)$",
            "$\\text{tr}(AB) = \\text{tr}(BA)$",
            "$\\det(A + B) = \\det(A) + \\det(B)$",
            "$\\text{tr}(A^{-1}) = 1 / \\text{tr}(A)$",
          ],
          correctIndex: 1,
          hint: "Trace is invariant under cyclic permutation.",
          explanation: "**Cyclic invariance**: $\\text{tr}(AB) = \\text{tr}(BA)$ always. This is surprising since the matrices themselves don't commute — but the sum of diagonals of the product does. It's why we can freely rearrange traces in derivations: $\\text{tr}(ABC) = \\text{tr}(BCA) = \\text{tr}(CAB)$.",
        },
      ],
      keyTakeaways: [
        "$\\det(A)$ measures signed volume scaling; $A$ is invertible iff $\\det(A) \\neq 0$.",
        "$\\text{tr}(A)$ sums the diagonal and is cyclically invariant: $\\text{tr}(AB) = \\text{tr}(BA)$.",
        "Determinant = product of eigenvalues; trace = sum of eigenvalues.",
      ],
      keyTakeawaysEs: [
        "$\det(A)$ mide el escalado de volumen con signo; $A$ es invertible sii $\det(A) \neq 0$.",
        "$\text{tr}(A)$ suma la diagonal y es invariante cíclica: $\text{tr}(AB) = \text{tr}(BA)$.",
        "Determinante = producto de autovalores; traza = suma de autovalores.",
      ],
    },

    // =========================================================================
    // LESSON 19 — Chapter 4.2: Eigenvalues and Eigenvectors
    // =========================================================================
    {
      title: "Eigenvalues and Eigenvectors",
      titleEs: "Autovalores y Autovectores",
      chapter: "Matrix Decompositions",
      chapterEs: "Descomposiciones Matriciales",
      chapterNumber: 4,
      content: [
        "An **eigenvector** of a square matrix $A$ is a non-zero vector $\\mathbf{v}$ that $A$ stretches without rotating: $A\\mathbf{v} = \\lambda \\mathbf{v}$ for some scalar $\\lambda$, the corresponding **eigenvalue**. Eigenvectors are the *invariant directions* of the map: every other vector gets bent by $A$, but these lie along axes that $A$ merely scales.",
        "To find them algebraically, rewrite $A\\mathbf{v} = \\lambda \\mathbf{v}$ as $(A - \\lambda I)\\mathbf{v} = \\mathbf{0}$. For a non-trivial $\\mathbf{v}$ to exist, $A - \\lambda I$ must be singular, i.e., $\\det(A - \\lambda I) = 0$. This equation in $\\lambda$ is the **characteristic polynomial** — a polynomial of degree $n$ whose roots are the eigenvalues. For each root $\\lambda$, the corresponding eigenvectors span the **eigenspace** $\\ker(A - \\lambda I)$.",
        "Eigenvalues can be real or complex, distinct or repeated. A $2\\times 2$ rotation matrix has complex eigenvalues $e^{\\pm i\\theta}$ — it has no real invariant direction other than the origin. A **diagonalizable** matrix has $n$ linearly independent eigenvectors that form a basis; in that basis, $A$ acts by pure scaling. A **defective** matrix (like $\\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$) has fewer independent eigenvectors than its size — it cannot be fully diagonalized and needs Jordan form.",
        "Symmetric real matrices enjoy a remarkable guarantee called the **spectral theorem**: all eigenvalues are real, eigenvectors from different eigenspaces are orthogonal, and the matrix can be diagonalized by an orthonormal basis: $A = QDQ^\\top$ with $Q$ orthogonal and $D$ diagonal. This is the cleanest possible factorization, and it is why covariance matrices, Hessians, and Laplacians are such tractable objects.",
        "**Worked example — eigenvalues of a triangular matrix:** For $A = \\begin{pmatrix}2 & 1\\\\0 & 3\\end{pmatrix}$, the characteristic polynomial is $\\det(A - \\lambda I) = (2 - \\lambda)(3 - \\lambda) - 0 = 0$, giving $\\lambda_1 = 2, \\lambda_2 = 3$. For upper/lower triangular matrices, the eigenvalues are simply the diagonal entries.",
        "**Worked example — finding an eigenvector:** With $A = \\begin{pmatrix}2 & 1\\\\0 & 3\\end{pmatrix}$ and $\\lambda = 3$: solve $(A - 3I)\\mathbf{v} = \\mathbf{0}$, i.e. $\\begin{pmatrix}-1 & 1\\\\0 & 0\\end{pmatrix}\\binom{v_1}{v_2} = \\mathbf{0}$. Top row: $-v_1 + v_2 = 0 \\Rightarrow v_1 = v_2$. Take $\\mathbf{v} = (1, 1)$. Verify: $A\\binom{1}{1} = \\binom{3}{3} = 3\\binom{1}{1}$ ✓.",
        "**Worked example — symmetric 2×2:** For $A = \\begin{pmatrix}3 & 1\\\\1 & 3\\end{pmatrix}$, char poly: $(3 - \\lambda)^2 - 1 = \\lambda^2 - 6\\lambda + 8 = 0$, giving $\\lambda = 4, 2$. Eigenvectors: $\\lambda = 4$: solve $\\begin{pmatrix}-1 & 1\\\\1 & -1\\end{pmatrix}\\mathbf{v} = 0 \\Rightarrow \\mathbf{v} = (1, 1)$. $\\lambda = 2$: $\\mathbf{v} = (1, -1)$. The two eigenvectors are **orthogonal** — a hallmark of symmetric matrices.",
        "Eigenvalues unlock enormous parts of ML. **PCA** extracts the top eigenvectors of the covariance matrix as principal directions. **Spectral clustering** uses eigenvectors of the graph Laplacian. **Google's PageRank** is the dominant eigenvector of a stochastic matrix. Even the stability of a neural-network dynamical system hinges on whether the Jacobian's eigenvalues lie inside the unit disk.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Eigenvectors: directions that don't bend",
          description: "$A = \\begin{pmatrix}2 & 1 \\\\ 0 & 3\\end{pmatrix}$ has eigenvalues 2 and 3. Vectors along the eigenvectors get scaled; other vectors also rotate.",
          config: {
            matrix: [
              [2, 1],
              [0, 3],
            ],
            animateFromIdentity: true,
          },
        },
        {
          type: "eigenspace-3d",
          title: "Eigenspaces in 3D",
          description: "For a symmetric matrix in $\\mathbb{R}^3$, eigenvectors form an orthogonal basis — three perpendicular directions that diagonalize the matrix.",
          config: {
            vectors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
            labels: ["v₁ (λ=3)", "v₂ (λ=1)", "v₃ (λ=0.5)"],
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Find the larger eigenvalue of $A = \\begin{pmatrix}3 & 1 \\\\ 0 & 2\\end{pmatrix}$.",
          answer: 3,
          tolerance: 0.01,
          hint: "For an upper-triangular matrix, eigenvalues are the diagonal entries.",
          explanation: "The characteristic polynomial $(3-\\lambda)(2-\\lambda) = 0$ gives $\\lambda = 2, 3$. The larger is **3**. For triangular matrices, the diagonal gives you the eigenvalues for free.",
        },
        {
          type: "vector-input",
          question: "Find an eigenvector of $A = \\begin{pmatrix}2 & 0 \\\\ 0 & 5\\end{pmatrix}$ corresponding to $\\lambda = 5$.",
          dimensions: 2,
          answer: [0, 1],
          tolerance: 0.01,
          showPreview: true,
          hint: "$A$ is diagonal — the standard basis vectors are eigenvectors.",
          explanation: "$A\\mathbf{e}_2 = (0, 5) = 5\\cdot (0, 1)$, so $(0, 1)$ is an eigenvector with eigenvalue 5. Any non-zero scalar multiple also works — the eigenspace is the entire $y$-axis.",
        },
        {
          type: "multiple-choice",
          question: "Why does PCA work by taking eigenvectors of the covariance matrix?",
          options: [
            "Because eigenvectors are orthogonal (for symmetric matrices), they provide a clean basis aligned with variance directions.",
            "By random coincidence.",
            "Because covariance matrices are always diagonal.",
            "Because eigenvalues are integers.",
          ],
          correctIndex: 0,
          hint: "Symmetric matrices are orthogonally diagonalizable, and eigenvalues measure spread along eigenvectors.",
          explanation: "The covariance matrix is symmetric, so its eigenvectors are orthogonal and its eigenvalues are real non-negative. The top eigenvector points in the direction of **maximum variance**, the next-largest eigenvalue's eigenvector is the next best *orthogonal* direction, and so on. PCA is exactly this diagonalization.",
        },
      ],
      keyTakeaways: [
        "Eigenvectors are invariant directions of a linear map; eigenvalues say how much they scale.",
        "The characteristic polynomial $\\det(A - \\lambda I) = 0$ finds eigenvalues.",
        "Symmetric matrices diagonalize in an orthonormal basis — the core of PCA and spectral methods.",
      ],
      keyTakeawaysEs: [
        "Los autovectores son direcciones invariantes de un mapa lineal; los autovalores dicen cuánto se escalan.",
        "El polinomio característico $\det(A - \lambda I) = 0$ encuentra los autovalores.",
        "Las matrices simétricas se diagonalizan en una base ortonormal — el núcleo del PCA y los métodos espectrales.",
      ],
    },

    // =========================================================================
    // LESSON 20 — Chapter 4.3: Cholesky Decomposition
    // =========================================================================
    {
      title: "Cholesky Decomposition",
      titleEs: "Descomposición de Cholesky",
      chapter: "Matrix Decompositions",
      chapterEs: "Descomposiciones Matriciales",
      chapterNumber: 4,
      content: [
        "The **Cholesky decomposition** factors a symmetric positive definite (SPD) matrix $A$ as $A = LL^\\top$, where $L$ is lower triangular with positive diagonal entries. It is essentially the 'square root' of an SPD matrix — analogous to writing a positive number as $x = (\\sqrt{x})^2$.",
        "A matrix is **positive definite** if $\\mathbf{x}^\\top A \\mathbf{x} > 0$ for every non-zero $\\mathbf{x}$. Equivalently, all eigenvalues are strictly positive. SPD matrices are ubiquitous: covariance matrices, Gram matrices $X^\\top X$ (when $X$ has full column rank), and Hessians at strict minima are all SPD. Cholesky is the fastest, most numerically stable factorization available for this class.",
        "The algorithm is specialized Gaussian elimination that exploits symmetry. For each row $i$, compute the diagonal entry $\\ell_{ii} = \\sqrt{a_{ii} - \\sum_{k<i}\\ell_{ik}^2}$ and the sub-diagonal entries via similar formulas. The process fails iff some diagonal element becomes non-positive — a clean **test** for positive definiteness: a matrix is SPD iff Cholesky succeeds without complex square roots.",
        "Cholesky solves $A\\mathbf{x} = \\mathbf{b}$ in two triangular steps: first $L\\mathbf{y} = \\mathbf{b}$ (forward substitution), then $L^\\top \\mathbf{x} = \\mathbf{y}$ (backward substitution). Each step costs $O(n^2)$; the decomposition itself is $O(n^3/3)$, **half** the cost of LU. That is why Cholesky is the default when solving normal equations for linear regression (since $X^\\top X$ is SPD).",
        "**Worked example — Cholesky of a 2×2 SPD matrix:** Factor $A = \\begin{pmatrix}4 & 2\\\\2 & 3\\end{pmatrix}$. Compute $\\ell_{11} = \\sqrt{4} = 2$. $\\ell_{21} = a_{21}/\\ell_{11} = 2/2 = 1$. $\\ell_{22} = \\sqrt{a_{22} - \\ell_{21}^2} = \\sqrt{3 - 1} = \\sqrt{2}$. So $L = \\begin{pmatrix}2 & 0\\\\1 & \\sqrt{2}\\end{pmatrix}$. Verify $LL^\\top = \\begin{pmatrix}4 & 2\\\\2 & 1 + 2\\end{pmatrix} = A$ ✓.",
        "**Worked example — detecting non-SPD:** Try to Cholesky-factor $A = \\begin{pmatrix}1 & 2\\\\2 & 1\\end{pmatrix}$. $\\ell_{11} = 1$, $\\ell_{21} = 2$, $\\ell_{22} = \\sqrt{1 - 4} = \\sqrt{-3}$ — imaginary! The algorithm fails, signaling $A$ is **not positive definite**. Indeed, $A$ has eigenvalues $-1$ and $3$ (indefinite), which Cholesky reliably detects.",
        "Beyond solving, Cholesky has distinctive ML uses. In Bayesian methods and Gaussian processes, it lets us **sample from multivariate Gaussians**: if $\\mathbf{z} \\sim \\mathcal{N}(\\mathbf{0}, I)$ and $A = LL^\\top$, then $L\\mathbf{z} \\sim \\mathcal{N}(\\mathbf{0}, A)$ — a single matrix-vector multiply generates correlated samples. It also computes log-determinants cheaply: $\\log\\det(A) = 2\\sum_i \\log \\ell_{ii}$, needed in likelihoods and variational lower bounds.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Cholesky factor reshapes a circle into an ellipse",
          description: "$L$ maps the unit circle to an ellipse whose covariance equals $A = LL^\\top$. This is how Cholesky samples correlated Gaussians.",
          config: {
            matrix: [
              [1.4, 0],
              [0.7, 1.2],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "matrix-input",
          question: "Find the Cholesky factor $L$ of $A = \\begin{pmatrix}4 & 2 \\\\ 2 & 5\\end{pmatrix}$.",
          rows: 2,
          cols: 2,
          answer: [
            [2, 0],
            [1, 2],
          ],
          tolerance: 0.01,
          hint: "$\\ell_{11} = \\sqrt{a_{11}}$, $\\ell_{21} = a_{21}/\\ell_{11}$, $\\ell_{22} = \\sqrt{a_{22} - \\ell_{21}^2}$.",
          explanation: "$\\ell_{11} = \\sqrt{4} = 2$. $\\ell_{21} = 2/2 = 1$. $\\ell_{22} = \\sqrt{5 - 1} = 2$. Check: $LL^\\top = \\begin{pmatrix}2 & 0 \\\\ 1 & 2\\end{pmatrix}\\begin{pmatrix}2 & 1 \\\\ 0 & 2\\end{pmatrix} = \\begin{pmatrix}4 & 2 \\\\ 2 & 5\\end{pmatrix}$. ✓",
        },
        {
          type: "multiple-choice",
          question: "For which class of matrices is Cholesky decomposition defined?",
          options: [
            "All square matrices",
            "Symmetric positive definite matrices only",
            "Orthogonal matrices only",
            "Invertible matrices only",
          ],
          correctIndex: 1,
          hint: "The algorithm requires taking square roots of diagonal quantities.",
          explanation: "Cholesky needs all the diagonal 'corrected' entries to be positive so their square roots are real — equivalent to the matrix being **symmetric positive definite**. For general symmetric indefinite matrices, one uses $LDL^\\top$ instead.",
        },
        {
          type: "multiple-choice",
          question: "How does Cholesky enable efficient sampling from $\\mathcal{N}(\\boldsymbol\\mu, \\Sigma)$?",
          options: [
            "It computes $\\Sigma^{-1}$ in closed form.",
            "Given $A = LL^\\top$ and $\\mathbf{z} \\sim \\mathcal{N}(\\mathbf{0}, I)$, the sample $\\boldsymbol\\mu + L\\mathbf{z}$ has the desired covariance.",
            "It uses rejection sampling.",
            "It works only for univariate Gaussians.",
          ],
          correctIndex: 1,
          hint: "Compute the covariance of $L\\mathbf{z}$ directly.",
          explanation: "$\\text{Cov}(L\\mathbf{z}) = L\\text{Cov}(\\mathbf{z})L^\\top = LIL^\\top = LL^\\top = \\Sigma$. A single matrix-vector product transforms i.i.d. standard normals into correlated ones — the foundation of Gaussian process sampling and variational posteriors.",
        },
      ],
      keyTakeaways: [
        "Cholesky: $A = LL^\\top$ for symmetric positive definite $A$; $L$ is lower triangular.",
        "Solves systems in $O(n^3/3)$ — half the cost of LU — and tests positive definiteness as a side effect.",
        "Enables fast Gaussian sampling and log-determinant computation in Bayesian ML.",
      ],
      keyTakeawaysEs: [
        "Cholesky: $A = LL^\top$ para $A$ simétrica definida positiva; $L$ es triangular inferior.",
        "Resuelve sistemas en $O(n^3/3)$ — la mitad del coste de LU — y prueba definida positiva como efecto secundario.",
        "Permite muestreo gaussiano rápido y cálculo del logaritmo del determinante en ML bayesiano.",
      ],
    },

    // =========================================================================
    // LESSON 21 — Chapter 4.4: Eigendecomposition and Diagonalization
    // =========================================================================
    {
      title: "Eigendecomposition and Diagonalization",
      titleEs: "Descomposición Espectral y Diagonalización",
      chapter: "Matrix Decompositions",
      chapterEs: "Descomposiciones Matriciales",
      chapterNumber: 4,
      content: [
        "A square matrix $A$ is **diagonalizable** if it can be written as $A = PDP^{-1}$, where $D$ is diagonal and $P$ is invertible. The columns of $P$ are eigenvectors of $A$ and the diagonal entries of $D$ are the corresponding eigenvalues. This decomposition expresses the linear map in the *eigenbasis*, where it becomes pure per-axis scaling.",
        "Not every matrix is diagonalizable. A sufficient condition is having $n$ linearly independent eigenvectors, which is automatic when all eigenvalues are distinct. A matrix with repeated eigenvalues may or may not be diagonalizable, depending on whether each eigenvalue has enough eigenvectors (**geometric multiplicity** = **algebraic multiplicity**). When it fails, we fall back on Jordan normal form.",
        "Symmetric real matrices are always **orthogonally diagonalizable**: $A = QDQ^\\top$ with $Q$ orthogonal. This is the **spectral theorem** again — the nicest possible decomposition. For SPD matrices, all eigenvalues are positive, and we can define matrix functions like $A^{1/2} = QD^{1/2}Q^\\top$, $e^A = Q e^D Q^\\top$, or $\\log A = Q \\log(D) Q^\\top$, simply by applying the function entrywise to the diagonal.",
        "Why diagonalize? Because functions of $A$ become trivial: $A^k = PD^k P^{-1}$ reduces computing a matrix power to raising scalars. Solving linear ODEs $\\dot{\\mathbf{x}} = A\\mathbf{x}$ reduces to decoupled 1D equations. And iterative dynamics like $\\mathbf{x}_{k+1} = A\\mathbf{x}_k$ have a simple long-term behavior governed by the **dominant eigenvalue** — if $|\\lambda_1| < 1$ the system contracts to zero, if $|\\lambda_1| > 1$ it diverges.",
        "**Worked example — diagonalize a 2×2:** $A = \\begin{pmatrix}3 & 1\\\\1 & 3\\end{pmatrix}$ has eigenvalues $\\lambda_1 = 4, \\lambda_2 = 2$ with eigenvectors $\\mathbf{v}_1 = (1, 1), \\mathbf{v}_2 = (1, -1)$. Form $P = \\begin{pmatrix}1 & 1\\\\1 & -1\\end{pmatrix}$, $D = \\begin{pmatrix}4 & 0\\\\0 & 2\\end{pmatrix}$. $P^{-1} = \\tfrac{1}{-2}\\begin{pmatrix}-1 & -1\\\\-1 & 1\\end{pmatrix} = \\tfrac{1}{2}\\begin{pmatrix}1 & 1\\\\1 & -1\\end{pmatrix}$. Check $A = PDP^{-1}$ — a full spectral decomposition.",
        "**Worked example — matrix power via diagonalization:** Using the above, $A^{10} = PD^{10}P^{-1}$. Since $D^{10} = \\begin{pmatrix}4^{10} & 0\\\\0 & 2^{10}\\end{pmatrix} = \\begin{pmatrix}1048576 & 0\\\\0 & 1024\\end{pmatrix}$, computing $A^{10}$ is a single diagonal exponentiation plus two matrix products — far cheaper than multiplying $A$ ten times.",
        "In ML, eigendecomposition is the engine of **PCA** (decomposing the covariance matrix), **spectral clustering** (decomposing the graph Laplacian), and **Gaussian processes** (decomposing the kernel matrix). It also underpins **stability analysis** of learned dynamics (RNNs, diffusion models) — if eigenvalues of the learned Jacobian stray outside the unit circle, training and generation will misbehave in predictable ways.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Diagonalization: scaling in the eigenbasis",
          description: "$A = \\begin{pmatrix}3 & 1 \\\\ 1 & 3\\end{pmatrix}$ has eigenvalues 2 and 4. In the eigenbasis, it acts as pure scaling along two orthogonal axes.",
          config: {
            matrix: [
              [3, 1],
              [1, 3],
            ],
            animateFromIdentity: true,
          },
        },
        {
          type: "eigenspace-3d",
          title: "Symmetric matrix has orthogonal eigenvectors",
          description: "The spectral theorem: a symmetric 3×3 matrix has an orthonormal eigenbasis. Each colored axis scales by its eigenvalue.",
          config: {
            vectors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
            labels: ["λ₁", "λ₂", "λ₃"],
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which matrix is NOT diagonalizable over the reals?",
          options: [
            "$\\begin{pmatrix}2 & 0 \\\\ 0 & 3\\end{pmatrix}$",
            "$\\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$",
            "$\\begin{pmatrix}1 & 2 \\\\ 2 & 1\\end{pmatrix}$",
            "$\\begin{pmatrix}4 & 0 \\\\ 0 & 4\\end{pmatrix}$",
          ],
          correctIndex: 1,
          hint: "Check that it has enough independent eigenvectors.",
          explanation: "$\\begin{pmatrix}1 & 1 \\\\ 0 & 1\\end{pmatrix}$ has a repeated eigenvalue $\\lambda = 1$ but only **one** independent eigenvector $(1, 0)$. It is a defective shear matrix — diagonalization fails and Jordan form is required.",
        },
        {
          type: "numeric-input",
          question: "If $A$ has eigenvalues 2 and 3, what is $A^{10}$'s largest eigenvalue?",
          answer: 59049,
          tolerance: 1,
          hint: "$A^k$ has eigenvalues $\\lambda_i^k$.",
          explanation: "$3^{10} = 59049$. The eigenvalues of $A^k$ are exactly the $k$-th powers of the eigenvalues of $A$ — an immediate consequence of $A^k = PD^kP^{-1}$.",
        },
        {
          type: "multiple-choice",
          question: "For an SPD matrix $\\Sigma$, what does the spectral theorem guarantee about its eigenvectors?",
          options: [
            "They may be complex.",
            "They are orthogonal, and all eigenvalues are strictly positive.",
            "They are linearly dependent.",
            "There are fewer than $n$ of them.",
          ],
          correctIndex: 1,
          hint: "Symmetric + positive definite = best possible case.",
          explanation: "SPD matrices are both symmetric (so eigenvectors are orthogonal) and positive definite (so eigenvalues are strictly positive). This gives $\\Sigma = Q D Q^\\top$ with $Q$ orthogonal and $D$ positive diagonal — the ideal setup for PCA and GP computations.",
        },
      ],
      keyTakeaways: [
        "Diagonalization $A = PDP^{-1}$ expresses a map as scaling in the eigenbasis.",
        "Symmetric matrices diagonalize orthogonally: $A = QDQ^\\top$.",
        "Matrix powers, exponentials, and functions all simplify in the eigenbasis.",
      ],
      keyTakeawaysEs: [
        "La diagonalización $A = PDP^{-1}$ expresa un mapa como escalado en la base de autovectores.",
        "Las matrices simétricas se diagonalizan ortogonalmente: $A = QDQ^\top$.",
        "Potencias, exponenciales y funciones de matrices se simplifican en la base de autovectores.",
      ],
    },

    // =========================================================================
    // LESSON 22 — Chapter 4.5: Singular Value Decomposition
    // =========================================================================
    {
      title: "Singular Value Decomposition",
      titleEs: "Descomposición en Valores Singulares (SVD)",
      chapter: "Matrix Decompositions",
      chapterEs: "Descomposiciones Matriciales",
      chapterNumber: 4,
      content: [
        "The **singular value decomposition** (SVD) factors *any* matrix $A \\in \\mathbb{R}^{m\\times n}$ as $A = U\\Sigma V^\\top$, where $U \\in \\mathbb{R}^{m\\times m}$ and $V \\in \\mathbb{R}^{n\\times n}$ are orthogonal and $\\Sigma$ is a (rectangular) diagonal matrix with non-negative entries $\\sigma_1 \\geq \\sigma_2 \\geq \\dots \\geq 0$ called the **singular values**. Unlike eigendecomposition, SVD applies to rectangular and singular matrices — there is no 'diagonalizability' condition to worry about.",
        "Geometrically, every linear map factors as **rotate, scale, rotate**. $V^\\top$ rotates input space to align with the data's principal axes, $\\Sigma$ stretches each axis independently (possibly flattening some to zero), and $U$ rotates to output space. This decomposition is why SVD is so powerful: it reveals the intrinsic geometric action of any matrix.",
        "Singular values relate to eigenvalues: the $\\sigma_i$ are the square roots of the eigenvalues of $A^\\top A$ (or of $AA^\\top$). The columns of $V$ are the corresponding eigenvectors of $A^\\top A$ (right singular vectors); the columns of $U$ are the eigenvectors of $AA^\\top$ (left singular vectors). For symmetric matrices, SVD and eigendecomposition coincide up to sign.",
        "Many matrix diagnostics are read directly off the singular values. The **rank** of $A$ equals the number of non-zero singular values. The **condition number** $\\kappa(A) = \\sigma_1 / \\sigma_r$ measures numerical sensitivity — a large condition number means small input errors blow up. The **spectral norm** is $\\sigma_1$, and the **Frobenius norm** is $\\sqrt{\\sum \\sigma_i^2}$.",
        "**Worked example — SVD of a 2×2 matrix:** For $A = \\begin{pmatrix}3 & 0\\\\0 & 2\\end{pmatrix}$ (already diagonal, positive), the SVD is trivial: $U = I$, $\\Sigma = \\begin{pmatrix}3 & 0\\\\0 & 2\\end{pmatrix}$, $V = I$. Singular values $\\{3, 2\\}$; both $U, V$ are the identity. Any diagonal matrix with non-negative entries is its own SVD.",
        "**Worked example — singular values of a rectangular matrix:** For $A = \\begin{pmatrix}1 & 0 & 0\\\\0 & 2 & 0\\end{pmatrix}$ (2×3), compute $AA^\\top = \\begin{pmatrix}1 & 0\\\\0 & 4\\end{pmatrix}$. Eigenvalues are 1 and 4. So singular values are $\\sigma_1 = 2, \\sigma_2 = 1$. Rank = 2 (two non-zero singular values), matching that $A$ has full row rank.",
        "**Worked example — condition number:** For a matrix with singular values $\\{100, 10, 1, 0.01\\}$, the condition number is $\\sigma_{\\max}/\\sigma_{\\min} = 100/0.01 = 10{,}000$. A value this large signals **ill-conditioning**: small numerical errors in solving $A\\mathbf{x} = \\mathbf{b}$ can amplify by a factor of $10^4$.",
        "SVD is the universal ML tool. The Moore–Penrose **pseudo-inverse** is $A^+ = V\\Sigma^+ U^\\top$ — the best-effort inverse for rectangular/singular matrices, used in least-squares regression. **PCA** on a data matrix $X$ is literally the SVD of (centered) $X$. **Latent Semantic Analysis**, **recommender systems**, **model compression**, and **low-rank adaptation** all reduce to truncating the SVD to keep only the top singular values.",
      ],
      visualizations: [
        {
          type: "svd-3d",
          title: "SVD: rotate → scale → rotate",
          description: "Every matrix decomposes into three simple operations: a rotation, axis-aligned scaling, and another rotation.",
          config: {
            matrix: [
              [2, 1, 0],
              [1, 2, 0],
              [0, 0, 0.5],
            ],
          },
        },
        {
          type: "matrix-transform-2d",
          title: "SVD of a 2D matrix",
          description: "Here $A = U\\Sigma V^\\top$ maps a unit circle to an ellipse whose axes lengths are the singular values.",
          config: {
            matrix: [
              [2, 1],
              [1, 2],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which statement about SVD is TRUE?",
          options: [
            "SVD only exists for square matrices.",
            "SVD exists for any real matrix.",
            "SVD requires the matrix to be symmetric.",
            "The singular values can be negative.",
          ],
          correctIndex: 1,
          hint: "SVD is much more general than eigendecomposition.",
          explanation: "SVD exists for **every** real (or complex) matrix, regardless of shape or rank. Singular values are always non-negative by convention, and they are real even when the matrix is not symmetric.",
        },
        {
          type: "numeric-input",
          question: "$A$ is $5 \\times 3$ with singular values $\\{4, 2, 0\\}$. What is the rank of $A$?",
          answer: 2,
          tolerance: 0,
          hint: "Rank = number of non-zero singular values.",
          explanation: "The rank equals the number of strictly positive singular values: 2. Equivalently, $A$ maps $\\mathbb{R}^3$ onto a 2-dimensional subspace of $\\mathbb{R}^5$, collapsing one direction entirely.",
        },
        {
          type: "multiple-choice",
          question: "Why is SVD preferred over eigendecomposition for numerical linear algebra?",
          options: [
            "SVD is faster.",
            "SVD works for all matrices (rectangular, singular, non-symmetric), always uses orthogonal transforms, and is numerically stable.",
            "Eigendecomposition doesn't exist for real matrices.",
            "SVD is the only method that gives real numbers.",
          ],
          correctIndex: 1,
          hint: "Think about generality and numerical properties.",
          explanation: "SVD is universally applicable and uses only orthogonal matrices, which have condition number 1 and do not amplify floating-point error. Eigendecomposition requires diagonalizability, may use ill-conditioned $P$ matrices, and can yield complex numbers for non-symmetric real matrices.",
        },
      ],
      keyTakeaways: [
        "SVD factors any matrix as $A = U\\Sigma V^\\top$ — rotate, scale, rotate.",
        "Singular values reveal rank, condition number, and matrix norms.",
        "SVD powers PCA, pseudo-inverse, low-rank approximation, and recommender systems.",
      ],
      keyTakeawaysEs: [
        "La SVD factoriza cualquier matriz como $A = U\Sigma V^\top$ — rotar, escalar, rotar.",
        "Los valores singulares revelan el rango, el número de condición y las normas matriciales.",
        "La SVD impulsa PCA, pseudo-inversa, aproximación de bajo rango y sistemas de recomendación.",
      ],
    },

    // =========================================================================
    // LESSON 23 — Chapter 4.6: Matrix Approximation
    // =========================================================================
    {
      title: "Matrix Approximation",
      titleEs: "Aproximación de Matrices",
      chapter: "Matrix Decompositions",
      chapterEs: "Descomposiciones Matriciales",
      chapterNumber: 4,
      content: [
        "Given a matrix $A$ of rank $r$, the **best rank-$k$ approximation** (for $k < r$) is the matrix $A_k$ that minimizes $\\|A - A_k\\|$ among all rank-$k$ matrices. The answer is a celebrated result: the **Eckart–Young theorem** says $A_k = \\sum_{i=1}^k \\sigma_i \\mathbf{u}_i \\mathbf{v}_i^\\top$ — just keep the top $k$ singular values and corresponding singular vectors from the full SVD.",
        "This is optimal under both the **Frobenius** norm $\\|A - A_k\\|_F = \\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$ and the **spectral** norm $\\|A - A_k\\|_2 = \\sigma_{k+1}$. The approximation error is directly controlled by the discarded singular values — if they are small, you have compressed without losing much, and if they decay quickly, you can use small $k$ very effectively.",
        "This is the most useful theorem in data compression. An $m \\times n$ matrix requires $mn$ numbers; its rank-$k$ approximation requires only $k(m + n + 1)$ numbers (store $U_k$, $\\Sigma_k$, $V_k$). For images, recommendation matrices, or learned weight matrices, the singular values often decay exponentially, so $k \\ll \\min(m, n)$ gives nearly lossless compression.",
        "**Principal Component Analysis** is the application to data. Given a centered data matrix $X \\in \\mathbb{R}^{n\\times d}$, the rank-$k$ SVD approximation gives the best $k$-dimensional affine reconstruction. The principal components are the top-$k$ right singular vectors; projecting onto them yields the low-dimensional representation.",
        "**Worked example — rank-1 approximation:** Suppose $A$ has SVD with $\\sigma_1 = 5, \\mathbf{u}_1 = (1, 0), \\mathbf{v}_1 = (0, 1)$ and $\\sigma_2 = 2, \\mathbf{u}_2 = (0, 1), \\mathbf{v}_2 = (1, 0)$. The full matrix is $A = 5\\mathbf{u}_1\\mathbf{v}_1^\\top + 2\\mathbf{u}_2\\mathbf{v}_2^\\top = 5\\begin{pmatrix}0 & 1\\\\0 & 0\\end{pmatrix} + 2\\begin{pmatrix}0 & 0\\\\1 & 0\\end{pmatrix} = \\begin{pmatrix}0 & 5\\\\2 & 0\\end{pmatrix}$. Best rank-1 approximation: $A_1 = 5\\mathbf{u}_1\\mathbf{v}_1^\\top = \\begin{pmatrix}0 & 5\\\\0 & 0\\end{pmatrix}$. Error in Frobenius norm: $\\|A - A_1\\|_F = \\sigma_2 = 2$.",
        "**Worked example — compression savings:** An $1000 \\times 1000$ image matrix requires $10^6$ numbers. A rank-10 SVD approximation requires only $10(1000 + 1000 + 1) \\approx 20{,}000$ numbers — a **50× compression**. If the singular values decay quickly (as in most natural images), the visual quality loss is minimal.",
        "**Worked example — LoRA parameter count:** A transformer attention layer with $d = 4096$ has a $4096 \\times 4096$ weight matrix: $\\approx 16.7$M parameters. A LoRA update $UV^\\top$ with rank $r = 8$: $U \\in \\mathbb{R}^{4096 \\times 8}, V \\in \\mathbb{R}^{8 \\times 4096}$, totaling $2 \\cdot 4096 \\cdot 8 \\approx 65{,}000$ parameters — **250× fewer trainable weights**, which is why LoRA makes fine-tuning cheap.",
        "In modern deep learning, **Low-Rank Adaptation (LoRA)** freezes a large pretrained weight matrix $W$ and learns a low-rank update $W + UV^\\top$ with $U, V$ skinny. This is the same rank-$k$ parameterization, used as a *cheap fine-tuning* strategy: millions of parameters become thousands, with minimal loss in quality. Matrix approximation is the quiet backbone of efficient AI.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Rank-1 approximation of a 2x2 matrix",
          description: "Keeping only the largest singular value collapses the action to a single direction — an outer product $\\sigma_1 \\mathbf{u}_1 \\mathbf{v}_1^\\top$.",
          config: {
            matrix: [
              [3, 0],
              [0, 0.1],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "A matrix has singular values $\\{10, 5, 2, 0.1\\}$. What is the Frobenius error of the best rank-2 approximation?",
          answer: 2.002,
          tolerance: 0.01,
          hint: "$\\|A - A_k\\|_F = \\sqrt{\\sum_{i>k} \\sigma_i^2}$.",
          explanation: "We discard $\\sigma_3 = 2$ and $\\sigma_4 = 0.1$. The Frobenius error is $\\sqrt{2^2 + 0.1^2} = \\sqrt{4.01} \\approx 2.002$. This quantifies how much information is lost when compressing to rank 2.",
        },
        {
          type: "multiple-choice",
          question: "The singular values of a $1000 \\times 1000$ weight matrix are $\\{5, 4.9, 4.8, \\dots\\}$ with no big gap. What does this mean for low-rank compression?",
          options: [
            "The matrix is essentially rank 1 — cut hard.",
            "There is no natural truncation point; aggressive compression will lose meaningful information.",
            "The matrix is orthogonal.",
            "Compression is free — keep only the top singular value.",
          ],
          correctIndex: 1,
          hint: "Look for a spectral gap.",
          explanation: "A flat spectrum means every direction carries roughly equal information. Unlike a fast-decaying spectrum, there is no small $k$ that captures most of the matrix — LoRA or truncation will sacrifice real representational capacity. Good compression relies on **spectral gaps**.",
        },
        {
          type: "multiple-choice",
          question: "Why does LoRA parameterize weight updates as $UV^\\top$ with $U \\in \\mathbb{R}^{d\\times r}$ and $V \\in \\mathbb{R}^{d\\times r}$?",
          options: [
            "For aesthetic symmetry.",
            "To force the update to be low rank, drastically reducing trainable parameters while still expressing rich adaptations.",
            "Because full matrices are illegal in transformers.",
            "To ensure orthogonality.",
          ],
          correctIndex: 1,
          hint: "Count the parameters: $2dr$ vs. $d^2$.",
          explanation: "A full $d\\times d$ update has $d^2$ parameters; $UV^\\top$ has only $2dr$. For $d = 4096$, $r = 8$: full = 16M params, LoRA = 65K. The low-rank factorization is expressive enough for fine-tuning because task-specific updates empirically live in a low-rank subspace.",
        },
      ],
      keyTakeaways: [
        "The best rank-$k$ approximation is given by the top-$k$ SVD terms (Eckart–Young).",
        "Approximation error equals the discarded singular values' norm.",
        "Low-rank approximation powers compression, PCA, and parameter-efficient fine-tuning (LoRA).",
      ],
      keyTakeawaysEs: [
        "La mejor aproximación de rango $k$ la dan los $k$ primeros términos de la SVD (Eckart–Young).",
        "El error de aproximación es igual a la norma de los valores singulares descartados.",
        "La aproximación de bajo rango impulsa compresión, PCA y fine-tuning eficiente en parámetros (LoRA).",
      ],
    },

    // =========================================================================
    // LESSON 24 — Chapter 4.7: Matrix Phylogeny
    // =========================================================================
    {
      title: "Matrix Phylogeny",
      titleEs: "Filogenia de Matrices",
      chapter: "Matrix Decompositions",
      chapterEs: "Descomposiciones Matriciales",
      chapterNumber: 4,
      content: [
        "Let's step back and organize the decompositions you have met into a **phylogeny** — a family tree of matrix factorizations, each specialized for different matrix classes. The most general factorizations apply to the broadest set of matrices; the most specialized exploit extra structure for speed or insight.",
        "At the top sit **LU** ($A = LU$, requires $A$ invertible after permutations) and **QR** ($A = QR$, exists for any rectangular $A$). These are the workhorses for solving linear systems and least-squares problems. LU is cheap but numerically delicate; QR uses orthogonal matrices and is more stable, especially for tall-skinny matrices.",
        "Moving to square matrices, **eigendecomposition** ($A = PDP^{-1}$) exists for diagonalizable matrices. For the subset of **symmetric** matrices, it specializes to $A = QDQ^\\top$ with orthogonal $Q$ (spectral theorem). For the even narrower subset of **symmetric positive definite** matrices, we get **Cholesky** ($A = LL^\\top$) as a fast square-root factorization.",
        "Above everything in generality sits **SVD** ($A = U\\Sigma V^\\top$), which works for every rectangular matrix, every rank, every condition number. It is slower than specialized decompositions but universal. Inside, every other decomposition can be connected to it: QR is an intermediate step, eigendecomposition is SVD when $A$ is symmetric, and Cholesky is a specialized $LDL^\\top$ for positive-definite matrices.",
        "**Worked example — decision flowchart:** You need to solve $A\\mathbf{x} = \\mathbf{b}$ for a $5000 \\times 5000$ matrix $A$. Is $A$ SPD (e.g., $X^\\top X$ in regression)? → **Cholesky** ($\\approx 5000^3/3$ flops). Otherwise is $A$ square and well-conditioned? → **LU** with partial pivoting ($\\approx 2\\cdot 5000^3/3$ flops). Otherwise for least squares or rank-deficient $A$? → **QR** or **SVD**. Matching the decomposition to the problem structure can cut compute by a factor of 2–10.",
        "**Worked example — SVD vs. eigendecomposition cost:** For a $n \\times n$ symmetric matrix, eigendecomposition costs $O(n^3)$; SVD on the same matrix also costs $O(n^3)$ but with a larger constant (~2-3×). Rule of thumb: use **eigendecomposition** when you know the matrix is symmetric (PCA covariance, graph Laplacian); use **SVD** for rectangular data matrices or when you don't trust the symmetry. For a $10^5 \\times 10^5$ matrix, this constant factor is hours of compute.",
        "**ML connection — normalizing flows use log|det J|:** Normalizing flows require efficient Jacobian determinants. Designs often constrain the Jacobian to be triangular (so $\\det J$ = product of diagonal) or to be a composition of rotations + diagonal scales (Cholesky-like). Picking the right decomposition structure for your layer is a modeling choice that directly controls training speed.",
        "When you are solving an ML problem, pick the most specific decomposition that still applies. For normal equations $X^\\top X \\mathbf{w} = X^\\top \\mathbf{y}$, use **Cholesky** — it's twice as fast as LU. For least squares on ill-conditioned data, use **QR** on $X$ directly, avoiding the conditioning squaring from $X^\\top X$. For PCA, use **SVD** on $X$ directly for best numerics. For general spectral problems, use **eigendecomposition** of the relevant symmetric operator. Knowing the phylogeny is knowing when to use which tool.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Same map, multiple factorizations",
          description: "Every matrix admits several decompositions: LU, QR, SVD. They reveal different structural features — triangular, orthogonal, singular-value.",
          config: {
            matrix: [
              [2, 1],
              [1, 3],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "drag-to-match",
          question: "Match each decomposition to the most specific matrix class it targets.",
          leftItems: [
            "Cholesky ($LL^\\top$)",
            "Eigendecomposition ($PDP^{-1}$)",
            "SVD ($U\\Sigma V^\\top$)",
            "QR ($QR$)",
          ],
          rightItems: [
            "Symmetric positive definite",
            "Diagonalizable (square)",
            "Any real matrix",
            "Any rectangular $m \\geq n$",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
          hint: "Most specific condition wins.",
          explanation: "Cholesky needs the strongest assumption (SPD), QR the weakest (any rectangular), and SVD is genuinely universal. Eigendecomposition sits in between, needing only diagonalizability. Pick the most specific applicable decomposition for speed and numerical quality.",
        },
        {
          type: "multiple-choice",
          question: "You need to solve $X^\\top X \\mathbf{w} = X^\\top \\mathbf{y}$ with $X$ well-conditioned and $X^\\top X$ SPD. Which factorization is most efficient?",
          options: ["LU", "QR", "Cholesky", "SVD"],
          correctIndex: 2,
          hint: "Exploit symmetry and positive definiteness.",
          explanation: "Since $X^\\top X$ is SPD, **Cholesky** solves the system in $O(n^3/3)$ — half the cost of LU. For mildly ill-conditioned problems you should skip $X^\\top X$ entirely and use QR on $X$, but for well-conditioned cases Cholesky is the fastest.",
        },
        {
          type: "multiple-choice",
          question: "Which decomposition is the 'safest default' when matrix structure is unknown or the matrix is ill-conditioned?",
          options: ["LU without pivoting", "Cholesky", "SVD", "A single Gaussian elimination step"],
          correctIndex: 2,
          hint: "Which works on any matrix and is numerically robust?",
          explanation: "**SVD** always exists, uses orthogonal transformations (condition number 1), and reveals rank and conditioning directly. It is the slowest classical choice but the most robust — the 'hammer' when you don't know what kind of nail you have.",
        },
      ],
      keyTakeaways: [
        "Decompositions form a hierarchy: SVD (most general) → QR → eigendecomposition → Cholesky (most specialized).",
        "Pick the most specific decomposition your matrix structure allows — it's faster and more stable.",
        "SVD is the universal fallback when structure is unknown or conditioning is poor.",
      ],
      keyTakeawaysEs: [
        "Las descomposiciones forman una jerarquía: SVD (la más general) → QR → descomposición espectral → Cholesky (la más especializada).",
        "Elige la descomposición más específica que permita la estructura de tu matriz — es más rápida y estable.",
        "La SVD es el recurso universal cuando la estructura es desconocida o el condicionamiento es pobre.",
      ],
    },

    // =========================================================================
    // LESSON 25 — Chapter 5.1: Differentiation of Univariate Functions
    // =========================================================================
    {
      title: "Differentiation of Univariate Functions",
      titleEs: "Derivación de Funciones Univariadas",
      chapter: "Vector Calculus",
      chapterEs: "Cálculo Vectorial",
      chapterNumber: 5,
      content: [
        "The **derivative** $f'(x)$ of a function $f : \\mathbb{R} \\to \\mathbb{R}$ measures its instantaneous rate of change at $x$. Formally, $f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$. Geometrically, it is the slope of the **tangent line** to the graph of $f$ at the point $(x, f(x))$.",
        "A function is **differentiable** at $x$ if this limit exists. Differentiability implies continuity, but not conversely — the absolute value $|x|$ is continuous everywhere but not differentiable at $0$, where the graph has a sharp corner. More broadly, functions with kinks, cusps, or vertical tangents fail to be differentiable at those points.",
        "A few derivative rules do most of the work: $\\frac{d}{dx}x^n = nx^{n-1}$ (power rule), $\\frac{d}{dx} e^x = e^x$, $\\frac{d}{dx} \\ln x = 1/x$, $\\frac{d}{dx} \\sin x = \\cos x$, $\\frac{d}{dx} \\cos x = -\\sin x$. Combined with **linearity** $(af + bg)' = af' + bg'$, the **product rule** $(fg)' = f'g + fg'$, and the **chain rule** $(f \\circ g)'(x) = f'(g(x))\\cdot g'(x)$, you can differentiate almost any elementary function.",
        "Derivatives are how we find **extrema**: at a local minimum or maximum of a smooth function, $f'(x) = 0$. The **second derivative** $f''(x)$ tells us the concavity — positive means a local min (curving up), negative means a local max (curving down). This is the foundation of optimization.",
        "In ML, univariate differentiation is everywhere: computing the derivative of a loss with respect to one scalar parameter, tuning a learning rate by analyzing how a scalar-valued update behaves, understanding activation functions like $\\sigma(x)$ or ReLU via their (sub)derivatives. Before we can take gradients of complex neural networks, we need rock-solid comfort with 1D derivatives as the atomic building block.",
        "**Worked example — derivative of $f(x)=x^3$ from the limit definition:** $f'(x) = \\lim_{h\\to 0}\\frac{(x+h)^3 - x^3}{h} = \\lim_{h\\to 0}\\frac{3x^2 h + 3x h^2 + h^3}{h} = \\lim_{h\\to 0}(3x^2 + 3xh + h^2) = 3x^2$. At $x = 2$ the slope is $f'(2) = 3\\cdot 4 = 12$, matching the power rule. This is the prototypical calculation that justifies the shortcut rules we use daily.",
        "**Worked example — product rule on $x\\sin(x)$:** With $f(x) = x$ and $g(x) = \\sin(x)$ we have $f' = 1$ and $g' = \\cos(x)$, so $(fg)' = f'g + fg' = \\sin(x) + x\\cos(x)$. Evaluated at $x = 0$ this gives $\\sin(0) + 0\\cdot\\cos(0) = 0$, confirming the graph passes through the origin with slope zero. This pattern shows up whenever a learned weight multiplies a nonlinear activation.",
        "**ML connection — derivative of the sigmoid at zero:** Since $\\sigma(x) = 1/(1+e^{-x})$ and $\\sigma'(x) = \\sigma(x)(1-\\sigma(x))$, at $x=0$ we get $\\sigma(0) = 0.5$ and $\\sigma'(0) = 0.5\\cdot 0.5 = 0.25$. Far from zero, say at $x = 5$, $\\sigma(5) \\approx 0.993$ so $\\sigma'(5) \\approx 0.007$ — this tiny slope is exactly the vanishing-gradient pain that motivated ReLU.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "$f(x) = x^2$ and its tangent",
          description: "At $x = 1$, the tangent line has slope $f'(1) = 2$. At $x = 0$, the slope is $0$ (the minimum).",
          config: {
            fn: "x^2",
            domain: [-3, 3],
            showTangent: true,
          },
        },
        {
          type: "function-plot",
          title: "Sigmoid and its derivative",
          description: "$\\sigma(x) = 1/(1+e^{-x})$. Its derivative $\\sigma'(x) = \\sigma(x)(1 - \\sigma(x))$ is maximal at $x = 0$ and shrinks at the tails — the source of the **vanishing gradient** problem.",
          config: {
            fn: "sigmoid",
            domain: [-6, 6],
            showTangent: true,
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "If $f(x) = 3x^2 + 2x - 5$, what is $f'(2)$?",
          answer: 14,
          tolerance: 0.01,
          hint: "Differentiate term by term, then plug in $x = 2$.",
          explanation: "$f'(x) = 6x + 2$. So $f'(2) = 12 + 2 = 14$. The tangent line at $x = 2$ has slope 14.",
        },
        {
          type: "numeric-input",
          question: "At the minimum of $f(x) = x^2 - 4x + 7$, what is $x$?",
          answer: 2,
          tolerance: 0.01,
          hint: "Set $f'(x) = 0$.",
          explanation: "$f'(x) = 2x - 4 = 0$ gives $x = 2$. Since $f''(x) = 2 > 0$, this is indeed a minimum. The minimum value is $f(2) = 4 - 8 + 7 = 3$.",
        },
        {
          type: "multiple-choice",
          question: "Why is the derivative of ReLU at $x = 0$ technically undefined?",
          options: [
            "Because ReLU is discontinuous at 0.",
            "Because the left and right derivatives (0 and 1) disagree — the function has a corner.",
            "Because ReLU is not a real function.",
            "By convention only; it really equals 1.",
          ],
          correctIndex: 1,
          hint: "Look at the one-sided limits.",
          explanation: "Just to the left of 0, ReLU is zero (slope 0); just to the right, it's $x$ (slope 1). The two-sided limit disagrees, so the derivative doesn't exist there — mathematically a **subgradient** or simply a convention (most frameworks pick 0 or 1).",
        },
      ],
      keyTakeaways: [
        "$f'(x)$ is the slope of the tangent line; the limit of difference quotients.",
        "Linearity, product rule, and chain rule handle almost all elementary functions.",
        "Derivatives identify extrema ($f'=0$) and diagnose concavity via $f''$.",
      ],
      keyTakeawaysEs: [
        "$f'(x)$ es la pendiente de la recta tangente; el límite de los cocientes incrementales.",
        "Linealidad, regla del producto y regla de la cadena resuelven casi todas las funciones elementales.",
        "Las derivadas identifican extremos ($f'=0$) y diagnostican concavidad vía $f''$.",
      ],
    },

    // =========================================================================
    // LESSON 26 — Chapter 5.2: Partial Derivatives and Gradients
    // =========================================================================
    {
      title: "Partial Derivatives and Gradients",
      titleEs: "Derivadas Parciales y Gradientes",
      chapter: "Vector Calculus",
      chapterEs: "Cálculo Vectorial",
      chapterNumber: 5,
      content: [
        "For a function $f : \\mathbb{R}^n \\to \\mathbb{R}$ of several variables, the **partial derivative** $\\frac{\\partial f}{\\partial x_i}$ is the rate of change of $f$ as $x_i$ varies while all other variables are held fixed. Computationally, you differentiate $f$ treating every variable but $x_i$ as a constant.",
        "The **gradient** $\\nabla f(\\mathbf{x})$ packages all the partial derivatives into a single vector: $\\nabla f = \\left(\\frac{\\partial f}{\\partial x_1}, \\dots, \\frac{\\partial f}{\\partial x_n}\\right)^\\top$. The gradient has a beautiful geometric interpretation: it **points in the direction of steepest ascent**, and its magnitude is the rate of increase in that direction. The negative gradient points toward steepest descent — which is why gradient descent works.",
        "The **directional derivative** in direction $\\mathbf{u}$ (a unit vector) is $D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}$ — the projection of the gradient onto $\\mathbf{u}$. This lets us read off two facts: the gradient direction gives the maximum rate of increase ($\\|\\nabla f\\|$), and any direction perpendicular to the gradient gives zero instantaneous change (you are moving along a level set).",
        "At a smooth interior extremum, the gradient vanishes: $\\nabla f(\\mathbf{x}^*) = \\mathbf{0}$. Such points are called **critical points** or **stationary points** and come in three flavors: local minima, local maxima, and **saddle points** (minimum in some directions, maximum in others). In high-dimensional deep learning landscapes, saddle points are overwhelmingly more common than local minima, a fact that reshapes how we think about optimization.",
        "In ML, **every training step is gradient-based**: compute $\\nabla_{\\mathbf{w}} L(\\mathbf{w})$, step in its negative direction. Variants of this idea — SGD, Adam, RMSprop — differ only in how they denoise or adaptively rescale the gradient. A working intuition for gradients is arguably the single most important mathematical skill for a practicing ML engineer.",
        "**Worked example — gradient of $f(x,y)=x^2 + 3xy + y^2$ at $(1,1)$:** The partials are $\\partial_x f = 2x + 3y$ and $\\partial_y f = 3x + 2y$, so $\\nabla f(1,1) = (2+3, 3+2) = (5, 5)$. The steepest ascent direction is along the 45-degree line with slope magnitude $\\|\\nabla f\\| = 5\\sqrt{2} \\approx 7.07$. A gradient-descent step from $(1,1)$ with $\\eta = 0.1$ lands at $(1,1) - 0.1(5,5) = (0.5, 0.5)$.",
        "**Worked example — directional derivative in direction $(1,0)$:** Using the same $\\nabla f(1,1) = (5,5)$, the directional derivative along the unit vector $\\mathbf{u} = (1,0)$ is $D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u} = 5\\cdot 1 + 5\\cdot 0 = 5$. Along the perpendicular direction $\\mathbf{v} = (1,-1)/\\sqrt{2}$ we get $(5 - 5)/\\sqrt{2} = 0$ — confirming that level sets are perpendicular to the gradient.",
      ],
      visualizations: [
        {
          type: "gradient-field",
          title: "Gradient of a bowl",
          description: "For $f(x, y) = x^2 + y^2$, $\\nabla f = (2x, 2y)$ — arrows point outward from the origin. Gradient descent flows **inward** toward the minimum.",
          config: {
            surface: "bowl",
            showTrajectory: true,
          },
        },
        {
          type: "gradient-field",
          title: "Saddle point",
          description: "$f(x, y) = x^2 - y^2$ has a saddle at the origin. Following $-\\nabla f$ can escape along the unstable direction ($y$).",
          config: {
            surface: "saddle",
            showTrajectory: true,
          },
        },
      ],
      exercises: [
        {
          type: "vector-input",
          question: "For $f(x, y) = x^2 + 3y^2$, compute $\\nabla f(1, 2)$. Enter as $(\\partial_x f, \\partial_y f)$.",
          dimensions: 2,
          answer: [2, 12],
          tolerance: 0.01,
          showPreview: true,
          hint: "$\\partial_x f = 2x$, $\\partial_y f = 6y$.",
          explanation: "$\\nabla f(x, y) = (2x, 6y)$. At $(1, 2)$: $\\nabla f = (2, 12)$. The gradient points 'mostly $y$' because the $3y^2$ term grows faster.",
        },
        {
          type: "multiple-choice",
          question: "At a point where $\\nabla f = \\mathbf{0}$, the function has:",
          options: [
            "A local minimum",
            "A local maximum",
            "A critical point — could be min, max, or saddle",
            "A point of discontinuity",
          ],
          correctIndex: 2,
          hint: "Vanishing gradient is necessary but not sufficient.",
          explanation: "A zero gradient identifies a **critical point**, but doesn't reveal its nature. To distinguish min/max/saddle, examine the **Hessian** (second-derivative matrix) — positive definite = min, negative definite = max, indefinite = saddle.",
        },
        {
          type: "multiple-choice",
          question: "In which direction does $f$ increase fastest at a point $\\mathbf{x}$?",
          options: [
            "The negative gradient direction",
            "The gradient direction $\\nabla f(\\mathbf{x})$",
            "Any direction perpendicular to the gradient",
            "Along the $x$-axis always",
          ],
          correctIndex: 1,
          hint: "Use the directional derivative $D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}$ and Cauchy–Schwarz.",
          explanation: "$D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u} = \\|\\nabla f\\| \\cos\\theta$ is maximized when $\\mathbf{u}$ aligns with $\\nabla f$. Gradient descent steps in the *opposite* direction to minimize $f$ as quickly as possible.",
        },
      ],
      keyTakeaways: [
        "Partial derivatives measure rate of change along a single coordinate axis.",
        "The gradient packages them into a vector pointing in the direction of steepest ascent.",
        "Critical points where $\\nabla f = \\mathbf{0}$ include minima, maxima, and (often) saddles.",
      ],
      keyTakeawaysEs: [
        "Las derivadas parciales miden la tasa de cambio a lo largo de un único eje coordenado.",
        "El gradiente las empaqueta en un vector que apunta en la dirección de máximo ascenso.",
        "Los puntos críticos donde $\nabla f = \mathbf{0}$ incluyen mínimos, máximos y (con frecuencia) puntos de silla.",
      ],
    },

    // =========================================================================
    // LESSON 27 — Chapter 5.3: Gradients of Vector-Valued Functions
    // =========================================================================
    {
      title: "Gradients of Vector-Valued Functions",
      titleEs: "Gradientes de Funciones Vectoriales",
      chapter: "Vector Calculus",
      chapterEs: "Cálculo Vectorial",
      chapterNumber: 5,
      content: [
        "When $f : \\mathbb{R}^n \\to \\mathbb{R}^m$ maps vectors to vectors, the analog of the gradient is a matrix called the **Jacobian**, $J_f = \\frac{\\partial f}{\\partial \\mathbf{x}} \\in \\mathbb{R}^{m \\times n}$. Its $(i,j)$ entry is $\\frac{\\partial f_i}{\\partial x_j}$ — the sensitivity of the $i$-th output component to the $j$-th input. Row $i$ is the gradient of $f_i$ transposed.",
        "The Jacobian is the **best linear approximation** of $f$ near a point: $f(\\mathbf{x} + \\Delta \\mathbf{x}) \\approx f(\\mathbf{x}) + J_f(\\mathbf{x}) \\Delta \\mathbf{x}$. This extends the 1D idea $f(x + h) \\approx f(x) + f'(x) h$ to arbitrary input/output dimensions. It's why we call $f$ 'locally linear' and why gradient-based methods work — the nonlinear function behaves like a matrix at each point.",
        "The **chain rule** generalizes elegantly to Jacobians. If $\\mathbf{z} = f(\\mathbf{y})$ and $\\mathbf{y} = g(\\mathbf{x})$, then $\\frac{\\partial \\mathbf{z}}{\\partial \\mathbf{x}} = \\frac{\\partial \\mathbf{z}}{\\partial \\mathbf{y}} \\cdot \\frac{\\partial \\mathbf{y}}{\\partial \\mathbf{x}} = J_f \\cdot J_g$ — just multiply Jacobians in order. This is the mathematical backbone of **backpropagation**: each layer contributes one Jacobian factor, and the chain rule stitches them together.",
        "For **linear functions** $f(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{b}$, the Jacobian is simply $A$ — the linear approximation is exact. For **element-wise nonlinearities** like $\\sigma$ applied to a vector, the Jacobian is $\\text{diag}(\\sigma'(\\mathbf{x}_1), \\dots, \\sigma'(\\mathbf{x}_n))$. These two cases, combined via chain rule, give you the Jacobian of any feedforward network.",
        "In ML, the Jacobian drives **backpropagation** (chaining layer-by-layer Jacobians), **adversarial attacks** (linearizing a classifier via its input Jacobian), **neural ODE solvers** (integrating flow Jacobians for invertibility), and **normalizing flows** (tracking $\\log|\\det J|$ for density estimation). Working comfortably with Jacobians is the bridge from scalar calculus to the matrix calculus that dominates modern deep learning.",
        "**Worked example — Jacobian of $f(x,y) = (xy,\\; x+y,\\; x^2)$:** The map goes $\\mathbb{R}^2 \\to \\mathbb{R}^3$, so $J_f$ is $3\\times 2$. Taking partials row by row: $J_f(x,y) = \\begin{pmatrix}y & x \\\\ 1 & 1 \\\\ 2x & 0\\end{pmatrix}$. At $(x,y) = (1,2)$ this is $\\begin{pmatrix}2 & 1 \\\\ 1 & 1 \\\\ 2 & 0\\end{pmatrix}$ — the dimensions check out ($m=3$ rows of outputs, $n=2$ columns of inputs).",
        "**Worked example — local linearization near $(1,2)$:** Using the Jacobian above with $\\Delta \\mathbf{x} = (0.01, -0.02)$, the predicted change in output is $J_f \\Delta \\mathbf{x} = (2\\cdot 0.01 + 1\\cdot(-0.02),\\; 0.01 - 0.02,\\; 2\\cdot 0.01 + 0) = (0, -0.01, 0.02)$. The true change is within $10^{-4}$ of this — excellent linear approximation, exactly the regime autograd exploits.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "Jacobian as local linearization",
          description: "Near $\\mathbf{x}_0$, the nonlinear map $f$ looks like multiplication by $J_f(\\mathbf{x}_0)$ — a matrix that morphs a small neighborhood.",
          config: {
            matrix: [
              [1.5, 0.5],
              [0.3, 1.2],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "matrix-input",
          question: "The Jacobian of the linear map $f(\\mathbf{x}) = A\\mathbf{x}$ with $A = \\begin{pmatrix}2 & 0 \\\\ 1 & 3\\end{pmatrix}$ at any point is:",
          rows: 2,
          cols: 2,
          answer: [
            [2, 0],
            [1, 3],
          ],
          tolerance: 0.01,
          hint: "For linear maps, $J_f = A$ everywhere.",
          explanation: "The Jacobian of a linear map is the matrix itself, independent of the point. This is the best linear approximation — which is exact for linear maps.",
        },
        {
          type: "multiple-choice",
          question: "For $f : \\mathbb{R}^3 \\to \\mathbb{R}^5$, the Jacobian has shape:",
          options: ["$3 \\times 5$", "$5 \\times 3$", "$3 \\times 3$", "$5 \\times 5$"],
          correctIndex: 1,
          hint: "Rows = output dim, columns = input dim.",
          explanation: "By convention $J_f \\in \\mathbb{R}^{m \\times n}$ where $m = 5$ outputs and $n = 3$ inputs. Each row is a gradient of one output coordinate; each column tracks how outputs change as one input varies.",
        },
        {
          type: "multiple-choice",
          question: "Why is backpropagation essentially a chain-rule computation of Jacobians?",
          options: [
            "By coincidence.",
            "A neural network is a composition of layers; by chain rule, the full Jacobian is the product of per-layer Jacobians, computed right-to-left from output loss.",
            "Because backpropagation uses SVD.",
            "Because gradients must be approximated numerically.",
          ],
          correctIndex: 1,
          hint: "Each layer is a function; composing functions composes Jacobians.",
          explanation: "The network $y = f_L \\circ \\dots \\circ f_1 (x)$ has total Jacobian $J = J_{f_L} \\cdots J_{f_1}$. Backprop avoids forming these giant Jacobians directly by using **vector-Jacobian products** — multiplying the incoming gradient by each layer's Jacobian in reverse order, the essence of reverse-mode automatic differentiation.",
        },
      ],
      keyTakeaways: [
        "The Jacobian $J_f \\in \\mathbb{R}^{m\\times n}$ collects all partial derivatives of a vector-valued map.",
        "It is the best local linear approximation: $f(\\mathbf{x}+\\Delta) \\approx f(\\mathbf{x}) + J_f \\Delta$.",
        "Chain rule: Jacobians of compositions multiply — the basis of backpropagation.",
      ],
      keyTakeawaysEs: [
        "El jacobiano $J_f \in \mathbb{R}^{m\times n}$ reúne todas las derivadas parciales de una aplicación vectorial.",
        "Es la mejor aproximación lineal local: $f(\mathbf{x}+\Delta) \approx f(\mathbf{x}) + J_f \Delta$.",
        "Regla de la cadena: los jacobianos de composiciones se multiplican — la base de la retropropagación.",
      ],
    },

    // =========================================================================
    // LESSON 28 — Chapter 5.4: Gradients of Matrices
    // =========================================================================
    {
      title: "Gradients of Matrices",
      titleEs: "Gradientes de Matrices",
      chapter: "Vector Calculus",
      chapterEs: "Cálculo Vectorial",
      chapterNumber: 5,
      content: [
        "In ML, loss functions often depend on whole **matrices** of parameters (think weight matrices in a neural net layer). The gradient with respect to a matrix is just another matrix: $\\frac{\\partial L}{\\partial W} \\in \\mathbb{R}^{m \\times n}$ has the same shape as $W$, with entry $(i,j)$ giving $\\frac{\\partial L}{\\partial w_{ij}}$.",
        "Matrix calculus identities streamline derivations. The most-used ones: $\\nabla_{\\mathbf{x}}(\\mathbf{a}^\\top \\mathbf{x}) = \\mathbf{a}$, $\\nabla_{\\mathbf{x}}(\\mathbf{x}^\\top A \\mathbf{x}) = (A + A^\\top)\\mathbf{x}$ (and $= 2A\\mathbf{x}$ when $A$ is symmetric), $\\nabla_W(\\|X - WY\\|_F^2) = -2(X - WY)Y^\\top$, and $\\nabla_W(\\text{tr}(W^\\top A)) = A$. These let us differentiate common ML losses quickly without expanding index-by-index.",
        "Using these identities, we can rederive the **normal equations**. For $L(\\mathbf{w}) = \\|\\mathbf{y} - X\\mathbf{w}\\|^2$, expanding gives $L = \\mathbf{y}^\\top \\mathbf{y} - 2\\mathbf{w}^\\top X^\\top \\mathbf{y} + \\mathbf{w}^\\top X^\\top X \\mathbf{w}$. Applying the identities: $\\nabla_{\\mathbf{w}} L = -2X^\\top \\mathbf{y} + 2X^\\top X \\mathbf{w}$. Setting this to zero yields $X^\\top X \\mathbf{w} = X^\\top \\mathbf{y}$ — the normal equations, arrived at without a single index calculation.",
        "The **denominator layout** (also called 'gradient layout') matches the shape of $W$ — the convention most ML texts and auto-diff libraries use. An alternative **numerator layout** transposes. Be consistent, pick one, and note PyTorch/JAX use denominator layout by default (the gradient of a loss has the same shape as the parameter).",
        "Neural network training is one long matrix gradient computation. A single fully connected layer $\\mathbf{h} = \\sigma(W\\mathbf{x} + \\mathbf{b})$ has $\\nabla_W L = \\delta \\mathbf{x}^\\top$ where $\\delta$ is the upstream gradient after passing through $\\sigma'$. This **outer-product** structure is general: the gradient of a matrix that appears in a linear-plus-nonlinear layer is always an outer product of the downstream error and the upstream activation. This is the atom of deep-learning gradient math.",
        "**Worked example — verify $\\nabla_{\\mathbf{x}}(\\mathbf{x}^\\top A\\mathbf{x}) = (A + A^\\top)\\mathbf{x}$:** Take $A = \\begin{pmatrix}1 & 2 \\\\ 0 & 3\\end{pmatrix}$ and $\\mathbf{x} = (1, 1)^\\top$. Expand $\\mathbf{x}^\\top A \\mathbf{x} = x_1^2 + 2x_1 x_2 + 3x_2^2$, giving gradient $(2x_1 + 2x_2,\\; 2x_1 + 6x_2) = (4, 8)$ at $\\mathbf{x}=(1,1)$. Alternatively, $A + A^\\top = \\begin{pmatrix}2 & 2 \\\\ 2 & 6\\end{pmatrix}$, so $(A+A^\\top)\\mathbf{x} = (4,8)$ — the identity checks out.",
        "**Worked example — outer-product gradient for a linear layer:** Let $W = \\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}$, input $\\mathbf{x} = (2, 1)^\\top$, and suppose the upstream error is $\\delta = (0.5, -0.5)^\\top$. Then $\\nabla_W L = \\delta \\mathbf{x}^\\top = \\begin{pmatrix}0.5 \\\\ -0.5\\end{pmatrix}\\begin{pmatrix}2 & 1\\end{pmatrix} = \\begin{pmatrix}1 & 0.5 \\\\ -1 & -0.5\\end{pmatrix}$. A gradient step $W \\leftarrow W - 0.1\\nabla_W L$ gives $\\begin{pmatrix}0.9 & 1.95 \\\\ 3.1 & 4.05\\end{pmatrix}$ — exactly what PyTorch computes under the hood.",
      ],
      visualizations: [
        {
          type: "matrix-transform-2d",
          title: "A weight update step",
          description: "Gradient descent: $W \\leftarrow W - \\eta \\nabla_W L$. Each entry of $W$ is nudged in the direction that reduces the loss most.",
          config: {
            matrix: [
              [1, 0.1],
              [0.05, 1],
            ],
            animateFromIdentity: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "What is $\\nabla_{\\mathbf{x}} (\\mathbf{a}^\\top \\mathbf{x})$?",
          options: ["$\\mathbf{x}$", "$\\mathbf{a}$", "$\\mathbf{a}^\\top$", "$0$"],
          correctIndex: 1,
          hint: "Expand: $\\mathbf{a}^\\top \\mathbf{x} = a_1 x_1 + \\dots + a_n x_n$.",
          explanation: "Each partial is $\\partial/\\partial x_i (\\mathbf{a}^\\top \\mathbf{x}) = a_i$, so the full gradient is $\\mathbf{a}$. This is the matrix-calculus analog of $\\frac{d}{dx}(ax) = a$.",
        },
        {
          type: "multiple-choice",
          question: "What is $\\nabla_{\\mathbf{x}}(\\mathbf{x}^\\top A \\mathbf{x})$ when $A$ is symmetric?",
          options: ["$A\\mathbf{x}$", "$2A\\mathbf{x}$", "$\\mathbf{x}^\\top A$", "$A^\\top A \\mathbf{x}$"],
          correctIndex: 1,
          hint: "$\\nabla_{\\mathbf{x}}(\\mathbf{x}^\\top A \\mathbf{x}) = (A + A^\\top)\\mathbf{x}$; use $A = A^\\top$.",
          explanation: "For symmetric $A$, $(A + A^\\top) = 2A$, giving gradient $2A\\mathbf{x}$. This matches the 1D analog $\\frac{d}{dx}(ax^2) = 2ax$.",
        },
        {
          type: "multiple-choice",
          question: "In a fully connected layer, why does the weight gradient have the outer-product form $\\delta \\mathbf{x}^\\top$?",
          options: [
            "By numerical convention.",
            "Because $\\mathbf{h} = W\\mathbf{x}$ means $\\frac{\\partial h_i}{\\partial w_{ij}} = x_j$; combined with upstream gradient $\\delta_i$, the gradient's $(i,j)$ entry is $\\delta_i x_j$.",
            "Because $W$ is orthogonal.",
            "By coincidence.",
          ],
          correctIndex: 1,
          hint: "Differentiate a single entry of $W$.",
          explanation: "Each weight $w_{ij}$ affects only output $h_i$, and the chain rule gives $\\frac{\\partial L}{\\partial w_{ij}} = \\delta_i \\cdot x_j$. Stacking all $i, j$ gives the outer product $\\delta \\mathbf{x}^\\top$ — the atomic gradient update for a linear layer.",
        },
      ],
      keyTakeaways: [
        "Matrix gradients have the same shape as the matrix parameter.",
        "Identities like $\\nabla_{\\mathbf{x}}(\\mathbf{x}^\\top A \\mathbf{x}) = (A+A^\\top)\\mathbf{x}$ shortcut derivations.",
        "Neural-net weight gradients are outer products $\\delta \\mathbf{x}^\\top$ — the core of backprop.",
      ],
      keyTakeawaysEs: [
        "Los gradientes matriciales tienen la misma forma que el parámetro matricial.",
        "Identidades como $\nabla_{\mathbf{x}}(\mathbf{x}^\top A \mathbf{x}) = (A+A^\top)\mathbf{x}$ atajan las derivaciones.",
        "Los gradientes de pesos de redes neuronales son productos externos $\delta \mathbf{x}^\top$ — el núcleo de backprop.",
      ],
    },

    // =========================================================================
    // LESSON 29 — Chapter 5.5: Backpropagation and Automatic Differentiation
    // =========================================================================
    {
      title: "Backpropagation and Automatic Differentiation",
      titleEs: "Retropropagación y Diferenciación Automática",
      chapter: "Vector Calculus",
      chapterEs: "Cálculo Vectorial",
      chapterNumber: 5,
      content: [
        "**Backpropagation** is the chain rule, applied efficiently to a **computational graph** — a directed acyclic graph where each node is a primitive operation and edges carry intermediate values. To compute $\\nabla_\\theta L$, we start from the loss at the top and walk the graph in reverse, multiplying by each operation's local Jacobian as we go. The cost is roughly twice the forward pass, regardless of how many parameters there are.",
        "Modern auto-diff (PyTorch, JAX, TensorFlow) implements this as two modes. **Forward-mode** computes $J\\mathbf{v}$ (Jacobian-vector product) by walking the graph forward while carrying tangent vectors. **Reverse-mode** (= backpropagation) computes $\\mathbf{u}^\\top J$ (vector-Jacobian product) by walking backward. When the output is scalar (a loss) and inputs are high-dimensional (parameters), reverse mode is overwhelmingly cheaper — one backward pass replaces millions of forward-mode passes.",
        "A critical insight: **we never materialize the full Jacobian**. For a neural network with millions of parameters, the Jacobian is an unmanageable matrix. Instead, backprop computes Jacobian-vector products implicitly, layer by layer. For a matrix multiply $\\mathbf{y} = W\\mathbf{x}$, the gradient contribution is $\\nabla_W L = \\delta \\mathbf{x}^\\top$ and $\\nabla_{\\mathbf{x}} L = W^\\top \\delta$ — each is a single matrix multiply, never an explicit Jacobian.",
        "Auto-diff handles arbitrary computations, not just neural networks. Any differentiable function expressible as a composition of primitives (add, multiply, log, exp, matmul, etc.) is automatically differentiable. This is why modern ML frameworks can compute gradients of non-standard architectures, custom losses, variational objectives, and even implicit functions via the implicit function theorem.",
        "Two practical pitfalls: **vanishing gradients** (derivatives of sigmoids/tanhs shrink near saturation, and products of many small numbers collapse to zero) and **exploding gradients** (products of many large numbers blow up). Techniques like ReLU activations, residual connections, and gradient clipping address these directly. Understanding how gradients propagate — and where they die — is essential for training deep networks.",
        "**Worked example — backprop through $y = (wx + b)^2$:** Let $w = 2$, $b = 1$, $x = 3$. Forward pass: $z = wx + b = 7$, then $y = z^2 = 49$. Backward pass using chain rule: $\\frac{\\partial y}{\\partial z} = 2z = 14$, $\\frac{\\partial z}{\\partial w} = x = 3$, so $\\frac{\\partial y}{\\partial w} = 14 \\cdot 3 = 42$. Similarly $\\frac{\\partial y}{\\partial b} = 14 \\cdot 1 = 14$ — every gradient framework produces these exact numbers.",
        "**Worked example — forward vs reverse mode cost:** Consider $f : \\mathbb{R}^{1000} \\to \\mathbb{R}$. Forward mode needs 1000 passes (one per input) to fill the Jacobian; reverse mode needs just 1 backward pass. Conversely, for $f : \\mathbb{R} \\to \\mathbb{R}^{1000}$, forward mode wins with 1 pass versus 1000. This asymmetry is why neural-net training (millions of inputs, one scalar loss) always uses reverse mode.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "Vanishing gradient: sigmoid saturation",
          description: "$\\sigma'(x)$ is near zero for $|x| > 4$, so deep sigmoid networks lose gradient through the chain. ReLU fixes this for $x > 0$.",
          config: {
            fn: "sigmoid",
            domain: [-8, 8],
            showTangent: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Why is reverse-mode auto-diff preferred over forward-mode for training neural networks?",
          options: [
            "It is numerically more accurate.",
            "Networks have many parameters and a scalar loss — reverse mode computes the gradient in one backward pass, independent of parameter count.",
            "Forward mode does not work on GPUs.",
            "Reverse mode avoids the chain rule.",
          ],
          correctIndex: 1,
          hint: "Compare cost as a function of input vs output dimension.",
          explanation: "Forward mode costs scale with **input** dimension; reverse mode with **output** dimension. Since training has a scalar loss (output dim 1) and millions of parameters (input dim huge), reverse is cheaper by a factor of millions — the same reason all major ML libraries use backprop.",
        },
        {
          type: "numeric-input",
          question: "A 50-layer deep sigmoid network has pre-activations saturated to $\\sigma'(x) \\approx 0.1$. Roughly what factor does the gradient shrink by after 50 layers?",
          answer: 1e-50,
          tolerance: 1e-49,
          hint: "Multiply 0.1 by itself 50 times.",
          explanation: "$0.1^{50} = 10^{-50}$ — essentially zero in floating point. This is the **vanishing gradient** problem, and it's why deep sigmoid nets failed historically. ReLU (derivative 0 or 1), residual connections, and batch norm are all tools to keep gradients flowing.",
        },
        {
          type: "multiple-choice",
          question: "Why does backprop never need to explicitly form the full Jacobian of a layer?",
          options: [
            "Because the Jacobian is always zero.",
            "It computes only the vector-Jacobian product $\\mathbf{u}^\\top J$ needed to propagate the gradient, which is usually a cheap primitive operation.",
            "Because it uses finite differences.",
            "Jacobians are computed symbolically once.",
          ],
          correctIndex: 1,
          hint: "For a linear layer, the Jacobian is $W$ but the VJP is just a matrix multiply.",
          explanation: "Backprop only needs the **vector-Jacobian product**: given the upstream gradient $\\delta$, compute $\\delta^\\top J$. For most primitives, this is a straightforward operation (a matmul for linear layers, an element-wise multiply for activations) whose cost matches the forward pass.",
        },
      ],
      keyTakeaways: [
        "Backprop is reverse-mode auto-diff: chain rule executed right-to-left on a computational graph.",
        "Each layer contributes a vector-Jacobian product — never a full Jacobian — making gradients scale linearly in graph size.",
        "Watch for vanishing/exploding gradients; architectural choices (ReLU, residuals, clipping) mitigate them.",
      ],
      keyTakeawaysEs: [
        "Backprop es diferenciación automática en modo reverso: regla de la cadena aplicada de derecha a izquierda sobre un grafo computacional.",
        "Cada capa aporta un producto vector-jacobiano — nunca un jacobiano completo — haciendo que los gradientes escalen linealmente con el tamaño del grafo.",
        "Cuidado con los gradientes que se desvanecen o explotan; decisiones arquitectónicas (ReLU, residuos, clipping) los mitigan.",
      ],
    },

    // =========================================================================
    // LESSON 30 — Chapter 5.6: Higher-Order Derivatives
    // =========================================================================
    {
      title: "Higher-Order Derivatives",
      titleEs: "Derivadas de Orden Superior",
      chapter: "Vector Calculus",
      chapterEs: "Cálculo Vectorial",
      chapterNumber: 5,
      content: [
        "Taking the derivative of a derivative gives **higher-order derivatives**. In 1D, $f''(x)$ measures **curvature** — how fast the slope is itself changing. Large positive $f''$ means the function curves up sharply (a narrow bowl), small $f''$ means gentle curvature (a wide bowl), and negative $f''$ means curving down (a hill).",
        "For multivariable $f : \\mathbb{R}^n \\to \\mathbb{R}$, the second-order object is the **Hessian matrix** $H_f \\in \\mathbb{R}^{n \\times n}$ with entries $H_{ij} = \\frac{\\partial^2 f}{\\partial x_i \\partial x_j}$. For sufficiently smooth $f$, mixed partials commute (Clairaut's theorem): $\\frac{\\partial^2 f}{\\partial x_i \\partial x_j} = \\frac{\\partial^2 f}{\\partial x_j \\partial x_i}$, so the Hessian is **symmetric**.",
        "The Hessian characterizes critical points. At a point where $\\nabla f = \\mathbf{0}$: if $H$ is **positive definite** (all eigenvalues > 0), it is a local minimum; if **negative definite**, a local maximum; if **indefinite** (mixed signs), a saddle point; if singular, the test is inconclusive and you need higher-order analysis. The eigenvalues of the Hessian give the curvatures along the principal axes of the quadratic form.",
        "The **condition number** of the Hessian — the ratio $\\lambda_{\\max} / \\lambda_{\\min}$ — governs how hard the optimization problem is. A high condition number means the loss landscape has very elongated valleys: gradient descent zigzags because it can't find the long narrow direction. This is exactly why **Newton's method** $\\mathbf{x}_{k+1} = \\mathbf{x}_k - H^{-1}\\nabla f$ converges faster: it rescales by the inverse Hessian, making the effective landscape isotropic.",
        "In ML, the Hessian drives **second-order optimization** (Newton, quasi-Newton methods like L-BFGS, natural gradient descent), **Laplace approximations** of Bayesian posteriors (approximate a posterior by a Gaussian with covariance $H^{-1}$), and **sharpness-based generalization** (flat minima with small Hessian eigenvalues tend to generalize better than sharp ones). Storing and inverting Hessians is expensive ($O(n^2)$ storage, $O(n^3)$ inversion), which is why most deep learning uses first-order methods or stochastic approximations.",
        "**Worked example — classify critical point of $f(x,y) = x^2 + xy + y^2$:** Gradient $\\nabla f = (2x + y,\\; x + 2y)$ vanishes only at $(0,0)$. Hessian $H = \\begin{pmatrix}2 & 1 \\\\ 1 & 2\\end{pmatrix}$ has eigenvalues $\\lambda = 1, 3$ (both positive). Since $H$ is positive definite, the origin is a strict local minimum, matching the fact that $f$ is a convex quadratic form.",
        "**Worked example — condition number and Newton step:** For $f(x,y) = 10x^2 + y^2$, the Hessian $H = \\begin{pmatrix}20 & 0 \\\\ 0 & 2\\end{pmatrix}$ has condition number $\\kappa = 20/2 = 10$. Starting from $(1, 1)$ the gradient is $(20, 2)$, so vanilla GD takes a long zigzag. Newton's step $\\mathbf{x} - H^{-1}\\nabla f = (1,1) - (1, 1) = (0,0)$ reaches the minimum in a single step — the power of using curvature.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "Second derivative = curvature",
          description: "$f(x) = x^2$ has $f''(x) = 2$ everywhere — uniform positive curvature, a convex bowl.",
          config: {
            fn: "x^2",
            domain: [-3, 3],
            showTangent: true,
          },
        },
        {
          type: "gradient-field",
          title: "Ill-conditioned quadratic",
          description: "When Hessian eigenvalues differ widely, gradient descent zigzags along the narrow valley instead of flowing straight to the minimum.",
          config: {
            surface: "rosenbrock",
            showTrajectory: true,
            learningRate: 0.001,
          },
        },
      ],
      exercises: [
        {
          type: "matrix-input",
          question: "Compute the Hessian of $f(x, y) = x^2 + 3xy + 2y^2$ at any point.",
          rows: 2,
          cols: 2,
          answer: [
            [2, 3],
            [3, 4],
          ],
          tolerance: 0.01,
          hint: "Second partials: $f_{xx}, f_{xy}, f_{yx}, f_{yy}$.",
          explanation: "$f_x = 2x + 3y$, $f_y = 3x + 4y$. So $f_{xx} = 2$, $f_{xy} = 3$, $f_{yx} = 3$, $f_{yy} = 4$. The Hessian is constant because $f$ is a quadratic form — and symmetric, as expected.",
        },
        {
          type: "multiple-choice",
          question: "A critical point has Hessian eigenvalues $\\{2, -1\\}$. What kind of point is it?",
          options: ["Local minimum", "Local maximum", "Saddle point", "Undefined"],
          correctIndex: 2,
          hint: "Positive in one direction, negative in another.",
          explanation: "The Hessian is **indefinite** (mixed signs), so the point is a **saddle**: curving up in one principal direction and down in the other. Gradient descent can escape along the negative-eigenvalue direction.",
        },
        {
          type: "multiple-choice",
          question: "Why do most deep learning pipelines avoid computing the full Hessian?",
          options: [
            "The Hessian is undefined for neural networks.",
            "For a model with $n$ parameters, storing the Hessian takes $O(n^2)$ memory, which is infeasible for $n$ in the millions.",
            "Hessians give wrong gradients.",
            "PyTorch cannot compute them.",
          ],
          correctIndex: 1,
          hint: "Think about memory for a billion-parameter model.",
          explanation: "For $n = 10^9$ parameters, the Hessian has $10^{18}$ entries — petabytes of storage. Inverting it takes $O(n^3)$ operations. Instead, methods like L-BFGS approximate $H^{-1}$ from low-rank updates, or natural gradient uses the Fisher information as a proxy.",
        },
      ],
      keyTakeaways: [
        "The Hessian is the matrix of second partial derivatives; it is symmetric for smooth functions.",
        "Positive/negative definite Hessian ⟹ local min/max; indefinite ⟹ saddle.",
        "The condition number of $H$ controls optimization difficulty — Newton's method inverts it to fix ill-conditioning.",
      ],
      keyTakeawaysEs: [
        "El hessiano es la matriz de segundas derivadas parciales; es simétrico para funciones suaves.",
        "Hessiano definido positivo/negativo ⟹ mínimo/máximo local; indefinido ⟹ punto de silla.",
        "El número de condición de $H$ controla la dificultad de optimización — el método de Newton lo invierte para corregir el mal condicionamiento.",
      ],
    },

    // =========================================================================
    // LESSON 31 — Chapter 5.7: Linearization and Taylor Series
    // =========================================================================
    {
      title: "Linearization and Taylor Series",
      titleEs: "Linealización y Series de Taylor",
      chapter: "Vector Calculus",
      chapterEs: "Cálculo Vectorial",
      chapterNumber: 5,
      content: [
        "A **Taylor series** approximates a smooth function by a polynomial. Near a point $a$, the $k$-th order approximation is $f(x) \\approx f(a) + f'(a)(x - a) + \\frac{f''(a)}{2!}(x-a)^2 + \\dots + \\frac{f^{(k)}(a)}{k!}(x - a)^k$. The **first-order** approximation is the tangent line (linearization); the **second-order** version is a parabola tangent to the function at $a$.",
        "For multivariable $f : \\mathbb{R}^n \\to \\mathbb{R}$, the Taylor expansion becomes $f(\\mathbf{x}) \\approx f(\\mathbf{a}) + \\nabla f(\\mathbf{a})^\\top (\\mathbf{x} - \\mathbf{a}) + \\frac{1}{2} (\\mathbf{x} - \\mathbf{a})^\\top H_f(\\mathbf{a}) (\\mathbf{x} - \\mathbf{a})$. Linearization uses only the gradient; quadratic approximation adds the Hessian term. This is the bedrock of almost all continuous optimization theory.",
        "Approximation quality depends on how far you are from the base point and how non-polynomial $f$ is. The **remainder term** $R_k(x)$ typically decays as $|x - a|^{k+1}$ for smooth functions, so small neighborhoods admit very accurate low-order approximations. For smooth functions analytic in a neighborhood, the series converges exactly to $f$ — but not every smooth function has this property (a famous counter-example is $e^{-1/x^2}$, smooth but not analytic at 0).",
        "Linearization is a recurring idea in ML. **Gradient descent** uses the 1st-order Taylor approximation to propose a step. **Newton's method** uses the 2nd-order approximation and jumps directly to the minimum of the local quadratic model. **Natural gradient** uses a Riemannian correction based on the Fisher metric. **Trust region methods** use quadratic models but constrain step size to where the model is trustworthy.",
        "Beyond optimization, Taylor series power **Laplace approximations** (approximate a posterior by its 2nd-order expansion around the mode), **extended Kalman filters** (linearize nonlinear dynamics at each step), and numerical solvers for ODEs and PDEs. Even approximating activation functions by low-degree polynomials for homomorphic-encryption-friendly inference is a Taylor-series maneuver. It is the universal 'zoom in close and pretend things are simple' tool.",
        "**Worked example — Taylor series of $\\cos(x)$ around 0 up to order 4:** $\\cos(x) \\approx 1 - \\frac{x^2}{2} + \\frac{x^4}{24}$. At $x = 0.1$ this gives $1 - 0.005 + 0.0000042 \\approx 0.9950042$, while the true value is $\\cos(0.1) \\approx 0.9950042$ — indistinguishable to six decimals. The approximation error shrinks like $|x|^6/720$, which is about $10^{-9}$ at $x = 0.1$.",
        "**Worked example — quadratic Taylor model for optimization:** Let $f(x,y) = e^{x+y}$. At the point $\\mathbf{a} = (0,0)$ we have $f(\\mathbf{a}) = 1$, $\\nabla f(\\mathbf{a}) = (1, 1)$, and $H_f(\\mathbf{a}) = \\begin{pmatrix}1 & 1 \\\\ 1 & 1\\end{pmatrix}$. The 2nd-order model is $m(\\mathbf{x}) = 1 + x + y + \\tfrac{1}{2}(x+y)^2$. For $(x,y) = (0.1, 0.1)$: $m = 1 + 0.2 + 0.02 = 1.22$ versus true $e^{0.2} \\approx 1.2214$ — within 0.1%.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "Taylor approximation of $\\sin(x)$",
          description: "Near $x = 0$, $\\sin x \\approx x - x^3/6 + x^5/120 - \\dots$. Each added term extends the region of good approximation.",
          config: {
            fn: "sin",
            domain: [-6, 6],
            showTangent: true,
            taylorOrder: 5,
          },
        },
        {
          type: "function-plot",
          title: "Linearization of $e^x$ at 0",
          description: "Near $x = 0$, $e^x \\approx 1 + x + x^2/2 + \\dots$. The tangent line $1 + x$ is excellent for small $x$.",
          config: {
            fn: "exp",
            domain: [-2, 2],
            showTangent: true,
            taylorOrder: 2,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "What is the first-order Taylor expansion of $f(x) = e^x$ around $x = 0$?",
          options: ["$1 + x$", "$x$", "$e + x$", "$1 + x + x^2$"],
          correctIndex: 0,
          hint: "$f(0) = 1$, $f'(0) = e^0 = 1$.",
          explanation: "First-order: $f(0) + f'(0)x = 1 + 1\\cdot x = 1 + x$. This is an excellent approximation near 0: $e^{0.1} \\approx 1.105$, while $1 + 0.1 = 1.1$ — off by less than 0.5%.",
        },
        {
          type: "numeric-input",
          question: "Use a 2nd-order Taylor expansion of $\\cos(x)$ at 0 to approximate $\\cos(0.2)$. Enter the approximation.",
          answer: 0.98,
          tolerance: 0.01,
          hint: "$\\cos x \\approx 1 - x^2/2$.",
          explanation: "$\\cos(x) \\approx 1 - x^2/2$. So $\\cos(0.2) \\approx 1 - 0.02 = 0.98$. True value: $\\cos(0.2) \\approx 0.9801$ — the quadratic approximation is accurate to 4 decimal places.",
        },
        {
          type: "multiple-choice",
          question: "Why does Newton's method converge faster than gradient descent near a minimum?",
          options: [
            "Newton uses a smaller learning rate.",
            "Newton uses the 2nd-order Taylor model (Hessian) and jumps directly to its minimum — exact for quadratics, near-optimal for smooth functions near a minimum.",
            "Newton avoids the chain rule.",
            "Gradient descent is wrong.",
          ],
          correctIndex: 1,
          hint: "Compare 1st- vs 2nd-order approximations.",
          explanation: "Gradient descent's linear model has no curvature, so steps are conservative. Newton's quadratic model captures curvature exactly for quadratic losses and **quadratically converges** near smooth minima — quickly doubling the number of correct digits per step.",
        },
      ],
      keyTakeaways: [
        "Taylor series approximate a smooth function by a polynomial around a point.",
        "Linearization uses gradient; quadratic approximation adds the Hessian.",
        "Taylor approximations underlie gradient descent, Newton, Kalman filters, and Laplace approximations.",
      ],
      keyTakeawaysEs: [
        "Las series de Taylor aproximan una función suave por un polinomio alrededor de un punto.",
        "La linealización usa el gradiente; la aproximación cuadrática añade el hessiano.",
        "Las aproximaciones de Taylor fundamentan el descenso por gradiente, Newton, filtros de Kalman y aproximaciones de Laplace.",
      ],
    },

    // =========================================================================
    // LESSON 32 — Chapter 6.1: Probability Spaces
    // =========================================================================
    {
      title: "Probability Spaces",
      titleEs: "Espacios de Probabilidad",
      chapter: "Probability and Distributions",
      chapterEs: "Probabilidad y Distribuciones",
      chapterNumber: 6,
      content: [
        "A **probability space** is a mathematical stage for reasoning about uncertainty. It consists of three ingredients: a **sample space** $\\Omega$ (the set of all possible outcomes), a collection $\\mathcal{F}$ of **events** (subsets of $\\Omega$ we want to assign probabilities to), and a **probability measure** $P$ that assigns a number in $[0, 1]$ to each event. Together, $(\\Omega, \\mathcal{F}, P)$ axiomatize the notion of chance.",
        "The probability measure $P$ satisfies three **Kolmogorov axioms**: (1) $P(A) \\geq 0$ for every event $A$, (2) $P(\\Omega) = 1$ — something must happen, and (3) **countable additivity**: for disjoint events $A_1, A_2, \\dots$, $P(\\bigcup_i A_i) = \\sum_i P(A_i)$. From these three, you can derive everything: complements ($P(A^c) = 1 - P(A)$), unions (inclusion–exclusion), and monotonicity.",
        "A **random variable** is a function $X : \\Omega \\to \\mathbb{R}$ that assigns a number to each outcome. It lets us translate messy sample spaces into real numbers we can compute with. Crucially, we usually don't care about $\\Omega$ itself — we care about the **distribution** of $X$, $P(X \\in A)$ for sets $A \\subseteq \\mathbb{R}$. The distribution is the practical object.",
        "**Independence** of events is defined by $P(A \\cap B) = P(A) P(B)$ — the joint probability factorizes. Conceptually, knowing $A$ tells us nothing about $B$. Random variables $X, Y$ are independent if their joint distribution factors as the product of marginals: $p(x, y) = p(x) p(y)$. Independence is a very strong assumption that many ML models rely on (naive Bayes is the extreme example) — and whose violation has real consequences.",
        "In ML, probability spaces formalize the data-generating process. We imagine each training example $(\\mathbf{x}_i, y_i)$ as drawn independently from some underlying joint distribution $p(\\mathbf{x}, y)$. Our goal is to estimate conditional probabilities $p(y \\mid \\mathbf{x})$ from a finite sample. Every learning algorithm — from linear regression to GPT — is implicitly or explicitly estimating some probability-space object.",
        "**Worked example — three coin tosses:** The sample space is $\\Omega = \\{HHH, HHT, HTH, THH, HTT, THT, TTH, TTT\\}$, 8 equally likely outcomes. The event 'exactly 2 heads' is $\\{HHT, HTH, THH\\}$, so $P(\\text{2 heads}) = 3/8 = 0.375$. Axioms check out: $P(\\Omega) = 8/8 = 1$, all probabilities are non-negative, and disjoint events sum correctly.",
        "**Worked example — Kolmogorov axioms in action:** Suppose a weather model gives $P(\\text{rain}) = 0.4$ and $P(\\text{wind}) = 0.5$ with $P(\\text{rain} \\cap \\text{wind}) = 0.2$. By inclusion-exclusion, $P(\\text{rain} \\cup \\text{wind}) = 0.4 + 0.5 - 0.2 = 0.7$ and the complement $P(\\text{neither}) = 1 - 0.7 = 0.3$. All three values sit in $[0,1]$ and respect additivity.",
      ],
      visualizations: [
        {
          type: "probability-plot",
          title: "A uniform distribution on [0, 1]",
          description: "$P(X \\in [a, b]) = b - a$ for $0 \\leq a \\leq b \\leq 1$. The density is flat.",
          config: {
            distribution: "uniform",
            params: { a: 0, b: 1 },
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "A fair six-sided die is rolled. What is $P(\\text{even})$?",
          answer: 0.5,
          tolerance: 0.01,
          hint: "Three of six outcomes are even: 2, 4, 6.",
          explanation: "The event 'even' is $\\{2, 4, 6\\}$, each with probability $1/6$. Total: $3/6 = 0.5$. The sample space was $\\Omega = \\{1, 2, 3, 4, 5, 6\\}$ with uniform $P$.",
        },
        {
          type: "numeric-input",
          question: "If $P(A) = 0.3$ and $P(B) = 0.4$, and $A, B$ are independent, what is $P(A \\cap B)$?",
          answer: 0.12,
          tolerance: 0.01,
          hint: "Independence means probabilities multiply.",
          explanation: "$P(A \\cap B) = P(A) P(B) = 0.3 \\cdot 0.4 = 0.12$. This is the defining property of independence — and why $\\log p$ decomposes as a sum of independent log-probs, a fact exploited by every likelihood-based model.",
        },
        {
          type: "multiple-choice",
          question: "Which statement violates the Kolmogorov axioms?",
          options: [
            "$P(\\emptyset) = 0$",
            "$P(A^c) = 1 - P(A)$",
            "$P(A) = 1.2$ for some event $A$",
            "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$",
          ],
          correctIndex: 2,
          hint: "Probabilities must be in [0, 1].",
          explanation: "Probabilities are in $[0, 1]$ by the non-negativity axiom and normalization $P(\\Omega) = 1$. A probability of 1.2 is impossible. The other three are standard derived facts.",
        },
      ],
      keyTakeaways: [
        "A probability space is $(\\Omega, \\mathcal{F}, P)$: outcomes, events, and a measure satisfying Kolmogorov's axioms.",
        "Random variables transport probability to $\\mathbb{R}$; we usually care about their distribution.",
        "Independence means joint probability factorizes: $P(A \\cap B) = P(A) P(B)$.",
      ],
      keyTakeawaysEs: [
        "Un espacio de probabilidad es $(\Omega, \mathcal{F}, P)$: resultados, eventos y una medida que cumple los axiomas de Kolmogorov.",
        "Las variables aleatorias trasladan probabilidad a $\mathbb{R}$; normalmente nos importa su distribución.",
        "La independencia significa que la probabilidad conjunta se factoriza: $P(A \cap B) = P(A) P(B)$.",
      ],
    },

    // =========================================================================
    // LESSON 33 — Chapter 6.2: Discrete and Continuous Probabilities
    // =========================================================================
    {
      title: "Discrete and Continuous Probabilities",
      titleEs: "Probabilidades Discretas y Continuas",
      chapter: "Probability and Distributions",
      chapterEs: "Probabilidad y Distribuciones",
      chapterNumber: 6,
      content: [
        "Random variables come in two flavors. A **discrete** random variable takes values in a finite or countable set (like $\\{1, 2, 3, 4, 5, 6\\}$ or $\\mathbb{N}$) and is described by a **probability mass function** (PMF): $p(x) = P(X = x)$. Mass functions satisfy $p(x) \\geq 0$ and $\\sum_x p(x) = 1$ — probability is distributed across discrete points.",
        "A **continuous** random variable takes values in an uncountable set like $\\mathbb{R}$, and is described by a **probability density function** (PDF) $p(x)$ with $p(x) \\geq 0$ and $\\int p(x) \\, dx = 1$. The probability of any single point is zero; meaningful probabilities come from **intervals**: $P(a \\leq X \\leq b) = \\int_a^b p(x) \\, dx$.",
        "Densities are *not* probabilities — they can be greater than 1 (a narrow tall density integrates to 1 over a small region). This surprises people. The right mental picture: a density is a rate, probability-per-unit-of-$x$, and what matters is the area under it over an interval. Units matter too: if $x$ is in meters, $p(x)$ has units of 1/meter.",
        "Both types share a **cumulative distribution function** (CDF): $F(x) = P(X \\leq x)$. For discrete variables, the CDF is a staircase; for continuous, it's a smooth increasing function. The CDF is universally useful because it always exists, always returns true probabilities, and maps cleanly to quantile-based computations (sampling via inverse CDF, confidence intervals).",
        "ML mixes both constantly. Classification outputs a discrete distribution over labels via softmax. Regression predicts a continuous $y$ given $\\mathbf{x}$. Tokens in a language model are discrete but attention scores are continuous. Mastery of both paradigms — and especially how to think about *mixed* or *structured* distributions like those in energy-based models — is essential for building and debugging modern probabilistic systems.",
        "**Worked example — PMF of Binomial(3, 0.5):** For $X \\sim \\text{Binomial}(3, 0.5)$, $p(k) = \\binom{3}{k}(0.5)^3$ gives $p(0) = 1/8$, $p(1) = 3/8$, $p(2) = 3/8$, $p(3) = 1/8$. Total: $1/8 + 3/8 + 3/8 + 1/8 = 1$. These are exactly the probabilities of 0, 1, 2, 3 heads in three fair flips.",
        "**Worked example — Uniform(0,1) PDF integrates to 1:** The density is $p(x) = 1$ on $[0,1]$ and zero elsewhere. The total probability is $\\int_0^1 1\\, dx = 1$. Note $p(0.5) = 1$ is **not** a probability — the probability of any single point is zero. But $P(0.2 \\le X \\le 0.5) = \\int_{0.2}^{0.5} 1\\, dx = 0.3$.",
        "**ML connection — softmax as a PMF:** Given logits $(1, 2, 3)$, softmax outputs $p_i = e^{z_i}/\\sum_j e^{z_j}$ giving roughly $(0.09, 0.24, 0.67)$, summing to $1$ and all non-negative. This is precisely a PMF over three discrete classes — the reason softmax is the canonical classification output.",
      ],
      visualizations: [
        {
          type: "probability-plot",
          title: "Gaussian PDF",
          description: "A continuous distribution. The area under the curve between $a$ and $b$ gives $P(a \\leq X \\leq b)$.",
          config: {
            distribution: "gaussian",
            params: { mu: 0, sigma: 1 },
          },
        },
        {
          type: "probability-plot",
          title: "Exponential density",
          description: "A continuous density for waiting times: $p(x) = \\lambda e^{-\\lambda x}$ for $x \\geq 0$.",
          config: {
            distribution: "exponential",
            params: { lambda: 1 },
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "A die has PMF $p(x) = 1/6$ for $x \\in \\{1, \\dots, 6\\}$. What is $P(X \\leq 3)$?",
          answer: 0.5,
          tolerance: 0.01,
          hint: "Sum the masses for $x = 1, 2, 3$.",
          explanation: "$P(X \\leq 3) = p(1) + p(2) + p(3) = 3/6 = 0.5$. This is the value of the CDF at $x = 3$.",
        },
        {
          type: "multiple-choice",
          question: "For a continuous random variable with density $p(x)$, what is $P(X = a)$?",
          options: ["$p(a)$", "0", "1", "$\\int p(a) da$"],
          correctIndex: 1,
          hint: "Integrate from $a$ to $a$.",
          explanation: "For a continuous RV, the probability of any specific point is **zero** because integration over a single point gives 0. Only intervals have positive probability. This is why we describe continuous variables by densities (rates), not masses.",
        },
        {
          type: "multiple-choice",
          question: "Can a probability density $p(x)$ exceed 1?",
          options: [
            "Never — densities are probabilities.",
            "Yes — densities are rates, and a tall narrow density can exceed 1 as long as $\\int p = 1$.",
            "Only for Gaussians.",
            "Only on bounded intervals.",
          ],
          correctIndex: 1,
          hint: "Think about a uniform density on $[0, 0.1]$.",
          explanation: "A uniform distribution on $[0, 0.1]$ has density $p(x) = 10$ — far above 1. What must be $\\leq 1$ is the integral over any set, i.e., the **probability**. Densities are measured in '1/length' units and can exceed 1 as long as the total integral is 1.",
        },
      ],
      keyTakeaways: [
        "Discrete distributions use PMFs (probabilities at points); continuous use PDFs (probabilities per unit).",
        "The CDF $F(x) = P(X \\leq x)$ exists for both and is universally useful.",
        "Densities are rates — they can exceed 1; only integrals give probabilities.",
      ],
      keyTakeawaysEs: [
        "Las distribuciones discretas usan PMF (probabilidades en puntos); las continuas usan PDF (probabilidades por unidad).",
        "La CDF $F(x) = P(X \leq x)$ existe para ambas y es universalmente útil.",
        "Las densidades son tasas — pueden superar 1; solo las integrales dan probabilidades.",
      ],
    },

    // =========================================================================
    // LESSON 34 — Chapter 6.3: Sum Rule, Product Rule, Bayes' Theorem
    // =========================================================================
    {
      title: "Sum Rule, Product Rule, Bayes' Theorem",
      titleEs: "Regla de la Suma, Regla del Producto, Teorema de Bayes",
      chapter: "Probability and Distributions",
      chapterEs: "Probabilidad y Distribuciones",
      chapterNumber: 6,
      content: [
        "Three rules underpin all of probability. The **sum rule** (or marginalization): $p(x) = \\sum_y p(x, y)$ (or $\\int p(x, y) \\, dy$ in the continuous case). Given a joint distribution, you recover a marginal by summing/integrating out the other variable. This is how we go from 'full knowledge' to 'knowledge about $X$ alone'.",
        "The **product rule**: $p(x, y) = p(x \\mid y) p(y) = p(y \\mid x) p(x)$. The joint probability factors into a conditional times a marginal in either direction. Chaining it gives us the **chain rule of probability**: $p(x_1, x_2, \\dots, x_n) = p(x_1) p(x_2 \\mid x_1) p(x_3 \\mid x_1, x_2) \\cdots$, essential for autoregressive models like language models.",
        "**Bayes' theorem** is just the product rule rearranged: $p(x \\mid y) = \\frac{p(y \\mid x) p(x)}{p(y)}$. It inverts a conditional: if we know how effects follow from causes ($p(y \\mid x)$), we can reason about causes from observed effects ($p(x \\mid y)$). The pieces have standard names: $p(x)$ is the **prior**, $p(y \\mid x)$ is the **likelihood**, $p(x \\mid y)$ is the **posterior**, and $p(y) = \\sum_x p(y \\mid x) p(x)$ is the **evidence**.",
        "Bayes' rule is the engine of **Bayesian inference**: start with a prior belief about parameters $\\theta$, observe data $\\mathcal{D}$, and update to $p(\\theta \\mid \\mathcal{D}) \\propto p(\\mathcal{D} \\mid \\theta) p(\\theta)$. The evidence in the denominator is often intractable, which is why approximate methods — variational inference, MCMC, Laplace approximations — are so central to modern probabilistic ML.",
        "Applications stretch from classic spam filters (Bayes' rule combining word likelihoods and class priors) to medical diagnosis (testing-rule problem: with a 99% accurate test and 1% prevalence, the posterior probability of disease given a positive test is only about 50%, a frequently botched intuition) to modern **Bayesian neural networks** and **diffusion models**. Fluency with these three rules is the baseline for all probabilistic reasoning.",
        "**Worked example — marginalizing a 2x2 joint:** Suppose $p(X, Y)$ has $p(0,0) = 0.1$, $p(0,1) = 0.2$, $p(1,0) = 0.3$, $p(1,1) = 0.4$. By the sum rule, $p(X=0) = 0.1 + 0.2 = 0.3$ and $p(X=1) = 0.3 + 0.4 = 0.7$. Check: total is $1$. The conditional $p(Y=1 \\mid X=1) = 0.4/0.7 \\approx 0.571$ via the product rule.",
        "**Worked example — spam filter with naive Bayes:** Suppose $p(\\text{spam}) = 0.3$ and the word 'free' appears in 80% of spam emails but only 10% of ham. For an email containing 'free', Bayes gives $p(\\text{spam}\\mid \\text{free}) = \\frac{0.8 \\cdot 0.3}{0.8 \\cdot 0.3 + 0.1 \\cdot 0.7} = \\frac{0.24}{0.31} \\approx 0.774$. The posterior jumps from 30% to 77% — seeing 'free' is strong evidence.",
      ],
      visualizations: [
        {
          type: "bayes-updater",
          title: "Bayesian update: prior meets likelihood",
          description: "Start with a Gaussian prior, observe data, and watch the posterior concentrate. Each observation sharpens belief.",
          config: {
            priorMu: 0,
            priorSigma: 2,
            likelihoodSigma: 1,
            observations: [1, 1.2, 0.8, 1.1],
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "A disease has prevalence 1% ($p(D) = 0.01$). A test has sensitivity $p(+ \\mid D) = 0.99$ and false positive rate $p(+ \\mid \\neg D) = 0.05$. What is $p(D \\mid +)$?",
          answer: 0.167,
          tolerance: 0.01,
          hint: "Use Bayes: $p(D \\mid +) = \\frac{p(+ \\mid D)p(D)}{p(+)}$, with $p(+) = p(+\\mid D)p(D) + p(+\\mid \\neg D)p(\\neg D)$.",
          explanation: "$p(+) = 0.99 \\cdot 0.01 + 0.05 \\cdot 0.99 = 0.0099 + 0.0495 = 0.0594$. $p(D \\mid +) = 0.0099 / 0.0594 \\approx 0.167$ — only **17%**, not 99%, despite the highly accurate test. This is the base-rate fallacy.",
        },
        {
          type: "multiple-choice",
          question: "Which identity is the **product rule** of probability?",
          options: [
            "$p(x, y) = p(x) + p(y)$",
            "$p(x, y) = p(x \\mid y) p(y)$",
            "$p(x \\mid y) = p(y \\mid x)$",
            "$p(x, y) = p(x) p(y)$",
          ],
          correctIndex: 1,
          hint: "Joint = conditional × marginal.",
          explanation: "The product rule $p(x, y) = p(x \\mid y)p(y)$ always holds. The last option only holds under **independence**; the first two are not valid in general.",
        },
        {
          type: "multiple-choice",
          question: "In Bayes' rule $p(\\theta \\mid \\mathcal{D}) \\propto p(\\mathcal{D} \\mid \\theta) p(\\theta)$, what does $p(\\theta)$ encode?",
          options: [
            "The posterior",
            "The likelihood",
            "Our prior beliefs about $\\theta$ before seeing data",
            "The evidence",
          ],
          correctIndex: 2,
          hint: "Think about the flow: prior → observe → posterior.",
          explanation: "$p(\\theta)$ is the **prior** — beliefs about $\\theta$ before any data. The likelihood $p(\\mathcal{D} \\mid \\theta)$ is how well each $\\theta$ explains the observed data. Multiplying them and normalizing gives the posterior $p(\\theta \\mid \\mathcal{D})$.",
        },
      ],
      keyTakeaways: [
        "Sum rule marginalizes; product rule factors joints; Bayes inverts conditionals.",
        "Bayes: posterior ∝ likelihood × prior. The evidence normalizes.",
        "Base-rate fallacies are everywhere — always apply Bayes, don't trust raw test accuracies.",
      ],
      keyTakeawaysEs: [
        "La regla de la suma marginaliza; la regla del producto factoriza conjuntas; Bayes invierte condicionales.",
        "Bayes: posterior ∝ verosimilitud × prior. La evidencia normaliza.",
        "Las falacias de tasa base están por todas partes — aplica siempre Bayes, no confíes en precisiones crudas.",
      ],
    },

    // =========================================================================
    // LESSON 35 — Chapter 6.4: Summary Statistics and Independence
    // =========================================================================
    {
      title: "Summary Statistics and Independence",
      titleEs: "Estadísticos Resumen e Independencia",
      chapter: "Probability and Distributions",
      chapterEs: "Probabilidad y Distribuciones",
      chapterNumber: 6,
      content: [
        "Distributions are high-dimensional objects, but we often compress them into a few **summary statistics**. The **expected value** (mean) $\\mathbb{E}[X] = \\sum_x x\\, p(x)$ (or $\\int x\\, p(x)\\, dx$) gives the long-run average. Expectation is **linear**: $\\mathbb{E}[aX + bY + c] = a\\mathbb{E}[X] + b\\mathbb{E}[Y] + c$ — no independence required. This linearity is the single most-used identity in probabilistic ML.",
        "The **variance** $\\text{Var}[X] = \\mathbb{E}[(X - \\mathbb{E}[X])^2]$ measures spread around the mean. Its square root $\\sigma = \\sqrt{\\text{Var}[X]}$ is the **standard deviation**, measured in the same units as $X$. Variance is not linear but satisfies $\\text{Var}[aX + b] = a^2 \\text{Var}[X]$ — constants shift the mean but not the spread.",
        "For two random variables, the **covariance** $\\text{Cov}[X, Y] = \\mathbb{E}[(X - \\mathbb{E} X)(Y - \\mathbb{E} Y)]$ measures linear co-variation. Positive means they tend to move together; negative means oppositely; zero means no linear relationship. The normalized version is the **correlation** $\\rho = \\text{Cov}[X, Y] / (\\sigma_X \\sigma_Y) \\in [-1, 1]$.",
        "For multiple random variables bundled as a vector $\\mathbf{X}$, the **covariance matrix** $\\Sigma$ has entries $\\Sigma_{ij} = \\text{Cov}[X_i, X_j]$. Diagonal entries are variances; off-diagonals are covariances. Covariance matrices are always **symmetric positive semi-definite** — a fact exploited heavily by PCA, Gaussian processes, and variational methods.",
        "**Independence implies zero covariance**, but not conversely: zero correlation does not imply independence. Two variables can be perfectly dependent with zero correlation (e.g., $Y = X^2$ with $X \\sim \\mathcal{N}(0, 1)$). This is a constant source of bugs: if your model assumes independence based on zero correlation, you may miss crucial nonlinear relationships. In ML, we usually check with **mutual information** or other nonlinear measures when independence is a critical assumption.",
        "**Worked example — $E[X]$ and $\\text{Var}(X)$ for $\\{1: 0.5, 2: 0.3, 3: 0.2\\}$:** Mean: $E[X] = 1(0.5) + 2(0.3) + 3(0.2) = 0.5 + 0.6 + 0.6 = 1.7$. $E[X^2] = 1(0.5) + 4(0.3) + 9(0.2) = 0.5 + 1.2 + 1.8 = 3.5$. Variance: $\\text{Var}(X) = E[X^2] - (E[X])^2 = 3.5 - 2.89 = 0.61$, so $\\sigma \\approx 0.781$.",
        "**Worked example — covariance of two joint outcomes:** Suppose $(X,Y)$ takes values $(0,0), (1,1), (2,2)$ each with probability $1/3$. Then $E[X] = E[Y] = 1$, $E[XY] = (0 + 1 + 4)/3 = 5/3$, so $\\text{Cov}(X,Y) = 5/3 - 1\\cdot 1 = 2/3$. Since $X = Y$ identically, correlation is $\\rho = 1$ — perfect positive linear relationship.",
      ],
      visualizations: [
        {
          type: "probability-plot",
          title: "Gaussian: mean = 0, std = 1",
          description: "The Gaussian is characterized entirely by its mean and variance. 68% of mass lies within one standard deviation.",
          config: {
            distribution: "gaussian",
            params: { mu: 0, sigma: 1 },
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Roll a fair six-sided die. What is $\\mathbb{E}[X]$?",
          answer: 3.5,
          tolerance: 0.01,
          hint: "Sum $x \\cdot p(x)$ for $x = 1, \\dots, 6$.",
          explanation: "$\\mathbb{E}[X] = (1 + 2 + 3 + 4 + 5 + 6)/6 = 21/6 = 3.5$. The expected value need not be an attainable outcome — it is the long-run average.",
        },
        {
          type: "numeric-input",
          question: "If $X$ has variance 4, what is $\\text{Var}[3X - 5]$?",
          answer: 36,
          tolerance: 0.01,
          hint: "$\\text{Var}[aX + b] = a^2 \\text{Var}[X]$.",
          explanation: "Constants shift the mean but not the spread, and multiplicative scaling squares: $\\text{Var}[3X - 5] = 9 \\cdot 4 = 36$. Standard deviation: $\\sigma = 6$.",
        },
        {
          type: "multiple-choice",
          question: "Two random variables have correlation 0. Which is TRUE?",
          options: [
            "They are independent.",
            "They have no linear relationship, but may have a nonlinear one.",
            "They are identically distributed.",
            "One is a constant.",
          ],
          correctIndex: 1,
          hint: "Zero correlation rules out linear dependence only.",
          explanation: "Correlation captures **linear** dependence. Two variables can satisfy $Y = X^2$ (perfectly deterministic) yet have $\\rho = 0$. True independence is a stronger condition — often checked via mutual information or copula-based measures in modern ML.",
        },
      ],
      keyTakeaways: [
        "Mean, variance, covariance, and correlation summarize distributions.",
        "Expectation is linear; variance is not (it squares scaling factors).",
        "Covariance matrices are symmetric PSD; independence implies zero covariance but not conversely.",
      ],
      keyTakeawaysEs: [
        "Media, varianza, covarianza y correlación resumen distribuciones.",
        "La esperanza es lineal; la varianza no lo es (eleva al cuadrado los factores de escalado).",
        "Las matrices de covarianza son simétricas semidefinidas positivas; la independencia implica covarianza cero pero no al revés.",
      ],
    },

    // =========================================================================
    // LESSON 36 — Chapter 6.5: Gaussian Distribution
    // =========================================================================
    {
      title: "Gaussian Distribution",
      titleEs: "Distribución Gaussiana",
      chapter: "Probability and Distributions",
      chapterEs: "Probabilidad y Distribuciones",
      chapterNumber: 6,
      content: [
        "The **Gaussian** (or **Normal**) distribution is the most important distribution in statistics and ML. A univariate Gaussian has density $p(x) = \\frac{1}{\\sqrt{2\\pi \\sigma^2}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right)$, parameterized by mean $\\mu$ and variance $\\sigma^2$. Its classic bell shape: symmetric around $\\mu$, inflection points at $\\mu \\pm \\sigma$, and roughly 99.7% of mass within $\\mu \\pm 3\\sigma$.",
        "The **multivariate Gaussian** $\\mathcal{N}(\\boldsymbol\\mu, \\Sigma)$ on $\\mathbb{R}^d$ has density $p(\\mathbf{x}) = \\frac{1}{\\sqrt{(2\\pi)^d \\det\\Sigma}} \\exp\\left(-\\tfrac{1}{2}(\\mathbf{x} - \\boldsymbol\\mu)^\\top \\Sigma^{-1}(\\mathbf{x} - \\boldsymbol\\mu)\\right)$. The level sets are ellipsoids aligned with the eigenvectors of $\\Sigma$ — the same eigenvectors PCA recovers. The mean is the center; the covariance describes the shape and orientation.",
        "Gaussians are **closed under several operations**: sums of independent Gaussians are Gaussian, affine transformations $A\\mathbf{x} + \\mathbf{b}$ of Gaussian vectors are Gaussian, marginals are Gaussian, and conditionals are Gaussian. The conditional formulas $p(\\mathbf{x}_1 \\mid \\mathbf{x}_2)$ have closed forms — the workhorses of Gaussian processes and Kalman filters.",
        "Why are Gaussians everywhere? Three reasons. The **central limit theorem** says sums of many independent variables become approximately Gaussian, so noise is often modeled as Gaussian. The **maximum entropy principle** says the Gaussian is the 'most uncertain' distribution given fixed mean and variance, making it the least-committal choice. And practically, the Gaussian's closed-form algebra means tractable inference.",
        "In ML, Gaussians power linear regression's noise model ($y = \\mathbf{w}^\\top \\mathbf{x} + \\epsilon$, $\\epsilon \\sim \\mathcal{N}$), **variational autoencoders** (Gaussian latents and decoder posteriors), **diffusion models** (Gaussian transition kernels), and **Gaussian processes** (distributions over functions). Understanding Gaussian algebra — conditionals, marginals, and precision matrices — is arguably the most practically useful probability skill in ML.",
        "**Worked example — the 68/95/99.7 rule:** For standard normal $Z \\sim \\mathcal{N}(0,1)$, $P(-1 \\le Z \\le 1) \\approx 0.6827$, $P(-2 \\le Z \\le 2) \\approx 0.9545$, and $P(-3 \\le Z \\le 3) \\approx 0.9973$. These are the three most useful numerical facts about any Gaussian — outliers beyond $3\\sigma$ occur about 0.3% of the time.",
        "**Worked example — 2D Gaussian contour:** Take $\\boldsymbol\\mu = (0,0)$ and $\\Sigma = \\begin{pmatrix}4 & 0 \\\\ 0 & 1\\end{pmatrix}$. The level set $(\\mathbf{x} - \\boldsymbol\\mu)^\\top \\Sigma^{-1} (\\mathbf{x} - \\boldsymbol\\mu) = 1$ becomes $x_1^2/4 + x_2^2 = 1$ — an ellipse with semi-axes 2 and 1 along the coordinate axes. The eigenvectors of $\\Sigma$ give the principal directions; eigenvalues $(4, 1)$ give the squared axis lengths.",
        "**Worked example — affine transform stays Gaussian:** If $X \\sim \\mathcal{N}(2, 9)$ and $Y = 3X - 1$, then $Y \\sim \\mathcal{N}(3\\cdot 2 - 1,\\; 3^2 \\cdot 9) = \\mathcal{N}(5, 81)$. So $Y$ has mean 5 and standard deviation 9 — closed form, no integral needed.",
      ],
      visualizations: [
        {
          type: "probability-plot",
          title: "Gaussian densities with different $\\sigma$",
          description: "Larger $\\sigma$ = wider and shorter bell. Smaller $\\sigma$ = narrower and taller. Both integrate to 1.",
          config: {
            distribution: "gaussian",
            params: { mu: 0, sigma: 1 },
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "For $X \\sim \\mathcal{N}(10, 4)$ (mean 10, variance 4), what percentage of mass lies within $X \\in [8, 12]$?",
          answer: 68,
          tolerance: 2,
          hint: "$\\sigma = 2$; the interval is $\\mu \\pm \\sigma$.",
          explanation: "Since $\\sigma^2 = 4$, $\\sigma = 2$. The interval $[8, 12] = [\\mu - \\sigma, \\mu + \\sigma]$. For any Gaussian, ~68% of mass lies within 1 standard deviation of the mean. This is the famous **68-95-99.7 rule**.",
        },
        {
          type: "multiple-choice",
          question: "Which statement about multivariate Gaussians is TRUE?",
          options: [
            "Level sets are always spheres.",
            "Marginals and conditionals are both Gaussian.",
            "The covariance must be diagonal.",
            "They can take negative values.",
          ],
          correctIndex: 1,
          hint: "Gaussians are closed under many operations.",
          explanation: "Marginals $p(\\mathbf{x}_A)$ and conditionals $p(\\mathbf{x}_A \\mid \\mathbf{x}_B)$ of a joint Gaussian are both themselves Gaussian with closed-form mean and covariance — the property that makes GPs and Kalman filters tractable. Level sets are generally **ellipsoids**, not spheres (unless $\\Sigma = \\sigma^2 I$).",
        },
        {
          type: "multiple-choice",
          question: "Why does linear regression assume Gaussian noise by default?",
          options: [
            "It is required by the matrix inverse.",
            "Maximum likelihood under Gaussian noise gives the squared-error loss — exactly the least-squares objective.",
            "Gaussian noise is always positive.",
            "Gaussian is the only noise model.",
          ],
          correctIndex: 1,
          hint: "Take $-\\log p(y \\mid \\mathbf{x})$ under the Gaussian model.",
          explanation: "Under $y \\mid \\mathbf{x} \\sim \\mathcal{N}(\\mathbf{w}^\\top \\mathbf{x}, \\sigma^2)$, the log-likelihood is $-(y - \\mathbf{w}^\\top \\mathbf{x})^2/(2\\sigma^2) + \\text{const}$. Maximizing it is exactly minimizing squared error — the MLE of Gaussian linear models **is** ordinary least squares.",
        },
      ],
      keyTakeaways: [
        "Univariate Gaussian: $\\mu, \\sigma^2$; multivariate: $\\boldsymbol\\mu, \\Sigma$ with ellipsoidal level sets.",
        "Gaussians are closed under affine transforms, sums, marginals, and conditionals.",
        "Gaussians underlie linear regression, VAEs, diffusion models, and GPs.",
      ],
      keyTakeawaysEs: [
        "Gaussiana univariada: $\mu, \sigma^2$; multivariada: $\boldsymbol\mu, \Sigma$ con curvas de nivel elipsoidales.",
        "Las gaussianas son cerradas bajo transformaciones afines, sumas, marginales y condicionales.",
        "Las gaussianas están detrás de la regresión lineal, los VAEs, los modelos de difusión y los procesos gaussianos.",
      ],
    },

    // =========================================================================
    // LESSON 37 — Chapter 6.6: Conjugacy and Exponential Family
    // =========================================================================
    {
      title: "Conjugacy and Exponential Family",
      titleEs: "Conjugación y Familia Exponencial",
      chapter: "Probability and Distributions",
      chapterEs: "Probabilidad y Distribuciones",
      chapterNumber: 6,
      content: [
        "In Bayesian inference, we update a prior $p(\\theta)$ with a likelihood $p(\\mathcal{D} \\mid \\theta)$ to get a posterior $p(\\theta \\mid \\mathcal{D}) \\propto p(\\mathcal{D} \\mid \\theta)p(\\theta)$. The posterior is generally messy — but for certain **conjugate** prior-likelihood pairs, the posterior has the same functional form as the prior. This turns inference from integral calculus into parameter arithmetic.",
        "Classical conjugate pairs: **Beta prior + Bernoulli/Binomial likelihood → Beta posterior**; **Gaussian prior (known variance) + Gaussian likelihood → Gaussian posterior**; **Dirichlet prior + Multinomial → Dirichlet posterior**; **Gamma prior + Poisson → Gamma**. The math reduces to updating 'effective counts' or 'natural parameters', avoiding integration entirely.",
        "The deeper reason these exist: the **exponential family** of distributions. A family has exponential-family form if $p(x \\mid \\theta) = h(x) \\exp\\left(\\boldsymbol\\eta(\\theta)^\\top T(x) - A(\\theta)\\right)$, where $T(x)$ are the **sufficient statistics**, $\\boldsymbol\\eta$ are **natural parameters**, and $A$ is the **log-partition function**. Gaussian, Bernoulli, Poisson, Beta, Dirichlet, Gamma, and categorical distributions are all exponential families.",
        "Exponential families have beautiful properties. Sufficient statistics carry all information from the data about $\\theta$ — you can throw away the raw data. The MLE comes from matching the expected sufficient statistics to the empirical ones. Any exponential family has a conjugate prior of a specific form. And the family is closed under multiplication (so posteriors stay in it).",
        "In ML, this framework clarifies many methods. **Logistic regression** and **Poisson regression** are exponential families with the linear predictor feeding the natural parameter — hence **generalized linear models** (GLMs). **Variational inference** with exponential family approximations becomes coordinate-wise parameter updates. Even modern **energy-based models** are unnormalized exponential families. Seeing the family lurking behind a model is a shortcut to both theory and efficient algorithms.",
        "**Worked example — Beta-Binomial conjugacy:** Start with prior $\\text{Beta}(2,2)$ (weak belief centered at 0.5). Observe 7 heads in 10 flips. The posterior is $\\text{Beta}(2+7,\\; 2+3) = \\text{Beta}(9, 5)$. Its mean is $9/(9+5) \\approx 0.643$ — shifted from the prior mean of 0.5 toward the data frequency 0.7, but pulled back a little by the prior.",
        "**Worked example — exponential-family form of Bernoulli:** $p(x \\mid \\theta) = \\theta^x(1-\\theta)^{1-x}$ rewrites as $\\exp\\left(x \\log\\frac{\\theta}{1-\\theta} + \\log(1-\\theta)\\right)$. So the natural parameter is $\\eta = \\log\\frac{\\theta}{1-\\theta}$ (the logit), the sufficient statistic is $T(x) = x$, and $A(\\theta) = -\\log(1-\\theta)$. This is exactly the logit used in logistic regression.",
      ],
      visualizations: [
        {
          type: "probability-plot",
          title: "Beta distribution is conjugate to Bernoulli",
          description: "Given a Beta(α, β) prior and Bernoulli data, the posterior is Beta(α + #successes, β + #failures) — pure arithmetic.",
          config: {
            distribution: "beta",
            params: { alpha: 2, beta: 5 },
          },
        },
        {
          type: "bayes-updater",
          title: "Conjugate Gaussian updating",
          description: "With a Gaussian prior and Gaussian likelihood, each data point updates the posterior to another Gaussian.",
          config: {
            priorMu: 0,
            priorSigma: 1,
            likelihoodSigma: 0.5,
            observations: [0.5, 0.8, 0.3],
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which prior-likelihood pair is conjugate?",
          options: [
            "Beta prior, Gaussian likelihood",
            "Gaussian prior, Gaussian likelihood",
            "Uniform prior, Beta likelihood",
            "Poisson prior, Gaussian likelihood",
          ],
          correctIndex: 1,
          hint: "Classic conjugate pair for continuous means.",
          explanation: "Gaussian-Gaussian is the canonical conjugate pair: prior $\\mathcal{N}(\\mu_0, \\sigma_0^2)$ + likelihood $\\mathcal{N}(\\mu, \\sigma^2)$ with known $\\sigma^2$ gives posterior $\\mathcal{N}(\\mu_N, \\sigma_N^2)$ with closed-form updates. Beta-Bernoulli is another classic.",
        },
        {
          type: "multiple-choice",
          question: "What is the practical advantage of conjugate priors in Bayesian ML?",
          options: [
            "They are unbiased.",
            "The posterior stays in the same family, so inference reduces to parameter updates instead of integration.",
            "They have zero variance.",
            "They eliminate the need for any data.",
          ],
          correctIndex: 1,
          hint: "Closed-form posterior means no numerical integration.",
          explanation: "Conjugacy makes the posterior computable by **updating a few numbers**, not by solving integrals. This is why algorithms like Bayesian linear regression with Gaussian prior, topic models with Dirichlet priors, and Bayesian bandits with Beta priors are both theoretically clean and computationally fast.",
        },
        {
          type: "multiple-choice",
          question: "Which distribution is NOT in the exponential family (in its standard form)?",
          options: ["Gaussian", "Bernoulli", "Uniform on $[a, b]$ with variable $a, b$", "Poisson"],
          correctIndex: 2,
          hint: "The support must not depend on the parameters.",
          explanation: "The uniform distribution on $[a, b]$ has support that depends on the parameters $a, b$ — disqualifying it from being in the exponential family (which requires a parameter-free support). Gaussian, Bernoulli, and Poisson are textbook members.",
        },
      ],
      keyTakeaways: [
        "Conjugate priors yield posteriors in the same family — inference reduces to parameter updates.",
        "The exponential family unifies many common distributions via sufficient statistics.",
        "GLMs, variational inference, and energy-based models all sit inside this framework.",
      ],
      keyTakeawaysEs: [
        "Los priors conjugados producen posteriores de la misma familia — la inferencia se reduce a actualizar parámetros.",
        "La familia exponencial unifica muchas distribuciones comunes mediante estadísticos suficientes.",
        "Los GLM, la inferencia variacional y los modelos basados en energía viven dentro de este marco.",
      ],
    },

    // =========================================================================
    // LESSON 38 — Chapter 6.7: Change of Variables
    // =========================================================================
    {
      title: "Change of Variables",
      titleEs: "Cambio de Variables",
      chapter: "Probability and Distributions",
      chapterEs: "Probabilidad y Distribuciones",
      chapterNumber: 6,
      content: [
        "Given a random variable $X$ with density $p_X$, what is the density of $Y = f(X)$? The answer is the **change of variables formula**: for a smooth, invertible $f$, $p_Y(y) = p_X(f^{-1}(y)) \\left| \\frac{df^{-1}}{dy} \\right|$. The Jacobian factor accounts for how $f$ stretches or compresses probability density — concentrations of probability move with the inverse stretch.",
        "In higher dimensions, this becomes $p_Y(\\mathbf{y}) = p_X(f^{-1}(\\mathbf{y})) \\left| \\det J_{f^{-1}}(\\mathbf{y}) \\right|$, where $J_{f^{-1}}$ is the Jacobian matrix of the inverse. Equivalently, using the forward Jacobian: $p_Y(\\mathbf{y}) = p_X(\\mathbf{x}) / |\\det J_f(\\mathbf{x})|$ where $\\mathbf{x} = f^{-1}(\\mathbf{y})$. Either form says: **volume scaling of $f$ must be corrected** so total probability stays 1.",
        "The formula requires $f$ to be a **bijection** (one-to-one and onto on the relevant domain) and to be smooth enough for its Jacobian to exist. If $f$ is not invertible — think $Y = X^2$ for $X \\in \\mathbb{R}$ — you sum contributions from all preimages. If $f$ collapses dimensions (e.g., a rank-deficient transformation), you cannot recover a density on $Y$; instead, $Y$ lives on a lower-dimensional manifold.",
        "Change of variables shows up throughout probabilistic ML. Deriving the distribution of a sum, ratio, or transformation of known variables (e.g., $Y = e^X$ for $X$ Gaussian gives a log-normal). Converting between scale parameters (when modeling $\\sigma$ vs $\\log \\sigma$ or $\\tau = 1/\\sigma^2$). Any time we substitute a parameterization, the Jacobian keeps the probabilities honest.",
        "The marquee application is **normalizing flows**: stack a sequence of invertible transformations $f_1, f_2, \\dots, f_K$ to map a simple base distribution (standard Gaussian) to a complex target. Each layer contributes a log-det-Jacobian term, and the log-likelihood of the target becomes $\\log p_X(\\mathbf{x}) = \\log p_Z(f^{-1}(\\mathbf{x})) + \\sum_k \\log|\\det J_{f_k^{-1}}|$. Flows are the clearest modern use of change of variables — invertibility and tractable Jacobians are the whole design constraint.",
        "**Worked example — $X \\sim U(0,1)$ transformed by $Y = -\\ln X$:** The inverse is $X = e^{-Y}$ with $dx/dy = -e^{-y}$, so $p_Y(y) = p_X(e^{-y}) \\cdot |{-e^{-y}}| = 1 \\cdot e^{-y}$ for $y \\ge 0$. That's an Exponential(1) density — the classic trick used in inverse-CDF sampling. Verify: $\\int_0^\\infty e^{-y}\\, dy = 1$.",
        "**Worked example — log-normal from Gaussian:** If $X \\sim \\mathcal{N}(0,1)$ and $Y = e^X$, then $X = \\ln Y$ with $dx/dy = 1/y$, so $p_Y(y) = \\frac{1}{y\\sqrt{2\\pi}}\\exp(-(\\ln y)^2/2)$ for $y > 0$. The Jacobian factor $1/y$ is essential — dropping it would give a non-normalizable density. This is why normalizing flows track every $\\log|{\\det J}|$ term.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "Transformation $Y = e^X$",
          description: "If $X \\sim \\mathcal{N}(0, 1)$, then $Y = e^X$ follows a log-normal distribution. The Jacobian factor $1/y$ reshapes the density.",
          config: {
            fn: "exp",
            domain: [-2, 2],
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "The change of variables formula for densities requires the transformation to be:",
          options: [
            "Linear",
            "Smooth and invertible (bijective)",
            "Increasing",
            "Bounded",
          ],
          correctIndex: 1,
          hint: "Need to invert and compute a Jacobian.",
          explanation: "For a single-valued density transformation, $f$ must be **bijective** (invertible) and differentiable (so Jacobian exists). Linearity is not required. Non-bijective transforms can still work if we sum over preimages or consider more general measure-theoretic formulations.",
        },
        {
          type: "multiple-choice",
          question: "In a normalizing flow, why do we need the Jacobian determinants of each transformation to be easy to compute?",
          options: [
            "For numerical stability.",
            "Because the log-likelihood requires summing $\\log |\\det J_k|$ at every layer; expensive determinants would make training impractical.",
            "To ensure invertibility.",
            "By convention.",
          ],
          correctIndex: 1,
          hint: "Training requires evaluating the log-likelihood at every step.",
          explanation: "Each flow layer contributes a $\\log|\\det J|$ term to the log-likelihood. Naive determinants cost $O(d^3)$, infeasible for large $d$. Flow architectures (RealNVP, Glow, autoregressive flows) are specifically designed so Jacobians are triangular, diagonal, or otherwise cheap — often $O(d)$.",
        },
        {
          type: "numeric-input",
          question: "$X$ is uniform on $[0, 1]$, and $Y = 2X$. What is the density of $Y$ at $y = 1$?",
          answer: 0.5,
          tolerance: 0.01,
          hint: "$p_Y(y) = p_X(y/2) \\cdot |dx/dy|$.",
          explanation: "$X = Y/2$, $dx/dy = 1/2$. Since $p_X = 1$ on $[0, 1]$ (so $p_X(0.5) = 1$), $p_Y(1) = 1 \\cdot 1/2 = 0.5$. $Y$ is uniform on $[0, 2]$, so its density is $1/2$ — consistent.",
        },
      ],
      keyTakeaways: [
        "When $Y = f(X)$ with $f$ invertible, $p_Y(\\mathbf{y}) = p_X(\\mathbf{x}) / |\\det J_f|$.",
        "The Jacobian corrects for the volume scaling of $f$.",
        "Normalizing flows chain invertible transforms, summing log-det-Jacobians for tractable density estimation.",
      ],
      keyTakeawaysEs: [
        "Cuando $Y = f(X)$ con $f$ invertible, $p_Y(\mathbf{y}) = p_X(\mathbf{x}) / |\det J_f|$.",
        "El jacobiano corrige el escalado de volumen de $f$.",
        "Los normalizing flows encadenan transformaciones invertibles, sumando logaritmos de determinantes de jacobianos para estimar densidades de forma tratable.",
      ],
    },

    // =========================================================================
    // LESSON 39 — Chapter 7.1: Gradient Descent
    // =========================================================================
    {
      title: "Gradient Descent",
      titleEs: "Descenso por Gradiente",
      chapter: "Continuous Optimization",
      chapterEs: "Optimización Continua",
      chapterNumber: 7,
      content: [
        "**Gradient descent** is the simplest and most-used continuous optimization algorithm: to minimize a differentiable $f(\\mathbf{x})$, start at some $\\mathbf{x}_0$ and iteratively update $\\mathbf{x}_{k+1} = \\mathbf{x}_k - \\eta \\nabla f(\\mathbf{x}_k)$, where $\\eta > 0$ is the **learning rate**. Each step moves in the direction of steepest descent — the negative gradient — by an amount scaled by $\\eta$.",
        "The learning rate is the most important hyperparameter. Too small, and convergence is glacial. Too large, and the algorithm may overshoot and diverge. For convex quadratics, the optimal $\\eta$ is related to the Hessian's eigenvalues: $\\eta \\leq 2/\\lambda_{\\max}$ for stability, and the convergence rate depends on the condition number $\\kappa = \\lambda_{\\max}/\\lambda_{\\min}$. Ill-conditioned problems (large $\\kappa$) converge slowly.",
        "Practical variants include **momentum** ($\\mathbf{v}_{k+1} = \\beta \\mathbf{v}_k + \\nabla f$, step in $\\mathbf{v}$), which accelerates along consistent directions and damps oscillation. **Adam** adapts per-parameter learning rates by tracking running averages of gradients and their squares — the default for deep learning. **SGD with warm restarts** and **cyclical learning rates** address the challenges of non-convex landscapes by periodically resetting.",
        "**Stochastic gradient descent (SGD)** uses a random mini-batch of data to estimate $\\nabla f$, trading variance for enormous speedups on large datasets. Remarkably, SGD often **generalizes better** than exact gradient descent — the noise acts as a regularizer and helps escape sharp minima. This is one of the deep mysteries (and joys) of deep learning.",
        "Gradient descent is not guaranteed to find a global minimum in general — only a critical point. For non-convex losses (like neural network training), we can land at local minima, saddle points, or simply plateau. In practice, it is the primary algorithm for training every modern neural network — a testament to how well it navigates even these challenging landscapes when combined with good initialization, architectures, and stochasticity.",
        "**Worked example — GD on $f(x) = x^2$ from $x_0 = 4$, $\\eta = 0.1$:** With $f'(x) = 2x$, the update is $x_{k+1} = x_k - 0.1\\cdot 2x_k = 0.8\\, x_k$. Iterating: $x_0 = 4$, $x_1 = 3.2$, $x_2 = 2.56$, $x_3 = 2.048$, $x_4 \\approx 1.638$. Convergence is geometric with rate $0.8$ per step — after 30 steps, $x_{30} \\approx 0.0048$, essentially at the minimum.",
        "**Worked example — divergence with too-large $\\eta$:** For the same $f(x) = x^2$ with $\\eta = 1.1$, the update is $x_{k+1} = (1 - 2.2)x_k = -1.2\\, x_k$. Starting at $x_0 = 1$: $x_1 = -1.2$, $x_2 = 1.44$, $x_3 = -1.728$ — oscillating and growing. The stability bound is $\\eta < 1/\\lambda_{\\max} = 1/2 \\cdot 2 = 1$ (using $\\eta \\le 2/\\lambda_{\\max}$), confirming $\\eta = 1.1$ is too aggressive.",
      ],
      visualizations: [
        {
          type: "gradient-field",
          title: "GD on a bowl",
          description: "On a convex quadratic, GD spirals toward the unique minimum. Step size controls speed and stability.",
          config: {
            surface: "bowl",
            showTrajectory: true,
            learningRate: 0.1,
          },
        },
        {
          type: "gradient-field",
          title: "GD on Rosenbrock",
          description: "The Rosenbrock function has a narrow curved valley — a classic non-trivial optimization benchmark.",
          config: {
            surface: "rosenbrock",
            showTrajectory: true,
            learningRate: 0.001,
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Starting from $x_0 = 4$ with learning rate $\\eta = 0.1$, perform one GD step on $f(x) = x^2$. What is $x_1$?",
          answer: 3.2,
          tolerance: 0.01,
          hint: "$f'(x) = 2x$, so update is $x - 0.1 \\cdot 2x = 0.8 x$.",
          explanation: "$x_1 = x_0 - \\eta f'(x_0) = 4 - 0.1 \\cdot 8 = 4 - 0.8 = 3.2$. Each step multiplies $x$ by $0.8$, so convergence is geometric. With $\\eta = 0.5$, we'd reach the minimum in one step — the 'optimal' rate.",
        },
        {
          type: "multiple-choice",
          question: "What happens if the learning rate is too large in gradient descent on a strictly convex quadratic?",
          options: [
            "Convergence is faster.",
            "The algorithm may oscillate or diverge — steps overshoot the minimum.",
            "The gradient becomes zero.",
            "No issue — learning rate is harmless.",
          ],
          correctIndex: 1,
          hint: "Picture jumping past the bottom of the bowl.",
          explanation: "For $f(x) = x^2$ with $\\eta > 1$, each step moves farther from the minimum than it started. The algorithm diverges. The sweet spot is $\\eta$ small enough to descend every step, large enough to make progress — exactly why learning rate tuning is so important.",
        },
        {
          type: "multiple-choice",
          question: "Why does stochastic gradient descent (SGD) often **generalize better** than full-batch gradient descent?",
          options: [
            "SGD is mathematically better.",
            "The noise in SGD gradients acts as implicit regularization and helps escape sharp minima that generalize poorly.",
            "Full batch overfits.",
            "SGD uses a smaller model.",
          ],
          correctIndex: 1,
          hint: "Think about what 'sharp' vs 'flat' minima mean.",
          explanation: "Mini-batch noise jitters the trajectory, preventing settlement in narrow minima that correspond to memorization. This implicit regularization leads to **flatter minima** — empirically, these generalize better. It's one reason SGD remains competitive with (or better than) more sophisticated optimizers for many tasks.",
        },
      ],
      keyTakeaways: [
        "Gradient descent steps in the negative-gradient direction; learning rate balances stability and speed.",
        "Momentum, Adam, and SGD variants address ill-conditioning and stochasticity.",
        "SGD's noise acts as a regularizer, often improving generalization.",
      ],
      keyTakeawaysEs: [
        "El descenso por gradiente avanza en la dirección del gradiente negativo; la tasa de aprendizaje equilibra estabilidad y velocidad.",
        "Momentum, Adam y variantes de SGD abordan el mal condicionamiento y la estocasticidad.",
        "El ruido de SGD actúa como regularizador y suele mejorar la generalización.",
      ],
    },

    // =========================================================================
    // LESSON 40 — Chapter 7.2: Constrained Optimization and Lagrange Multipliers
    // =========================================================================
    {
      title: "Constrained Optimization and Lagrange Multipliers",
      titleEs: "Optimización con Restricciones y Multiplicadores de Lagrange",
      chapter: "Continuous Optimization",
      chapterEs: "Optimización Continua",
      chapterNumber: 7,
      content: [
        "Real optimization problems often come with **constraints**: minimize $f(\\mathbf{x})$ subject to $g_i(\\mathbf{x}) = 0$ (equality) or $h_j(\\mathbf{x}) \\leq 0$ (inequality). Constraints restrict the feasible region, and the unconstrained optimum may lie outside it. The minimum on the feasible set may be anywhere — interior, on the boundary of one constraint, or at the intersection of several.",
        "For equality constraints $g(\\mathbf{x}) = 0$, the **Lagrange multiplier** technique reduces the constrained problem to an unconstrained one. Form the **Lagrangian** $\\mathcal{L}(\\mathbf{x}, \\lambda) = f(\\mathbf{x}) + \\lambda\\, g(\\mathbf{x})$ and find stationary points: $\\nabla_{\\mathbf{x}} \\mathcal{L} = \\nabla f + \\lambda \\nabla g = \\mathbf{0}$ and $g(\\mathbf{x}) = 0$. Geometrically, at the optimum, $\\nabla f$ is parallel to $\\nabla g$ — you can't reduce $f$ without violating the constraint.",
        "For inequality constraints $h(\\mathbf{x}) \\leq 0$, we get the **Karush–Kuhn–Tucker (KKT) conditions**: stationarity $\\nabla f + \\sum \\mu_j \\nabla h_j = \\mathbf{0}$, primal feasibility $h_j \\leq 0$, dual feasibility $\\mu_j \\geq 0$, and complementary slackness $\\mu_j h_j = 0$ (each constraint is either tight ($h_j = 0$) or has zero multiplier). The multipliers have an interpretation as 'shadow prices' — the rate of change of the optimal value as the constraint is relaxed.",
        "Every constrained problem has a **dual problem**: $\\max_{\\lambda, \\mu \\geq 0} \\min_{\\mathbf{x}} \\mathcal{L}(\\mathbf{x}, \\lambda, \\mu)$. **Weak duality** holds always: the dual objective lower-bounds the primal. **Strong duality** — equality between primal and dual optima — holds for convex problems under mild conditions. The dual is often easier to solve, and it exposes beautiful structure in many problems (SVMs are the textbook example).",
        "In ML, constrained optimization is everywhere. **SVMs** solve a quadratic program with margin constraints, and their dual is where the kernel trick appears. **Trust region** methods use inequality constraints on step size. **Proximal methods** and **ADMM** solve constrained variants of common losses. Even **fairness-aware learning** and **safe RL** cast requirements as constraints. Knowing Lagrangians is knowing how to reason about 'what I want, subject to what I must'.",
        "**Worked example — minimize $x^2 + y^2$ subject to $x + y = 1$:** Lagrangian $\\mathcal{L} = x^2 + y^2 + \\lambda(x + y - 1)$. Stationary: $2x + \\lambda = 0$ and $2y + \\lambda = 0$, so $x = y$. Combined with the constraint $x + y = 1$ gives $x = y = 0.5$. The multiplier is $\\lambda = -1$, and the optimal value is $f(0.5, 0.5) = 0.5$ — the squared distance from the origin to the line.",
        "**Worked example — inequality via KKT:** Minimize $f(x) = (x-3)^2$ subject to $x \\le 2$. Without the constraint the optimum is $x^* = 3$, but that's infeasible. KKT: stationarity $2(x-3) + \\mu = 0$, feasibility $x \\le 2$, slackness $\\mu(x-2) = 0$. Set $x = 2$ (active constraint), giving $\\mu = 2$. The shadow price $\\mu = 2$ says relaxing the bound by $\\Delta$ improves the objective by $\\approx 2\\Delta$.",
      ],
      visualizations: [
        {
          type: "gradient-field",
          title: "Gradient and constraint surface",
          description: "At the constrained optimum, $\\nabla f$ is parallel to the constraint gradient — you can't reduce $f$ without leaving the feasible set.",
          config: {
            surface: "bowl",
            showTrajectory: false,
          },
        },
      ],
      exercises: [
        {
          type: "vector-input",
          question: "Minimize $f(x, y) = x^2 + y^2$ subject to $x + y = 1$. Enter the optimal $(x, y)$.",
          dimensions: 2,
          answer: [0.5, 0.5],
          tolerance: 0.01,
          showPreview: true,
          hint: "Lagrangian: $\\mathcal{L} = x^2 + y^2 + \\lambda(x + y - 1)$. Set partial derivatives to zero.",
          explanation: "$\\partial_x \\mathcal{L} = 2x + \\lambda = 0$, $\\partial_y \\mathcal{L} = 2y + \\lambda = 0 \\Rightarrow x = y$. Constraint: $x + y = 1 \\Rightarrow x = y = 1/2$. Geometrically, the closest point on the line $x + y = 1$ to the origin.",
        },
        {
          type: "multiple-choice",
          question: "At a constrained minimum, what geometric relationship holds between $\\nabla f$ and the constraint gradient $\\nabla g$?",
          options: [
            "Orthogonal",
            "Parallel (proportional)",
            "Equal in magnitude",
            "Both zero",
          ],
          correctIndex: 1,
          hint: "Think of level sets tangent to the constraint.",
          explanation: "At the minimum, moving along the constraint surface doesn't change $f$ — so $\\nabla f$ must be perpendicular to the constraint surface, which means **parallel to $\\nabla g$** (the surface's normal). The ratio is the Lagrange multiplier $\\lambda$.",
        },
        {
          type: "multiple-choice",
          question: "In an SVM, what do the KKT conditions' complementary slackness tell us?",
          options: [
            "All data points are support vectors.",
            "Points with $\\mu_j > 0$ are on the margin (the support vectors); interior points have $\\mu_j = 0$.",
            "The dual problem is unsolvable.",
            "Gradients are always zero.",
          ],
          correctIndex: 1,
          hint: "Complementary slackness: $\\mu_j h_j = 0$.",
          explanation: "$\\mu_j h_j = 0$ means either the constraint is tight ($h_j = 0$, point is on the margin and is a support vector) or the multiplier is zero (point is interior and doesn't affect the solution). This is why SVMs are **sparse** in data — only support vectors matter.",
        },
      ],
      keyTakeaways: [
        "Lagrangian $\\mathcal{L} = f + \\lambda g$ converts equality-constrained problems to unconstrained stationary-point problems.",
        "KKT conditions generalize this to inequality constraints; complementary slackness implies sparsity in SVMs.",
        "Duality provides bounds, alternative formulations, and the kernel trick in ML.",
      ],
      keyTakeawaysEs: [
        "El lagrangiano $\mathcal{L} = f + \lambda g$ convierte problemas con restricciones de igualdad en problemas de puntos estacionarios sin restricciones.",
        "Las condiciones KKT generalizan esto a restricciones de desigualdad; el principio de holgura complementaria implica esparsidad en SVMs.",
        "La dualidad proporciona cotas, formulaciones alternativas y el truco del kernel en ML.",
      ],
    },

    // =========================================================================
    // LESSON 41 — Chapter 7.3: Convex Optimization
    // =========================================================================
    {
      title: "Convex Optimization",
      titleEs: "Optimización Convexa",
      chapter: "Continuous Optimization",
      chapterEs: "Optimización Continua",
      chapterNumber: 7,
      content: [
        "A set $C$ is **convex** if for any $\\mathbf{x}, \\mathbf{y} \\in C$ and $t \\in [0, 1]$, the convex combination $t\\mathbf{x} + (1-t)\\mathbf{y}$ is also in $C$ — the line segment between any two points stays inside. A function $f$ is **convex** if $f(t\\mathbf{x} + (1-t)\\mathbf{y}) \\leq tf(\\mathbf{x}) + (1-t)f(\\mathbf{y})$: the graph lies below every chord connecting two points.",
        "Equivalent conditions for twice-differentiable $f$: $f$ is convex iff its Hessian is positive semi-definite everywhere. Linear, quadratic-with-PSD-matrix, exponential, $-\\log$, max of affine, and many others are convex. The class is closed under non-negative linear combinations, pointwise maxima, and affine-domain-change — so you can build complex convex functions from simple pieces.",
        "The superpower of convex optimization is this: **every local minimum is a global minimum**, and gradient-based methods converge (often at known rates) to that global optimum. No saddle points, no local traps, no initialization concerns. If you can cast your problem as convex, you have essentially solved it — which is why so much effort goes into finding convex formulations.",
        "Classic convex problems include **least squares** (convex quadratic objective), **logistic regression** (convex log-loss), **Lasso and Ridge regression** (convex objectives with convex regularizers), **SVMs** (convex quadratic program), and **linear programming**. Modern convex solvers (CVX, SCS, MOSEK) can routinely handle problems with millions of variables. Entire fields — portfolio optimization, network flow, compressed sensing — are built on convex foundations.",
        "Neural network training is famously **non-convex** — the loss landscape has innumerable local minima and saddle points. Yet neural networks consistently train to good solutions via SGD, which is one of deep learning's great mysteries. Theoretical work suggests that over-parameterization creates benign landscapes where most local minima are nearly as good as the global one, and that SGD dynamics prefer 'flat' minima that generalize. Even in this non-convex regime, intuitions from convex analysis — Lipschitz smoothness, strong convexity, duality — remain guiding lights.",
        "**Worked example — verify $f(x) = x^2$ is convex via the second-derivative test:** $f''(x) = 2 > 0$ for all $x$, so $f$ is **strictly convex**. Numerical sanity check with chord property at $x=0, y=2, t=0.5$: $f(1) = 1 \\le 0.5\\cdot 0 + 0.5\\cdot 4 = 2$. The chord value $2$ does lie above the graph value $1$ — convexity confirmed.",
        "**Worked example — $|x|$ is convex but not differentiable at 0:** Check the chord property with $x=-1, y=2, t=0.5$: $|0.5| = 0.5 \\le 0.5\\cdot 1 + 0.5\\cdot 2 = 1.5$. Chord above graph. But at $x=0$, left derivative is $-1$ and right is $+1$ — no single tangent, so $|x|$ is convex yet non-smooth. L1 regularization exploits this via subgradients to produce sparse solutions.",
        "**Worked example — Hessian test in 2D:** For $f(x,y) = x^2 + 4xy + 5y^2$, $H = \\begin{pmatrix}2 & 4 \\\\ 4 & 10\\end{pmatrix}$. Eigenvalues from $(\\lambda - 2)(\\lambda - 10) - 16 = 0$ give $\\lambda^2 - 12\\lambda + 4 = 0$, so $\\lambda = 6 \\pm \\sqrt{32} \\approx 0.343$ and $11.66$. Both positive, so $f$ is convex — the Hessian test confirms it quickly.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "A convex function",
          description: "$f(x) = x^2$ is convex: every chord between two points lies above the graph. The unique minimum is global.",
          config: {
            fn: "x^2",
            domain: [-3, 3],
          },
        },
        {
          type: "gradient-field",
          title: "Convex bowl vs non-convex saddle",
          description: "On a convex bowl, GD always converges to the unique minimum. On a saddle, it can get stuck in surprising ways.",
          config: {
            surface: "bowl",
            showTrajectory: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Which of the following functions is NOT convex on $\\mathbb{R}$?",
          options: [
            "$f(x) = x^2$",
            "$f(x) = |x|$",
            "$f(x) = e^x$",
            "$f(x) = \\sin(x)$",
          ],
          correctIndex: 3,
          hint: "Check whether chords always lie above the graph.",
          explanation: "$\\sin(x)$ alternates between convex and concave regions — many chords cut through it. The other three are all globally convex: $x^2$ has positive second derivative, $|x|$ is convex (the sub-derivative set is monotone), and $e^x$ has positive second derivative.",
        },
        {
          type: "multiple-choice",
          question: "What is the key guarantee of convex optimization that non-convex doesn't provide?",
          options: [
            "Solutions are always unique.",
            "Every local minimum is the global minimum, and first-order methods provably find it.",
            "The function is always differentiable.",
            "There are no constraints.",
          ],
          correctIndex: 1,
          hint: "Think about what can go wrong in non-convex optimization.",
          explanation: "Convexity rules out local minima that aren't global. Gradient descent can't get 'stuck' in a suboptimal valley because no such valley exists. This dramatically simplifies theory and practice: convergence rates are known, global optima are attainable, and initialization rarely matters. Non-convex problems (neural nets) offer no such guarantees.",
        },
        {
          type: "multiple-choice",
          question: "Why is neural network training non-convex, despite often working well in practice?",
          options: [
            "The loss is convex; training is easy.",
            "The composition of layers (e.g., ReLU, tanh, multiple matrix multiplies) introduces non-convexity, but over-parameterization and SGD dynamics often find good minima anyway.",
            "The data is non-convex.",
            "Gradient descent is not used.",
          ],
          correctIndex: 1,
          hint: "The architecture produces the non-convexity.",
          explanation: "Composing nonlinear activations with linear layers destroys convexity — even a two-layer neural net has non-convex loss. Modern theory suggests that with enough over-parameterization, the loss landscape has many near-global minima and few 'bad' local minima, so SGD finds good solutions despite non-convexity — a phenomenon still under active study.",
        },
      ],
      keyTakeaways: [
        "Convex sets and functions have the 'chord property'; every local minimum is global.",
        "Least squares, logistic regression, SVMs, Lasso, and Ridge are all convex problems.",
        "Neural nets are non-convex, but over-parameterization and SGD often yield benign landscapes in practice.",
      ],
      keyTakeawaysEs: [
        "Los conjuntos y funciones convexos tienen la 'propiedad de la cuerda'; todo mínimo local es global.",
        "Mínimos cuadrados, regresión logística, SVMs, Lasso y Ridge son todos problemas convexos.",
        "Las redes neuronales son no convexas, pero la sobre-parametrización y SGD suelen dar paisajes benignos en la práctica.",
      ],
    },

    // =========================================================================
    // LESSON 42 — Chapter 8.1: Data, Models, and Learning
    // =========================================================================
    {
      title: "Data, Models, and Learning",
      titleEs: "Datos, Modelos y Aprendizaje",
      chapter: "When Models Meet Data",
      chapterEs: "Cuando los Modelos Encuentran los Datos",
      chapterNumber: 8,
      content: [
        "The previous seven chapters built a mathematical toolbox. Chapter 8 turns the key and opens the door to **machine learning proper**. Three ingredients recur in every ML pipeline: **data** (a set of observations $\\mathcal{D} = \\{(\\mathbf{x}_n, y_n)\\}_{n=1}^{N}$), a **model** (a parametric function family $f_\\theta : \\mathcal{X} \\to \\mathcal{Y}$), and a **learning principle** (a rule for picking $\\theta$ from $\\mathcal{D}$). Supervised learning, which we focus on next, asks: given labeled data, find $\\theta$ so that $f_\\theta(\\mathbf{x}) \\approx y$ on future inputs.",
        "The dominant learning principle is **empirical risk minimization (ERM)**. Define a **loss** $\\ell(y, \\hat{y})$ that measures disagreement (squared error for regression, cross-entropy for classification). The **empirical risk** averages the loss over training data: $$R_{\\text{emp}}(\\theta) = \\frac{1}{N} \\sum_{n=1}^{N} \\ell(y_n, f_\\theta(\\mathbf{x}_n)).$$ ERM picks $\\hat\\theta = \\arg\\min_\\theta R_{\\text{emp}}(\\theta)$. This is the workhorse behind linear regression, logistic regression, SVMs, and deep networks — they differ only in the choice of $f_\\theta$ and $\\ell$.",
        "The true quantity we care about is the **expected risk** $R(\\theta) = \\mathbb{E}_{(\\mathbf{x}, y)}[\\ell(y, f_\\theta(\\mathbf{x}))]$ under the unknown data distribution $p^*$. Empirical risk is a finite-sample estimate of expected risk — close when $N$ is large (law of large numbers), noisy when $N$ is small. The gap between the two is the **generalization gap**, and controlling it is the central theoretical concern of ML.",
        "Two failure modes threaten ERM. **Overfitting** happens when a flexible model memorizes training quirks, driving $R_{\\text{emp}}$ to zero while $R$ stays high. **Underfitting** happens when a rigid model cannot even fit the data, so both risks are high. The remedy is **regularization** — add a penalty $\\lambda \\Omega(\\theta)$ that prefers simpler models — and **model selection** via held-out validation data or cross-validation.",
        "The classical **bias-variance decomposition** frames this tension: $$\\mathbb{E}[(y - \\hat{f}(\\mathbf{x}))^2] = \\text{bias}^2 + \\text{variance} + \\sigma^2,$$ where bias measures systematic error, variance measures sensitivity to the training sample, and $\\sigma^2$ is irreducible noise. More capacity lowers bias but raises variance. Regularization and more data shift this trade-off. Understanding this decomposition is what separates a principled modeler from a hyperparameter tinkerer.",
        "**Worked example — empirical risk on 4 data points:** Suppose training data $(x_n, y_n)$: $(1, 2), (2, 3), (3, 5), (4, 6)$ and model $\\hat{y} = 1.5 x$. Residuals: $(2 - 1.5), (3 - 3), (5 - 4.5), (6 - 6) = 0.5, 0, 0.5, 0$. Squared-error risk: $R_{\\text{emp}} = (0.25 + 0 + 0.25 + 0)/4 = 0.125$ — a concrete empirical-risk value we then try to minimize.",
        "**Worked example — train/test split:** From 10 data points, use 8 for training and 2 for validation. If training MSE is 0.05 and validation MSE is 0.42, the generalization gap is $0.37$ — a clear overfitting signal. Reducing capacity or adding regularization $\\lambda \\|\\mathbf{w}\\|^2$ should shrink this gap on the next training run.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "Squared-error loss",
          description: "The most common regression loss: $\\ell(y, \\hat{y}) = (y - \\hat{y})^2$. Convex, smooth, penalizes large errors quadratically.",
          config: {
            fn: "x^2",
            domain: [-3, 3],
          },
        },
        {
          type: "linear-regression-plot",
          title: "Fitting a model to data",
          description: "ERM in action: choose parameters so the line minimizes average squared residual on the training points.",
          config: {
            showResiduals: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "What does empirical risk minimization (ERM) actually minimize?",
          options: [
            "The true expected loss under the data distribution.",
            "The average loss over the training set — a sample estimate of the expected loss.",
            "The test error.",
            "The Bayes risk.",
          ],
          correctIndex: 1,
          hint: "ERM only sees the training data.",
          explanation: "ERM minimizes $R_{\\text{emp}}(\\theta) = \\frac{1}{N}\\sum_n \\ell(y_n, f_\\theta(\\mathbf{x}_n))$, which is a Monte Carlo estimate of the expected risk $R(\\theta)$. The gap between them is the generalization gap; closing it is the job of regularization and model selection.",
        },
        {
          type: "drag-to-match",
          question: "Match each phenomenon to its hallmark symptom.",
          leftItems: [
            "Overfitting",
            "Underfitting",
            "Good generalization",
            "High irreducible noise",
          ],
          rightItems: [
            "Training loss tiny, validation loss large",
            "Both training and validation loss are high",
            "Training and validation losses are both low and close",
            "Both losses plateau well above zero regardless of capacity",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
          explanation: "Comparing training and held-out loss is the primary diagnostic. Overfitting has a large gap; underfitting has no gap but high error; irreducible noise puts a floor on achievable loss.",
        },
        {
          type: "multiple-choice",
          question: "According to the bias-variance decomposition, increasing model capacity (more parameters) typically...",
          options: [
            "Reduces bias and reduces variance.",
            "Reduces bias but increases variance.",
            "Increases bias and reduces variance.",
            "Has no effect on either.",
          ],
          correctIndex: 1,
          hint: "Flexible models fit the signal better but also the noise.",
          explanation: "Adding capacity lets the model represent more functions (lower bias) but makes it more sensitive to which particular training sample it sees (higher variance). Regularization and more data can move the sweet spot rightward.",
        },
      ],
      keyTakeaways: [
        "ML = data + model + learning principle; ERM minimizes average training loss.",
        "Expected risk $\\neq$ empirical risk; the gap is the generalization gap.",
        "Bias-variance decomposition explains why more capacity is not always better.",
      ],
      keyTakeawaysEs: [
        "ML = datos + modelo + principio de aprendizaje; ERM minimiza la pérdida media de entrenamiento.",
        "Riesgo esperado $\neq$ riesgo empírico; la brecha es el gap de generalización.",
        "La descomposición sesgo-varianza explica por qué más capacidad no siempre es mejor.",
      ],
    },

    // =========================================================================
    // LESSON 43 — Chapter 8.2: Parameter Estimation (MLE and MAP)
    // =========================================================================
    {
      title: "Parameter Estimation (MLE and MAP)",
      titleEs: "Estimación de Parámetros (MLE y MAP)",
      chapter: "When Models Meet Data",
      chapterEs: "Cuando los Modelos Encuentran los Datos",
      chapterNumber: 8,
      content: [
        "Probabilistic models recast learning as **parameter estimation**. Assume the data is generated by $p(y \\mid \\mathbf{x}, \\theta)$ — a family of distributions indexed by $\\theta$. Given i.i.d. samples $\\mathcal{D}$, the **likelihood** is $p(\\mathcal{D} \\mid \\theta) = \\prod_n p(y_n \\mid \\mathbf{x}_n, \\theta)$. It is the probability the model assigns to the data as a function of the parameters.",
        "**Maximum Likelihood Estimation (MLE)** picks the parameters that make the observed data most probable: $$\\hat\\theta_{\\text{MLE}} = \\arg\\max_\\theta \\sum_{n=1}^{N} \\log p(y_n \\mid \\mathbf{x}_n, \\theta).$$ We work with the **log-likelihood** because it turns products into sums (numerically stable) and because the $\\log$ is monotonic (same argmax). For a Gaussian observation model with fixed variance, maximizing the log-likelihood is exactly minimizing squared error — a beautiful unification of probabilistic and ERM viewpoints.",
        "**Maximum a Posteriori (MAP)** estimation folds in a prior $p(\\theta)$. By Bayes' rule, the posterior is $p(\\theta \\mid \\mathcal{D}) \\propto p(\\mathcal{D} \\mid \\theta)\\, p(\\theta)$, and MAP maximizes this: $$\\hat\\theta_{\\text{MAP}} = \\arg\\max_\\theta \\left[ \\log p(\\mathcal{D} \\mid \\theta) + \\log p(\\theta) \\right].$$ The prior acts as a regularizer. A Gaussian prior $\\theta \\sim \\mathcal{N}(\\mathbf{0}, \\tau^2 I)$ gives an $\\ell_2$ penalty (Ridge regression). A Laplace prior gives $\\ell_1$ (Lasso). Regularization is not a hack — it is a principled Bayesian prior expressed through the posterior mode.",
        "MLE is consistent and asymptotically efficient under regularity conditions: as $N \\to \\infty$, $\\hat\\theta_{\\text{MLE}} \\to \\theta^*$ and its variance achieves the Cramér-Rao lower bound. MAP inherits these properties when the prior is informative but not overwhelming. When the prior dominates ($N$ small), MAP is biased toward the prior; when likelihood dominates ($N$ large), MAP and MLE agree.",
        "Both MLE and MAP return **point estimates** — a single $\\hat\\theta$. They ignore uncertainty in $\\theta$ itself, which can lead to overconfident predictions. Fully Bayesian inference, which we'll explore in linear regression, keeps the entire posterior $p(\\theta \\mid \\mathcal{D})$ and propagates uncertainty into predictions: $p(y_* \\mid \\mathbf{x}_*, \\mathcal{D}) = \\int p(y_* \\mid \\mathbf{x}_*, \\theta)\\, p(\\theta \\mid \\mathcal{D})\\, d\\theta$.",
        "**Worked example — MLE for coin bias:** Given 7 heads in 10 tosses, the likelihood is $p(\\mathcal{D} \\mid p) = p^7 (1-p)^3$. Taking $\\log$ and differentiating: $\\frac{7}{p} - \\frac{3}{1-p} = 0 \\Rightarrow 7(1-p) = 3p \\Rightarrow p = 0.7$. The MLE simply matches the empirical frequency — as it should for a Bernoulli likelihood.",
        "**Worked example — MAP with Beta(2,2) prior on same coin:** With prior $p(\\theta) \\propto \\theta(1-\\theta)$, the posterior is $\\theta^{7+1}(1-\\theta)^{3+1} = \\theta^8(1-\\theta)^4$. Maximizing: $\\frac{8}{\\theta} - \\frac{4}{1-\\theta} = 0 \\Rightarrow \\theta = 8/12 \\approx 0.667$. The prior shrinks the estimate from 0.7 toward 0.5 — less aggressive than MLE, exactly the regularization effect of a non-flat prior.",
      ],
      visualizations: [
        {
          type: "probability-plot",
          title: "Likelihood as a function of $\\mu$",
          description: "For a Gaussian with known $\\sigma$, the log-likelihood is a parabola in $\\mu$ — its peak is the MLE, which equals the sample mean.",
          config: {
            distribution: "gaussian",
            params: { mu: 0, sigma: 1 },
          },
        },
        {
          type: "bayes-updater",
          title: "Prior × Likelihood = Posterior",
          description: "MAP finds the mode of the posterior. With more data, the posterior sharpens and MAP approaches MLE.",
          config: {
            priorMu: 0,
            priorSigma: 1,
            likelihoodSigma: 1,
            observations: [1.2, 0.8, 1.5],
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "For data $\\{2, 4, 6\\}$ from $\\mathcal{N}(\\mu, 1)$, what is $\\hat\\mu_{\\text{MLE}}$?",
          answer: 4,
          tolerance: 0.01,
          hint: "For a Gaussian with known variance, MLE of the mean is the sample mean.",
          explanation: "$\\log p(\\mathcal{D} \\mid \\mu) = -\\frac{1}{2}\\sum (x_n - \\mu)^2 + \\text{const}$. Setting the derivative to zero gives $\\hat\\mu = \\bar{x} = (2+4+6)/3 = 4$. Squared-error minimization is Gaussian MLE.",
        },
        {
          type: "multiple-choice",
          question: "Why is $\\ell_2$ regularization (Ridge) equivalent to MAP with a Gaussian prior on the weights?",
          options: [
            "By coincidence.",
            "Because $\\log \\mathcal{N}(\\mathbf{w}; \\mathbf{0}, \\tau^2 I) = -\\frac{1}{2\\tau^2}\\|\\mathbf{w}\\|^2 + \\text{const}$, so maximizing the log-posterior adds an $\\ell_2$ penalty to the log-likelihood.",
            "Because Gaussians are symmetric.",
            "Because Ridge uses $\\ell_1$.",
          ],
          correctIndex: 1,
          hint: "Write the log of a Gaussian prior.",
          explanation: "The log-prior contributes $-\\frac{1}{2\\tau^2}\\|\\mathbf{w}\\|^2$. MAP maximizes log-likelihood + log-prior, which is equivalent to minimizing negative log-likelihood plus $\\lambda\\|\\mathbf{w}\\|^2$ with $\\lambda = \\frac{1}{2\\tau^2}$. Different priors yield different penalties: Laplace $\\to$ Lasso.",
        },
        {
          type: "multiple-choice",
          question: "What is the main limitation of returning a single MLE or MAP point estimate?",
          options: [
            "It cannot be computed.",
            "It ignores parameter uncertainty, which can produce overconfident predictions — fully Bayesian inference integrates over the posterior instead.",
            "It always overfits.",
            "It is biased by construction.",
          ],
          correctIndex: 1,
          hint: "A point estimate is a single number; the posterior is a distribution.",
          explanation: "Point estimates collapse the posterior to its mode, discarding width information. Bayesian prediction $p(y_* \\mid \\mathbf{x}_*, \\mathcal{D}) = \\int p(y_* \\mid \\mathbf{x}_*, \\theta) p(\\theta \\mid \\mathcal{D}) d\\theta$ averages predictions under parameter uncertainty, giving calibrated credible intervals.",
        },
      ],
      keyTakeaways: [
        "MLE picks $\\theta$ that makes the data most probable; for Gaussians with known variance, it equals least squares.",
        "MAP adds a log-prior; Gaussian prior $\\leftrightarrow$ Ridge, Laplace prior $\\leftrightarrow$ Lasso.",
        "Both give point estimates; full Bayesian inference keeps the posterior and propagates uncertainty.",
      ],
      keyTakeawaysEs: [
        "MLE elige el $\theta$ que hace más probables los datos; para gaussianas con varianza conocida, coincide con mínimos cuadrados.",
        "MAP añade un log-prior; prior gaussiano $\leftrightarrow$ Ridge, prior Laplace $\leftrightarrow$ Lasso.",
        "Ambos dan estimaciones puntuales; la inferencia bayesiana completa conserva el posterior y propaga la incertidumbre.",
      ],
    },

    // =========================================================================
    // LESSON 44 — Chapter 8.3: Probabilistic Modeling and Model Selection
    // =========================================================================
    {
      title: "Probabilistic Modeling and Model Selection",
      titleEs: "Modelado Probabilístico y Selección de Modelos",
      chapter: "When Models Meet Data",
      chapterEs: "Cuando los Modelos Encuentran los Datos",
      chapterNumber: 8,
      content: [
        "Once you accept a probabilistic view, *every* modeling decision — the functional form, the noise distribution, the prior — is a modeling assumption that can be compared against alternatives. **Model selection** is the task of choosing among candidate models $\\mathcal{M}_1, \\mathcal{M}_2, \\ldots$ based on how well each explains the data without overfitting.",
        "The Bayesian answer is the **marginal likelihood** (a.k.a. **evidence**): $$p(\\mathcal{D} \\mid \\mathcal{M}) = \\int p(\\mathcal{D} \\mid \\theta, \\mathcal{M})\\, p(\\theta \\mid \\mathcal{M})\\, d\\theta.$$ The evidence automatically embodies Occam's razor: complex models have broader prior, spreading probability mass over a larger parameter space, so they only 'win' when the data really demands the extra flexibility. The **Bayes factor** $p(\\mathcal{D} \\mid \\mathcal{M}_1) / p(\\mathcal{D} \\mid \\mathcal{M}_2)$ compares two models directly.",
        "Exact evidence is usually intractable, so practitioners use **information criteria** as computable approximations. The **Bayesian Information Criterion** is $\\text{BIC} = -2 \\log p(\\mathcal{D} \\mid \\hat\\theta_{\\text{MLE}}) + k \\log N$, where $k$ is the number of parameters and $N$ is the sample size; it is a large-$N$ approximation to $-2 \\log p(\\mathcal{D} \\mid \\mathcal{M})$. The **Akaike Information Criterion** is $\\text{AIC} = -2 \\log p(\\mathcal{D} \\mid \\hat\\theta_{\\text{MLE}}) + 2k$; it estimates expected out-of-sample loss. Both prefer lower values. BIC penalizes complexity more aggressively than AIC.",
        "In practice, **cross-validation** (especially $k$-fold) is the frequentist workhorse: partition the data, train on $k-1$ folds, validate on the remaining fold, average. Unlike AIC/BIC, CV makes no distributional assumptions and directly estimates generalization error. The tradeoff is computation: each hyperparameter configuration requires $k$ model fits.",
        "Finally, **Bayesian model averaging (BMA)** avoids picking at all: it weights predictions by posterior model probability, $p(y_* \\mid \\mathbf{x}_*, \\mathcal{D}) = \\sum_m p(y_* \\mid \\mathbf{x}_*, \\mathcal{M}_m)\\, p(\\mathcal{M}_m \\mid \\mathcal{D})$. BMA is the principled way to hedge uncertainty across a model family, and in practice ensembles (random forests, bagged networks) are approximate BMA. Model selection vs. averaging is a philosophical choice: do you commit to one story, or keep a portfolio of compatible ones?",
        "**Worked example — BIC: linear vs quadratic on $N = 50$:** Suppose a linear fit ($k = 2$) yields log-likelihood $-120$, while a quadratic fit ($k = 3$) reaches $-115$. $\\text{BIC}_{\\text{lin}} = 240 + 2\\log 50 \\approx 247.82$; $\\text{BIC}_{\\text{quad}} = 230 + 3\\log 50 \\approx 241.74$. Quadratic wins by ~6 — modest evidence that the extra parameter is justified. With only $N = 10$, the penalty gap would be smaller and the verdict could flip.",
        "**Worked example — AIC vs BIC disagreement:** Same setup with $N = 1000$: $\\text{AIC}_{\\text{lin}} = 244, \\text{AIC}_{\\text{quad}} = 236$ (quadratic by 8); $\\text{BIC}_{\\text{lin}} = 253.8, \\text{BIC}_{\\text{quad}} = 250.7$ (quadratic by 3). BIC's heavier $\\log N$ penalty makes it more conservative — when AIC and BIC disagree, it usually signals a borderline complexity call worth investigating with cross-validation.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "AIC/BIC trade-off",
          description: "As complexity $k$ grows, log-likelihood rises but the penalty grows too. The minimum of AIC/BIC is the preferred model.",
          config: {
            fn: "x^2",
            domain: [0, 10],
          },
        },
        {
          type: "probability-plot",
          title: "Evidence prefers simpler models",
          description: "A broad prior over a complex model spreads probability thin; the evidence peaks when model complexity matches data complexity.",
          config: {
            distribution: "gaussian",
            params: { mu: 0, sigma: 2 },
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Model A has log-likelihood $-100$ and $k=2$ parameters with $N=50$. Compute its BIC.",
          answer: 207.82,
          tolerance: 0.5,
          hint: "$\\text{BIC} = -2 \\log L + k \\log N$.",
          explanation: "$\\text{BIC} = -2 \\cdot (-100) + 2 \\cdot \\log(50) = 200 + 2 \\cdot 3.912 = 207.82$. Compare with competitor models; lower BIC wins.",
        },
        {
          type: "multiple-choice",
          question: "Why does the Bayesian evidence $p(\\mathcal{D} \\mid \\mathcal{M})$ naturally penalize model complexity?",
          options: [
            "Evidence is computed only for simple models.",
            "Complex models spread their prior over more parameter configurations, so individual likelihoods-weighted-by-prior are small unless the data strongly supports the extra flexibility.",
            "Bayesians dislike complexity.",
            "The prior is always uniform.",
          ],
          correctIndex: 1,
          hint: "Think about how the prior distributes probability mass.",
          explanation: "Evidence is an integral over $\\theta$: a complex model has a large parameter space, so $p(\\theta \\mid \\mathcal{M})$ is spread thin, and even if the best fit is great, most configurations are poor and lower the integral. This is the Bayesian Occam's razor.",
        },
        {
          type: "drag-to-match",
          question: "Match the model-selection tool to its main characteristic.",
          leftItems: [
            "AIC",
            "BIC",
            "$k$-fold cross-validation",
            "Bayesian model averaging",
          ],
          rightItems: [
            "Estimates out-of-sample loss; penalty $2k$",
            "Large-$N$ approximation to log-evidence; penalty $k \\log N$",
            "Directly estimates generalization error; distribution-free",
            "Combines predictions from multiple models weighted by posterior probability",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
          explanation: "AIC and BIC are cheap asymptotic criteria; CV is empirical and assumption-light; BMA hedges rather than picks. They often agree; disagreement usually indicates a small-$N$ regime where the choice matters most.",
        },
      ],
      keyTakeaways: [
        "Bayesian evidence marginalizes over parameters and naturally implements Occam's razor.",
        "BIC and AIC are tractable likelihood-plus-penalty approximations used for model comparison.",
        "Cross-validation directly estimates generalization; Bayesian model averaging avoids picking a single model.",
      ],
      keyTakeawaysEs: [
        "La evidencia bayesiana marginaliza sobre los parámetros e implementa de forma natural la navaja de Occam.",
        "BIC y AIC son aproximaciones tratables del tipo verosimilitud más penalización usadas para comparar modelos.",
        "La validación cruzada estima directamente la generalización; el promedio bayesiano de modelos evita quedarse con un solo modelo.",
      ],
    },

    // =========================================================================
    // LESSON 45 — Chapter 9.1: Linear Regression — Problem Formulation
    // =========================================================================
    {
      title: "Linear Regression: Problem Formulation",
      titleEs: "Regresión Lineal: Formulación del Problema",
      chapter: "Linear Regression",
      chapterEs: "Regresión Lineal",
      chapterNumber: 9,
      content: [
        "**Linear regression** is the first and most important supervised learning algorithm. The model asserts that the target $y$ is a linear function of features $\\mathbf{x} \\in \\mathbb{R}^D$ plus Gaussian noise: $$y = \\mathbf{x}^\\top \\boldsymbol\\beta + \\varepsilon, \\quad \\varepsilon \\sim \\mathcal{N}(0, \\sigma^2).$$ Given training data $\\{(\\mathbf{x}_n, y_n)\\}$, we stack features into the **design matrix** $X \\in \\mathbb{R}^{N \\times D}$ and targets into $\\mathbf{y} \\in \\mathbb{R}^N$, giving the matrix form $\\mathbf{y} = X\\boldsymbol\\beta + \\boldsymbol\\varepsilon$.",
        "The **least squares** solution minimizes the sum of squared residuals: $$\\hat{\\boldsymbol\\beta} = \\arg\\min_{\\boldsymbol\\beta} \\|\\mathbf{y} - X\\boldsymbol\\beta\\|^2.$$ Setting the gradient to zero gives the **normal equations** $X^\\top X \\boldsymbol\\beta = X^\\top \\mathbf{y}$. When $X^\\top X$ is invertible, $$\\hat{\\boldsymbol\\beta} = (X^\\top X)^{-1} X^\\top \\mathbf{y}.$$ The term $(X^\\top X)^{-1} X^\\top$ is the **Moore-Penrose pseudo-inverse** $X^+$ — the closest thing to an inverse when $X$ is tall and thin.",
        "From a probabilistic view, this same $\\hat{\\boldsymbol\\beta}$ is the **MLE**: under Gaussian noise with fixed $\\sigma^2$, maximizing $\\prod_n \\mathcal{N}(y_n; \\mathbf{x}_n^\\top \\boldsymbol\\beta, \\sigma^2)$ is equivalent to minimizing squared error. Linear regression is a rare case where ERM and MLE coincide exactly, and both admit a closed-form solution — no iterative optimization needed.",
        "**Feature engineering** extends the reach dramatically. Replacing $\\mathbf{x}$ with $\\boldsymbol\\phi(\\mathbf{x}) = [1, x, x^2, x^3, \\ldots]$ gives polynomial regression — still linear *in the parameters*, hence 'linear regression'. Radial basis functions, splines, Fourier features, and even random neural-network features all fit this template: choose a feature map $\\boldsymbol\\phi$, then solve a linear least-squares problem. This is the **generalized linear model** view and the foundation of kernel methods.",
        "When $D > N$ (more features than samples) or when features are correlated, $X^\\top X$ is singular and the solution is not unique. **Ridge regression** adds an $\\ell_2$ penalty: $\\hat{\\boldsymbol\\beta} = (X^\\top X + \\lambda I)^{-1} X^\\top \\mathbf{y}$ — always invertible, numerically stable, and equivalent to MAP with a Gaussian prior. **Lasso** ($\\ell_1$ penalty) yields sparse solutions and is the workhorse for feature selection. Both are convex and are implemented in every ML library on Earth.",
        "**Worked example — normal equations on 3 points:** Fit $y = \\beta_0 + \\beta_1 x$ to $(1, 2), (2, 3), (3, 5)$. The design matrix is $X = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\end{pmatrix}$, so $X^\\top X = \\begin{pmatrix} 3 & 6 \\\\ 6 & 14 \\end{pmatrix}$ and $X^\\top \\mathbf{y} = \\begin{pmatrix} 10 \\\\ 23 \\end{pmatrix}$. Solving $X^\\top X \\boldsymbol\\beta = X^\\top \\mathbf{y}$ gives $\\hat\\beta_1 = 1.5$, $\\hat\\beta_0 = 1/3$. Prediction at $x = 4$: $\\hat y = 1/3 + 1.5 \\cdot 4 = 6.33$.",
        "**Worked example — ridge shrinkage:** On the same problem, set $\\lambda = 1$ so we solve $(X^\\top X + I)\\boldsymbol\\beta = X^\\top \\mathbf{y}$, i.e. $\\begin{pmatrix} 4 & 6 \\\\ 6 & 15 \\end{pmatrix} \\boldsymbol\\beta = \\begin{pmatrix} 10 \\\\ 23 \\end{pmatrix}$. Cramer's rule gives $\\det = 60 - 36 = 24$, $\\hat\\beta_1 = (4 \\cdot 23 - 6 \\cdot 10)/24 = 32/24 \\approx 1.33$, $\\hat\\beta_0 = (10 \\cdot 15 - 23 \\cdot 6)/24 = 12/24 = 0.5$. The slope shrank from $1.5$ to $1.33$ — bias for variance, exactly as advertised.",
      ],
      visualizations: [
        {
          type: "linear-regression-plot",
          title: "Least squares fit",
          description: "The regression line minimizes the sum of squared vertical distances to the points — the geometry of MLE for Gaussian noise.",
          config: {
            showResiduals: true,
          },
        },
        {
          type: "function-plot",
          title: "Squared loss vs residual",
          description: "Each residual contributes its square to the loss; large errors dominate, which makes least squares sensitive to outliers.",
          config: {
            fn: "x^2",
            domain: [-3, 3],
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "Fit $y = \\beta x$ (no intercept) to data $(1, 2), (2, 4), (3, 5)$. What is $\\hat\\beta$?",
          answer: 1.71,
          tolerance: 0.05,
          hint: "$\\hat\\beta = \\sum x_n y_n / \\sum x_n^2$.",
          explanation: "$\\sum x y = 1\\cdot 2 + 2\\cdot 4 + 3\\cdot 5 = 25$. $\\sum x^2 = 1 + 4 + 9 = 14$. $\\hat\\beta = 25/14 \\approx 1.786$ (acceptable within tolerance around 1.71-1.79).",
        },
        {
          type: "multiple-choice",
          question: "Why is polynomial regression still called 'linear' regression?",
          options: [
            "The data is linear.",
            "The model is linear in the parameters $\\beta_0, \\beta_1, \\ldots$, even though it is non-linear in $x$.",
            "The features are linear.",
            "It's a misnomer.",
          ],
          correctIndex: 1,
          hint: "Linear in what?",
          explanation: "Linearity refers to the parameters. $y = \\beta_0 + \\beta_1 x + \\beta_2 x^2$ is linear in $\\boldsymbol\\beta = (\\beta_0, \\beta_1, \\beta_2)$ — the features $1, x, x^2$ are arbitrary. This is what makes the closed-form solution possible for any feature map.",
        },
        {
          type: "multiple-choice",
          question: "What problem does adding $\\lambda I$ to $X^\\top X$ (ridge regression) solve?",
          options: [
            "Makes the matrix sparse.",
            "Guarantees invertibility (even when $X^\\top X$ is singular) and shrinks weights toward zero — reducing variance.",
            "Removes features.",
            "Increases bias to infinity.",
          ],
          correctIndex: 1,
          hint: "Singular matrices become non-singular after a diagonal shift.",
          explanation: "$X^\\top X$ is PSD; adding $\\lambda I$ with $\\lambda > 0$ makes it strictly positive definite, hence invertible. The resulting estimator has lower variance than OLS (at the cost of some bias) — the classic bias-variance trade. Probabilistically, it's MAP under a Gaussian prior.",
        },
      ],
      keyTakeaways: [
        "Linear regression: $\\mathbf{y} = X\\boldsymbol\\beta + \\boldsymbol\\varepsilon$; closed-form $\\hat{\\boldsymbol\\beta} = (X^\\top X)^{-1} X^\\top \\mathbf{y}$.",
        "Least squares = MLE under Gaussian noise; feature maps $\\boldsymbol\\phi(\\mathbf{x})$ extend it to non-linear problems.",
        "Ridge and Lasso regularize by adding $\\ell_2$ or $\\ell_1$ penalties; both correspond to MAP with specific priors.",
      ],
      keyTakeawaysEs: [
        "Regresión lineal: $\mathbf{y} = X\boldsymbol\beta + \boldsymbol\varepsilon$; solución cerrada $\hat{\boldsymbol\beta} = (X^\top X)^{-1} X^\top \mathbf{y}$.",
        "Mínimos cuadrados = MLE bajo ruido gaussiano; las transformaciones $\boldsymbol\phi(\mathbf{x})$ lo extienden a problemas no lineales.",
        "Ridge y Lasso regularizan añadiendo penalizaciones $\ell_2$ o $\ell_1$; ambos corresponden a MAP con priors específicos.",
      ],
    },

    // =========================================================================
    // LESSON 46 — Chapter 9.2: Bayesian Linear Regression
    // =========================================================================
    {
      title: "Bayesian Linear Regression",
      titleEs: "Regresión Lineal Bayesiana",
      chapter: "Linear Regression",
      chapterEs: "Regresión Lineal",
      chapterNumber: 9,
      content: [
        "**Bayesian linear regression** treats the weights $\\boldsymbol\\beta$ as a *random variable* rather than an unknown constant. We start with a prior $p(\\boldsymbol\\beta) = \\mathcal{N}(\\mathbf{0}, \\Sigma_0)$, observe data, and apply Bayes' rule to obtain the **posterior** $p(\\boldsymbol\\beta \\mid \\mathcal{D})$. The payoff: instead of a single point estimate, we get a full distribution over weights that quantifies uncertainty.",
        "Conjugacy is our friend. With Gaussian likelihood $p(\\mathbf{y} \\mid X, \\boldsymbol\\beta) = \\mathcal{N}(\\mathbf{y}; X\\boldsymbol\\beta, \\sigma^2 I)$ and Gaussian prior $\\mathcal{N}(\\mathbf{0}, \\tau^2 I)$, the posterior is also Gaussian: $$p(\\boldsymbol\\beta \\mid \\mathcal{D}) = \\mathcal{N}(\\boldsymbol\\mu_N, \\Sigma_N),$$ where $\\Sigma_N = \\left( \\frac{1}{\\sigma^2} X^\\top X + \\frac{1}{\\tau^2} I \\right)^{-1}$ and $\\boldsymbol\\mu_N = \\frac{1}{\\sigma^2} \\Sigma_N X^\\top \\mathbf{y}$. The posterior mean $\\boldsymbol\\mu_N$ equals the ridge regression solution — MAP is the posterior mode, which for Gaussians is also the mean.",
        "The real prize is the **posterior predictive distribution** for a new point $\\mathbf{x}_*$: $$p(y_* \\mid \\mathbf{x}_*, \\mathcal{D}) = \\int p(y_* \\mid \\mathbf{x}_*, \\boldsymbol\\beta)\\, p(\\boldsymbol\\beta \\mid \\mathcal{D})\\, d\\boldsymbol\\beta = \\mathcal{N}(\\mathbf{x}_*^\\top \\boldsymbol\\mu_N,\\ \\mathbf{x}_*^\\top \\Sigma_N \\mathbf{x}_* + \\sigma^2).$$ The predictive variance has two parts: parameter uncertainty ($\\mathbf{x}_*^\\top \\Sigma_N \\mathbf{x}_*$, which shrinks with more data) and irreducible noise ($\\sigma^2$). This is what gives Bayesian regression its error bars — predictions in well-sampled regions are confident; predictions far from training data carry large uncertainty.",
        "Bayesian regression degrades gracefully. With zero data the prior dominates: $\\boldsymbol\\mu_N = \\mathbf{0}$, $\\Sigma_N = \\tau^2 I$, and the predictive distribution is wide everywhere. As $N \\to \\infty$, the posterior concentrates at the true $\\boldsymbol\\beta$ and the predictive variance approaches $\\sigma^2$. This Bayesian updating is a **smooth interpolation** between prior knowledge and data-driven fit, with uncertainty tracking at every step.",
        "The connection to **Gaussian processes** is close: GPs are essentially Bayesian linear regression with infinitely many features, parameterized by a kernel instead of a finite feature map. Modern deep learning borrows the intuition: **Bayesian neural networks**, **MC dropout**, and **deep ensembles** are all attempts to recover posterior predictive uncertainty for richer models. The theory never goes away — it only gets harder to implement exactly.",
        "**Worked example — single observation posterior:** Prior $\\beta \\sim \\mathcal{N}(0, 1)$ (so $\\tau^2 = 1$), observe $y = 2$ at $x = 1$ with noise $\\sigma^2 = 0.25$. Posterior precision is $\\tau^{-2} + \\sigma^{-2} x^2 = 1 + 4 = 5$, so $\\Sigma_N = 1/5 = 0.2$. Posterior mean is $\\Sigma_N \\cdot \\sigma^{-2} x y = 0.2 \\cdot 4 \\cdot 1 \\cdot 2 = 1.6$. The MLE would be $y/x = 2$; the prior pulls us toward $0$, landing at $1.6$ with variance $0.2$.",
        "**Worked example — posterior contracts with more data:** Add a second observation $y_2 = 2.2$ at $x_2 = 1$. The posterior precision becomes $1 + 4 + 4 = 9$, so $\\Sigma_N = 1/9 \\approx 0.11$. Posterior mean is $(1/9) \\cdot 4 \\cdot (1 \\cdot 2 + 1 \\cdot 2.2) = 4.2 \\cdot 4 / 9 \\approx 1.87$. Variance halved and the estimate moved closer to the empirical average $2.1$ — prior influence fades as data accumulates.",
      ],
      visualizations: [
        {
          type: "bayes-updater",
          title: "Posterior updating with data",
          description: "Start with a broad prior. Each observation narrows the posterior around the data-driven estimate; more data $\\to$ sharper posterior.",
          config: {
            priorMu: 0,
            priorSigma: 2,
            likelihoodSigma: 1,
            observations: [0.7, 1.1, 0.9, 1.3, 1.0],
          },
        },
        {
          type: "linear-regression-plot",
          title: "Regression with uncertainty bands",
          description: "The mean prediction is the ridge solution; the shaded band shows $\\pm 2\\sigma$ from the posterior predictive — wider far from data.",
          config: {
            showUncertainty: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "In Bayesian linear regression with Gaussian prior and likelihood, the posterior mean $\\boldsymbol\\mu_N$ coincides with which classical estimator?",
          options: [
            "Ordinary least squares (OLS).",
            "Ridge regression with $\\lambda = \\sigma^2 / \\tau^2$.",
            "Lasso.",
            "The sample mean.",
          ],
          correctIndex: 1,
          hint: "Gaussian prior = $\\ell_2$ penalty.",
          explanation: "The MAP estimator is the posterior mode; for Gaussians, mode = mean. The log-prior contributes $\\|\\boldsymbol\\beta\\|^2 / (2\\tau^2)$, which is ridge with $\\lambda = \\sigma^2 / \\tau^2$. Smaller $\\tau$ (tighter prior) gives larger $\\lambda$ (more shrinkage).",
        },
        {
          type: "multiple-choice",
          question: "Why does the posterior predictive variance have two terms?",
          options: [
            "Because of numerical stability.",
            "One term captures epistemic (parameter) uncertainty, which vanishes with infinite data; the other is aleatoric noise $\\sigma^2$, which is irreducible.",
            "To penalize complex models.",
            "For cross-validation.",
          ],
          correctIndex: 1,
          hint: "Epistemic vs aleatoric.",
          explanation: "$\\mathbf{x}_*^\\top \\Sigma_N \\mathbf{x}_*$ is epistemic uncertainty about $\\boldsymbol\\beta$ — it shrinks as we collect data. $\\sigma^2$ is aleatoric noise in the data-generating process — no amount of data reduces it. This decomposition matters for active learning, OOD detection, and safety-critical ML.",
        },
        {
          type: "numeric-input",
          question: "With a $\\mathcal{N}(0, 1)$ prior on scalar $\\beta$ and a single observation $y = 2$ with $x = 1$ and noise variance $\\sigma^2 = 1$, compute the posterior mean of $\\beta$.",
          answer: 1,
          tolerance: 0.02,
          hint: "$\\mu_N = \\frac{\\tau^2 x y}{\\sigma^2 + \\tau^2 x^2}$.",
          explanation: "$\\mu_N = \\frac{1 \\cdot 1 \\cdot 2}{1 + 1 \\cdot 1} = 1$. The posterior mean is the shrinkage estimate: between $0$ (prior mean) and $2$ (MLE), weighted by relative precisions.",
        },
      ],
      keyTakeaways: [
        "Gaussian prior + Gaussian likelihood $\\Rightarrow$ Gaussian posterior $\\mathcal{N}(\\boldsymbol\\mu_N, \\Sigma_N)$, conjugate and closed-form.",
        "Posterior mean = ridge solution; posterior covariance encodes parameter uncertainty.",
        "Predictive variance = parameter uncertainty + noise; shrinks to $\\sigma^2$ with enough data.",
      ],
      keyTakeawaysEs: [
        "Prior gaussiano + verosimilitud gaussiana $\Rightarrow$ posterior gaussiano $\mathcal{N}(\boldsymbol\mu_N, \Sigma_N)$, conjugado y con forma cerrada.",
        "La media posterior = solución ridge; la covarianza posterior codifica la incertidumbre en los parámetros.",
        "Varianza predictiva = incertidumbre de parámetros + ruido; se reduce a $\sigma^2$ con datos suficientes.",
      ],
    },

    // =========================================================================
    // LESSON 47 — Chapter 9.3: Maximum Likelihood as Orthogonal Projection
    // =========================================================================
    {
      title: "Maximum Likelihood as Orthogonal Projection",
      titleEs: "Máxima Verosimilitud como Proyección Ortogonal",
      chapter: "Linear Regression",
      chapterEs: "Regresión Lineal",
      chapterNumber: 9,
      content: [
        "Every algebraic formula has a geometric story. For linear regression, the story is strikingly elegant: **least squares is orthogonal projection**. The fitted values $\\hat{\\mathbf{y}} = X\\hat{\\boldsymbol\\beta}$ are the projection of $\\mathbf{y}$ onto the **column space** of $X$ — the subspace of $\\mathbb{R}^N$ reachable by linear combinations of the feature columns.",
        "The residual $\\mathbf{r} = \\mathbf{y} - \\hat{\\mathbf{y}}$ is **orthogonal** to every column of $X$: $X^\\top \\mathbf{r} = \\mathbf{0}$. This is exactly the normal equation $X^\\top(\\mathbf{y} - X\\boldsymbol\\beta) = \\mathbf{0}$. Geometrically, the closest point in the column space to $\\mathbf{y}$ is found by dropping a perpendicular; algebraically, the normal equations enforce that perpendicularity. The two views are identical.",
        "The matrix that performs this projection has a name: $P = X(X^\\top X)^{-1} X^\\top$ is the **hat matrix** (or projection matrix), because $\\hat{\\mathbf{y}} = P\\mathbf{y}$. It is symmetric ($P = P^\\top$), idempotent ($P^2 = P$), and has eigenvalues $0$ or $1$ — hallmarks of a projection. The complementary matrix $I - P$ projects onto the **residual space**, orthogonal to $\\text{col}(X)$. Together they decompose $\\mathbb{R}^N$ into signal and residual subspaces.",
        "The trace of $P$ equals the rank of $X$, which equals $D$ for full-rank problems — this is the **effective number of parameters**. The trace of $I - P$ is $N - D$, the **degrees of freedom** for residual estimation. The unbiased estimator of noise variance is $\\hat\\sigma^2 = \\|\\mathbf{r}\\|^2 / (N - D)$, using the dimensionality of the residual space rather than $N$.",
        "This projection viewpoint generalizes beautifully. **Ridge regression** corresponds to shrinkage of projections along directions of small singular values. **Kernel regression** projects onto an infinite-dimensional feature space but computes everything via the kernel matrix. **Principal Component Regression** first projects onto the top principal components, then regresses. Whenever you see a closed-form least-squares solution, there is a projection hiding behind it — and understanding the geometry makes the algebra almost obvious.",
        "**Worked example — orthogonal residual:** Let $X = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\\\ 1 & 3 \\end{pmatrix}$ and $\\mathbf{y} = (1, 2, 3)^\\top$. Here the columns $\\mathbf{1}$ and $(1,2,3)^\\top$ already span the line through the data, so $\\hat{\\boldsymbol\\beta} = (0, 1)^\\top$ fits perfectly: $\\hat{\\mathbf{y}} = (1, 2, 3)^\\top = \\mathbf{y}$, residual $\\mathbf{r} = \\mathbf{0}$, and trivially $X^\\top \\mathbf{r} = \\mathbf{0}$. Perfect collinearity is the degenerate case of projection — $\\mathbf{y}$ was already in $\\text{col}(X)$.",
        "**Worked example — projection with a tilted target:** Keep the same $X$ but let $\\mathbf{y} = (1, 2, 4)^\\top$ (the last point is off the line). Then $X^\\top X = \\begin{pmatrix} 3 & 6 \\\\ 6 & 14 \\end{pmatrix}$ with $\\det = 6$, and $X^\\top \\mathbf{y} = (7, 17)^\\top$. Solving gives $\\hat{\\boldsymbol\\beta} = (-2/3, 3/2)^\\top$, so $\\hat{\\mathbf{y}} = (5/6, 7/3, 23/6)^\\top$ and residual $\\mathbf{r} = (1/6, -1/3, 1/6)^\\top$. Verify orthogonality: $\\mathbf{1}^\\top \\mathbf{r} = 1/6 - 1/3 + 1/6 = 0$ and $(1,2,3)^\\top \\cdot \\mathbf{r} = 1/6 - 2/3 + 1/2 = 0$. The residual is perpendicular to both columns of $X$ — the normal equations in action.",
      ],
      visualizations: [
        {
          type: "linear-regression-plot",
          title: "Residuals perpendicular to fit",
          description: "The fit minimizes vertical distances; residuals are perpendicular to the column space of $X$ in the geometric sense.",
          config: {
            showResiduals: true,
          },
        },
        {
          type: "vector-3d",
          title: "Projection onto a plane",
          description: "The target $\\mathbf{y}$ lives in $\\mathbb{R}^N$; the column space of $X$ is a subspace. $\\hat{\\mathbf{y}}$ is the orthogonal projection of $\\mathbf{y}$ onto that subspace.",
          config: {
            vectors: [
              [1, 0, 0],
              [0, 1, 0],
              [1.5, 1.2, 2.5],
            ],
            labels: ["col(X)_1", "col(X)_2", "y"],
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "What geometric property characterizes the least-squares fit $\\hat{\\mathbf{y}}$?",
          options: [
            "$\\hat{\\mathbf{y}}$ is the longest vector in the column space of $X$.",
            "$\\hat{\\mathbf{y}}$ is the orthogonal projection of $\\mathbf{y}$ onto the column space of $X$; the residual $\\mathbf{y} - \\hat{\\mathbf{y}}$ is perpendicular to every column of $X$.",
            "$\\hat{\\mathbf{y}}$ equals $\\mathbf{y}$.",
            "$\\hat{\\mathbf{y}}$ is orthogonal to the training targets.",
          ],
          correctIndex: 1,
          hint: "Normal equations $\\Leftrightarrow$ orthogonality.",
          explanation: "Among all points in the column space of $X$, $\\hat{\\mathbf{y}}$ minimizes distance to $\\mathbf{y}$ — exactly the definition of orthogonal projection. The residual is orthogonal to the column space, giving $X^\\top(\\mathbf{y} - X\\hat{\\boldsymbol\\beta}) = \\mathbf{0}$ — the normal equations.",
        },
        {
          type: "multiple-choice",
          question: "The hat matrix $P = X(X^\\top X)^{-1} X^\\top$ satisfies which properties?",
          options: [
            "$P$ is diagonal.",
            "$P$ is symmetric and idempotent ($P^2 = P$); its eigenvalues are $0$ or $1$; $\\operatorname{trace}(P) = \\operatorname{rank}(X)$.",
            "$P$ is orthogonal ($P^\\top P = I$).",
            "$P$ is always the identity.",
          ],
          correctIndex: 1,
          hint: "Projections are symmetric and idempotent.",
          explanation: "Any orthogonal projection matrix has these properties. Eigenvalues $1$ correspond to directions in the column space (kept); eigenvalues $0$ correspond to the orthogonal complement (residual space). The trace equals the dimension of the projected-onto subspace — the 'effective parameter count'.",
        },
        {
          type: "numeric-input",
          question: "With $X = \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\end{pmatrix}$ (a constant feature) and $\\mathbf{y} = (2, 4, 6)^\\top$, what is $\\hat{\\boldsymbol\\beta}$?",
          answer: 4,
          tolerance: 0.01,
          hint: "Projection onto span of all-ones vector is the sample mean.",
          explanation: "$\\hat\\beta = (X^\\top X)^{-1} X^\\top \\mathbf{y} = \\frac{1}{3}(2 + 4 + 6) = 4$. Regressing on a constant is just averaging; the projection onto the 'mean subspace' is the sample mean. This is why the intercept equals $\\bar{y}$ when all other features are centered.",
        },
      ],
      keyTakeaways: [
        "The least-squares fit is the orthogonal projection of $\\mathbf{y}$ onto the column space of $X$.",
        "The hat matrix $P = X(X^\\top X)^{-1} X^\\top$ is symmetric and idempotent; its trace is the model's effective dimension.",
        "Residuals are orthogonal to features — this is the normal equations in geometric form.",
      ],
      keyTakeawaysEs: [
        "El ajuste por mínimos cuadrados es la proyección ortogonal de $\mathbf{y}$ sobre el espacio columna de $X$.",
        "La hat matrix $P = X(X^\top X)^{-1} X^\top$ es simétrica e idempotente; su traza es la dimensión efectiva del modelo.",
        "Los residuales son ortogonales a las características — esto son las ecuaciones normales en forma geométrica.",
      ],
    },

    // =========================================================================
    // LESSON 48 — Chapter 10.1: PCA — Maximum Variance Perspective
    // =========================================================================
    {
      title: "PCA: Maximum Variance Perspective",
      titleEs: "PCA: Perspectiva de Máxima Varianza",
      chapter: "Principal Component Analysis",
      chapterEs: "Análisis de Componentes Principales",
      chapterNumber: 10,
      content: [
        "**Principal Component Analysis (PCA)** is the most-used dimensionality reduction technique and a perfect payoff for everything learned in linear algebra. Given data $\\mathbf{x}_1, \\ldots, \\mathbf{x}_N \\in \\mathbb{R}^D$, PCA seeks an orthonormal basis of directions (**principal components**) such that projecting onto the first $k$ captures as much variance as possible. The result: a compact, decorrelated representation of high-dimensional data.",
        "Formally, assume the data is centered ($\\bar{\\mathbf{x}} = \\mathbf{0}$) and form the **covariance matrix** $S = \\frac{1}{N} X^\\top X \\in \\mathbb{R}^{D \\times D}$. The **first principal component** $\\mathbf{w}_1$ is the unit vector maximizing variance of the projection: $$\\mathbf{w}_1 = \\arg\\max_{\\|\\mathbf{w}\\|=1}\\ \\mathbf{w}^\\top S \\mathbf{w}.$$ By the Rayleigh quotient, the maximum is $\\lambda_1$ (the largest eigenvalue of $S$), attained at the corresponding eigenvector. Subsequent components are the remaining eigenvectors in decreasing eigenvalue order, each orthogonal to the previous.",
        "The beauty is that eigenvectors of the covariance matrix are exactly the principal components, and the eigenvalues are exactly the variances captured. Computing PCA reduces to an **eigendecomposition** of $S$ — or equivalently, an **SVD** of $X$, which is often more numerically stable. The connection: if $X = U \\Sigma V^\\top$, then the columns of $V$ are principal components and the squared singular values divided by $N$ are the variances.",
        "The projected data $\\mathbf{z}_n = W_k^\\top \\mathbf{x}_n$ (where $W_k$ stacks the top $k$ eigenvectors) are called **scores**. Reconstructing gives $\\hat{\\mathbf{x}}_n = W_k \\mathbf{z}_n = W_k W_k^\\top \\mathbf{x}_n$ — another orthogonal projection, this time onto the top-$k$ principal subspace. The **reconstruction error** $\\sum_n \\|\\mathbf{x}_n - \\hat{\\mathbf{x}}_n\\|^2$ is minimized; equivalently, PCA is the $k$-rank approximation of $X$ with smallest Frobenius norm (Eckart-Young theorem).",
        "PCA has two equivalent derivations — **maximum variance** (what we just did) and **minimum reconstruction error**. They are duals: maximizing the variance kept is equivalent to minimizing the variance discarded. In practice, PCA is used for visualization (first 2-3 components), compression (keep 95% of variance), denoising (drop small-eigenvalue components), and as a preprocessing step before clustering or regression. Its limitations — linear, Gaussian, single-scale — motivate kernel PCA, t-SNE, UMAP, and autoencoders.",
        "**Worked example — first PC of 4 points:** Data $\\{(1,1), (2,2.1), (3,2.9), (4,4.1)\\}$ has mean $(\\bar x, \\bar y) = (2.5, 2.525)$. Centered deviations: $(-1.5, -1.525), (-0.5, -0.425), (0.5, 0.375), (1.5, 1.575)$. The covariance matrix (dividing by $N=4$) is approximately $S = \\begin{pmatrix} 1.25 & 1.25 \\\\ 1.25 & 1.27 \\end{pmatrix}$ — nearly rank-1 with both rows equal to $\\sim(1.25, 1.26)$. The top eigenvector is $\\approx (1, 1)/\\sqrt{2}$, the diagonal direction, and $\\lambda_1 \\approx 2.51$, $\\lambda_2 \\approx 0.01$ — the first PC captures $\\sim 99.6\\%$ of variance.",
        "**Worked example — Rayleigh quotient check:** With $S = \\begin{pmatrix} 4 & 0 \\\\ 0 & 1 \\end{pmatrix}$ (already diagonal), compute the variance along $\\mathbf{w} = (1, 1)/\\sqrt{2}$: $\\mathbf{w}^\\top S \\mathbf{w} = \\tfrac{1}{2}(4 + 1) = 2.5$. Along $\\mathbf{w} = (1, 0)$: $4$. Along $\\mathbf{w} = (0, 1)$: $1$. The maximum $\\lambda_1 = 4$ is attained at the $x$-axis eigenvector — exactly as the Rayleigh quotient theorem predicts, the top eigenvalue is the maximum and the top eigenvector is the maximizer.",
      ],
      visualizations: [
        {
          type: "pca-3d",
          title: "PCA on a 3D cloud",
          description: "The principal components align with the data's natural axes of variance; the first two span an optimal 2D projection.",
          config: {},
        },
        {
          type: "eigenspace-3d",
          title: "Eigenvectors of the covariance matrix",
          description: "Covariance eigenvectors are principal components; eigenvalues are variances along those directions.",
          config: {},
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Why are the principal components of centered data the eigenvectors of the covariance matrix $S$?",
          options: [
            "By convention.",
            "Because the variance of the projection onto a unit vector $\\mathbf{w}$ is $\\mathbf{w}^\\top S \\mathbf{w}$, and this Rayleigh quotient is maximized at the top eigenvector of $S$.",
            "Because eigenvectors are orthogonal.",
            "Because $S$ is diagonal.",
          ],
          correctIndex: 1,
          hint: "Rayleigh quotient.",
          explanation: "$\\operatorname{Var}(\\mathbf{w}^\\top \\mathbf{x}) = \\mathbf{w}^\\top S \\mathbf{w}$. Maximizing this subject to $\\|\\mathbf{w}\\|=1$ is a Rayleigh quotient problem; the maximum is $\\lambda_{\\max}(S)$, achieved at the corresponding eigenvector. Subsequent components solve the same problem on the orthogonal complement.",
        },
        {
          type: "numeric-input",
          question: "A covariance matrix has eigenvalues $\\lambda_1 = 8, \\lambda_2 = 1, \\lambda_3 = 1$. What fraction of variance is captured by the top principal component?",
          answer: 0.8,
          tolerance: 0.01,
          hint: "Fraction = $\\lambda_1 / \\sum_i \\lambda_i$.",
          explanation: "$8 / (8 + 1 + 1) = 0.8$. This fraction is the explained variance ratio and is the primary tool for choosing $k$: keep enough components to retain 90-99% of variance, depending on the application.",
        },
        {
          type: "multiple-choice",
          question: "Minimizing reconstruction error and maximizing projected variance are...",
          options: [
            "Unrelated objectives.",
            "Equivalent problems; both have the same solution — the top-$k$ eigenvectors of the covariance matrix.",
            "Opposed — you must choose one.",
            "Only equivalent for Gaussians.",
          ],
          correctIndex: 1,
          hint: "Total variance = kept variance + discarded variance.",
          explanation: "Total variance is fixed; the more you keep in the projection, the less you throw away. Formally, maximizing $\\sum_{i=1}^{k} \\lambda_i$ (kept) is equivalent to minimizing $\\sum_{i=k+1}^{D} \\lambda_i$ (reconstruction error). This duality gives PCA its dual identity.",
        },
      ],
      keyTakeaways: [
        "PCA finds orthogonal directions of maximum variance — eigenvectors of the covariance matrix, in decreasing eigenvalue order.",
        "Equivalent formulations: max variance or min reconstruction error; both give the same solution.",
        "SVD of $X$ is the numerically stable route: right singular vectors are principal components.",
      ],
      keyTakeawaysEs: [
        "PCA encuentra direcciones ortogonales de máxima varianza — autovectores de la matriz de covarianza, en orden decreciente de autovalor.",
        "Formulaciones equivalentes: máxima varianza o mínimo error de reconstrucción; ambas dan la misma solución.",
        "La SVD de $X$ es la vía numéricamente estable: los vectores singulares derechos son las componentes principales.",
      ],
    },

    // =========================================================================
    // LESSON 49 — Chapter 10.2: PCA in Practice
    // =========================================================================
    {
      title: "PCA in Practice",
      titleEs: "PCA en la Práctica",
      chapter: "Principal Component Analysis",
      chapterEs: "Análisis de Componentes Principales",
      chapterNumber: 10,
      content: [
        "Running PCA on real data requires a handful of practical steps that textbook treatments sometimes skip. First, **center** the data by subtracting the mean: $\\tilde{\\mathbf{x}}_n = \\mathbf{x}_n - \\bar{\\mathbf{x}}$. Without centering, the first 'principal component' will simply point toward the mean, not toward the direction of real variation. Second, usually **standardize** (divide each feature by its standard deviation) when features live on different scales — otherwise PCA is dominated by whichever feature happens to have the largest range.",
        "**How many components to keep?** The **scree plot** shows eigenvalues in decreasing order. Look for an 'elbow' where eigenvalues flatten — components beyond the elbow are mostly noise. A more principled alternative is the **cumulative explained variance**: choose $k$ so that $\\sum_{i=1}^{k} \\lambda_i / \\sum_j \\lambda_j \\geq 0.95$ (or whatever threshold the downstream task requires). For purely visualization purposes, $k = 2$ or $3$ is fixed by necessity.",
        "Computationally, avoid forming $S = X^\\top X$ explicitly when $D$ is large — it is $D \\times D$ and may not fit in memory. Instead, use **SVD of $X$** directly: $X = U \\Sigma V^\\top$, where $V$ columns are principal components and $\\Sigma^2 / N$ are the eigenvalues of $S$. For huge datasets, **randomized SVD** (Halko et al.) computes the top-$k$ components in $O(NDk)$ time — orders of magnitude faster than full SVD.",
        "PCA has important **limitations**. It is linear — it cannot capture curved manifolds (use kernel PCA, Isomap, UMAP, or autoencoders for that). It assumes variance = signal, which fails when noise has large variance (consider ICA instead). It is **not scale-invariant** — standardize carefully. And it is a lossy, unsupervised method; discarded components may contain exactly the features your downstream task needs. Always validate PCA choices against the downstream metric, not just explained variance.",
        "Despite these caveats, PCA is the first tool to try for any high-dimensional dataset. Canonical applications: **face recognition** (eigenfaces), **finance** (principal portfolios / risk factors), **genomics** (population structure), **NLP** (latent semantic analysis is PCA on word-document matrices), **image compression** (JPEG's DCT is cousin to PCA). The machine-learning lesson is deeper than the algorithm: covariance matrices encode structure, and eigen-decomposition reveals it.",
        "**Worked example — rank-1 reconstruction error:** A $2\\times 2$ image $X = \\begin{pmatrix} 2 & 2 \\\\ 2 & 2 \\end{pmatrix}$ has SVD $\\Sigma = \\text{diag}(4, 0)$, so the rank-1 approximation is exact — zero reconstruction error. Perturb to $X = \\begin{pmatrix} 2 & 2 \\\\ 2 & 3 \\end{pmatrix}$: singular values are $\\sigma_1 \\approx 4.56$, $\\sigma_2 \\approx 0.44$. Keeping only $\\sigma_1$ gives Frobenius reconstruction error $\\sigma_2 = 0.44$, while the total 'energy' is $\\sqrt{\\sigma_1^2 + \\sigma_2^2} \\approx 4.58$ — the top component explains $\\sigma_1^2/(\\sigma_1^2 + \\sigma_2^2) \\approx 99.1\\%$ of variance.",
        "**Worked example — choosing $k$ for 95% variance:** Eigenvalues $[10, 6, 2, 1, 1]$, total $20$. Cumulative ratios: $k=1 \\to 0.5$; $k=2 \\to 0.8$; $k=3 \\to 0.9$; $k=4 \\to 0.95$. So $k=4$ is the smallest number of components to retain 95% of the variance. The scree plot would show a clear elbow after the second component — a judgment call between aggressive compression ($k=2$, 80%) and conservative preservation ($k=4$, 95%).",
      ],
      visualizations: [
        {
          type: "pca-3d",
          title: "Scree plot intuition",
          description: "Top few components dominate; the long tail is noise. The 'elbow' suggests a natural cutoff.",
          config: {},
        },
        {
          type: "function-plot",
          title: "Cumulative explained variance",
          description: "The curve rises quickly at first, then flattens — pick $k$ at the 95% crossing or at the elbow.",
          config: {
            fn: "sigmoid",
            domain: [-6, 6],
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Why is data centering essential before PCA?",
          options: [
            "Performance reasons.",
            "Without centering, $X^\\top X$ captures both variance and mean; the first component will point toward the mean rather than the direction of maximum variation.",
            "Because eigenvalues must be positive.",
            "It isn't essential.",
          ],
          correctIndex: 1,
          hint: "PCA wants the covariance, not the second moment.",
          explanation: "Covariance is defined as $\\mathbb{E}[(\\mathbf{x} - \\bar{\\mathbf{x}})(\\mathbf{x} - \\bar{\\mathbf{x}})^\\top]$. Using $X^\\top X / N$ without subtracting $\\bar{\\mathbf{x}}$ gives the uncentered second-moment matrix, which mixes mean and variance. PCA would then find the mean direction, which is usually not what you want.",
        },
        {
          type: "numeric-input",
          question: "You want to keep 90% of the variance. Eigenvalues are $[5, 3, 1, 0.5, 0.5]$. What is the smallest $k$?",
          answer: 3,
          tolerance: 0.01,
          hint: "Accumulate until the fraction crosses 0.9.",
          explanation: "Total = $10$. $k=1$: $5/10 = 0.5$. $k=2$: $8/10 = 0.8$. $k=3$: $9/10 = 0.9$. So $k = 3$ suffices. This is the classic cumulative explained variance criterion.",
        },
        {
          type: "multiple-choice",
          question: "When does PCA perform *poorly* as a preprocessing step?",
          options: [
            "On high-dimensional data.",
            "When the signal lies along directions of low variance (e.g., class separation is perpendicular to the main variance direction) or when the underlying manifold is curved.",
            "When features are standardized.",
            "When using randomized SVD.",
          ],
          correctIndex: 1,
          hint: "Variance is not always signal.",
          explanation: "PCA assumes high-variance directions carry the signal. If the label depends on a low-variance feature, PCA can discard exactly what matters. Similarly, curved manifolds require non-linear methods (kernel PCA, UMAP). Always validate on downstream performance, not explained variance alone.",
        },
      ],
      keyTakeaways: [
        "Always center (and usually standardize) data before PCA.",
        "Use scree plots or cumulative explained variance to pick $k$; for visualization, $k = 2$ or $3$.",
        "Prefer SVD of $X$ (or randomized SVD) over forming $X^\\top X$ when $D$ is large.",
      ],
      keyTakeawaysEs: [
        "Centra siempre los datos (y normalmente estandarízalos) antes de PCA.",
        "Usa scree plots o varianza explicada acumulada para elegir $k$; para visualización, $k = 2$ o $3$.",
        "Prefiere la SVD de $X$ (o SVD aleatorizada) a formar $X^\top X$ cuando $D$ es grande.",
      ],
    },

    // =========================================================================
    // LESSON 50 — Chapter 11.1: GMM and EM Algorithm
    // =========================================================================
    {
      title: "GMM and EM Algorithm",
      titleEs: "GMM y el Algoritmo EM",
      chapter: "Gaussian Mixture Models",
      chapterEs: "Modelos de Mezclas Gaussianas",
      chapterNumber: 11,
      content: [
        "A **Gaussian Mixture Model (GMM)** assumes the data is generated by $K$ underlying clusters, each Gaussian with its own mean and covariance: $$p(\\mathbf{x}) = \\sum_{k=1}^{K} \\pi_k\\, \\mathcal{N}(\\mathbf{x}; \\boldsymbol\\mu_k, \\Sigma_k),$$ where $\\pi_k \\geq 0$ and $\\sum_k \\pi_k = 1$ are **mixture weights**. GMMs are *soft-clustering* — each point has a probability of belonging to each cluster, not a hard label. They generalize $k$-means (which is roughly a GMM with shared spherical covariances) and are the go-to tool for density estimation and model-based clustering.",
        "Fitting a GMM by maximum likelihood is hard: the log-likelihood $\\sum_n \\log \\sum_k \\pi_k \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_k, \\Sigma_k)$ has no closed-form maximum because of the $\\log \\sum$. Enter the **Expectation-Maximization (EM) algorithm** — an iterative procedure that monotonically increases the likelihood by alternating two steps. EM is the workhorse for any model with latent variables.",
        "The **E-step** computes, for each point $n$ and cluster $k$, the **responsibility** (posterior probability of cluster $k$ given the point under current parameters): $$r_{nk} = \\frac{\\pi_k \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_k, \\Sigma_k)}{\\sum_j \\pi_j \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_j, \\Sigma_j)}.$$ Responsibilities are soft cluster assignments — if a point clearly belongs to cluster 3, $r_{n3} \\approx 1$; if it lies between clusters 1 and 2, it splits mass between them.",
        "The **M-step** updates the parameters to maximize the expected complete-data log-likelihood, using the responsibilities as weights: $$N_k = \\sum_n r_{nk}, \\quad \\boldsymbol\\mu_k = \\frac{1}{N_k} \\sum_n r_{nk} \\mathbf{x}_n, \\quad \\Sigma_k = \\frac{1}{N_k} \\sum_n r_{nk}(\\mathbf{x}_n - \\boldsymbol\\mu_k)(\\mathbf{x}_n - \\boldsymbol\\mu_k)^\\top, \\quad \\pi_k = N_k/N.$$ These are exactly the weighted sample mean, weighted sample covariance, and weighted sample proportion. The closed-form update is the payoff for introducing latent variables.",
        "EM is guaranteed to **monotonically increase** the likelihood and converges to a local maximum. Initialization matters: random starts can land in poor local optima, so $k$-means++ seeding is common. Singularities also lurk — if a Gaussian collapses to a single point, its variance $\\to 0$ and likelihood $\\to \\infty$. Regularize by adding $\\epsilon I$ to each covariance or by Bayesian priors. Beyond GMMs, EM trains HMMs, latent Dirichlet allocation, factor analysis, and countless other latent-variable models.",
        "**Worked example — one EM iteration on 1D data:** Data $\\{-2, -1.8, 2.1, 2.3\\}$, initialize $K=2$ with $\\mu_1 = -1, \\mu_2 = 1, \\sigma_1^2 = \\sigma_2^2 = 1, \\pi_1 = \\pi_2 = 0.5$. **E-step:** for $x = -2$, $\\mathcal{N}(-2; -1, 1) \\propto e^{-0.5}$, $\\mathcal{N}(-2; 1, 1) \\propto e^{-4.5}$, so $r_{1,1} = e^{-0.5}/(e^{-0.5} + e^{-4.5}) \\approx 0.982$. By symmetry $r_{4,2} \\approx 0.982$. **M-step (cluster 1):** $N_1 \\approx 0.982 + 0.982 + 0.018 + 0.018 = 2$, $\\mu_1 \\approx (-2 \\cdot 0.982 + (-1.8) \\cdot 0.982 + 2.1 \\cdot 0.018 + 2.3 \\cdot 0.018)/2 \\approx -1.83$. The mean snapped to the left cluster's empirical average.",
        "**Worked example — responsibility for an ambiguous point:** Two components $\\mathcal{N}(-1, 1)$ and $\\mathcal{N}(1, 1)$ with equal priors $\\pi_1 = \\pi_2 = 0.5$. For $x = 0.5$: $\\mathcal{N}(0.5; -1, 1) \\propto e^{-1.125}$ and $\\mathcal{N}(0.5; 1, 1) \\propto e^{-0.125}$. So $r_1 = e^{-1.125}/(e^{-1.125} + e^{-0.125}) = 1/(1 + e^{1}) \\approx 0.269$ and $r_2 \\approx 0.731$. The point 'belongs' about $27\\%$ to cluster 1, $73\\%$ to cluster 2 — soft assignment reflects that $0.5$ is closer to $1$ than to $-1$, but not by much.",
      ],
      visualizations: [
        {
          type: "gmm-plot",
          title: "GMM fit to 2D data",
          description: "Three Gaussian components capture the cluster structure; ellipses show $1\\sigma$ contours.",
          config: {
            k: 3,
            stepMode: true,
          },
        },
        {
          type: "probability-plot",
          title: "One mixture component",
          description: "Each cluster is a Gaussian; the mixture density sums weighted Gaussians.",
          config: {
            distribution: "gaussian",
            params: { mu: 0, sigma: 1 },
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "Why does EM monotonically increase the GMM log-likelihood?",
          options: [
            "By construction, each iteration resets parameters.",
            "EM maximizes a lower bound on the log-likelihood (derived from Jensen's inequality); tightening the bound at the E-step and maximizing it at the M-step guarantees non-decrease.",
            "Because Gaussians are log-concave.",
            "EM doesn't increase likelihood — it just runs.",
          ],
          correctIndex: 1,
          hint: "EM = iterative bound maximization.",
          explanation: "The E-step computes the ELBO (evidence lower bound) by choosing the variational distribution to match the true posterior, making the bound tight. The M-step maximizes the ELBO over parameters, which can only increase the bound (and thus the log-likelihood). Convergence is to a local optimum.",
        },
        {
          type: "numeric-input",
          question: "In a 2-component GMM, a point has $\\pi_1 \\mathcal{N}(\\mathbf{x}; \\boldsymbol\\mu_1, \\Sigma_1) = 0.6$ and $\\pi_2 \\mathcal{N}(\\mathbf{x}; \\boldsymbol\\mu_2, \\Sigma_2) = 0.4$. What is the responsibility $r_{n1}$?",
          answer: 0.6,
          tolerance: 0.01,
          hint: "Responsibility = numerator / sum of both.",
          explanation: "$r_{n1} = 0.6 / (0.6 + 0.4) = 0.6$. The responsibility is a posterior probability — it sums to 1 across clusters by construction. Here the point is 60% attributable to cluster 1, 40% to cluster 2.",
        },
        {
          type: "drag-to-match",
          question: "Match the EM step to what it produces.",
          leftItems: [
            "E-step",
            "M-step (means)",
            "M-step (covariances)",
            "M-step (mixture weights)",
          ],
          rightItems: [
            "Responsibilities $r_{nk}$ — posterior cluster probabilities given current parameters",
            "Weighted mean $\\boldsymbol\\mu_k = \\sum_n r_{nk} \\mathbf{x}_n / N_k$",
            "Weighted covariance $\\Sigma_k = \\sum_n r_{nk}(\\mathbf{x}_n - \\boldsymbol\\mu_k)(\\mathbf{x}_n - \\boldsymbol\\mu_k)^\\top / N_k$",
            "Proportion $\\pi_k = N_k / N$",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
          explanation: "Every M-step update is a weighted version of the usual sample statistic. This clean form is the payoff of introducing latent variables and running EM.",
        },
      ],
      keyTakeaways: [
        "GMM: $p(\\mathbf{x}) = \\sum_k \\pi_k \\mathcal{N}(\\mathbf{x}; \\boldsymbol\\mu_k, \\Sigma_k)$ — a soft-clustering density model.",
        "EM alternates E-step (compute responsibilities) and M-step (weighted MLE updates); monotonically increases likelihood.",
        "EM converges to a local optimum — seed carefully and regularize covariances to avoid singularities.",
      ],
      keyTakeawaysEs: [
        "GMM: $p(\mathbf{x}) = \sum_k \pi_k \mathcal{N}(\mathbf{x}; \boldsymbol\mu_k, \Sigma_k)$ — un modelo de densidad con clustering suave.",
        "EM alterna paso E (calcular responsabilidades) y paso M (actualizaciones MLE ponderadas); aumenta monótonamente la verosimilitud.",
        "EM converge a un óptimo local — inicializa con cuidado y regulariza las covarianzas para evitar singularidades.",
      ],
    },

    // =========================================================================
    // LESSON 51 — Chapter 11.2: GMM — Latent Variable Perspective
    // =========================================================================
    {
      title: "GMM: Latent Variable Perspective",
      titleEs: "GMM: Perspectiva de Variables Latentes",
      chapter: "Gaussian Mixture Models",
      chapterEs: "Modelos de Mezclas Gaussianas",
      chapterNumber: 11,
      content: [
        "The cleanest way to derive GMMs and EM is via **latent variables**. Introduce a categorical latent $z_n \\in \\{1, \\ldots, K\\}$ for each data point, with prior $p(z_n = k) = \\pi_k$. Conditional on $z_n = k$, the observation is Gaussian: $p(\\mathbf{x}_n \\mid z_n = k) = \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_k, \\Sigma_k)$. Marginalizing out $z_n$ recovers the mixture density $p(\\mathbf{x}_n) = \\sum_k \\pi_k \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_k, \\Sigma_k)$.",
        "The **responsibility** $r_{nk}$ from the E-step is precisely the posterior of the latent: $$r_{nk} = p(z_n = k \\mid \\mathbf{x}_n, \\boldsymbol\\theta) = \\frac{\\pi_k \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_k, \\Sigma_k)}{\\sum_j \\pi_j \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_j, \\Sigma_j)}.$$ This is Bayes' rule for the hidden cluster indicator. The EM algorithm now has a clean interpretation: compute the posterior over hidden variables (E), then maximize the **expected complete-data log-likelihood** $\\mathbb{E}_{p(z \\mid \\mathbf{x}, \\boldsymbol\\theta^{\\text{old}})}[\\log p(\\mathbf{x}, z \\mid \\boldsymbol\\theta)]$ (M).",
        "The **complete-data log-likelihood** is $\\sum_n \\sum_k \\mathbb{1}[z_n = k] \\left[ \\log \\pi_k + \\log \\mathcal{N}(\\mathbf{x}_n; \\boldsymbol\\mu_k, \\Sigma_k) \\right]$. Taking expectations with respect to the responsibilities replaces the indicators with $r_{nk}$, producing a sum of weighted log-Gaussians — decoupled and easy to maximize. This decoupling is why M-step closed-forms exist: conditional on knowing the soft assignments, the problem factorizes.",
        "Once trained, responsibilities reveal **soft cluster membership**. A point near a cluster center has $r_{nk} \\approx 1$ for that $k$; a point equidistant from two clusters splits mass. This is richer than $k$-means' hard assignment — the model knows when it is uncertain. We can use responsibilities to detect outliers (points with low responsibility for every cluster have low $p(\\mathbf{x}_n)$) or to visualize uncertainty in cluster boundaries.",
        "This latent-variable framework generalizes far beyond GMMs. **Hidden Markov Models** use a sequence of latent states. **Factor Analysis** and **Probabilistic PCA** have continuous latents. **Variational Autoencoders** learn deep latent representations with neural-network likelihoods. **Latent Dirichlet Allocation** assigns topics to documents. Every time you see EM, variational inference, or sampling — there is a latent variable structure underneath, and the GMM is the canonical worked example.",
        "**Worked example — unequal priors reshape responsibility:** Same two components $\\mathcal{N}(-1, 1)$ and $\\mathcal{N}(1, 1)$ but now $\\pi_1 = 0.9, \\pi_2 = 0.1$ (cluster 1 is much more common). For $x = 0.5$ we previously got $r_2 \\approx 0.73$. Now the joint numerators are $0.9 e^{-1.125}$ and $0.1 e^{-0.125}$. Ratio: $r_2 / r_1 = (0.1 / 0.9) \\cdot e^{1} \\approx 0.302$, so $r_2 \\approx 0.232$ and $r_1 \\approx 0.768$. The strong prior flipped the assignment — Bayes' rule in action.",
        "**Worked example — complete-data vs observed-data log-likelihood:** Suppose one point $x = 0$ is assigned responsibility $r_1 = 0.7, r_2 = 0.3$ under two components $\\mathcal{N}(-1, 1), \\mathcal{N}(1, 1)$ with equal priors. Observed log-likelihood: $\\log(0.5 \\mathcal{N}(0;-1,1) + 0.5\\mathcal{N}(0;1,1)) = \\log(\\mathcal{N}(0;-1,1)) \\approx -1.42$ (plus a constant). Expected complete-data log-likelihood: $0.7 [\\log 0.5 + \\log\\mathcal{N}(0;-1,1)] + 0.3 [\\log 0.5 + \\log\\mathcal{N}(0;1,1)]$, cleanly decoupled across clusters — M-step can maximize each component independently.",
      ],
      visualizations: [
        {
          type: "gmm-plot",
          title: "Responsibilities shade the plane",
          description: "Each point is colored by its most probable cluster; the shading between clusters shows soft-assignment uncertainty.",
          config: {
            k: 3,
          },
        },
        {
          type: "probability-plot",
          title: "Generative model: pick a cluster, sample from it",
          description: "Latent $z$ selects which Gaussian generates $\\mathbf{x}$. Marginalizing over $z$ recovers the mixture.",
          config: {
            distribution: "gaussian",
            params: { mu: 1, sigma: 0.5 },
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "From the latent-variable viewpoint, what is the responsibility $r_{nk}$?",
          options: [
            "The prior over the cluster.",
            "The posterior probability $p(z_n = k \\mid \\mathbf{x}_n, \\boldsymbol\\theta)$ — how much cluster $k$ explains the observed point under current parameters.",
            "A regularization term.",
            "Always $1/K$.",
          ],
          correctIndex: 1,
          hint: "Bayes' rule on the cluster indicator.",
          explanation: "Responsibility is the E-step posterior: $p(z = k \\mid \\mathbf{x}) \\propto p(\\mathbf{x} \\mid z = k) p(z = k) = \\pi_k \\mathcal{N}(\\mathbf{x}; \\boldsymbol\\mu_k, \\Sigma_k)$. Normalize across $k$ to get $r_{nk}$. This is the key conceptual bridge between EM and Bayesian latent-variable models.",
        },
        {
          type: "multiple-choice",
          question: "Why does introducing latent variables make the M-step closed-form?",
          options: [
            "It reduces dimensionality.",
            "Conditional on knowing cluster assignments (even softly), each cluster's parameters decouple from the others and can be updated independently via weighted MLE.",
            "Latent variables are always Gaussian.",
            "It makes the problem non-convex.",
          ],
          correctIndex: 1,
          hint: "With hard assignments, each cluster would fit its own data separately.",
          explanation: "The complete-data log-likelihood factorizes across clusters. Taking expectations with respect to responsibilities keeps this factorization — each $\\boldsymbol\\mu_k$, $\\Sigma_k$, and $\\pi_k$ has its own weighted-MLE closed form. This is why EM works so well for mixture models.",
        },
        {
          type: "drag-to-match",
          question: "Match the latent-variable model to its latent type.",
          leftItems: [
            "Gaussian Mixture Model",
            "Hidden Markov Model",
            "Probabilistic PCA / Factor Analysis",
            "Variational Autoencoder",
          ],
          rightItems: [
            "Discrete cluster indicator",
            "Discrete state sequence (evolving over time)",
            "Continuous low-dimensional latent",
            "Continuous latent, decoded by a neural network",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
          explanation: "Latent-variable modeling is a unified framework: pick a latent structure, pick a likelihood, then infer via EM, variational inference, or MCMC. The GMM is the canonical entry point.",
        },
      ],
      keyTakeaways: [
        "GMMs are latent-variable models: a hidden cluster indicator $z_n$ chooses which Gaussian generates each point.",
        "Responsibilities $r_{nk} = p(z_n = k \\mid \\mathbf{x}_n)$ are Bayesian posteriors over cluster membership.",
        "The latent-variable view generalizes EM to HMMs, PPCA, VAEs, and beyond.",
      ],
      keyTakeawaysEs: [
        "Los GMM son modelos de variables latentes: un indicador oculto de cluster $z_n$ elige qué gaussiana genera cada punto.",
        "Las responsabilidades $r_{nk} = p(z_n = k \mid \mathbf{x}_n)$ son posteriores bayesianos sobre la pertenencia al cluster.",
        "La vista de variables latentes generaliza EM a HMMs, PPCA, VAEs y más.",
      ],
    },

    // =========================================================================
    // LESSON 52 — Chapter 12.1: SVM — Separating Hyperplanes and Margins
    // =========================================================================
    {
      title: "SVM: Separating Hyperplanes and Margins",
      titleEs: "SVM: Hiperplanos Separadores y Márgenes",
      chapter: "Support Vector Machines",
      chapterEs: "Máquinas de Vectores de Soporte",
      chapterNumber: 12,
      content: [
        "**Support Vector Machines (SVMs)** solve binary classification by finding the **maximum-margin hyperplane** that separates two classes. Given labeled data $\\{(\\mathbf{x}_n, y_n)\\}$ with $y_n \\in \\{-1, +1\\}$, a hyperplane $\\mathbf{w}^\\top \\mathbf{x} + b = 0$ classifies by the sign of $\\mathbf{w}^\\top \\mathbf{x} + b$. Many hyperplanes may separate the classes, but SVMs pick a specific one: the one whose distance to the nearest point of either class is largest.",
        "The **margin** is the distance from the hyperplane to the closest data point. For a normalized constraint $y_n(\\mathbf{w}^\\top \\mathbf{x}_n + b) \\geq 1$, the margin equals $1 / \\|\\mathbf{w}\\|$. Maximizing the margin is equivalent to minimizing $\\|\\mathbf{w}\\|^2$, giving the **hard-margin SVM**: $$\\min_{\\mathbf{w}, b}\\ \\tfrac{1}{2}\\|\\mathbf{w}\\|^2 \\quad \\text{subject to}\\quad y_n(\\mathbf{w}^\\top \\mathbf{x}_n + b) \\geq 1,\\ \\forall n.$$ This is a **convex quadratic program** — a unique global optimum is guaranteed.",
        "Real data is rarely linearly separable. The **soft-margin SVM** introduces slack variables $\\xi_n \\geq 0$ to allow violations: $$\\min_{\\mathbf{w}, b, \\boldsymbol\\xi}\\ \\tfrac{1}{2}\\|\\mathbf{w}\\|^2 + C \\sum_n \\xi_n \\quad \\text{s.t.}\\quad y_n(\\mathbf{w}^\\top \\mathbf{x}_n + b) \\geq 1 - \\xi_n,\\ \\xi_n \\geq 0.$$ The hyperparameter $C$ trades off margin size against misclassification: large $C$ $\\to$ narrow margin, few violations; small $C$ $\\to$ wide margin, more violations allowed.",
        "The **dual problem** (obtained via Lagrangian duality from Chapter 7) is where SVMs really shine: $$\\max_{\\boldsymbol\\alpha}\\ \\sum_n \\alpha_n - \\tfrac{1}{2} \\sum_{n, m} \\alpha_n \\alpha_m y_n y_m \\mathbf{x}_n^\\top \\mathbf{x}_m \\quad \\text{s.t.}\\quad 0 \\leq \\alpha_n \\leq C,\\ \\sum_n \\alpha_n y_n = 0.$$ Two things are magical here: the data appears only through **inner products** $\\mathbf{x}_n^\\top \\mathbf{x}_m$ (setting up the kernel trick), and most $\\alpha_n$ are zero at the optimum.",
        "Points with $\\alpha_n > 0$ are the **support vectors** — they sit on (or inside) the margin and determine the decision boundary. Non-support vectors could be removed without changing the classifier. This **sparsity** is the SVM's signature property: the classifier is a weighted sum over a tiny subset of training points, enabling efficient prediction and principled interpretability. Complementary slackness from KKT conditions enforces this structure automatically.",
        "**Worked example — hand-computed maximum margin:** Three points: $\\mathbf{x}_1 = (1, 1), \\mathbf{x}_2 = (1, -1)$ with $y = +1$; $\\mathbf{x}_3 = (-1, 0)$ with $y = -1$. The widest separator is a vertical line between $x_1 = -1$ and $x_1 = 1$ — say $x_1 = 0$. Normalize: $\\mathbf{w} = (1, 0), b = 0$ gives $y_n(\\mathbf{w}^\\top \\mathbf{x}_n + b) = 1$ for all three points (all are support vectors). So $\\|\\mathbf{w}\\| = 1$ and the margin width is $2/\\|\\mathbf{w}\\| = 2$ — the corridor spans from $x_1 = -1$ to $x_1 = +1$.",
        "**Worked example — effect of shrinking $\\mathbf{w}$:** If instead you pick $\\mathbf{w} = (2, 0), b = 0$ (same direction, doubled), then $y_n(\\mathbf{w}^\\top \\mathbf{x}_n + b) = 2$ — constraints are satisfied with slack, but $\\tfrac{1}{2}\\|\\mathbf{w}\\|^2 = 2$ is worse than the $\\tfrac{1}{2}$ achieved at $\\mathbf{w} = (1, 0)$. Scaling down to $\\mathbf{w} = (0.5, 0)$ gives functional margin $0.5 < 1$ — constraints violated. The SVM optimum is the unique $\\mathbf{w}$ that is just large enough to enforce margin $= 1$ and no larger.",
      ],
      visualizations: [
        {
          type: "svm-plot",
          title: "Maximum-margin classifier",
          description: "Decision boundary (black), margin lines (dashed), and support vectors (circled). The SVM maximizes the corridor width.",
          config: {
            showMargin: true,
          },
        },
        {
          type: "function-plot",
          title: "Hinge loss",
          description: "The soft-margin SVM uses $\\max(0, 1 - y \\hat{y})$. Zero when classified with margin; linear penalty otherwise.",
          config: {
            fn: "relu",
            domain: [-3, 3],
          },
        },
      ],
      exercises: [
        {
          type: "numeric-input",
          question: "For a normalized SVM with $\\|\\mathbf{w}\\| = 2$, what is the geometric margin?",
          answer: 0.5,
          tolerance: 0.01,
          hint: "Margin = $1 / \\|\\mathbf{w}\\|$.",
          explanation: "The constraint $y_n(\\mathbf{w}^\\top \\mathbf{x}_n + b) \\geq 1$ plus $\\|\\mathbf{w}\\| = 2$ gives a margin of $1/2$. Minimizing $\\|\\mathbf{w}\\|^2$ enlarges this margin.",
        },
        {
          type: "multiple-choice",
          question: "Why are SVMs called 'sparse' classifiers?",
          options: [
            "The weight vector has many zeros.",
            "At the optimum, only the support vectors have non-zero dual coefficients $\\alpha_n$; the decision function depends only on those few training points.",
            "Because they use few features.",
            "Because the margin is small.",
          ],
          correctIndex: 1,
          hint: "Complementary slackness.",
          explanation: "KKT conditions imply $\\alpha_n = 0$ for points strictly outside the margin and $\\alpha_n > 0$ only for points exactly on the margin (support vectors) or inside it (margin violators). The final decision function $f(\\mathbf{x}) = \\sum_n \\alpha_n y_n \\mathbf{x}_n^\\top \\mathbf{x} + b$ is a sparse sum.",
        },
        {
          type: "multiple-choice",
          question: "What does the hyperparameter $C$ in soft-margin SVM control?",
          options: [
            "The number of features.",
            "The trade-off between margin width and allowed margin violations: large $C$ emphasizes correct classification; small $C$ emphasizes a wider margin.",
            "The kernel bandwidth.",
            "The number of support vectors.",
          ],
          correctIndex: 1,
          hint: "$C$ multiplies the slack penalty.",
          explanation: "$C = \\infty$ recovers the hard-margin SVM (no violations tolerated). Small $C$ produces a wider margin with more misclassifications. Tuning $C$ by cross-validation is the primary SVM hyperparameter selection task (along with kernel choice).",
        },
      ],
      keyTakeaways: [
        "SVM: maximum-margin classifier, solving a convex QP for $\\mathbf{w}, b$ with margin $1/\\|\\mathbf{w}\\|$.",
        "Soft-margin allows violations with hyperparameter $C$; dual form depends only on inner products.",
        "The solution is sparse — only support vectors (points on or inside the margin) have $\\alpha_n > 0$.",
      ],
      keyTakeawaysEs: [
        "SVM: clasificador de máximo margen, resolviendo un QP convexo para $\mathbf{w}, b$ con margen $1/\|\mathbf{w}\|$.",
        "El margen blando permite violaciones con el hiperparámetro $C$; la forma dual depende solo de productos internos.",
        "La solución es dispersa — solo los vectores de soporte (puntos sobre o dentro del margen) tienen $\alpha_n > 0$.",
      ],
    },

    // =========================================================================
    // LESSON 53 — Chapter 12.2: SVM — Kernels
    // =========================================================================
    {
      title: "SVM: Kernels",
      titleEs: "SVM: Kernels",
      chapter: "Support Vector Machines",
      chapterEs: "Máquinas de Vectores de Soporte",
      chapterNumber: 12,
      content: [
        "Linear SVMs can only draw straight decision boundaries — yet most interesting data is non-linearly separable. The **kernel trick** turns linear SVMs into universal classifiers without ever computing features explicitly. The insight comes from the dual: it depends on $\\mathbf{x}_n$ only via inner products $\\mathbf{x}_n^\\top \\mathbf{x}_m$. Replace every such inner product with a **kernel function** $k(\\mathbf{x}_n, \\mathbf{x}_m)$, and you are implicitly operating in a different feature space $\\boldsymbol\\phi(\\mathbf{x})$ such that $k(\\mathbf{x}, \\mathbf{x}') = \\boldsymbol\\phi(\\mathbf{x})^\\top \\boldsymbol\\phi(\\mathbf{x}')$ — without ever computing $\\boldsymbol\\phi$.",
        "The kernelized dual is $$\\max_{\\boldsymbol\\alpha}\\ \\sum_n \\alpha_n - \\tfrac{1}{2} \\sum_{n,m} \\alpha_n \\alpha_m y_n y_m k(\\mathbf{x}_n, \\mathbf{x}_m),$$ and the decision function $f(\\mathbf{x}) = \\sum_n \\alpha_n y_n k(\\mathbf{x}_n, \\mathbf{x}) + b$ is a kernel-weighted sum over support vectors. A valid kernel must be **positive semi-definite** (Mercer's condition): for any $\\{\\mathbf{x}_n\\}$, the Gram matrix $K_{nm} = k(\\mathbf{x}_n, \\mathbf{x}_m)$ must be PSD. Only such kernels correspond to genuine inner products in some feature space.",
        "Three kernels power 90% of applications. **Polynomial** $k(\\mathbf{x}, \\mathbf{x}') = (\\mathbf{x}^\\top \\mathbf{x}' + c)^d$ implicitly maps into degree-$d$ polynomial features — cheap and interpretable. **Radial Basis Function (RBF)** $k(\\mathbf{x}, \\mathbf{x}') = \\exp(-\\|\\mathbf{x} - \\mathbf{x}'\\|^2 / (2\\sigma^2))$ maps into an **infinite-dimensional** feature space and is the default choice for most problems. **Sigmoid** $k(\\mathbf{x}, \\mathbf{x}') = \\tanh(\\alpha \\mathbf{x}^\\top \\mathbf{x}' + c)$ (not always PSD — careful) gives a shallow neural network flavor.",
        "Kernel choice and hyperparameters are the main modeling decisions. The RBF **bandwidth** $\\sigma$ controls smoothness: small $\\sigma$ gives a highly flexible, wiggly boundary (risk of overfitting); large $\\sigma$ gives a nearly linear boundary (risk of underfitting). Combined with the penalty $C$, RBF SVMs have two hyperparameters — $(C, \\sigma)$ — which are usually selected by cross-validation over a log-spaced grid. This simplicity and strong regularization is why RBF SVMs were the state of the art on many tasks for decades.",
        "Beyond SVMs, kernels power **kernel ridge regression**, **Gaussian processes**, **kernel PCA**, and **kernel $k$-means**. They illustrate a profound principle: any algorithm that uses data only via inner products can be kernelized. The cost is $O(N^2)$ memory for the Gram matrix, which limits classical kernels to tens of thousands of points. Modern scalable variants — Nystrom approximations, random features (Rahimi-Recht), and neural tangent kernels — preserve the kernel mindset while scaling to millions of samples.",
        "**Worked example — polynomial kernel computation:** $\\mathbf{x} = (1, 2), \\mathbf{y} = (3, 1)$, kernel $k(\\mathbf{x}, \\mathbf{y}) = (\\mathbf{x}^\\top \\mathbf{y} + 1)^2$. Inner product: $1 \\cdot 3 + 2 \\cdot 1 = 5$. Kernel value: $(5 + 1)^2 = 36$. The implicit feature map is $\\boldsymbol\\phi(\\mathbf{z}) = (z_1^2, z_2^2, \\sqrt{2} z_1 z_2, \\sqrt{2} z_1, \\sqrt{2} z_2, 1)$ — 6-dimensional. Verify: $\\boldsymbol\\phi(\\mathbf{x}) = (1, 4, 2\\sqrt{2}, \\sqrt{2}, 2\\sqrt{2}, 1)$, $\\boldsymbol\\phi(\\mathbf{y}) = (9, 1, 3\\sqrt{2}, 3\\sqrt{2}, \\sqrt{2}, 1)$, and $\\boldsymbol\\phi(\\mathbf{x})^\\top \\boldsymbol\\phi(\\mathbf{y}) = 9 + 4 + 12 + 6 + 4 + 1 = 36$. ✓",
        "**Worked example — RBF kernel computation:** Same $\\mathbf{x} = (1, 2), \\mathbf{y} = (3, 1)$, kernel $k(\\mathbf{x}, \\mathbf{y}) = \\exp(-\\|\\mathbf{x} - \\mathbf{y}\\|^2 / 2)$ (so $\\sigma = 1$). $\\|\\mathbf{x} - \\mathbf{y}\\|^2 = (1-3)^2 + (2-1)^2 = 4 + 1 = 5$. So $k = e^{-2.5} \\approx 0.082$. If we halve $\\sigma$ to $0.5$, the kernel becomes $\\exp(-5/0.5) = e^{-10} \\approx 4.5 \\times 10^{-5}$ — a smaller bandwidth rapidly zeros out similarity between distant points, producing a more wiggly, local decision boundary.",
      ],
      visualizations: [
        {
          type: "kernel-projection-3d",
          title: "Lifting to a higher dimension",
          description: "Data that is not linearly separable in 2D becomes separable in a higher-dimensional feature space. The kernel computes the inner product there without forming the features.",
          config: {},
        },
        {
          type: "svm-plot",
          title: "Non-linear decision boundary via RBF",
          description: "An RBF-kernel SVM draws a curved boundary in input space — which is a linear boundary in the implicit feature space.",
          config: {
            showMargin: true,
          },
        },
      ],
      exercises: [
        {
          type: "multiple-choice",
          question: "What makes a function $k(\\mathbf{x}, \\mathbf{x}')$ a valid kernel?",
          options: [
            "It must be symmetric only.",
            "It must be symmetric and positive semi-definite (Mercer's condition) — equivalently, there exists a feature map $\\boldsymbol\\phi$ with $k(\\mathbf{x}, \\mathbf{x}') = \\boldsymbol\\phi(\\mathbf{x})^\\top \\boldsymbol\\phi(\\mathbf{x}')$.",
            "It must be non-negative.",
            "It must be differentiable.",
          ],
          correctIndex: 1,
          hint: "Mercer's theorem.",
          explanation: "Positive semi-definiteness ensures the Gram matrix is a valid inner-product matrix in some (possibly infinite-dimensional) feature space. Symmetry plus PSD $\\Leftrightarrow$ the kernel corresponds to a real inner product — enabling the kernel trick.",
        },
        {
          type: "numeric-input",
          question: "For a polynomial kernel $k(\\mathbf{x}, \\mathbf{x}') = (\\mathbf{x}^\\top \\mathbf{x}' + 1)^2$ with $\\mathbf{x} = (1, 2)$, $\\mathbf{x}' = (3, 1)$, compute $k(\\mathbf{x}, \\mathbf{x}')$.",
          answer: 36,
          tolerance: 0.01,
          hint: "Compute $\\mathbf{x}^\\top \\mathbf{x}'$ first, add 1, square.",
          explanation: "$\\mathbf{x}^\\top \\mathbf{x}' = 1 \\cdot 3 + 2 \\cdot 1 = 5$. $(5 + 1)^2 = 36$. The implicit feature map contains monomials up to degree 2 — you never form them, but the kernel computes their inner product.",
        },
        {
          type: "drag-to-match",
          question: "Match each kernel to its effect.",
          leftItems: [
            "Linear $k(\\mathbf{x}, \\mathbf{x}') = \\mathbf{x}^\\top \\mathbf{x}'$",
            "Polynomial $(\\mathbf{x}^\\top \\mathbf{x}' + c)^d$",
            "RBF $\\exp(-\\|\\mathbf{x} - \\mathbf{x}'\\|^2 / 2\\sigma^2)$",
            "Small RBF bandwidth $\\sigma$",
          ],
          rightItems: [
            "Same as a standard linear SVM — no implicit feature lifting",
            "Captures polynomial interactions up to degree $d$",
            "Infinite-dimensional implicit features; default for non-linear problems",
            "Highly flexible, wiggly boundary — prone to overfitting without regularization",
          ],
          correctPairs: [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ],
          explanation: "Kernel choice is the main modeling lever in kernel SVMs. RBF with well-tuned $(C, \\sigma)$ is the safe default; polynomial is a good structured alternative; linear is the baseline and the only practical option for very large datasets.",
        },
      ],
      keyTakeaways: [
        "The kernel trick replaces $\\mathbf{x}_n^\\top \\mathbf{x}_m$ with $k(\\mathbf{x}_n, \\mathbf{x}_m)$ — implicit feature lifting without explicit computation.",
        "Valid kernels are symmetric and PSD (Mercer); common choices: linear, polynomial, RBF, sigmoid.",
        "RBF SVMs with cross-validated $(C, \\sigma)$ are a strong non-linear baseline; scale with Nystrom or random features.",
      ],
      keyTakeawaysEs: [
        "El truco del kernel reemplaza $\mathbf{x}_n^\top \mathbf{x}_m$ por $k(\mathbf{x}_n, \mathbf{x}_m)$ — elevación implícita de características sin calcularlas explícitamente.",
        "Los kernels válidos son simétricos y PSD (Mercer); elecciones comunes: lineal, polinomial, RBF, sigmoide.",
        "Los SVM RBF con $(C, \sigma)$ validados por cross-validation son una línea base no lineal fuerte; escalan con Nyström o características aleatorias.",
      ],
    },
  ];

  return raw.map((lesson, i) => ({
    ...lesson,
    id: `mml-${i + 1}`,
    step: i + 1,
    nextStep: i < raw.length - 1 ? `mml-${i + 2}` : undefined,
    prevStep: i > 0 ? `mml-${i}` : undefined,
  }));
}

export const MML_COURSE_LESSONS: MMLLesson[] = buildMMLLessons();

export function getMMLLessonById(slug: string): MMLLesson | undefined {
  return MML_COURSE_LESSONS.find((l) => l.id === slug);
}
