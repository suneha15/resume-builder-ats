'use client';

import { Box, CloseButton, Stack } from '@chakra-ui/react';
import { useNotification } from '@/hooks/useNotification';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <Box
      position="fixed"
      top="4"
      right="4"
      zIndex={9999}
      maxW="400px"
    >
      <Stack direction="column" gap={2} align="stretch">
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            bg={notification.status === 'error' ? 'red.500' : notification.status === 'success' ? 'green.500' : notification.status === 'warning' ? 'yellow.500' : 'blue.500'}
            color="white"
            p={4}
            borderRadius="md"
            boxShadow="lg"
            maxW="400px"
            position="relative"
          >
            <Box flex="1">
              <Box fontSize="sm" fontWeight="bold" mb={1}>
                {notification.title}
              </Box>
              <Box fontSize="sm">
                {notification.description}
              </Box>
            </Box>
            <CloseButton
              size="sm"
              onClick={() => removeNotification(notification.id)}
              position="absolute"
              right="8px"
              top="8px"
              color="white"
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
