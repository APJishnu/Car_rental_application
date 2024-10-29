import React from 'react';
import { Modal, Select, Input } from 'antd';
import { Vehicle } from '@/interfaces/admin-interfaces/vehicle-types';

interface AddRentableModalProps {
  vehicle: Vehicle | null;
  visible: boolean;
  pricePerDay: number | null;
  availableQuantity: number | null;
  inventoryLocation: string;
  onClose: () => void;
  onSubmit: () => void;
  onPriceChange: (value: number) => void;
  onQuantityChange: (value: number) => void;
  onLocationChange: (value: string) => void;
}

export const AddRentableModal: React.FC<AddRentableModalProps> = ({
  vehicle,
  visible,
  pricePerDay,
  availableQuantity,
  inventoryLocation,
  onClose,
  onSubmit,
  onPriceChange,
  onQuantityChange,
  onLocationChange,
}) => {
  return (
    <Modal
      title={`Add ${vehicle?.name} to Rentable`}
      open={visible}
      onCancel={onClose}
      onOk={onSubmit}
    >
      <Select
        placeholder="Select available quantity"
        style={{ width: "100%" }}
        onChange={onQuantityChange}
      >
        {Array.from(
          { length: parseInt(vehicle?.quantity || "0") },
          (_, i) => (
            <Select.Option key={i + 1} value={i + 1}>
              {i + 1}
            </Select.Option>
          )
        )}
      </Select>

      <Input
        type="number"
        placeholder="Price per day"
        style={{ marginTop: "12px" }}
        value={pricePerDay || ""}
        onChange={(e) => onPriceChange(parseFloat(e.target.value))}
      />

      <Input
        type="text"
        placeholder="Inventory Location"
        style={{ marginTop: "12px" }}
        value={inventoryLocation}
        onChange={(e) => onLocationChange(e.target.value)}
      />
    </Modal>
  );
};
