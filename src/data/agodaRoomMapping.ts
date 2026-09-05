import { AgodaRoomMappingConfig } from '../types/agoda';

/**
 * Agoda Room Mapping Configuration
 * 
 * Maps website room categories to their corresponding Agoda room types & IDs.
 * Developers can adjust Agoda room/property identifiers here without modifying the UI.
 */
export const AGODA_ROOM_MAPPINGS: AgodaRoomMappingConfig[] = [
  {
    hotelRoomSlug: 'standard-king-room',
    hotelRoomName: 'Standard King',
    agodaRoomTypeId: process.env.AGODA_ROOM_ID_STANDARD_KING || 'AGODA_STD_KING',
    agodaRoomName: 'Standard King Bed',
    defaultCapacity: 2
  },
  {
    hotelRoomSlug: 'standard-twin-room',
    hotelRoomName: 'Standard Twin',
    agodaRoomTypeId: process.env.AGODA_ROOM_ID_STANDARD_TWIN || 'AGODA_STD_TWIN',
    agodaRoomName: 'Standard Twin Single Beds',
    defaultCapacity: 2
  },
  {
    hotelRoomSlug: 'standard-triple-room',
    hotelRoomName: 'Standard Triple Room',
    agodaRoomTypeId: process.env.AGODA_ROOM_ID_STANDARD_TRIPLE || 'AGODA_STD_TRIPLE',
    agodaRoomName: 'Standard Triple Room',
    defaultCapacity: 3
  },
  {
    hotelRoomSlug: 'executive-suite',
    hotelRoomName: 'Executive Suite',
    agodaRoomTypeId: process.env.AGODA_ROOM_ID_EXECUTIVE_SUITE || 'AGODA_EXEC_SUITE',
    agodaRoomName: 'Executive Suite - 1 King Bed & Living Room',
    defaultCapacity: 4
  }
];

export function getAgodaMappingForSlug(slug: string): AgodaRoomMappingConfig | undefined {
  return AGODA_ROOM_MAPPINGS.find(m => m.hotelRoomSlug === slug);
}
