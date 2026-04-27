import React from 'react';

interface GenericTableProps {
  data?: Array<Record<string, any>>;
  columns?: Array<{ key: string; label: string }>;
}

const GenericTable: React.FC<GenericTableProps> = ({ data = [], columns = [] }) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className="border border-gray-300 px-4 py-2 bg-gray-100">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.key} className="border border-gray-300 px-4 py-2">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GenericTable;