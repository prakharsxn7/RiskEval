const prod = {
    url: {
        API_URL: "https://riskeval.onrender.com",
        PYTHON_API_URL: "https://riskeval-py.onrender.com",
    },
}
const dev = {
    url: {
        API_URL: "http://localhost:5001",
        PYTHON_API_URL: "http://localhost:8000",

    },
}
export const config = process.env.NODE_ENV === "development" ? dev : prod