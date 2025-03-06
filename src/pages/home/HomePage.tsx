import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Image,
  Tooltip,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { FaPlay, FaInfoCircle, FaBook, FaGithub } from "react-icons/fa";

const HomePage = () => {
  const algorithms = [
    {
      name: "Bubble Sort",
      complexity: "O(n²)",
      description:
        "Prosty algorytm sortowania, który wielokrotnie przechodzi przez listę, porównuje sąsiednie elementy i zamienia je, jeśli są w złej kolejności.",
    },
    {
      name: "Insertion Sort",
      complexity: "O(n²)",
      description:
        "Algorytm buduje posortowaną tablicę po jednym elemencie na raz, podobnie jak układanie kart w ręce.",
    },
    {
      name: "Selection Sort",
      complexity: "O(n²)",
      description:
        "Sortowanie przez wybieranie polega na znajdowaniu najmniejszego elementu w nieposortowanej części tablicy i umieszczaniu go na końcu posortowanej części.",
    },
    {
      name: "Quick Sort",
      complexity: "O(n log n)",
      description:
        "Algorytm dziel i rządź, który wybiera element pivot i partycjonuje tablicę wokół niego, następnie rekurencyjnie sortuje podtablice.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full p-6 gap-8">
      <Card className="w-full max-w-6xl">
        <CardHeader className="flex flex-col items-center justify-center  text-foreground">
          <h1 className="text-3xl font-bold p-8 text-center">
            Symulator oraz Wizualizator Algorytmów Sortujących
          </h1>
        </CardHeader>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">O Aplikacji</h2>
              <p className="text-lg mb-4">
                Witaj w interaktywnym symulatorze algorytmów sortujących! Ta
                aplikacja pozwala na wizualizację i zrozumienie działania
                różnych algorytmów sortujących krok po kroku.
              </p>
              <p className="text-lg mb-4">
                Algorytmy sortujące są fundamentalnymi koncepcjami w informatyce
                i zrozumienie ich działania jest kluczowe dla każdego
                programisty. Nasza aplikacja pomaga zrozumieć różnice między
                algorytmami poprzez ich interaktywną wizualizację.
              </p>
              <div className="flex flex-wrap gap-xl mt-6">
                <Button
                  as={Link}
                  to="/visualizator"
                  color="primary"
                  size="lg"
                  startContent={<FaPlay className={"mr-2"} />}
                >
                  Uruchom Symulator
                </Button>
                <Button as={Link} to="/about" variant="bordered" size="lg">
                  O Projekcie
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-end">
              <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="../../../public/placeholder.png"
                  alt="Wizualizacja sortowania"
                  className="object-cover w-full"
                />
              </div>
            </div>
          </div>

          <Divider className="my-8" />

          <h2 className="text-2xl font-semibold mb-6">Dostępne Algorytmy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
            {algorithms.map((alg, index) => (
              <Card
                key={index}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex gap-xl bg-background-50">
                  <div>
                    <p className="text-xl font-semibold">{alg.name}</p>
                    <p className="text-small text-default-500">
                      Złożoność: {alg.complexity}
                    </p>
                  </div>
                  <Tooltip content="Więcej informacji">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      aria-label="Więcej informacji"
                    >
                      <FaInfoCircle />
                    </Button>
                  </Tooltip>
                </CardHeader>
                <CardBody>
                  <p>{alg.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <Divider className="my-8" />

          <h2 className="text-2xl font-semibold mb-6">
            Jak Korzystać z Aplikacji
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl mb-8">
            <Card className="shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold">1. Wybierz Algorytm</h3>
              </CardHeader>
              <CardBody>
                <p>
                  Wybierz jeden z dostępnych algorytmów sortowania z listy
                  rozwijanej.
                </p>
              </CardBody>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold">2. Wprowadź Dane</h3>
              </CardHeader>
              <CardBody>
                <p>
                  Wpisz własne liczby lub wygeneruj losowe dane do posortowania.
                </p>
              </CardBody>
            </Card>
            <Card className="shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  3. Kontroluj Symulację
                </h3>
              </CardHeader>
              <CardBody>
                <p>
                  Użyj przycisków sterowania, aby krokowo przechodzić przez
                  proces sortowania lub wybrać prędkość animacji.
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex gap-xl">
              <Button
                as={Link}
                to="/documentation"
                variant="bordered"
                startContent={<FaBook className={"mr-2"} />}
                isDisabled={true}
              >
                Dokumentacja dostępna w przyszłości..
              </Button>
              <Button
                as="a"
                href="https://github.com/slawomir2102/sort-visualizator"
                target="_blank"
                rel="noopener noreferrer"
                variant="bordered"
                startContent={<FaGithub className={"mr-2"} />}
              >
                Kod Źródłowy
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <footer className="w-full max-w-6xl text-center text-default-500 mt-4">
        <p>{new Date().getFullYear()} Symulator Algorytmów Sortujących.</p>
      </footer>
    </div>
  );
};

export default HomePage;