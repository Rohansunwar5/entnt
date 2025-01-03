// src/pages/user/Dashboard.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  companiesAPI, 
  communicationsAPI 
} from '../../services/api';

function Dashboard() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const queryClient = useQueryClient();

  // Fetch companies with their communications
  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesAPI.getAll
  });

  // Fetch overdue communications
  const { data: overdueComms } = useQuery({
    queryKey: ['communications', 'overdue'],
    queryFn: communicationsAPI.getOverdue
  });

  // Fetch today's communications
  const { data: todayComms } = useQuery({
    queryKey: ['communications', 'today'],
    queryFn: communicationsAPI.getToday
  });

  // Mutation for logging new communication
  const logCommunication = useMutation({
    mutationFn: communicationsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      queryClient.invalidateQueries(['communications']);
      toast.success('Communication logged successfully');
      setSelectedCompanies([]);
    },
    onError: () => {
      toast.error('Failed to log communication');
    }
  });

  const handleLogCommunication = (formData) => {
    selectedCompanies.forEach(companyId => {
      logCommunication.mutate({
        companyId,
        ...formData
      });
    });
  };

  const getHighlightColor = (company) => {
    if (overdueComms?.find(c => c.companyId === company.id)) {
      return 'bg-red-100';
    }
    if (todayComms?.find(c => c.companyId === company.id)) {
      return 'bg-yellow-100';
    }
    return '';
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {/* Notifications Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-bold">Overdue Communications ({overdueComms?.length || 0})</h3>
            {overdueComms?.map(comm => (
              <div key={comm.id} className="text-sm mt-2">
                {comm.companyName} - {comm.methodName}
              </div>
            ))}
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-bold">Today's Communications ({todayComms?.length || 0})</h3>
            {todayComms?.map(comm => (
              <div key={comm.id} className="text-sm mt-2">
                {comm.companyName} - {comm.methodName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Companies</h2>
          {selectedCompanies.length > 0 && (
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Log Communication
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border p-2">Select</th>
                <th className="border p-2">Company Name</th>
                <th className="border p-2">Last 5 Communications</th>
                <th className="border p-2">Next Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {companies?.map(company => (
                <tr 
                  key={company.id}
                  className={getHighlightColor(company)}
                >
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCompanies([...selectedCompanies, company.id]);
                        } else {
                          setSelectedCompanies(selectedCompanies.filter(id => id !== company.id));
                        }
                      }}
                    />
                  </td>
                  <td className="border p-2">{company.name}</td>
                  <td className="border p-2">
                    <div className="flex gap-2">
                      {company.lastFiveCommunications?.map((comm, idx) => (
                        <div 
                          key={idx}
                          className="text-sm p-1 bg-gray-100 rounded"
                          title={comm.notes}
                        >
                          {comm.methodName} ({new Date(comm.date).toLocaleDateString()})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="border p-2">
                    {company.nextCommunication ? (
                      <div>
                        {company.nextCommunication.methodName} (
                        {new Date(company.nextCommunication.date).toLocaleDateString()})
                      </div>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Communication Modal */}
      {showLogModal && (
        <LogCommunicationModal
          onClose={() => setShowLogModal(false)}
          onSubmit={handleLogCommunication}
        />
      )}
    </div>
  );
}

export default Dashboard;