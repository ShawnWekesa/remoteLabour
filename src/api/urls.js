export default {
  apiPrefix: "/api/v1",
  swagger: {
    path: "/api/docs",
    spec: "openapi.json",
  },
  auth: {
    path: "/auth",
    login: "/login",
    logout: "/logout",
    changePassword: "/password",
    register: "/register",
  },
  candidate: {
    path: "/candidate",
  },
  employer: {
    path: "/employer",
  },
  job: {
    path: "/job",
  },
  rating: {
    path: "/rating",
  },
  application: {
    path: "/application",
  },
};
