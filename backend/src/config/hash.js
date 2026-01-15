import bcrypt from 'bcrypt'
const saltRounds = 10;

const hashSync = async (data) => {
    return await bcrypt.hashSync(data, saltRounds);
}

const compareSync = async (data, hash) => {
    return await bcrypt.compareSync(data, hash);
}

export {
    hashSync,
    compareSync
}