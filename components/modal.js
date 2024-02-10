/* modal.js */

import React from 'react';
import styles from './../styles/modal.module.css';

// IdentityModal Component: Displays a modal with categorized options, each having a checkbox
const IdentityModal = ({ options, selectedValues, onChange }) => {
  // Function to group options based on category
  const groupedOptions = options.reduce((groups, option) => {
    // Extracting categoryKey from the option (using the first part before ' - ' if present)
    const categoryKey = option.includes(' - ') ? option.split(' - ')[0] : option;

    // Creating groups based on categoryKey
    if (!groups[categoryKey]) {
      groups[categoryKey] = [];
    }
    groups[categoryKey].push(option);
    return groups;
  }, {});

  // Function to handle checkbox changes
  const handleCheckboxChange = (option) => {
    const selectedIndex = selectedValues.indexOf(option);
    let newSelectedValues = [...selectedValues];

    // Toggle selection based on the current state
    if (selectedIndex === -1) {
      newSelectedValues.push(option);
    } else {
      newSelectedValues.splice(selectedIndex, 1);
    }

    // Update the parent component's state with the new selection values
    onChange(newSelectedValues);
  };

  // Render the IdentityModal component
  return (
    <div className={styles.container}>
      {Object.entries(groupedOptions).map(([categoryKey, categoryOptions]) => (
        <div key={categoryKey} className={styles.box}>
          {/* Displaying category heading */}
          <h3 className={styles.heading}>
            {categoryKey}
          </h3>

          {/* Displaying options within the category */}
          {categoryOptions.map((option, index) => (
            <label key={index} className={styles.flexbox}>
              {/* Checkbox input */}
              <input
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {/* Displaying text associated with the option */}
              <p className={styles.text}>
                {option.includes(' - ') ? option.split(' - ')[1] : option}
              </p>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default IdentityModal;
