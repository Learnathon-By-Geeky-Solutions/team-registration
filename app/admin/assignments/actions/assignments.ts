"use server";

import { getAssignmentStatus } from "@/lib/utils/assignment";

export async function fetchAssignmentStatus() {
    try {
        const status = await getAssignmentStatus();
        return { success: true, data: status.data };
    } catch (error) {
        console.error("Error fetching assignment status:", error);
        return { success: false, error: "Failed to fetch assignment status" };
    }
}
