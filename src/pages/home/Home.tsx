import { Card, CardBody, CardHeader } from "@nextui-org/react";

const Home = () => {
  return (
    <Card className={"w-5/6 h-5/6"}>
      <CardHeader>
        <h1 className={"font-bold text-xl p-5"}>
          Symulator oraz wizualizator algorytmów sortujących
        </h1>
      </CardHeader>

      <CardBody className={"p-5"}>
        <p className={"p-3"}>
          Jest to aplikacja do symulowania oraz wizualizacji działania
          algorytmów sortujących.
        </p>
      </CardBody>
    </Card>
  );
};

export default Home;