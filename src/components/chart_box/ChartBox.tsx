import { motion } from "framer-motion";

export default function ChartBox({
  index,
  label,
  height,
  className,
}: {
  index: number;
  label: number;
  height: number;
  className: string;
}) {
  return (
    <div className="flex w-8 flex-col">
      <motion.div
        initial={{ translateY: height }}
        animate={{ translateY: 100 - height }}
      >
        <p className="w-full text-center">{label}</p>
      </motion.div>
      <motion.div
        initial={{ scaleY: 0 }} // Początkowa wysokość
        animate={{ scaleY: height / 100 }} // Proporcjonalna wysokość
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={`relative flex w-full items-center`} // Pozycjonowanie elementu
        style={{
          transformOrigin: "bottom", // Wyrównanie do dolnej krawędzi
        }}
      >
        <div
          className={className}
          style={{
            width: "32px",
            height: "100px", // Ustalona wysokość bazowa, skaluje się przez `scaleY`
            backgroundColor: "hsl(var(--nextui-primary-100))",
            borderRadius: "5px",
          }}
        ></div>
      </motion.div>
      <p className="w-full text-center">{index}</p>
    </div>
  );
}
