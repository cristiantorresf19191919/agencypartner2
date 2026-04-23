/**
 * Bundled tiny datasets that ship inside RealDataCompanion.
 * These are *samples* — small enough to stay in the JS bundle and anchor stats
 * concepts to something the reader can visually recognize.
 */

export interface Dataset {
  id: string;
  name: string;
  nameEs?: string;
  features: string[];
  featuresEs?: string[];
  classes: string[];
  classesEs?: string[];
  rows: Array<{ values: number[]; classIndex: number }>;
}

/* ------------------------------------------------------------------ */
/* IRIS — 30 rows sampled from the classic Fisher iris dataset.        */
/* Columns: sepal length, sepal width, petal length, petal width (cm). */
/* Class: 0 = setosa, 1 = versicolor, 2 = virginica                    */
/* ------------------------------------------------------------------ */

export const IRIS: Dataset = {
  id: "iris",
  name: "Iris (30-row sample)",
  nameEs: "Iris (muestra de 30 filas)",
  features: ["sepal length", "sepal width", "petal length", "petal width"],
  featuresEs: ["largo sépalo", "ancho sépalo", "largo pétalo", "ancho pétalo"],
  classes: ["setosa", "versicolor", "virginica"],
  rows: [
    { values: [5.1, 3.5, 1.4, 0.2], classIndex: 0 },
    { values: [4.9, 3.0, 1.4, 0.2], classIndex: 0 },
    { values: [4.7, 3.2, 1.3, 0.2], classIndex: 0 },
    { values: [4.6, 3.1, 1.5, 0.2], classIndex: 0 },
    { values: [5.0, 3.6, 1.4, 0.2], classIndex: 0 },
    { values: [5.4, 3.9, 1.7, 0.4], classIndex: 0 },
    { values: [4.6, 3.4, 1.4, 0.3], classIndex: 0 },
    { values: [5.0, 3.4, 1.5, 0.2], classIndex: 0 },
    { values: [4.4, 2.9, 1.4, 0.2], classIndex: 0 },
    { values: [4.9, 3.1, 1.5, 0.1], classIndex: 0 },
    { values: [7.0, 3.2, 4.7, 1.4], classIndex: 1 },
    { values: [6.4, 3.2, 4.5, 1.5], classIndex: 1 },
    { values: [6.9, 3.1, 4.9, 1.5], classIndex: 1 },
    { values: [5.5, 2.3, 4.0, 1.3], classIndex: 1 },
    { values: [6.5, 2.8, 4.6, 1.5], classIndex: 1 },
    { values: [5.7, 2.8, 4.5, 1.3], classIndex: 1 },
    { values: [6.3, 3.3, 4.7, 1.6], classIndex: 1 },
    { values: [4.9, 2.4, 3.3, 1.0], classIndex: 1 },
    { values: [6.6, 2.9, 4.6, 1.3], classIndex: 1 },
    { values: [5.2, 2.7, 3.9, 1.4], classIndex: 1 },
    { values: [6.3, 3.3, 6.0, 2.5], classIndex: 2 },
    { values: [5.8, 2.7, 5.1, 1.9], classIndex: 2 },
    { values: [7.1, 3.0, 5.9, 2.1], classIndex: 2 },
    { values: [6.3, 2.9, 5.6, 1.8], classIndex: 2 },
    { values: [6.5, 3.0, 5.8, 2.2], classIndex: 2 },
    { values: [7.6, 3.0, 6.6, 2.1], classIndex: 2 },
    { values: [4.9, 2.5, 4.5, 1.7], classIndex: 2 },
    { values: [7.3, 2.9, 6.3, 1.8], classIndex: 2 },
    { values: [6.7, 2.5, 5.8, 1.8], classIndex: 2 },
    { values: [7.2, 3.6, 6.1, 2.5], classIndex: 2 },
  ],
};

/* ------------------------------------------------------------------ */
/* HOUSING — 20 rows: rooms, median income, price (normalized).        */
/* ------------------------------------------------------------------ */

export const HOUSING: Dataset = {
  id: "housing-sample",
  name: "Housing (20-row sample)",
  nameEs: "Vivienda (muestra de 20 filas)",
  features: ["rooms", "income"],
  featuresEs: ["habitaciones", "ingreso"],
  classes: ["price tier low", "price tier high"],
  rows: [
    { values: [3, 1.5], classIndex: 0 },
    { values: [4, 2.1], classIndex: 0 },
    { values: [3, 1.8], classIndex: 0 },
    { values: [5, 2.4], classIndex: 0 },
    { values: [4, 2.0], classIndex: 0 },
    { values: [3, 1.6], classIndex: 0 },
    { values: [4, 1.9], classIndex: 0 },
    { values: [5, 2.2], classIndex: 0 },
    { values: [5, 2.5], classIndex: 0 },
    { values: [6, 2.8], classIndex: 0 },
    { values: [6, 3.4], classIndex: 1 },
    { values: [7, 4.2], classIndex: 1 },
    { values: [7, 3.9], classIndex: 1 },
    { values: [8, 4.6], classIndex: 1 },
    { values: [6, 3.6], classIndex: 1 },
    { values: [7, 4.0], classIndex: 1 },
    { values: [8, 4.8], classIndex: 1 },
    { values: [9, 5.2], classIndex: 1 },
    { values: [7, 4.3], classIndex: 1 },
    { values: [8, 4.5], classIndex: 1 },
  ],
};

/* ------------------------------------------------------------------ */
/* GAUSSIAN CLUSTERS — 40 synthetic points in 2 groups for stats demos */
/* ------------------------------------------------------------------ */

export const GAUSSIAN_CLUSTERS: Dataset = (() => {
  const rows: Dataset["rows"] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = (mu: number, sigma: number) => {
    const u1 = Math.max(1e-9, rnd());
    const u2 = rnd();
    return (
      mu + sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    );
  };
  for (let i = 0; i < 20; i++) {
    rows.push({ values: [gauss(-1.5, 0.6), gauss(0.5, 0.8)], classIndex: 0 });
  }
  for (let i = 0; i < 20; i++) {
    rows.push({ values: [gauss(1.6, 0.7), gauss(-0.3, 0.9)], classIndex: 1 });
  }
  return {
    id: "gaussian-clusters",
    name: "Two Gaussian clusters",
    nameEs: "Dos clústeres gaussianos",
    features: ["x", "y"],
    classes: ["cluster A", "cluster B"],
    rows,
  };
})();

export function getDataset(id: string): Dataset | undefined {
  if (id === "iris") return IRIS;
  if (id === "housing-sample") return HOUSING;
  if (id === "gaussian-clusters") return GAUSSIAN_CLUSTERS;
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Simple stats helpers                                                */
/* ------------------------------------------------------------------ */

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function variance(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mu = mean(arr);
  return arr.reduce((a, b) => a + (b - mu) ** 2, 0) / (arr.length - 1);
}

export function covarianceMatrix2D(
  xs: number[],
  ys: number[],
): [[number, number], [number, number]] {
  const mx = mean(xs);
  const my = mean(ys);
  const n = Math.max(1, xs.length - 1);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  return [
    [sxx / n, sxy / n],
    [sxy / n, syy / n],
  ];
}

/** Eigen-decomposition of a 2x2 symmetric matrix. */
export function eig2x2(M: [[number, number], [number, number]]): {
  lambdas: [number, number];
  vectors: [[number, number], [number, number]];
} {
  const a = M[0][0];
  const b = M[0][1];
  const c = M[1][0];
  const d = M[1][1];
  const tr = a + d;
  const det = a * d - b * c;
  const disc = Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const l1 = tr / 2 + disc;
  const l2 = tr / 2 - disc;
  const v = (lam: number): [number, number] => {
    const x = b;
    const y = lam - a;
    const n = Math.hypot(x, y);
    if (n < 1e-9) return [1, 0];
    return [x / n, y / n];
  };
  return {
    lambdas: [l1, l2],
    vectors: [v(l1), v(l2)],
  };
}
