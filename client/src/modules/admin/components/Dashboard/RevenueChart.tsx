// components/RevenueChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer } from 'recharts';
import { Dayjs } from 'dayjs';
import { Booking } from '../../../../interfaces/admin/admin-dashboard';

import styles from './Dashboard.module.css'; // Import the CSS module

interface RevenueChartProps {
  bookings: Booking[];
  dateRange: [Dayjs | null, Dayjs | null];
  generateRevenueData: () => Array<{ date: string; totalRevenue: number }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ dateRange, generateRevenueData }) => {
  const revenueLineChartData = generateRevenueData();

  return (
    <div className={styles.chartSection2}>
    <h3 className={styles.chartTitle}>
      Total Revenue Per Day (
      {dateRange[0] && dateRange[1]
        ? `${dateRange[0]?.format("YYYY-MM-DD")} to ${dateRange[1]?.format("YYYY-MM-DD")}`
        : "Last 7 Days"}
      )
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={revenueLineChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="date" tick={{ fill: "#8884d8", fontSize: 12 }} tickLine={false} />
        <YAxis tick={{ fill: "#8884d8", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#f5f5f5", borderColor: "#8884d8" }} />
        <Legend verticalAlign="top" height={36} iconType="circle" />
        <Line
          type="monotone"
          dataKey="totalRevenue"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4, stroke: "#8884d8", strokeWidth: 2, fill: "#fff" }}
          activeDot={{ r: 6 }}
        />
        <Brush height={30} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>
  );
};
