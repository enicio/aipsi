import { EntityRepository, Repository } from 'typeorm';
import { Enterprise } from '../entities/enterprise.entity';

@EntityRepository(Enterprise)
export class EnterpriseRepository extends Repository<Enterprise> {
  async findWithEmployeesAndDevices(id: string): Promise<Enterprise | null> {
    return this.findOne({
      where: { id },
      relations: ['employees', 'devices'],
    });
  }
}
