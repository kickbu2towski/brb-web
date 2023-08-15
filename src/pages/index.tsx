import { CSSProperties, useState } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreateRoom, RoomCard } from '@/_pages/home'
import { useRooms } from '@/hooks'

export default function Home() {
  const [open, setOpen] = useState(false)
  const { data: rooms, isSuccess  } = useRooms()

  if(!isSuccess) {
    return null
  }

  return (
    <div className="h-full p-10 overflow-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8 flex items-center gap-2">
            <Plus size={19} />
            <span>Create a new room</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4 py-6">
          <CreateRoom close={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      <div
        className="grid ram gap-4"
        style={{ '--ram-min-width': '370px' } as CSSProperties}
      >
        {rooms.map((room) => (
          <RoomCard room={room} key={room.id}/>
        ))}
      </div>
    </div>
  )
}
