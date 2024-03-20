export const api = async (path, method = "GET", toast = null, data = null, credentials = "include") => {
    let baseUrl = "https://api.travellings.cn";
    if (import.meta.env.DEV) {
        baseUrl = "/api"; 
    }
    
    const url = baseUrl + path;
    const body = data ? JSON.stringify(data) : null;
    const headers = {
        "Content-Type": "application/json",
    };
    const response = await fetch(url, {
        method,
        body,
        headers,
        credentials,
    });
    const resObj =  await response.json();
    if (!resObj.success) {
        toast.error(resObj.msg);
        return null;
    }
    return resObj.data;
}