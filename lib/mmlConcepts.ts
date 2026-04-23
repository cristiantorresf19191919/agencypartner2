/**
 * Central glossary of foundational math concepts used across the MML course.
 * Lessons reference these by id via `concepts: [...]` and inline `[[id]]` chips.
 */

export interface MMLConcept {
  id: string;
  term: string;
  termEs?: string;
  oneLiner: string;
  oneLinerEs?: string;
  definition: string;
  definitionEs?: string;
  exampleLatex?: string;
  exampleText?: string;
  exampleTextEs?: string;
  // Which lesson explains this in depth (for "Deep dive" link)
  lessonId?: string;
  tagColor?: "emerald" | "blue" | "violet" | "amber" | "pink" | "cyan";
}

export const MML_CONCEPTS: Record<string, MMLConcept> = {
  vector: {
    id: "vector",
    term: "Vector",
    termEs: "Vector",
    oneLiner: "An ordered list of numbers with direction and magnitude.",
    oneLinerEs: "Una lista ordenada de números con dirección y magnitud.",
    definition:
      "A vector is an element of a vector space — concretely, an ordered tuple $(v_1, v_2, \\dots, v_n)$ that you can add to other vectors and scale by numbers. In ML, a feature row, a gradient, and a word embedding are all vectors.",
    definitionEs:
      "Un vector es un elemento de un espacio vectorial — concretamente, una tupla ordenada $(v_1, v_2, \\dots, v_n)$ que puedes sumar con otros vectores y multiplicar por escalares. En ML, una fila de características, un gradiente y un embedding de palabra son vectores.",
    exampleLatex: "\\mathbf{v} = (3,\\; -1,\\; 2) \\in \\mathbb{R}^3",
    exampleText:
      "The point at coordinates (3, −1, 2) is a vector in 3D space.",
    exampleTextEs:
      "El punto en las coordenadas (3, −1, 2) es un vector en el espacio 3D.",
    lessonId: "mml-3",
    tagColor: "emerald",
  },

  matrix: {
    id: "matrix",
    term: "Matrix",
    termEs: "Matriz",
    oneLiner: "A rectangular grid of numbers — a linear transformation in compact form.",
    oneLinerEs: "Una rejilla rectangular de números — una transformación lineal en forma compacta.",
    definition:
      "An $m \\times n$ matrix $A$ stores $m\\cdot n$ numbers in rows and columns. Multiplying $A$ by a vector $\\mathbf{x}$ produces the linear combination $x_1\\mathbf{a}_1 + \\dots + x_n\\mathbf{a}_n$ of its columns. Every linear map between finite-dimensional spaces is a matrix once bases are fixed.",
    definitionEs:
      "Una matriz $m \\times n$ $A$ guarda $m\\cdot n$ números en filas y columnas. Multiplicar $A$ por un vector $\\mathbf{x}$ produce la combinación lineal $x_1\\mathbf{a}_1 + \\dots + x_n\\mathbf{a}_n$ de sus columnas. Todo mapa lineal entre espacios finito-dimensionales es una matriz una vez fijadas las bases.",
    exampleLatex:
      "A = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}",
    exampleText:
      "A 2×2 matrix that scales x by 2, mixes in y, and scales y by 3.",
    exampleTextEs:
      "Una matriz 2×2 que escala x por 2, mezcla y, y escala y por 3.",
    lessonId: "mml-3",
    tagColor: "blue",
  },

  "dot-product": {
    id: "dot-product",
    term: "Dot product",
    termEs: "Producto punto",
    oneLiner: "A scalar that measures how much two vectors point in the same direction.",
    oneLinerEs: "Un escalar que mide cuánto apuntan dos vectores en la misma dirección.",
    definition:
      "The dot product $\\mathbf{u} \\cdot \\mathbf{v} = \\sum_i u_i v_i = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\cos\\theta$. It is the workhorse of ML: every layer of a neural network, every cosine similarity, every projection is a dot product in disguise.",
    definitionEs:
      "El producto punto $\\mathbf{u} \\cdot \\mathbf{v} = \\sum_i u_i v_i = \\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|\\cos\\theta$. Es el caballo de batalla del ML: cada capa de una red neuronal, cada similitud coseno, cada proyección es un producto punto disfrazado.",
    exampleLatex: "(1,2,3)\\cdot(4,0,-1) = 4 + 0 - 3 = 1",
    exampleText: "Positive → same direction; zero → perpendicular; negative → opposite.",
    exampleTextEs: "Positivo → misma dirección; cero → perpendicular; negativo → opuesto.",
    lessonId: "mml-11",
    tagColor: "emerald",
  },

  norm: {
    id: "norm",
    term: "Norm",
    termEs: "Norma",
    oneLiner: "A length assigned to a vector — how far from the origin it sits.",
    oneLinerEs: "Una longitud asignada a un vector — cuán lejos del origen se encuentra.",
    definition:
      "A norm $\\|\\cdot\\|$ is a function that maps vectors to non-negative reals and satisfies absolute homogeneity, triangle inequality, and vanishes only at $\\mathbf{0}$. The $L^2$ (Euclidean) norm is the default; $L^1$ drives sparsity; $L^\\infty$ picks the largest component.",
    definitionEs:
      "Una norma $\\|\\cdot\\|$ es una función que mapea vectores a reales no negativos y satisface homogeneidad absoluta, desigualdad triangular y se anula solo en $\\mathbf{0}$. La norma $L^2$ (euclidiana) es la predeterminada; $L^1$ induce dispersión; $L^\\infty$ toma la componente mayor.",
    exampleLatex: "\\|(3,4)\\|_2 = \\sqrt{9 + 16} = 5",
    exampleText: "The 2D vector (3, 4) has Euclidean length 5.",
    exampleTextEs: "El vector 2D (3, 4) tiene longitud euclidiana 5.",
    lessonId: "mml-10",
    tagColor: "amber",
  },

  "linear-combination": {
    id: "linear-combination",
    term: "Linear combination",
    termEs: "Combinación lineal",
    oneLiner: "A weighted sum of vectors with scalar coefficients.",
    oneLinerEs: "Una suma ponderada de vectores con coeficientes escalares.",
    definition:
      "Given vectors $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ and scalars $c_1, \\dots, c_k$, the linear combination is $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + \\dots + c_k\\mathbf{v}_k$. The set of all such combinations is the **span** of the vectors — a subspace.",
    definitionEs:
      "Dados vectores $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ y escalares $c_1, \\dots, c_k$, la combinación lineal es $c_1\\mathbf{v}_1 + c_2\\mathbf{v}_2 + \\dots + c_k\\mathbf{v}_k$. El conjunto de todas esas combinaciones es el **span** de los vectores — un subespacio.",
    exampleLatex: "2\\,\\mathbf{e}_1 + 3\\,\\mathbf{e}_2 = (2, 3)",
    lessonId: "mml-5",
    tagColor: "blue",
  },

  "linear-independence": {
    id: "linear-independence",
    term: "Linear independence",
    termEs: "Independencia lineal",
    oneLiner: "No vector in the set can be written as a combination of the others.",
    oneLinerEs: "Ningún vector del conjunto se puede escribir como combinación de los otros.",
    definition:
      "Vectors $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ are linearly independent if $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0}$ forces all $c_i = 0$. Independent vectors carry non-redundant information — they form a basis of the space they span.",
    definitionEs:
      "Los vectores $\\mathbf{v}_1, \\dots, \\mathbf{v}_k$ son linealmente independientes si $c_1\\mathbf{v}_1 + \\dots + c_k\\mathbf{v}_k = \\mathbf{0}$ fuerza todos los $c_i = 0$. Los vectores independientes llevan información no redundante — forman una base del espacio que generan.",
    exampleText:
      "(1,0) and (0,1) are independent; (1,0) and (2,0) are not.",
    exampleTextEs:
      "(1,0) y (0,1) son independientes; (1,0) y (2,0) no lo son.",
    lessonId: "mml-6",
    tagColor: "violet",
  },

  basis: {
    id: "basis",
    term: "Basis",
    termEs: "Base",
    oneLiner: "A minimal set of vectors whose combinations cover the whole space.",
    oneLinerEs: "Un conjunto mínimo de vectores cuyas combinaciones cubren todo el espacio.",
    definition:
      "A basis of a vector space $V$ is a set of linearly independent vectors that span $V$. Every vector in $V$ has unique coordinates in that basis. Changing basis is rotating your coordinate system.",
    definitionEs:
      "Una base de un espacio vectorial $V$ es un conjunto de vectores linealmente independientes que generan $V$. Todo vector en $V$ tiene coordenadas únicas en esa base. Cambiar de base es rotar tu sistema de coordenadas.",
    exampleLatex: "\\{\\mathbf{e}_1, \\mathbf{e}_2\\} \\subset \\mathbb{R}^2",
    lessonId: "mml-7",
    tagColor: "blue",
  },

  rank: {
    id: "rank",
    term: "Rank",
    termEs: "Rango",
    oneLiner: "The dimension of the column (or row) space of a matrix.",
    oneLinerEs: "La dimensión del espacio columna (o fila) de una matriz.",
    definition:
      "The rank of $A$ is the number of linearly independent columns (equivalently, rows). It equals the number of non-zero singular values. Rank tells you the effective degrees of freedom of the transformation.",
    definitionEs:
      "El rango de $A$ es el número de columnas linealmente independientes (equivalentemente, filas). Iguala el número de valores singulares no nulos. El rango indica los grados de libertad efectivos de la transformación.",
    exampleText: "A 3×3 matrix with one zero column has rank ≤ 2.",
    exampleTextEs: "Una matriz 3×3 con una columna cero tiene rango ≤ 2.",
    lessonId: "mml-7",
    tagColor: "amber",
  },

  determinant: {
    id: "determinant",
    term: "Determinant",
    termEs: "Determinante",
    oneLiner: "A signed volume-scaling factor for a square matrix.",
    oneLinerEs: "Un factor de escalado de volumen con signo para una matriz cuadrada.",
    definition:
      "The determinant $\\det(A)$ tells you how much $A$ scales $n$-dimensional volumes (positive preserves orientation, negative flips). $\\det(A) = 0$ iff $A$ is singular (collapses dimensions). For $2\\times 2$, $\\det\\binom{a\\;b}{c\\;d} = ad - bc$.",
    definitionEs:
      "El determinante $\\det(A)$ indica cuánto escala $A$ los volúmenes $n$-dimensionales (positivo preserva orientación, negativo la invierte). $\\det(A) = 0$ sii $A$ es singular (colapsa dimensiones). Para $2\\times 2$, $\\det\\binom{a\\;b}{c\\;d} = ad - bc$.",
    exampleLatex: "\\det\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix} = 6",
    lessonId: "mml-18",
    tagColor: "amber",
  },

  transpose: {
    id: "transpose",
    term: "Transpose",
    termEs: "Traspuesta",
    oneLiner: "Flip a matrix across its diagonal: rows become columns.",
    oneLinerEs: "Reflejar una matriz sobre su diagonal: las filas se vuelven columnas.",
    definition:
      "The transpose $A^\\top$ swaps rows and columns: $(A^\\top)_{ij} = A_{ji}$. For a column vector $\\mathbf{v}$, $\\mathbf{v}^\\top$ is a row vector, so $\\mathbf{u}^\\top \\mathbf{v}$ computes a dot product. The transpose of a product reverses: $(AB)^\\top = B^\\top A^\\top$.",
    definitionEs:
      "La traspuesta $A^\\top$ intercambia filas y columnas: $(A^\\top)_{ij} = A_{ji}$. Para un vector columna $\\mathbf{v}$, $\\mathbf{v}^\\top$ es un vector fila, así $\\mathbf{u}^\\top \\mathbf{v}$ calcula el producto punto. La traspuesta de un producto se invierte: $(AB)^\\top = B^\\top A^\\top$.",
    tagColor: "cyan",
  },

  orthogonal: {
    id: "orthogonal",
    term: "Orthogonal",
    termEs: "Ortogonal",
    oneLiner: "Vectors at a 90° angle — their dot product is zero.",
    oneLinerEs: "Vectores a 90° — su producto punto es cero.",
    definition:
      "Two vectors are orthogonal when $\\mathbf{u}\\cdot\\mathbf{v} = 0$. An orthogonal matrix $Q$ has $Q^\\top Q = I$ — its columns form an orthonormal basis. Orthogonal transforms preserve length and angle (rotations and reflections).",
    definitionEs:
      "Dos vectores son ortogonales cuando $\\mathbf{u}\\cdot\\mathbf{v} = 0$. Una matriz ortogonal $Q$ cumple $Q^\\top Q = I$ — sus columnas forman una base ortonormal. Las transformaciones ortogonales preservan longitud y ángulo (rotaciones y reflexiones).",
    exampleLatex: "(1,0)\\cdot(0,1) = 0",
    lessonId: "mml-13",
    tagColor: "blue",
  },

  eigenvalue: {
    id: "eigenvalue",
    term: "Eigenvalue",
    termEs: "Autovalor",
    oneLiner: "A scalar λ such that Av = λv — how much an invariant direction is stretched.",
    oneLinerEs: "Un escalar λ tal que Av = λv — cuánto se estira una dirección invariante.",
    definition:
      "For a square matrix $A$, an eigenvalue $\\lambda$ satisfies $A\\mathbf{v} = \\lambda \\mathbf{v}$ for some non-zero $\\mathbf{v}$ (the eigenvector). Found as roots of the characteristic polynomial $\\det(A - \\lambda I) = 0$. Determines stability, rotation angles, PCA directions.",
    definitionEs:
      "Para una matriz cuadrada $A$, un autovalor $\\lambda$ satisface $A\\mathbf{v} = \\lambda \\mathbf{v}$ para algún $\\mathbf{v}$ no nulo (el autovector). Se encuentra como raíces del polinomio característico $\\det(A - \\lambda I) = 0$. Determina estabilidad, ángulos de rotación, direcciones de PCA.",
    lessonId: "mml-19",
    tagColor: "violet",
  },

  eigenvector: {
    id: "eigenvector",
    term: "Eigenvector",
    termEs: "Autovector",
    oneLiner: "A direction that a matrix stretches without rotating.",
    oneLinerEs: "Una dirección que una matriz estira sin rotar.",
    definition:
      "An eigenvector $\\mathbf{v}$ of $A$ satisfies $A\\mathbf{v} = \\lambda \\mathbf{v}$. Geometrically, $A$ leaves its direction invariant and only scales it by $\\lambda$. Symmetric matrices have real, orthogonal eigenvectors — the basis of PCA.",
    definitionEs:
      "Un autovector $\\mathbf{v}$ de $A$ satisface $A\\mathbf{v} = \\lambda \\mathbf{v}$. Geométricamente, $A$ deja invariante su dirección y solo la escala por $\\lambda$. Las matrices simétricas tienen autovectores reales y ortogonales — la base del PCA.",
    lessonId: "mml-19",
    tagColor: "violet",
  },

  "singular-value": {
    id: "singular-value",
    term: "Singular value",
    termEs: "Valor singular",
    oneLiner: "Non-negative real number on the diagonal of Σ in A = UΣVᵀ.",
    oneLinerEs: "Número real no negativo en la diagonal de Σ en A = UΣVᵀ.",
    definition:
      "Singular values $\\sigma_i \\geq 0$ are the stretch factors of the SVD $A = U\\Sigma V^\\top$. They equal $\\sqrt{\\lambda_i(A^\\top A)}$. Rank = number of non-zero $\\sigma_i$; condition number = $\\sigma_1/\\sigma_r$. Always real — even when eigenvalues are complex.",
    definitionEs:
      "Los valores singulares $\\sigma_i \\geq 0$ son los factores de estiramiento de la SVD $A = U\\Sigma V^\\top$. Equivalen a $\\sqrt{\\lambda_i(A^\\top A)}$. Rango = número de $\\sigma_i$ no nulos; número de condición = $\\sigma_1/\\sigma_r$. Siempre reales — incluso cuando los autovalores son complejos.",
    lessonId: "mml-22",
    tagColor: "emerald",
  },

  gradient: {
    id: "gradient",
    term: "Gradient",
    termEs: "Gradiente",
    oneLiner: "The vector of partial derivatives — steepest-ascent direction.",
    oneLinerEs: "El vector de derivadas parciales — dirección de máxima pendiente.",
    definition:
      "For $f: \\mathbb{R}^n \\to \\mathbb{R}$, the gradient $\\nabla f = (\\partial f/\\partial x_1, \\dots, \\partial f/\\partial x_n)$. It points in the direction of steepest increase; $-\\nabla f$ is the direction of steepest descent, used by every gradient-based optimizer.",
    definitionEs:
      "Para $f: \\mathbb{R}^n \\to \\mathbb{R}$, el gradiente $\\nabla f = (\\partial f/\\partial x_1, \\dots, \\partial f/\\partial x_n)$. Apunta en la dirección de máximo aumento; $-\\nabla f$ es la dirección de máximo descenso, usada por todo optimizador basado en gradiente.",
    exampleLatex: "\\nabla (x^2 + y^2) = (2x,\\; 2y)",
    lessonId: "mml-26",
    tagColor: "amber",
  },

  "partial-derivative": {
    id: "partial-derivative",
    term: "Partial derivative",
    termEs: "Derivada parcial",
    oneLiner: "Rate of change of a multivariable function along one axis.",
    oneLinerEs: "Tasa de cambio de una función multivariable a lo largo de un eje.",
    definition:
      "$\\partial f/\\partial x_i$ is the derivative of $f$ holding every variable except $x_i$ fixed. Stacking all partials yields the gradient. Essential to multivariable calculus and the chain rule used in backprop.",
    definitionEs:
      "$\\partial f/\\partial x_i$ es la derivada de $f$ manteniendo fijas todas las variables excepto $x_i$. Apilar todas las parciales produce el gradiente. Esencial en cálculo multivariable y la regla de la cadena de backprop.",
    lessonId: "mml-26",
    tagColor: "blue",
  },

  "chain-rule": {
    id: "chain-rule",
    term: "Chain rule",
    termEs: "Regla de la cadena",
    oneLiner: "Derivative of a composition is a product of derivatives.",
    oneLinerEs: "La derivada de una composición es un producto de derivadas.",
    definition:
      "If $h(x) = f(g(x))$, then $h'(x) = f'(g(x))\\cdot g'(x)$. In multiple dimensions, $\\nabla (f\\circ g)(x) = J_f(g(x))\\cdot \\nabla g(x)$. This is the mathematical engine of **backpropagation**.",
    definitionEs:
      "Si $h(x) = f(g(x))$, entonces $h'(x) = f'(g(x))\\cdot g'(x)$. En varias dimensiones, $\\nabla (f\\circ g)(x) = J_f(g(x))\\cdot \\nabla g(x)$. Es el motor matemático de la **retropropagación**.",
    lessonId: "mml-29",
    tagColor: "emerald",
  },

  "probability-density": {
    id: "probability-density",
    term: "Probability density",
    termEs: "Densidad de probabilidad",
    oneLiner: "A non-negative function whose integral over a region is a probability.",
    oneLinerEs: "Una función no negativa cuya integral sobre una región es una probabilidad.",
    definition:
      "A PDF $p(x)$ satisfies $p(x) \\geq 0$ and $\\int p(x)\\,dx = 1$. The probability that $X \\in [a, b]$ is $\\int_a^b p(x)\\,dx$. PDFs describe continuous distributions — Gaussian, exponential, beta — the building blocks of probabilistic ML.",
    definitionEs:
      "Una PDF $p(x)$ cumple $p(x) \\geq 0$ y $\\int p(x)\\,dx = 1$. La probabilidad de que $X \\in [a, b]$ es $\\int_a^b p(x)\\,dx$. Las PDFs describen distribuciones continuas — gaussiana, exponencial, beta — los ladrillos del ML probabilístico.",
    lessonId: "mml-34",
    tagColor: "pink",
  },

  "bayes-rule": {
    id: "bayes-rule",
    term: "Bayes' rule",
    termEs: "Regla de Bayes",
    oneLiner: "Updates a prior belief with evidence to form a posterior.",
    oneLinerEs: "Actualiza una creencia a priori con evidencia para formar una posterior.",
    definition:
      "$p(\\theta \\mid D) = \\frac{p(D \\mid \\theta)\\,p(\\theta)}{p(D)}$. The posterior is proportional to the likelihood times the prior. Bayes underpins naive Bayes, Bayesian networks, and all probabilistic inference.",
    definitionEs:
      "$p(\\theta \\mid D) = \\frac{p(D \\mid \\theta)\\,p(\\theta)}{p(D)}$. La posterior es proporcional a la verosimilitud por la a priori. Bayes sustenta naive Bayes, redes bayesianas y toda inferencia probabilística.",
    lessonId: "mml-39",
    tagColor: "violet",
  },

  "expected-value": {
    id: "expected-value",
    term: "Expected value",
    termEs: "Valor esperado",
    oneLiner: "The probability-weighted average of a random variable.",
    oneLinerEs: "El promedio ponderado por probabilidad de una variable aleatoria.",
    definition:
      "$\\mathbb{E}[X] = \\sum_x x\\,p(x)$ (discrete) or $\\int x\\,p(x)\\,dx$ (continuous). Linearity: $\\mathbb{E}[aX+bY] = a\\mathbb{E}[X] + b\\mathbb{E}[Y]$ even without independence. Expected loss is the foundation of learning theory.",
    definitionEs:
      "$\\mathbb{E}[X] = \\sum_x x\\,p(x)$ (discreto) o $\\int x\\,p(x)\\,dx$ (continuo). Linealidad: $\\mathbb{E}[aX+bY] = a\\mathbb{E}[X] + b\\mathbb{E}[Y]$ incluso sin independencia. La pérdida esperada es la base de la teoría del aprendizaje.",
    lessonId: "mml-35",
    tagColor: "pink",
  },

  variance: {
    id: "variance",
    term: "Variance",
    termEs: "Varianza",
    oneLiner: "The expected squared deviation from the mean — how spread out a distribution is.",
    oneLinerEs: "La desviación cuadrática esperada respecto a la media — cuán dispersa está la distribución.",
    definition:
      "$\\mathrm{Var}(X) = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - \\mu^2$. The square root of variance is the standard deviation. High variance means scattered data; low variance means tight. In ML, bias-variance decomposition explains generalization.",
    definitionEs:
      "$\\mathrm{Var}(X) = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - \\mu^2$. La raíz cuadrada es la desviación estándar. Alta varianza = datos dispersos; baja = concentrados. En ML, la descomposición sesgo-varianza explica la generalización.",
    lessonId: "mml-35",
    tagColor: "amber",
  },

  subspace: {
    id: "subspace",
    term: "Subspace",
    termEs: "Subespacio",
    oneLiner: "A subset of a vector space that is itself a vector space.",
    oneLinerEs: "Un subconjunto de un espacio vectorial que es también un espacio vectorial.",
    definition:
      "A subspace $W \\subseteq V$ contains $\\mathbf{0}$ and is closed under addition and scalar multiplication. Column space, null space, and row space of a matrix are all subspaces — each with its own geometric meaning.",
    definitionEs:
      "Un subespacio $W \\subseteq V$ contiene $\\mathbf{0}$ y es cerrado bajo suma y multiplicación por escalar. El espacio columna, nulo y fila de una matriz son subespacios — cada uno con su significado geométrico.",
    lessonId: "mml-5",
    tagColor: "blue",
  },

  "linear-map": {
    id: "linear-map",
    term: "Linear map",
    termEs: "Mapa lineal",
    oneLiner: "A function that preserves vector addition and scalar multiplication.",
    oneLinerEs: "Una función que preserva la suma de vectores y el producto por escalar.",
    definition:
      "A map $T: V \\to W$ is linear if $T(\\mathbf{u}+\\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ and $T(c\\mathbf{v}) = cT(\\mathbf{v})$. Every linear map between finite-dimensional spaces is a matrix once bases are fixed.",
    definitionEs:
      "Un mapa $T: V \\to W$ es lineal si $T(\\mathbf{u}+\\mathbf{v}) = T(\\mathbf{u}) + T(\\mathbf{v})$ y $T(c\\mathbf{v}) = cT(\\mathbf{v})$. Todo mapa lineal entre espacios finito-dimensionales es una matriz una vez fijadas las bases.",
    lessonId: "mml-8",
    tagColor: "emerald",
  },

  hyperplane: {
    id: "hyperplane",
    term: "Hyperplane",
    termEs: "Hiperplano",
    oneLiner: "A flat (n−1)-dimensional slice of n-dimensional space.",
    oneLinerEs: "Un corte plano (n−1)-dimensional del espacio n-dimensional.",
    definition:
      "The solution set of a single linear equation $\\mathbf{a}^\\top\\mathbf{x} = b$ in $\\mathbb{R}^n$ is a hyperplane — a line in 2D, a plane in 3D. Linear classifiers (SVMs, logistic regression) split space with a hyperplane.",
    definitionEs:
      "El conjunto solución de una única ecuación lineal $\\mathbf{a}^\\top\\mathbf{x} = b$ en $\\mathbb{R}^n$ es un hiperplano — una recta en 2D, un plano en 3D. Los clasificadores lineales (SVM, regresión logística) dividen el espacio con un hiperplano.",
    tagColor: "cyan",
  },
};

export function getConcept(id: string): MMLConcept | undefined {
  return MML_CONCEPTS[id];
}
