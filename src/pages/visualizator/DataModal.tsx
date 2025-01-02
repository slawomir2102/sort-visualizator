import React from "react";

const DataModal = ({ numberOfElements }: { numberOfElements: number }) => {
  const cos = () => {
    for (let i = 0; i < numberOfElements; i++) {
      `<button key={i}>{i}</button>`;
    }
  };

  return cos();
};

export default DataModal;
