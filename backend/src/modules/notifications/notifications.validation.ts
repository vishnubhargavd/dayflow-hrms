import { z } from 'zod';
import { NotificationType } from '@prisma/client';

export const notificationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  isRead: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }),
  type: z.nativeEnum(NotificationType).optional(),
});

export const markNotificationReadParamsSchema = z.object({
  id: z.string().uuid('Invalid notification ID'),
});
