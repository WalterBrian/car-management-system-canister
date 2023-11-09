/**
 * IDL Factory for the Car Service
 *
 * This IDL factory defines the service and types for a Car Service, which can be used
 * in the Internet Computer (IC) environment.
 *
 * @param {object} { IDL } - An object containing IDL namespace.
 * @returns {object} - An IDL service definition.
 */
export const idlFactory = ({ IDL }) => {
  // Define a record type representing the payload for a car.
  const CarPayload = IDL.Record({
    'is_booked': IDL.Bool,   // Indicates whether the car is booked.
    'model': IDL.Text,      // The car's model name.
    'owner': IDL.Text,      // The owner of the car.
    'make': IDL.Text,       // The car's make (brand).
    'color': IDL.Text,      // The car's color.
    'year': IDL.Nat32,      // The manufacturing year of the car.
  });

  // Define a record type representing a car object.
  const Car = IDL.Record({
    'id': IDL.Nat64,            // Unique identifier for the car.
    'is_booked': IDL.Bool,       // Indicates whether the car is booked.
    'model': IDL.Text,          // The car's model name.
    'updated_at': IDL.Opt(IDL.Nat64), // Optional field for update timestamp.
    'owner': IDL.Text,          // The owner of the car.
    'make': IDL.Text,           // The car's make (brand).
    'color': IDL.Text,          // The car's color.
    'year': IDL.Nat32,          // The manufacturing year of the car.
    'created_at': IDL.Nat64,    // Timestamp when the car was created.
  });

  // Define an error variant with error code and message for more detailed error handling.
  const Error = IDL.Variant({
    'NotFound': IDL.Record({
      'code': IDL.Nat32,  // Error code indicating 'not found.'
      'msg': IDL.Text,    // Error message providing more details.
    }),
  });

  // Define a result variant that can contain a car object or an error.
  const Result = IDL.Variant({ 'Ok': Car, 'Err': Error });

  // Define another result variant that can contain a boolean value or an error.
  const Result_1 = IDL.Variant({ 'Ok': IDL.Bool, 'Err': Error });

  // Define the service with actor methods.
  return IDL.Service({
    /**
     * Adds a new car to the system.
     *
     * @param {CarPayload} payload - Data of the car to be added.
     * @returns {Car | null} - The added car or null in case of an error.
     */
    'add_car': IDL.Func([CarPayload], [IDL.Opt(Car)], []),

    /**
     * Deletes a car by its unique ID.
     *
     * @param {bigint} id - The unique identifier of the car to be deleted.
     * @returns {Result} - Contains either the deleted car or an error.
     */
    'delete_car': IDL.Func([IDL.Nat64], [Result], []),

    /**
     * Retrieves a car by its unique ID (query method).
     *
     * @param {bigint} id - The unique identifier of the car to be retrieved.
     * @returns {Result} - Contains either the retrieved car or an error.
     */
    'get_car': IDL.Func([IDL.Nat64], [Result], ['query']),

    /**
     * Checks if a car is booked (query method).
     *
     * @param {bigint} id - The unique identifier of the car to be checked.
     * @returns {Result_1} - Contains either a boolean value or an error.
     */
    'is_booked': IDL.Func([IDL.Nat64], [Result_1], ['query']),

    /**
     * Updates car data.
     *
     * @param {bigint} id - The unique identifier of the car to be updated.
     * @param {CarPayload} payload - New data for the car.
     * @returns {Result} - Contains either the updated car or an error.
     */
    'update_car': IDL.Func([IDL.Nat64, CarPayload], [Result], []),
  });
};
