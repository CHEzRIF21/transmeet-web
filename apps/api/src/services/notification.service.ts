import { prisma } from "../repositories/prisma.js";

export async function createNotification(data: {
  userId: string;
  title: string;
  body: string;
  type?: string;
  linkUrl?: string;
}) {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      body: data.body,
      type: data.type ?? "systeme",
      channel: "IN_APP",
      linkUrl: data.linkUrl,
    },
  });
}
