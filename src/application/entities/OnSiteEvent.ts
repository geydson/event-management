export interface OnSiteEvent {
  id: string
  name: string
  ownerId: string
  latitude: number
  longitude: number
  ticketPriceInCents: number
  date: Date
}
