import React, { useState,useMemo } from 'react';
import pdfToText from 'react-pdftotext';
import { useTable } from 'react-table';

const App = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (file) {
      try {
        const extractedText = await pdfToText(file);
        const lines = extractedText.split('\n');
        const contacts = lines.map(line => {
          const [name, phone, email] = line.split(','); // Assuming the text is comma-separated
          return { name, phone, email };
        });
        setData(contacts);
      } catch (error) {
        console.error('Failed to extract text from pdf', error);
      }
    }
  };
  const columns = useMemo(() => [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Phone', accessor: 'phone' },
    { Header: 'Email', accessor: 'email' },
  ], []);

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload and Convert</button>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
 
  );
};

export default App;
