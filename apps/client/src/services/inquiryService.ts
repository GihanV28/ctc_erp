import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface InquiryData {
  name: string;
  email: string;
  subject: string;
  category?: string;
  message: string;
  file?: File;
}

export const inquiryService = {
  submitInquiry: async (data: InquiryData): Promise<{
    message: string;
    attachmentUploaded: boolean;
    note?: string;
  }> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('message', data.message);

      if (data.category) {
        formData.append('category', data.category);
      }

      if (data.file) {
        formData.append('file', data.file);
      }

      const response = await axios.post(`${API_URL}/inquiries`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to submit inquiry'
      );
    }
  },
};
