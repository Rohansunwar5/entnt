import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { communicationMethodsAPI } from '../../services/api';

function CommunicationMethods() {
  const [editingMethod, setEditingMethod] = useState(null);
  const queryClient = useQueryClient();

  const { data: methods, isLoading } = useQuery({
    queryKey: ['methods'],
    queryFn: communicationMethodsAPI.getAll
  });

  const createMethod = useMutation({
    mutationFn: communicationMethodsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['methods']);
      toast.success('Method created successfully');
      setEditingMethod(null);
    }
  });

  const updateMethod = useMutation({
    mutationFn: ({ id, data }) => communicationMethodsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['methods']);
      toast.success('Method updated successfully');
      setEditingMethod(null);
    }
  });

  const updateSequence = useMutation({
    mutationFn: ({ id, sequence }) => 
      communicationMethodsAPI.updateSequence(id, { sequence }),
    onSuccess: () => {
      queryClient.invalidateQueries(['methods']);
      toast.success('Sequence updated successfully');
    }
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(methods);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sequences for all affected items
    items.forEach((item, index) => {
      if (item.sequence !== index + 1) {
        updateSequence.mutate({ id: item.id, sequence: index + 1 });
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      mandatory: formData.get('mandatory') === 'true'
    };

    if (editingMethod) {
      updateMethod.mutate({ id: editingMethod.id, data });
    } else {
      createMethod.mutate(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Communication Methods</h1>
        <button
          onClick={() => setEditingMethod({})}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Method
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="methods">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {methods?.map((method, index) => (
                <Draggable
                  key={method.id}
                  draggableId={method.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 border rounded bg-white"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                          <div className="text-sm mt-1">
                            {method.mandatory && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                Mandatory
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingMethod(method)}
                          className="px-3 py-1 bg-gray-200 rounded"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editingMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              {editingMethod.id ? 'Edit Method' : 'Add Method'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  name="name"
                  defaultValue={editingMethod.name}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingMethod.description}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Mandatory</label>
                <select
                  name="mandatory"
                  defaultValue={editingMethod.mandatory?.toString()}
                  className="w-full p-2 border rounded"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setEditingMethod(null)}
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

export default CommunicationMethods;