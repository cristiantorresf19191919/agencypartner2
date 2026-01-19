"use client";

import { Card, Stack, Heading, Text, ButtonLink, CodeEditor } from "@/components/ui";
import DeveloperHeader from "@/components/Header/DeveloperHeader";
import Footer from "@/components/Footer/Footer";
import { useLocale } from "@/lib/useLocale";

type Lesson = {
  id: string;
  badge: string;
  title: string;
  description: string;
  code: string;
};

const LESSONS: Lesson[] = [
  {
    id: "1",
    badge: "Lesson 1",
    title: "¡Tu primer componente React! 🐱",
    description:
      "Un componente es como un gatito adorable que puedes usar una y otra vez. En React, creamos componentes con funciones que devuelven JSX (parecido a HTML pero con superpoderes). Edita el código y presiona Run para ver el resultado.",
    code: `function Gatito() {
  return <h1>¡Miau! Soy un gatito feliz 🐱</h1>;
}

export default function App() {
  return <Gatito />;
}`,
  },
  {
    id: "2",
    badge: "Lesson 2",
    title: "Componentes con props 🐶",
    description:
      "Los componentes pueden recibir props (propiedades), como cuando le das un nombre a tu perrito. Las props son como regalitos que le pasas a tu componente para que sepa qué hacer. Cambia el nombre en las props y ejecuta.",
    code: `function Perrito({ nombre }) {
  return <h2>¡Guau! Soy {nombre} 🐶</h2>;
}

export default function App() {
  return <Perrito nombre="Max" />;
}`,
  },
  {
    id: "3",
    badge: "Lesson 3",
    title: "JSX y etiquetas 🐰",
    description:
      "En React, podemos usar JSX para crear HTML de forma mágica. JSX es como HTML pero dentro de JavaScript. ¡La conejita puede saltar entre etiquetas! Edita el párrafo o añade más elementos.",
    code: `function Conejita() {
  return (
    <div>
      <p>¡Hop! ¡Hop! Soy una conejita saltarina 🐰</p>
    </div>
  );
}

export default function App() {
  return <Conejita />;
}`,
  },
  {
    id: "4",
    badge: "Lesson 4",
    title: "Múltiples props 🐦",
    description:
      "Los componentes pueden tener múltiples props. Es como darle al pajarito un nombre Y una canción favorita. ¡Puedes pasarle todas las propiedades que quieras! Prueba cambiar nombre o cancion.",
    code: `function Pajarito({ nombre, cancion }) {
  return <p>{nombre} canta: {cancion} 🐦</p>;
}

export default function App() {
  return <Pajarito nombre="Pío" cancion="Twist and Shout" />;
}`,
  },
  {
    id: "5",
    badge: "Lesson 5",
    title: "className para estilos 🐻",
    description:
      "Podemos usar className en JSX (en lugar de 'class') para darle estilos a nuestros componentes. El osito quiere un abrazo con estilo. Cambia el className o el texto.",
    code: `function Osito() {
  return <div className="abrazador">¡Abrazo de osito! 🐻</div>;
}

export default function App() {
  return <Osito />;
}`,
  },
  {
    id: "6",
    badge: "Lesson 6",
    title: "Estilos inline 🦋",
    description:
      "Los componentes pueden tener estilos inline usando objetos JavaScript. La mariposa quiere volar con colores hermosos. Modifica los valores de color o fontSize.",
    code: `function Mariposa() {
  const estilos = { color: "#e91e63", fontSize: "1.5rem" };
  return <p style={estilos}>¡Vuelo con colores! 🦋</p>;
}

export default function App() {
  return <Mariposa />;
}`,
  },
];

export default function ReactLessonsPage() {
  const { createLocalizedPath } = useLocale();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f1a] via-[#0f172a] to-[#0b0f1a] text-white">
      <DeveloperHeader />

      <section className="pt-16 pb-8 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heading level={1} className="text-4xl md:text-5xl font-bold mb-4">
            React
          </Heading>
          <Text className="text-zinc-400 text-lg">La habilidad mejor pagada</Text>
          <ButtonLink
            href={createLocalizedPath("/")}
            variant="secondary"
            className="mt-6 inline-block !bg-white/5 !border-white/10 !text-zinc-300 hover:!bg-white/10"
          >
            ← Volver al inicio
          </ButtonLink>
        </div>
      </section>

      <section className="px-4 max-w-4xl mx-auto pb-24">
        <Heading level={2} className="text-2xl font-bold mb-8">
          Lecciones de React
        </Heading>

        <Stack direction="col" gap="xl">
          {LESSONS.map((lesson) => (
            <Card
              key={lesson.id}
              variant="elevated"
              className="p-6 md:p-8 !bg-white/5 !border-white/10"
            >
              <Stack direction="col" gap="md">
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full mb-3">
                    {lesson.badge}
                  </span>
                  <Heading level={2} className="text-xl font-bold mb-2">
                    {lesson.title}
                  </Heading>
                  <Text className="text-zinc-400">{lesson.description}</Text>
                </div>

                <CodeEditor
                  code={lesson.code}
                  language="tsx"
                  readOnly={false}
                  height={280}
                  disableLinting={false}
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      </section>

      <Footer />
    </main>
  );
}
