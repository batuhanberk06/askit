export class ComingSoonError extends Error {
  constructor(name) {
    super(`${name} is coming soon.`);
    this.name = "ComingSoonError";
  }
}

export function comingSoonProvider(id, name) {
  return {
    id,
    name,
    status: "coming_soon",
    async deliver() {
      throw new ComingSoonError(name);
    },
  };
}
