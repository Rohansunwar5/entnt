import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { analyticsAPI } from '../../services/api';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('week');

  const { data: activityData } = useQuery(['activity'], analyticsAPI.getActivity);
  
  const { data: frequencyData } = useQuery(
    ['frequency', dateRange],
    () => analyticsAPI.getFrequency({ range: dateRange })
  );

  const { data: effectivenessData } = useQuery(
    ['effectiveness', dateRange],
    () => analyticsAPI.getEffectiveness({ range: dateRange })
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Communication Activity</h3>
          {/* Activity metrics */}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Communication Methods</h3>
          {/* Method frequency chart */}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Effectiveness Metrics</h3>
          {/* Effectiveness metrics */}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {/* Activity log */}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Overdue Communications</h3>
          {/* Overdue list */}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;