import React, { useState } from "react";

const Table = ({ columns, tableData }) => {
  // State for selected checkboxes
  const [selectedRows, setSelectedRows] = useState([]);

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(id)) {
        // If already selected, remove it
        return prevSelected.filter((item) => item !== id);
      } else {
        // If not selected, add it
        return [...prevSelected, id];
      }
    });
  };

  // Handle action buttons (View, Edit, Delete)
  const handleAction = (action, doctorId) => {
    console.log(`${action} clicked for Doctor ID: ${doctorId}`);
    // Implement actual view, edit, delete logic here
  };

  return (
    <table className="min-w-full table-auto border-collapse">
      <thead className="bg-[#F6F8FB]">
        <tr className="border-b border-gray-200">
          {columns.map((column, index) => (
            <th
              key={index}
              className="text-M-text-color/60 font-inter font-bold text-sm uppercase py-2 px-3 text-left"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr
            key={index}
            className="hover:bg-gray-50 transition-all duration-200 ease-in-out"
          >
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.queueNumber}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.name}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.gender}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.age}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.appointment}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.dateTime}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.assignDr}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              {row.status}
            </td>
            <td className="py-3 px-4 text-sm text-gray-700 border-b border-gray-200">
              <div className="flex space-x-3">
                {/* Ensure actions exists and is an array */}
                {(row.actions || []).includes("view") && (
                  <button
                    className="text-blue-500"
                    onClick={() => handleAction("View", row.id)}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                )}
                {(row.actions || []).includes("edit") && (
                  <button
                    className="text-yellow-500"
                    onClick={() => handleAction("Edit", row.id)}
                  >
                    <i className="fas fa-pencil-alt"></i> Edit
                  </button>
                )}
                {(row.actions || []).includes("delete") && (
                  <button
                    className="text-red-500"
                    onClick={() => handleAction("Delete", row.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
