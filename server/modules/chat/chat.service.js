import { Chat } from "../../model/chatModel.js"
import { searchKnowledgeBase, generateAnswer } from '../../services/genAI.js'


export const askQuestionService = async (userId, question) => {
    if (!question) {
        const err = new Error('Question is required');
        err.statusCode = 400;
        throw err;
    }

    const contextChunks = await searchKnowledgeBase(question)

    const answer = await generateAnswer(question, contextChunks)

    const chat = await Chat.create({
        userId,
        question,
        answer,
        contextUsed: contextChunks.map(c => c._id)
    })

    return {
        answer,
        logsId: chat._id,
        contextSources: contextChunks.map(c => c._id)
    };
}

export const submitFeedbackService = async (logId, rating) => {
    await Chat.findByIdAndUpdate(logId, { rating })
}

export const getUserHistoryService = async (userId) => {
    return ChatLog.find({ userId }).sort({ createdAt: -1 });
}

export const getAdminStatsService = async () => {
    const totalQueries = await Chat.countDocuments()

    const feedbackStats = await Chat.aggregate([
        { $group: { _id: "$rating", count: { $sum: 1 } } }
    ])

    const recentLogs = await Chat.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'username');

    return { totalQueries, feedbackStats, recentLogs };
}