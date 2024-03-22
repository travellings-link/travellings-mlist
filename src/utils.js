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

const statusIcon = {
    'LOST': 'exclamation-triangle',
    'WAIT': 'clock-o',
    'RUN': 'check-circle',
    'OTHER': 'times-circle'
};
const statusColor = {
    'LOST': 'warning',
    'WAIT': 'info',
    'RUN': 'success',
    'OTHER': 'danger'
};
export const tagColor = {
    "blog": "success",
    "normal": "secondary",
    "tech": "info",
    "site": "warning",
    "life": "primary",
    "hybrid": "danger"
}
export const getStatusIcon = status => {
    const icon = statusIcon[status] || statusIcon['OTHER'];
    return `fa-${icon}`;
};
export const getStatusColor = status => {
    const color = statusColor[status] || statusColor['OTHER'];
    return `text-${color}`;
};
export const getTagColor = tag => {
    const color = tagColor[tag] || tagColor['normal'];
    return `badge-${color}`;
}

