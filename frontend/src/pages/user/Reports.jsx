import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import { analyticsAPI } from '../../services/api';

function Reports() {
  const [dateRange, setDateRange] = useState('month');
  const [selectedCompany, setSelectedCompany] = useState('all');

  const { data: frequencyData } = useQuery({
    queryKey: ['analytics', 'frequency', dateRange, selectedCompany],
    queryFn: () => analyticsAPI.getFrequency({ dateRange, companyId: selectedCompany })
  });

  const { data: effectivenessData } = useQuery({
    queryKey: ['analytics', 'effectiveness'],
    queryFn: analyticsAPI.getEffectiveness
  });

  const { data: trendsData } = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: analyticsAPI.getTrends
  });

  const handleExport = async (type) => {
    try {
      const response = await analyticsAPI.exportReports({ type });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${type}-${new Date().toISOString()}.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="space-x-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Communication Frequency Chart */}
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-bold mb-4">Communication Frequency</h2>
          <BarChart width={500} height={300} data={frequencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="method" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Engagement Effectiveness */}
        <div className="p-4 border rounded bg-white">
          <h2 className="text-lg font-bold mb-4">Engagement Effectiveness</h2>
          <LineChart width={500} height={300} data={effectivenessData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="responseRate" stroke="#82ca9d" />
          </LineChart>
        </div>

        {/* Overdue Trends */}
        <div className="p-4 border rounded bg-white col-span-2">
          <h2 className="text-lg font-bold mb-4">Overdue Communication Trends</h2>
          <LineChart width={1000} height={300} data={trendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="overdueCount" stroke="#ff7300" />
          </LineChart>
        </div>
      </div>

      {/* Real-time Activity Log */}
      <div className="mt-6 p-4 border rounded bg-white">
        <h2 className="text-lg font-bold mb-4">Activity Log</h2>
        <div className="max-h-60 overflow-y-auto">
          {activityLog?.map(activity => (
            <div 
              key={activity.id} 
              className="py-2 border-b last:border-b-0"
            >
              <span className="text-gray-500 text-sm">
                {new Date(activity.timestamp).toLocaleString()}
              </span>
              <span className="ml-4">{activity.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;