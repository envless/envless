export interface RedisTwoFactor {
  fingerprint: string;
  twoFactor: {
    enabled: boolean;
    verified: string;
  };
  geo: {
    country: string;
    city: string;
    region: string;
  };
}
