export interface Schema {
  /**
   * The name of the spec.
   */
  name: string;
  /**
   * The type to create the spec for.
   */
  type?: string;
  /**
   * The path to create the spec.
   */
  path?: string;
  /**
   * The name of the project.
   */
  project?: string;
  /**
   * Whether to force
   */
  ignoreTargetNotFound?: boolean;
}
