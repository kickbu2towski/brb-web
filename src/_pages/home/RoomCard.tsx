import { AvatarWrapper } from "@/components/AvatarWrapper"
import { Card } from "@/components/ui/card"
import { Room } from "@/shared.types"
import { Phone } from "lucide-react"
import Link from "next/link"

type Props = {
  room: Room
}

export function RoomCard(props: Props) {
  const { room } = props 
  return (
    <Card
      key={room.id}
      className="py-4 border-none bg-bg-3 flex flex-col gap-6 text-sidebar-2-fg hover:-translate-y-[2px] hover:shadow-depth-2 transition duration-200 relative px-4 py-6"
    >
      <div>
        <p className="text-muted text-sm mb-1">{room.language}</p>
        <p className="font-medium">{room.topic}</p>
      </div>
      <div 
        className="flex gap-4 min-h-[80px]"
       >
        {room.participants.map((p) => {
          return (
            <AvatarWrapper
              className="w-20 h-20"
              key={p.id}
              src={p.avatar}
              alt={p.username}
            />
          )
        })}
      </div>
      <Link
        href={`/room/${room.id}`}
        className="px-4 py-2 rounded-md flex items-center bg-bg-2/50 hover:bg-bg-2 justify-center transition flex items-center gap-3"
      >
        <span>
          <Phone size={16} />
        </span>
        <span>Join the room</span>
      </Link>
    </Card>
  )
}
