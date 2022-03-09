import axios from 'axios';
// import url from 'postcss-url';
import { loginreq, req } from './axiosFun';

const url = "http://localhost:8080"  


//获取公司列表
export const companyList = (params) => { return req("get", url + "/manager/selectCompanyList", params) };
//添加
export const addCompany = (params) => { return req("post", url + "/manager/addCompany", params) };
//下架
export const companyExpireToken = (params) => { return req("post", url + "/manager/updateCompanyStatus",params) };

export const updateCompany = (params) => { return req("post", url + "/manager/updateCompany",params) };