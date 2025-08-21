import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across all entities' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async globalSearch(@Query('q') query: string) {
    return this.searchService.globalSearch(query);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiResponse({ status: 200, description: 'Search suggestions' })
  async getSearchSuggestions(@Query('q') query: string) {
    return this.searchService.getSearchSuggestions(query);
  }
}