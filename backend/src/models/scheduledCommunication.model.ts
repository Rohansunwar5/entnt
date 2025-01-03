import mongoose from 'mongoose';

const ScheduledCommunicationSchema = new mongoose.Schema(
  {
    company : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    plannedMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunicationMethod',
      required: true,
    },
    ScheduledDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'overdue'],
        default: 'pending',
    }
  },
  { timestamps: true }
);

export interface IScheduledCommunication extends mongoose.Schema {
  _id: string;
  company: mongoose.Types.ObjectId;
  plannedMethod: mongoose.Types.ObjectId;
  scheduledDate: Date;
  status: 'pending' | 'completed' | 'overdue';
}

export default mongoose.model<IScheduledCommunication>('ScheduledCommunication', ScheduledCommunicationSchema);
