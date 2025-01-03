import mongoose from 'mongoose';

const communicationMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    sequence: {
        type: Number,
        required: true,
    },
    isMandatory: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true }
);

export interface ICommunicationMethod extends mongoose.Schema {
  _id: string;
  name: string;
  description: string;
  sequence: number;
  isMandatory: boolean;
}

export default mongoose.model<ICommunicationMethod>('CommunicationMethod', communicationMethodSchema);
