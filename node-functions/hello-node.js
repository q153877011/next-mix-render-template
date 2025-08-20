// export default function onRequest(context) {
//   const {geo} = context;

//   return new Response(JSON.stringify({
//     message: 'Hello Node!',
//     geo: geo,
//   }), {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
// }

export default function onRequest(context) {
  return new Response('Hello Node!')
}