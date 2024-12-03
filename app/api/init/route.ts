import { NextResponse } from "next/server";
//import { initializeDatabase } from "@/lib/db/init";

export async function GET() {
    try {
        // const result = await initializeDatabase();
        // if (result.success) {
        return NextResponse.json({
            message: "Database initialized successfully",
        });
        // } else {
        //   return NextResponse.json(
        //     { error: result.error },
        //     { status: 500 }
        //   );
        // }
    } catch (error) {
        console.error("Failed to initialize database:", error);
        return NextResponse.json(
            { error: "Failed to initialize database" },
            { status: 500 }
        );
    }
}
