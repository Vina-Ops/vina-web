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

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get("authorization");
    const token =
      authHeader?.replace("Bearer ", "") ||
      request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // In a real app, you would verify the JWT token here
    // For now, we'll extract the user ID from our simple token format
    const tokenParts = token.split("_");
    if (tokenParts.length !== 3) {
      return NextResponse.json(
        { message: "Invalid token format" },
        { status: 401 }
      );
    }

    const userId = tokenParts[1];
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
