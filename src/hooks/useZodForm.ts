import { zodResolver } from '@hookform/resolvers/zod'
import { useForm,DefaultValues} from 'react-hook-form'
import z from 'zod'

 export const useZodForm =<T extends z.ZodType<any>>(
  schema: T,
  defaultValues?: DefaultValues<z.TypeOf<T>>|undefined,
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return { register, watch, reset, handleSubmit, errors }
}
