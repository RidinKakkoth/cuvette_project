import connectDb from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    
    await connectDb();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists.' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    return new Response(JSON.stringify({ message: 'User created successfully.' }), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ message: 'Error creating user.' }), { status: 500 });
  }
}
