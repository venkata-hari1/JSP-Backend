import mongoose, { Schema } from 'mongoose';
type IForm = {
  noOfVotersInFamily: number;
  totalMembersInFamily: number;
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
  dateofbirth:Date;
  housetype:string;
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
    nogovtSchemes:string;
  };
  issues: string;
}

// Define the Mongoose schema
const FormSchema: Schema = new Schema(
  {name: {type: String,trim: true},
    gender: {type: String},
    dateofbirth:{type:Date},
    mobile: {type: Number},
    voterId: {type: String,},
    janasenaMember: {type: String},
    houseNo: {type: String,trim: true},
    housetype:{type:String},
    district: {type: String,trim: true},
    constituency: {type: String,trim: true},
    division: {type: String,trim: true},
    village: {type: String,trim: true},
    pincode: {type: String},
    adults: {male: {type: Number,min: 0,default: 0},
    female: {type: Number,min:0,default: 0},},
    noOfVotersInFamily: {type:Number,default:0},
    totalMembersInFamily: {type:Number,default:0},
    adultsArray: {
      males: [{
          name: {
            type: String,
            
            trim: true,
          },
          option: {
            type: String,
            
          
          },
        },
      ],
      females: [
        {
          name: {
            type: String,
            
            trim: true,
          },
          option: {
            type: String,
            
          },
        },
      ],
    },
    futureVoters: {
      boy: {
        type: Number,
        
        min: 0,
        default: 0,
      },
      girl: {
        type: Number,
        
        min:0,
        default: 0,
      },
    },
    membersInFamily: {type: Number,min: 0,default: 0 },
    employmentStatus: {type: String,trim: true},
    education: {type: String,trim: true},
    govtSchemes: {
      educationBenefits: {
        type: String,
        default: 'No',
      },
      pension: {
        type: String,
        default: 'No',
      },
      pensionForDisabled: {
        type: String,
        default: 'No',
      },
      medicalBenefits: {
        type: String,
        default: 'No',
      },
      rythuBandhu: {
        type: String,
        default: 'No',
      },
      ration: {
        type: String,
        default: 'No',
      },
      tidcoHouses: {
        type: String,
        default: 'No',
      },
      nogovtSchemes:{
        type:String,
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
FormSchema.index({mobile:1},{unique:true})
export default mongoose.model<IForm>('Form', FormSchema);