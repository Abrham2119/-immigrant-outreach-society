// import { Exception, Rule } from "@/domain/entities/appointment";
// import { createHolidayExceptionUseCase, createRuleUseCase } from "@/domain/use-cases/rule";
// import {
//   useMutation,
//   UseMutationResult,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { AxiosError } from "axios";


// export function useRuleManagement() {
//   const queryClient = useQueryClient();

//   const createRuleMutation: UseMutationResult<void, AxiosError, Rule> = useMutation({
//     mutationFn: (form: Rule) => createRuleUseCase(form),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['rules'] });
//     },
//     onError: (error: AxiosError) => {
//       console.error("Error creating rule:", error.message);
//       queryClient.invalidateQueries({ queryKey: ['rules'] });
//     },
//   });

//   const createExceptionMutation: UseMutationResult<void, AxiosError, Exception> = useMutation({
//     mutationFn: (exception: Exception) => createHolidayExceptionUseCase(exception),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['exceptions'] });
//     },
//     onError: (error: AxiosError) => {
//       console.error("Error creating exception:", error.message);
//       queryClient.invalidateQueries({ queryKey: ['exceptions'] });
//     },
//   });

//   return { createRuleMutation, createExceptionMutation };
// }