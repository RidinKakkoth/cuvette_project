
import dbConnect from '../../../../lib/mongodb'; 
import Review from '../../../../models/Review';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const { productId, name, description, price, image, submittedBy } = Object.fromEntries(formData);
console.log(productId,name,price,submittedBy,description,image,"========");

    if (!productId || !name || !description || !price ||!image|| !submittedBy) {
      throw new Error('Missing required fields');
    }

    const review = new Review({
      productId,
      name,
      description,
      price,
      imageUrl:image,
      submittedBy
    });

    await review.save();
    return NextResponse.json({ message: 'Review submitted successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Failed to submit review', details: error.message }, { status: 500 });
  }
}
