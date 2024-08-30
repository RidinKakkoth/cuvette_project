import jwt from 'jsonwebtoken';

const authenticate = (handler) => async (req) => {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    return handler(req);
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
};

export default authenticate;
