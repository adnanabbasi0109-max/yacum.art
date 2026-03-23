import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { signToken, COOKIE_NAME } from "@/lib/auth";
import { sendNewUserNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // Notify admin about new signup (runs after response is sent)
    after(async () => {
      await sendNewUserNotification({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt || new Date(),
      }).catch((err) => console.error('Signup email error:', err));
    });

    const response = NextResponse.json({
      user: { id: user._id, email: user.email, name: user.name },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    const message =
      error instanceof Error && error.message.includes("MONGODB_URI")
        ? "Database not configured. Please set MONGODB_URI in .env.local"
        : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
