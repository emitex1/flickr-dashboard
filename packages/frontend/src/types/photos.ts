export type PhotoBase = {
  secret: string;
  server: string;
  title: string;
}

export type PhotoFlickr = PhotoBase & {
  id: string;
}

export type PhotoPayload = PhotoBase & {
  timestamp: string;
  totalComments: number;
  totalFaves: number;
  totalViews: number;
}

export type Photo = PhotoPayload & {
  id: string;
}
