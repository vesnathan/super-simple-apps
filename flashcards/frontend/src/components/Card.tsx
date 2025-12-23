import React, { useState } from "react";
import "../styles/Card.css";

interface CardProps {
  front: string;
  back: string;
  onDelete: () => void;
  onEdit: () => void;
}

export const Card: React.FC<CardProps> = ({
  front,
  back,
  onDelete,
  onEdit,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="card-content mb-4">
        <div className="bg-gray-50 p-4 rounded-lg min-h-[120px]">
          <h3 className="font-medium mb-2">{isFlipped ? "Back" : "Front"}</h3>
          <p className="text-gray-800">{isFlipped ? back : front}</p>
        </div>
        <button
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          Flip Card
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          onClick={onEdit}
        >
          Edit Card
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
