import { RepositoryMember } from '@ceres/types';
import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Repository } from '../repository.entity';
import { RepositoryMember as RepositoryMemberEntity } from './repository-member.entity';

@Injectable()
export class RepositoryMemberService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(RepositoryMemberEntity)
    private readonly memberRepository: TypeORMRepository<RepositoryMemberEntity>,
  ) {}

  async syncForRepository(repository: Repository, token: string) {
    const members = await this.fetchForRepository(repository, token);
    return this.createOrUpdate(members, repository);
  }

  async findAllForRepository(repository: Repository) {
    return this.memberRepository.find({
      where: { repository: repository },
    });
  }

  private async createOrUpdate(
    members: RepositoryMember[],
    repository: Repository,
  ) {
    const entities = await Promise.all(
      members.map(async (member) => {
        let found = await this.memberRepository
          .createQueryBuilder()
          .where('resource @> :resource', {
            resource: {
              id: member.id,
            },
          })
          .andWhere('repository_id = :repositoryId', {
            repositoryId: repository.id,
          })
          .getOne();
        if (!found) {
          found = this.memberRepository.create({
            repository: repository,
            resource: member,
          });
        } else {
          found.resource = member;
        }
        return found;
      }),
    );
    return this.memberRepository.save(entities);
  }

  private async fetchForRepository(repository: Repository, token: string) {
    const url = `/projects/${repository.resource.id}/members/all`;
    const axiosResponse = await this.httpService
      .get<RepositoryMember[]>(url, {
        headers: {
          'PRIVATE-TOKEN': token,
        },
        params: {
          per_page: 50,
        },
      })
      .toPromise();
    return axiosResponse.data;
  }
}