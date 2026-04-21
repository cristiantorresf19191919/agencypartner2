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
      chapter: "Introduction and Motivation",
      chapterNumber: 1,
      content: [
        "Machine learning is, at its core, a **mathematical conversation with data**. When you train a neural network, fit a regression model, or cluster a dataset, you are really asking a question in the language of linear algebra, calculus, probability, and optimization. Without that language, the field collapses into a pile of opaque APIs: you can call `model.fit(X, y)` but you cannot reason about *why* it works, *when* it breaks, or *how* to fix it.",
        "The four mathematical pillars you will meet in this course map almost one-to-one onto ML ideas. **Linear algebra** gives us vectors and matrices — the natural representation for features, weights, and images. **Analytic geometry** equips those vectors with distance, angle, and projection, which underpin similarity, loss, and regularization. **Matrix decompositions** (eigen, SVD, PCA) unlock dimensionality reduction and numerical stability. Finally, **vector calculus** turns learning into an optimization problem: every gradient descent step is a directional derivative of a loss function.",
        "Consider a simple example: linear regression. The model is $\\hat{y} = \\mathbf{w}^\\top \\mathbf{x} + b$. To even write this down we need **vectors** ($\\mathbf{x}$, $\\mathbf{w}$), the **dot product** ($\\mathbf{w}^\\top \\mathbf{x}$), a **loss function** (squared error), and a way to **minimize** it (either a closed-form solution using the pseudo-inverse, or an iterative gradient method). Every one of those ingredients is a chapter in this book.",
        "Probability and statistics deserve special mention. Machine learning is largely the art of making decisions under uncertainty: we do not get to see the true data-generating process, only samples from it. Concepts like *random variables*, *likelihood*, *Bayes' rule*, and *expected loss* are what distinguish a principled learner from a curve-fitting machine. Later chapters will introduce these tools and use them to build linear regression, PCA, Gaussian mixture models, and support vector machines from first principles.",
        "A final word on mindset. The math here is not a gatekeeping ritual — it is a **toolbox**. You do not need to memorize proofs to use the tools, but you do need enough intuition to pick the right one. Throughout this course we pair each concept with a visualization, an interactive exercise, and a concrete ML connection, so the symbols stay tethered to the problems they solve.",
      ],
      visualizations: [
        {
          type: "function-plot",
          title: "A loss landscape in one dimension",
          description: "Learning is optimization. Here the curve $L(w) = w^2$ shows a convex loss; training moves the parameter $w$ toward the minimum at $w = 0$.",
          config: {
            fn: "x^2",
            domain: [-3, 3],
            showTangent: true,
          },
        },
        {
          type: "vector-2d",
          title: "Features as vectors",
          description: "A data point with two features is just a 2D vector. ML algorithms manipulate millions of these at once.",
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
          options: [
            "Graph theory",
            "Vector calculus (gradients and partial derivatives)",
            "Number theory",
            "Set theory only",
          ],
          correctIndex: 1,
          hint: "Training minimizes a loss function by taking small steps in a direction that reduces it.",
          explanation: "Gradient descent relies on **vector calculus**: the gradient $\\nabla L$ tells us the direction of steepest ascent, and we step in the opposite direction. Linear algebra represents the weights, but the *update rule itself* is calculus.",
        },
        {
          type: "drag-to-match",
          question: "Match each ML idea to its underlying mathematical pillar.",
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
          explanation: "PCA diagonalizes a covariance matrix (decomposition), gradient descent differentiates a loss (calculus), Bayesian methods reason with distributions (probability), and feature vectors live in linear-algebra land.",
        },
        {
          type: "multiple-choice",
          question: "Why is it not enough to 'just use libraries' without understanding the math?",
          options: [
            "Libraries are often incorrect.",
            "Without math you cannot diagnose failures, pick appropriate models, or adapt methods to new problems.",
            "Math is required to run the code at all.",
            "There is no real reason — libraries are sufficient.",
          ],
          correctIndex: 1,
          hint: "Think about what happens when your model underfits, diverges, or gives strange predictions.",
          explanation: "Libraries are excellent at *executing* known recipes. Mathematical literacy is what lets you **debug, extend, and choose between** them — exactly the skills separating practitioners from power users.",
        },
      ],
      keyTakeaways: [
        "ML rests on four pillars: linear algebra, analytic geometry, matrix decompositions, and vector calculus, plus probability.",
        "Every ML algorithm can be traced back to concrete mathematical objects — vectors, matrices, functions, and distributions.",
        "Math is a toolbox for diagnosis and design, not just theory for its own sake.",
      ],
    },

    // =========================================================================
    // LESSON 2 — Chapter 2.1: Systems of Linear Equations
    // =========================================================================
    {
      title: "Systems of Linear Equations",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "A **system of linear equations** is a collection of equations in which each unknown appears only to the first power and is never multiplied by another unknown. A familiar example is $2x + 3y = 7$ and $x - y = 1$. The word *linear* means each equation traces out a flat object: a line in two dimensions, a plane in three, and a **hyperplane** in higher dimensions.",
        "Why do machine learners care? Because fitting a linear model is literally solving a system. Given training examples $(\\mathbf{x}_i, y_i)$, the least-squares regression problem asks for a weight vector $\\mathbf{w}$ such that $X\\mathbf{w} \\approx \\mathbf{y}$, where $X$ stacks the feature vectors as rows. When $X$ is square and invertible the system has a unique solution; when it is not (the common case in ML), we fall back on approximation via the *normal equations* — still a linear system.",
        "Every linear system has one of three possible **outcomes**: a unique solution, no solution, or infinitely many solutions. Geometrically in 2D, two lines can meet at a single point (unique), be parallel and never meet (none), or coincide entirely (infinite). This trichotomy generalizes perfectly to higher dimensions and is the reason we care about concepts like **rank** and **consistency** later on.",
        "A compact way to write a linear system is $A\\mathbf{x} = \\mathbf{b}$, where $A$ is the **coefficient matrix**, $\\mathbf{x}$ is the vector of unknowns, and $\\mathbf{b}$ is the constants vector. This notation is not just shorthand — it reveals structure. Many properties of the solution set (existence, uniqueness) can be read off from $A$ alone, before we ever start solving. That is the power of moving from equations to matrices.",
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
    },

    // =========================================================================
    // LESSON 3 — Chapter 2.2: Matrices
    // =========================================================================
    {
      title: "Matrices",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "A **matrix** is a rectangular array of numbers arranged into rows and columns. We denote an $m \\times n$ matrix as $A \\in \\mathbb{R}^{m \\times n}$, where $m$ is the number of rows and $n$ is the number of columns. The entry in row $i$ and column $j$ is written $a_{ij}$. In machine learning, a dataset with $m$ examples and $n$ features is usually stored as such a matrix — often called the **design matrix**.",
        "Matrices support three fundamental operations. **Addition** and **scalar multiplication** work entry-wise and require matching dimensions (for addition). **Matrix multiplication**, in contrast, is subtler. The product $AB$ is defined only when the number of columns of $A$ equals the number of rows of $B$, and the $(i,j)$ entry of $AB$ is the dot product of row $i$ of $A$ with column $j$ of $B$: $(AB)_{ij} = \\sum_{k} a_{ik} b_{kj}$.",
        "Matrix multiplication is **not commutative**: in general $AB \\neq BA$, even when both products are defined. It is, however, **associative** ($(AB)C = A(BC)$) and **distributive** over addition. These algebraic laws are what let us factor, rearrange, and decompose expressions in ML — for example, when deriving the normal equations $(X^\\top X)\\mathbf{w} = X^\\top \\mathbf{y}$.",
        "Special matrices show up everywhere. The **identity matrix** $I_n$ has ones on the diagonal and zeros elsewhere; it satisfies $IA = AI = A$. The **transpose** $A^\\top$ flips rows and columns, and $(AB)^\\top = B^\\top A^\\top$. A matrix is **symmetric** if $A = A^\\top$ (covariance matrices are always symmetric), **diagonal** if only the diagonal is non-zero, and **orthogonal** if $A^\\top A = I$ (orthogonal matrices preserve lengths and angles — think rotations and reflections).",
        "The **inverse** $A^{-1}$, when it exists, satisfies $A A^{-1} = A^{-1} A = I$. A matrix is **invertible** (also called *non-singular*) iff it is square and its columns are linearly independent. Not every matrix has an inverse — for the ones that do not, we reach for generalized inverses like the Moore–Penrose pseudo-inverse, which is the beating heart of least-squares solutions.",
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
    },

    // =========================================================================
    // LESSON 4 — Chapter 2.3: Solving Systems of Linear Equations
    // =========================================================================
    {
      title: "Solving Systems of Linear Equations",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "Now that we have matrices, we can formalize how to *solve* $A\\mathbf{x} = \\mathbf{b}$. The canonical algorithm is **Gaussian elimination**. The idea: apply a sequence of **elementary row operations** to reduce $A$ (augmented with $\\mathbf{b}$) to an upper-triangular form called **row-echelon form**, then back-substitute. The three legal operations are swapping two rows, scaling a row by a non-zero constant, and adding a multiple of one row to another.",
        "A stronger target is **reduced row-echelon form (RREF)**: every pivot is 1, and each pivot column has zeros everywhere else. From RREF the solution (or the parametric family of solutions) can be read off directly. Because row operations correspond to multiplying by invertible elementary matrices, they do not change the solution set — just the ease of reading it.",
        "Variables corresponding to pivot columns are **basic variables**; the others are **free variables**. When every column has a pivot, the solution is unique. When some columns lack pivots, each free variable contributes an extra dimension to the solution set. When the augmented column has a pivot but the coefficient column does not (a row like $[0 \\, 0 \\, \\dots \\, 0 \\,|\\, 1]$), the system is inconsistent and has no solution.",
        "The **general solution** of a consistent system is $\\mathbf{x} = \\mathbf{x}_p + \\mathbf{x}_h$, where $\\mathbf{x}_p$ is any *particular* solution to $A\\mathbf{x} = \\mathbf{b}$ and $\\mathbf{x}_h$ is any solution to the *homogeneous* system $A\\mathbf{x} = \\mathbf{0}$. The homogeneous solutions form a vector space — the **null space** of $A$ — whose dimension equals the number of free variables. This structural view is central to later topics like rank and linear mappings.",
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
    },

    // =========================================================================
    // LESSON 5 — Chapter 2.4: Vector Spaces
    // =========================================================================
    {
      title: "Vector Spaces",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "So far we have worked with concrete vectors in $\\mathbb{R}^n$. The true power of linear algebra, however, comes from abstracting: a **vector space** over the real numbers is any set $V$ equipped with an addition and a scalar multiplication that satisfy eight familiar axioms (associativity, commutativity of addition, existence of a zero vector, existence of additive inverses, compatibility of scalar multiplication, two distributive laws, and the identity $1 \\cdot \\mathbf{v} = \\mathbf{v}$).",
        "This abstraction is not academic hairsplitting. Once a set obeys the axioms, *every theorem of linear algebra applies automatically*. The space of polynomials of degree ≤ $n$, the space of $m \\times n$ matrices, the space of continuous functions on $[0, 1]$ — all are vector spaces, and concepts like linear combinations, independence, and bases transfer wholesale.",
        "A **subspace** $U \\subseteq V$ is a subset that is itself a vector space under the inherited operations. Concretely, $U$ must contain the zero vector and be **closed under addition and scalar multiplication**: for any $\\mathbf{u}_1, \\mathbf{u}_2 \\in U$ and any scalar $\\lambda$, both $\\mathbf{u}_1 + \\mathbf{u}_2$ and $\\lambda \\mathbf{u}_1$ must still lie in $U$. A line through the origin in $\\mathbb{R}^2$ is a subspace; a line that misses the origin is not.",
        "Two subspaces attached to every matrix $A$ are cornerstones of ML. The **column space** (or *range*) is the span of $A$'s columns — exactly the set of $\\mathbf{b}$ for which $A\\mathbf{x} = \\mathbf{b}$ has a solution. The **null space** (or *kernel*) is the set of $\\mathbf{x}$ with $A\\mathbf{x} = \\mathbf{0}$ — the directions in input space that $A$ flattens to zero. The fundamental theorem of linear algebra relates their dimensions: the **rank-nullity theorem** states that for $A \\in \\mathbb{R}^{m\\times n}$, $\\dim(\\text{col}(A)) + \\dim(\\text{null}(A)) = n$.",
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
    },

    // =========================================================================
    // LESSON 6 — Chapter 2.5: Linear Independence
    // =========================================================================
    {
      title: "Linear Independence",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "A set of vectors $\\{\\mathbf{v}_1, \\mathbf{v}_2, \\dots, \\mathbf{v}_k\\}$ is **linearly independent** if the only way to form the zero vector as $\\lambda_1 \\mathbf{v}_1 + \\lambda_2 \\mathbf{v}_2 + \\dots + \\lambda_k \\mathbf{v}_k = \\mathbf{0}$ is with all $\\lambda_i = 0$. If any non-trivial combination gives zero, the vectors are **linearly dependent** and (at least) one is a redundant combination of the others.",
        "Independence is the mathematical statement of *non-redundancy*. Intuitively, $k$ independent vectors point in *genuinely different* directions, each contributing a dimension that the others cannot fake. Dependent vectors, by contrast, have overlap: one of them can be expressed using the rest, so removing it loses no information.",
        "There is a clean algorithmic test: form the matrix $A$ whose columns are the vectors $\\mathbf{v}_i$. The vectors are linearly independent iff the homogeneous system $A\\mathbf{x} = \\mathbf{0}$ has only the trivial solution $\\mathbf{x} = \\mathbf{0}$ — equivalently, iff $A$ has full column rank, or (in the square case) iff $\\det(A) \\neq 0$. You can always run Gaussian elimination and count pivots: *number of pivots = number of independent columns*.",
        "Some quick facts that often show up in problems. Any set containing the zero vector is automatically dependent. Any set with more vectors than the dimension of the surrounding space is automatically dependent: you cannot have five independent vectors in $\\mathbb{R}^4$. A single non-zero vector is always independent.",
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
    },

    // =========================================================================
    // LESSON 7 — Chapter 2.6: Basis and Rank
    // =========================================================================
    {
      title: "Basis and Rank",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "A **basis** of a vector space $V$ is a set of vectors that is both **linearly independent** and **spanning** — every vector in $V$ can be written as a unique linear combination of basis elements. Every basis of a given finite-dimensional space has the same number of vectors, and that number is the **dimension** of the space. This is remarkable: dimension does not depend on which basis you chose, only on the space itself.",
        "The most familiar basis of $\\mathbb{R}^n$ is the **standard basis** $\\{\\mathbf{e}_1, \\dots, \\mathbf{e}_n\\}$, where $\\mathbf{e}_i$ has a 1 in position $i$ and zeros elsewhere. But infinitely many other bases exist. For instance, $\\{(1,1), (1,-1)\\}$ is a perfectly valid basis of $\\mathbb{R}^2$. Choosing a *different* basis can dramatically simplify a problem — this is the motivation for eigendecomposition and PCA.",
        "The **coordinates** of a vector $\\mathbf{v}$ in a basis $B = \\{\\mathbf{b}_1, \\dots, \\mathbf{b}_n\\}$ are the unique scalars $c_1, \\dots, c_n$ satisfying $\\mathbf{v} = \\sum c_i \\mathbf{b}_i$. The same geometric vector has different coordinate representations in different bases — a fact that is easy to forget but crucial for transformations like change-of-basis matrices.",
        "The **rank** of a matrix $A$ is the dimension of its column space — equivalently, the number of linearly independent columns, the number of pivots in its row-echelon form, or (a beautiful identity) the dimension of its row space. A key fact: $\\text{rank}(A) = \\text{rank}(A^\\top)$, i.e. **row rank equals column rank**. This identity has real consequences: for a tall matrix $A \\in \\mathbb{R}^{m \\times n}$ with $m > n$, the rank is at most $n$, because there are only $n$ columns to be independent.",
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
    },

    // =========================================================================
    // LESSON 8 — Chapter 2.7: Linear Mappings
    // =========================================================================
    {
      title: "Linear Mappings",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "A **linear mapping** (or linear transformation) between vector spaces $V$ and $W$ is a function $T : V \\to W$ that respects both vector operations: for all $\\mathbf{u}, \\mathbf{v} \\in V$ and scalars $\\lambda$, $T(\\mathbf{u} + \\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ and $T(\\lambda \\mathbf{v}) = \\lambda T(\\mathbf{v})$. Geometrically, linear maps send lines through the origin to lines through the origin; parallel lines remain parallel; the origin stays fixed.",
        "The fundamental theorem of linear maps is this: **every linear map between finite-dimensional vector spaces, once a basis is fixed, is multiplication by a matrix**. Conversely, every matrix defines a linear map. This turns abstract geometric transformations into concrete computations — a deeply practical fact for any ML implementation.",
        "Two subspaces are attached to every linear map. The **kernel** (or null space) $\\ker(T) = \\{\\mathbf{v} \\in V : T(\\mathbf{v}) = \\mathbf{0}\\}$ measures information lost; a larger kernel means more inputs collapse to the same output. The **image** (or range) $\\text{im}(T) = \\{T(\\mathbf{v}) : \\mathbf{v} \\in V\\}$ is the set of possible outputs. Rank-nullity lives here: $\\dim(V) = \\dim(\\ker T) + \\dim(\\text{im} T)$.",
        "A linear map is **injective** (one-to-one) iff its kernel is trivial (just $\\mathbf{0}$), **surjective** (onto) iff its image fills all of $W$, and **bijective** (an isomorphism) iff both. Two finite-dimensional vector spaces are isomorphic iff they have the same dimension — a stunning result that says, up to relabeling, there is only one real vector space of each dimension.",
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
    },

    // =========================================================================
    // LESSON 9 — Chapter 2.8: Affine Spaces
    // =========================================================================
    {
      title: "Affine Spaces",
      chapter: "Linear Algebra",
      chapterNumber: 2,
      content: [
        "An **affine space** is, roughly, a vector space that has forgotten where its origin is. Formally, an affine subspace of a vector space $V$ is a set of the form $\\mathbf{x}_0 + U = \\{\\mathbf{x}_0 + \\mathbf{u} : \\mathbf{u} \\in U\\}$, where $\\mathbf{x}_0$ is any point and $U$ is a linear subspace. When $\\mathbf{x}_0 = \\mathbf{0}$, the affine subspace coincides with $U$ itself; otherwise, it is a **translate** of $U$ that need not pass through the origin.",
        "Familiar examples: a line in $\\mathbb{R}^2$ not through the origin is a 1-dimensional affine subspace; a plane in $\\mathbb{R}^3$ that is shifted off the origin is a 2-dimensional affine subspace. In general, the solution set of a consistent (non-homogeneous) linear system $A\\mathbf{x} = \\mathbf{b}$ is an affine subspace: it is a particular solution $\\mathbf{x}_p$ plus the null space of $A$.",
        "**Affine maps** are the natural transformations between affine spaces. They have the form $T(\\mathbf{x}) = A\\mathbf{x} + \\mathbf{t}$, combining a linear map $A$ with a translation $\\mathbf{t}$. Unlike pure linear maps, affine maps do not need to fix the origin — they can translate the whole space. Affine maps preserve lines, parallelism, and ratios of distances along a line, but not angles or absolute distances.",
        "A trick that shows up throughout computer graphics and ML: we can embed an affine map into a **linear map in one higher dimension**. Append a 1 to every vector ($\\mathbf{x} \\mapsto (\\mathbf{x}, 1)$) and use a block matrix $\\begin{pmatrix} A & \\mathbf{t} \\\\ \\mathbf{0}^\\top & 1 \\end{pmatrix}$ to capture the entire affine map as ordinary matrix-vector multiplication. This is the same **homogeneous coordinate** trick used in OpenGL transformation pipelines.",
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
