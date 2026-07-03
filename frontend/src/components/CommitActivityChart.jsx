import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function CommitActivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h3 className="chart-header">Commit activity, last 12 months</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No commit activity found.</p>
      </div>
    );
  }

  // Aggregate 52 weekly data points into monthly data points
  const chartDataObj = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  for(let i = 0; i < data.length; i++) {
     const weeksAgo = (data.length - 1) - i;
     const d = new Date();
     d.setDate(d.getDate() - (weeksAgo * 7));
     
     const monthKey = d.getFullYear() + "-" + d.getMonth();
     const monthName = monthNames[d.getMonth()];
     
     if (!chartDataObj[monthKey]) {
         chartDataObj[monthKey] = { name: monthName, commits: 0, sortKey: d.getTime() };
     }
     chartDataObj[monthKey].commits += data[i];
  }
  
  const chartData = Object.values(chartDataObj).sort((a, b) => a.sortKey - b.sortKey);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 className="chart-header">Commit activity, last 12 months</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(133, 124, 110, 0.05)' }}
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderColor: 'var(--card-border)',
                borderRadius: '8px',
                color: 'var(--text-main)',
                boxShadow: '0 8px 30px rgba(133, 124, 110, 0.15)',
                fontSize: '14px'
              }}
              labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
            />
            <Bar 
              dataKey="commits" 
              fill="var(--accent-solid)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CommitActivityChart;
