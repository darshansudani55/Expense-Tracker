import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/currency';
import { getCategoryColor } from '../utils/categories';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '0.75rem 1rem',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          fontSize: '0.85rem'
        }}
      >
        <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          {data.category}
        </p>
        <p style={{ color: payload[0].fill, fontWeight: 600, margin: '0.2rem 0' }}>
          {formatCurrency(data.amount)} ({data.percentage}%)
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {data.count} transaction{data.count === 1 ? '' : 's'}
        </p>
      </div>
    );
  }
  return null;
};

const CategoryPieChart = ({ data }) => {
  const hasData = data && data.length > 0 && data.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <div
        style={{
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}
      >
        No expense transactions recorded for this period.
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.category}`}
                fill={getCategoryColor(entry.category)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '12px',
              maxHeight: '60px',
              overflowY: 'auto'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
