import axiosInstance from '../../environment/axiosinstance'

export const getUser = async () => {
    return await axiosInstance.get('api/user/me');
};

export const updateUser = async (updateRequest) => {
    return await axiosInstance.put('api/user/me', updateRequest);
};

export const deleteUser = async () => {
    return await axiosInstance.delete('api/user/me');
};