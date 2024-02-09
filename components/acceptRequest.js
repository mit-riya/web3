import React from 'react';

const fixedIdentities = [
    "10th Board Certificate",
    "12th Board Certificate",
    "Voter ID",
    "Passport",
    "Bachelors Degree - Tech",
    "Bachelors Degree - Science",
    "Bachelors Degree - Design",
    "Masters Degree - Tech",
    "Masters Degree - Science",
    "Masters Degree - Design",
    "Phd Degree",
    "Courses - Blockchain",
    "Courses - DSA",
    "Courses - Probability",
    "Courses - Machine Learning",
    "Courses - Product Design",
    "Work Experience - Software developer",
    "Work Experience - Data scientist",
    "Work Experience - Product Manager",
    "Work Experience - Team lead",
    "Work Experience - Consultant",
    "Work Experience - Internship",
    "Achievements - Gsoc Contributor",
    "Achievements - Inter IIT Participant",
    "Achievements - KVPY",
    "Achievements - NTSE",
    "Achievements - IMS"
];

const DataModal = ({ options, selectedValues, onChange }) => {

    const groupedOptions = options.reduce((groups, option) => {
        const categoryKey = fixedIdentities[option].includes(' - ') ? fixedIdentities[option].split(' - ')[0] : fixedIdentities[option];
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
                {fixedIdentities[option].includes(' - ') ? fixedIdentities[option].split(' - ')[1] : fixedIdentities[option]}
                </label>
            ))}
            </div>
        ))}
        </div>
    );
};

export default DataModal;