// Google Apps Script for handling file uploads with organized folder structure
// Deploy this as a web app with execute permissions for "Anyone"

// Folder configuration
const FOLDER_CONFIG = {
  'payment-screenshots': '1c4y2bsNO-Sg9IToqeBePgYVS6yIy2aY3',
  'social-media': '1IsxKcDfrmJ-RhRCJ5J7qjnrVQZXXm43F', 
  'pitch-decks': '1be1CePN7MBDoJlFp5Enf9pLSXIodWY46',
  'help-tickets': '1_FUhxvw-4AZ2OxWv6c_Xb4MBuywBJ0Dx',
  'competition-payments': '1ab4kvoU_D3N2Pszxvm2BsyBcyesNEbSe',
  'default': '1Ixf5nsZkBqPZPsJSdBeCB8sBn_X_jGX3'
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { fileData, fileName, mimeType, uploadType = 'default' } = data;
    
    // Decode base64 file data
    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData), 
      mimeType, 
      fileName
    );
    
    // Get appropriate folder based on upload type
    const folderId = FOLDER_CONFIG[uploadType] || FOLDER_CONFIG['default'];
    const folder = DriveApp.getFolderById(folderId);
    const file = folder.createFile(blob);
    
    // Make file publicly viewable
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileUrl: `https://drive.google.com/file/d/${file.getId()}/view`,
        directUrl: `https://drive.google.com/uc?id=${file.getId()}`,
        uploadType: uploadType,
        folderName: getFolderName(uploadType)
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getFolderName(uploadType) {
  const folderNames = {
    'payment-screenshots': 'Payment Screenshots',
    'social-media': 'Social Media',
    'pitch-decks': 'Pitch Decks', 
    'help-tickets': 'Help Ticket Attachments',
    'competition-payments': 'Competition Payments',
    'default': 'General Uploads'
  };
  return folderNames[uploadType] || folderNames['default'];
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'GAS Upload Service Active',
      timestamp: new Date().toISOString(),
      supportedUploadTypes: Object.keys(FOLDER_CONFIG),
      folderStructure: Object.keys(FOLDER_CONFIG).map(type => ({
        type: type,
        name: getFolderName(type),
        folderId: FOLDER_CONFIG[type]
      }))
    }))
    .setMimeType(ContentService.MimeType.JSON);
}