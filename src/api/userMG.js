import axios from 'axios';
// import url from 'postcss-url';
import { loginreq, req } from './axiosFun';

const url = "http://localhost:8080"  
// 登录接口 
export const login = (params) => { return loginreq("post", url + "/manager/doLogin", params) };


/**
 * 用户管理 
 **/
// 用户管理-获取用户列表
export const userList = (params) => { return req("get", url + "/manager/selectUserList", params) };
// 用户管理-用户下线
export const userExpireToken = (params) => { return req("post", url + "/manager/updateUserStatus",params) };
