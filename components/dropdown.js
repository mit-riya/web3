import React from 'react';

const MultiSelectDropdown = ({ options, selectedValues, onChange }) => {
  // Function to group options based on category
  const groupedOptions = options.reduce((groups, option) => {
    const categoryKey = option.includes(' - ') ? option.split(' - ')[0] : option;
    if (!groups[categoryKey]) {
      groups[categoryKey] = [];
    }
    groups[categoryKey].push(option);
    return groups;
  }, {});
  
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
      {Object.entries(groupedOptions).map(([categoryKey, categoryOptions]) => (
        <div key={categoryKey}>
          <h3>{categoryKey}</h3>
          {categoryOptions.map((option, index) => (
            <label key={index} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option.includes(' - ') ? option.split(' - ')[1] : option}
            </label>
          ))}
        </div>
      ))}
    </div>
    // <div className="multiselect-dropdown">
    //   {options.map((option, index) => (
    //     <label key={index} className="checkbox-label">
    //       <input
    //         type="checkbox"
    //         value={option}
    //         checked={selectedValues.includes(option)}
    //         onChange={() => handleCheckboxChange(option)}
    //       />
    //       {option}
    //     </label>
    //   ))}
    // </div>
  );
};

export default MultiSelectDropdown;
