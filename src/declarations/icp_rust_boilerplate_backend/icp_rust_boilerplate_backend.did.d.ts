import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

/**
 * Represents a car object.
 */
export interface Car {
  'id': bigint,
  'is_booked': boolean,
  'model': string,
  'updated_at': bigint | undefined,
  'owner': string,
  'make': string,
  'color': string,
  'year': number,
  'created_at': bigint,
}

/**
 * Represents the payload for updating a car.
 */
export interface CarUpdatePayload {
  'is_booked': boolean,
  'model': string,
  'owner': string,
  'make': string,
  'color': string,
  'year': number,
}

/**
 * Represents an error type.
 */
export type Error = { 'NotFound': { 'msg': string } };

/**
 * Represents a result that can contain a car object or an error.
 */
export type Result = { 'Ok': Car } | { 'Err': Error };

/**
 * Represents a result that can contain a boolean value or an error.
 */
export type BooleanResult = { 'Ok': boolean } | { 'Err': Error };

/**
 * Service interface with actor methods.
 */
export interface _SERVICE {
  'add_car': ActorMethod<[CarUpdatePayload], [] | [Car]>,
  'delete_car': ActorMethod<[bigint], Result>,
  'get_car': ActorMethod<[bigint], Result>,
  'is_booked': ActorMethod<[bigint], BooleanResult>,
  'update_car': ActorMethod<[bigint, CarUpdatePayload], Result>,
}

/**
 * Validate the CarUpdatePayload before updating a car.
 */
function validateCarUpdatePayload(payload: CarUpdatePayload): boolean {
  if (!payload.is_booked || !payload.model || !payload.owner || !payload.make || !payload.color || !payload.year) {
    throw new Error('CarUpdatePayload is missing required fields.');
  }

  // Additional validation logic can be added here as needed.

  return true;
}

/**
 * Handle errors gracefully and wrap results in a standardized format.
 */
async function handleActorMethod<ResultType>(
  method: ActorMethod<any, ResultType>,
  ...params: any[]
): Promise<ResultType> {
  try {
    const result = await method(...params);
    if ('Err' in result) {
      throw new Error(result.Err.msg);
    }
    return result.Ok;
  } catch (error) {
    throw new Error(`Error in actor method: ${error.message}`);
  }
}

// Example usage of input validation and error handling in actor methods:
_SERVICE.update_car = async (id, payload) => {
  validateCarUpdatePayload(payload);
  return handleActorMethod(_SERVICE.update_car, id, payload);
}
