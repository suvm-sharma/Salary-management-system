const { role } = require("../db/models");

const getRoleName = async function (role_id) {
    const role = await role.findByPk(role_id);
    return role?.name;
};

module.exports = getRoleName;
