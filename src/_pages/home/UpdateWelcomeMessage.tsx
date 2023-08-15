import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateRoom } from '@/hooks'

type Props = {
  roomID: string
  onSuccess: (data: { welcomeMessage: string }) => void
  defaultValues: { welcomeMessage: string }
}

const formSchema = z.object({
  welcomeMessage: z.string(),
})

export function UpdateWelcomeMessage(props: Props) {
  const { roomID, onSuccess, defaultValues } = props
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })
  const { mutate } = useUpdateRoom()
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      { roomID, welcomeMessage: values.welcomeMessage },
      {
        onSuccess(data) {
          onSuccess({ welcomeMessage: data.welcome_message })
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="welcomeMessage"
          render={({ field }) => (
            <FormItem className="relative">
              <FormControl>
                <Textarea id="welcomeMessage" placeholder="Use [username] syntax to mention people" className="mb-3" {...field} />
              </FormControl>
              <FormMessage className="absolute -bottom-6 text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="secondary"
          className="w-auto h-auto px-4 py-1 ml-auto block"
        >
          Update
        </Button>
      </form>
    </Form>
  )
}
