export declare function createNotification(data: {
    userId: string;
    title: string;
    body: string;
    type?: string;
    linkUrl?: string;
}): Promise<{
    type: string;
    body: string;
    id: string;
    channel: import("@prisma/client").$Enums.NotificationChannel;
    title: string;
    linkUrl: string | null;
    metadata: import("@prisma/client/runtime/library").JsonValue | null;
    readAt: Date | null;
    sentAt: Date;
    userId: string;
}>;
//# sourceMappingURL=notification.service.d.ts.map