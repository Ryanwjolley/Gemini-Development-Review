import _ from 'lodash';
import { db } from './index';
import { collection, query, where, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { withMockData } from './useMockData';
import * as mockData from './mockData';

const applicationsCollection = 'applications';
const reviewsCollection = 'reviews';

const getApplicationsReal = async ({ city, status, applicantId, assignedReviewerId } = {}) => {
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

export const getApplications = withMockData(mockData.mockGetApplications, getApplicationsReal);

const getApplicationByIdReal = async (id) => {
	const docRef = doc(db, applicationsCollection, id);
	const docSnap = await getDoc(docRef);
	
	if (docSnap.exists()) {
		return { id: docSnap.id, ...docSnap.data() };
	}
	return null;
};

export const getApplicationById = withMockData(mockData.mockGetApplicationById, getApplicationByIdReal);

const createApplicationReal = async (applicationData, userId) => {
	const docRef = await addDoc(collection(db, applicationsCollection), {
		...applicationData,
		dateCreated: serverTimestamp(),
		createdBy: userId,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
	return docRef.id;
};

export const createApplication = withMockData(mockData.mockCreateApplication, createApplicationReal);

const updateApplicationReal = async (id, updates, userId) => {
	const docRef = doc(db, applicationsCollection, id);
	await updateDoc(docRef, {
		...updates,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
};

export const updateApplication = withMockData(mockData.mockUpdateApplication, updateApplicationReal);

export const deleteApplication = async (id) => {
	const docRef = doc(db, applicationsCollection, id);
	await deleteDoc(docRef);
};

const assignReviewersReal = async (applicationId, reviewerIds, userId) => {
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

export const assignReviewers = withMockData(mockData.mockAssignReviewers, assignReviewersReal);

const getReviewsByApplicationIdReal = async (applicationId) => {
	const reviewsRef = collection(db, reviewsCollection);
	const q = query(reviewsRef, where('applicationId', '==', applicationId));
	const snapshot = await getDocs(q);
	let reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	
	// Sort by date created descending
	reviews = _.orderBy(reviews, ['dateCreated'], ['desc']);
	
	return reviews;
};

export const getReviewsByApplicationId = withMockData(mockData.mockGetReviewsByApplicationId, getReviewsByApplicationIdReal);

const addReviewReal = async (reviewData, userId) => {
	const docRef = await addDoc(collection(db, reviewsCollection), {
		...reviewData,
		dateCreated: serverTimestamp(),
		createdBy: userId,
		dateModified: serverTimestamp(),
		lastModifiedBy: userId,
	});
	return docRef.id;
};

export const addReview = withMockData(mockData.mockAddReview, addReviewReal);

