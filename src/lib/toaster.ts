import { createToaster } from '@chakra-ui/react';

// Create a global toaster instance
export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
});

// Export the toaster methods for use in components
export const { create, dismiss, error, success, info, warning, loading } = toaster;
