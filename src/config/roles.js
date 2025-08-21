const permissions = {
    employee: [
        "authLogin",
        "authLogout",
        "markAttendance",
        "selfGetProfile",
        "selfGetSalary",
    ],
    admin: [
        "authLogin",
        "authLogout",
        "manageEmployees",
        "getEmployees",
        "calculateSalary",
        "getSalaryDetails",
        "distributePayroll",
        "getPayrollHistory",
        "manageRoles",
    ],
    hr: [
        "authLogin",
        "authLogout",
        "manageEmployees",
        "getEmployees",
        "calculateSalary",
        "getSalaryDetails",
        "distributePayroll",
        "getPayrollHistory",
    ],
};

const roles = Object.keys(permissions);
const roleRights = new Map(Object.entries(permissions));

module.exports = {
    roles,
    roleRights,
};
