export const sendDataToAI = async (payload) => {
  try {
    // If payload is a string, wrap it in a message object
    const body = typeof payload === 'string' ? { message: payload } : payload;

    const response = await fetch("http://localhost:5678/webhook-test/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.details || result.error || `Server Error: ${response.statusText}`);
    }

    console.log("n8n Result via Proxy:", result);
    return result;
  } catch (error) {
    console.error("Error sending data to n8n:", error);
    throw error;
  }
};
