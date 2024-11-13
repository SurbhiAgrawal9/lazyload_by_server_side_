// this is code of react js

import { Avatar, Table } from "antd";
import React, { useState, useEffect } from "react";
import callsData from "../Call/data"; // Import the actual data

// Function to simulate lazy loading with pagination
const fetchDataFromServer = (page, pageSize) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * pageSize; // Calculate the start index for the current page
      const endIndex = page * pageSize; // Calculate the end index for the current page
      const data = callsData.slice(startIndex, endIndex); // Slice the actual callsData based on page size

      // Resolve with sliced data and total record count
      resolve({ data, total: callsData.length });
    }, 1000); // Simulate a server delay
  });
};

const columns = [
  {
    title: 'Username',
    dataIndex: 'user',
    key: 'user',
    render: (text, record) => (
      <div className="flex items-center">
        <Avatar src={record.avatar} alt={text} />
        <span className="ml-3">{text}</span>
      </div>
    ),
    onCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
    onHeaderCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    onCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
    onHeaderCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
  },
  {
    title: 'Amount',
    dataIndex: 'earnings',
    key: 'earnings',
    render: (text) => (
      <span>${text}</span>
    ),
    sorter: (a, b) => a.earnings - b.earnings,
    onCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
    onHeaderCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
  },
  {
    title: 'Comment',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <span
        className={`px-2 py-1 font-semibold rounded-full ${status === 'active' ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200'}`}
      >
        {status}
      </span>
    ),
    onCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
    onHeaderCell: () => ({
      style: { backgroundColor: '#1F2937', color: 'white', border: '1px solid' },
    }),
  },
];

const TipTable = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const pageSize = 5; // Fixed page size

  // Fetch data when the page changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data, total } = await fetchDataFromServer(current, pageSize);
      setData(data); // Set the fetched data
      setTotal(total); // Set the total records count
      setLoading(false);
    };
    loadData();
  }, [current]); // Trigger fetch when page changes

  // Handle page change in table
  const handleTableChange = (pagination) => {
    setCurrent(pagination.current); // Update the current page number
  };

  return (
    <div className="container mt-4">
      <Table
        dataSource={data} // Use the fetched data
        columns={columns}
        pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: false, // Disable page size changer
        }}
        loading={loading} // Display loading state while data is being fetched
        rowKey="key" // Use key field for row uniqueness
        onChange={handleTableChange} // Handle page change
        className="rounded-lg shadow-dark bg-pink-700"
      />
    </div>
  );
};

export default TipTable;
