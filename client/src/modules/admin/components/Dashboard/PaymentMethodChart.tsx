// components/PaymentMethodChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, LabelList, ResponsiveContainer } from 'recharts';
import { Booking } from '../../../../interfaces/admin/admin-dashboard';
import styles from './Dashboard.module.css'; // Import the CSS module

interface PaymentMethodChartProps {
  bookings: Booking[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ bookings }) => {
  const paymentMethods = bookings.reduce((acc: Record<string, number>, booking: Booking) => {
    acc[booking.paymentMethod] = (acc[booking.paymentMethod] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(paymentMethods).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className={styles.chartSection}>
      <h3 className={styles.chartTitle}>Payment Method Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={5} // Add some spacing between slices
          >
            <LabelList
              dataKey="name"
              position="outside"
              fontSize={12} // Increased font size for better readability
              fill="#8884d8"
              className={styles.labelPie}
            />
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};