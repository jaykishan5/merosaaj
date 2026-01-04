import Notification from "@/models/Notification";
import dbConnect from "./mongodb";

export async function createNotification({
    title,
    message,
    type = "other",
    link = ""
}: {
    title: string;
    message: string;
    type?: "order" | "alert" | "user" | "other";
    link?: string;
}) {
    try {
        await dbConnect();
        const notification = await Notification.create({
            title,
            message,
            type,
            link
        });
        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
        return null;
    }
}
