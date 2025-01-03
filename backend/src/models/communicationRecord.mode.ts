import mongoose from 'mongoose';

const communicationRecordSchema = new mongoose.Schema(
  {
    company : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    methodUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunicationMethod',
      required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    notes: {
        type: String,
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
  },
  { timestamps: true }
);

export interface ICommunicationRecord extends mongoose.Schema {
  _id: string;
  company: mongoose.Types.ObjectId;
  methodUsed: mongoose.Types.ObjectId;
  date: Date;
  notes: string;
  performedBy: mongoose.Types.ObjectId;
}

export default mongoose.model<ICommunicationRecord>('CommunicationRecord', communicationRecordSchema);
