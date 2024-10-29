// // src/components/vehicles/VehicleCard.tsx
// import React from 'react';
// import { Card, Button, Image, Space, Tooltip } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusCircleOutlined, InfoCircleOutlined, LeftOutlined, RightOutlined, CarOutlined, TeamOutlined, FireOutlined } from '@ant-design/icons';
// import { Vehicle } from '@/interfaces/admin-interfaces/vehicle-types';
// import styles from './vehicle-card.module.css';

// interface VehicleCardProps {
//   vehicle: Vehicle;
//   index: number;
//   currentImageIndex: number;
//   onPrevImage: () => void;
//   onNextImage: () => void;
//   onEdit: () => void;
//   onDelete: () => void;
//   onAddRentable: () => void;
//   onShowDetails: () => void;
// }

// export const VehicleCard: React.FC<VehicleCardProps> = ({
//   vehicle,
//   index,
//   currentImageIndex,
//   onPrevImage,
//   onNextImage,
//   onEdit,
//   onDelete,
//   onAddRentable,
//   onShowDetails,
// }) => {
//   return (
//     <Card hoverable className={styles.vehicleCard}>
//       <div className={styles.imageContainer}>
//         <Button
//           className={styles.scrollButton}
//           onClick={onPrevImage}
//           icon={<LeftOutlined />}
//           disabled={currentImageIndex === 0}
//         />
//         <Image
//           src={
//             currentImageIndex === 0
//               ? vehicle.primaryImageUrl
//               : vehicle.otherImageUrls?.[currentImageIndex - 1]
//           }
//           alt="Vehicle Image"
//           className={styles.displayImage}
//         />
//         <Button
//           className={styles.scrollButton}
//           onClick={onNextImage}
//           icon={<RightOutlined />}
//           disabled={vehicle.otherImageUrls?.length === 0}
//         />
//       </div>

//       <Card.Meta
//         title={vehicle.name}
//         description={`Year: ${vehicle.year}| Rented: ${vehicle.isRented ? "Yes" : "No"}`}
//       />

//       <div className={styles.vehicleInfo}>
//         <div className={styles.detailItem}>
//           <Tooltip title="Transmission">
//             <CarOutlined /> {vehicle.transmission}
//           </Tooltip>
//         </div>
//         <div className={styles.detailItem}>
//           <Tooltip title="Fuel Type">
//             <FireOutlined /> {vehicle.fuelType}
//           </Tooltip>
//         </div>
//         <div className={styles.detailItem}>
//           <Tooltip title="Number of Seats">
//             <TeamOutlined /> {vehicle.numberOfSeats}
//           </Tooltip>
//         </div>
//       </div>

//       <div className={styles.cardActions}>
//         <Space style={{ marginTop: "16px" }}>
//           <Tooltip title="Edit Vehicle">
//             <Button
//               icon={<EditOutlined />}
//               onClick={onEdit}
//               shape="circle"
//               size="large"
//             />
//           </Tooltip>
//           <Tooltip title="Delete Vehicle">
//             <Button
//               icon={<DeleteOutlined />}
//               onClick={onDelete}
//               danger
//               shape="circle"
//               size="large"
//             />
//           </Tooltip>
//           <Tooltip title={vehicle.isRented ? "Rented" : "Add to Rentable"}>
//             <Button
//               icon={<PlusCircleOutlined />}
//               onClick={onAddRentable}
//               shape="circle"
//               size="large"
//               style={{
//                 backgroundColor: vehicle.isRented ? "#52c42b" : undefined,
//                 color: vehicle.isRented ? "white" : "#52c42b",
//                 borderColor: vehicle.isRented ? "#52c42b" : "#52c42b",
//               }}
//               disabled={vehicle.isRented}
//             />
//           </Tooltip>
//           <Tooltip title="More Details">
//             <Button
//               icon={<InfoCircleOutlined />}
//               onClick={onShowDetails}
//               shape="circle"
//               size="large"
//             />
//           </Tooltip>
//         </Space>
//       </div>
//     </Card>
//   );
// };
