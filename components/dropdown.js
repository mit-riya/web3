import React from 'react';
import styles from './../styles/modal.module.css';

const IdentityModal = ({ options, selectedValues, onChange }) => {
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
    <div className={styles.container}>
      {Object.entries(groupedOptions).map(([categoryKey, categoryOptions]) => (
        <div key={categoryKey} className={styles.box}>
          <h3 className={styles.heading}>{categoryKey}</h3>
          {categoryOptions.map((option, index) => (
            <label key={index} className={styles.flexbox}>
              <input
                // id={option}
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
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
