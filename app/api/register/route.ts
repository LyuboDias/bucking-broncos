import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { name, password } = await request.json();
    
    // Validation
    if (!name || !password) {
      return NextResponse.json(
        { error: 'Name and password are required' },
        { status: 400 }
      );
    }
    
    // Generate username based on name
    const baseUsername = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    // Check if username exists and generate a unique one
    const { data: existingUsers } = await supabase
      .from('users')
      .select('username')
      .like('username', `${baseUsername}%`);
    
    let username = baseUsername;
    if (existingUsers && existingUsers.length > 0) {
      // Add a unique suffix
      username = `${baseUsername}_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    }
    
    // Hash the password (in a production app, you would use bcrypt or similar)
    // For demo purposes, we'll use a simple hash
    const passwordHash = Buffer.from(password).toString('base64');
    
    // Insert the new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        username,
        password_hash: passwordHash,
        is_admin: false,
        balance: 1000.00
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
    
    // Return the new user (without password)
    const { password_hash, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 