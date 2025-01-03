import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    linkedInProfile: {
      type: String,
      required: true,
    },
    emails: [
        {
            type: String,
            required: true,
        }
    ],
    phoneNumbers: [
        {
            type: String,
        }
    ],
    comments: {
        type: String,
    },
    communicationPeriodicity: {
        type: Number,
        required: true,
    },
    isHighlightDisabled: {
        type: Boolean,
        default: false,
    },
    lastCommunicationDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

companySchema.index({ name : 1 });

export interface ICompany extends mongoose.Schema {
  _id: string;
  name: string;
  location: string;
  linkedInProfile: string;
  emails: string[];
  phoneNumbers: string[];
  comments: string;
  communicationPeriodicity: number;
  isHighlightDisabled: boolean;
  lastCommunicationDate?: Date;
}

export default mongoose.model<ICompany>('Company', companySchema);
