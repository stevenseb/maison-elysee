import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createUser(username: string, password: string, firstName: string, lastName: string, email: string) {
  await dbConnect();
  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    username,
    hashedPassword,
    firstName,
    lastName,
    email,
  });

  await newUser.save();
  return newUser;
}
