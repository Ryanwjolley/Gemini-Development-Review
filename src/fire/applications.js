import _ from 'lodash';
import { db } from './index';
import { collection, query, where, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const applicationsCollection = 'applications';
const reviewsCollection = 'reviews';

export const getApplications = async ({ city, status, applicantId, assignedReviewerId } = {}) => {
	const applicationsRef = collection(db, applicationsCollection);
	const q = query(applicationsRef);

	const snapshot = await getDocs(q);
	let apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

	// Filter client-side to avoid composite index requirements
	if (city) {
		apps = apps.filter(app => app.city === city);
	}
	if (status) {
		apps = apps.filter(app => app.status === status);
	}
	if (applicantId) {
		apps = apps.filter(app => app.applicantId === applicantId);
	}
	if (assignedReviewerId) {
		apps = apps.filter(app => app.assignedReviewers?.includes(assignedReviewerId));
	}

	// Sort by submission date descending
	apps = _.orderBy(apps, ['submissionDate'], ['desc']);

	return apps;
};

export const getApplicationById = async (id) => {
	const docRef = doc(db, applicationsCollection, id);
	const docSnap = await getDoc(docRef);
	
	if (docSnap.exists()) {
		return { id: docSnap.id, ...docSnap.data() };
	}
	return null;
};

export const createApplication = async (applicationData, userId) => {
	const docRef = await addDoc(collection(db, applicationsCollection), {
		...applicationData,
		dateCreated: serverTimestamp(),
		createdBy: userId,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
	return docRef.id;
};

export const updateApplication = async (id, updates, userId) => {
	const docRef = doc(db, applicationsCollection, id);
	await updateDoc(docRef, {
		...updates,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
};

export const deleteApplication = async (id) => {
	const docRef = doc(db, applicationsCollection, id);
	await deleteDoc(docRef);
};

export const assignReviewers = async (applicationId, reviewerIds, userId) => {
	const docRef = doc(db, applicationsCollection, applicationId);
	const docSnap = await getDoc(docRef);
	
	if (docSnap.exists()) {
		const currentReviewers = docSnap.data().assignedReviewers || [];
		const updatedReviewers = _.uniq([...currentReviewers, ...reviewerIds]);
		
		await updateDoc(docRef, {
			assignedReviewers: updatedReviewers,
			dateModified: serverTimestamp(),
			lastModifiedBy: userId,
		});
	}
};

export const getReviewsByApplicationId = async (applicationId) => {
	const reviewsRef = collection(db, reviewsCollection);
	const q = query(reviewsRef, where('applicationId', '==', applicationId));
	const snapshot = await getDocs(q);
	let reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	
	// Sort by date created descending
	reviews = _.orderBy(reviews, ['dateCreated'], ['desc']);
	
	return reviews;
};

export const addReview = async (reviewData, userId) => {
	const docRef = await addDoc(collection(db, reviewsCollection), {
		...reviewData,
		dateCreated: serverTimestamp(),
		createdBy: userId,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
	return docRef.id;
};

