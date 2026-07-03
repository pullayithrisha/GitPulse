import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1D9E75', '#3B82F6', '#F59E0B', '#8B5CF6', '#F43F5E'];

function LanguageChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h3 className="chart-header">Top languages</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No language data available.</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.language,
    value: item.count
  }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 className="chart-header">Top languages</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderColor: 'var(--card-border)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                boxShadow: '0 8px 30px rgba(133, 124, 110, 0.15)',
                fontSize: '14px'
              }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              iconType="square"
              wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LanguageChart;
