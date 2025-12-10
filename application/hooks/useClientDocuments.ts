import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientDocumentsService } from '@/infrastructure/api/clientDocumentsService';

export const useUploadClientFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientDocumentsService.uploadFiles,
    onSuccess: (data, variables) => {
      // Invalidate client files query
      queryClient.invalidateQueries({ 
        queryKey: ['clientFiles', variables.clientId] 
      });
    },
  });
};

export const useDeleteClientFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, fileId }: { clientId: string; fileId: string }) =>
      clientDocumentsService.deleteFile(clientId, fileId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['clientFiles', variables.clientId] 
      });
    },
  });
};

export const useClientFiles = (clientId: string) => {
  return useQuery({
    queryKey: ['clientFiles', clientId],
    queryFn: () => clientDocumentsService.getClientFiles(clientId),
    enabled: !!clientId,
  });
};