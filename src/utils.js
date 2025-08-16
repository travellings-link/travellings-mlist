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
    const resObj = await response.json();
    if (!resObj.success) {
        toast.error(resObj.msg);
        return null;
    }
    if (!resObj.data) {
        return resObj.msg;
    }

    return resObj.data;
}

export async function getAllDataWithFallback(toast) {
    const primaryUrl = import.meta.env.DEV ? '/api/all' : 'https://api.travellings.cn/all';
    const backupUrl = 'https://backup.api.travellings.cn/list.json';
    const timeout = 10000;

    const fetchWithTimeout = (url, timeoutMs) => {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
            )
        ]);
    };

    try {
        const response = await fetchWithTimeout(primaryUrl, timeout);

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.warn('Primary API failed, trying backup:', error.message);
        toast.warning(`开往主服务器出现了故障（可能正在遭受攻击）。当前已自动使用备份的数据（可能并不是最新的）。
The main server has malfunctioned (possibly under attack). Currently, backup data (which may not be the latest) has been automatically used instead.`);

        try {
            const backupResponse = await fetchWithTimeout(backupUrl, timeout);

            if (!backupResponse.ok) {
                throw new Error(`Backup API HTTP Error ${backupResponse.status}: ${backupResponse.statusText}`);
            }

            return await backupResponse.json();
        } catch (backupError) {
            console.error('Both primary and backup APIs failed');
            throw new Error(`All APIs failed. Last error: ${backupError.message}`);
        }
    }
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

