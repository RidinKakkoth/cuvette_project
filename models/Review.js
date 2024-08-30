// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String,required:true},
  status: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID who submitted the review
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // User ID who approved the review (if applicable)
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
