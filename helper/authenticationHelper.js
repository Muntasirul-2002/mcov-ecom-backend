import bcrypt from 'bcrypt'

export const hashPassword = async (password)=>{
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        return hashedPassword
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async (password, hashPassword) => {
    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (error) {
      console.error(error);
      return false;
    }
  };