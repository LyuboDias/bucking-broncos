import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }
    
    // Hash the password (same method as in registration)
    const passwordHash = Buffer.from(password).toString('base64');
    
    // Check if the input is an email or username
    const isEmail = email.includes('@');
    
    // Query based on whether it's an email or username
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq(isEmail ? 'email' : 'username', email)
      .eq('password_hash', passwordHash)
      .single();
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Return the user without the password hash and map is_admin to isAdmin
    const { password_hash, is_admin, ...userWithoutPasswordAndAdmin } = user;
    return NextResponse.json({
      ...userWithoutPasswordAndAdmin,
      isAdmin: is_admin
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 