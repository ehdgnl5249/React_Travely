import React, { createContext, useContext } from "react";
import useReducerWithSideEffects, { UpdateWithSideEffect } from "use-reducer-with-side-effects";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";
// 이 로직에서는 단순 메모리만 저장하기 때문에 useLocalStorage.js를 통해 로컬스토리지에 저장
// getStorageItem, setStorageItem

const AppContext = createContext();

///////////////// reducer
// reducer는 순수함수로서 side-effect나 localstorage에 접근하는 것을 허용하지 않음
// => redux나 redux-saga를 사용해서 side-effect 등을 구현함.
// but, redux, redux-saga 를 사용하지 않고 별도의 thrid party library
// use-reducer-with-side-effects 사용

const reducer = (prevState, action) => {
  const { type } = action;
  if (type === SET_TOKEN) {
    // token 저장
    console.log(action);
    const { payload: { 0: jwtToken } } = action;
    const { payload: { 1: refreshToken } } = action;
    // const { payload: jwtToken } = action; // payload의 값(jwtToken) 빼옴

    console.log("#페이로드 : ", jwtToken);
    console.log("#리프 : ", refreshToken);
    const newState = { ...prevState, jwtToken, refreshToken, isAuthenticated: true };

    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", jwtToken); // key("jwtToken")와 value(jwtToken)
      setStorageItem("refreshToken", refreshToken);
    });
  } else if (type === DELETE_TOKEN) {
    const newState = { ...prevState, jwtToken: "", isAuthenticated: false };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", ""); // token 삭제
    });
  }
  return prevState;
};
////////////////////////////////////////////////

////////////// AppProvider
export const AppProvider = ({ children }) => {
  const jwtToken = getStorageItem("jwtToken", ""); // 토큰 가져옴
  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    jwtToken,
    isAuthenticated: jwtToken.length > 0 // 있으면 true
  });
  return <AppContext.Provider value={{ store, dispatch }}>{children}</AppContext.Provider>;
};
////////////////////////////////////////////////

export const useAppContext = () => useContext(AppContext);
// Context API, Provider (store, dispatch) 값을 읽어오기 위한 함수

//Actions
const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";

// Action Creators, 실제 노출될 함수
export const setToken = token => ({ type: SET_TOKEN, payload: token }); // reducer 함수 즉시 실행됨.
export const deleteToken = () => ({ type: DELETE_TOKEN });
