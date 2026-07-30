class AppRegistry {
  instance: AppRegistry | null;
  instances: Map<string, any>;
  constructor() {
    this.instance = null;
    this.instances = new Map();
  }

  register(name: string, instance: any) {
    if (this.instances.has(name)) {
      throw new Error(`Instance with name ${name} already exists`);
    }
    this.instances.set(name, instance);
  }

  get(name: string) {
    if (!this.instances.has(name)) {
      throw new Error(`Instance with name ${name} does not exist`);
    }
    return this.instances.get(name);
  }
}

const appRegistry = new AppRegistry();

export default appRegistry;
