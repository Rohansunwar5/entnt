// src/pages/user/Calendar.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { scheduleAPI, communicationsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const queryClient = useQueryClient();

  const { data: schedule } = useQuery({
    queryKey: ['schedule'],
    queryFn: scheduleAPI.getAll
  });

  const { data: pastCommunications } = useQuery({
    queryKey: ['communications', 'all'],
    queryFn: () => communicationsAPI.getLatest()
  });

  const createSchedule = useMutation({
    mutationFn: scheduleAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule']);
      toast.success('Communication scheduled');
      setSelectedDate(null);
    }
  });

  const events = [
    // Past communications (gray)
    ...(pastCommunications?.map(comm => ({
      title: `${comm.companyName} - ${comm.methodName}`,
      date: comm.date,
      backgroundColor: '#666',
      borderColor: '#555',
      extendedProps: { type: 'past', ...comm }
    })) || []),
    
    // Scheduled communications (blue)
    ...(schedule?.map(sch => ({
      title: `${sch.companyName} - ${sch.methodName}`,
      date: sch.date,
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      extendedProps: { type: 'scheduled', ...sch }
    })) || [])
  ];

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
  };

  const handleEventClick = (info) => {
    const event = info.event;
    const props = event.extendedProps;
    
    if (props.type === 'past') {
      toast(
        <div>
          <div><strong>{event.title}</strong></div>
          <div>Notes: {props.notes || 'No notes'}</div>
        </div>,
        { duration: 5000 }
      );
    } else {
      if (confirm('Do you want to delete this scheduled communication?')) {
        scheduleAPI.delete(props.id);
        queryClient.invalidateQueries(['schedule']);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Communication Calendar</h1>
      </div>

      <div className="border rounded p-4 bg-white">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              Schedule Communication for {selectedDate.toLocaleDateString()}
            </h2>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                createSchedule.mutate({
                  companyId: formData.get('companyId'),
                  methodId: formData.get('methodId'),
                  date: selectedDate.toISOString().split('T')[0],
                  notes: formData.get('notes')
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1">Company</label>
                <select
                  name="companyId"
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select company</option>
                  {companies?.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Communication Method</label>
                <select
                  name="methodId"
                  className="w-full p-2 border rounded"
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

              <div>
                <label className="block mb-1">Notes</label>
                <textarea
                  name="notes"
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;