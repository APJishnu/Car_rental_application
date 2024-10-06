// typesenseService.ts

import Typesense from 'typesense';

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: 'e4usi1rjl26dtbacp-1.a1.typesense.net',
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: 'tiRPshalhWslNmaZA3WZVQgw2VJbxWiX',
  connectionTimeoutSeconds: 2,
});

export const searchVehicles = async (query: string) => {
  try {
    const searchResults = await typesenseClient
      .collections('cars')
      .documents()
      .search({
        q: query,
        query_by: 'vehicle.name,vehicle.manufacturer.name,vehicle.transmission,vehicle.fuelType',
        filter_by: 'pricePerDay:=[1..1000]',
        sort_by: 'pricePerDay:asc',
      });

    return searchResults?.hits?.map((hit: any) => hit.document) || [];
  } catch (error) {
    console.error("Typesense search error:", error);
    throw new Error('Search failed.');
  }
};
