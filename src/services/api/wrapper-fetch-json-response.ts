export default async function wrapperFetchJsonResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

