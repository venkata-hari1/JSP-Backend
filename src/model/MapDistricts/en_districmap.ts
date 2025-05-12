import mongoose, { Schema, Document } from 'mongoose';

interface IVillage {
  name: string;
  villagekey: string;
  pincode: string;
}

interface IDivision {
  divisionname: string;
  divisionkey: string; 
  villages: IVillage[];
}

interface IConstituency {
  constituencename: string;
  constituencykey: string;  
  divisions: IDivision[];
}

export interface IDistrict extends Document {
  districtname: string;
  districtkey: string;
  constituencies: IConstituency[];
  private:boolean
}

const VillageSchema = new Schema<IVillage>({
  name: { type: String, required: true },
  villagekey: { type: String, required: true },
  pincode: { type: String, required: true },
});

const DivisionSchema = new Schema<IDivision>({
  divisionname: { type: String, required: true },
  divisionkey: { type: String, required: true ,index: true }, 
  villages: { type: [VillageSchema], default: [] },
});

const ConstituencySchema = new Schema<IConstituency>({
  constituencename: { type: String, required: true },
  constituencykey: { type: String, required: true ,index: true },  
  divisions: { type: [DivisionSchema], default: [] },
});

const en_districmap = new Schema<IDistrict>({
  districtname: { type: String, required: true },
  districtkey: { type: String, required: true,index: true },
  constituencies: { type: [ConstituencySchema], default: []},
  private:{type:Boolean,default:false}
});

const DistrictModel = mongoose.model<IDistrict>('en_districmap', en_districmap);

export default DistrictModel;
