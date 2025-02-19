import { openDB } from 'idb';

// Open the database and create object stores for each page
const dbPromise = openDB('hospital-db', 1, {
  upgrade(db) {
    const pages = [
      'addDepartment', 'addDoctor', 'allDepartments', 'allDoctors',
      'editDepartment', 'editDoctor', 'manageDoctors'
    ];

    pages.forEach((page) => {
      if (!db.objectStoreNames.contains(page)) {
        db.createObjectStore(page, { keyPath: 'id', autoIncrement: true });
      }
    });
  },
});

// Function to save data to IndexedDB
export const saveData = async (page, data) => {
  const db = await dbPromise;
  await db.put(page, data);
};

// Function to retrieve data from IndexedDB
export const getData = async (page) => {
  const db = await dbPromise;
  return await db.getAll(page);
};

// Function to delete data from IndexedDB
export const deleteData = async (page, id) => {
  const db = await dbPromise;
  await db.delete(page, id);
};
