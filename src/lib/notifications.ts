import { prisma } from './prisma';

export async function createNotification(
  type: 'order' | 'review' | 'contact',
  title: string,
  message: string,
  link?: string
) {
  try {
    await prisma.notification.create({
      data: {
        type,
        title,
        message,
        link,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
