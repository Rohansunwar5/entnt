// src/components/LogCommunicationModal.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { communicationMethodsAPI } from '../services/api';

function LogCommunicationModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    methodId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const { data: methods } = useQuery({
    queryKey: ['methods'],
    queryFn: communicationMethodsAPI.getAll
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Log Communication</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Communication Method</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.methodId}
              onChange={(e) => setFormData({...formData, methodId: e.target.value})}
              required
            >
              <option value="">Select method</option>
              {methods?.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Notes</label>
            <textarea
              className="w-full p-2 border rounded"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogCommunicationModal;