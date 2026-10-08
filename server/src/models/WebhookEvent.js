import mongoose from 'mongoose';
const schema=new mongoose.Schema({stripeEventId:{type:String,required:true,unique:true},eventType:{type:String,required:true},processedAt:{type:Date,default:Date.now}},{timestamps:true});
export default mongoose.model('WebhookEvent',schema);
