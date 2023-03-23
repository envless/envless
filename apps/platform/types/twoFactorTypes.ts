export interface RedisTwoFactor {
  ip: string;
  mfa?: boolean;
  isBot: boolean;
  fingerprint?: string;

  geo?: {
    country: string;
    city: string;
    region: string;
    latitude: number;
    longitude: number;
  };

  browser: {
    name: string;
    version: string;
  };

  device: {
    model: string;
    type: string;
    vendor: string;
  };

  engine: {
    name: string;
    version: string;
  };

  os: {
    name: string;
    version: string;
  };

  cpu: {
    architecture: string;
  };
}
