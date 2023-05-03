import { withSwagger } from "next-swagger-doc";

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Envless CLI API",
      version: "1.0.0",
    },
  },
  apiFolder: "pages/api/cli",
});

export default swaggerHandler();
