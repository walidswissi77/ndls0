module.exports = {
  SUCCESS : { code: 200, message: "Success"},
  CREATED : { code: 201, message: "Entry Created"},

  BAD_REQUEST : { code: 400, message: "Bad Request"},
  UNAUTHORIZED : { code: 401, message: "Unauthorized Access"},
  FORBIDDEN : { code: 403, message: "Forbidden Access"},
  NOT_FOUND : { code: 404, message: "Resource Not Found"},
  METHOD_NOT_ALLOWED : { code: 405, message: "Mehtod Not Allowed"},
  REQUEST_TIMEOUT : { code: 408, message: "Request Timeout"},

  INTERNAL_SERVER_ERROR: { code: 500, message: "Internal Server Error"},
  NOT_IMPLEMENTED: { code: 501, message: "Method Not Implemented"},
  BAD_GATEWAY: { code: 502, message: "Bad Gateway"},
  SERVICE_UNAVAILABLE: { code: 503, message: "Service Unavailabale"},
  GATEWAY_TIMEOUT: { code: 504, message: "Gateway Timeout"},
  Network_AUTHENTICATION_REQUIRED: { code: 511, message: "Network Authentication Required"},
}