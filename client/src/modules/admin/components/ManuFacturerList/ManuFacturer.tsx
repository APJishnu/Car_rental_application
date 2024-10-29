import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MANUFACTURERS, DELETE_MANUFACTURER } from '@/graphql/admin-queries/manufacture';
import { Table, Button, Popconfirm, message, Spin, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import EditManufacturer from '../EditManufacturer/EditManufacturer';
import { useRouter } from 'next/navigation';
import styles from './Manufacturer.module.css';

interface Manufacturer {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
}

const Manufacturer: React.FC = () => {
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery(GET_MANUFACTURERS);
  const [deleteManufacturer] = useMutation(DELETE_MANUFACTURER);
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);
  const [currentManufacturer, setCurrentManufacturer] = useState<Manufacturer | null>(null);

  const handleEdit = (manufacturer: Manufacturer) => {
    setCurrentManufacturer(manufacturer);
    setIsEditVisible(true);
  };

  const handleDelete = async (manufacturerId: string) => {
    try {
      const { data } = await deleteManufacturer({ variables: { id: manufacturerId } });
      if (data.deleteManufacturer) {
        message.success('Manufacturer has been deleted.');
        refetch();
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
        <div className={styles.imageColumn}>
          <img src={text} alt="Manufacturer" />
        </div>
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
        <div className={styles.actionsColumn}>
          <Button onClick={() => handleEdit(record)} icon={<FontAwesomeIcon icon={faEdit} />} />
          <Popconfirm
            title="Are you sure to delete this manufacturer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<FontAwesomeIcon icon={faTrash} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <p>Error fetching manufacturers: {error.message}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.manufactureHeadingDiv}>
      <h1 className={styles.title}>Manufacturer List</h1>
      <Button
        type="primary"
        className={styles.addButton}
        onClick={() => router.push('/admin/add-manufacture')}
      >
        Add Manufacturer
      </Button>
      </div>
      

      <Table
        className={styles.table}
        dataSource={data.getManufacturers}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {isEditVisible && currentManufacturer && (
        <Modal
          title="Edit Manufacturer"
          visible={isEditVisible}
          onCancel={() => setIsEditVisible(false)}
          footer={null}
          className={styles.modal}
        >
          <EditManufacturer
            visible={isEditVisible}
            onClose={() => setIsEditVisible(false)}
            manufacturer={currentManufacturer}
          />
        </Modal>
      )}
    </div>
  );
};

export default Manufacturer;
