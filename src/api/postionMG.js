import axios from 'axios';
// import url from 'postcss-url';
import { loginreq, req } from './axiosFun';

const url = "http://localhost:8080" 
//职位列表
export const postionList = (params) => { return req("get", url + "/manager/selectPostionList", params) };
//下线
export const postionExpireToken = (params) => { return req("post", url + "/manager/updatePostionStatus",params) };

export const updatePostion = (params) => { return req("post", url + "/manager/updatePostion",params) };

