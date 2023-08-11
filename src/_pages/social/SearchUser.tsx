import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserResult, useDebounce, useSearchUsers } from '@/hooks'
import { UserCard } from '@/_pages/social'

type Props = {
  isExternal: boolean
  users: UserResult[] | undefined
  inputValue: string
}

export function SearchUser(props: Props) {
  const { isExternal, users, inputValue } = props
  const [username, setUsername] = useState('')
  const debouncedUsername = useDebounce(username, 300)
  const { data } = useSearchUsers(debouncedUsername)
  const source = isExternal ? users : data

  return (
    <div className="grid px-3 md:px-8 grid-rows-[auto_1fr] gap-4 overflow-auto">
      {!isExternal && (
        <div className="mt-8">
          <Label htmlFor="search-users" className="mb-3 block text-lg">
            Search Users
          </Label>
          <Input
            id="search-users"
            placeholder="Mad Max"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      )}

      {source && (
        <div className="overflow-auto pr-2 rounded-lg">
          <div className="grid ram gap-8 py-4">
            {source?.map((user) => {
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  username={debouncedUsername || inputValue}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
