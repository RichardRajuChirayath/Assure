import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { z } from 'zod';

const server: FastifyInstance = Fastify({
    logger: true,
});

// Register Plugins
server.register(cors, {
    origin: '*', // For development, update later
});

server.register(jwt, {
    secret: process.env.JWT_SECRET || 'assure-secret-development-key-12345',
});

// Register Plugins
import authPlugin from './plugins/auth.js';
server.register(authPlugin);

// Import and Register Routes
import riskRoutes from './routes/risk.js';
import policyRoutes from './routes/policy.js';

// Apply Auth to specific routes
server.register(async (instance) => {
    // instance.addHook('preHandler', instance.authenticate); // Unleash this for prod
    instance.register(riskRoutes, { prefix: '/risk' });
    instance.register(policyRoutes, { prefix: '/policy' });
}, { prefix: '/v2' });

// Basic Health Check
server.get('/health', async () => {
    return { status: 'ok', service: 'Assure Backend', version: '2.0.0-alpha' };
});

// Start Server
const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3001');
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Assure Backend (Phase 2) running at http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
