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

export const searchVehicles = async (
  query: string,
  transmission?: string,
  fuelType?: string,
  seats?: number | null,
  priceSort: "asc" | "desc" = "asc",
  availableCarIds: string[] = []
) => {
  try {
    const filters: string[] = ['pricePerDay:=[1..2000]']; // Base price filter

    // Log incoming parameters for debugging

    if (availableCarIds.length > 0) {
      const carIdFilter = availableCarIds.map(id => `vehicle.id:=${id}`).join(" || ");
      filters.push(`(${carIdFilter})`); // Add OR condition for available car IDs
    }


    // Add filters conditionally based on provided arguments
    if (transmission) {
      filters.push(`vehicle.transmission:=${transmission}`);
    }
    if (fuelType) {
      filters.push(`vehicle.fuelType:=${fuelType}`);
    }
    if (seats !== undefined && seats !== null) { // Check for undefined as well
      filters.push(`vehicle.numberOfSeats:=${seats}`);
    }


    const searchResults = await typesenseClient.collections("cars").documents().search({
      q: query,
      query_by: "vehicle.name,vehicle.manufacturer.name,vehicle.transmission,vehicle.fuelType",
      filter_by: filters.join(" && "), // Ensure correct formatting
      sort_by: `pricePerDay:${priceSort}`, // Sort by price
    });

    return searchResults?.hits?.map((hit: any) => hit.document) || [];
  } catch (error) {
    throw new Error("Error fetching vehicles");
  }
};
