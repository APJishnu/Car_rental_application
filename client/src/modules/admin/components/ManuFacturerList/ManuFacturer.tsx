// components/Manufacturer.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MANUFACTURERS, DELETE_MANUFACTURER } from '@/graphql/admin-queries/manufacture';
import { Table, Button, Popconfirm, message, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditManufacturer from '../EditManufacturer/EditManufacturer'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation'; // Import useRouter

// Define Manufacturer type
interface Manufacturer {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
}

const Manufacturer: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const { loading, error, data, refetch } = useQuery(GET_MANUFACTURERS);
  const [deleteManufacturer] = useMutation(DELETE_MANUFACTURER);
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);
  const [currentManufacturer, setCurrentManufacturer] = useState<Manufacturer | null>(null);

  console.log(data)

  const handleEdit = (manufacturer: Manufacturer) => {
    setCurrentManufacturer(manufacturer);
    setIsEditVisible(true);
  };

  const handleDelete = async (manufacturerId: string) => {
    try {
      const { data } = await deleteManufacturer({ variables: { id: manufacturerId } });
      if (data.deleteManufacturer) {
        message.success('Manufacturer has been deleted.');
        refetch(); // Refresh the manufacturer list after deletion
      } else {
        message.error(`Failed to delete manufacturer with ID: ${manufacturerId}`);
      }
    } catch (error) {
      message.error('An error occurred while deleting the manufacturer.');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      render: (text: string) => (
        <img src={text} alt="Manufacturer" width={100} style={{ borderRadius: 5 }} />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Country',
      dataIndex: 'country',
    },
    {
      title: 'Actions',
      render: (_: any, record: Manufacturer) => (
        <div>
          <Button onClick={() => handleEdit(record)} icon={<FontAwesomeIcon icon={faEdit} />} />
          <Popconfirm
            title="Are you sure to delete this manufacturer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<FontAwesomeIcon icon={faTrash} />} style={{ marginLeft: 10 }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Manufacturer List</h1>
      <Button
        type="primary"
        style={{ marginBottom: '20px' }}
        onClick={() => router.push('/admin/add-manufacture')} // Navigate to Add Manufacturer page
      >
        Add Manufacturer
      </Button>

      <Table
        dataSource={data.getManufacturers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {isEditVisible && currentManufacturer && (
        <EditManufacturer
          visible={isEditVisible}
          onClose={() => setIsEditVisible(false)}
          manufacturer={currentManufacturer}
        />
      )}
    </div>
  );
};

export default Manufacturer;
