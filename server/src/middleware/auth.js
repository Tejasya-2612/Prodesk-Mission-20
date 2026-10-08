import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function authenticate(req,res,next){ try {const token=req.cookies?.vaultpay_session || req.get('authorization')?.replace(/^Bearer\s+/i,''); if(!token)return res.status(401).json({message:'Authentication required.'}); const payload=jwt.verify(token,process.env.JWT_SECRET); const user=await User.findById(payload.sub).select('name email role company'); if(!user)return res.status(401).json({message:'Authentication required.'}); req.user=user; next();}catch{return res.status(401).json({message:'Authentication required.'});}}
export function allowRoles(...roles){return (req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({message:'You do not have permission to access this resource.'});}
