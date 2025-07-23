export async function retryAsync<T>(
    fn: () => Promise<T>,
    retries: number,
    delayMs: number,
    onRetry?: (err: any, attempt: number) => void
): Promise<T> {
    let lastError
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn()
        } catch (err) {
            lastError = err
            if (onRetry) onRetry(err, attempt)
            if (attempt < retries) {
                await new Promise(res => setTimeout(res, delayMs))
            }
        }
    }
    throw lastError
} 