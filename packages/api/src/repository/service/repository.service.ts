import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repository_Entity } from '../entities/repository.entity';

@Injectable()
export class RepositoryService {
  constructor(
    private http: HttpService,
    @InjectRepository(Repository_Entity)
    private readonly projectRepository: Repository<Repository_Entity>,
  ) {}

  async createRepository(username: string, token: string) {
    const projects = await this.http
      .get(
        `http://cmpt373-1211-08.cmpt.sfu.ca:5000/api/v4/users/${username}/projects?private_token=${token}`,
      )
      .toPromise();
    projects.data.forEach(async (project) => {
      let repoId = await this.projectRepository.findOne({
        where: { repo_id: project.id },
      });
      if(!repoId){
        const repo = this.projectRepository.create({
          repo_id: project.id,
          repo_name: project.name,
          web_url: project.web_url,
          token: token,
          repo_detail: project,
        });
        await this.projectRepository.save(repo);
      }
    });
  }

  async getAllRepositories(token: string) {
    return this.projectRepository.find({
      where: { token: token },
    });
  }

  getRepositoryById(id: number) {
    return this.projectRepository.findOne({
      where: { repo_id: id },
    });
  }
}