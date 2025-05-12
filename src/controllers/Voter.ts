import express, { Request,Response,NextFunction } from 'express'
import Voter from '../model/Voter'
import JanasenaMission, { IMissionProps } from '../model/JanasenaMission'
import JanasenaVision from '../model/JanasenaVision'
import { NodeType, PromiseType } from '../Utils/Type'
import GovernmentSchemes from '../model/GovtSchema'
import GovtSchema from '../model/GovtSchema'
import en_districts from '../model/Districts/en_districts'
import hi_districts from '../model/Districts/hi_districts'
import te_districts from '../model/Districts/te_districts'
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose'
const districtModels: Record<string, mongoose.Model<any>> = {
  en: en_districts,
  te: te_districts,
  hi: hi_districts,
};
export const create=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
try{
    const exist=await Voter.findOne({mobile:req.body.mobile})
    if(exist){
        return res.status(400).json({status:false,message:'Mobile already exists'})
    }
    const data=await Voter.create({...req.body})
    return res.status(200).json({status:true,data})
}
catch(err){
    next(err)
}
}

export const Voters = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const search = (req.query.search as string) || "";
    const sortField = (req.query.sortField as string) || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; 

    const filter: any = {};

    if (search) {
      filter.district = { $regex: new RegExp(search, 'i') }; 
    }

    const [data, total] = await Promise.all([
      Voter.find(filter)
        .select('district membersInFamily adultsArray adults name mobile') 
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder }),
      Voter.countDocuments(filter)
    ]);

    return res.status(200).json({
      status: true,
      pagination: {
        page,
        limit
      },
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const VoterInfo= async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const {id}=req.params
        const voter=await Voter.findById(id)
        return res.status(200).json({status:true,voter})
      
    } catch (err) {
      next(err);
    }
};
export const Janasena_Mission = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { en_mission, hi_mission, te_mission } = req.body
  try {
    const exist = await JanasenaMission.findOne()
    if (exist) {
      const updated=await JanasenaMission.findByIdAndUpdate(exist._id, { $set: { en_mission: en_mission, hi_mission: hi_mission, te_mission: te_mission } }, { new: true })
      return res.status(200).json({ status: true, mission: updated })
    }
    const mission = new JanasenaMission({
      en_mission: en_mission,
      hi_mission: hi_mission,
      te_mission: te_mission
    })
    await mission.save()
    return res.status(200).json({ statu: true, mission: mission })
  }
  catch (err) {
    next(err)
  }

}

export const Janasena_Vision = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { en_vision, hi_vision, te_vision } = req.body
  try {
    const exist = await JanasenaVision.findOne()
    if (exist) {
      const updated=await JanasenaVision.findByIdAndUpdate(exist._id, { $set: { 
        en_vision: en_vision, hi_vision: hi_vision, te_vision: te_vision } }, { new: true })
      return res.status(200).json({ status: true, mission: updated })
    }
    const mission = new JanasenaVision({
      en_vision: en_vision,
      hi_vision: hi_vision,
      te_vision: te_vision
    })
    await mission.save()
    return res.status(200).json({ statu: true, mission: mission })
  }
  catch (err) {
    next(err)
  }

}







export const Government_Schemes = async (req: Request, res: Response, next: NextFunction):PromiseType => {
  try {
    const { type } = req.query;
    const { scheme } = req.body;

    if (!type || typeof type !== "string") {
      return res.status(422).json({ status: false, message: 'Type is required' });
    }

    const lang = type.toLowerCase();
    const validTypes = ['en', 'hi', 'te'];
    if (!validTypes.includes(lang)) {
      return res.status(422).json({ status: false, message: 'Invalid language type' });
    }

    if (!scheme) {
      return res.status(422).json({ status: false, message: 'Scheme is required' });
    }

    // Check for duplicates in any language array
    const duplicate = await GovernmentSchemes.findOne({
      $or: [
        { 'english.scheme': scheme },
        { 'hindi.scheme': scheme },
        { 'telugu.scheme': scheme },
      ]
    });

    if (duplicate) {
      return res.status(409).json({ status: false, message: 'Scheme already exists in one of the languages' });
    }

    const updateField: any = {};
    if (lang === 'en') updateField['english'] = { scheme };
    if (lang === 'hi') updateField['hindi'] = { scheme };
    if (lang === 'te') updateField['telugu'] = { scheme };

    const updated = await GovernmentSchemes.findOneAndUpdate(
      {},
      { $push: updateField },
      { upsert: true, new: true }
    );

    return res.status(200).json({ status: true, data: updateField });
  } catch (err) {
    next(err);
  }
};

export const GetSchemesVisionMission = async (req: Request, res: Response, next: NextFunction):PromiseType => {
  try {
    const { type } = req.query;

    if (!type || !['en', 'hi', 'te'].includes(String(type))) {
      return res.status(400).json({ status: false, message: 'Invalid or missing type. Use en, hi, or te.' });
    }

    let schemeProjection: NodeType = {};
    let visionProjection: NodeType = {};
    let missionProjection: NodeType = {};

    if (type === 'en') {
      schemeProjection = { english: 1 };
      visionProjection = { en_vision: 1 };
      missionProjection = { en_mission: 1 };
    } else if (type === 'hi') {
      schemeProjection = { hindi: 1 };
      visionProjection = { hi_vision: 1 };
      missionProjection = { hi_mission: 1 };
    } else if (type === 'te') {
      schemeProjection = { telugu: 1 };
      visionProjection = { te_vision: 1 };
      missionProjection = { te_mission: 1 };
    }

    const visionKey = `${type}_vision`;
    const missionKey = `${type}_mission`;
    const schemeKey = type === 'en' ? 'english' : type === 'hi' ? 'hindi' : 'telugu';
    
    const [vision, mission, schemes] = await Promise.all([
      JanasenaVision.findOne().select({ [visionKey]: 1, _id: 0}).lean(),
      JanasenaMission.findOne().select({ [missionKey]: 1, _id: 0}).lean(),
      GovernmentSchemes.findOne().select({ [schemeKey]: 1, _id: 1 }).lean(),
    ]);

    return res.status(200).json({
      status: true,
      data: {
        schemes,
        vision,
        mission,
      },
    });
  } catch (err) {
    next(err);
  }
};


export const Update_Schema = async (req: Request, res: Response, next: NextFunction): PromiseType => {
  try {
    const { id } = req.params;
    const { scheme } = req.body;
    if (!scheme || scheme.trim() === "") {
      return res.status(422).json({ status: false, message: "scheme can't be empty" });
    }
    const doc: NodeType = await GovtSchema.findOne({
      $or: [
        { 'english._id': id },
        { 'hindi._id': id },
        { 'telugu._id': id }
      ]
    });

    if (!doc) {
      return res.status(404).json({ status: false, message: 'Not found' });
    }

    let result = null;

    const [englishMatch, hindiMatch, teluguMatch] = await Promise.all([
      doc?.english?.find((x: { _id: string }) => x._id.toString() === id.toString()),
      doc?.hindi?.find((x: { _id: string }) => x._id.toString() === id.toString()),
      doc?.telugu?.find((x: { _id: string }) => x._id.toString() === id.toString())
    ]);

    switch (true) {
      case !!englishMatch: {
        englishMatch.scheme = scheme;
        result = englishMatch;
        break;
      }
      case !!hindiMatch: {
        hindiMatch.scheme = scheme;
        result = hindiMatch;
        break;
      }
      case !!teluguMatch: {
        teluguMatch.scheme = scheme;
        result = teluguMatch;
        break;
      }
      default: {
        break;
      }
    }

    await doc.save();

    return res.status(200).json({ status: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const deleteScheme = async (req: Request, res: Response, next: NextFunction):PromiseType => {
  try {
    const { type } = req.query; 
    const {pid, cid } = req.params; 

    if (!type || !pid || !cid) {
      return res.status(422).json({ status:false,message: 'Missing required parameters.' });
    }

    const schemeKey = type === 'en' ? 'english' : type === 'hi' ? 'hindi' : 'telugu';

    const result = await GovernmentSchemes.findByIdAndUpdate(
      pid,
      { $pull: { [schemeKey]: { _id: cid } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({status:false, message: 'Scheme not found or already deleted.' });
    }

    res.status(200).json({ status:true,message: 'Scheme deleted successfully.', updatedData: result });
  } catch (err) {
    next(err);
  }
};
export const mapDistricts1 = async (req: Request, res: Response, next: NextFunction):PromiseType => {
 const session=await mongoose.startSession()
 session.startTransaction()
  try {
    const {type}=req.query
    const model = districtModels[type as string];
    if(!type){
      await session.abortTransaction()
      session.endSession()
      return res.status(422).json({ status: false, message: 'Type is required' });
    }
    const {district,constituency,division,village,pincode}=req.body
    if(!district || !constituency || !division || !village || !pincode){
      await session.abortTransaction()
      session.endSession()
      return res.status(422).json({ status: false, message: 'All fields are required' });
    } 
   if(pincode.length<6 || pincode.length>6){
    await session.abortTransaction()
    session.endSession()
    return res.status(422).json({ status: false, message: 'Pincode must be 6 digits' });
   }
    switch(type){
     case 'en':{
      const data=new en_districts({...req.body})
      await data.save({session})
      break;
     }
     case 'te':{
      const data=new te_districts({...req.body})
      await data.save({session})
      break;
     }
     case 'hi':{
      const data=new hi_districts({...req.body})
      await data.save({session})
      break;
     }
     default: {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: false, message: 'Invalid type specified' });
    }
    }
    await session.commitTransaction()
      session.endSession()
    return res.status(200).json({ status: true});

  } catch (err:NodeType) {
    await session.abortTransaction()
    session.endSession()
   
    next(err);
  }
};


export const mapDistricts= async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const {type}=req.query
    const model = districtModels[type as string];
    if(!type){
      return res.status(422).json({ status: false, message: 'Type is required' });
    }
    const result = await model.aggregate([
      {
        $group: {
          _id: {
            district: "$district",
            constituency: "$constituency",
            division: "$division"
          },
          villages: {
            $push: {
              village: "$village",
              pincode: "$pincode"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            district: "$_id.district",
            constituency: "$_id.constituency"
          },
          divisions: {
            $push: {
              division: "$_id.division",
              villages: "$villages"
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.district",
          constituencies: {
            $push: {
              constituency: "$_id.constituency",
              divisions: "$divisions"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          district: "$_id",
          constituencies: 1
        }
      }
    ]);
    

    // Now map the aggregation result to include UUIDs and hierarchical structure
    const structured = {
      districts: result.map((d) => {
        const districtId = uuidv4();
        return {
          id: districtId,
          name: d.district,
          constituencies: d.constituencies.map((c:any) => {
            const constituencyId = uuidv4();
            return {
              id: constituencyId,
              name: c.constituency,
              divisions: c.divisions.map((div:any) => {
                const divisionId = uuidv4();
                return {
                  id: divisionId,
                  name: div.division,
                  areas: div.villages.map((v:any) => ({
                    id: uuidv4(),
                    name: v.village,
                    pincode: v.pincode
                  }))
                };
              })
            };
          })
        };
      })
    };
    

    // Send the structured data as a JSON response
    res.json(structured);
  } catch (err) {
    // Handle any errors and pass to next middleware
    next(err);
  }
};
