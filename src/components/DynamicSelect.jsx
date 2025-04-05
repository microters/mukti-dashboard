import React from 'react';
import Select from 'react-select';

const DynamicSelect = ({ options, onChange, value, isSearchable }) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      value={value}
      className="react-select-container"
      classNamePrefix="react-select"
      isSearchable={isSearchable}
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: '#e2e8f0',
          fontSize: '14px',
          backgroundColor: '#f7fafc',
        }),
        option: (provided, state) => ({
          ...provided,
          fontSize: '14px',
          backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#ebf8ff' : 'transparent',
          color: state.isSelected ? '#ffffff' : '#2d3748',
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '0px',
        }),
      }}
    />
  );
};

export default DynamicSelect;

