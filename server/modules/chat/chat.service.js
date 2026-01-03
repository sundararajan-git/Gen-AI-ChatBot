import { Chat } from "../../model/chatModel.js"
import { searchKnowledgeBase, generateAnswer } from '../../services/genAI.js'


export const askQuestionService = async (userId, question) => {
    if (!question) {
        const err = new Error('Question is required');
        err.statusCode = 400;
        throw err;
    }

    const contextChunks = await searchKnowledgeBase(question)

    const aiResponse = await generateAnswer(question, contextChunks)

    const answerText = aiResponse.answer || "No answer generated";

    const chat = await Chat.create({
        userId,
        question,
        answer: answerText,
        suggestions: aiResponse.suggestions || [],
        contextUsed: contextChunks.map(c => c._id)
    })

    return {
        answer: answerText,
        suggestions: aiResponse.suggestions || [],
        logsId: chat._id,
        contextSources: contextChunks.map(c => c._id)
    };
}

export const submitFeedbackService = async (logId, rating) => {
    await Chat.findByIdAndUpdate(logId, { feedback: rating })
}

export const getUserHistoryService = async (userId) => {
    return Chat.find({ userId }).sort({ createdAt: -1 });
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