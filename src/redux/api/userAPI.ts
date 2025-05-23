import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { server } from '../store';
import { AllUsersResponse, MessageResponse, UserResponse } from '../../types/api-types';
import { User } from '../../types/types';
import axios from 'axios';
import { getAuth } from 'firebase/auth';



export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user` }),
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({
        query: (user) => ({
            url: "new",
            method: 'POST',
            body: user,
        }),
        }),
        updateUserDetails: builder.mutation({
        query: ({ id, data }) => ({
            url: `user/${id}`,
            method: 'PUT',
            body: data,
        }),
        }),
        deleteUserAccount: builder.mutation({
        query: (id) => ({
            url: `user/${id}`,
            method: 'DELETE',
        }),
        }),
        allUsers: builder.query<AllUsersResponse, string>({
            query: (id) => `all?id=${id}`,
            // providesTags: ["users"],
          }),
    }),
});

export const getUser = async(id: string)=> {
    try{
        const {data}:{data: UserResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
        return data;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

interface CartItem {
  id: string;
  quantity: number;
}

export const saveCartToServer = async (reduxCartItems: CartItem[]): Promise<void> => {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  await axios.put(
    `${import.meta.env.VITE_SERVER}/api/v1/user/cart`,
    { cartItems: reduxCartItems },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const {useLoginMutation, useDeleteUserAccountMutation, useAllUsersQuery} = userAPI