import { NextRequest, NextResponse } from "next/server";

// Mock user database - in a real app, this would be a database
const users = [
  {
    id: "1",
    email: "admin@vina.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    email: "therapist@vina.com",
    password: "therapist123",
    name: "Dr. Sarah Johnson",
    role: "therapist",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    email: "user@vina.com",
    password: "user123",
    name: "John Doe",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user by email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create a simple token (in a real app, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: userWithoutPassword,
      token,
    });

    // Set token in cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
