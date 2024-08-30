import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDb from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  await connectDb();

  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return new Response(JSON.stringify({ token }), { status: 200 });
}
