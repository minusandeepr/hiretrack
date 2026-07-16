/**
 * @file src/utils/ApiResponse.js
 * @description Standardised API response helper.
 *   Every successful response from the server goes through one of these
 *   static methods so the front-end always receives a consistent shape:
 *
 *   {
 *     success: true,
 *     message: "…",
 *     data: { … },
 *     pagination?: { page, limit, total, pages }
 *   }
 */

class ApiResponse {
  /**
   * Send a standard success response.
   *
   * @param {import('express').Response} res        — Express response object.
   * @param {*}                          data       — Payload to return.
   * @param {string}                     [message]  — Human-readable message.
   * @param {number}                     [statusCode=200] — HTTP status code.
   * @returns {import('express').Response}
   */
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send a paginated success response.
   *
   * @param {import('express').Response} res        — Express response object.
   * @param {*}                          data       — Array of records.
   * @param {object}                     pagination — Pagination metadata.
   * @param {number}                     pagination.page  — Current page number.
   * @param {number}                     pagination.limit — Items per page.
   * @param {number}                     pagination.total — Total matching items.
   * @param {number}                     pagination.pages — Total page count.
   * @param {string}                     [message]  — Human-readable message.
   * @returns {import('express').Response}
   */
  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

export default ApiResponse;
