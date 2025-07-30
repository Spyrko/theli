export class SharedLibConfig {
  constructor(public apiUrl: string, public translationPaths: { businessHours: string, error: string, enum: string }) {
  };
}
