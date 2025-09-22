'use client';

import { Box, Alert, AlertIndicator, AlertTitle, AlertDescription, CloseButton, VStack } from '@chakra-ui/react';
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
      <VStack spacing={2} align="stretch">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            status={notification.status}
            variant="solid"
            borderRadius="md"
            boxShadow="lg"
            maxW="400px"
          >
            <AlertIndicator />
            <Box flex="1">
              <AlertTitle fontSize="sm" fontWeight="bold">
                {notification.title}
              </AlertTitle>
              <AlertDescription fontSize="sm">
                {notification.description}
              </AlertDescription>
            </Box>
            <CloseButton
              size="sm"
              onClick={() => removeNotification(notification.id)}
              position="absolute"
              right="8px"
              top="8px"
            />
          </Alert>
        ))}
      </VStack>
    </Box>
  );
}
