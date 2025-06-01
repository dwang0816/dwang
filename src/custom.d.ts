declare module "*.jsx" {
  import * as React from "react";
  const component: React.ComponentType<any>;
  export default component;
} 