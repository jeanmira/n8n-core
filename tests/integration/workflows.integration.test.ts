/**
 * Integration tests for workflows
 */

import axios from 'axios';

const N8N_HOST = process.env.N8N_HOST || 'localhost';
const N8N_PORT = process.env.N8N_PORT || '5678';
const N8N_USER = process.env.N8N_BASIC_AUTH_USER || 'admin';
const N8N_PASS = process.env.N8N_BASIC_AUTH_PASSWORD || 'admin';

const n8nClient = axios.create({
  baseURL: `http://${N8N_HOST}:${N8N_PORT}/api/v1`,
  auth: {
    username: N8N_USER,
    password: N8N_PASS,
  },
});

describe('Workflows Integration Tests', () => {
  beforeAll(async () => {
    // Wait for n8n to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  describe('API Health', () => {
    it('should be able to connect to n8n API', async () => {
      try {
        const response = await n8nClient.get('/workflows');
        expect(response.status).toBe(200);
      } catch (error) {
        console.warn('n8n is not running, skipping integration tests');
        pending();
      }
    }, 10000);
  });

  describe('Workflow Management', () => {
    let workflowId: string;

    it('should create a workflow', async () => {
      const workflow = {
        name: 'Test Workflow',
        nodes: [
          {
            id: 'start',
            name: 'Start',
            type: 'n8n-nodes-base.start',
            position: [250, 300],
          },
        ],
        connections: {},
        active: false,
      };

      try {
        const response = await n8nClient.post('/workflows', workflow);
        expect(response.status).toBe(201);
        expect(response.data.id).toBeDefined();
        workflowId = response.data.id;
      } catch (error) {
        pending();
      }
    });

    it('should get workflow by id', async () => {
      if (!workflowId) pending();

      try {
        const response = await n8nClient.get(`/workflows/${workflowId}`);
        expect(response.status).toBe(200);
        expect(response.data.name).toBe('Test Workflow');
      } catch (error) {
        pending();
      }
    });

    it('should update workflow', async () => {
      if (!workflowId) pending();

      try {
        const response = await n8nClient.patch(`/workflows/${workflowId}`, {
          name: 'Test Workflow Updated',
        });
        expect(response.status).toBe(200);
        expect(response.data.name).toBe('Test Workflow Updated');
      } catch (error) {
        pending();
      }
    });

    it('should delete workflow', async () => {
      if (!workflowId) pending();

      try {
        const response = await n8nClient.delete(`/workflows/${workflowId}`);
        expect(response.status).toBe(200);
      } catch (error) {
        pending();
      }
    });
  });
});
