const API_BASE_URL = 'http://localhost:8000';

export const riskPredictionService = {
    async predictRisk(features) {
        try {
            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ features }),
            });

            if (!response.ok) {
                throw new Error('Prediction failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error predicting risk:', error);
            throw error;
        }
    },

    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
}; 