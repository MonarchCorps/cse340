import { getUpcomingProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = project ? project.title : 'Project Details';

    res.render('project', { title, project, categories });
};

export { showProjectsPage, showProjectDetailsPage };
