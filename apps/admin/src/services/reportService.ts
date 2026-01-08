import api from '@/lib/api';

export interface GenerateReportParams {
  type: string;
  format: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: Record<string, any>;
  name?: string;
}

export interface ReportStats {
  totalReports: number;
  thisMonth: number;
  scheduledReports: number;
  storageUsed: string;
  storageUsedBytes: number;
}

export interface Report {
  _id: string;
  reportId: string;
  name: string;
  type: string;
  format: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: Record<string, any>;
  fileUrl: string;
  fileSize: string;
  generatedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'generating' | 'completed' | 'failed';
  metadata: {
    recordCount: number;
    totalValue?: number;
    parameters?: Record<string, any>;
  };
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllReportsParams {
  page?: number;
  limit?: number;
  type?: string;
  format?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetAllReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ConfigureReportParams {
  type: string;
}

export interface ReportConfiguration {
  formats: string[];
  filters: {
    name: string;
    type: string;
    options?: string[];
  }[];
}

export const reportService = {
  /**
   * Get report statistics
   */
  async getStats(): Promise<ReportStats> {
    const response = await api.get('/reports/stats');
    return response.data.data;
  },

  /**
   * Get all reports with pagination and filtering
   */
  async getAllReports(params?: GetAllReportsParams): Promise<GetAllReportsResponse> {
    const response = await api.get('/reports', { params });
    return response.data.data;
  },

  /**
   * Get single report by ID
   */
  async getReport(reportId: string): Promise<Report> {
    const response = await api.get(`/reports/${reportId}`);
    return response.data.data.report;
  },

  /**
   * Generate a new report
   */
  async generateReport(params: GenerateReportParams): Promise<Report> {
    const response = await api.post('/reports/generate', params);
    return response.data.data.report;
  },

  /**
   * Get configuration options for a report type
   */
  async configureReport(params: ConfigureReportParams): Promise<ReportConfiguration> {
    const response = await api.post('/reports/configure', params);
    return response.data.data.configuration;
  },

  /**
   * Download report file
   */
  async downloadReport(reportId: string): Promise<Blob> {
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Email report to recipients
   */
  async emailReport(reportId: string, recipients: string[]): Promise<void> {
    await api.post(`/reports/${reportId}/email`, { recipients });
  },

  /**
   * Delete report
   */
  async deleteReport(reportId: string): Promise<void> {
    await api.delete(`/reports/${reportId}`);
  },

  /**
   * Helper function to trigger file download in browser
   */
  triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Helper function to trigger print dialog
   */
  async triggerPrint(reportId: string): Promise<void> {
    const blob = await this.downloadReport(reportId);
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    // Wait for iframe to load before printing
    iframe.onload = () => {
      iframe.contentWindow?.print();
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        window.URL.revokeObjectURL(url);
      }, 1000);
    };
  },
};
