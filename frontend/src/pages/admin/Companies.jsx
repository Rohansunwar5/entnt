// src/pages/admin/Companies.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { companiesAPI } from '../../services/api';

function Companies() {
  const [editingCompany, setEditingCompany] = useState(null);
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesAPI.getAll
  });

  const createCompany = useMutation({
    mutationFn: companiesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      toast.success('Company created successfully');
      setEditingCompany(null);
    }
  });

  const updateCompany = useMutation({
    mutationFn: ({ id, data }) => companiesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      toast.success('Company updated successfully');
      setEditingCompany(null);
    }
  });

  const deleteCompany = useMutation({
    mutationFn: companiesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      toast.success('Company deleted successfully');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      location: formData.get('location'),
      linkedinProfile: formData.get('linkedinProfile'),
      emails: formData.get('emails').split(',').map(email => email.trim()),
      phoneNumbers: formData.get('phoneNumbers').split(',').map(phone => phone.trim()),
      comments: formData.get('comments'),
      communicationPeriodicity: parseInt(formData.get('communicationPeriodicity'))
    };

    if (editingCompany) {
      updateCompany.mutate({ id: editingCompany.id, data });
    } else {
      createCompany.mutate(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Companies</h1>
        <button
          onClick={() => setEditingCompany({})}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Company
        </button>
      </div>

      <div className="grid gap-4">
        {companies?.map(company => (
          <div key={company.id} className="p-4 border rounded">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold">{company.name}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingCompany(company)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this company?')) {
                      deleteCompany.mutate(company.id);
                    }
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>Location: {company.location}</div>
              <div>LinkedIn: {company.linkedinProfile}</div>
              <div>Emails: {company.emails.join(', ')}</div>
              <div>Phones: {company.phoneNumbers.join(', ')}</div>
              <div className="col-span-2">Comments: {company.comments}</div>
              <div>Communication Period: Every {company.communicationPeriodicity} weeks</div>
            </div>
          </div>
        ))}
      </div>

      {editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">
              {editingCompany.id ? 'Edit Company' : 'Add Company'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Company Name</label>
                <input
                  name="name"
                  defaultValue={editingCompany.name}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Location</label>
                <input
                  name="location"
                  defaultValue={editingCompany.location}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">LinkedIn Profile</label>
                <input
                  name="linkedinProfile"
                  defaultValue={editingCompany.linkedinProfile}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Emails (comma-separated)</label>
                <input
                  name="emails"
                  defaultValue={editingCompany.emails?.join(', ')}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Phone Numbers (comma-separated)</label>
                <input
                  name="phoneNumbers"
                  defaultValue={editingCompany.phoneNumbers?.join(', ')}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Comments</label>
                <textarea
                  name="comments"
                  defaultValue={editingCompany.comments}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1">Communication Periodicity (weeks)</label>
                <input
                  type="number"
                  name="communicationPeriodicity"
                  defaultValue={editingCompany.communicationPeriodicity || 2}
                  className="w-full p-2 border rounded"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setEditingCompany(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Companies;