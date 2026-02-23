import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionTokenPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as SessionTokenPayload;

    return NextResponse.json({
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        image: decoded.image ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }
}
