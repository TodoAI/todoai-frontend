/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginBodyDto {
  username: string;
  password: string;
}

export interface LoginSuccessDto {
  success: boolean;
  token: string;
}

export interface LoginErrorDto {
  success: boolean;
  message: string;
}

export interface SignupRequestDto {
  username: string;
  password: string;
  email: string;
}

export interface SignupResponseDto {
  success: boolean;
  message: string;
  user: object;
}

export interface TaskResponseDto {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  listId: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface CreateTaskDto {
  name: string;
  description: string;
}

export interface ListResponseDto {
  id: number;
  name: string;
  description: string;
  tasks: TaskResponseDto[];
}

export interface CreateListDto {
  name: string;
  description: string;
}

export interface EditListDto {
  name: string;
  description: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title TodoAI API
 * @version 1.0
 * @contact
 *
 * The TodoAI backend API description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignIn
     * @request POST:/auth/login
     */
    authControllerSignIn: (data: LoginBodyDto, params: RequestParams = {}) =>
      this.request<LoginSuccessDto, LoginErrorDto>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthControllerSignUp
     * @request POST:/auth/signup
     */
    authControllerSignUp: (data: SignupRequestDto, params: RequestParams = {}) =>
      this.request<SignupResponseDto, any>({
        path: `/auth/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  task = {
    /**
     * No description
     *
     * @tags task
     * @name TaskControllerFindOne
     * @request GET:/task/{listId}/{taskId}
     * @secure
     */
    taskControllerFindOne: (listId: number, taskId: number, params: RequestParams = {}) =>
      this.request<TaskResponseDto[], any>({
        path: `/task/${listId}/${taskId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerCreate
     * @request POST:/task/{listId}
     * @secure
     */
    taskControllerCreate: (listId: number, data: CreateTaskDto, params: RequestParams = {}) =>
      this.request<TaskResponseDto, any>({
        path: `/task/${listId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerUpdate
     * @request PUT:/task/{taskId}
     * @secure
     */
    taskControllerUpdate: (taskId: string, data: CreateTaskDto, params: RequestParams = {}) =>
      this.request<TaskResponseDto, any>({
        path: `/task/${taskId}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerDelete
     * @request DELETE:/task/{taskId}
     * @secure
     */
    taskControllerDelete: (taskId: number, params: RequestParams = {}) =>
      this.request<TaskResponseDto, any>({
        path: `/task/${taskId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerComplete
     * @request PUT:/task/{taskId}/complete
     * @secure
     */
    taskControllerComplete: (taskId: string, params: RequestParams = {}) =>
      this.request<TaskResponseDto, any>({
        path: `/task/${taskId}/complete`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name TaskControllerUncomplete
     * @request PUT:/task/{taskId}/uncomplete
     * @secure
     */
    taskControllerUncomplete: (taskId: string, params: RequestParams = {}) =>
      this.request<TaskResponseDto, any>({
        path: `/task/${taskId}/uncomplete`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  list = {
    /**
     * No description
     *
     * @tags list
     * @name ListControllerGetAllLists
     * @request GET:/list
     * @secure
     */
    listControllerGetAllLists: (params: RequestParams = {}) =>
      this.request<ListResponseDto[], any>({
        path: `/list`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags list
     * @name ListControllerCreateList
     * @request POST:/list
     * @secure
     */
    listControllerCreateList: (data: CreateListDto, params: RequestParams = {}) =>
      this.request<ListResponseDto, any>({
        path: `/list`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags list
     * @name ListControllerGetList
     * @request GET:/list/{id}
     * @secure
     */
    listControllerGetList: (id: number, params: RequestParams = {}) =>
      this.request<ListResponseDto, any>({
        path: `/list/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags list
     * @name ListControllerEditList
     * @request PUT:/list/{id}
     * @secure
     */
    listControllerEditList: (id: string, data: EditListDto, params: RequestParams = {}) =>
      this.request<ListResponseDto, any>({
        path: `/list/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags list
     * @name ListControllerDeleteList
     * @request DELETE:/list/{id}
     * @secure
     */
    listControllerDeleteList: (id: number, params: RequestParams = {}) =>
      this.request<ListResponseDto, any>({
        path: `/list/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
