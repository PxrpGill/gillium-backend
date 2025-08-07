import { projectRoutes } from "./project-routes";
import { taskColumnRoutes } from "./task-column-controller";
import { taskRoutes } from "./task-routes";
import { taskStatusRoutes } from "./task-statuses-routes";
import { userRoutes } from "./user-routes";

const AppRoutes = {
  projectRoutes,
  userRoutes,
  taskRoutes,
  taskColumnRoutes,
  taskStatusRoutes,
};

export default AppRoutes;
