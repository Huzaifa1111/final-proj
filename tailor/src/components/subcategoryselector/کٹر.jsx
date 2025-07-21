import React, { useState, useEffect, useMemo } from "react";

const cutterButtonNames = [
  "کرتا بنانا ہے درزو والا",
  "آستین اوپر سے فٹ",
  "آستین اوپر سے زیادہ فٹ",
  "آستین نیچے سے لوز ہو",
  "2 درزی شلوار",
  "6 درزی شلوار",
  "شلوار لوز",
  "شلوار زیادہ لوز",
  "شلوار اوپر سے کم",
  "پینٹ شلوار",
  "شرنک کرنا ہے",
  "لیبل نہیں لگانا",
  "دامن گول",
  "دامن چورس",
];

function کٹر({ selectedSubCategory, formState = {}, updateData }) {
  // Memoize the initial selection to prevent unnecessary recalculations
  const initialSelection = useMemo(() => {
    return formState.selectedButtons
      ? cutterButtonNames.map((name) => formState.selectedButtons.includes(name))
      : new Array(cutterButtonNames.length).fill(false);
  }, [formState.selectedButtons]);

  const [localSelected, setLocalSelected] = useState(initialSelection);

  // Only update when formState.selectedButtons actually changes
  useEffect(() => {
    if (formState.selectedButtons) {
      const newSelection = cutterButtonNames.map((name) => 
        formState.selectedButtons.includes(name)
      );
      setLocalSelected(newSelection);
    }
  }, [formState.selectedButtons]);

  // Debounce the updateData call to prevent rapid successive updates
  useEffect(() => {
    const selectedButtons = cutterButtonNames.filter((_, index) => localSelected[index]);
    
    // Only update if there's an actual change
    if (JSON.stringify(selectedButtons) !== JSON.stringify(formState.selectedButtons || [])) {
      const timer = setTimeout(() => {
        updateData("cutter", { selectedButtons });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [localSelected, updateData, formState.selectedButtons]);

  const toggleButton = (index) => {
    setLocalSelected((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Memoize the selected names to prevent unnecessary recalculations
  const selectedNames = useMemo(() => {
    return cutterButtonNames.filter((_, index) => localSelected[index]);
  }, [localSelected]);

  return (
    <div className="mt-8 flex flex-col items-center font-nastaliq">
      <h3 className="text-2xl font-bold text-center">کٹر Options</h3>
      <div className="grid grid-cols-3 gap-2 justify-items-center mt-4">
        {cutterButtonNames.map((name, index) => (
          <button
            key={index}
            onClick={() => toggleButton(index)}
            className={`w-[172px] h-12 cursor-pointer text-md border rounded-xl transition-all duration-300 bg-white hover:shadow-xl ${
              localSelected[index]
                ? "border-2 border-green-600 bg-green-100 text-black"
                : "border border-gray-300"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      {selectedNames.length > 0 && (
        <div className="text-center text-green-600 font-semibold mt-4">
          Selected: {selectedNames.join(", ")}
        </div>
      )}
    </div>
  );
}

export default کٹر;