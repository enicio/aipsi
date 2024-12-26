import type { DataSource, Repository } from 'typeorm';
import { Enterprise } from '../entities/enterprise.entity';

export class EnterpriseService {
  private repository: Repository<Enterprise>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Enterprise);
  }

  async create(data: Partial<Enterprise>): Promise<Enterprise> {
    const enterprise = this.repository.create(data);
    return this.repository.save(enterprise);
  }

  async findAll(): Promise<Enterprise[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Enterprise | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['employees', 'devices'],
    });
  }
}
