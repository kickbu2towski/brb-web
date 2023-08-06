import { useState } from 'react'
import { NextPageWithLayout } from './_app'
import { DMListLayout } from '@/components/DMListLayout'
import { RelationList, SearchUser, TabItem } from '@/_pages/social'
import { tabs } from '@/lib/constants'
import { NavigationDrawer } from '@/components/NavigationDrawer'
import { Input } from '@/components/ui/input'
import { ChevronLeft } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'
import { useDebounce, useSearchUsers } from '@/hooks'

const Social: NextPageWithLayout = () => {
  const [selectedTab, setSelectedTab] = useState('Friends')
  const [isInputFocussed, setIsInputFocussed] = useState(false)
  const [username, setUsername] = useState('')
  const debouncedUsername = useDebounce(username, 300)
  const { data: users } = useSearchUsers(debouncedUsername)

  return (
    <div className="bg-bg-alt grid grid-rows-[auto_1fr] overflow-auto">
      <div className="px-4 py-3 flex shadow-md flex-col overflow-hidden">
        <div
          className={twMerge(
            'flex md:hidden items-center gap-3 mb-5',
            clsx(isInputFocussed && 'mb-0')
          )}
        >
          {isInputFocussed ? (
            <ChevronLeft
              onClick={() => {
                setIsInputFocussed(false)
                setSelectedTab(tabs[0])
                setUsername('')
              }}
              role="button"
            />
          ) : (
            <NavigationDrawer />
          )}
          <Input
            value={username}
            onFocus={() => {
              setIsInputFocussed(true)
              setSelectedTab(tabs[3])
            }}
            className={twMerge(
              'rounded-full py-1 h-auto bg-bg-alt border-2 border-input shadow-lg md:hidden',
              clsx(isInputFocussed && 'border-none shadow-none')
            )}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Mad Max"
          />
        </div>
        {!isInputFocussed && (
          <div className="flex [&>*]:shrink-0 gap-y-4 gap-3 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <TabItem
                key={tab}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tab={tab}
              />
            ))}
          </div>
        )}
      </div>
      {selectedTab === 'Friends' && <RelationList relation="friends" />}
      {selectedTab === 'Following' && <RelationList relation="following" />}
      {selectedTab === 'Followers' && <RelationList relation="followers" />}
      {selectedTab === 'Search User' && (
        <SearchUser
          isExternal={isInputFocussed}
          users={users}
          inputValue={username}
        />
      )}
    </div>
  )
}

Social.getLayout = function (page) {
  return <DMListLayout>{page}</DMListLayout>
}

export default Social
