import {
    USER_GET_MULTIPLE,
    USER_GET_ONE, 
    USER_LOADING,
    USER_UPLOADING,
    USER_UPLOADING_SUCCESS,
    USER_UPLOADING_FAIL,
    USER_LOADING_ERROR 
} from "../types/User";

import { AsyncStorage } from 'react-native';
const saveUserId = async user => {
    try {
      await AsyncStorage.setItem('user', user)
      .then(d=>{
        console.log(JSON.stringify(user));
      });
    } catch (error) {
        console.log(error.message);
    }
  };
const initialState = {
    isLoading: false,
    isActive: false,
    users: [],
    user: {},
    msg: null,
    isEdit: 0,
    isForm: false,
    showActions: false,
    isPro:false
}

export default function(state = initialState, action){
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                user: {},
                isLoading: true
            };
        case USER_UPLOADING:
            return {
                ...state,
                
            };
        case USER_GET_MULTIPLE:
           
            saveUserId(JSON.stringify(action.payload));
            return {
                ...state,
                users : action.payload,
                user : action.payload,
                isActive : true,
                isLoading: false
            };
        case USER_GET_ONE:
            return {
                ...state,
                user: action.payload,
                isLoading: false
            };
         case USER_UPLOADING_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isActive: true
            };
        case USER_LOADING_ERROR:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
}