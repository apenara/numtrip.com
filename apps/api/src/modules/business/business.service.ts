import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { BusinessRepository } from './business.repository';
import { CreateBusinessDto, UpdateBusinessDto, BusinessSearchDto } from './dto';

@Injectable()
export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async searchBusinesses(searchDto: BusinessSearchDto) {
    return this.businessRepository.search(searchDto);
  }

  async getBusinessById(id: string) {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return business;
  }

  async createBusiness(createBusinessDto: CreateBusinessDto) {
    return this.businessRepository.create(createBusinessDto);
  }

  async updateBusiness(id: string, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.getBusinessById(id);
    return this.businessRepository.update(id, updateBusinessDto);
  }

  async claimBusiness(id: string, userId?: string) {
    const business = await this.getBusinessById(id);
    
    if (business.ownerId) {
      throw new ConflictException('Business is already claimed');
    }

    return this.businessRepository.claim(id, userId);
  }

  async getBusinessesByCity(city: string) {
    return this.businessRepository.findByCity(city);
  }

  async getVerifiedBusinesses() {
    return this.businessRepository.findVerified();
  }
}