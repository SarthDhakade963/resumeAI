import { getSession } from "next-auth/react";

export async function fetchWithToken(input: RequestInfo, init?: RequestInit) {
  const session = await getSession(); // get session
  const token = session?.accessToken; // collects the accessToken
  const headers = new Headers(init?.headers as HeadersInit); // initialize the header

  if (token) headers.set("Authorization", `Bearer ${token}`); // add the Authorization to the header

  headers.set("Content-Type", "application/json"); // add the content-type to the header

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SPRING_BASE_URL}${input}`,
    {
      ...init,
      headers,
    }
  ); // fetch the data from backend

  if (!res.ok) throw new Error(await res.text()); // if error throw error

  return res; // return the data
}
