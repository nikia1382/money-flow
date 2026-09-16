export async function onRequest(context) {
  const backendUrl =
    context.env.BACKEND_URL?.replace(
      /\/+$/,
      '',
    );

  if (
    !backendUrl ||
    !backendUrl.startsWith('https://')
  ) {
    return new Response(
      JSON.stringify({
        message:
          'BACKEND_URL is not configured.',
      }),
      {
        status: 500,
        headers: {
          'content-type':
            'application/json',
        },
      },
    );
  }

  const incomingUrl =
    new URL(
      context.request.url,
    );

  const targetUrl =
    new URL(
      incomingUrl.pathname +
        incomingUrl.search,
      backendUrl,
    );

  const headers =
    new Headers(
      context.request.headers,
    );

  headers.delete('host');
  headers.delete('origin');

  const backendRequest =
    new Request(
      targetUrl.toString(),
      {
        method:
          context.request.method,

        headers,

        body: [
          'GET',
          'HEAD',
        ].includes(
          context.request.method,
        )
          ? undefined
          : context.request.body,

        redirect: 'manual',
      },
    );

  return fetch(
    backendRequest,
  );
}
