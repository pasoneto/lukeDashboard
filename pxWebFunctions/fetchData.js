//Basic URL. Shows all parameters that are available for the particular variable.
async function baseURL(url){
  const response = await fetch(url);
  const data = await response.json();
  return data;
}


