// types/ui.d.ts
import type { AvatarProps } from '@nuxt/ui'

declare global {
  type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
  type SaleStatus = 'paid' | 'failed' | 'refunded'

  interface User {
    id: number
    name: string
    email: string
    avatar?: AvatarProps
    status: UserStatus
    location: string
  }

  interface Mail {
    id: number
    unread?: boolean
    from: User
    subject: string
    body: string
    date: string
  }

  interface Member {
    name: string
    username: string
    role: 'member' | 'owner'
    avatar: AvatarProps
  }

  interface Stat {
    title: string
    icon: string
    value: number | string
    variation: number
    formatter?: (value: number) => string
  }

  interface Sale {
    id: string
    date: string
    status: SaleStatus
    email: string
    amount: number
  }

  interface Notification {
    id: number
    unread?: boolean
    sender: User
    body: string
    date: string
  }

  type Period = 'daily' | 'weekly' | 'monthly'

  interface DateRange {
    start: Date
    end: Date
  }
}

export {}
