// src/graphql/helpers/RentableVehicleHelper.js

import RentableVehicleRepository from '../repositories/rentable-vehicle-repo.js';

class RentableVehicleHelper {
 
  static async getRentableVehicleById(id) {
    const rentableVehicle = await RentableVehicleRepository.RentableVehicleFindById(id);
    return rentableVehicle;
  }
}

export default RentableVehicleHelper;
