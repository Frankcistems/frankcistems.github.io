export interface Job {
  subspecialties: string;
  status: string ;
  startDate: string;
  specialty: string;
  providerType: string;
  providerCredential: string;
  numberOfPositions: string;
  locationState: string;
  locationCity: string;
  jobUrl: string;
  jobTitle: string;
  jobid: string;
  jobDescription: string;
  jobClass: string;
  dateLastModified: string;
  dateAdded:  string;
  acceptsCompactLicense: string;
}

const enum Category {
  Electronics = 'electronics',
  Jewelery = 'jewelery',
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}

interface Rating {
  rate: number;
  count: number;
}