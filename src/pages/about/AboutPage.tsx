import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaUniversity,
  FaProjectDiagram,
  FaCode,
  FaBook,
  FaBuilding,
  FaGithub,
  FaTasks,
  FaRegLightbulb,
  FaTools,
} from "react-icons/fa";

const AboutPage = () => {
  const technologies = [
    {
      name: "React",
      description: "Biblioteka JavaScript do budowania interfejsów użytkownika",
    },
    {
      name: "TypeScript",
      description:
        "Typowany nadzbiór JavaScript zwiększający bezpieczeństwo kodu",
    },
    {
      name: "NextUI",
      description:
        "Biblioteka komponentów UI do tworzenia nowoczesnych interfejsów",
    },
    {
      name: "React Router",
      description: "Biblioteka do obsługi routingu w aplikacjach React",
    },
    { name: "React Icons", description: "Kolekcja ikon dla aplikacji React" },
  ];

  const projectObjectives = [
    "Stworzenie interaktywnego narzędzia edukacyjnego do nauki algorytmów sortowania",
    "Implementacja wizualizacji graficznej dla różnych algorytmów sortowania",
    "Umożliwienie analizy i porównania złożoności czasowej i pamięciowej algorytmów",
    "Dostarczenie szczegółowych opisów i kroków działania każdego algorytmu",
    "Umożliwienie kontroli tempa symulacji i wykonywania operacji krok po kroku",
  ];

  const implementedAlgorithms = [
    { name: "Bubble Sort", complexity: "O(n²)", status: "Zaimplementowano" },
    { name: "Insertion Sort", complexity: "O(n²)", status: "Zaimplementowano" },
    { name: "Selection Sort", complexity: "O(n²)", status: "Zaimplementowano" },
    {
      name: "Quick Sort",
      complexity: "O(n log n)",
      status: "Zaimplementowano",
    },
    { name: "Merge Sort", complexity: "O(n log n)", status: "Planowane" },
    { name: "Heap Sort", complexity: "O(n log n)", status: "Planowane" },
  ];

  const projectFeatures = [
    {
      title: "Interaktywna Wizualizacja",
      description:
        "Graficzna reprezentacja algorytmów z podświetlaniem aktualnie przetwarzanych elementów.",
      icon: <FaProjectDiagram className="text-3xl text-blue-500" />,
    },
    {
      title: "Symulacja Krok po Kroku",
      description:
        "Możliwość przechodzenia przez algorytm krok po kroku z opisem każdej operacji.",
      icon: <FaTasks className="text-3xl text-green-500" />,
    },
    {
      title: "Regulacja Tempa",
      description:
        "Opcje kontroli tempa symulacji od błyskawicznej do bardzo wolnej.",
      icon: <FaTools className="text-3xl text-purple-500" />,
    },
    {
      title: "Analiza Porównawcza",
      description:
        "Możliwość porównania różnych algorytmów na tych samych zestawach danych.",
      icon: <FaRegLightbulb className="text-3xl text-amber-500" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full p-6 gap-xl">
      <Card className="w-full max-w-6xl">
        <CardHeader className="flex flex-col items-center justify-center  text-foreground p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">O Projekcie</h1>
          <p className="text-xl text-center max-w-3xl">
            Aplikacja wspomagająca proces edukacji w zakresie algorytmów
            sortujących
          </p>
        </CardHeader>
        <CardBody className="p-6">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-sm">
              <FaGraduationCap className="text-primary" />
              Praca Inżynierska
            </h2>
            <div className="flex flex-col md:flex-row gap-xl">
              <div className="flex-[1.8]">
                <p className="mb-4 text-lg">
                  Niniejszy projekt został zrealizowany jako praca inżynierska
                  na Politechnice Koszalińskiej, na Wydziale Elektroniki i
                  Informatyki, pod kierunkiem promotora dr inż. Marka
                  Popławskiego.
                </p>
                <div className="bg-background-50 p-5 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Informacje o pracy
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between gap-sm">
                      <span className="font-semibold">Temat pracy:</span>
                      <span>
                        Aplikacja wspomagająca proces edukacji w zakresie
                        algorytmów sortujących
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-sm">
                      <span className="font-semibold">Autor:</span>
                      <span>Sławomir Sandorski</span>
                    </li>
                    <li className="flex items-center justify-between gap-sm">
                      <span className="font-semibold">Uczelnia:</span>
                      <span>Politechnika Koszalińska</span>
                    </li>
                    <li className="flex items-center justify-between gap-sm">
                      <span className="font-semibold">Wydział:</span>
                      <span>Wydział Elektroniki i Informatyki</span>
                    </li>
                    <li className="flex items-center justify-between gap-sm">
                      <span className="font-semibold">Kierunek:</span>
                      <span>Informatyka</span>
                    </li>
                    <li className="flex items-center justify-between gap-sm">
                      <span className="font-semibold">Rok akademicki:</span>
                      <span>2024/2025</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full flex justify-center items-center max-w-md mb-4">
                  <Image
                    src="../../../public/logo.png"
                    alt="Logo Politechniki Koszalińskiej"
                    className="object-contain"
                  />
                </div>
                <p className="text-center text-lg font-semibold">
                  Politechnika Koszalińska
                </p>
                <p className="text-center text-default-500">
                  Wydział Elektroniki i Informatyki
                </p>
              </div>
            </div>
          </section>

          <Divider className="my-10" />

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-sm">
              <FaUniversity className="text-primary" />O Autorze
            </h2>
            <div className="flex flex-col md:flex-row gap-xl items-center md:items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  Sławomir Sandorski
                </h3>
                <p className="text-default-500 mb-4">
                  Student Informatyki, Politechnika Koszalińska
                </p>
                <p className="mb-4">
                  Jestem studentem ostatniego roku informatyki, specjalizującym
                  się w inżynierii oprogramowania i algorytmice. Moim głównym
                  obszarem zainteresowań są interaktywne narzędzia edukacyjne
                  oraz wizualizacja algorytmów.
                </p>
                <p className="mb-6">
                  Niniejszy projekt jest wynikiem mojej pasji do informatyki.
                  Wierzę, że wizualizacja jest kluczowym elementem w zrozumieniu
                  złożonych koncepcji algorytmicznych.
                </p>
                <div className="flex gap-xl">
                  <Button
                    as="a"
                    href="https://github.com/slawomirsandorski"
                    target="_blank"
                    startContent={<FaGithub className={"mr-2"} />}
                    variant="bordered"
                  >
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <Divider className="my-10" />

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-sm">
              <FaProjectDiagram className="text-primary" />
              Opis Projektu
            </h2>
            <p className="mb-6 text-lg">
              Aplikacja jest interaktywnym narzędziem edukacyjnym, które
              umożliwia wizualizację i analizę różnych algorytmów sortowania.
              Głównym celem projektu jest ułatwienie zrozumienia działania
              algorytmów sortowania poprzez graficzną reprezentację ich
              wykonania krok po kroku.
            </p>

            <h3 className="text-xl font-semibold mb-4">Cele Projektu</h3>
            <ul className="list-disc list-inside space-y-2 mb-8 pl-4">
              {projectObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl mb-8">
              {projectFeatures.map((feature, index) => (
                <Card key={index} className="shadow-md">
                  <CardBody className="p-6">
                    <div className="flex gap-md items-start">
                      <div>{feature.icon}</div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-default-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4">Znaczenie Edukacyjne</h3>
            <p className="mb-6">
              Projekt ma istotne znaczenie edukacyjne, ponieważ pozwala na
              lepsze zrozumienie algorytmów sortowania poprzez wizualizację ich
              działania. Algorytmy sortowania są fundamentalnym zagadnieniem w
              informatyce i stanowią podstawę dla wielu zaawansowanych koncepcji
              algorytmicznych.
            </p>
            <p className="mb-6">
              Aplikacja może być wykorzystywana zarówno przez studentów uczących
              się algorytmów, jak i przez wykładowców jako narzędzie dydaktyczne
              podczas zajęć z algorytmiki. Umożliwia ona obserwację krok po
              kroku, jak działa każdy algorytm, co znacznie ułatwia zrozumienie
              różnic między poszczególnymi metodami sortowania.
            </p>
          </section>

          <Divider className="my-10" />

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-sm">
              <FaCode className="text-primary" />
              Implementacja
            </h2>
            <p className="mb-6 text-lg">
              Projekt został zaimplementowany przy użyciu nowoczesnych
              technologii webowych, co pozwala na łatwy dostęp poprzez
              przeglądarkę internetową, bez konieczności instalacji dodatkowego
              oprogramowania.
            </p>

            <h3 className="text-xl font-semibold mb-4">Technologie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-8">
              {technologies.map((tech, index) => (
                <Card key={index} className="shadow-sm">
                  <CardBody className="p-4">
                    <h4 className="font-semibold">{tech.name}</h4>
                    <p className="text-default-500 text-sm">
                      {tech.description}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-4">
              Zaimplementowane Algorytmy
            </h3>
            <Table className="mb-8">
              <TableHeader>
                <TableColumn>ALGORYTM</TableColumn>
                <TableColumn>ZŁOŻONOŚĆ</TableColumn>
                <TableColumn>STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                {implementedAlgorithms.map((algorithm, index) => (
                  <TableRow key={index}>
                    <TableCell>{algorithm.name}</TableCell>
                    <TableCell>{algorithm.complexity}</TableCell>
                    <TableCell>
                      {algorithm.status === "Zaimplementowano" ? (
                        <span className="text-success">
                          ✓ {algorithm.status}
                        </span>
                      ) : (
                        <span className="text-default-500">
                          {algorithm.status}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3 className="text-xl font-semibold mb-4">
              Architektura Aplikacji
            </h3>
            <p className="mb-6">
              Aplikacja została zaprojektowana zgodnie z najlepszymi praktykami
              inżynierii oprogramowania, z modułową architekturą umożliwiającą
              łatwe dodawanie nowych algorytmów. Każdy algorytm został
              zaimplementowany jako oddzielny moduł, co pozwala na niezależne
              testowanie i rozwój.
            </p>
            <div className="bg-background-50 p-5 rounded-lg mb-6">
              <h4 className="font-semibold mb-2">
                Główne komponenty aplikacji:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="font-medium">Symulator</span> -
                  odpowiedzialny za logikę algorytmu i generowanie kroków
                  symulacji
                </li>
                <li>
                  <span className="font-medium">Wizualizator</span> -
                  odpowiedzialny za graficzną reprezentację danych i
                  podświetlanie aktualnych operacji
                </li>
                <li>
                  <span className="font-medium">Kontroler</span> - umożliwia
                  interakcję użytkownika z symulacją, kontrolę tempa i
                  przechodzenie między krokami
                </li>
                <li>
                  <span className="font-medium">Generator danych</span> -
                  pozwala na tworzenie różnych zestawów danych do testowania
                  algorytmów
                </li>
              </ul>
            </div>
          </section>

          <Divider className="my-10" />

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-sm">
              <FaBook className="text-primary" />
              Dokumentacja i Zasoby
            </h2>
            <p className="mb-6 text-lg">
              Projekt w przyszłości zostanie lepiej udokumentowany tak aby mógł
              być rozwijany przez społeczność
            </p>

            <div className="flex flex-col md:flex-row gap-xl">
              <Card className="flex-1 shadow-md">
                <CardHeader className="bg-background-50">
                  <h3 className="text-xl font-semibold">
                    Dokumentacja Techniczna
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="mb-4">
                    Szczegółowa dokumentacja techniczna opisująca architekturę
                    aplikacji, implementację algorytmów i interfejs użytkownika.
                  </p>
                  <Button
                    as={Link}
                    to="/documentation"
                    color="primary"
                    variant="bordered"
                    isDisabled={true}
                  >
                    Dostępne w przyszłości..
                  </Button>
                </CardBody>
              </Card>

              <Card className="flex-1 shadow-md">
                <CardHeader className="bg-background-50">
                  <h3 className="text-xl font-semibold">Kod Źródłowy</h3>
                </CardHeader>
                <CardBody>
                  <p className="mb-4">
                    Kod źródłowy projektu jest dostępny na platformie GitHub, co
                    umożliwia społeczności rozwój i dostosowanie aplikacji.
                  </p>
                  <Button
                    as="a"
                    href="https://github.com/slawomir2102/sort-visualizator"
                    target="_blank"
                    color="primary"
                    variant="bordered"
                  >
                    GitHub Repository
                  </Button>
                </CardBody>
              </Card>
            </div>
          </section>

          <Divider className="my-10" />

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-sm">
              <FaBuilding className="text-primary" />
              Podziękowania
            </h2>
            <p className="mb-4 text-lg">
              Chciałbym podziękować wszystkim, którzy przyczynili się do
              realizacji tego projektu:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-8 pl-4">
              <li>
                Dr inż. Markowi Popławskiemu za promotorstwo i cenne wskazówki
                podczas realizacji projektu
              </li>
              <li>
                Wydziałowi Elektroniki i Informatyki Politechniki Koszalińskiej
                za zapewnienie możliwości realizacji projektu
              </li>
              <li>
                Kolegom i koleżankom za testowanie aplikacji i konstruktywne
                uwagi
              </li>
            </ul>
          </section>

          <div className="flex justify-center">
            <Button as={Link} to="/visualizator" color="primary" size="lg">
              Wypróbuj Symulator
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AboutPage;