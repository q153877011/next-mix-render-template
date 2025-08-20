// export default function onRequest(context) {
//   return new Response('Hello Edge!')
// }

export default function onRequest(context) {
  const {geo} = context;

  return new Response(JSON.stringify({
    message: 'Hello Edge!',
    geo: geo,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}