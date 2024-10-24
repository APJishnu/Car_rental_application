// src/graphql/helpers/RentableVehicleHelper.js

import RentableVehicleRepository from '../repositories/rentable-vehicle-repo.js';

class RentableVehicleHelperUser {
 
  static async getRentableVehicleById(id) {
    const rentableVehicle = await RentableVehicleRepository.RentableVehicleFindById(id);
    return rentableVehicle;
  }
  static async getAllRentableVehicles() {
    const rentableVehicle = await RentableVehicleRepository.findAllRentable();
    return rentableVehicle;
  }
}

export default RentableVehicleHelperUser;
