/**
 * Centralized API service
 * Refactored with generic CRUD factory method
 */
const API_BASE = '/api';

class ApiService {
  /**
   * Generic request method
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} Response data
   */
  async request(url, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${url}]:`, error);
      throw error;
    }
  }

  /**
   * Generic CRUD operations factory
   * Creates CRUD methods for a given resource
   * @param {string} resource - Resource name (e.g., 'engineers', 'machines')
   * @param {string} primaryKey - Primary key field name (default: 'id')
   * @returns {Object} CRUD methods
   */
  crud(resource, primaryKey = 'id') {
    const baseUrl = `/${resource}`;

    return {
      getAll: () => this.request(baseUrl),
      
      getById: (id) => this.request(`${baseUrl}/${id}`),
      
      create: (data) => this.request(baseUrl, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      
      update: (id, data) => this.request(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
      
      delete: (id) => this.request(`${baseUrl}/${id}`, {
        method: 'DELETE',
      }),
      
      bulkDelete: (ids) => Promise.all(
        ids.map(id => this.request(`${baseUrl}/${id}`, { method: 'DELETE' }))
      ),
    };
  }

  // Engineers API
  async getEngineers() {
    return this.request('/engineers');
  }

  async createEngineer(data) {
    return this.request('/engineers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEngineer(id, data) {
    return this.request(`/engineers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEngineer(id) {
    return this.request(`/engineers/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkDeleteEngineers(ids) {
    return Promise.all(ids.map(id => this.deleteEngineer(id)));
  }

  // Machines API
  async getMachines() {
    return this.request('/machines');
  }

  async createMachine(data) {
    return this.request('/machines', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMachine(wsid, data) {
    return this.request(`/machines/${wsid}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMachine(wsid) {
    return this.request(`/machines/${wsid}`, {
      method: 'DELETE',
    });
  }

  async bulkDeleteMachines(wsids) {
    return Promise.all(wsids.map(wsid => this.deleteMachine(wsid)));
  }
}

export default new ApiService();