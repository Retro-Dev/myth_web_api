import React, {createContext, useReducer} from "react";
import Reducer from './Reducer'
import {Language} from '../Language/Index';

const initialState = {
    data: [],
    flash_message_show: false,
    user:{},
    lang:Language,
    inbox: null,
    communication: null
};

export const Context = createContext(initialState);

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export default Store;
