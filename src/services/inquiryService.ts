import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export type TargetDepartment = 'Reception' | 'Room Service' | 'Banquets & Dining';
export type InquiryStatus = 'new' | 'in_progress' | 'contacted' | 'resolved';

export interface InquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  message: string;
  targetDepartment: TargetDepartment;
  source: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

const COLLECTION_NAME = 'inquiries';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
}

// Local storage fallback key for resilience
const LOCAL_BACKUP_KEY = 'crystal_hotel_inquiries_backup';

function getLocalBackup(): InquiryRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBackup(inquiries: InquiryRecord[]) {
  try {
    localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.warn('Could not cache inquiries locally:', err);
  }
}

/**
 * Creates and stores an inquiry in the database, automatically routing it to the right department.
 */
export async function createInquiry(data: {
  fullName: string;
  phone: string;
  message: string;
  targetDepartment: TargetDepartment;
  source: string;
}): Promise<InquiryRecord> {
  const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const newRecord: InquiryRecord = {
    id,
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    message: (data.message || '').trim(),
    targetDepartment: data.targetDepartment,
    source: data.source || 'website',
    status: 'new',
    notes: '',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  // Always update local backup immediately for instant availability
  const currentLocal = getLocalBackup();
  saveLocalBackup([newRecord, ...currentLocal]);

  try {
    await setDoc(doc(db, COLLECTION_NAME, id), {
      ...newRecord,
      _serverTimestamp: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${id}`);
  }

  return newRecord;
}

/**
 * Subscribe to real-time inquiries updates.
 */
export function subscribeToInquiries(
  onData: (inquiries: InquiryRecord[]) => void,
  onError?: (err: any) => void
): () => void {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));

  try {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: InquiryRecord[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as InquiryRecord);
        });

        // Merge with local backup to guarantee no inquiries are dropped
        const local = getLocalBackup();
        const existingIds = new Set(items.map((i) => i.id));
        const missingLocal = local.filter((l) => !existingIds.has(l.id));
        const merged = [...items, ...missingLocal].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        saveLocalBackup(merged);
        onData(merged);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
        // Fallback to local storage if Firestore connection encounters an issue
        onData(getLocalBackup());
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
    onData(getLocalBackup());
    return () => {};
  }
}

/**
 * Update an inquiry's status, notes, or route to another department.
 */
export async function updateInquiry(
  id: string,
  updates: Partial<Pick<InquiryRecord, 'status' | 'targetDepartment' | 'notes'>>
): Promise<void> {
  const nowIso = new Date().toISOString();
  const updatedFields = {
    ...updates,
    updatedAt: nowIso
  };

  // Update local backup
  const local = getLocalBackup().map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  saveLocalBackup(local);

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updatedFields);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

/**
 * Delete an inquiry record.
 */
export async function deleteInquiry(id: string): Promise<void> {
  // Update local backup
  const local = getLocalBackup().filter((item) => item.id !== id);
  saveLocalBackup(local);

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}

/**
 * Seed initial representative hotel leads if database is empty, so staff sees a fully working dashboard immediately.
 */
export async function seedSampleInquiriesIfEmpty(): Promise<void> {
  const existing = getLocalBackup();
  if (existing.length > 0) return;

  const samples: Omit<InquiryRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      fullName: 'Ahmed Al Zaabi',
      phone: '+971 50 482 1920',
      message: 'Looking for 2 Deluxe Double rooms for 3 nights from tomorrow with early check-in.',
      targetDepartment: 'Reception',
      source: 'rooms_page',
      status: 'new',
      notes: 'Guest called reception asking about airport transfer'
    },
    {
      fullName: 'Dr. Fatima Tariq',
      phone: '+971 56 892 3341',
      message: 'Need banquet hall for a medical symposium of 45 attendees. Required classroom seating setup with projector.',
      targetDepartment: 'Banquets & Dining',
      source: 'banquet_inquiry_form',
      status: 'in_progress',
      notes: 'Quotation sent via WhatsApp on 056 973 2183'
    },
    {
      fullName: 'Michael Henderson',
      phone: '+971 55 319 8802',
      message: 'Inquiring about late dinner room service buffet options and breakfast timing.',
      targetDepartment: 'Room Service',
      source: 'contact_page',
      status: 'contacted',
      notes: 'Informed about 24-hour room dining menu'
    },
    {
      fullName: 'Sarah Mansoor',
      phone: '+971 52 771 9044',
      message: 'Wedding reception inquiry for 120 guests with catering and stage lighting.',
      targetDepartment: 'Banquets & Dining',
      source: 'homepage_banquet',
      status: 'new',
      notes: 'Awaiting date confirmation'
    }
  ];

  for (const sample of samples) {
    await createInquiry(sample);
  }
}
