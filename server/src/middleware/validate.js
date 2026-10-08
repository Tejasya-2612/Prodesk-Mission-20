import mongoose from 'mongoose';
export function validId(req,res,next){if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid resource ID.'});next();}
