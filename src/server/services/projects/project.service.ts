import { projectRepository } from '@/server/repositories/project.repository';
import { organizationRepository } from '@/server/repositories/organization.repository';
import { NotFoundError, ConflictError, ForbiddenError } from '@/server/utils/errors';
import { CreateProjectInput, UpdateProjectInput } from '@/server/utils/validators';

export class ProjectService {
  /**
   * Create a new project
   */
  async create(organizationId: number, data: CreateProjectInput, userId: number) {
    // Verify organization exists
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Check if project key already exists in organization
    const existingProject = await projectRepository.findByOrgAndKey(organizationId, data.key);
    if (existingProject) {
      throw new ConflictError('Project key already exists in this organization');
    }

    // Create project
    const project = await projectRepository.create({
      ...data,
      organizationId,
      createdBy: userId,
      status: 'active',
    });

    // Add creator as project manager
    await projectRepository.addMember(project.id, userId, 'project_manager');

    return project;
  }

  /**
   * Get project by ID
   */
  async getById(id: number) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    return project;
  }

  /**
   * Get projects by organization
   */
  async getByOrganization(organizationId: number) {
    return projectRepository.findByOrganization(organizationId);
  }

  /**
   * Get user's projects
   */
  async getUserProjects(userId: number) {
    return projectRepository.getUserProjects(userId);
  }

  /**
   * Update project
   */
  async update(id: number, data: UpdateProjectInput) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const updatedProject = await projectRepository.update(id, data);
    return updatedProject;
  }

  /**
   * Delete project
   */
  async delete(id: number) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    await projectRepository.delete(id);
    return { success: true };
  }

  /**
   * Add member to project
   */
  async addMember(projectId: number, userId: number, role: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    // Check if user is already a member
    const isMember = await projectRepository.isMember(projectId, userId);
    if (isMember) {
      throw new ConflictError('User is already a project member');
    }

    return projectRepository.addMember(projectId, userId, role);
  }

  /**
   * Remove member from project
   */
  async removeMember(projectId: number, userId: number) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const result = await projectRepository.removeMember(projectId, userId);
    if (!result) {
      throw new NotFoundError('Member not found in project');
    }

    return { success: true };
  }

  /**
   * Get project members
   */
  async getMembers(projectId: number) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return projectRepository.getMembers(projectId);
  }

  /**
   * Update member role
   */
  async updateMemberRole(projectId: number, userId: number, role: string) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return projectRepository.updateMemberRole(projectId, userId, role);
  }

  /**
   * Archive project
   */
  async archive(id: number) {
    return this.update(id, { status: 'archived' });
  }

  /**
   * Complete project
   */
  async complete(id: number) {
    return this.update(id, { status: 'completed' });
  }
}

export const projectService = new ProjectService();
