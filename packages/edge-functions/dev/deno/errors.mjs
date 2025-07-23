// @ts-check

/**
 * @param {unknown} error
 */
export const getErrorResponse = (error) => {
  // Sanitize error output to avoid exposing sensitive internal details
  const errorData = typeof error === 'string' ? error : 'Internal Server Error'

  return Response.json(
    {
      error: errorData,
    },
    {
      headers: {
        'x-nf-uncaught-error': '1',
      },
      status: 500,
    },
  )
}
