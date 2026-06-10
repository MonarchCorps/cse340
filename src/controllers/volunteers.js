import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

const processAddVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have signed up to volunteer for this project!');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'There was an error signing up. Please try again.');
    }

    res.redirect(`/project/${projectId}`);
};

const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    const returnTo = req.body.returnTo || `/project/${projectId}`;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing your volunteer status. Please try again.');
    }

    res.redirect(returnTo);
};

export { processAddVolunteer, processRemoveVolunteer };
