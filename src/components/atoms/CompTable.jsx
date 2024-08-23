import { useEffect, useState } from 'react';

// Sample data for the table
const rowData = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
  { id: 3, firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '456-789-0123' },
  { id: 4, firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', phone: '789-012-3456' },
  { id: 5, firstName: 'Charlie', lastName: 'Davis', email: 'charlie.davis@example.com', phone: '012-345-6789' },
];

const CompTable = () => {
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const initialRecords = rowData.slice(0, pageSize);
  const [recordsData, setRecordsData] = useState(initialRecords);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(rowData.slice(from, to));
  }, [page, pageSize]);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
          {recordsData.map((record) => (
            <tr key={record.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.firstName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompTable;
