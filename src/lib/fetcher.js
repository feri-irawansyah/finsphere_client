let isRefreshing = false;
let requestQueue = [];

async function refreshToken(fetch) {
    const res = await fetch('/api/api/platform/console/refresh', {
        method: 'POST',
        credentials: 'include'
    });

    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();
    localStorage.setItem('access_token', data.accessToken);
    return data.accessToken;
}

function retryQueuedRequests(fetch, newToken) {
    requestQueue.forEach(({ resolve, reject, config }) => {
        fetcher(fetch, config.url, {
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${newToken}`
            }
        }).then(resolve).catch(reject);
    });
    requestQueue = [];
}

async function fetcher(fetch, url, options = {}) {
    const token = localStorage.getItem('access_token');

    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (!url.includes('/console/refresh') && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`/api${url}`, config);

    if (res.ok) {
        return res.json();
    }

    if (res.status === 401 && !url.includes('/console/refresh')) {
        return new Promise((resolve, reject) => {
            requestQueue.push({ resolve, reject, config: { url, ...config } });

            if (!isRefreshing) {
                isRefreshing = true;

                refreshToken(fetch)
                    .then(token => {
                        retryQueuedRequests(fetch, token);
                        isRefreshing = false;
                    })
                    .catch(() => {
                        isRefreshing = false;
                        requestQueue = [];
                        localStorage.removeItem('access_token');
                        reject(new Error('UNAUTHORIZED'));
                    });
            }
        });
    }

    let errorBody;
    try {
        errorBody = await res.json();
    } catch {}

    throw {
        status: res.status,
        ...errorBody
    };
}

export default fetcher;
