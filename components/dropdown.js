import React from 'react';

const MultiSelectDropdown = ({ options, selectedValues, onChange }) => {
  const handleCheckboxChange = (option) => {
    const selectedIndex = selectedValues.indexOf(option);
    let newSelectedValues = [...selectedValues];
    if (selectedIndex === -1) {
      newSelectedValues.push(option);
    } else {
      newSelectedValues.splice(selectedIndex, 1);
    }
    console.log(newSelectedValues);
    onChange(newSelectedValues);
  };

  return (
    <div className="multiselect-dropdown">
      {options.map((option, index) => (
        <label key={index} className="checkbox-label">
          <input
            type="checkbox"
            value={option}
            checked={selectedValues.includes(option)}
            onChange={() => handleCheckboxChange(option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default MultiSelectDropdown;
