# 基于 fetch 的请求类封装

## FetchClient

```ts
interface FetchInternalConfig extends RequestInit {}

export interface FetchClientOptions extends FetchInternalConfig {
  baseURL: string
  timeout?: number
}

export interface FetchRequestOptions extends FetchInternalConfig {
  format?: 'arrayBuffer' | 'blob' | 'json' | 'text' | 'formData'
  timeout?: number
  onError?: (ctx: FetchErrorContext) => void
}

interface FetchMergedConfig extends FetchInternalConfig {
  headers: Headers
}

export interface FetchBeforeContext {
  url: string
  timeout: number
  options: FetchMergedConfig
}

export interface FetchAfterContext<T = any> {
  data: T
  request: FetchBeforeContext
  response: Response
}

export interface FetchErrorContext<E = any> {
  type: FetchErrorType
  cause?: E
  message?: string
}

export type FetchBeforeHook = (
  ctx: FetchBeforeContext
) => FetchBeforeContext | Promise<never>

export type FetchAfterHook = (
  ctx: FetchAfterContext
) => FetchAfterContext | Promise<never>

export type FetchErrorHook = (ctx: FetchErrorContext) => FetchErrorContext

export enum FetchHookType {
  BEFORE = 'before',
  AFTER = 'after',
  ERROR = 'error'
}

export enum FetchErrorType {
  HTTP = 'http',
  SERVER = 'server',
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  NATIVE = 'native'
}

export function createErrorContext(
  type: FetchErrorType,
  options: Omit<FetchErrorContext, 'type'> = {}
): FetchErrorContext {
  const { cause, message } = options
  return { type, cause, message }
}

export function isPureObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function isFunction(value: unknown): asserts value is Function {
  if (typeof value !== 'function') {
    throw new TypeError('Invalid argument: Expected fn is a function')
  }
}

function headersToObject(
  headers: HeadersInit | undefined
): Record<string, string> {
  if (Array.isArray(headers) || headers instanceof Headers)
    return Object.fromEntries(headers.entries())
  return headers || {}
}

export class FetchClient {
  /**
   * @internal
   */
  private _baseURL: string

  /**
   * @internal
   */
  private _timeout: number

  /**
   * @internal
   */
  private _config: FetchInternalConfig

  /**
   * hooks
   */
  public fetchBeforeHooks: FetchBeforeHook[] = []
  public fetchAfterHooks: FetchAfterHook[] = []
  public fetchErrorHooks: FetchErrorHook[] = []

  constructor(options: FetchClientOptions) {
    const { baseURL, timeout = 0, ...config } = options
    this._baseURL = baseURL
    this._timeout = timeout
    this._config = config
  }

  private mergeConfig(...configs: FetchInternalConfig[]) {
    const _headers = new Headers()
    const _config: FetchInternalConfig = {}

    for (const { headers = [], ...config } of configs) {
      let headerEntries = []

      if (Array.isArray(headers)) {
        headerEntries = headers
      } else if (headers instanceof Headers) {
        headerEntries = [...headers.entries()]
      } else {
        headerEntries = Object.entries(headers)
      }

      for (const [key, value] of headerEntries) {
        value && _headers.set(key, value)
      }

      Object.assign(_config, config)
    }

    _config.headers = _headers
    return _config as FetchMergedConfig
  }

  private async createFetchTask(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response

      // http 状态码错误
      return Promise.reject(
        createErrorContext(FetchErrorType.HTTP, { cause: response })
      )
    } catch (error) {
      // 网络错误或无法连接
      return Promise.reject(
        createErrorContext(FetchErrorType.NETWORK, { cause: error })
      )
    }
  }

  private async createAbortTask(timeout: number, abort: Function) {
    await new Promise(resolve => setTimeout(resolve, timeout))
    abort()
    return Promise.reject(createErrorContext(FetchErrorType.TIMEOUT))
  }

  public onFetchBefore(fn: FetchBeforeHook) {
    isFunction(fn)
    this.fetchBeforeHooks.push(fn)
    return () => {
      this.fetchBeforeHooks = this.fetchBeforeHooks.filter(v => v !== fn)
    }
  }

  public onFetchAfter(fn: FetchAfterHook) {
    isFunction(fn)
    this.fetchAfterHooks.push(fn)
    return () => {
      this.fetchAfterHooks = this.fetchAfterHooks.filter(v => v !== fn)
    }
  }

  public onFetchError(fn: FetchErrorHook) {
    isFunction(fn)
    this.fetchErrorHooks.push(fn)
  }

  public async request<T = any>(
    url: string,
    options: FetchRequestOptions = {}
  ) {
    try {
      const { timeout, format = 'json', ...config } = options
      const mergedConfig = this.mergeConfig(this._config, config)

      let context: FetchBeforeContext = {
        url: this._baseURL + url,
        timeout: timeout ?? this._timeout,
        options: mergedConfig
      }
      for (const hook of this.fetchBeforeHooks) {
        context = await hook(context)
      }

      const tasks = []

      // 如果 signal 由外部控制，那么内部不再创建 signal，同时禁用接口超时取消功能
      const canAbort = !context.options.signal && context.timeout > 0

      if (canAbort) {
        const controller = new AbortController()
        const abort = () => controller.abort()
        context.options.signal = controller.signal
        tasks.push(this.createAbortTask(context.timeout, abort))
      }
      tasks.push(this.createFetchTask(context.url, context.options))

      const response = await Promise.race(tasks)
      const httpData = await response[format]()

      let responseContext: FetchAfterContext = {
        response,
        data: httpData,
        request: context
      }
      for (const hook of this.fetchAfterHooks) {
        responseContext = await hook(responseContext)
      }

      return { data: responseContext.data as T }
    } catch (error) {
      let context = null
      const isNativeError = error instanceof Error

      if (isNativeError) {
        context = createErrorContext(FetchErrorType.NATIVE, { cause: error })
      } else {
        context = error as FetchErrorContext
      }

      for (const hook of this.fetchErrorHooks) {
        context = hook(context)
      }

      const onError = options.onError
      onError && onError(context)

      const httpError = isNativeError ? error : new Error(context.message)
      return Promise.reject(httpError)
    }
  }

  public get<T = any>(
    url: string,
    payload: any = null,
    options: FetchRequestOptions = {}
  ) {
    if (isPureObject(payload)) {
      url += `?${new URLSearchParams(payload)?.toString()}`
    } else if (payload instanceof URLSearchParams) {
      url += `?${payload?.toString()}`
    }

    options.headers = {
      'Content-Type': 'text/plain; charset=UTF-8',
      ...headersToObject(options.headers)
    }
    return this.request<T>(url, { ...options, method: 'get' })
  }

  public post<T>(
    url: string,
    payload: any = {},
    options: FetchRequestOptions = {}
  ) {
    const isJSON = isPureObject(payload)
    const defaultType = isJSON ? 'application/json' : 'text/plain'

    options.headers = {
      'Content-Type': `${defaultType}; charset=utf-8`,
      ...headersToObject(options.headers)
    }

    if (payload instanceof FormData) {
      options.headers['Content-Type'] = ''
    }

    const body = isJSON ? JSON.stringify(payload) : payload
    return this.request<T>(url, { ...options, body, method: 'post' })
  }

  public upload<T>(
    url: string,
    payload: FormData,
    options: FetchRequestOptions = {}
  ) {
    if (!(payload instanceof FormData)) {
      throw new TypeError('Expected payload is FormData instance')
    }

    options.headers = {
      ...headersToObject(options.headers),
      'Content-Type': ''
    }
    return this.request<T>(url, { ...options, body: payload, method: 'post' })
  }

  public download<T>(
    url: string,
    payload: any,
    options: FetchRequestOptions = {}
  ) {
    const method = options.method ?? 'post'
    options.format = 'blob'
    if (method === 'get') {
      return this.get(url, payload, options)
    }
    return this.post(url, payload, options)
  }
}
```

## 导出与预设

::: code-group

```ts [index.ts]
import { FetchClient } from './request.ts'
import {
  createHeadersUpdateHook,
  responseInterceptorHook,
  genErrorMessageHook,
  createMakeMessageHook
} from './preset-hooks.ts'

function installBeforeHooks(instance: FetchClient) {
  const formatToken = (token: string | null) => {
    return token ? `Bearer ${token}` : ''
  }

  const tokenGetter = () => formatToken('token')

  instance.onFetchBefore(createHeadersUpdateHook(tokenGetter))
  return instance
}

function installAfterHooks(instance: FetchClient) {
  instance.onFetchAfter(responseInterceptorHook)
  return instance
}

function installErrorHooks(instance: FetchClient) {
  const makeErrorMessage = (message: string) => {
    console.log('makeErrorMessage', message)
  }

  instance.onFetchError(genErrorMessageHook)
  instance.onFetchError(createMakeMessageHook(makeErrorMessage))

  return instance
}

export function createFetchClient(baseURL: string) {
  const instance = new FetchClient({ baseURL, timeout: 60_000 })
  installBeforeHooks(instance)
  installAfterHooks(instance)
  installErrorHooks(instance)
  return instance
}
```

```ts [preset-hooks.ts]
import {
  type FetchBeforeContext,
  type FetchAfterContext,
  type FetchErrorContext,
  FetchErrorType,
  isPureObject,
  createErrorContext
} from './request.ts'

export function createHeadersUpdateHook(tokenGetter: () => string) {
  return (ctx: FetchBeforeContext) => {
    ctx.options.headers.set('Authorization', tokenGetter())
    ctx.options.headers.set('Accept-Language', 'zh-cn')
    return ctx
  }
}

export function responseInterceptorHook(ctx: FetchAfterContext) {
  const data = ctx.data
  if (isPureObject(data) && data.msg) {
    return Promise.reject(
      createErrorContext(FetchErrorType.SERVER, { cause: data })
    )
  }
  return ctx
}

export function genErrorMessageHook(ctx: FetchErrorContext) {
  let message: string = ''

  switch (ctx.type) {
    case FetchErrorType.HTTP:
      message = handleHttpStatusMessage(ctx.cause)
      break
    case FetchErrorType.SERVER:
      message = handleServerErrorMessage(ctx.cause)
      break
    case FetchErrorType.TIMEOUT:
      message = 'feedback.http.requestTimeout'
      break
    case FetchErrorType.NETWORK:
      message = 'feedback.http.networkError'
      break
    case FetchErrorType.NATIVE:
      break
    default:
      break
  }

  ctx.message = message || ctx.message
  return ctx
}

export function createMakeMessageHook(makeMessage: (message: string) => void) {
  return (ctx: FetchErrorContext) => {
    if (ctx.message) {
      makeMessage(ctx.message)
    }
    return ctx
  }
}

function handleHttpStatusMessage(response: Response) {
  const { status, statusText } = response
  let feedbackMessage = ''
  switch (status) {
    case 400:
      feedbackMessage = 'feedback.http.badRequest'
      break
    case 401:
      feedbackMessage = 'feedback.http.unauthorized'
      break
    case 403:
      feedbackMessage = 'feedback.http.forbidden'
      break
    case 404:
      feedbackMessage = 'feedback.http.notFound'
      break
    case 408:
      feedbackMessage = 'feedback.http.requestTimeout'
      break
    case 500:
      feedbackMessage = 'feedback.http.serverError'
      break
    default:
      feedbackMessage = statusText
      break
  }
  return feedbackMessage
}

interface HttpResponseData<T = any> {
  code?: number
  msg?: string
  data?: T
}

function handleServerErrorMessage(data: HttpResponseData) {
  if (!isPureObject(data)) return ''
  return data.msg || ''
}
```

:::
