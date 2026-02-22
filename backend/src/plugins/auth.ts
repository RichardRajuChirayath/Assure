import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

/**
 * Assure Auth Plugin
 * In Phase 2, we verify Clerk JWTs.
 * For CLI/CI/CD, this would eventually support API Keys, 
 * but for this demo, we use the Dashboard's session token.
 */
export default fp(async function (fastify: FastifyInstance) {
    fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: any;
    }
}
