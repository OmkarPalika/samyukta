import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export interface QRPayload {
  id: string;
  name: string;
  role: 'participant' | 'coordinator' | 'admin';
  email?: string;
  college?: string;
  track?: string;
  year?: string;
  dept?: string;
  timestamp: number;
}

export class QRGenerator {
  static async generateParticipantQR(userData: {
    id: string;
    name: string;
    email?: string;
    college?: string;
    track?: string;
    year?: string;
    dept?: string;
  }): Promise<string> {
    const payload: QRPayload = {
      id: userData.id,
      name: userData.name,
      role: 'participant',
      email: userData.email,
      college: userData.college,
      track: userData.track,
      year: userData.year,
      dept: userData.dept,
      timestamp: Date.now()
    };

    const qrData = JSON.stringify(payload);
    return await QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#ffffff'
      }
    });
  }

  static async generateCoordinatorQR(userData: {
    id: string;
    name: string;
    email?: string;
  }): Promise<string> {
    const payload: QRPayload = {
      id: userData.id,
      name: userData.name,
      role: 'coordinator',
      email: userData.email,
      timestamp: Date.now()
    };

    const qrData = JSON.stringify(payload);
    return await QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#059669',
        light: '#ffffff'
      }
    });
  }

  static async generateAdminQR(userData: {
    id: string;
    name: string;
    email?: string;
  }): Promise<string> {
    const payload: QRPayload = {
      id: userData.id,
      name: userData.name,
      role: 'admin',
      email: userData.email,
      timestamp: Date.now()
    };

    const qrData = JSON.stringify(payload);
    return await QRCode.toDataURL(qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#dc2626',
        light: '#ffffff'
      }
    });
  }

  static parseQRData(qrData: string): QRPayload | null {
    try {
      return JSON.parse(qrData) as QRPayload;
    } catch {
      return null;
    }
  }

  static generateUniqueId(): string {
    return uuidv4();
  }
}

// Export function for backward compatibility
export const generateQRCode = QRGenerator.generateParticipantQR;