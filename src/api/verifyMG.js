import axios from 'axios';
// import url from 'postcss-url';
import { loginreq, req } from './axiosFun';

const url = "http://localhost:8080"  


// 公司管理-获取公司列表
export const verifyList = (params) => { return req("get", url + "/manager/selectVerifyList", params) };

export const verifyExpireToken = (params) => { return req("post", url + "/manager/updateVerifyStatus",params) };  