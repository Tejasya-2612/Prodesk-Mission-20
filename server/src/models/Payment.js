import mongoose from 'mongoose';
const schema=new mongoose.Schema({invoiceId:{type:mongoose.Schema.Types.ObjectId,ref:'Invoice',required:true,index:true},clientId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},amount:{type:Number,required:true},currency:{type:String,required:true},stripeSessionId:{type:String,required:true,unique:true},stripePaymentIntentId:{type:String,default:null},status:{type:String,enum:['paid','failed'],required:true},paidAt:{type:Date,default:null}},{timestamps:true});
export default mongoose.model('Payment',schema);
