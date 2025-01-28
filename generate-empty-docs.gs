// Run this script as a Google Apps Script, and it will create a folder structure with empty Google Docs in the specified folders
// You can save this file in Google Drive (with the inputs below filled in), double-click it, hit "run", and then delete it afterwards)
// TODO: Doesn't support nested folders

// ------ Inputs ------

// Replace with the folder IDs where you want to create the folder structure
// The folder ID is the last set of characters Google Drive URL for the folder. Naigate to it and check the URL
// e.g. in "https://drive.google.com/drive/u/0/folders/8XnL39dZTPwR_yKrh6ooJ8q4vLPBGCYRm", the ID is "8XnL39dZTPwR_yKrh6ooJ8q4vLPBGCYRm"
const rootFolderIds = [
  "YOUR_FOLDER_ID_1", // Replace with actual folder ID 
  "YOUR_FOLDER_ID_2",
  // ... Add more folder IDs as needed
];


// Edit this object to define the folder structure and documents to be created
const fileHierarchy = {
  "Directory 1": [
    "Document 1",
    "Document 2",
  ],
  "Directory 2": [
    "Document 3",
    "Document 4",
  ],
  // ... Add more directories and documents as needed
};


// ------ Implementation ------

function generateEmptyDocs() {
  // Validate folder IDs
  if (!Array.isArray(rootFolderIds) || rootFolderIds.length === 0) {
    throw new Error("No folder IDs provided. Please check the rootFolderIds array.");
  }

  // Validate each folder ID
  const validFolders = rootFolderIds.map(id => {
    const folder = DriveApp.getFolderById(id);
    if (!folder) {
      throw new Error(`Invalid folder ID: ${id}. Ensure the folder exists and you have write permissions.`);
    }
    return folder;
  });

  // Validate structure
  if (
    typeof fileHierarchy !== "object" ||
    !Object.values(fileHierarchy).every(
      items => Array.isArray(items) && items.every(item => typeof item === "string")
    )
  ) {
    throw new Error(
      "Invalid structure format. Ensure STRUCTURE is a Record<string, string[]> with no null values."
    );
  }

  // Generate folders and documents
  validFolders.forEach(folder => {
    for (const [week, docs] of Object.entries(fileHierarchy)) {
      const weekFolder = folder.createFolder(week);
      docs.forEach(docName => {
        const doc = DocumentApp.create(docName);
        const file = DriveApp.getFileById(doc.getId());
        weekFolder.addFile(file);
        DriveApp.getRootFolder().removeFile(file); // Remove from root folder
      });
    }
  });

  Logger.log("Folders and documents created successfully in all specified folders.");
}
