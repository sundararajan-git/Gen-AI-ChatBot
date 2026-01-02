import { askQuestionService, getAdminStatsService, getUserHistoryService, submitFeedbackService } from "./chat.service.js";


export const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const userId = req.user.id;

        const result = await askQuestionService(userId, question);
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const submitFeedback = async (req, res) => {
    try {
        const { logId, rating } = req.body;
        await submitFeedbackService(logId, rating);
        res.json({ message: 'Feedback received' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getHistory = async (req, res) => {
    try {
        const logs = await getUserHistoryService(req.user.id);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const stats = await getAdminStatsService();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};