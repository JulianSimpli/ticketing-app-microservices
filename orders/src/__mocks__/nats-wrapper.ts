export const natsClient = {
    client: {
        jetstreamManager: async () => ({
            streams: {
                info: async () => ({}), // simula que el stream existe
            },
        }),
        jetstream: jest.fn().mockReturnValue({
            publish: jest.fn().mockResolvedValue({ seq: 1 })
        })
    },
}