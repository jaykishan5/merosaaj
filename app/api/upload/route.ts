import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Path to save the file
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const path = join(uploadDir, filename);

        await writeFile(path, buffer);

        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ message: error.message || "Upload failed" }, { status: 500 });
    }
}
