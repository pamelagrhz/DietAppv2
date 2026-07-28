/**
 * Sends a standardized success response.
 *
 * {
 *   success: true,
 *   data: <payload>
 * }
 */
export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export default sendSuccess;
