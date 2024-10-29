"use client"

import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Modal, Select, Button, Form, Input, List, Typography } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import {
  FETCH_ALL_INVENTORIES,
  ADD_INVENTORY,
} from "../../../../graphql/admin-mutations/admin-dashborad";
import { Inventory } from "../../../../interfaces/admin/admin-dashboard";
import styles from "./InventoryManagement.module.css";

const InventoryManagement: React.FC = () => {
  const token = Cookies.get("adminToken");
  const { Option } = Select;

  // Apollo hooks
  const [fetchInventories, { data: inventoryData }] = useLazyQuery(
    FETCH_ALL_INVENTORIES
  );
  const [addInventory] = useMutation(ADD_INVENTORY);

  // State management
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  // Fetch inventory data
  useEffect(() => {
    if (token) {
      fetchInventories({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  }, [token, fetchInventories]);

  useEffect(() => {
    if (inventoryData) {
      const { status, data: fetchedInventories } =
        inventoryData.fetchAllInventories;
      if (status) {
        setInventories(fetchedInventories);
      }
    }
  }, [inventoryData]);

  // Handle adding inventory
  const handleAddInventory = async (values: any) => {
    try {
      const response = await addInventory({
        variables: values,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (response.data.addInventory.status) {
        Modal.success({
          content: "Inventory added successfully!",
        });

        // Re-fetch inventories
        fetchInventories({
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        setShowInventoryForm(false);
      } else {
        Modal.error({
          content: response.data.addInventory.message,
        });
      }
    } catch (error) {
      Modal.error({
        content: "An error occurred while adding inventory.",
      });
    }
  };

  return (
    <div className={styles.inventoryManagement}>
      <div className={styles.inventoryHeader}>
        <Typography.Title level={2}>Inventory Management</Typography.Title>
        <Button
          type="primary"
          icon={showInventoryForm ? <CloseOutlined /> : <PlusOutlined />}
          onClick={() => setShowInventoryForm((prev) => !prev)}
        >
          {showInventoryForm ? "Cancel" : "Add Inventory"}
        </Button>
      </div>

      {showInventoryForm && (
        <Form
          onFinish={handleAddInventory}
          layout="vertical"
          className={styles.inventoryForm}
        >
          <Form.Item
            name="name"
            label="Inventory Name"
            rules={[
              { required: true, message: "Please input the inventory name!" },
            ]}
          >
            <Input
              placeholder="Enter inventory name"
              className={styles.formInput}
            />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please select a location!" }]}
          >
            <Select placeholder="Select location" className={styles.formSelect}>
              <Option value="Kakkanad">Kakkanad</Option>
              <Option value="Aluva">Aluva</Option>
              {/* Add more locations as needed */}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
            >
              Add Inventory
            </Button>
          </Form.Item>
        </Form>
      )}

      <div className={styles.inventoryDetails}>
        <Typography.Title level={3}>Inventory List</Typography.Title>
        <List
          itemLayout="horizontal"
          dataSource={inventories}
          renderItem={(inventory) => (
            <List.Item className={styles.inventoryItem}>
              <List.Item.Meta
                title={<strong>{inventory.name}</strong>}
                description={`Location: ${inventory.location}`}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default InventoryManagement;
