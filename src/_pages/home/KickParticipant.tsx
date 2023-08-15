import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { twMerge } from 'tailwind-merge'
import { Loader2, Skull } from 'lucide-react'
import { useUpdateRoom } from '@/hooks'
import { Kick } from '@/shared.types'

type Props = {
  close: (kick: Kick | null) => void
  kicked_by: number
  kicked: number
  roomID: string
}
const formSchema = z.object({
  reason: z.string(),
  timeout: z.string(),
})

export function KickParticipant(props: Props) {
  const { close, roomID, ...rest } = props
  const { mutate, isLoading } = useUpdateRoom()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: '',
      timeout: '60',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { timeout, reason } = values
    const kick = {
      reason,
      timeout: parseInt(timeout),
      kicked_at: new Date().toISOString(),
      ...rest
    }
    mutate({
      roomID: roomID,
      kick,
    }, {
      onSuccess() {
        close(kick)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1 mt-2"
      >
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem className="relative mb-4">
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Input
                  className={twMerge('without-ring')}
                  placeholder="Enter the reason"
                  {...field}
                />
              </FormControl>
              <FormMessage className="absolute -bottom-6 text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeout</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="ring-offset-bg-2">
                    <SelectValue placeholder="Indefinitely" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup className="px-1 py-2">
                    <SelectItem value="60">1 min</SelectItem>
                    <SelectItem value="2700">45 mins</SelectItem>
                    <SelectItem value="3600">1 hour</SelectItem>
                    <SelectItem value="10800">3 hour</SelectItem>
                    <SelectItem value="-1">Indefinitely</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            disabled={isLoading}
            variant="outline"
            className="ml-auto hover:bg-bg hover:text-fg px-5 ring-offset-bg-2"
            onClick={() => close(null)}
          >
            Cancel
          </Button>
          <Button className="px-5 ring-offset-bg-2 space-x-2" type="submit">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span className="flex items-baseline gap-1">
              <Skull className="relative top-[2px]" size={16} /> Kick{' '}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
