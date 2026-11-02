/**
 * Crystal Plaza Hotel - Image Upload & Direct Media Management Service
 * 
 * Replaces fragile third-party hosts (like imgbb) with self-hosted, direct website image storage.
 * Uploads are saved directly to /public/uploads/ on the hotel server and served reliably.
 */

export interface StoredImage {
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
  formattedSize: string;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  primaryUrl?: string;
  files?: Array<{
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimetype: string;
    uploadedAt: string;
  }>;
}

// Key website image slots that can be customized directly from the Admin Portal
export interface ImageSlotDefinition {
  id: string;
  name: string;
  section: 'Home' | 'Rooms' | 'Banquets & Events' | 'Dining' | 'Branding';
  description: string;
  defaultUrl: string;
  currentUrl?: string;
}

export const DEFAULT_IMAGE_SLOTS: Record<string, ImageSlotDefinition> = {
  logo: {
    id: 'logo',
    name: 'Hotel Logo Avatar',
    section: 'Branding',
    description: 'Header & navigation brand emblem',
    defaultUrl: '/images/hotel/Whats_App_Image_2026_08_08_at_5_34_39_PM.jpg'
  },
  home_hero: {
    id: 'home_hero',
    name: 'Homepage Hero Banner',
    section: 'Home',
    description: 'Main large background on the homepage',
    defaultUrl: '/images/hotel/Whats_App_Image_2026_09_04_at_4_18_08_PM.jpg'
  },
  home_intro_1: {
    id: 'home_intro_1',
    name: 'Home Intro (King Bed)',
    section: 'Home',
    description: 'Welcome section left showcase image',
    defaultUrl: '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png'
  },
  home_intro_2: {
    id: 'home_intro_2',
    name: 'Home Intro (Dining Atmosphere)',
    section: 'Home',
    description: 'Welcome section right showcase image',
    defaultUrl: '/images/hotel/Whats_App_Image_2026_09_04_at_5_04_54_PM.jpg'
  },
  room_king: {
    id: 'room_king',
    name: 'Standard King Room',
    section: 'Rooms',
    description: 'Main room card & details header for Standard King',
    defaultUrl: '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png'
  },
  room_twin: {
    id: 'room_twin',
    name: 'Standard Twin Room',
    section: 'Rooms',
    description: 'Main room card & details header for Standard Twin',
    defaultUrl: '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png'
  },
  room_triple: {
    id: 'room_triple',
    name: 'Standard Triple Room',
    section: 'Rooms',
    description: 'Main room card & details header for Standard Triple',
    defaultUrl: '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_26_13_AM_pn.png'
  },
  room_suite: {
    id: 'room_suite',
    name: 'Executive Suite',
    section: 'Rooms',
    description: 'Main room card & details header for Executive Suite',
    defaultUrl: '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_46_59_AM_pn.png'
  },
  banquet_hero: {
    id: 'banquet_hero',
    name: 'Crystal Banquet Hall',
    section: 'Banquets & Events',
    description: 'Main image for Banquet Hall cards and event showcase',
    defaultUrl: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg'
  },
  banquet_stage: {
    id: 'banquet_stage',
    name: 'Banquet Stage & Event Layout',
    section: 'Banquets & Events',
    description: 'Elevated presentation stage and formal seating',
    defaultUrl: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg'
  },
  dining_hero: {
    id: 'dining_hero',
    name: 'Crystal Restaurant & Dining',
    section: 'Dining',
    description: 'Main restaurant presentation & dining gallery',
    defaultUrl: '/images/hotel/Whats_App_Image_2026_09_04_at_5_04_54_PM.jpg'
  },
  lobby_foyer: {
    id: 'lobby_foyer',
    name: 'Hotel Lobby & Front Desk',
    section: 'Home',
    description: '24/7 reception and welcoming entrance foyer',
    defaultUrl: '/images/hotel/Whats_App_Image_2026_09_04_at_5_21_07_PM.jpg'
  },
  gym_fitness: {
    id: 'gym_fitness',
    name: 'Fitness Centre & Gym',
    section: 'Home',
    description: 'Exercise machines and guest fitness facility',
    defaultUrl: '/images/hotel/gym2_jpg.jpg'
  }
};

const STORAGE_KEY_SLOTS = 'crystal_image_slot_overrides';

// Mapping table for older external broken ibb.co links to self-hosted assets
export const LOCAL_IMAGE_FALLBACKS: Record<string, string> = {
  // Logo
  'https://i.ibb.co/W4VpJdWZ/Whats-App-Image-2026-08-08-at-5-34-39-PM.jpg': '/images/hotel/Whats_App_Image_2026_08_08_at_5_34_39_PM.jpg',
  // Hero
  'https://i.ibb.co/ksP8W5H1/Whats-App-Image-2026-09-04-at-4-18-08-PM-1.jpg': '/images/hotel/Whats_App_Image_2026_09_04_at_4_18_08_PM.jpg',
  // Rooms
  'https://i.ibb.co/b542Q4xz/Chat-GPT-Image-Sep-5-2026-10-38-32-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png',
  'https://i.ibb.co/PZLChhFp/Chat-GPT-Image-Sep-5-2026-10-34-26-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png',
  'https://i.ibb.co/KcmqW3RL/Chat-GPT-Image-Sep-5-2026-10-42-15-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png',
  'https://i.ibb.co/G4tFqPs0/Chat-GPT-Image-Sep-5-2026-10-19-21-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png',
  'https://i.ibb.co/7x7YnNbc/Chat-GPT-Image-Sep-5-2026-10-16-30-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png',
  'https://i.ibb.co/FkkktTRy/Chat-GPT-Image-Sep-5-2026-10-20-39-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png',
  'https://i.ibb.co/tThnhpYW/Chat-GPT-Image-Sep-5-2026-10-26-13-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_26_13_AM_pn.png',
  'https://i.ibb.co/9mVPK2k5/Chat-GPT-Image-Sep-5-2026-10-27-12-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_26_13_AM_pn.png',
  'https://i.ibb.co/RGTd5p8p/Chat-GPT-Image-Sep-5-2026-10-29-17-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_26_13_AM_pn.png',
  'https://i.ibb.co/pB6BWFgN/Chat-GPT-Image-Sep-5-2026-10-48-05-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_46_59_AM_pn.png',
  'https://i.ibb.co/fV6NK0SJ/Chat-GPT-Image-Sep-5-2026-10-46-59-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_46_59_AM_pn.png',
  'https://i.ibb.co/Q5rrL05/Chat-GPT-Image-Sep-5-2026-10-51-06-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_51_06_AM_pn.png',
  'https://i.ibb.co/BWB3jhs/Chat-GPT-Image-Sep-5-2026-10-50-10-AM.png': '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_50_10_AM_pn.png',
  // Banquet & Events
  'https://i.ibb.co/6JvRNWrw/Whats-App-Image-2026-08-25-at-1-58-17-PM.jpg': '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg',
  'https://i.ibb.co/xSLWpww1/Whats-App-Image-2026-08-25-at-1-58-12-PM.jpg': '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg',
  'https://i.ibb.co/4Rcjw4Hk/Whats-App-Image-2026-08-25-at-1-58-22-PM.jpg': '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_22_PM.jpg',
  'https://i.ibb.co/994kcxnM/Whats-App-Image-2026-08-25-at-1-58-19-PM.jpg': '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg',
  'https://i.ibb.co/ZRyNTJj4/Whats-App-Image-2026-08-08-at-4-47-57-PM.jpg': '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg',
  'https://i.ibb.co/Wv8YjnbL/MEETING-ROOM.jpg': '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_22_PM.jpg',
  // Dining
  'https://i.ibb.co/fz8CHH3x/Whats-App-Image-2026-09-04-at-5-06-41-PM.jpg': '/images/hotel/Whats_App_Image_2026_09_04_at_5_04_54_PM.jpg',
  'https://i.ibb.co/HLhqtyxG/Whats-App-Image-2026-09-04-at-5-04-54-PM.jpg': '/images/hotel/Whats_App_Image_2026_09_04_at_5_04_54_PM.jpg',
  // Lobby & Facilities
  'https://i.ibb.co/jPTbsb33/Whats-App-Image-2026-09-04-at-5-14-38-PM.jpg': '/images/hotel/Whats_App_Image_2026_09_04_at_5_21_07_PM.jpg',
  'https://i.ibb.co/N21YsLpF/Whats-App-Image-2026-09-04-at-5-21-07-PM.jpg': '/images/hotel/Whats_App_Image_2026_09_04_at_5_21_07_PM.jpg',
  'https://i.ibb.co/F4TSrnL9/GYM.jpg': '/images/hotel/gym2_jpg.jpg',
  'https://i.ibb.co/NnFtvfDk/gym2.jpg': '/images/hotel/gym2_jpg.jpg',
  'https://ak-d.tripcdn.com/images/0220112000k69or5o7A72_W_1280_853_R5.webp': '/images/hotel/0220112000k69or5o7A72_W_1280_853_R5_webp.webp',
  'https://ak-d.tripcdn.com/images/0224512000l1c4xc78C50_W_1280_853_R5.webp': '/images/hotel/0224512000l1c4xc78C50_W_1280_853_R5_webp.webp'
};

/**
 * Resolves an image URL:
 * 1. Checks if a user has custom assigned a slot override.
 * 2. If it's a known broken ibb.co URL, replaces with local high-res asset.
 * 3. Returns the clean URL.
 */
export function getSafeImageUrl(url: string, slotId?: string): string {
  if (slotId) {
    const overrides = getImageSlotOverrides();
    if (overrides[slotId]) {
      return overrides[slotId];
    }
  }

  if (LOCAL_IMAGE_FALLBACKS[url]) {
    return LOCAL_IMAGE_FALLBACKS[url];
  }

  // If already a local path, keep as is
  return url;
}

/**
 * Fetch all stored images uploaded to the website server (/public/uploads)
 */
export async function fetchStoredImages(): Promise<StoredImage[]> {
  try {
    const res = await fetch('/api/images');
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return data.images || [];
  } catch (err) {
    console.warn('Could not fetch stored images from /api/images:', err);
    return [];
  }
}

/**
 * Upload single or multiple image files directly to the website server
 */
export async function uploadImageFiles(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    try {
      const parsed = JSON.parse(errorText);
      throw new Error(parsed.error || `Upload failed with status ${res.status}`);
    } catch {
      throw new Error(`Upload failed: ${errorText || res.statusText}`);
    }
  }

  return await res.json();
}

/**
 * Delete an uploaded image from website storage
 */
export async function deleteStoredImage(filename: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/images/${encodeURIComponent(filename)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.error('Failed to delete image:', err);
    return false;
  }
}

/**
 * Slot Override Storage Helpers
 */
export function getImageSlotOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SLOTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setImageSlotOverride(slotId: string, imageUrl: string): void {
  try {
    const overrides = getImageSlotOverrides();
    overrides[slotId] = imageUrl;
    localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(overrides));
    // Dispatch custom event so listeners re-render dynamically
    window.dispatchEvent(new CustomEvent('crystal-images-updated', { detail: { slotId, imageUrl } }));
  } catch (err) {
    console.error('Failed to save slot override:', err);
  }
}

export function resetImageSlotOverride(slotId: string): void {
  try {
    const overrides = getImageSlotOverrides();
    delete overrides[slotId];
    localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(overrides));
    window.dispatchEvent(new CustomEvent('crystal-images-updated', { detail: { slotId } }));
  } catch (err) {
    console.error('Failed to reset slot override:', err);
  }
}
