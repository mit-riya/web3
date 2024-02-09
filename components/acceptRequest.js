import React from 'react';
import { useContext } from 'react';
import { UserContext } from './../pages/context/userContext';

const DataModal = ({ options, selectedValues, onChange }) => {
    const { AllIdentities } = useContext(UserContext);
    const groupedOptions = options.reduce((groups, option) => {
        const categoryKey = AllIdentities[option].includes(' - ') ? AllIdentities[option].split(' - ')[0] : AllIdentities[option];
        if (!groups[categoryKey]) {
            groups[categoryKey] = [];
        }
        groups[categoryKey].push(option);
        return groups;
    }, {});

    console.log(options);
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
                            {AllIdentities[option].includes(' - ') ? AllIdentities[option].split(' - ')[1] : AllIdentities[option]}
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DataModal;