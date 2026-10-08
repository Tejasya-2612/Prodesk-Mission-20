import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({ name:{type:String,required:true,trim:true,maxLength:100}, email:{type:String,required:true,unique:true,lowercase:true,trim:true}, password:{type:String,required:true,select:false}, role:{type:String,enum:['admin','client'],default:'client',immutable:true}, company:{type:String,trim:true,default:''} },{timestamps:true});
export default mongoose.model('User',userSchema);
