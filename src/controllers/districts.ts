import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import en_districtmap from '../model/MapDistricts/en_districmap';
import te_districtmap from '../model/MapDistricts/te_districmap';
import hi_districtmap from '../model/MapDistricts/hi_districmap';
import { NodeType, PromiseType } from '../Utils/Type';

const districtModels: Record<string, mongoose.Model<any>> = {
  en: en_districtmap,
  te: te_districtmap,
  hi: hi_districtmap,
};

export const create_districts = async (
  req: Request,
  res: Response,
  next: NextFunction
): PromiseType => {
  try {
    const { district, districtkey } = req.body;
    const { type } = req.query;
    if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
      return res.status(422).json({
        status: false,
        error: 'Invalid or missing language type (en, te, hi).',
      });
    }
    if (!district || !districtkey) {
      return res.status(422).json({
        status: false,
        error: 'Both district and districtkey are required.',
      });
    }

    const Model = districtModels[type as string];

    const existingDistrict = await Model.findOne({
      $or: [
        { districtkey:districtkey},
        { districtname:district }
      ]
    });
    
    if (existingDistrict) {
      return res.status(409).json({
        status: false,
        error: `District with key ${districtkey} or name ${district} already exists`,
      });
    }
    const newDistrict = new Model({
        districtname: district,
        districtkey:districtkey,
      });
    await newDistrict.save();

  

    return res.status(201).json({
      status: true,
      message: 'District created successfully.',
      data: newDistrict,
    });
  } catch (err) {
    next(err);
  }
};

export const district=async(req:Request,res:Response,next:NextFunction):PromiseType=>{
  try{
    const { type } = req.query;
    const {id}=req.params
    if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
      return res.status(422).json({
        status: false,
        error: 'Invalid or missing language type (en, te, hi).',
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({
        status: false,
        message: 'Invalid district ID.',
      });
    }
    const Model = districtModels[type as string];
    const existingDistrict = await Model.findById({_id:id });
    return res.status(200).json({status:true,existingDistrict})
  
  }
  catch(err){
    next(err)
  }
  }
export const districts=async(req:Request,res:Response,next:NextFunction):PromiseType=>{
    try{
      const { type } = req.query;
      if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
        return res.status(422).json({
          status: false,
          error: 'Invalid or missing language type (en, te, hi).',
        });
      }
  
      const Model = districtModels[type];
      const Districts = await Model.find({});
      return res.status(200).json({status:true,Districts})
    
    }
    catch(err){
      next(err)
    }
    }
export const create_constituencies = async (
  req: Request,
  res: Response,
  next: NextFunction
): PromiseType => {
  try {
    const { districtkey } = req.params; 
    const { constituencename, constituencykey } = req.body;
    const { type } = req.query;
    if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
      return res.status(422).json({
        status: false,
        message: 'Invalid or missing language type (en, te, hi).',
      });
    }
   
    if (!constituencename || !constituencykey) {
      return res.status(422).json({
        status: false,
        message: 'Both constituencename and constituencykey are required.',
      });
    }

   
    const Model = districtModels[type];
    // Find the district by its ID
    const district = await Model.findOne({districtkey:districtkey});
    if (!district) {
      return res.status(404).json({
        status: false,
        message: 'District not found.',
      });
    }
    const existingConstituency = await Model.findOne({
      districtkey: districtkey,
      $or: [
        { 'constituencies.constituencykey': constituencykey },
        { 'constituencies.constituencename': constituencename }
      ]
    });
    
    if (existingConstituency) {
      const match = existingConstituency.constituencies.find((c:any) =>
        c.constituencykey === constituencykey || c.constituencename === constituencename
      );
    
      if (match?.constituencykey === constituencykey) {
        return res.status(409).json({
          status: false,
          message: `Constituency with key ${constituencykey} already exists in this district.`,
        });
      }
    
      if (match?.constituencename === constituencename) {
        return res.status(409).json({
          status: false,
          message: `Constituency with name ${constituencename} already exists in this district.`,
        });
      }
    }
    
    const newConstituency = {
      constituencename,
      constituencykey,
    };
    district.constituencies.push(newConstituency);
    await district.save();
   
    return res.status(200).json({
      status: true,
      message: 'Constituency created successfully.',
      data: newConstituency,
    });
  } catch (err) {
    next(err); 
  }
};


export const create_divisons = async (
  req: Request,
  res: Response,
  next: NextFunction
): PromiseType => {
  try {
    const { type } = req.query;
    const { did, cid } = req.params; 
    const { divisionname, divisionkey } = req.body;
    if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
      return res.status(422).json({
        status: false,
        message: 'Invalid or missing language type (en, te, hi).',
      });
    }
    if (!divisionname || !divisionkey) {
      return res.status(422).json({
        status: false,
        message: 'Both divisionname and divisionkey are required.',
      });
    }
    const Model = districtModels[type];

    const district = await Model.findOne({districtkey:did});
    if (!district) {
      return res.status(404).json({
        status: false,
        message: 'District not found.',
      });
    }
    const constituency = district.constituencies.find(
      (c:{constituencykey:string}) => c.constituencykey === cid
    );
    if (!constituency) {
      return res.status(404).json({
        status: false,
        message: 'Constituency not found.',
      });
    }
    const existingDivision = await Model.findOne({
      districtkey: did, 
      'constituencies.constituencykey': cid, 
      $or: [  
        { 'constituencies.divisions.divisionkey': divisionkey }, 
        { 'constituencies.divisions.divisionname': divisionname }  
      ]
    });
    
    if (existingDivision) {
      return res.status(409).json({
        status: false,
        message: `Division with key "${divisionkey}" or name "${divisionname}" already exists in this constituency.`,
      });
    }
    const newDivision = {
      divisionname,
      divisionkey,
    };
    constituency.divisions.push(newDivision);
    await district.save();
    
    return res.status(201).json({
      status: true,
      message: 'Division created successfully.',
      data: newDivision,
    });
  } catch (err) {
    next(err); 
  }
};



export const create_Village_Pincode = async (
  req: Request,
  res: Response,
  next: NextFunction
): PromiseType => {
  try {
    const { type } = req.query;
    const { did, cid, dvid } = req.params;
    const { village, villagekey, pincode } = req.body;

    // Validate type
    if (typeof type !== 'string' || !['en', 'te', 'hi'].includes(type)) {
      return res.status(422).json({
        status: false,
        message: 'Invalid or missing language type (en, te, hi).',
      });
    }
   
      const Model = districtModels[type];
      const district = await Model.findOne({districtkey:did});
      if (!district) {
        return res.status(404).json({ status: false, message: 'District not found.' });
      }
  
      const constituency = district.constituencies.find(
        (c:{constituencykey:string}) => c.constituencykey === cid
      );
      if (!constituency) {
        return res.status(404).json({ status: false, message: 'Constituency not found.' });
      }
  
      const division = constituency.divisions.find((d:{divisionkey:string}) => d.divisionkey === dvid);
      if (!division) {
        return res.status(404).json({ status: false, message: 'Division not found.' });
      }
  
    // Validate required fields
    if (!village || !villagekey || !pincode) {
      return res.status(422).json({
        status: false,
        message: 'Village name, villagekey, and pincode are required.',
      });
    }

    // Validate pincode
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(422).json({
        status: false,
        message: 'Pincode must be exactly 6 digits.',
      });
    }

    // Validate ObjectIds
 

  
    // Check for duplicate villagekey
    const existingVillage = division.villages.find((v:NodeType) => v.villagekey === villagekey);
    if (existingVillage) {
      return res.status(409).json({
        status: false,
        message: `Village with key "${villagekey}" already exists.`,
      });
    }

    // Add the new village
    const newVillage = { name: village, villagekey, pincode };
    division.villages.push(newVillage);

    // Save district
    await district.save();

    if (type === 'en') {
      // await VillageKeys.create({ key: villagekey });
    }

    return res.status(201).json({
      status: true,
      message: 'Village created successfully.',
      data: newVillage,
    });
  } catch (err) {
    next(err);
  }
};









export const allDistrictsdata=async(req:Request,res:Response,next:NextFunction):PromiseType=>{
try{
  const { type,did } = req.query;
  if (!type || typeof type !== 'string') {
    return res.status(422).json({
      status: false,
      message: 'Invalid or missing type parameter.',
    });
  }

  const Model = districtModels[type];
  if (!Model) {
    return res.status(400).json({
      status: false,
      message: `No model found for type "${type}".`,
    });
  }
  switch (type){
    case 'en':{
        const alldistricts=await en_districtmap.find({}).select('districtname districtkey')
        res.status(200).json({status:true,alldistricts});
        break;
      }
    case 'te':{
        const [alldistricts,te_districts]=await Promise.all([
          en_districtmap.find({}).select('districtname districtkey'),
          te_districtmap.find({}).select('districtname districtkey')
        ])
        res.status(200).json({status:true,alldistricts,te_districts});
        break;
    }
    case 'hi':{
      const [alldistricts,hi_districts]=await Promise.all([
        en_districtmap.find({}).select('districtname districtkey'),
        hi_districtmap.find({}).select('districtname districtkey')
      ])
      res.status(200).json({status:true,alldistricts,hi_districts});
      break;
    }
    default:{
      res.status(422).json({status:false,message:'no data was not found'});
      break;
    }
    }
  

}
catch(err){
  next(err)
}
}



export const allConstituationData = async (req: NodeType, res: Response, next: NextFunction): PromiseType => {
  try {
    const { type } = req.query;
    const { districtkey } = req.params;

    if (!type || typeof type !== 'string') {
      return res.status(422).json({
        status: false,
        message: 'Invalid or missing type parameter.',
      });
    }

    const en_constituencies = await en_districtmap.aggregate([
      { $match: { districtkey: { $regex: `^${districtkey}$`, $options: 'i' } } },
      { $unwind: "$constituencies" },
      {
        $project: {
          _id: "$constituencies._id",
          constituencename: "$constituencies.constituencename",
          constituencekey: "$constituencies.constituencykey",
        }
      }
    ]);

    switch (type) {
      case 'en': {
        return res.status(200).json({
          status: true,
          constituencies: en_constituencies,
        });
      }

      case 'te': {
        const te_constituencies = await te_districtmap.aggregate([
          { $match: { districtkey: { $regex: `^${districtkey}$`, $options: 'i' } } },
          { $unwind: "$constituencies" },
          {
            $project: {
              _id: "$constituencies._id",
              constituencename: "$constituencies.constituencename",
              constituencekey: "$constituencies.constituencykey",
            }
          }
        ]);
        return res.status(200).json({
          status: true,
          constituencies: en_constituencies,
          te_constituencies: te_constituencies,
        });
      }

      case 'hi': {
        const hi_constituencies = await hi_districtmap.aggregate([
          { $match: { districtkey: { $regex: `^${districtkey}$`, $options: 'i' } } },
          { $unwind: "$constituencies" },
          {
            $project: {
              _id: "$constituencies._id",
              constituencename: "$constituencies.constituencename",
              constituencekey: "$constituencies.constituencykey",
            }
          }
        ]);
        return res.status(200).json({
          status: true,
          constituencies: en_constituencies,
          hi_constituencies: hi_constituencies,
        });
      }

      default: {
        return res.status(400).json({
          status: false,
          message: 'Invalid type value.',
        });
      }
    }
  } catch (err) {
    next(err);
  }
};


export const allDivisonsData = async (req: Request, res: Response, next: NextFunction): PromiseType => {
  try {
    const { type } = req.query;
    const { did, cid } = req.params;

    if (!type || typeof type !== 'string') {
      return res.status(422).json({
        status: false,
        message: 'Invalid or missing type parameter.',
      });
    }

    const Model = districtModels[type];
    if (!Model) {
      return res.status(400).json({
        status: false,
        message: `No model found for type "${type}".`,
      });
    }
    switch (type) {
      case 'en': {
        const divisionsResult = await en_districtmap.aggregate([
          { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
          { $unwind: "$constituencies" },
          { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
          {
            $project: {
              _id: 0,
              divisions: "$constituencies.divisions",
            }
          },
          { $unwind: "$divisions" },
          {
            $project: {
              _id: "$divisions._id",
              divisionname: "$divisions.divisionname",
              divisionkey: "$divisions.divisionkey"
            }
          }
        ]);
        res.status(200).json({
          status: true,
          divisions: divisionsResult,
        });
        break;
      }

      case 'te': {
        const [divisionsResult, te_divisionsResult] = await Promise.all([
          en_districtmap.aggregate([
            { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
            { $unwind: "$constituencies" },
            { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
            {
              $project: {
                _id: 0,
                divisions: "$constituencies.divisions",
              }
            },
            { $unwind: "$divisions" },
            {
              $project: {
                _id: "$divisions._id",
                divisionname: "$divisions.divisionname",
                divisionkey: "$divisions.divisionkey"
              }
            }
          ]),
          te_districtmap.aggregate([
            { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
            { $unwind: "$constituencies" },
            { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
            {
              $project: {
                _id: 0,
                divisions: "$constituencies.divisions",
              }
            },
            { $unwind: "$divisions" },
            {
              $project: {
                _id: "$divisions._id",
                divisionname: "$divisions.divisionname",
                divisionkey: "$divisions.divisionkey"
              }
            }
          ])
        ])
        res.status(200).json({
          status: true,
          divisions: divisionsResult,
          te_divisionsResult: te_divisionsResult
        });
        break;
      }
      case 'hi': {
        const [divisionsResult, hi_divisionsResult] = await Promise.all([
          en_districtmap.aggregate([
            { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
            { $unwind: "$constituencies" },
            { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
            {
              $project: {
                _id: 0,
                divisions: "$constituencies.divisions",
              }
            },
            { $unwind: "$divisions" },
            {
              $project: {
                _id: "$divisions._id",
                divisionname: "$divisions.divisionname",
                divisionkey: "$divisions.divisionkey"
              }
            }
          ]),
          hi_districtmap.aggregate([
            { $match: { districtkey: { $regex: `^${did}$`, $options: 'i' } } },
            { $unwind: "$constituencies" },
            { $match: { "constituencies.constituencykey": { $regex: `^${cid}$`, $options: 'i' } } },
            {
              $project: {
                _id: 0,
                divisions: "$constituencies.divisions",
              }
            },
            { $unwind: "$divisions" },
            {
              $project: {
                _id: "$divisions._id",
                divisionname: "$divisions.divisionname",
                divisionkey: "$divisions.divisionkey"
              }
            }
          ])
        ])
        res.status(200).json({
          status: true,
          divisions: divisionsResult,
          hi_divisionsResult: hi_divisionsResult
        });
        break;
      }
      default: {
        res.status(404).json({status:false,message:'No Data found'})
        break;
      }
    }



  } catch (err) {
    next(err);
  }
};

export const getAllVillagesPincode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { type } = req.query;
      const { did, cid, dvid } = req.params;
  
      if (!type || typeof type !== 'string') {
        return res.status(422).json({
          status: false,
          message: 'Invalid or missing type parameter.',
        });
      }
  
      const Model = districtModels[type];
      if (!Model) {
        return res.status(400).json({
          status: false,
          message: `No model found for type "${type}".`,
        });
      }
  
     switch (type){
      case 'en':{

        const villagesResult = await en_districtmap.aggregate([
          { $match: { districtkey:did } },
          { $unwind: "$constituencies" },
          { $match: { "constituencies.constituencykey":cid } },
          { $unwind: "$constituencies.divisions" },
          { $match: { "constituencies.divisions.divisionkey":dvid } },
          { $unwind: "$constituencies.divisions.villages" },
          {
            $project: {
              _id: "$constituencies.divisions.villages._id",
              name: "$constituencies.divisions.villages.name",
              pincode: "$constituencies.divisions.villages.pincode",
              villagekey: "$constituencies.divisions.villages.villagekey"
            }
          }
        ]);
    
        res.status(200).json({
          status: true,
          villages: villagesResult,
        });
        break;
      }
      case 'te':{

        const [villagesResult,te_villagesResult] = await Promise.all ([
          en_districtmap.aggregate([
          { $match: { districtkey:did } },
          { $unwind: "$constituencies" },
          { $match: { "constituencies.constituencykey":cid } },
          { $unwind: "$constituencies.divisions" },
          { $match: { "constituencies.divisions.divisionkey":dvid } },
          { $unwind: "$constituencies.divisions.villages" },
          {
            $project: {
              _id: "$constituencies.divisions.villages._id",
              name: "$constituencies.divisions.villages.name",
              pincode: "$constituencies.divisions.villages.pincode",
              villagekey: "$constituencies.divisions.villages.villagekey"
            }
          }
        ]),
        te_districtmap.aggregate([
          { $match: { districtkey:did } },
          { $unwind: "$constituencies" },
          { $match: { "constituencies.constituencykey":cid } },
          { $unwind: "$constituencies.divisions" },
          { $match: { "constituencies.divisions.divisionkey":dvid } },
          { $unwind: "$constituencies.divisions.villages" },
          {
            $project: {
              _id: "$constituencies.divisions.villages._id",
              name: "$constituencies.divisions.villages.name",
              pincode: "$constituencies.divisions.villages.pincode",
              villagekey: "$constituencies.divisions.villages.villagekey"
            }
          }
        ]),
      ])
    
        res.status(200).json({
          status: true,
          villages: villagesResult,
          te_villagesResult:te_villagesResult
        });
        break;
      }
      case 'hi':{

        const [villagesResult,hi_villagesResult] = await Promise.all ([
          en_districtmap.aggregate([
          { $match: { districtkey:did } },
          { $unwind: "$constituencies" },
          { $match: { "constituencies.constituencykey":cid } },
          { $unwind: "$constituencies.divisions" },
          { $match: { "constituencies.divisions.divisionkey":dvid } },
          { $unwind: "$constituencies.divisions.villages" },
          {
            $project: {
              _id: "$constituencies.divisions.villages._id",
              name: "$constituencies.divisions.villages.name",
              pincode: "$constituencies.divisions.villages.pincode",
              villagekey: "$constituencies.divisions.villages.villagekey"
            }
          }
        ]),
        hi_districtmap.aggregate([
          { $match: { districtkey:did } },
          { $unwind: "$constituencies" },
          { $match: { "constituencies.constituencykey":cid } },
          { $unwind: "$constituencies.divisions" },
          { $match: { "constituencies.divisions.divisionkey":dvid } },
          { $unwind: "$constituencies.divisions.villages" },
          {
            $project: {
              _id: "$constituencies.divisions.villages._id",
              name: "$constituencies.divisions.villages.name",
              pincode: "$constituencies.divisions.villages.pincode",
              villagekey: "$constituencies.divisions.villages.villagekey"
            }
          }
        ]),
      ])
    
        res.status(200).json({
          status: true,
          villages: villagesResult,
          hi_villagesResult:hi_villagesResult
        });
        break;
      }
      default:{
        break;
      }
     }
  
  
    } catch (err) {
      next(err);
    }
  };
  

  export const allDistrictsMasterdData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): PromiseType => {
    try {
      const {did}=req.params
      const { type } = req.query;
      if (!type || typeof type !== 'string') {
        return res.status(422).json({
          status: false,
          message: 'Invalid or missing type parameter.',
        });
      }
  
      const Model = districtModels[type];
      if (!Model) {
        return res.status(400).json({
          status: false,
          message: `No model found for type "${type}".`,
        });
      }
  
      let query = {};
      if (did && typeof did === 'string') {
   
        query = { districtkey: did };
      }
  
      const alldistricts = await Model.find(query);
  
      return res.status(200).json({ status: true, alldistricts });
    } catch (err) {
      next(err);
    }
  };
export const confirm_districts=async(req:Request,res:Response,next:NextFunction):PromiseType=>{
try{
  const {isPrivate}=req.body
  const {did}=req.params
  const {type}=req.query
  if (!type || typeof type !== 'string') {
    return res.status(422).json({
      status: false,
      message: 'Invalid or missing type parameter.',
    });
  }
  if (!mongoose.Types.ObjectId.isValid(did)) {
    return res.status(400).json({ status: false, message: 'Invalid district ID.' });
  }
if(!isPrivate){
  return res.status(422).json({
    status: false,
    message: 'Private Mode is required.',
  });
}
  const Model = districtModels[type];
  if (!Model) {
    return res.status(400).json({
      status: false,
      message: `No model found for type "${type}".`,
    });
  }
 await Model.findByIdAndUpdate({_id:did}, {$set:{private:isPrivate} },{new:true});
return res.status(200).json({status:true,message:'updated'})
}
catch(err){
  next(err)
}
  }
  
