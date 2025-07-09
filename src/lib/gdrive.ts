import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive.file'],
})

const drive = google.drive({ version: 'v3', auth })

export async function uploadToGDrive(file: Buffer, fileName: string, mimeType: string) {
  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GDRIVE_FOLDER_ID!],
    },
    media: {
      mimeType,
      body: file,
    },
  })

  // Make file publicly viewable
  await drive.permissions.create({
    fileId: response.data.id!,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  return `https://drive.google.com/file/d/${response.data.id}/view`
}

export { drive }