"use client"

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Table, Typography, Spin, message } from 'antd';

const { Title } = Typography;

const GET_RENTABLE_VEHICLES = gql`
  query GetRentableVehicles {
    getRentableVehicles {
      id
      vehicleId
      pricePerDay
      availableQuantity
      vehicle {           
        id
        name
        description
        quantity
        year
        primaryImageUrl
        otherImageUrls
        manufacturer {
          id
          name
          country
          imageUrl
        }
      }
    }
  }
`;

const RentableVehiclesList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_RENTABLE_VEHICLES);

  if (loading) return <Spin size="large" />;
  if (error) {
    message.error('Error fetching vehicles. Please try again later.');
    return null; // or return an error component
  }

  const columns = [
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
    },
    {
      title: 'Vehicle Name',
      dataIndex: ['vehicle', 'name'], // Access vehicle's name
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: ['vehicle', 'description'], // Access vehicle's description
      key: 'description',
    },
    {
      title: 'Quantity',
      dataIndex: ['vehicle', 'quantity'], // Access vehicle's quantity
      key: 'quantity',
    },
    {
      title: 'Year',
      dataIndex: ['vehicle', 'year'], // Access vehicle's year
      key: 'year',
    },
    {
      title: 'Primary Image',
      dataIndex: ['vehicle', 'primaryImageUrl'], // Access vehicle's primary image URL
      key: 'primaryImage',
      render: (imageUrl: string) => <img src={imageUrl} alt="Primary" style={{ width: 100 }} />,
    },
    {
      title: 'Manufacturer Name',
      dataIndex: ['vehicle', 'manufacturer', 'name'], // Access manufacturer's name
      key: 'manufacturerName',
    },
    {
      title: 'Manufacturer Country',
      dataIndex: ['vehicle', 'manufacturer', 'country'], // Access manufacturer's country
      key: 'manufacturerCountry',
    },
    {
      title: 'Manufacturer Image',
      dataIndex: ['vehicle', 'manufacturer', 'imageUrl'], // Access manufacturer's image URL
      key: 'manufacturerImage',
      render: (imageUrl: string) => <img src={imageUrl} alt="Manufacturer" style={{ width: 100 }} />,
    },
    {
      title: 'Price Per Day',
      dataIndex: 'pricePerDay',
      key: 'pricePerDay',
      render: (text: number) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Available Quantity',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
    },
  ];
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Rentable Vehicles List</Title>
      <Table
        dataSource={data.getRentableVehicles}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default RentableVehiclesList;
