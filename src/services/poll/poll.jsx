import axiosInstance from '../../environment/axiosinstance'

export const postPoll = async (pollDTO) => {
    try {
        const response = await axiosInstance.post('api/polls/poll', pollDTO);
        return response;
    } catch(error) {
        throw error;
    }
};

export const getAllPolls = async () => {
    try {
        const response = await axiosInstance.get('api/polls/public/all');
        return response;
    } catch(error) {
        throw error;
    }
};

export const getMyPolls = async () => {
    try {
        const response = await axiosInstance.get('api/polls/my-polls');
        return response;
    } catch(error) {
        throw error;
    }
};

export const deletePollById = async (id) => {
    try {
        const response = await axiosInstance.delete(`api/polls/poll/${id}`);
        return response;
    } catch(error) {
        throw error;
    }
};

export const voteOnPoll = async (pollId, optionId) => {
    try {
        const response = await axiosInstance.post(`/api/vote?pollId=${pollId}&optionId=${optionId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const cancelVote = async (pollId) => {
    try {
        const response = await axiosInstance.delete(`/api/vote?pollId=${pollId}`);
        return response;
    } catch (error) {
        throw error;
    }
}