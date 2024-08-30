

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb'; 
import Review from '../../../models/Review'; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');
  const reviewId = searchParams.get('requestId'); 


  try {
    await dbConnect(); 


    let reviews;

    if (reviewId) {
      reviews = await Review.findById(reviewId);

      if (!reviews) {
        return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      }
    } else if (role === 'admin') {
      reviews = await Review.find({});
    } else if (role === 'team_member' && userId) {
 
      reviews = await Review.find({ submittedBy: userId });
    } else {
      return NextResponse.json({ error: 'Invalid role or missing userId' }, { status: 400 });
    }

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get('reviewId');
  const { status } = await request.json();

  if (!reviewId) {
    return NextResponse.json({ message: 'Review ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ updatedReview }, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ message: 'Failed to update review', error }, { status: 500 });
  }
}