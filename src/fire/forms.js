import _ from 'lodash';
import { db } from './index';
import { collection, query, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const formsCollection = 'forms';

export const getForms = async ({ city } = {}) => {
	const formsRef = collection(db, formsCollection);
	const q = query(formsRef);

	const snapshot = await getDocs(q);
	let forms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

	// Filter client-side to avoid composite index requirements
	if (city) {
		forms = forms.filter(form => form.city === city);
	}

	// Sort by date modified descending
	forms = _.orderBy(forms, ['dateModified'], ['desc']);

	return forms;
};

export const getFormById = async (id) => {
	const docRef = doc(db, formsCollection, id);
	const docSnap = await getDoc(docRef);
	
	if (docSnap.exists()) {
		return { id: docSnap.id, ...docSnap.data() };
	}
	return null;
};

export const createForm = async (formData, userId) => {
	const docRef = await addDoc(collection(db, formsCollection), {
		...formData,
		version: 1,
		isActive: true,
		dateCreated: serverTimestamp(),
		createdBy: userId,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
	return docRef.id;
};

export const updateForm = async (id, updates, userId) => {
	const docRef = doc(db, formsCollection, id);
	await updateDoc(docRef, {
		...updates,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
};

export const deleteForm = async (id) => {
	const docRef = doc(db, formsCollection, id);
	await deleteDoc(docRef);
};

