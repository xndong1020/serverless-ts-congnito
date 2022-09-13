// Interfaces
import {
  IResponse,
  IResponseBody,
  ResponseHeader,
} from "src/interfaces/response.interface";

// Enums
import { Status } from "../enums/status.enum";
import { StatusCode } from "../enums/status-code.enum";

export const STATUS_MESSAGES = {
  [StatusCode.OK]: Status.SUCCESS,
  [StatusCode.BAD_REQUEST]: Status.BAD_REQUEST,
  [StatusCode.ERROR]: Status.ERROR,
};

const RESPONSE_HEADERS: ResponseHeader = {
  "Content-Type": "application/json",
  //   "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  //   "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

export default class ResponseModel {
  private body: IResponseBody;
  private code: number;

  constructor(data = {}, code = 402, message = "") {
    this.body = {
      data: data,
      message: message,
      status: STATUS_MESSAGES[code],
    };
    this.code = code;
  }

  setBodyVariable = (variable: string, value: string): void => {
    this.body[variable] = value;
  };

  setData = (data: any): void => {
    this.body.data = data;
  };

  setCode = (code: number): void => {
    this.code = code;
  };

  getCode = (): number => {
    return this.code;
  };

  setMessage = (message: string): void => {
    this.body.message = message;
  };

  getMessage = (): any => {
    return this.body.message;
  };

  generate = (): IResponse => {
    return {
      statusCode: this.code,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify(this.body),
    };
  };
}
