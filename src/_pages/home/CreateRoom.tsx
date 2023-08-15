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
import { useCreateRoom } from '@/hooks/useCreateRoom'
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
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

type Props = {
  close: () => void
}
const formSchema = z.object({
  topic: z.string().min(1, {
    message: 'Topic is required',
  }),
  language: z.string(),
  max_participants: z.string(),
})

export function CreateRoom(props: Props) {
  const { close } = props
  const { mutate, isLoading } = useCreateRoom()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      language: 'english',
      max_participants: '5',
    },
  })

  const { topic: topicError } = form.formState.errors

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(
      { ...values, max_participants: parseInt(values.max_participants) },
      {
        onSuccess: () => {
          close()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1 mt-2"
      >
        <div
          className={twMerge(
            'grid grid-cols-[1fr_180px] items-center gap-4 mb-4',
            clsx(topicError && 'mb-8')
          )}
        >
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input
                    className={twMerge(
                      'without-ring',
                      clsx(topicError && 'border-red-500')
                    )}
                    placeholder="Enter topic"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-6 text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Participants</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="ring-offset-bg-2">
                      <SelectValue placeholder="Unlimited" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup className="px-1 py-2">
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="ring-offset-bg-2">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup className="px-1 py-2">
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
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
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            disabled={Boolean(topicError) || isLoading}
            className="px-5 ring-offset-bg-2 space-x-2"
            type="submit"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>Submit</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
