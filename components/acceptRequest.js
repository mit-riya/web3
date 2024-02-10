import React from 'react';
import { useContext } from 'react';
import { UserContext } from './../pages/context/userContext';
import styles from './../styles/acceptRequest.module.css';

const DataModal = ({ options, selectedValues, onChange }) => {
    const { AllIdentities } = useContext(UserContext);
    console.log(AllIdentities);
    // try{
        console.log(options);
    const groupedOptions = options.reduce((groups, option) => {
        console.log(groups);
        console.log(option);
        const categoryKey = AllIdentities[option].includes(' - ') ? AllIdentities[option].split(' - ')[0] : AllIdentities[option];
        if (!groups[categoryKey]) {
            groups[categoryKey] = [];
        }
        groups[categoryKey].push(option);
        return groups;
    }, {});
    // }catch(e){
    //     console.log(e);
    // }

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
        <div className={styles.container}>
            {Object.entries(groupedOptions).map(([categoryKey, categoryOptions]) => (
                <div key={categoryKey} className={styles.box}>
                    <h3 className={styles.heading}>{categoryKey}</h3>
                    {categoryOptions.map((option, index) => (
                        <label key={index} className={styles.flexbox}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedValues.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                            <p className={styles.text}>
                                {AllIdentities[option].includes(' - ') ? AllIdentities[option].split(' - ')[1] : AllIdentities[option]}
                            </p>
                        </label>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DataModal;