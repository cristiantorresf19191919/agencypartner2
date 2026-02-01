/**
 * TypeScript Course - Lessons from militalearning adapted for agencypartner2.
 * Uses Monaco editor with TypeScript autocomplete and run (console output).
 */

import type { WebCourseLesson } from "./webCourseTypes";

function buildTypeScriptLessons(): WebCourseLesson[] {
  const raw: (Omit<WebCourseLesson, "id" | "step" | "nextStep" | "prevStep" | "content"> & { content: [string, string] })[] = [
    {
      title: "TypeScript 1: Basic Types",
      content: [
        "Welcome to TypeScript! TypeScript is JavaScript with **types**. Types tell the compiler what kind of data we store: `string` (text), `number`, or `boolean`.",
        "Declare a variable `nombre` of type `string` with your name, and a variable `edad` of type `number` with your age. Log both.",
      ],
      defaultCode: `// Declare variables with types:\nlet nombre: string = "Your name";\nlet edad: number = 25;\n\nconsole.log("Me llamo " + nombre + " y tengo " + edad + " años");`,
      validationLogic: (code, logs) => ({
        success: code.includes(": string") && code.includes(": number") && (logs.some((l) => l.toLowerCase().includes("llamo")) || logs.some((l) => l.toLowerCase().includes("años"))),
        message: "🎯 Basic types learned!",
      }),
    },
    {
      title: "TypeScript 2: Typed Arrays",
      content: [
        "In TypeScript we can type arrays. `string[]` means 'array of strings', and `number[]` means 'array of numbers'.",
        "Create an array of type `string[]` called `frutas` with at least 3 fruits. Then log the first fruit.",
      ],
      defaultCode: `let frutas: string[] = ["Manzana", "Banana", "Naranja"];\n\nconsole.log("Mi fruta favorita es: " + frutas[0]);`,
      validationLogic: (code, logs) => ({
        success: code.includes("string[]") && code.includes("frutas") && logs.some((l) => l.toLowerCase().includes("fruta")),
        message: "🍎 Typed arrays mastered!",
      }),
    },
    {
      title: "TypeScript 3: Functions with Types",
      content: [
        "Functions in TypeScript can have types on parameters and return type. `function name(param: type): returnType { ... }`",
        "Create a function `saludar` that receives `nombre: string` and returns `string`. It should return '¡Hola [nombre]!'.",
      ],
      defaultCode: `function saludar(nombre: string): string {\n  return "¡Hola " + nombre + "!";\n}\n\nconsole.log(saludar("Milita"));`,
      validationLogic: (code, logs) => ({
        success: code.includes("saludar(nombre: string): string") && code.includes("return") && logs.some((l) => l.toLowerCase().includes("hola")),
        message: "✨ Typed functions learned!",
      }),
    },
    {
      title: "TypeScript 4: Boolean Type",
      content: [
        "The `boolean` type can only be `true` or `false`. Perfect for conditionals.",
        "Create a variable `esEstudiante` of type `boolean` with value `true`. Then use an `if` to log a message if student.",
      ],
      defaultCode: `let esEstudiante: boolean = true;\n\nif (esEstudiante) {\n  console.log("🎓 ¡Eres estudiante!");\n}`,
      validationLogic: (code, logs) => ({
        success: code.includes(": boolean") && code.includes("= true") && logs.some((l) => l.toLowerCase().includes("estudiante")),
        message: "✅ Boolean mastered!",
      }),
    },
    {
      title: "TypeScript 5: Interfaces",
      content: [
        "**Interfaces** are like blueprints for objects. Once defined, you can use them to type objects.",
        "Create an interface `Persona` with `nombre: string` and `edad: number`. Then create an object that uses that interface.",
      ],
      defaultCode: `interface Persona {\n  nombre: string;\n  edad: number;\n}\n\nlet yo: Persona = {\n  nombre: "Milita",\n  edad: 8\n};\n\nconsole.log(yo.nombre + " tiene " + yo.edad + " años");`,
      validationLogic: (code, logs) => ({
        success: code.includes("interface Persona") && code.includes(": Persona") && (logs.some((l) => l.toLowerCase().includes("años")) || logs.some((l) => l.toLowerCase().includes("tiene"))),
        message: "📋 Interfaces learned!",
      }),
    },
    {
      title: "TypeScript 6: Optional Parameters",
      content: [
        "Sometimes we want a parameter to be optional. In TypeScript use `?` after the name: `param?: type`",
        "Create a function `saludar` that receives `nombre: string` and `apellido?: string` (optional). If apellido exists, show full name; otherwise only nombre.",
      ],
      defaultCode: `function saludar(nombre: string, apellido?: string): string {\n  if (apellido) {\n    return "¡Hola " + nombre + " " + apellido + "!";\n  }\n  return "¡Hola " + nombre + "!";\n}\n\nconsole.log(saludar("Milita"));\nconsole.log(saludar("Milita", "La Vaca"));`,
      validationLogic: (code) => ({
        success: code.includes("apellido?: string") && code.includes("if (apellido)") && (code.match(/saludar\(/g) || []).length >= 2,
        message: "❓ Optional parameters mastered!",
      }),
    },
    {
      title: "TypeScript 7: Union Types",
      content: [
        "A **union type** allows a variable to be one of several types. Use `|`: `string | number` means 'text OR number'.",
        "Create a variable `id` of type `string | number`. Assign first a number, then a string, and log both.",
      ],
      defaultCode: `let id: string | number = 123;\nconsole.log("ID numérico: " + id);\n\nid = "ABC-123";\nconsole.log("ID texto: " + id);`,
      validationLogic: (code) => ({
        success: code.includes("string | number") && (code.includes("= 123") || /\d+/.test(code)) && (code.includes('= "') || code.includes("= '")),
        message: "🔀 Union types learned!",
      }),
    },
    {
      title: "TypeScript 8: Void Return",
      content: [
        "Some functions don't return anything (e.g. just log). Use `: void` as the return type.",
        "Create a function `mostrarMensaje` that receives `texto: string` and returns nothing (`: void`). The function should log the text.",
      ],
      defaultCode: `function mostrarMensaje(texto: string): void {\n  console.log(texto);\n}\n\nmostrarMensaje("¡Hola desde TypeScript!");`,
      validationLogic: (code, logs) => ({
        success: code.includes(": void") && code.includes("function mostrarMensaje") && logs.length > 0,
        message: "🚫 Void learned!",
      }),
    },
    {
      title: "TypeScript 9: Literal Types",
      content: [
        "A **literal type** means the value can only be exactly that string or number. `\"rojo\" | \"azul\" | \"verde\"` means only one of those three colors.",
        "Create a variable `color` of type `\"rojo\" | \"azul\" | \"verde\"` and assign it to `\"rojo\"`. Then log it.",
      ],
      defaultCode: `let color: "rojo" | "azul" | "verde" = "rojo";\nconsole.log("Mi color favorito es: " + color);`,
      validationLogic: (code, logs) => ({
        success: code.includes('"rojo" | "azul" | "verde"') && code.includes('= "rojo"') && logs.some((l) => l.toLowerCase().includes("color")),
        message: "📝 Literal types learned!",
      }),
    },
    {
      title: "TypeScript 10: Arrays of Typed Objects",
      content: [
        "We can create arrays of objects using interfaces. `Persona[]` means 'array of Persona objects'.",
        "Create an interface `Animal` with `nombre: string` and `tipo: string`. Then create an array `animales: Animal[]` with at least 2 animals.",
      ],
      defaultCode: `interface Animal {\n  nombre: string;\n  tipo: string;\n}\n\nlet animales: Animal[] = [\n  { nombre: "Firulais", tipo: "Perro" },\n  { nombre: "Michi", tipo: "Gato" }\n];\n\nanimales.forEach(function(animal) {\n  console.log(animal.nombre + " es un " + animal.tipo);\n});`,
      validationLogic: (code) => ({
        success: code.includes("interface Animal") && code.includes("Animal[]") && code.includes("forEach"),
        message: "🐾 Typed object arrays mastered!",
      }),
    },
  ];

  return raw.map((lesson, i) => {
    const id = `ts-${i + 1}`;
    return {
      ...lesson,
      id,
      step: i + 1,
      nextStep: i < raw.length - 1 ? `ts-${i + 2}` : undefined,
      prevStep: i > 0 ? `ts-${i}` : undefined,
      content: lesson.content,
    };
  });
}

export const TYPESCRIPT_COURSE_LESSONS = buildTypeScriptLessons();

export function getTypeScriptLessonById(slug: string): WebCourseLesson | undefined {
  return TYPESCRIPT_COURSE_LESSONS.find((l) => l.id === slug);
}
