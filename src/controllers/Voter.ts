import express, { Request,Response,NextFunction } from 'express'
import Voter from '../model/Voter'
import JanasenaMission, { IMissionProps } from '../model/JanasenaMission'
import JanasenaVision from '../model/JanasenaVision'
import { NodeType, PromiseType } from '../Utils/Type'
import GovernmentSchemes from '../model/GovtSchema'
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
  
      const [data, total] = await Promise.all([
        Voter.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Voter.countDocuments()
      ]);
  
      return res.status(200).json({
        status: true,
        pagination: {
          page,
          limit
        },
        totalPages: Math.ceil(total / limit),
        totalUsers: total ,
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

    return res.status(200).json({ status: true, data: updated });
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

    const schemes = await GovernmentSchemes.find({}, schemeProjection).lean();
    const vision = await JanasenaVision.find({}, visionProjection).lean();
    const mission = await JanasenaMission.find({}, missionProjection).lean();

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

