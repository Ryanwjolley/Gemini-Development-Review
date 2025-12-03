import { db } from './index';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { withMockData } from './useMockData';
import * as mockData from './mockData';

const usersCollection = 'users';

const getUserByIdReal = async (id) => {
	const docRef = doc(db, usersCollection, id);
	const docSnap = await getDoc(docRef);
	
	if (docSnap.exists()) {
		return { id: docSnap.id, ...docSnap.data() };
	}
	return null;
};

export const getUserById = withMockData(mockData.mockGetUserById, getUserByIdReal);

const getUsersByRoleReal = async (role) => {
	const usersRef = collection(db, usersCollection);
	const q = query(usersRef, where('role', '==', role));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUsersByRole = withMockData(mockData.mockGetUsersByRole, getUsersByRoleReal);

const getAllUsersReal = async () => {
	const usersRef = collection(db, usersCollection);
	const snapshot = await getDocs(usersRef);
	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllUsers = withMockData(mockData.mockGetUsers, getAllUsersReal);

export const updateUser = async (id, updates) => {
	const docRef = doc(db, usersCollection, id);
	await updateDoc(docRef, updates);
};

