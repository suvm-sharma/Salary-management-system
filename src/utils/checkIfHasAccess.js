import { ApiError } from "../errors";
import httpStatus from "http-status";

const checkIfHasAccess = (item, user) => {
    if (
        user.isSuperAdmin ||
        user.restaurant.toString() === item.restaurant.toString()
    ) {
        return true;
    } else {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "Don't have appropriate permissions"
        );
    }
};

export default checkIfHasAccess;
