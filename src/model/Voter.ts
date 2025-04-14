import mongoose, { Schema, Document } from 'mongoose';
interface IForm extends Document {
  name: string;
  gender: string;
  mobile: number | null;
  voterId: string;
  janasenaMember: string;
  houseNo: string;
  district: string;
  constituency: string;
  division: string;
  village: string;
  pincode: string;
  adults: {
    male: number;
    female: number;
  };
  adultsArray: {
    males: Array<{ name: string; option: string }>;
    females: Array<{ name: string; option: string }>;
  };
  futureVoters: {
    boy: number;
    girl: number;
  };
  membersInFamily: number;
  employmentStatus: string;
  education: string;
  govtSchemes: {
    educationBenefits: string;
    pension: string;
    pensionForDisabled: string;
    medicalBenefits: string;
    rythuBandhu: string;
    ration: string;
    tidcoHouses: string;
  };
  issues: string;
}

// Define the Mongoose schema
const FormSchema: Schema = new Schema(
  {
 
    name: {
      type: String,
      required:true,
      trim: true,
    },
    gender: {
      type: String,
      required:true,
      enum:['Male', 'Female', 'Other'],
    },
    mobile: {
      type: Number,
      required:true
    },
    voterId: {
      type: String,
      required:true,
      enum:['Yes','No'],
    },
    janasenaMember: {
      type: String,
      required:true,
      enum: ['Yes', 'No'],
    },
    houseNo: {
      type: String,
      required:true,
      trim: true,
    },
    district: {
      type: String,
      required:true,
      trim: true,
    },
    constituency: {
      type: String,
      required:true,
      trim: true,
    },
    division: {
      type: String,
      required:true,
      trim: true,
    },
    village: {
      type: String,
      required:true,
      trim: true,
    },
    pincode: {
      type: String,
      required:true,
    },
    adults: {
      male: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      female: {
        type: Number,
        required: true,
        min:0,
        default: 0,
      },
    },
    adultsArray: {
      males: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          option: {
            type: String,
            enum:['Yes','No'],
            required: true,
          
          },
        },
      ],
      females: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          option: {
            type: String,
            enum:['Yes','No'],
            required: true,
          },
        },
      ],
    },
    futureVoters: {
      boy: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      girl: {
        type: Number,
        required: true,
        min:0,
        default: 0,
      },
    },
    membersInFamily: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    employmentStatus: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      required:true,
      trim: true,
    },
    govtSchemes: {
      educationBenefits: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
      pension: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
      pensionForDisabled: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
      medicalBenefits: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
      rythuBandhu: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
      ration: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
      tidcoHouses: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
      },
    },
    issues: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IForm>('Form', FormSchema);