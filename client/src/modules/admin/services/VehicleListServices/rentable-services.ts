import { useMutation, useQuery } from "@apollo/client";
import { GET_VEHICLES, DELETE_VEHICLE, ADD_RENTABLE } from "@/graphql/admin/vehicle-list";
import { GetVehiclesData, DeleteVehicleData, AddRentableData, RentableInput } from "@/interfaces/admin-interfaces/vehicle-types";
import Swal from "sweetalert2";

export const useVehicleService = () => {
  const { loading, error, data, refetch } = useQuery<GetVehiclesData>(GET_VEHICLES);

  const [deleteVehicle] = useMutation<DeleteVehicleData>(DELETE_VEHICLE, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      Swal.fire("Error!", err.message, "error");
    },
  });

  const [addRentable] = useMutation<AddRentableData>(ADD_RENTABLE, {
    onCompleted: () => {
      Swal.fire("Success!", "Vehicle added to rentable list.", "success");
      refetch();
    },
    onError: (err) => {
      Swal.fire("Error!", err.message, "error");
    },
  });

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      await deleteVehicle({ variables: { id } });
      Swal.fire("Deleted!", "Your vehicle has been deleted.", "success");
    }
  };

  const handleAddRentable = async (input: RentableInput) => {
    try {
      const response = await addRentable({
        variables: input,
      });

      if (response.data?.addRentable) {
      } else {
        Swal.fire("Error!", "Rentable data is undefined.", "error");
      }
    } catch (err: any) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  return {
    loading,
    error,
    vehicles: data?.getVehicles || [],
    refetch,
    handleDelete,
    handleAddRentable,
  };
};
