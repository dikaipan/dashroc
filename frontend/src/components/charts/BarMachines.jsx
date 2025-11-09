// src/components/BarMachines.jsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function BarMachines({ machinesFiltered, filterCategory, filterValue }) {
  // Use provided machines data or default to empty array
  const machines = machinesFiltered || [];

  // Group machines by area group and count them
  const machinesByArea = machines.reduce((acc, machine) => {
    const area = machine.area_group || 'Unknown';
    const region = machine.region || 'Unknown';
    
    const key = area;
    if (!acc[key]) {
      acc[key] = { area, region, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {});

  const dataFiltered = Object.values(machinesByArea).filter((d) => {
    if (!filterValue) return true;
    if (filterCategory === "REGION") return d.region === filterValue;
    if (filterCategory === "AREA GROUP") return d.area === filterValue;
    return true; // Vendor tidak relevan untuk machines
  });

  // Convert to recharts format
  const chartData = dataFiltered.map((d) => ({
    area: d.area,
    count: d.count
  }));

  return (
    <div style={{ width: "100%", height: "280px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="area" 
            tick={{ fill: "#cbd5e1", fontSize: 12 }} 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#0f172a", 
              border: "2px solid #3b82f6", 
              borderRadius: "8px", 
              color: "#ffffff" 
            }}
            labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
            itemStyle={{ color: "#ffffff" }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}