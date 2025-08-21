import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: string) {
    // TODO: Implement advanced search across businesses
    return {
      businesses: await this.prisma.business.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          active: true,
        },
        take: 10,
      }),
    };
  }

  async getSearchSuggestions(query: string) {
    // TODO: Implement search suggestions
    return {
      suggestions: [
        `${query} hotels`,
        `${query} tours`,
        `${query} transport`,
      ],
    };
  }
}