import { AnalyticsRepository } from '../repository/analytics.repository';
import { CommunicationRecordRepository } from '../repository/communicationRecord.repository';

class AnalyticsService {
  constructor(
      private readonly _analyticsRepository: AnalyticsRepository,
      private readonly _communicationRecordRepository: CommunicationRecordRepository
  ) {}

  async getCommunicationFrequency(startDate?: string, endDate?: string, companyId?: string) {
      const dateRange = this.getDateRange(startDate, endDate);
      const frequency = await this._analyticsRepository.getCommunicationFrequency(
          dateRange.start,
          dateRange.end,
          companyId
      );

      return {
          timeframe: {
              start: dateRange.start,
              end: dateRange.end
          },
          data: frequency
      };
  }

  async getEffectivenessMetrics(startDate?: string, endDate?: string, companyId?: string) {
      const dateRange = this.getDateRange(startDate, endDate);
      const metrics = await this._analyticsRepository.getEffectivenessMetrics(
          dateRange.start,
          dateRange.end,
          companyId
      );

      const totalCommunications = metrics.reduce((sum, m) => sum + m.count, 0);

      return {
          timeframe: {
              start: dateRange.start,
              end: dateRange.end
          },
          metrics: metrics.map(m => ({
              ...m,
              percentage: (m.count / totalCommunications * 100).toFixed(2)
          }))
      };
  }

  async getOverdueTrends(months: number) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const trends = await this._analyticsRepository.getOverdueTrends(startDate, endDate);

      return {
          timeframe: {
              start: startDate,
              end: endDate
          },
          data: trends
      };
  }

  async getActivityLog(
      startDate?: string,
      endDate?: string,
      limit: number = 20,
      skip: number = 0
  ) {
      const dateRange = this.getDateRange(startDate, endDate);
      const activities = await this._analyticsRepository.getActivityLog(
          dateRange.start,
          dateRange.end,
          limit,
          skip
      );

      return {
          timeframe: {
              start: dateRange.start,
              end: dateRange.end
          },
          total: await this._analyticsRepository.getActivityCount(dateRange.start, dateRange.end),
          activities
      };
  }

  async exportReports(type: string, startDate?: string, endDate?: string) {
      const dateRange = this.getDateRange(startDate, endDate);
      let data;

      switch (type) {
          case 'frequency':
              data = await this.getCommunicationFrequency(startDate, endDate);
              break;
          case 'effectiveness':
              data = await this.getEffectivenessMetrics(startDate, endDate);
              break;
          case 'trends':
              data = await this.getOverdueTrends(6); // Default to 6 months
              break;
          case 'activity':
              data = await this.getActivityLog(startDate, endDate, 1000, 0); // Get up to 1000 records
              break;
          default:
              throw new Error('Invalid report type');
      }

      return this.formatExport(type, data);
  }

  private getDateRange(startDate?: string, endDate?: string) {
      const end = endDate ? new Date(endDate) : new Date();
      const start = startDate ? new Date(startDate) : new Date(end);
      start.setMonth(start.getMonth() - 1); // Default to last month
      return { start, end };
  }

  private formatExport(type: string, data: any) {
      // Format data based on export type (CSV, PDF, etc.)
      return {
          type,
          timestamp: new Date(),
          data
      };
  }
}


export default new AnalyticsService(
  new AnalyticsRepository(),
  new CommunicationRecordRepository()
);