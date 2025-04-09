import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

export type Trainer = {
  id?: string
  name: string
  email: string
  sports: string[]
  location: string
  price: number
  bio: string
  experience: string
  certifications: string[]
  availability: {
    days: string[]
    hours: string
  }
  rating?: number
  reviewCount?: number
  photoURL?: string
  headerImageURL?: string
  specialty?: string
  userId: string
  createdAt?: any
  updatedAt?: any
  status?: string // active, suspended
  trainerStatus?: string // pending, approved, rejected
  approvalNotes?: string
  approvedAt?: any
}

export const trainerConverter = {
  toFirestore: (trainer: Trainer): DocumentData => {
    return {
      name: trainer.name,
      email: trainer.email,
      sports: trainer.sports,
      location: trainer.location,
      price: trainer.price,
      bio: trainer.bio,
      experience: trainer.experience,
      certifications: trainer.certifications,
      availability: trainer.availability,
      rating: trainer.rating || 0,
      reviewCount: trainer.reviewCount || 0,
      photoURL: trainer.photoURL || null,
      headerImageURL: trainer.headerImageURL || null,
      specialty: trainer.specialty || null,
      userId: trainer.userId,
      status: trainer.status || "active",
      trainerStatus: trainer.trainerStatus || "pending",
      approvalNotes: trainer.approvalNotes || null,
      approvedAt: trainer.approvedAt || null,
      createdAt: trainer.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Trainer => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      name: data.name,
      email: data.email,
      sports: data.sports,
      location: data.location,
      price: data.price,
      bio: data.bio,
      experience: data.experience,
      certifications: data.certifications,
      availability: data.availability,
      rating: data.rating,
      reviewCount: data.reviewCount,
      photoURL: data.photoURL,
      headerImageURL: data.headerImageURL,
      specialty: data.specialty,
      userId: data.userId,
      status: data.status,
      trainerStatus: data.trainerStatus,
      approvalNotes: data.approvalNotes,
      approvedAt: data.approvedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  },
}

// Get all trainers with pagination
export const getTrainers = async (
  lastVisible: QueryDocumentSnapshot | null = null,
  itemsPerPage = 10,
  sportFilter?: string,
  locationFilter?: string,
  statusFilter = "active", // Only show active trainers by default
  approvalFilter = "approved", // Only show approved trainers by default
) => {
  try {
    const trainersRef = collection(db, "trainers").withConverter(trainerConverter)

    let q = query(trainersRef, orderBy("rating", "desc"), limit(itemsPerPage))

    // Apply filters if provided
    if (sportFilter) {
      q = query(q, where("sports", "array-contains", sportFilter))
    }

    if (locationFilter) {
      q = query(q, where("location", "==", locationFilter))
    }

    // Apply status filter
    if (statusFilter) {
      q = query(q, where("status", "==", statusFilter))
    }

    // Apply approval filter
    if (approvalFilter) {
      q = query(q, where("trainerStatus", "==", approvalFilter))
    }

    // Apply pagination if lastVisible is provided
    if (lastVisible) {
      q = query(q, startAfter(lastVisible))
    }

    const querySnapshot = await getDocs(q)

    const trainers: Trainer[] = []
    querySnapshot.forEach((doc) => {
      trainers.push(doc.data())
    })

    // Get the last visible document for pagination
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

    return {
      trainers,
      lastVisible: lastVisibleDoc,
    }
  } catch (error) {
    console.error("Error getting trainers:", error)
    throw error
  }
}

// Get a single trainer by ID
export const getTrainerById = async (id: string) => {
  try {
    const trainerRef = doc(db, "trainers", id).withConverter(trainerConverter)
    const trainerDoc = await getDoc(trainerRef)

    if (!trainerDoc.exists()) {
      throw new Error("Trainer not found")
    }

    return trainerDoc.data()
  } catch (error) {
    console.error("Error getting trainer:", error)
    throw error
  }
}

// Create a new trainer
export const createTrainer = async (trainer: Trainer, photoFile?: File, headerImageFile?: File) => {
  try {
    // Upload photo if provided
    if (photoFile) {
      const photoRef = ref(storage, `trainer-photos/${Date.now()}_${photoFile.name}`)
      await uploadBytes(photoRef, photoFile)
      const photoURL = await getDownloadURL(photoRef)
      trainer.photoURL = photoURL
    }

    // Upload header image if provided
    if (headerImageFile) {
      const headerImageRef = ref(storage, `trainer-headers/${Date.now()}_${headerImageFile.name}`)
      await uploadBytes(headerImageRef, headerImageFile)
      const headerImageURL = await getDownloadURL(headerImageRef)
      trainer.headerImageURL = headerImageURL
    }

    // Set default status values
    trainer.status = "active"
    trainer.trainerStatus = "pending"

    // Add trainer to Firestore
    const trainerRef = collection(db, "trainers").withConverter(trainerConverter)
    const docRef = await addDoc(trainerRef, trainer)

    return {
      id: docRef.id,
      ...trainer,
    }
  } catch (error) {
    console.error("Error creating trainer:", error)
    throw error
  }
}

// Update an existing trainer
export const updateTrainer = async (
  id: string,
  trainer: Partial<Trainer>,
  photoFile?: File,
  headerImageFile?: File,
) => {
  try {
    // Upload photo if provided
    if (photoFile) {
      const photoRef = ref(storage, `trainer-photos/${Date.now()}_${photoFile.name}`)
      await uploadBytes(photoRef, photoFile)
      const photoURL = await getDownloadURL(photoRef)
      trainer.photoURL = photoURL
    }

    // Upload header image if provided
    if (headerImageFile) {
      const headerImageRef = ref(storage, `trainer-headers/${Date.now()}_${headerImageFile.name}`)
      await uploadBytes(headerImageRef, headerImageFile)
      const headerImageURL = await getDownloadURL(headerImageRef)
      trainer.headerImageURL = headerImageURL
    }

    // Update trainer in Firestore
    const trainerRef = doc(db, "trainers", id)
    await updateDoc(trainerRef, {
      ...trainer,
      updatedAt: serverTimestamp(),
    })

    return {
      id,
      ...trainer,
    }
  } catch (error) {
    console.error("Error updating trainer:", error)
    throw error
  }
}

// Delete a trainer
export const deleteTrainer = async (id: string) => {
  try {
    const trainerRef = doc(db, "trainers", id)
    await deleteDoc(trainerRef)
    return true
  } catch (error) {
    console.error("Error deleting trainer:", error)
    throw error
  }
}

// Get trainers by sport
export const getTrainersBySport = async (sport: string) => {
  try {
    const trainersRef = collection(db, "trainers").withConverter(trainerConverter)
    const q = query(
      trainersRef,
      where("sports", "array-contains", sport),
      where("status", "==", "active"),
      where("trainerStatus", "==", "approved"),
      orderBy("rating", "desc"),
      limit(20),
    )

    const querySnapshot = await getDocs(q)

    const trainers: Trainer[] = []
    querySnapshot.forEach((doc) => {
      trainers.push(doc.data())
    })

    return trainers
  } catch (error) {
    console.error("Error getting trainers by sport:", error)
    throw error
  }
}
